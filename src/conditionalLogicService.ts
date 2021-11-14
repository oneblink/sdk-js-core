import { FormTypes, ConditionTypes, SubmissionTypes } from '@oneblink/types'

const fnMap = {
  '>': (lhs: number, rhs: number) => lhs > rhs,
  '>=': (lhs: number, rhs: number) => lhs >= rhs,
  '===': (lhs: number, rhs: number) => lhs === rhs,
  '!==': (lhs: number, rhs: number) => lhs !== rhs,
  '<=': (lhs: number, rhs: number) => lhs <= rhs,
  '<': (lhs: number, rhs: number) => lhs < rhs,
}

function evaluateConditionalOptionsPredicate({
  predicate,
  predicateElement,
  submission,
}: {
  predicate: ConditionTypes.ConditionalPredicateOptions
  submission: SubmissionTypes.S3SubmissionData['submission']
  predicateElement: FormTypes.FormElementWithOptions
}): boolean {
  return predicate.optionIds.some((optionId) => {
    const option = predicateElement.options?.find((o) => o.id === optionId)
    if (option) {
      const value = submission[predicateElement.name]
      if (Array.isArray(value)) {
        return value.some((modelValue) => {
          return modelValue === option.value
        })
      } else if (predicateElement.type === 'compliance' && value) {
        return option.value === (value as { value: unknown }).value
      } else {
        return option.value === value
      }
    } else {
      return false
    }
  })
}

function evaluateConditionalPredicate({
  predicate,
  predicateElement,
  submission,
}: {
  predicate: ConditionTypes.ConditionalPredicate
  predicateElement: FormTypes.FormElement
  submission: SubmissionTypes.S3SubmissionData['submission']
}): boolean {
  if (
    !predicateElement ||
    predicateElement.type === 'page' ||
    predicateElement.type === 'section'
  ) {
    return false
  }
  switch (predicate.type) {
    case 'VALUE': {
      return !predicate.hasValue === !submission[predicateElement.name]
    }
    case 'NUMERIC': {
      const lhs = Number.parseFloat(submission[predicateElement.name] as string)
      const rhs =
        typeof predicate.value === 'string'
          ? Number.parseFloat(predicate.value)
          : predicate.value

      // if either of the values is not a number or the operator fn doesn't exist, hide the control
      const operatorFn = fnMap[predicate.operator]
      if (!operatorFn || Number.isNaN(lhs) || Number.isNaN(rhs)) return false

      return operatorFn(lhs, rhs)
    }
    case 'BETWEEN': {
      const value = Number.parseFloat(
        submission[predicateElement.name] as string,
      )
      if (Number.isNaN(value)) {
        return false
      }

      return value >= predicate.min && value <= predicate.max
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
        return false
      }

      // If the predicate element does not have any options to evaluate,
      // we will show the element.
      // Unless the predicate element has dynamic options and
      // options have not been fetched yet.
      if (!Array.isArray(predicateElement.options)) {
        return predicateElement.optionsType !== 'DYNAMIC'
      } else {
        return evaluateConditionalOptionsPredicate({
          predicate,
          submission,
          predicateElement,
        })
      }
    }
  }
}

const getPredicateElement = (
  elements: Array<FormTypes.FormElement>,
  elementId: string,
): FormTypes.FormElement | void => {
  for (const element of elements) {
    if (element.type === 'page' || element.type === 'section') {
      const predicateElement = getPredicateElement(element.elements, elementId)
      if (predicateElement) {
        return predicateElement
      }
    } else if (element.id === elementId) {
      return element
    }
  }
}

function evaluateConditionalPredicates({
  isConditional,
  requiresAllConditionalPredicates,
  conditionalPredicates,
  formElements,
  submission,
}: {
  isConditional: boolean
  requiresAllConditionalPredicates: boolean
  conditionalPredicates: ConditionTypes.ConditionalPredicate[]
  formElements: FormTypes.FormElement[]
  submission: SubmissionTypes.S3SubmissionData['submission']
}): boolean {
  if (!isConditional || !conditionalPredicates.length) {
    return true
  }

  const predicateResults = []
  for (const predicate of conditionalPredicates) {
    const predicateElement = getPredicateElement(
      formElements,
      predicate.elementId,
    )
    if (!predicateElement) {
      throw new Error(
        'Could not find element referenced in execution condition',
      )
    }

    const predicateIsSatisfied = evaluateConditionalPredicate({
      predicate,
      predicateElement,
      submission,
    })
    predicateResults.push(predicateIsSatisfied)
    if (requiresAllConditionalPredicates) {
      if (!predicateIsSatisfied) break
    } else {
      // Doesn't require all predicates
      if (predicateIsSatisfied) break
    }
  }

  if (requiresAllConditionalPredicates) {
    return !predicateResults.includes(false)
  } else {
    // Doesn't require all predicates
    return predicateResults.includes(true)
  }
}

export {
  evaluateConditionalOptionsPredicate,
  evaluateConditionalPredicate,
  evaluateConditionalPredicates,
}
