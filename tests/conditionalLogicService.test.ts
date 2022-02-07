import { FormTypes } from '@oneblink/types'
import {
  evaluateConditionalPredicates,
  generateFormElementsConditionallyShown,
} from '../src/conditionalLogicService'

describe('evaluateConditionalPredicates', () => {
  const generateFormElements = (): FormTypes.FormElement[] => [
    {
      name: 'heading',
      label: 'Heading',
      type: 'heading',
      id: '1239fd3a-f9b6-4c21-9d28-3582170bc6b4',
      headingType: 2,
      conditionallyShow: false,
      requiresAllConditionallyShowPredicates: false,
    },
    {
      name: 'checkboxes',
      label: 'Checkboxes',
      type: 'checkboxes',
      required: false,
      id: '3534abe4-b0b5-4ffa-a216-49c223ab6f95',
      options: [
        {
          id: '9ce633dd-22d6-4e0e-a9e0-1aa62d435e72',
          label: 'First',
          value: 'a',
        },
        {
          id: '5850b32c-3833-4498-a072-47fcc8122242',
          label: 'Second',
          value: 'b',
        },
        {
          id: 'ab363e9f-a63f-4923-ba0d-47892fc26a93',
          label: 'Third',
          value: 'c',
        },
      ],
      readOnly: false,
      buttons: false,
      optionsType: 'CUSTOM',
      conditionallyShowOptions: false,
      isDataLookup: false,
      isElementLookup: false,
      conditionallyShow: false,
      requiresAllConditionallyShowPredicates: false,
    },
    {
      name: 'radio',
      label: 'Radio',
      type: 'radio',
      required: false,
      id: '3534abe4-b0b5-4ffa-a216-49c223ab6f96',
      options: [
        {
          id: '9ce633dd-22d6-4e0e-a9e0-1aa62d435e7a',
          label: 'First',
          value: 'a',
        },
        {
          id: '5850b32c-3833-4498-a072-47fcc812224b',
          label: 'Second',
          value: 'b',
        },
        {
          id: 'ab363e9f-a63f-4923-ba0d-47892fc26a9c',
          label: 'Third',
          value: 'c',
        },
      ],
      readOnly: false,
      buttons: false,
      optionsType: 'CUSTOM',
      conditionallyShowOptions: false,
      isDataLookup: false,
      isElementLookup: false,
      conditionallyShow: false,
      requiresAllConditionallyShowPredicates: false,
    },
  ]

  test('should meet conditions for checkboxes', () => {
    const result = evaluateConditionalPredicates({
      isConditional: true,
      requiresAllConditionalPredicates: false,
      conditionalPredicates: [
        {
          type: 'OPTIONS',
          elementId: '3534abe4-b0b5-4ffa-a216-49c223ab6f95',
          optionIds: ['9ce633dd-22d6-4e0e-a9e0-1aa62d435e72'],
        },
      ],
      formElements: generateFormElements(),
      submission: {
        checkboxes: ['a'],
      },
    })
    expect(result).toBe(true)
  })

  test('should not meet conditions for checkboxes', () => {
    const result = evaluateConditionalPredicates({
      isConditional: true,
      requiresAllConditionalPredicates: false,
      conditionalPredicates: [
        {
          type: 'OPTIONS',
          elementId: '3534abe4-b0b5-4ffa-a216-49c223ab6f95',
          optionIds: ['9ce633dd-22d6-4e0e-a9e0-1aa62d435e72'],
        },
      ],
      formElements: generateFormElements(),
      submission: {
        checkboxes: ['b'],
      },
    })
    expect(result).toBe(false)
  })

  test('should meet conditions for radio buttons', () => {
    const result = evaluateConditionalPredicates({
      isConditional: true,
      requiresAllConditionalPredicates: false,
      conditionalPredicates: [
        {
          type: 'OPTIONS',
          elementId: '3534abe4-b0b5-4ffa-a216-49c223ab6f96',
          optionIds: ['9ce633dd-22d6-4e0e-a9e0-1aa62d435e7a'],
        },
      ],
      formElements: generateFormElements(),
      submission: {
        radio: 'a',
      },
    })
    expect(result).toBe(true)
  })

  test('should not meet conditions for radio buttons', () => {
    const result = evaluateConditionalPredicates({
      isConditional: true,
      requiresAllConditionalPredicates: false,
      conditionalPredicates: [
        {
          type: 'OPTIONS',
          elementId: '3534abe4-b0b5-4ffa-a216-49c223ab6f96',
          optionIds: ['9ce633dd-22d6-4e0e-a9e0-1aa62d435e7a'],
        },
      ],
      formElements: generateFormElements(),
      submission: {
        radio: 'b',
      },
    })
    expect(result).toBe(false)
  })

  test('should generate formElementsConditionallyShown', () => {
    const result = generateFormElementsConditionallyShown({
      submission: {
        radio: ['hide'],
        text: 'hidden text'
      },
      formElements: [
        {
          name: 'radio',
          label: 'Radio',
          type: 'radio',
          required: false,
          id: '5ef3beb8-8ac8-4c8d-9fd3-d8197113bf54',
          conditionallyShow: false,
          options: [
            {
              id: '9a44e15a-5929-419d-825e-b3dc0a29591f',
              label: 'Show',
              value: 'show',
            },
            {
              id: 'd776ed42-072c-4bf8-9879-874b2bef85d3',
              label: 'Hide',
              value: 'Hide',
            },
          ],
          readOnly: false,
          isDataLookup: false,
          isElementLookup: false,
          buttons: false,
          optionsType: 'CUSTOM',
          conditionallyShowOptions: false,
        },
        {
          name: 'text',
          label: 'Text',
          type: 'text',
          required: false,
          id: '8fbddb41-348d-494c-904b-56a2c4361f13',
          requiresAllConditionallyShowPredicates: false,
          conditionallyShow: true,
          conditionallyShowPredicates: [
            {
              elementId: '5ef3beb8-8ac8-4c8d-9fd3-d8197113bf54',
              optionIds: ['9a44e15a-5929-419d-825e-b3dc0a29591f'],
              type: 'OPTIONS',
            },
          ],
          readOnly: false,
          isDataLookup: false,
          isElementLookup: false,
        },
      ],
      parentFormElementsCtrl: undefined,
    })
    expect(result.text).toBeDefined()
    expect(result.text?.isHidden).toBe(true)
    expect(result.radio).toBeDefined()
    expect(result.radio?.isHidden).toBe(false)
  })
})
