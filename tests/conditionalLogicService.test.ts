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
})

describe('generateFormElementsConditionallyShown', () => {
  test('should generate formElementsConditionallyShown', () => {
    const result = generateFormElementsConditionallyShown({
      submission: {
        radio: ['hide'],
        text: 'hidden text',
        predicateNumber: 1,
        comparisonNumber: 2,
        repeatableSet: [
          {
            repeatableSetPredicateNumber: 1,
            repeatableSetComparisonNumber: 2,
          },
        ],
      },
      formElements: [
        {
          name: 'radio',
          label: 'Radio',
          type: 'radio',
          required: false,
          id: 'radio',
          conditionallyShow: false,
          options: [
            {
              id: 'show',
              label: 'Show',
              value: 'show',
            },
            {
              id: 'hide',
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
          id: 'text',
          requiresAllConditionallyShowPredicates: false,
          conditionallyShow: true,
          conditionallyShowPredicates: [
            {
              elementId: 'radio',
              optionIds: ['show'],
              type: 'OPTIONS',
            },
          ],
          readOnly: false,
          isDataLookup: false,
          isElementLookup: false,
        },
        {
          name: 'predicateNumber',
          label: 'Predicate Number',
          type: 'number',
          required: false,
          isSlider: false,
          id: 'predicateNumber',
          requiresAllConditionallyShowPredicates: false,
          conditionallyShow: false,
          readOnly: false,
          isDataLookup: false,
          isElementLookup: false,
        },
        {
          name: 'comparisonNumber',
          label: 'comparison Number',
          type: 'number',
          required: false,
          isSlider: false,
          id: 'comparisonNumber',
          requiresAllConditionallyShowPredicates: false,
          conditionallyShow: false,
          readOnly: false,
          isDataLookup: false,
          isElementLookup: false,
        },
        {
          name: 'textHiddenByNumbers',
          label: 'text',
          type: 'text',
          required: false,
          id: 'textHiddenByNumbers',
          requiresAllConditionallyShowPredicates: false,
          conditionallyShow: true,
          conditionallyShowPredicates: [
            {
              elementId: 'predicateNumber',
              operator: '===',
              compareWith: 'ELEMENT',
              value: 'comparisonNumber',
              type: 'NUMERIC',
            },
          ],
          readOnly: false,
          isDataLookup: false,
          isElementLookup: false,
        },
        {
          name: 'textShownByNumbers',
          label: 'text',
          type: 'text',
          required: false,
          id: 'textHiddenByNumbers',
          requiresAllConditionallyShowPredicates: false,
          conditionallyShow: true,
          conditionallyShowPredicates: [
            {
              elementId: 'predicateNumber',
              operator: '!==',
              compareWith: 'ELEMENT',
              value: 'comparisonNumber',
              type: 'NUMERIC',
            },
          ],
          readOnly: false,
          isDataLookup: false,
          isElementLookup: false,
        },
        {
          name: 'repeatableSet',
          label: 'repeatableSet',
          type: 'repeatableSet',
          id: 'repeatableSet',
          requiresAllConditionallyShowPredicates: false,
          conditionallyShow: false,
          elements: [
            {
              name: 'repeatableSetTextHiddenByNumbers',
              label: 'text',
              type: 'text',
              required: false,
              id: 'repeatableSetTextHiddenByNumbers',
              requiresAllConditionallyShowPredicates: false,
              conditionallyShow: true,
              conditionallyShowPredicates: [
                {
                  elementId: 'predicateNumber',
                  operator: '===',
                  compareWith: 'ELEMENT',
                  value: 'comparisonNumber',
                  type: 'NUMERIC',
                },
              ],
              readOnly: false,
              isDataLookup: false,
              isElementLookup: false,
            },
            {
              name: 'repeatableSetTextShownByNumbers',
              label: 'text',
              type: 'text',
              required: false,
              id: 'repeatableSetTextShownByNumbers',
              requiresAllConditionallyShowPredicates: false,
              conditionallyShow: true,
              conditionallyShowPredicates: [
                {
                  elementId: 'predicateNumber',
                  operator: '!==',
                  compareWith: 'ELEMENT',
                  value: 'comparisonNumber',
                  type: 'NUMERIC',
                },
              ],
              readOnly: false,
              isDataLookup: false,
              isElementLookup: false,
            },
            {
              name: 'repeatableSetPredicateNumber',
              label: 'Predicate Number',
              type: 'number',
              required: false,
              isSlider: false,
              id: 'repeatableSetPredicateNumber',
              requiresAllConditionallyShowPredicates: false,
              conditionallyShow: false,
              readOnly: false,
              isDataLookup: false,
              isElementLookup: false,
            },
            {
              name: 'repeatableSetComparisonNumber',
              label: 'comparison Number',
              type: 'number',
              required: false,
              isSlider: false,
              id: 'repeatableSetComparisonNumber',
              requiresAllConditionallyShowPredicates: false,
              conditionallyShow: false,
              readOnly: false,
              isDataLookup: false,
              isElementLookup: false,
            },
            {
              name: 'repeatableSetTextShownByRepeatableSetNumbers',
              label: 'text',
              type: 'text',
              required: false,
              id: 'repeatableSetTextShownByRepeatableSetNumbers',
              requiresAllConditionallyShowPredicates: false,
              conditionallyShow: true,
              conditionallyShowPredicates: [
                {
                  elementId: 'repeatableSetPredicateNumber',
                  operator: '!==',
                  compareWith: 'ELEMENT',
                  value: 'repeatableSetComparisonNumber',
                  type: 'NUMERIC',
                },
              ],
              readOnly: false,
              isDataLookup: false,
              isElementLookup: false,
            },
            {
              name: 'repeatableSetTextHiddenByRepeatableSetNumbers',
              label: 'text',
              type: 'text',
              required: false,
              id: 'repeatableSetTextHiddenByRepeatableSetNumbers',
              requiresAllConditionallyShowPredicates: false,
              conditionallyShow: true,
              conditionallyShowPredicates: [
                {
                  elementId: 'repeatableSetPredicateNumber',
                  operator: '===',
                  compareWith: 'ELEMENT',
                  value: 'repeatableSetComparisonNumber',
                  type: 'NUMERIC',
                },
              ],
              readOnly: false,
              isDataLookup: false,
              isElementLookup: false,
            },
            {
              name: 'repeatableSetTextHiddenByRepeatableSetNumberAndRootNumber',
              label: 'text',
              type: 'text',
              required: false,
              id: 'repeatableSetTextHiddenByRepeatableSetNumberAndRootNumber',
              requiresAllConditionallyShowPredicates: false,
              conditionallyShow: true,
              conditionallyShowPredicates: [
                {
                  elementId: 'predicateNumber',
                  operator: '===',
                  compareWith: 'ELEMENT',
                  value: 'repeatableSetComparisonNumber',
                  type: 'NUMERIC',
                },
              ],
              readOnly: false,
              isDataLookup: false,
              isElementLookup: false,
            },
            {
              name: 'repeatableSetTextShownByRepeatableSetNumberAndRootNumber',
              label: 'text',
              type: 'text',
              required: false,
              id: 'repeatableSetTextShownByRepeatableSetNumberAndRootNumber',
              requiresAllConditionallyShowPredicates: false,
              conditionallyShow: true,
              conditionallyShowPredicates: [
                {
                  elementId: 'predicateNumber',
                  operator: '!==',
                  compareWith: 'ELEMENT',
                  value: 'repeatableSetComparisonNumber',
                  type: 'NUMERIC',
                },
              ],
              readOnly: false,
              isDataLookup: false,
              isElementLookup: false,
            },
            {
              name: 'repeatableSetTextHiddenByRepeatableSetNumberAndRootNumberOpposite',
              label: 'text',
              type: 'text',
              required: false,
              id: 'repeatableSetTextHiddenByRepeatableSetNumberAndRootNumberOpposite',
              requiresAllConditionallyShowPredicates: false,
              conditionallyShow: true,
              conditionallyShowPredicates: [
                {
                  elementId: 'repeatableSetPredicateNumber',
                  operator: '===',
                  compareWith: 'ELEMENT',
                  value: 'comparisonNumber',
                  type: 'NUMERIC',
                },
              ],
              readOnly: false,
              isDataLookup: false,
              isElementLookup: false,
            },
            {
              name: 'repeatableSetTextShownByRepeatableSetNumberAndRootNumberOpposite',
              label: 'text',
              type: 'text',
              required: false,
              id: 'repeatableSetTextShownByRepeatableSetNumberAndRootNumberOpposite',
              requiresAllConditionallyShowPredicates: false,
              conditionallyShow: true,
              conditionallyShowPredicates: [
                {
                  elementId: 'repeatableSetPredicateNumber',
                  operator: '!==',
                  compareWith: 'ELEMENT',
                  value: 'comparisonNumber',
                  type: 'NUMERIC',
                },
              ],
              readOnly: false,
              isDataLookup: false,
              isElementLookup: false,
            },
          ],
        },
      ],
    })
    expect(result).toEqual({
      comparisonNumber: {
        isHidden: false,
        type: 'formElement',
      },
      predicateNumber: {
        isHidden: false,
        type: 'formElement',
      },
      radio: {
        isHidden: false,
        type: 'formElement',
      },
      text: {
        isHidden: true,
        type: 'formElement',
      },
      textHiddenByNumbers: {
        isHidden: true,
        type: 'formElement',
      },
      textShownByNumbers: {
        isHidden: false,
        type: 'formElement',
      },
      repeatableSet: {
        entries: {
          '0': {
            repeatableSetComparisonNumber: {
              isHidden: false,
              type: 'formElement',
            },
            repeatableSetPredicateNumber: {
              isHidden: false,
              type: 'formElement',
            },
            repeatableSetTextHiddenByNumbers: {
              isHidden: true,
              type: 'formElement',
            },
            repeatableSetTextShownByNumbers: {
              isHidden: false,
              type: 'formElement',
            },
            repeatableSetTextShownByRepeatableSetNumbers: {
              isHidden: false,
              type: 'formElement',
            },
            repeatableSetTextHiddenByRepeatableSetNumbers: {
              isHidden: true,
              type: 'formElement',
            },
            repeatableSetTextShownByRepeatableSetNumberAndRootNumber: {
              isHidden: false,
              type: 'formElement',
            },
            repeatableSetTextHiddenByRepeatableSetNumberAndRootNumber: {
              isHidden: true,
              type: 'formElement',
            },
            repeatableSetTextHiddenByRepeatableSetNumberAndRootNumberOpposite: {
              isHidden: true,
              type: 'formElement',
            },
            repeatableSetTextShownByRepeatableSetNumberAndRootNumberOpposite: {
              isHidden: false,
              type: 'formElement',
            },
          },
        },
        isHidden: false,
        type: 'repeatableSet',
      },
    })
  })
})
