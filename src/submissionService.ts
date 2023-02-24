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

/**
 * Takes an element name and a submission object, and returns the provided
 * element's value as a string. Used for replaceable values in OneBlink
 * Calculation and Info (HTML) elements.
 *
 * #### Example
 *
 * ```js
 * const nameElementValue = submissionService.getSubmissionValueAsString(
 *   'Name_Element',
 *   submission,
 * )
 * ```
 *
 * @param elementName
 * @param submission
 * @returns
 */
export function getSubmissionValueAsString(
  elementName: string,
  submission: SubmissionTypes.S3SubmissionData['submission'],
): string {
  const v = submission[elementName]
  switch (typeof v) {
    case 'function':
    case 'undefined':
    case 'symbol': {
      return ''
    }
    case 'object': {
      // Account for null
      return v?.toString() || ''
    }
    case 'number':
    case 'boolean':
    case 'bigint': {
      return v.toString()
    }
    default: {
      return v as string
    }
  }
}
