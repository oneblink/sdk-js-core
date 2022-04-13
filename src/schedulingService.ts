import { FormTypes, SubmissionEventTypes } from '@oneblink/types'
import { conditionalLogicService } from '.'

export function checkForSchedulingEvent(
  definition: FormTypes.Form,
  submission: { readonly [key: string]: unknown },
): SubmissionEventTypes.SchedulingSubmissionEvent | undefined {
  const schedulingSubmissionEvents = definition.schedulingEvents || []
  return schedulingSubmissionEvents.find((schedulingSubmissionEvent) =>
    conditionalLogicService.evaluateConditionalPredicates({
      isConditional: !!schedulingSubmissionEvent.conditionallyExecute,
      requiresAllConditionalPredicates:
        !!schedulingSubmissionEvent.requiresAllConditionallyExecutePredicates,
      conditionalPredicates:
        schedulingSubmissionEvent.conditionallyExecutePredicates || [],
      submission: submission,
      formElements: definition.elements,
    }),
  )
}
