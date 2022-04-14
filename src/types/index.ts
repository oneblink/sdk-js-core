export type FormElementsCtrl = {
  model: Record<string, unknown>
  flattenedElements: import('@oneblink/types').FormTypes.FormElement[]
  parentFormElementsCtrl?: FormElementsCtrl
}
