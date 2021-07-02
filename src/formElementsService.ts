import { FormTypes } from '@oneblink/types'

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

function forEachFormElementWithOptions(
  elements: FormTypes.FormElement[],
  forEach: (
    elementWithOptions: FormTypes.FormElementWithOptions,
    elements: FormTypes.FormElement[],
  ) => void,
): void {
  findFormElement(elements, (formElement, parentElements) => {
    if (
      formElement.type === 'select' ||
      formElement.type === 'autocomplete' ||
      formElement.type === 'checkboxes' ||
      formElement.type === 'radio' ||
      formElement.type === 'compliance'
    ) {
      forEach(formElement, parentElements)
    }
    return false
  })
}

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

export {
  forEachFormElement,
  forEachFormElementWithOptions,
  findFormElement,
  parseFormElementOptionsSet,
}
