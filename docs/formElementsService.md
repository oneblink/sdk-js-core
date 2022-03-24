# OneBlink SDK - JavaScript Core | Usage

## Form Elements Service

Helper functions for handling form elements

```js
import { formElementsService } from '@oneblink/sdk-core'
```

- [`forEachFormElement()`](#foreachformelement)
- [`forEachFormElementWithOptions()`](#foreachformelementwithoptions)
- [`findFormElement()`](#findformelement)
- [`parseFormElementOptionsSet()`](#parseformelementoptionsset)
- [`flattenFormElements()`](#flattenFormElements)
- [`getRootElementValueById()`](#getrootelementvaluebyid)

### `forEachFormElement()`

Iterate over all form elements, also iterating over nested form element (e.g. page elements).

```js
formElementsService.forEachFormElement(form.elements, (formElement) => {
  // do something with formElement
})
```

### `forEachFormElementWithOptions()`

Iterate over all form elements that have options (e.g. `'select'` type elements), also iterating over nested form element (e.g. page elements).

```js
formElementsService.forEachFormElementWithOptions(
  form.elements,
  (formElementWithOptions) => {
    // do something with formElementWithOptions
  },
)
```

### `findFormElement()`

Iterate over all form elements and return an element that matches a predicate, also iterating over nested form element (e.g. page elements). Will return `undefined` if no matching element is found.

```js
const formElement = formElementsService.findFormElement(
  form.elements,
  (formElement) => {
    return formElement.id === '123-abc'
  },
)
```

### `parseFormElementOptionsSet()`

Parse unknown data as valid options for a forms element. This will always return an Array of valid options.

```js
const options = formElementsService.parseFormElementOptionsSet(data)
// "options" are valid for a form element
```

### `flattenFormElements()`

Takes the nested definition structure and returns all form elements as 1d array.

```js
const flattenedElements = formElementsService.flattenFormElements(form.elements)
```

### `getRootElementValueById()`

Takes a form element's id, the form elements and the submission data to return a value from the submission.

```js
const value = formElementsService.getRootElementById(
  formElementId,
  form.elements,
  submission,
)
```
