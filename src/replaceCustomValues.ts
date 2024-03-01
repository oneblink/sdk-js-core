import {
  APINSWTypes,
  CivicaTypes,
  FormTypes,
  GeoscapeTypes,
  MiscTypes,
  PointTypes,
  ScheduledTasksTypes,
  SubmissionTypes,
} from '@oneblink/types'
import { getABNNumberFromABNRecord } from './abnService'
import {
  RootElementRegex,
  NestedElementRegex,
  matchElementsTagRegex,
} from './form-elements-regex'

export type ReplaceInjectablesFormatters = {
  formatDateTime: (value: string) => string
  formatDate: (value: string) => string
  formatTime: (value: string) => string
  formatNumber: (value: number) => string
  formatCurrency: (value: number) => string
}

export type ReplaceInjectablesBaseOptions = ReplaceInjectablesFormatters & {
  submission: SubmissionTypes.S3SubmissionData['submission']
  userProfile: MiscTypes.UserProfile | undefined
  task: ScheduledTasksTypes.Task | undefined
  taskGroup: ScheduledTasksTypes.TaskGroup | undefined
  taskGroupInstance: ScheduledTasksTypes.TaskGroupInstance | undefined
  /**
   * Determine if only root level elements should be replaced.
   *
   * `false` will replace `"{ELEMENT:Parent_Name}"` and
   * `"{ELEMENT:Children|Name}"`.
   *
   * `true` will replace `"{ELEMENT:Parent_Name}"` but will NOT replace
   * `{ELEMENT:Children|Name}`.
   */
  excludeNestedElements?: boolean
}

export type ReplaceInjectablesOptions = ReplaceInjectablesBaseOptions & {
  form: FormTypes.Form
  submissionId: string
  submissionTimestamp: string
  externalId: string | undefined
  previousApprovalId: string | undefined
}

const SUBMISSION_VALUES: Array<{
  string: string
  value: (options: ReplaceInjectablesOptions) => string | undefined
}> = [
  {
    string: '{INFO_PAGE_ID}',
    value: ({ form }: ReplaceInjectablesOptions) => form.id.toString(),
  },
  {
    string: '{INFO_PAGE_NAME}',
    value: ({ form }: ReplaceInjectablesOptions) => form.name,
  },
  {
    string: '{FORM_ID}',
    value: ({ form }: ReplaceInjectablesOptions) => form.id.toString(),
  },
  {
    string: '{FORM_NAME}',
    value: ({ form }: ReplaceInjectablesOptions) => form.name,
  },
  {
    string: '{DATE}',
    value: ({
      submissionTimestamp,
      formatDateTime,
    }: ReplaceInjectablesOptions) => {
      if (!submissionTimestamp) {
        return undefined
      }
      return formatDateTime(submissionTimestamp)
    },
  },
  {
    string: '{TIMESTAMP}',
    value: ({ submissionTimestamp }: ReplaceInjectablesOptions) =>
      submissionTimestamp,
  },
  {
    string: '{SUBMISSION_ID}',
    value: ({ submissionId }: ReplaceInjectablesOptions) => submissionId,
  },
  {
    string: '{EXTERNAL_ID}',
    value: ({ externalId }: ReplaceInjectablesOptions) => externalId,
  },
  {
    string: '{PREVIOUS_APPROVAL_ID}',
    value: ({ previousApprovalId }: ReplaceInjectablesOptions) =>
      previousApprovalId,
  },
]

const ELEMENT_VALUES: Array<{
  string: string
  value: (options: ReplaceInjectablesBaseOptions) => string | undefined
}> = [
  {
    string: '{USER:email}',
    value: ({ userProfile }) => userProfile?.email,
  },
  {
    string: '{USER:username}',
    value: ({ userProfile }) => userProfile?.username,
  },
  {
    string: '{TASK_NAME}',
    value: ({ task }) => task?.name,
  },
  {
    string: '{TASK_GROUP_NAME}',
    value: ({ taskGroup }) => taskGroup?.name,
  },
  {
    string: '{TASK_GROUP_INSTANCE_LABEL}',
    value: ({ taskGroupInstance }) => taskGroupInstance?.label,
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
  elementId,
  propertyName,
  submission,
  formElements,
  formatDate,
  formatDateTime,
  formatTime,
  formatNumber,
  formatCurrency,
}: {
  elementId?: string
  propertyName?: string
  formElements: FormTypes.FormElement[]
  submission: SubmissionTypes.S3SubmissionData['submission']
} & ReplaceInjectablesFormatters):
  | {
      element: FormTypes.FormElement | undefined
      value: unknown
    }
  | undefined {
  if (elementId === undefined && propertyName === undefined) {
    return undefined
  }

  // make sure submission is an object
  if (Object(submission) !== submission) {
    return undefined
  }

  let unknown: unknown = undefined
  let formElement: FormTypes.FormElement | undefined = undefined

  const matchFn = (element: FormTypes.FormElement) => {
    if (elementId) {
      return elementId === element.id
    }
    return 'name' in element && element.name === propertyName
  }

  if (elementId) {
    for (const element of formElements) {
      if (matchFn(element)) {
        if ('name' in element) {
          unknown = submission[element.name]
          formElement = element
          break
        }
      }
      if ('elements' in element) {
        const newSubmissionData =
          'name' in element ? submission[element.name] : submission

        if (Array.isArray(newSubmissionData) || !element.elements) {
          continue
        }

        const result = getElementSubmissionValue({
          elementId,
          formElements: element.elements,
          submission:
            newSubmissionData as SubmissionTypes.S3SubmissionData['submission'],
          formatDate,
          formatDateTime,
          formatTime,
          formatNumber,
          formatCurrency,
        })
        if (result) {
          unknown = result.value
          formElement = result.element
        }
      }
    }
  }

  if (unknown === undefined || unknown === null) {
    return undefined
  }

  switch (formElement?.type) {
    case 'datetime': {
      const value = unknown as string
      return { element: formElement, value: formatDateTime(value) }
    }
    case 'date': {
      const value = unknown as string
      return { element: formElement, value: formatDate(value) }
    }
    case 'time': {
      const value = unknown as string
      return { element: formElement, value: formatTime(value) }
    }
    case 'radio':
    case 'autocomplete': {
      const value = unknown as string
      const option = formElement.options?.find((opt) => opt.value === value)
      return { element: formElement, value: option?.label || value }
    }

    case 'checkboxes': {
      const value = unknown as string[]
      const selectedOptionLabels: string[] = value.reduce(
        (labels: string[], selectedOption: string) => {
          //TS making me do this again
          if (formElement?.type !== 'checkboxes') {
            return labels
          }
          const foundOption = formElement.options?.find(
            (o) => o.value === selectedOption,
          )
          if (foundOption) labels.push(foundOption.label)
          return labels
        },
        [],
      )
      return {
        element: formElement,
        value: selectedOptionLabels.length ? selectedOptionLabels : undefined,
      }
    }
    case 'compliance': {
      const value = unknown as {
        value?: string
      }
      const option = (formElement.options || []).find(
        (option: FormTypes.ChoiceElementOption) => option.value === value.value,
      )
      return {
        element: formElement,
        value: {
          ...value,
          value: option?.label || value.value,
        },
      }
    }
    case 'select': {
      if (formElement.multi) {
        const value = unknown as string[]
        const selectedOptionLabels: string[] = value.reduce(
          (labels: string[], selectedOption: string) => {
            //TS making me do this again
            if (formElement?.type !== 'select') {
              return labels
            }
            const foundOption = formElement.options?.find(
              (o) => o.value === selectedOption,
            )
            if (foundOption) labels.push(foundOption.label)
            return labels
          },
          [],
        )
        return {
          element: formElement,
          value: selectedOptionLabels.length ? selectedOptionLabels : undefined,
        }
      } else {
        const value = unknown as string
        const option = formElement.options?.find((opt) => opt.value === value)
        return { element: formElement, value: option?.label }
      }
    }
    case 'boolean': {
      const value = unknown as boolean
      return { element: formElement, value: value ? 'Yes' : 'No' }
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
        return { element: formElement, value: text }
      }
      return undefined
    }
    case 'pointAddress':
    case 'geoscapeAddress': {
      const value = unknown as
        | PointTypes.PointAddress
        | GeoscapeTypes.GeoscapeAddress
      return {
        element: formElement,
        value: value?.addressDetails?.formattedAddress || value?.addressId,
      }
    }
    case 'civicaStreetName': {
      const value = unknown as CivicaTypes.CivicaStreetName
      return { element: formElement, value: value?.formattedStreet }
    }
    case 'civicaNameRecord': {
      const value = unknown as CivicaTypes.CivicaNameRecord
      return {
        element: formElement,
        value:
          [value?.title, value?.givenName1, value?.familyName]
            .filter((t) => t)
            .join(' ') || value?.emailAddress,
      }
    }
    case 'abn': {
      const value = unknown as MiscTypes.ABNRecord
      return {
        element: formElement,
        value: value ? getABNNumberFromABNRecord(value) : undefined,
      }
    }
    case 'apiNSWLiquorLicence': {
      const value = unknown as APINSWTypes.LiquorLicenceDetails | undefined
      return {
        element: formElement,
        value:
          `${value?.licenceDetail?.licenceNumber} | ${value?.licenceDetail?.licenceName}`.trim(),
      }
    }
    default: {
      return { element: formElement, value: unknown }
    }
  }
}

/**
 * Replace the `{ELEMENT:<elementName>}` values in text while a form is being
 * filled out. The replacements are suppose to be user friendly and for display
 * purposes, e.g. dates should be displayed in the user's desired format and
 * timezone.
 *
 * #### Example
 *
 * ```js
 * const { text: url } =
 *   submissionService.replaceInjectablesWithElementValues(
 *     'https://example.com/path?search{ELEMENT:search}',
 *     {
 *       formatDate: (value) => new Date(value).toDateString(),
 *       formatDateTime: (value) => new Date(value).toString(),
 *       formatTime: (value) => new Date(value).toTimeString(),
 *       formatNumber: (value) => Number(value).toString(),
 *       formatCurrency: (value) => Number(value).toFixed(2),
 *       submission: {
 *         search: 'Entered By User',
 *       },
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
 *       userProfile: {
 *         userId: 'abc123',
 *         username: 'john-user',
 *         email: 'john.user@domain.com',
 *       },
 *     },
 *   )
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
  } & ReplaceInjectablesBaseOptions,
): {
  /**
   * The text passed in with all injectables replaced with their corresponding
   * values or empty strings.
   */
  text: string
  /**
   * Determine if replaceable strings could all be replaced. The `text` property
   * returned will replace all injectable with empty strings if the value cannot
   * be found. Use this boolean to either use the replaced string with missing
   * data or implement some other logic to handle missing injectables.
   */
  hadAllInjectablesReplaced: boolean
} {
  let hadAllInjectablesReplaced = true
  text = ELEMENT_VALUES.reduce((newString, customValue) => {
    if (!newString.includes(customValue.string)) {
      return newString
    }
    const replacedValue = customValue.value(options)
    if (!replacedValue) {
      hadAllInjectablesReplaced = false
    }
    return newString.replaceAll(customValue.string, replacedValue || '')
  }, text)

  const matchesElement = text.match(
    options.excludeNestedElements ? RootElementRegex : NestedElementRegex,
  )
  if (matchesElement) {
    matchElementsTagRegex(
      {
        text,
        excludeNestedElements: !!options.excludeNestedElements,
      },
      ({ elementName, elementMatch }) => {
        const result = getElementSubmissionValue({
          propertyName: elementName,
          ...options,
        })

        const hasNoValue = result === undefined || result.value === undefined
        if (hasNoValue) {
          hadAllInjectablesReplaced = false
        }

        text = text.replace(
          elementMatch,
          hasNoValue ? '' : (result.value as string),
        )
      },
    )
  }

  return {
    text,
    hadAllInjectablesReplaced,
  }
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
 * const result = submissionService.replaceInjectablesWithSubmissionValues(
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
  options: ReplaceInjectablesOptions,
): {
  /**
   * The text passed in with all injectables replaced with their corresponding
   * values or empty strings.
   */
  text: string
  /**
   * Determine if replaceable strings could all be replaced. The `text` property
   * returned will replace all injectable with empty strings if the value cannot
   * be found. Use this boolean to either use the replaced string with missing
   * data or implement some other logic to handle missing injectables.
   */
  hadAllInjectablesReplaced: boolean
} {
  const result = replaceInjectablesWithElementValues(text, {
    formElements: options.form.elements,
    ...options,
  })
  let hadAllInjectablesReplaced = result.hadAllInjectablesReplaced
  const replacedText = SUBMISSION_VALUES.reduce((newString, customValue) => {
    if (!newString.includes(customValue.string)) {
      return newString
    }
    const replacedValue = customValue.value(options)
    if (!replacedValue) {
      hadAllInjectablesReplaced = false
    }
    return newString.replaceAll(customValue.string, replacedValue || '')
  }, result.text)

  return {
    text: replacedText,
    hadAllInjectablesReplaced,
  }
}
