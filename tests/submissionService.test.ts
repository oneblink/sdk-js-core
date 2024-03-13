import { FormTypes, ScheduledTasksTypes } from '@oneblink/types'
import {
  replaceInjectablesWithElementValues,
  replaceInjectablesWithSubmissionValues,
  getElementSubmissionValue,
} from '../src/submissionService'

describe('replaceInjectablesWithSubmissionValues()', () => {
  const task: ScheduledTasksTypes.Task = {
    versionId: 1,
    taskId: '1',
    name: 'Replace the food',
    formsAppEnvironmentId: 1,
    organisationId: 'string',
    schedule: {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      recurrence: {
        interval: 'DAY',
      },
    },
    actionIds: [],
    createdAt: new Date().toISOString(),
  }
  const taskGroup: ScheduledTasksTypes.TaskGroup = {
    versionId: 1,
    taskGroupId: '1',
    name: 'Cage',
    taskIds: [task.taskId],
    formsAppEnvironmentId: task.formsAppEnvironmentId,
    organisationId: task.organisationId,
    createdAt: new Date().toISOString(),
  }
  const taskGroupInstance: ScheduledTasksTypes.TaskGroupInstance = {
    versionId: 1,
    taskGroupId: taskGroup.taskGroupId,
    taskGroupInstanceId: 'taskGroupInstanceId',
    label: 'Snake Cage',
    createdAt: new Date().toISOString(),
  }
  const form: FormTypes.Form = {
    id: 1,
    name: 'string',
    description: 'string',
    organisationId: 'string',
    formsAppEnvironmentId: 1,
    formsAppIds: [],
    elements: [
      {
        id: 'd4135b47-9004-4d75-aeb3-d2f6232da111',
        name: 'name',
        type: 'text',
        label: 'Name',
        readOnly: false,
        required: false,
        conditionallyShow: false,
        requiresAllConditionallyShowPredicates: false,
        isElementLookup: false,
        isDataLookup: false,
      },
      {
        id: 'fbad2d53-ddf3-419d-8ff7-e9ef21167222',
        name: 'home',
        type: 'text',
        label: 'Home',
        readOnly: false,
        required: false,
        conditionallyShow: false,
        requiresAllConditionallyShowPredicates: false,
        isElementLookup: false,
        isDataLookup: false,
      },
      {
        id: 'd4135b47-9004-4d75-aeb3-d2f6232da333',
        name: 'ELEMENT_1',
        type: 'text',
        label: 'ELEMENT 1',
        readOnly: false,
        required: false,
        conditionallyShow: false,
        requiresAllConditionallyShowPredicates: false,
        isElementLookup: false,
        isDataLookup: false,
      },
      {
        id: 'fbad2d53-ddf3-419d-8ff7-e9ef21167444',
        name: 'ELEMENT_2',
        type: 'text',
        label: 'ELEMENT 2',
        readOnly: false,
        required: false,
        conditionallyShow: false,
        requiresAllConditionallyShowPredicates: false,
        isElementLookup: false,
        isDataLookup: false,
      },
    ],
    isAuthenticated: false,
    isMultiPage: false,
    postSubmissionAction: 'FORMS_LIBRARY',
    cancelAction: 'FORMS_LIBRARY',
    submissionEvents: [],
    tags: [],
    createdAt: 'string',
    updatedAt: 'string',
  }
  const baseOptions = {
    form,
    submissionId: 'submissionId',
    externalId: undefined,
    previousApprovalId: undefined,
    submissionTimestamp: new Date().toISOString(),
    formatDate: () => '',
    formatDateTime: () => '',
    formatTime: () => '',
    formatCurrency: () => '',
    formatNumber: () => '',
    userProfile: {
      userId: '1',
      username: 'person1',
      email: 'person@email.com',
    },
    task,
    taskGroup,
    taskGroupInstance,
  }
  describe('Form redirect URL', () => {
    test('should replace all instances of {ELEMENT} with correct property value', () => {
      const url = 'https://some-url.com?name={ELEMENT:name}&home={ELEMENT:home}'

      const result = replaceInjectablesWithSubmissionValues(url, {
        ...baseOptions,
        submission: {
          name: 'blinkybill',
          home: 'gosford',
        },
      })

      expect(result).toEqual({
        text: 'https://some-url.com?name=blinkybill&home=gosford',
        hadAllInjectablesReplaced: true,
      })
    })

    test('should replace all INDENTICAL instances of {ELEMENT} with correct property value', () => {
      const url =
        'https://some-url.com?name={ELEMENT:name}&koala={ELEMENT:name}'

      const result = replaceInjectablesWithSubmissionValues(url, {
        ...baseOptions,
        submission: {
          name: 'blinkybill',
          home: 'gosford',
        },
      })

      expect(result).toEqual({
        text: 'https://some-url.com?name=blinkybill&koala=blinkybill',
        hadAllInjectablesReplaced: true,
      })
    })

    test('should replace only one(1) instance of {ELEMENT} with correct property value', () => {
      const url = 'https://some-url.com?name={ELEMENT:name}'

      const result = replaceInjectablesWithSubmissionValues(url, {
        ...baseOptions,
        submission: {
          name: 'blinkybill',
        },
      })
      expect(result).toEqual({
        text: 'https://some-url.com?name=blinkybill',
        hadAllInjectablesReplaced: true,
      })
    })
  })

  describe('element tokens', () => {
    const submission = {
      ELEMENT_1: 'zyx',
      ELEMENT_2: 'wvu',
    }

    test('Replaces element tokens with submission data values', async () => {
      const text = 'abc {ELEMENT:ELEMENT_1} def {ELEMENT:ELEMENT_2}'
      const expected = 'abc zyx def wvu'
      const result = replaceInjectablesWithSubmissionValues(text, {
        ...baseOptions,
        submission,
      })
      expect(result).toEqual({
        text: expected,
        hadAllInjectablesReplaced: true,
      })
    })

    test('Original string is returned if no tokens present', async () => {
      const text = 'abc def {ELEMENT:}'
      const result = replaceInjectablesWithSubmissionValues(text, {
        ...baseOptions,
        submission,
      })
      expect(result).toEqual({
        text,
        hadAllInjectablesReplaced: true,
      })
    })
  })

  describe('email recipient', () => {
    test('should replace instance of {USER:email} with email from user profile', () => {
      const emailRecipient = '{USER:email}'

      const result = replaceInjectablesWithSubmissionValues(emailRecipient, {
        ...baseOptions,
        submission: {
          name: 'blinkybill',
          home: 'gosford',
        },
      })

      expect(result).toEqual({
        text: 'person@email.com',
        hadAllInjectablesReplaced: true,
      })
    })

    test('should replace instance of {ELEMENT} with email from submission', () => {
      const emailRecipient = '{ELEMENT:userEmail}'

      const result = replaceInjectablesWithSubmissionValues(emailRecipient, {
        ...baseOptions,
        submission: {
          name: 'blinkybill',
          home: 'gosford',
          userEmail: 'autre_person@email.com',
        },
      })

      expect(result).toEqual({
        text: 'autre_person@email.com',
        hadAllInjectablesReplaced: true,
      })
    })
  })

  test('should replace instance of {USER:email} and {ELEMENT} together', () => {
    const emailRecipient = '{USER:email};{ELEMENT:userEmail};{USER:email}'

    const result = replaceInjectablesWithSubmissionValues(emailRecipient, {
      ...baseOptions,
      submission: {
        name: 'blinkybill',
        home: 'gosford',
        userEmail: 'autre_person@email.com',
      },
    })

    expect(result).toEqual({
      text: 'person@email.com;autre_person@email.com;person@email.com',
      hadAllInjectablesReplaced: true,
    })
  })

  test('should replace with empty strings when {USER:email} and {ELEMENT} are used together without {ELEMENT} value', () => {
    const emailRecipient = '{USER:email};{ELEMENT:userEmail};{USER:email}'

    const result = replaceInjectablesWithSubmissionValues(emailRecipient, {
      ...baseOptions,
      submission: {
        name: 'blinkybill',
        home: 'gosford',
      },
    })

    expect(result).toEqual({
      text: 'person@email.com;;person@email.com',
      hadAllInjectablesReplaced: false,
    })
  })

  test('should replace with empty strings when {USER:email} and {ELEMENT} are used together without {USER:email} value', () => {
    const emailRecipient = '{USER:email};{ELEMENT:userEmail};{USER:email}'

    const result = replaceInjectablesWithSubmissionValues(emailRecipient, {
      ...baseOptions,
      submission: {
        name: 'blinkybill',
        home: 'gosford',
        userEmail: 'autre_person@email.com',
      },
      userProfile: undefined,
    })

    expect(result).toEqual({
      text: ';autre_person@email.com;',
      hadAllInjectablesReplaced: false,
    })
  })

  describe('task based props', () => {
    const text =
      'Task: {TASK_NAME} | Task Group: {TASK_GROUP_NAME} | Task Group Instance: {TASK_GROUP_INSTANCE_LABEL}'
    const expected =
      'Task: Replace the food | Task Group: Cage | Task Group Instance: Snake Cage'

    test('should be replaced for element values', () => {
      const result = replaceInjectablesWithElementValues(text, {
        ...baseOptions,
        formElements: baseOptions.form.elements,
        submission: {},
      })

      expect(result).toEqual({
        text: expected,
        hadAllInjectablesReplaced: true,
      })
    })

    test('should replace task based props', () => {
      const result = replaceInjectablesWithSubmissionValues(text, {
        ...baseOptions,
        submission: {},
      })

      expect(result).toEqual({
        text: expected,
        hadAllInjectablesReplaced: true,
      })
    })
  })

  describe('logged in user', () => {
    test('should replace instance of {USER:username} with username from user profile', () => {
      const username = '{USER:username}'

      const result = replaceInjectablesWithSubmissionValues(username, {
        ...baseOptions,
        submission: {
          name: 'blinkybill',
          home: 'gosford',
        },
      })

      expect(result).toEqual({
        text: 'person1',
        hadAllInjectablesReplaced: true,
      })
    })
  })

  describe('getElementSubmissionValue', () => {
    const formElements: FormTypes.FormElement[] = [
      {
        id: 'fbad2d53-ddf3-419d-8ff7-e9ef21167224',
        type: 'page',
        label: 'Page 1',
        conditionallyShow: false,
        elements: [
          {
            id: 'fbad2d53-ddf3-419d-8ff7-e9ef21167222',
            name: 'home',
            type: 'text',
            label: 'Home',
            readOnly: false,
            required: false,
            conditionallyShow: false,
            requiresAllConditionallyShowPredicates: false,
            isElementLookup: false,
            isDataLookup: false,
          },
          {
            id: 'd4135b47-9004-4d75-aeb3-d2f6232da111',
            name: 'name',
            type: 'text',
            label: 'Name',
            readOnly: false,
            required: false,
            conditionallyShow: false,
            requiresAllConditionallyShowPredicates: false,
            isElementLookup: false,
            isDataLookup: false,
          },
          {
            id: 'fbad2d53-ddf3-419d-8ff7-e9ef21167223',
            name: 'submarine',
            type: 'form',
            formId: 2,
            conditionallyShow: false,
            elements: [
              {
                id: 'd4135b47-9004-4d75-aeb3-d2f6232da112',
                name: 'name',
                type: 'text',
                label: 'Name',
                readOnly: false,
                required: false,
                conditionallyShow: false,
                requiresAllConditionallyShowPredicates: false,
                isElementLookup: false,
                isDataLookup: false,
              },
              {
                id: 'fbad2d53-ddf3-419d-8ff7-e9ef21167223',
                label: 'Section 8',
                isCollapsed: false,
                type: 'section',
                conditionallyShow: false,
                elements: [
                  {
                    id: 'd4135b47-9004-4d75-aeb3-d2f6232da112',
                    name: 'date',
                    type: 'date',
                    label: 'Date',
                    readOnly: false,
                    required: false,
                    conditionallyShow: false,
                    requiresAllConditionallyShowPredicates: false,
                    isElementLookup: false,
                    isDataLookup: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    const submission = {
      submarine: {
        name: 'Ringo',
      },
      name: 'George',
    }

    it('should accept property name', () => {
      const result = getElementSubmissionValue({
        propertyName: 'name',
        submission,
        formElements,
        formatDate: () => '',
        formatTime: () => '',
        formatDateTime: () => '',
        formatNumber: () => '',
        formatCurrency: () => '',
      })

      expect(result).toEqual(
        expect.objectContaining({
          element: expect.objectContaining({
            id: 'd4135b47-9004-4d75-aeb3-d2f6232da111',
          }),
          value: 'George',
        }),
      )
    })

    it('should accept elementId', () => {
      const elementId = 'd4135b47-9004-4d75-aeb3-d2f6232da112'
      const result = getElementSubmissionValue({
        elementId,
        submission,
        formElements,
        formatDate: () => '',
        formatTime: () => '',
        formatDateTime: () => '',
        formatNumber: () => '',
        formatCurrency: () => '',
      })

      expect(result).toEqual(
        expect.objectContaining({
          element: expect.objectContaining({ id: elementId }),
          value: 'Ringo',
        }),
      )
    })

    it('should use elementId before propertyName', () => {
      const elementId = 'd4135b47-9004-4d75-aeb3-d2f6232da112'
      const result = getElementSubmissionValue({
        elementId,
        propertyName: 'name',
        submission,
        formElements,
        formatDate: () => '',
        formatTime: () => '',
        formatDateTime: () => '',
        formatNumber: () => '',
        formatCurrency: () => '',
      })

      expect(result).toEqual(
        expect.objectContaining({
          element: expect.objectContaining({ id: elementId }),
          value: 'Ringo',
        }),
      )
    })

    it('should work with nested values', () => {
      const result = getElementSubmissionValue({
        propertyName: 'date',
        submission: { submarine: { date: '2024-03-13' } },
        formElements,
        formatDate: (v) => `date is ${v}`,
        formatTime: () => '',
        formatDateTime: () => '',
        formatNumber: () => '',
        formatCurrency: () => '',
      })

      expect(result).toEqual(
        expect.objectContaining({
          element: expect.objectContaining({
            id: 'd4135b47-9004-4d75-aeb3-d2f6232da112',
          }),
          value: 'date is 2024-03-13',
        }),
      )
    })

    it('should work with propertyName not in definition', () => {
      const result = getElementSubmissionValue({
        propertyName: 'text',
        submission: { text: 'hello' },
        formElements: [],
        formatDate: () => '',
        formatTime: () => '',
        formatDateTime: () => '',
        formatNumber: () => '',
        formatCurrency: () => '',
      })
      expect(result?.value).toEqual('hello')
    })

    it('should work with nested propertyName not in definition', () => {
      const result = getElementSubmissionValue({
        propertyName: 'text',
        submission: { text: 'hello' },
        formElements: [
          {
            id: 'd4135b47-9004-4d75-aeb3-d2f6232da111',
            type: 'page',
            label: 'Page 1',
            conditionallyShow: false,
            elements: [],
          },
        ],
        formatDate: () => '',
        formatTime: () => '',
        formatDateTime: () => '',
        formatNumber: () => '',
        formatCurrency: () => '',
      })
      expect(result).toEqual({ value: 'hello' })
    })
  })
})
