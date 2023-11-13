import { FormTypes, ScheduledTasksTypes } from '@oneblink/types'
import {
  replaceInjectablesWithElementValues,
  replaceInjectablesWithSubmissionValues,
} from '../src/submissionService'

describe('replaceInjectablesWithSubmissionValues()', () => {
  const task: ScheduledTasksTypes.Task = {
    id: 1,
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
    updatedAt: new Date().toISOString(),
  }
  const taskGroup: ScheduledTasksTypes.TaskGroup = {
    id: 1,
    name: 'Cage',
    taskIds: [task.id],
    formsAppEnvironmentId: task.formsAppEnvironmentId,
    organisationId: task.organisationId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const taskGroupInstance: ScheduledTasksTypes.TaskGroupInstance = {
    taskGroupId: taskGroup.id,
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

      expect(result).toEqual(
        'https://some-url.com?name=blinkybill&home=gosford',
      )
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

      expect(result).toEqual(
        'https://some-url.com?name=blinkybill&koala=blinkybill',
      )
    })

    test('should replace only one(1) instance of {ELEMENT} with correct property value', () => {
      const url = 'https://some-url.com?name={ELEMENT:name}'

      const result = replaceInjectablesWithSubmissionValues(url, {
        ...baseOptions,
        submission: {
          name: 'blinkybill',
        },
      })
      expect(result).toEqual('https://some-url.com?name=blinkybill')
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
      expect(result).toEqual(expected)
    })

    test('Original string is returned if no tokens present', async () => {
      const text = 'abc def {ELEMENT:}'
      const result = replaceInjectablesWithSubmissionValues(text, {
        ...baseOptions,
        submission,
      })
      expect(result).toEqual(text)
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

      expect(result).toEqual('person@email.com')
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

      expect(result).toEqual('autre_person@email.com')
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

    expect(result).toEqual(
      'person@email.com;autre_person@email.com;person@email.com',
    )
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

      expect(result).toEqual(expected)
    })

    test('should replace task based props', () => {
      const result = replaceInjectablesWithSubmissionValues(text, {
        ...baseOptions,
        submission: {},
      })

      expect(result).toEqual(expected)
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

      expect(result).toEqual('person1')
    })
  })
})
