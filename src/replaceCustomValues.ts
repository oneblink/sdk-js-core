import { FormTypes, SubmissionTypes } from '@oneblink/types'
import { findFormElement } from './formElementsService'

type CustomValuesOptions = {
  form: FormTypes.Form
  externalId?: string
  submissionId: string
  submissionTimestamp: string
  formatDate: (value: string) => string
  formatTime: (value: string) => string
  previousApprovalId?: string
}

const CUSTOM_VALUES = [
  {
    string: '{INFO_PAGE_ID}',
    value: ({ form }: CustomValuesOptions) => form.id.toString(),
  },
  {
    string: '{INFO_PAGE_NAME}',
    value: ({ form }: CustomValuesOptions) => form.name,
  },
  {
    string: '{FORM_ID}',
    value: ({ form }: CustomValuesOptions) => form.id.toString(),
  },
  {
    string: '{FORM_NAME}',
    value: ({ form }: CustomValuesOptions) => form.name,
  },
  {
    string: '{DATE}',
    value: ({
      submissionTimestamp,
      formatDate,
      formatTime,
    }: CustomValuesOptions) => {
      if (!submissionTimestamp) {
        return ''
      }
      return `${formatDate(submissionTimestamp)} ${formatTime(
        submissionTimestamp,
      )}`
    },
  },
  {
    string: '{TIMESTAMP}',
    value: ({ submissionTimestamp }: CustomValuesOptions) =>
      submissionTimestamp || '',
  },
  {
    string: '{SUBMISSION_ID}',
    value: ({ submissionId }: CustomValuesOptions) => submissionId || '',
  },
  {
    string: '{EXTERNAL_ID}',
    value: ({ externalId }: CustomValuesOptions) => externalId || '',
  },
  {
    string: '{PREVIOUS_APPROVAL_ID}',
    value: ({ previousApprovalId }: CustomValuesOptions) =>
      previousApprovalId || '',
  },
]

function getElementSubmissionValue({
  propertyName,
  submission,
  form,
  formatDate,
  formatTime,
}: {
  propertyName: string
  form: FormTypes.Form
  submission: SubmissionTypes.S3SubmissionData['submission']
  formatDate: (value: string) => string
  formatTime: (value: string) => string
}): string {
  const formElement = findFormElement(
    form.elements,
    (element) =>
      element.type !== 'page' &&
      element.type !== 'section' &&
      element.name === propertyName,
  )

  const value = submission[propertyName]
  if (value !== undefined && value !== null) {
    switch (formElement?.type) {
      case 'datetime': {
        return `${formatDate(value)} ${formatTime(value)}`
      }
      case 'date': {
        return formatDate(value)
      }
      case 'time': {
        return formatTime(value)
      }
      default: {
        // do nothing
      }
    }
  }
  return value
}

function replaceElementValues(
  text: string,
  {
    form,
    submission,
    formatDate,
    formatTime,
  }: {
    form: FormTypes.Form
    submission: SubmissionTypes.S3SubmissionData['submission']
    formatDate: (value: string) => string
    formatTime: (value: string) => string
  },
): string {
  const matches = text.match(/({ELEMENT:)([^}]+)(})/g)
  if (!matches) {
    return text
  }

  return matches.reduce((newString, match) => {
    const propertyName = match.substring(
      match.indexOf(':') + 1,
      match.lastIndexOf('}'),
    )

    const value = getElementSubmissionValue({
      propertyName,
      form,
      submission,
      formatDate,
      formatTime,
    })

    return newString.replace(match, value)
  }, text)
}

export default function replaceCustomValues(
  text: string,
  {
    form,
    submission,
    externalId,
    submissionId,
    submissionTimestamp,
    formatDate,
    formatTime,
    previousApprovalId,
  }: CustomValuesOptions & {
    submission: SubmissionTypes.S3SubmissionData['submission']
  },
): string {
  const string = replaceElementValues(text, {
    form,
    submission,
    formatDate,
    formatTime,
  })
  return CUSTOM_VALUES.reduce((newString, customValue) => {
    return newString.replace(
      customValue.string,
      customValue.value({
        form,
        submissionTimestamp,
        externalId,
        submissionId,
        formatDate,
        formatTime,
        previousApprovalId,
      }),
    )
  }, string)
}
