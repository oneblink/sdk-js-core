import { FormTypes, ConditionTypes } from '@oneblink/types'
import { formElements } from '../typeCastService'
import { FormElementsCtrl } from '../types'
import evaluateConditionalOptionsPredicate from './evaluateConditionalOptionsPredicate'

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
    const formElementWithName = formElements.toNamedElement(formElement)
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
    case 'OPTIONS':
    default: {
      if (
        predicateElement.type !== 'select' &&
        predicateElement.type !== 'autocomplete' &&
        predicateElement.type !== 'radio' &&
        predicateElement.type !== 'checkboxes' &&
        predicateElement.type !== 'compliance'
      ) {
        return undefined
      }

      // If the predicate element does not have any options to evaluate,
      // we will show the element.
      // Unless the predicate element has dynamic options and
      // options have not been fetched yet.
      if (!Array.isArray(predicateElement.options)) {
        return predicateElement.optionsType !== 'DYNAMIC'
          ? predicateElement
          : undefined
      } else {
        return evaluateConditionalOptionsPredicate({
          predicate,
          predicateValue,
          predicateElement,
        })
          ? predicateElement
          : undefined
      }
    }
  }
}