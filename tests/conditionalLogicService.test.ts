import { FormTypes } from '@oneblink/types'
import { evaluateConditionalPredicates } from '../src/conditionalLogicService'

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
})
