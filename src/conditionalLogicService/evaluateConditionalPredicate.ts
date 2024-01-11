import { FormTypes, ConditionTypes } from '@oneblink/types'
import { FormElementsCtrl } from '../types'
import { typeCastService, formElementsService } from '..'
import evaluateConditionalOptionsPredicate from './evaluateConditionalOptionsPredicate'
import { conditionallyShowByPredicate } from './conditionallyShowElement'

const fnMap = {
  '>': (lhs: number, rhs: number) => lhs > rhs,
  '>=': (lhs: number, rhs: number) => lhs >= rhs,
  '===': (lhs: number, rhs: number) => lhs === rhs,
  '!==': (lhs: number, rhs: number) => lhs !== rhs,
  '<=': (lhs: number, rhs: number) => lhs <= rhs,
  '<': (lhs: number, rhs: number) => lhs < rhs,
}

function getElementAndValue(
  formElementsCtrl: FormElementsCtrl,
  elementId: string,
): { formElementWithName?: FormTypes.FormElementWithName; value?: unknown } {
  const formElement = formElementsCtrl.flattenedElements.find(
    (formElement) => formElement.id === elementId,
  )
  if (formElement) {
    const formElementWithName =
      typeCastService.formElements.toNamedElement(formElement)
    if (formElementWithName) {
      return {
        formElementWithName,
        value: formElementsCtrl.model[formElementWithName.name],
      }
    }
  } else if (formElementsCtrl.parentFormElementsCtrl) {
    return getElementAndValue(
      formElementsCtrl.parentFormElementsCtrl,
      elementId,
    )
  }
  return {}
}

export default function evaluateConditionalPredicate({
  predicate,
  formElementsCtrl,
}: {
  predicate: ConditionTypes.ConditionalPredicate
  formElementsCtrl: FormElementsCtrl
}): FormTypes.FormElementWithName | undefined {
  const { formElementWithName: predicateElement, value: predicateValue } =
    getElementAndValue(formElementsCtrl, predicate.elementId)
  if (!predicateElement) {
    return
  }
  switch (predicate.type) {
    case 'VALUE': {
      return !predicate.hasValue === !predicateValue
        ? predicateElement
        : undefined
    }
    case 'NUMERIC': {
      // if the operator fn doesn't exist, hide the control
      const operatorFn = fnMap[predicate.operator]
      if (!operatorFn) return undefined

      const lhs = Number.parseFloat(predicateValue as string)
      // if left is not a number, hide the control
      if (isNaN(lhs)) return undefined

      let rhsValue = NaN
      switch (predicate.compareWith) {
        case 'ELEMENT': {
          const { value: comparisonValue } = getElementAndValue(
            formElementsCtrl,
            predicate.value,
          )
          rhsValue =
            comparisonValue === 'string'
              ? Number.parseFloat(comparisonValue)
              : (comparisonValue as number)
          break
        }
        case 'VALUE':
        default: {
          rhsValue = predicate.value
          break
        }
      }

      const rhs =
        typeof rhsValue === 'string' ? Number.parseFloat(rhsValue) : rhsValue

      // if right is not a number, hide the control
      if (isNaN(rhs)) return undefined

      return operatorFn(lhs, rhs) ? predicateElement : undefined
    }
    case 'BETWEEN': {
      const value = Number.parseFloat(predicateValue as string)
      if (Number.isNaN(value)) {
        return undefined
      }

      return value >= predicate.min && value <= predicate.max
        ? predicateElement
        : undefined
    }
    case 'REPEATABLESET': {
      const {
        formElementWithName: repeatableSetElement,
        value: repeatableSetValue,
      } = getElementAndValue(formElementsCtrl, predicate.elementId)

      if (!repeatableSetElement) {
        return
      }

      if (
        repeatableSetElement.type !== 'repeatableSet' ||
        !Array.isArray(repeatableSetValue)
      ) {
        return
      }

      for (const entry of repeatableSetValue) {
        const result = conditionallyShowByPredicate(
          {
            model: entry,
            flattenedElements: formElementsService.flattenFormElements(
              repeatableSetElement.elements,
            ),
            parentFormElementsCtrl: formElementsCtrl,
          },
          predicate.repeatableSetPredicate,
          [],
        )

        if (result) {
          return predicateElement
        }
      }
      return
    }
    case 'OPTIONS':
    default: {
      const optionsPredicateElement =
        typeCastService.formElements.toOptionsElement(predicateElement)
      if (!optionsPredicateElement) {
        return undefined
      }

      // If the predicate element does not have any options to evaluate,
      // we will show the element.
      // Unless the predicate element has dynamic options and
      // options have not been fetched yet.
      if (!Array.isArray(optionsPredicateElement.options)) {
        return optionsPredicateElement.optionsType !== 'DYNAMIC'
          ? predicateElement
          : undefined
      } else {
        return evaluateConditionalOptionsPredicate({
          predicate,
          predicateValue,
          predicateElement: optionsPredicateElement,
        })
          ? predicateElement
          : undefined
      }
    }
  }
}
