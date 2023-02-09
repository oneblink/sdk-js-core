import { FormElement } from '@oneblink/types/typescript/forms'
import { generateFormElementsConditionallyShown } from '../../src/conditionalLogicService'

describe('generateFormElementsConditionallyShown', () => {
  const dynamicOptionsElement: FormElement = {
    name: 'dynamic',
    label: 'Radio',
    type: 'radio',
    required: false,
    id: '3ffbcd4d-d81e-4197-8ad6-179fccbb00b8',
    conditionallyShow: false,
    readOnly: false,
    buttons: false,
    optionsType: 'DYNAMIC',
    conditionallyShowOptions: false,
    isDataLookup: false,
    isElementLookup: false,
    dynamicOptionSetId: 123,
  }

  const dependantOptionsElement: FormElement = {
    name: 'dependant',
    label: 'Checkbox',
    type: 'checkboxes',
    required: false,
    id: 'bcfd48ca-01ea-47b8-af50-71c017773325',
    conditionallyShow: false,
    options: [
      {
        id: '310d340d-a778-4a66-b15b-9037d1689bad',
        label: 'Val1',
        value: 'Val1',
        attributes: [
          {
            elementId: '3ffbcd4d-d81e-4197-8ad6-179fccbb00b8',
            optionIds: ['option1'],
          },
        ],
      },
      {
        id: 'b576c455-43dc-49bb-ba76-c1e924b8a9bb',
        label: 'Val2',
        value: 'Val2',
        attributes: [
          {
            elementId: '3ffbcd4d-d81e-4197-8ad6-179fccbb00b8',
            optionIds: ['option2'],
          },
        ],
      },
    ],
    readOnly: false,
    buttons: false,
    optionsType: 'CUSTOM',
    conditionallyShowOptions: true,
    isDataLookup: false,
    isElementLookup: false,
    canToggleAll: false,
    conditionallyShowOptionsElementIds: [
      '3ffbcd4d-d81e-4197-8ad6-179fccbb00b8',
    ],
  }

  test('Dependant option element will evaluate options as "loading" when waiting for dynamic option dependencies to load and dependency has option selected', () => {
    const result = generateFormElementsConditionallyShown({
      formElements: [dynamicOptionsElement, dependantOptionsElement],
      submission: { dynamic: 'option1' },
    })
    expect(
      result.dependant?.type === 'formElement' &&
        result.dependant?.dependencyIsLoading,
    ).toBe(true)
  })

  test('Dependant option element will evaluate options as "show" when dynamic option dependencies have not loaded but nothing selected in dependency', () => {
    const result = generateFormElementsConditionallyShown({
      formElements: [dynamicOptionsElement, dependantOptionsElement],
      submission: {},
    })
    expect(
      result.dependant?.type === 'formElement' &&
        result.dependant?.options?.length === 2,
    ).toBe(true)
  })
})
