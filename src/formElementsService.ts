import { FormTypes } from '@oneblink/types'
import { typeCastService } from '.'

/**
 * Iterate over all form elements, also iterating over nested form element (e.g.
 * page elements).
 *
 * #### Example
 *
 * ```js
 * formElementsService.forEachFormElement(form.elements, (formElement) => {
 *   // do something with formElement
 * })
 * ```
 *
 * @param elements The form elements to iterate over
 * @param forEach Function to execute on each form element
 */
function forEachFormElement(
  elements: FormTypes.FormElement[],
  forEach: (
    element: FormTypes.FormElement,
    elements: FormTypes.FormElement[],
  ) => void,
): void {
  findFormElement(elements, (formElement, parentElements) => {
    forEach(formElement, parentElements)
    return false
  })
}

/**
 * Iterate over all form elements that have options (e.g. `'select'` type
 * elements), also iterating over nested form element (e.g. page elements).
 *
 * #### Example
 *
 * ```js
 * formElementsService.forEachFormElementWithOptions(
 *   form.elements,
 *   (formElementWithOptions) => {
 *     // do something with formElementWithOptions
 *   },
 * )
 * ```
 *
 * @param elements The form elements to iterate over
 * @param forEach Function to execute on each form element with options
 */
function forEachFormElementWithOptions(
  elements: FormTypes.FormElement[],
  forEach: (
    elementWithOptions: FormTypes.FormElementWithOptions,
    elements: FormTypes.FormElement[],
  ) => void,
): void {
  findFormElement(elements, (formElement, parentElements) => {
    const optionsFormElement =
      typeCastService.formElements.toOptionsElement(formElement)
    if (optionsFormElement) {
      forEach(optionsFormElement, parentElements)
    }
    return false
  })
}

/**
 * Iterate over all form elements and return an element that matches a
 * predicate, also iterating over nested form element (e.g. page elements). Will
 * return `undefined` if no matching element is found.
 *
 * #### Example
 *
 * ```js
 * const formElement = formElementsService.findFormElement(
 *   form.elements,
 *   (formElement) => {
 *     return formElement.id === '123-abc'
 *   },
 * )
 * ```
 *
 * @param elements The form elements to iterate over
 * @param predicate Predicate function to execute on each form element
 * @param parentElements
 * @returns
 */
function findFormElement(
  elements: FormTypes.FormElement[],
  predicate: (
    element: FormTypes.FormElement,
    elements: FormTypes.FormElement[],
  ) => boolean,
  parentElements: FormTypes.FormElement[] = [],
): FormTypes.FormElement | void {
  for (const element of elements) {
    if (predicate(element, parentElements)) {
      return element
    }

    if (
      (element.type === 'repeatableSet' ||
        element.type === 'page' ||
        element.type === 'form' ||
        element.type === 'infoPage' ||
        element.type === 'section') &&
      Array.isArray(element.elements)
    ) {
      const nestedElement = findFormElement(element.elements, predicate, [
        ...parentElements,
        element,
      ])

      if (nestedElement) {
        return nestedElement
      }
    }
  }
}

/**
 * Parse unknown data as valid options for a forms element. This will always
 * return an Array of valid options.
 *
 * #### Example
 *
 * ```js
 * const options = formElementsService.parseFormElementOptionsSet(data)
 * // "options" are valid for a form element
 * ```
 *
 * @param data
 * @returns
 */
function parseFormElementOptionsSet(
  data: unknown,
): FormTypes.ChoiceElementOption[] {
  if (!Array.isArray(data)) {
    return []
  }
  return data.reduce(
    (
      options: FormTypes.ChoiceElementOption[],
      record: unknown,
      index: number,
    ) => {
      if (typeof record === 'string') {
        options.push({
          id: index.toString(),
          value: record,
          label: record,
        })
      } else if (typeof record === 'object') {
        const option = record as Record<string, unknown>
        const value =
          typeof option.value === 'string' && option.value
            ? option.value
            : index.toString()
        const id =
          typeof option.id === 'string' && option.id ? option.id : value
        const label =
          typeof option.label === 'string' && option.label
            ? option.label
            : value
        const colour =
          typeof option.colour === 'string' && option.colour
            ? option.colour
            : undefined
        options.push({
          ...option,
          id,
          value,
          label,
          colour,
        })
      }
      return options
    },
    [],
  )
}

/**
 * Takes the nested definition structure and returns all form elements as 1d
 * array.
 *
 * #### Example
 *
 * ```js
 * const flattenedElements = formElementsService.flattenFormElements(
 *   form.elements,
 * )
 * ```
 *
 * @param elements
 * @returns
 */
function flattenFormElements(
  elements: FormTypes.FormElement[],
): FormTypes.FormElement[] {
  return elements.reduce<FormTypes.FormElement[]>(
    (flattenedElements, element) => {
      flattenedElements.push(element)
      switch (element.type) {
        case 'section':
        case 'page': {
          flattenedElements.push(...flattenFormElements(element.elements))
        }
      }
      return flattenedElements
    },
    [],
  )
}

/**
 * The regex used for matching `{ELEMENT:<elementName>}` tags in the OneBlink
 * platform.
 */
const ElementWYSIWYGRegex = /({ELEMENT:)([^}]+)(})/g

/**
 * Takes a string and calls a provided handler function for each found instance
 * of `{ELEMENT:<elementName>}` in the string. Used to replace values in
 * OneBlink calculation and info (HTML) elements.
 *
 * #### Example
 *
 * ```js
 * formElementsService.matchElementsTagRegex(
 *   myString,
 *   ({ elementName, elementMatch }) => {
 *     const v = submission[elementName]
 *     myString = myString.replace(elementMatch, v)
 *   },
 * )
 * ```
 *
 * @param data
 * @param handler
 * @returns
 */
const matchElementsTagRegex = (
  data: string,
  matchHandler: (options: {
    elementName: string
    elementMatch: string
  }) => void,
) => {
  let matches
  while ((matches = ElementWYSIWYGRegex.exec(data)) !== null) {
    if (matches?.length < 3) continue

    const elementName = matches[2]
    matchHandler({ elementName, elementMatch: matches[0] })
  }
}

export {
  forEachFormElement,
  forEachFormElementWithOptions,
  findFormElement,
  parseFormElementOptionsSet,
  flattenFormElements,
  ElementWYSIWYGRegex,
  matchElementsTagRegex,
}
