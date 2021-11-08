import { FormTypes, SubmissionTypes } from '@oneblink/types'
import { findFormElement } from './formElementsService'

type CustomValuesOptions = {
  form: FormTypes.Form
  externalId?: string
  submissionId: string
  submissionTimestamp: string
  formatDate: (value: string) => string
  formatTime: (value: string) => string
  formatNumber: (value: number) => string
  formatCurrency: (value: number) => string
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

export function getElementSubmissionValue({
  propertyName,
  submission,
  form,
  formatDate,
  formatTime,
  formatNumber,
  formatCurrency,
}: {
  propertyName: string
  form: FormTypes.Form
  submission: SubmissionTypes.S3SubmissionData['submission']
  formatDate: (value: string) => string
  formatTime: (value: string) => string
  formatNumber: (value: number) => string
  formatCurrency: (value: number) => string
}): string | undefined | Array<string> {
  const formElement = findFormElement(
    form.elements,
    (element) =>
      element.type !== 'page' &&
      element.type !== 'section' &&
      element.name === propertyName,
  )

  const value = submission[propertyName]
  if (value === undefined || value === null) {
    return undefined
  }

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
    case 'radio':
    case 'autocomplete': {
      const option = formElement.options.find((opt) => opt.value === value)
      return option?.label || ''
    }

    case 'checkboxes': {
      const selectedOptionLabels: string[] = value.reduce(
        (labels: string[], selectedOption: string) => {
          const foundOption = formElement.options.find(
            (o) => o.value === selectedOption,
          )
          if (foundOption) labels.push(foundOption.label)
          return labels
        },
        [],
      )
      return selectedOptionLabels.length ? selectedOptionLabels : undefined
    }
    case 'compliance': {
      const option = (formElement.options || []).find(
        (option: FormTypes.ChoiceElementOption) => option.value === value.value,
      )
      return {
        ...value,
        value: option?.label || value.value,
      }
    }
    case 'select': {
      if (formElement.multi) {
        const selectedOptionLabels: string[] = value.reduce(
          (labels: string[], selectedOption: string) => {
            const foundOption = formElement.options.find(
              (o) => o.value === selectedOption,
            )
            if (foundOption) labels.push(foundOption.label)
            return labels
          },
          [],
        )
        return selectedOptionLabels.length ? selectedOptionLabels : undefined
      } else {
        const option = formElement.options.find((opt) => opt.value === value)
        return option?.label || ''
      }
    }
    case 'boolean': {
      return value ? 'Yes' : 'No'
    }
    case 'calculation':
      {
        if (!Number.isNaN(value) && Number.isFinite(value)) {
          let text
          if (formElement.displayAsCurrency) {
            text = formatCurrency(value)
          } else {
            text = formatNumber(value)
          }
          const newValue = formElement.defaultValue.replace('{RESULT}', text)
          return newValue
        } else if (formElement.preCalculationDisplay) {
          return formElement.preCalculationDisplay
        }
      }
      break
    default: {
      return value
    }
  }
}

function replaceElementValues(
  text: string,
  {
    form,
    submission,
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
  }: {
    form: FormTypes.Form
    submission: SubmissionTypes.S3SubmissionData['submission']
    formatDate: (value: string) => string
    formatTime: (value: string) => string
    formatNumber: (value: number) => string
    formatCurrency: (value: number) => string
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
      formatNumber,
      formatCurrency,
    })

    return newString.replace(match, typeof value === 'string' ? value : '')
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
    formatNumber,
    formatCurrency,
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
    formatNumber,
    formatCurrency,
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
        formatNumber,
        formatCurrency,
        previousApprovalId,
      }),
    )
  }, string)
}
