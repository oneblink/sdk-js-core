import { ConditionTypes, FormTypes } from '@oneblink/types'
import evaluateConditionalPredicate from '../../src/conditionalLogicService/evaluateConditionalPredicate'
import { flattenFormElements } from '../../src/formElementsService'

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
  const nestedPredicate: ConditionTypes.ConditionalPredicate = {
    elementId: 'formFormElement',
    type: 'FORM',
    predicate: predicate,
  }

  const nestedPredicateElement: FormTypes.FormElement = {
    id: 'predicateNumber',
    name: 'predicateNumber',
    label: 'predicateNumber',
    type: 'number',
    required: false,
    conditionallyShow: true,
    conditionallyShowPredicates: [nestedPredicate],
    isDataLookup: false,
    isElementLookup: false,
    isSlider: false,
  }
  const childFormFormElementPredicate: ConditionTypes.ConditionalPredicate = {
    elementId: 'childFormFormElement',
    type: 'FORM',
    predicate: predicate,
  }
  const parentFormFormElementPredicate: ConditionTypes.ConditionalPredicate = {
    elementId: 'parentFormFormElement',
    type: 'FORM',
    predicate: childFormFormElementPredicate,
  }

  const deeplyNestedPredicateElement: FormTypes.FormElement = {
    id: 'predicateNumber',
    name: 'predicateNumber',
    label: 'predicateNumber',
    type: 'number',
    required: false,
    conditionallyShow: true,
    conditionallyShowPredicates: [parentFormFormElementPredicate],
    isDataLookup: false,
    isElementLookup: false,
    isSlider: false,
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

  test('should show element conditionally shown from element within a form element', () => {
    const formFormElement: FormTypes.FormFormElement = {
      id: 'formFormElement',
      formId: 1,
      name: 'formFormElement',
      type: 'form',
      conditionallyShow: false,
      elements: [comparisonElement],
    }
    const isShown = evaluateConditionalPredicate({
      predicate: nestedPredicate,
      formElementsCtrl: {
        flattenedElements: flattenFormElements([
          formFormElement,
          nestedPredicateElement,
        ]),
        model: {
          formFormElement: {
            comparisonNumber: 1,
          },
          predicateNumber: 1,
        },
      },
    })

    expect(isShown).toBe(nestedPredicateElement)
  })

  test('should show element conditionally shown from element within a deeply nested form element', () => {
    const childFormFormElement: FormTypes.FormFormElement = {
      id: 'childFormFormElement',
      formId: 1,
      name: 'childFormFormElement',
      type: 'form',
      conditionallyShow: false,
      elements: [comparisonElement],
    }
    const parentFormFormElement: FormTypes.FormFormElement = {
      id: 'parentFormFormElement',
      formId: 1,
      name: 'parentFormFormElement',
      type: 'form',
      conditionallyShow: false,
      elements: [childFormFormElement],
    }
    const isShown = evaluateConditionalPredicate({
      predicate: parentFormFormElementPredicate,
      formElementsCtrl: {
        flattenedElements: flattenFormElements([
          parentFormFormElement,
          deeplyNestedPredicateElement,
        ]),
        model: {
          parentFormFormElement: {
            childFormFormElement: {
              comparisonNumber: 1,
            },
          },
          predicateNumber: 1,
        },
      },
    })

    expect(isShown).toBe(deeplyNestedPredicateElement)
  })
})
