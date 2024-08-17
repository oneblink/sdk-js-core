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
    const optionValue = option?.value ?? optionId
    if (optionValue) {
      if (Array.isArray(value)) {
        return value.some((modelValue) => {
          return modelValue === optionValue
        })
      } else if (predicateElement.type === 'compliance' && value) {
        return optionValue === (value as { value: unknown }).value
      } else {
        return optionValue === value
      }
    } else {
      return false
    }
  })
}
