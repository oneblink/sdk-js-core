import { FormTypes, SubmissionEventTypes } from '@oneblink/types'

const toOptionsElement = (
  e: FormTypes.FormElement,
): FormTypes.FormElementWithOptions | undefined => {
  switch (e.type) {
    case 'select':
    case 'compliance':
    case 'radio':
    case 'autocomplete':
    case 'checkboxes': {
      return e
    }
    default: {
      return
    }
  }
}

const toFormElementWithForm = (
  e: FormTypes.FormElement,
): FormTypes.FormElementWithForm | undefined => {
  switch (e.type) {
    case 'form':
    case 'infoPage': {
      return e
    }
    default: {
      return
    }
  }
}

const toFormElementWithoutForm = (
  e: FormTypes.FormElement,
): FormTypes.FormElementWithoutForm | undefined => {
  switch (e.type) {
    case 'form':
    case 'infoPage': {
      return
    }
    default: {
      return e
    }
  }
}

const toLookupElement = (
  e: FormTypes.FormElement,
): FormTypes.LookupFormElement | undefined => {
  switch (e.type) {
    case 'boolean':
    case 'checkboxes':
    case 'date':
    case 'datetime':
    case 'location':
    case 'number':
    case 'compliance':
    case 'radio':
    case 'select':
    case 'text':
    case 'textarea':
    case 'time':
    case 'barcodeScanner':
    case 'email':
    case 'telephone':
    case 'pointAddress':
    case 'geoscapeAddress':
    case 'civicaStreetName':
    case 'autocomplete': {
      return e
    }
    default: {
      return
    }
  }
}

const toNestedElementsElement = (
  e: FormTypes.FormElement,
): FormTypes.NestedElementsElement | undefined => {
  switch (e.type) {
    case 'repeatableSet':
    case 'section':
    case 'page': {
      return e
    }
    default: {
      return
    }
  }
}

type NamelessElement = FormTypes.PageElement | FormTypes.SectionElement
const toNamelessElement = (
  e: FormTypes.FormElement,
): NamelessElement | undefined => {
  switch (e.type) {
    case 'section':
    case 'page': {
      return e
    }
    default: {
      return
    }
  }
}

type NonNestedElementsFormElement =
  | FormTypes.NonNestedElementsElement
  | FormTypes.FormElementWithForm
const toNonNestedElementsElement = (
  e: FormTypes.FormElement,
): NonNestedElementsFormElement | undefined => {
  switch (e.type) {
    case 'repeatableSet':
    case 'section':
    case 'page': {
      return
    }
    default: {
      return e
    }
  }
}

const toPageElement = (
  e: FormTypes.FormElement,
): FormTypes.PageElement | undefined => {
  switch (e.type) {
    case 'page': {
      return e
    }
    default: {
      return
    }
  }
}

const toRepeatableSetElement = (
  e: FormTypes.FormElement,
): FormTypes.RepeatableSetElement | undefined => {
  switch (e.type) {
    case 'repeatableSet': {
      return e
    }
    default: {
      return
    }
  }
}

const formElements = {
  toOptionsElement,
  toFormElementWithForm,
  toFormElementWithoutForm,
  toLookupElement,
  toNestedElementsElement,
  toNamelessElement,
  toNonNestedElementsElement,
  toPageElement,
  toRepeatableSetElement,
}

const toPaymentSubmissionEvent = (
  e: SubmissionEventTypes.FormSubmissionEvent,
): SubmissionEventTypes.PaymentSubmissionEvent | undefined => {
  switch (e.type) {
    case 'BPOINT':
    case 'CP_PAY':
    case 'WESTPAC_QUICK_WEB': {
      return e
    }
    default: {
      return
    }
  }
}

const submissionEvents = {
  toPaymentSubmissionEvent,
}

export { formElements, submissionEvents }
