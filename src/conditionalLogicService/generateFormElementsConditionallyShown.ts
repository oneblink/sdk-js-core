import { FormTypes } from '@oneblink/types'
import {
  FormElementsCtrl,
  FormElementsConditionallyShown,
  FormElementConditionallyShown,
} from '../types'
import { flattenFormElements } from '../formElementsService'
import conditionallyShowElement from './conditionallyShowElement'
import conditionallyShowOption from './conditionallyShowOption'

type ErrorCallback = (error: Error) => void

const handleConditionallyShowElement = (
  formElementsCtrl: FormElementsCtrl,
  element: FormTypes.FormElement,
  errorCallback?: ErrorCallback,
) => {
  try {
    return conditionallyShowElement(formElementsCtrl, element, [])
  } catch (error) {
    console.warn('Error while checking if element is conditional shown', error)
    errorCallback && errorCallback(error as Error)
    return false
  }
}

const handleConditionallyShowOption = (
  formElementsCtrl: FormElementsCtrl,
  element: FormTypes.FormElementWithOptions,
  option: FormTypes.ChoiceElementOption,
  errorCallback?: ErrorCallback,
) => {
  try {
    return conditionallyShowOption(formElementsCtrl, element, option, [])
  } catch (error) {
    errorCallback && errorCallback(error as Error)
    return false
  }
}

const generateFormElementsConditionallyShown = ({
  formElements,
  submission,
  parentFormElementsCtrl,
  errorCallback,
}: {
  formElements: FormTypes.FormElement[]
  submission: Record<string, unknown>
  parentFormElementsCtrl: FormElementsCtrl['parentFormElementsCtrl']
  errorCallback?: ErrorCallback
}): FormElementsConditionallyShown => {
  const formElementsCtrl = {
    flattenedElements: flattenFormElements(formElements),
    model: submission,
    parentFormElementsCtrl,
  }
  return formElementsCtrl.flattenedElements.reduce<FormElementsConditionallyShown>(
    (formElementsConditionallyShown, element) => {
      switch (element.type) {
        case 'section':
        case 'page': {
          const formElementConditionallyShown =
            formElementsConditionallyShown[element.id]
          const isHidden = formElementConditionallyShown
            ? formElementConditionallyShown.isHidden
            : !handleConditionallyShowElement(
                formElementsCtrl,
                element,
                errorCallback,
              )

          formElementsConditionallyShown[element.id] = {
            type: 'formElement',
            isHidden,
          }

          // If the parent element is hidden, hide all the child elements
          if (isHidden) {
            element.elements.forEach((childElement) => {
              switch (childElement.type) {
                case 'section':
                case 'page': {
                  formElementsConditionallyShown[childElement.id] = {
                    type: 'formElement',
                    isHidden: true,
                  }
                  break
                }
                default: {
                  formElementsConditionallyShown[childElement.name] = {
                    type: 'formElement',
                    isHidden: true,
                  }
                }
              }
            })
          }
          break
        }
        case 'infoPage':
        case 'form': {
          if (formElementsConditionallyShown[element.name]) {
            break
          }
          const nestedModel = submission[element.name] as
            | Record<string, unknown>
            | undefined
          formElementsConditionallyShown[element.name] = {
            type: 'formElements',
            isHidden: !handleConditionallyShowElement(
              formElementsCtrl,
              element,
              errorCallback,
            ),
            formElements: generateFormElementsConditionallyShown({
              formElements: element.elements || [],
              submission: nestedModel || {},
              parentFormElementsCtrl: formElementsCtrl,
            }),
          }
          break
        }
        case 'repeatableSet': {
          if (formElementsConditionallyShown[element.name]) {
            break
          }
          const entries = formElementsCtrl.model[element.name] as
            | Array<Record<string, unknown>>
            | undefined
          formElementsConditionallyShown[element.name] = {
            type: 'repeatableSet',
            isHidden: !handleConditionallyShowElement(
              formElementsCtrl,
              element,
              errorCallback,
            ),
            entries: (entries || []).reduce(
              (
                result: Record<
                  string,
                  FormElementsConditionallyShown | undefined
                >,
                entry,
                index,
              ) => {
                result[index.toString()] =
                  generateFormElementsConditionallyShown({
                    formElements: element.elements,
                    submission: entry,
                    parentFormElementsCtrl: formElementsCtrl,
                  })
                return result
              },
              {},
            ),
          }
          break
        }
        default: {
          if (formElementsConditionallyShown[element.name]) {
            break
          }
          const formElementConditionallyShown: FormElementConditionallyShown = {
            type: 'formElement',
            isHidden: !handleConditionallyShowElement(
              formElementsCtrl,
              element,
              errorCallback,
            ),
          }

          if (!formElementConditionallyShown.isHidden) {
            switch (element.type) {
              case 'compliance':
              case 'autocomplete':
              case 'radio':
              case 'checkboxes':
              case 'select': {
                if (
                  element.conditionallyShowOptions &&
                  Array.isArray(element.options)
                ) {
                  formElementConditionallyShown.options =
                    element.options.filter((option) =>
                      handleConditionallyShowOption(
                        formElementsCtrl,
                        element,
                        option,
                        errorCallback,
                      ),
                    )
                }
                break
              }
            }
          }

          formElementsConditionallyShown[element.name] =
            formElementConditionallyShown
        }
      }

      return formElementsConditionallyShown
    },
    {},
  )
}

export default generateFormElementsConditionallyShown
