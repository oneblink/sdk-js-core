import { FormTypes } from '@oneblink/types'
import { replaceCustomValues } from '../src/submissionService'

describe('replaceCustomValues()', () => {
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
    submissionTimestamp: new Date().toISOString(),
    formatDate: () => '',
    formatDateTime: () => '',
    formatTime: () => '',
    formatCurrency: () => '',
    formatNumber: () => '',
  }
  describe('Form redirect URL', () => {
    test('should replace all instances of {ELEMENT} with correct property value', () => {
      const url = 'https://some-url.com?name={ELEMENT:name}&home={ELEMENT:home}'

      const result = replaceCustomValues(url, {
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

      const result = replaceCustomValues(url, {
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

      const result = replaceCustomValues(url, {
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
      const result = replaceCustomValues(text, {
        ...baseOptions,
        submission,
      })
      expect(result).toEqual(expected)
    })

    test('Original string is returned if no tokens present', async () => {
      const text = 'abc def {ELEMENT:}'
      const result = replaceCustomValues(text, {
        ...baseOptions,
        submission,
      })
      expect(result).toEqual(text)
    })
  })
})
