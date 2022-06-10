import {
  CivicaTypes,
  FormTypes,
  GeoscapeTypes,
  MiscTypes,
  PointTypes,
  SubmissionTypes,
} from '@oneblink/types'
import { findFormElement } from './formElementsService'
import { getABNNumberFromABNRecord } from './abnService'

export type CustomValuesOptions = {
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

/**
 * Function to get the display value of a property in submission
 *
 * #### Example
 *
 * ```typescript
 *
 * const result = submissionService.getElementSubmissionValue({
 *   propertyName: 'search',
 *   submission: {
 *     search: 'Entered By User',
 *   },
 *   formElements: [
 *     {
 *       id: 'd4135b47-9004-4d75-aeb3-d2f6232da111',
 *       name: 'search',
 *       type: 'text',
 *       label: 'Search',
 *       readOnly: false,
 *       required: false,
 *       conditionallyShow: false,
 *       requiresAllConditionallyShowPredicates: false,
 *       isElementLookup: false,
 *       isDataLookup: false,
 *     },
 *   ],
 *   formatDate: (value) => new Date(value).toDateString(),
 *   formatTime: (value) => new Date(value).toTimeString(),
 *   formatNumber: (value) => Number(value).toString(),
 *   formatCurrency: (value) => Number(value).toFixed(2),
 * }: {
 *   propertyName: string
 *   formElements: FormTypes.FormElement[]
 *   submission: SubmissionTypes.S3SubmissionData['submission']
 *   formatDate: (value: string) => string
 *   formatTime: (value: string) => string
 *   formatNumber: (value: number) => string
 *   formatCurrency: (value: number) => string
 * })
 * ```
 *
 * @param options
 * @returns
 */
export function getElementSubmissionValue({
  propertyName,
  submission,
  formElements,
  formatDate,
  formatTime,
  formatNumber,
  formatCurrency,
}: {
  propertyName: string
  formElements: FormTypes.FormElement[]
  submission: SubmissionTypes.S3SubmissionData['submission']
  formatDate: (value: string) => string
  formatTime: (value: string) => string
  formatNumber: (value: number) => string
  formatCurrency: (value: number) => string
}): unknown {
  const formElement = findFormElement(
    formElements,
    (element) =>
      element.type !== 'page' &&
      element.type !== 'section' &&
      element.name === propertyName,
  )

  const unknown = submission[propertyName]
  if (unknown === undefined || unknown === null) {
    return undefined
  }

  switch (formElement?.type) {
    case 'datetime': {
      const value = unknown as string
      return `${formatDate(value)} ${formatTime(value)}`
    }
    case 'date': {
      const value = unknown as string
      return formatDate(value)
    }
    case 'time': {
      const value = unknown as string
      return formatTime(value)
    }
    case 'radio':
    case 'autocomplete': {
      const value = unknown as string
      const option = formElement.options?.find((opt) => opt.value === value)
      return option?.label || value
    }

    case 'checkboxes': {
      const value = unknown as string[]
      const selectedOptionLabels: string[] = value.reduce(
        (labels: string[], selectedOption: string) => {
          const foundOption = formElement.options?.find(
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
      const value = unknown as {
        value?: string
      }
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
        const value = unknown as string[]
        const selectedOptionLabels: string[] = value.reduce(
          (labels: string[], selectedOption: string) => {
            const foundOption = formElement.options?.find(
              (o) => o.value === selectedOption,
            )
            if (foundOption) labels.push(foundOption.label)
            return labels
          },
          [],
        )
        return selectedOptionLabels.length ? selectedOptionLabels : undefined
      } else {
        const value = unknown as string
        const option = formElement.options?.find((opt) => opt.value === value)
        return option?.label || ''
      }
    }
    case 'boolean': {
      const value = unknown as boolean
      return value ? 'Yes' : 'No'
    }
    case 'calculation': {
      const value = unknown as number
      if (!Number.isNaN(value) && Number.isFinite(value)) {
        let text
        if (formElement.displayAsCurrency) {
          text = formatCurrency(value)
        } else {
          text = formatNumber(value)
        }
        return text
      }
      return undefined
    }
    case 'pointAddress':
    case 'geoscapeAddress': {
      const value = unknown as
        | PointTypes.PointAddress
        | GeoscapeTypes.GeoscapeAddress
      return value?.addressDetails?.formattedAddress || value?.addressId
    }
    case 'civicaStreetName': {
      const value = unknown as CivicaTypes.CivicaStreetName
      return value?.formattedStreet
    }
    case 'civicaNameRecord': {
      const value = unknown as CivicaTypes.CivicaNameRecord
      return (
        [value?.title, value?.givenName1, value?.familyName]
          .filter((t) => t)
          .join(' ') || value?.emailAddress
      )
    }
    case 'abn': {
      const value = unknown as MiscTypes.ABNRecord
      return value ? getABNNumberFromABNRecord(value) : undefined
    }
    default: {
      return unknown
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
      formElements: form.elements,
      submission,
      formatDate,
      formatTime,
      formatNumber,
      formatCurrency,
    })

    return newString.replace(
      match,
      value === undefined ? '' : (value as string),
    )
  }, text)
}

/**
 * Function to replace a custom values in text
 *
 * #### Example
 *
 * ```js
 * const result = submissionService.replaceCustomValues(
 *   'https://example.com/path?submissionId={SUBMISSION_ID}&externalId={EXTERNAL_ID}&search{ELEMENT:search}',
 *   {
 *     submissionId: 'abc-123',
 *     submissionTimestamp: '2021-07-02T02:19:13.670Z',
 *     formatDate: (value) => new Date(value).toDateString(),
 *     formatTime: (value) => new Date(value).toTimeString(),
 *     submission: {
 *       search: 'Entered By User',
 *     },
 *     form: {
 *       id: 1,
 *       name: 'Form',
 *       organisationId: '',
 *       formsAppEnvironmentId: 1,
 *       formsAppIds: [],
 *       isAuthenticated: false,
 *       isMultiPage: false,
 *       isInfoPage: false,
 *       postSubmissionAction: 'FORMS_LIBRARY',
 *       cancelAction: 'FORMS_LIBRARY',
 *       submissionEvents: [],
 *       tags: [],
 *       elements: [
 *         {
 *           id: 'd4135b47-9004-4d75-aeb3-d2f6232da111',
 *           name: 'search',
 *           type: 'text',
 *           label: 'Search',
 *           readOnly: false,
 *           required: false,
 *           conditionallyShow: false,
 *           requiresAllConditionallyShowPredicates: false,
 *           isElementLookup: false,
 *           isDataLookup: false,
 *         },
 *       ],
 *     },
 *   },
 * )
 * ```
 *
 * @param text
 * @param options
 * @returns
 */
export function replaceCustomValues(
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
