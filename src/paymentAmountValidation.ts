import { FormTypes, SubmissionEventTypes } from '@oneblink/types'
import { formElementsService } from '.'
import { getRootElementValueById } from './formElementsService'

export function validatePaymentAmount(
  paymentSubmissionEvent: SubmissionEventTypes.PaymentSubmissionEvent,
  definition: FormTypes.Form,
  submission: { readonly [key: string]: unknown },
):
  | {
      paymentSubmissionEvent: SubmissionEventTypes.PaymentSubmissionEvent
      amount: number
    }
  | undefined {
  console.log(
    'Checking if submission with payment submission event needs processing',
  )

  const amountElement = formElementsService.findFormElement(
    definition.elements,
    (element) => element.id === paymentSubmissionEvent.configuration.elementId,
  )
  if (!amountElement || amountElement.type === 'page') {
    console.log(
      'Form has a payment submission event but the amount element does not exist, throwing error',
    )
    throw new Error(
      'We could not find the configuration required to make a payment. Please contact your administrator to ensure your application configuration has been completed successfully.',
    )
  }

  console.log('Found form element for payment submission event', amountElement)

  const amount = getRootElementValueById(
    amountElement.id,
    definition.elements,
    submission,
  )

  if (!amount) {
    console.log(
      'Form has a payment submission event but the amount has been entered as 0 or not at all, finishing as normal submission',
    )
    return
  }

  if (typeof amount !== 'number') {
    console.log(
      'Form has a payment submission event but the amount is not a number, throwing error',
    )
    throw new Error(
      'The configuration required to make a payment is incorrect. Please contact your administrator to ensure your application configuration has been completed successfully.',
    )
  }

  const result = {
    paymentSubmissionEvent,
    amount,
  }

  return result
}
