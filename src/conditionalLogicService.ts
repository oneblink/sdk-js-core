import evaluateConditionalPredicate from './conditionalLogicService/evaluateConditionalPredicate'
import { flattenFormElements } from './formElementsService'
import { ConditionTypes, FormTypes, SubmissionTypes } from '@oneblink/types'

export * from './conditionalLogicService/generateFormElementsConditionallyShown'

export function evaluateConditionalPredicates({
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
  const formElementsCtrl = {
    flattenedElements: flattenFormElements(formElements),
    model: submission,
  }

  const predicateFn = (predicate: ConditionTypes.ConditionalPredicate) =>
    evaluateConditionalPredicate({
      predicate,
      formElementsCtrl,
    })
  if (requiresAllConditionalPredicates) {
    return conditionalPredicates.every(predicateFn)
  } else {
    return conditionalPredicates.some(predicateFn)
  }
}
