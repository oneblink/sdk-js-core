import { FormTypes, ConditionTypes } from '@oneblink/types'

export default function evaluateConditionalOptionsPredicate({
  predicate,
  predicateElement,
  predicateValue: value,
}: {
  predicate: ConditionTypes.ConditionalPredicateOptions
  predicateValue: unknown
  predicateElement: FormTypes.FormElementWithOptions
}): boolean {
  return predicate.optionIds.some((optionId) => {
    const option = predicateElement.options?.find((o) => o.id === optionId)
    if (option) {
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
