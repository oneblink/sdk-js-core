import { ConditionTypes, FormTypes } from '@oneblink/types'
import evaluateConditionalPredicate from '../../src/conditionalLogicService/evaluateConditionalPredicate'

describe('evaluateConditionalPredicate', () => {
  const predicate: ConditionTypes.ConditionalPredicate = {
    elementId: 'predicateNumber',
    type: 'NUMERIC',
    operator: '===',
    compareWith: 'ELEMENT',
    value: 'comparisonNumber',
  }
  const predicateElement: FormTypes.FormElement = {
    id: 'predicateNumber',
    name: 'predicateNumber',
    label: 'predicateNumber',
    type: 'number',
    required: false,
    isSlider: false,
    conditionallyShow: false,
    isDataLookup: false,
    isElementLookup: false,
  }
  const comparisonElement: FormTypes.FormElement = {
    id: 'comparisonNumber',
    name: 'comparisonNumber',
    label: 'comparisonNumber',
    type: 'number',
    required: false,
    isSlider: false,
    conditionallyShow: false,
    isDataLookup: false,
    isElementLookup: false,
  }
  const conditionalElement: FormTypes.FormElement = {
    id: 'conditionalElement',
    name: 'conditionalElement',
    label: 'conditionalElement',
    type: 'text',
    required: false,
    conditionallyShow: true,
    conditionallyShowPredicates: [predicate],
    isDataLookup: false,
    isElementLookup: false,
  }

  test('should show root element', () => {
    const isShown = evaluateConditionalPredicate({
      predicate,
      formElementsCtrl: {
        flattenedElements: [
          predicateElement,
          comparisonElement,
          conditionalElement,
        ],
        model: {
          predicateNumber: 1,
          comparisonNumber: 1,
        },
      },
    })
    expect(isShown).toBe(predicateElement)
  })

  test('should hide root element', () => {
    const isShown = evaluateConditionalPredicate({
      predicate,
      formElementsCtrl: {
        flattenedElements: [
          predicateElement,
          comparisonElement,
          conditionalElement,
        ],
        model: {
          predicateNumber: 1,
          comparisonNumber: 2,
        },
      },
    })
    expect(isShown).toBe(undefined)
  })

  test('should show repeatable set element', () => {
    const repeatableSetElement: FormTypes.FormElement = {
      id: 'repeatableSet',
      name: 'repeatableSet',
      label: 'repeatableSet',
      type: 'repeatableSet',
      conditionallyShow: false,
      elements: [conditionalElement],
    }
    const isShown = evaluateConditionalPredicate({
      predicate,
      formElementsCtrl: {
        flattenedElements: repeatableSetElement.elements,
        model: {},
        parentFormElementsCtrl: {
          flattenedElements: [
            predicateElement,
            comparisonElement,
            repeatableSetElement,
          ],
          model: {
            predicateNumber: 1,
            comparisonNumber: 1,
          },
        },
      },
    })
    expect(isShown).toBe(predicateElement)
  })
})
