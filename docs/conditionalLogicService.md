# OneBlink SDK - JavaScript Core | Usage

## Conditional Logic Service

Helper functions for handling conditional logic

```js
import { conditionalLogicService } from '@oneblink/sdk-core'
```

- [`evaluateConditionalPredicates`](#evaluateconditionalpredicates)
- [`evaluateConditionalPredicate`](#evaluateconditionalpredicate)
- [`evaluateConditionalOptionsPredicate`](#evaluateconditionaloptionspredicate)

### `evaluateConditionalPredicates()`

Given a set of form elements and submission data, evaluate if predicates are met or not. Returns `true` or `false`.

```js
const evaluation = conditionalLogicService.evaluateConditionalPredicates({
  isConditional: true,
  requiresAllConditionalPredicates: false,
  conditionalPredicates: [
    {
      type: 'OPTIONS',
      elementId: '3534abe4-b0b5-4ffa-a216-49c223ab6f95',
      optionIds: ['9ce633dd-22d6-4e0e-a9e0-1aa62d435e72'],
    },
  ],
  submission: {
    checkboxes: ['a'],
  },
  formElements: [
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
  ],
})
```

### `evaluateConditionalPredicate()`

Given a form element and submission data, evaluate if a single predicate is met or not. Returns `true` or `false`.

```js
const evaluation = conditionalLogicService.evaluateConditionalPredicates({
  predicate: {
    type: 'OPTIONS',
    elementId: '3534abe4-b0b5-4ffa-a216-49c223ab6f95',
    optionIds: ['9ce633dd-22d6-4e0e-a9e0-1aa62d435e72'],
  },
  submission: {
    checkboxes: ['a'],
  },
  predicateElement: {
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
})
```

### `evaluateConditionalOptionsPredicate()`

Given a form element with options and submission data, evaluate if a single options based predicate is met or not. Returns `true` or `false`.

```js
const evaluation = conditionalLogicService.evaluateConditionalOptionsPredicate({
  predicate: {
    type: 'OPTIONS',
    elementId: '3534abe4-b0b5-4ffa-a216-49c223ab6f95',
    optionIds: ['9ce633dd-22d6-4e0e-a9e0-1aa62d435e72'],
  },
  submission: {
    checkboxes: ['a'],
  },
  predicateElement: {
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
})
```
