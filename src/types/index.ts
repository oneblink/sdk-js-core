export type FormElementsCtrl = {
  model: Record<string, unknown>
  flattenedElements: import('@oneblink/types').FormTypes.FormElement[]
  parentFormElementsCtrl?: FormElementsCtrl
}

export type FormElementsConditionallyShown = Record<
  string,
  FormElementConditionallyShown
>

export type FormElementConditionallyShown =
  | undefined
  | {
      type: 'formElement'
      isHidden: boolean
      options?: import('@oneblink/types').FormTypes.ChoiceElementOption[]
    }
  | {
      type: 'formElements'
      isHidden: boolean
      formElements: FormElementsConditionallyShown | undefined
    }
  | {
      type: 'repeatableSet'
      isHidden: boolean
      entries: Record<string, FormElementsConditionallyShown | undefined>
    }

