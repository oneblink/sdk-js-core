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
    const comparisonElementOne: FormTypes.FormElement = {
      id: 'comparisonNumberOne',
      name: 'comparisonNumberOne',
      label: 'comparisonNumber',
      type: 'number',
      required: false,
      isSlider: false,
      conditionallyShow: false,
      isDataLookup: false,
      isElementLookup: false,
    }
    const comparisonElementTwo: FormTypes.FormElement = {
      id: 'comparisonNumberTwo',
      name: 'comparisonNumberTwo',
      label: 'comparisonNumber',
      type: 'number',
      required: false,
      isSlider: false,
      conditionallyShow: false,
      isDataLookup: false,
      isElementLookup: false,
    }
    const nestedPredicate: ConditionTypes.ConditionalPredicate = {
      elementId: 'comparisonNumberOne',
      type: 'NUMERIC',
      operator: '===',
      compareWith: 'ELEMENT',
      value: 'comparisonNumberTwo',
    }
    const nestedFormPredicate: ConditionTypes.ConditionalPredicate = {
      elementId: 'formFormElement',
      type: 'FORM',
      predicate: nestedPredicate,
    }
    const formFormElement: FormTypes.FormFormElement = {
      id: 'formFormElement',
      formId: 1,
      name: 'formFormElement',
      type: 'form',
      conditionallyShow: false,
      elements: [comparisonElementOne, comparisonElementTwo],
    }
    const isShown = evaluateConditionalPredicate({
      predicate: nestedFormPredicate,
      formElementsCtrl: {
        flattenedElements: flattenFormElements([formFormElement]),
        model: {
          formFormElement: {
            comparisonNumberOne: 1,
            comparisonNumberTwo: 1,
          },
        },
      },
    })

    expect(isShown).toBe(formFormElement)
  })

  test('should show element conditionally shown from element within a deeply nested form element', () => {
    const comparisonElementOne: FormTypes.FormElement = {
      id: 'comparisonNumberOne',
      name: 'comparisonNumberOne',
      label: 'comparisonNumber',
      type: 'number',
      required: false,
      isSlider: false,
      conditionallyShow: false,
      isDataLookup: false,
      isElementLookup: false,
    }
    const comparisonElementTwo: FormTypes.FormElement = {
      id: 'comparisonNumberTwo',
      name: 'comparisonNumberTwo',
      label: 'comparisonNumber',
      type: 'number',
      required: false,
      isSlider: false,
      conditionallyShow: false,
      isDataLookup: false,
      isElementLookup: false,
    }
    const nestedPredicate: ConditionTypes.ConditionalPredicate = {
      elementId: 'comparisonNumberOne',
      type: 'NUMERIC',
      operator: '===',
      compareWith: 'ELEMENT',
      value: 'comparisonNumberTwo',
    }
    const nestedFormPredicate: ConditionTypes.ConditionalPredicate = {
      elementId: 'childFormFormElement',
      type: 'FORM',
      predicate: nestedPredicate,
    }
    const formPredicate: ConditionTypes.ConditionalPredicate = {
      elementId: 'parentFormFormElement',
      type: 'FORM',
      predicate: nestedFormPredicate,
    }
    const childFormFormElement: FormTypes.FormFormElement = {
      id: 'childFormFormElement',
      formId: 1,
      name: 'childFormFormElement',
      type: 'form',
      conditionallyShow: false,
      elements: [comparisonElementOne, comparisonElementTwo],
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
      predicate: formPredicate,
      formElementsCtrl: {
        flattenedElements: flattenFormElements([parentFormFormElement]),
        model: {
          parentFormFormElement: {
            childFormFormElement: {
              comparisonNumberOne: 1,
              comparisonNumberTwo: 1,
            },
          },
        },
      },
    })

    expect(isShown).toBe(parentFormFormElement)
  })
})
