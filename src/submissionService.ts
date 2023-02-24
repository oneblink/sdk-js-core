import { FormTypes, SubmissionTypes } from '@oneblink/types'

export * from './replaceCustomValues'

/**
 * Takes a form element's id, the form elements and the submission data to
 * return a value from the submission.
 *
 * #### Example
 *
 * ```js
 * const value = submissionService.getRootElementById(
 *   formElementId,
 *   form.elements,
 *   submission,
 * )
 * ```
 *
 * @param formElementId
 * @param formElements
 * @param submission
 * @returns
 */
export function getRootElementValueById(
  formElementId: string,
  formElements: FormTypes.FormElement[],
  submission: SubmissionTypes.S3SubmissionData['submission'],
): unknown {
  for (const formElement of formElements) {
    if (formElement.type === 'page' || formElement.type === 'section') {
      const value = getRootElementValueById(
        formElementId,
        formElement.elements,
        submission,
      )
      if (value !== undefined) {
        return value
      }
    } else if (formElement.id === formElementId) {
      return submission[formElement.name]
    }
  }
}
