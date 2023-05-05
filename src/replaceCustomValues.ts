import {
  CivicaTypes,
  FormTypes,
  GeoscapeTypes,
  MiscTypes,
  PointTypes,
  SubmissionTypes,
} from '@oneblink/types'
import {
  findFormElement,
  matchElementsTagRegex,
  WYSIWYGRegex,
} from './formElementsService'
import { getABNNumberFromABNRecord } from './abnService'

export type ReplaceSubmissionFormatters = {
  formatDateTime: (value: string) => string
  formatDate: (value: string) => string
  formatTime: (value: string) => string
  formatNumber: (value: number) => string
  formatCurrency: (value: number) => string
}

export type ReplaceSubmissionResultOptions = ReplaceSubmissionFormatters & {
  form: FormTypes.Form
  submissionId: string
  submissionTimestamp: string
  externalId: string | undefined
  previousApprovalId: string | undefined
  submission: SubmissionTypes.S3SubmissionData['submission']
}

const CUSTOM_VALUES = [
  {
    string: '{INFO_PAGE_ID}',
    value: ({ form }: ReplaceSubmissionResultOptions) => form.id.toString(),
  },
  {
    string: '{INFO_PAGE_NAME}',
    value: ({ form }: ReplaceSubmissionResultOptions) => form.name,
  },
  {
    string: '{FORM_ID}',
    value: ({ form }: ReplaceSubmissionResultOptions) => form.id.toString(),
  },
  {
    string: '{FORM_NAME}',
    value: ({ form }: ReplaceSubmissionResultOptions) => form.name,
  },
  {
    string: '{DATE}',
    value: ({
      submissionTimestamp,
      formatDateTime,
    }: ReplaceSubmissionResultOptions) => {
      if (!submissionTimestamp) {
        return ''
      }
      return formatDateTime(submissionTimestamp)
    },
  },
  {
    string: '{TIMESTAMP}',
    value: ({ submissionTimestamp }: ReplaceSubmissionResultOptions) =>
      submissionTimestamp || '',
  },
  {
    string: '{SUBMISSION_ID}',
    value: ({ submissionId }: ReplaceSubmissionResultOptions) =>
      submissionId || '',
  },
  {
    string: '{EXTERNAL_ID}',
    value: ({ externalId }: ReplaceSubmissionResultOptions) => externalId || '',
  },
  {
    string: '{PREVIOUS_APPROVAL_ID}',
    value: ({ previousApprovalId }: ReplaceSubmissionResultOptions) =>
      previousApprovalId || '',
  },
]

/**
 * Function to get the display value of a property in submission
 *
 * #### Example
 *
 * ```typescript
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
 *   formatDateTime: (value) => new Date(value).toString(),
 *   formatTime: (value) => new Date(value).toTimeString(),
 *   formatNumber: (value) => Number(value).toString(),
 *   formatCurrency: (value) => Number(value).toFixed(2),
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
  formatDateTime,
  formatTime,
  formatNumber,
  formatCurrency,
}: {
  propertyName: string
  formElements: FormTypes.FormElement[]
  submission: SubmissionTypes.S3SubmissionData['submission']
  formatDate: (value: string) => string
  formatDateTime: (value: string) => string
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
      return formatDateTime(value)
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

/**
 * Replace the `{ELEMENT:<elementName>}` values in text while a form is being
 * filled out. The replacements are suppose to be user friendly and for display
 * purposes, e.g. dates should be displayed in the user's desired format and timezone.
 *
 * #### Example
 *
 * ```js
 * const result = submissionService.replaceElementValues(
 *   'https://example.com/path?search{ELEMENT:search}',
 *   {
 *     formatDate: (value) => new Date(value).toDateString(),
 *     formatDateTime: (value) => new Date(value).toString(),
 *     formatTime: (value) => new Date(value).toTimeString(),
 *     formatNumber: (value) => Number(value).toString(),
 *     formatCurrency: (value) => Number(value).toFixed(2),
 *     submission: {
 *       search: 'Entered By User',
 *     },
 *     elements: [
 *       {
 *         id: 'd4135b47-9004-4d75-aeb3-d2f6232da111',
 *         name: 'search',
 *         type: 'text',
 *         label: 'Search',
 *         readOnly: false,
 *         required: false,
 *         conditionallyShow: false,
 *         requiresAllConditionallyShowPredicates: false,
 *         isElementLookup: false,
 *         isDataLookup: false,
 *       },
 *     ],
 *   },
 * )
 * ```
 *
 * @param text
 * @param options
 * @returns
 */
export function replaceInjectablesWithElementValues(
  text: string,
  options: {
    formElements: FormTypes.FormElement[]
    submission: SubmissionTypes.S3SubmissionData['submission']
  } & ReplaceSubmissionFormatters,
): string {
  const matches = text.match(WYSIWYGRegex)
  if (!matches) {
    return text
  }

  matchElementsTagRegex(text, ({ elementName, elementMatch }) => {
    const value = getElementSubmissionValue({
      propertyName: elementName,
      ...options,
    })

    text = text.replace(
      elementMatch,
      value === undefined ? '' : (value as string),
    )
  })
  return text
}

/**
 * Replace the `{ELEMENT:<elementName>}` values in text after a successful form
 * submission as well as other replaceable parameters e.g. `submissionId`. The
 * replacements are suppose to be user friendly and for display purposes, e.g.
 * dates should be displayed in the user's desired format and timezone.
 *
 * #### Example
 *
 * ```js
 * const result = submissionService.replaceSubmissionResultValues(
 *   'https://example.com/path?submissionId={SUBMISSION_ID}&externalId={EXTERNAL_ID}&search{ELEMENT:search}',
 *   {
 *     submissionId: 'abc-123',
 *     submissionTimestamp: '2021-07-02T02:19:13.670Z',
 *     formatDate: (value) => new Date(value).toDateString(),
 *     formatDateTime: (value) => new Date(value).toString(),
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
export function replaceInjectablesWithSubmissionValues(
  text: string,
  {
    form,
    submission,
    externalId,
    submissionId,
    submissionTimestamp,
    formatDate,
    formatDateTime,
    formatTime,
    formatNumber,
    formatCurrency,
    previousApprovalId,
  }: ReplaceSubmissionResultOptions,
): string {
  const string = replaceInjectablesWithElementValues(text, {
    formElements: form.elements,
    submission,
    formatDate,
    formatDateTime,
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
        formatDateTime,
        formatTime,
        formatNumber,
        formatCurrency,
        previousApprovalId,
        submission,
      }),
    )
  }, string)
}
