import {
  FormTypes,
  SubmissionEventTypes,
  SubmissionTypes,
} from '@oneblink/types'
import { conditionalLogicService, formElementsService } from '.'
import { getRootElementValueById } from './submissionService'

/**
 * Examine a submission and its form definition to validate whether a payment
 * workflow event needs to run.
 *
 * #### Example
 *
 * ```js
 * const result = paymentService.checkForPaymentEvent(form, submission)
 * ```
 *
 * @param definition
 * @param submission
 * @returns
 */
export function checkForPaymentEvent(
  definition: FormTypes.Form,
  submission: SubmissionTypes.S3SubmissionData['submission'],
):
  | {
      paymentSubmissionEvent: SubmissionEventTypes.FormPaymentEvent
      amount: number
    }
  | undefined {
  const paymentSubmissionEvents = definition.paymentEvents || []
  const paymentSubmissionEvent = paymentSubmissionEvents.find(
    (paymentSubmissionEvent) => {
      return (
        paymentSubmissionEvent &&
        conditionalLogicService.evaluateConditionalPredicates({
          isConditional: !!paymentSubmissionEvent.conditionallyExecute,
          requiresAllConditionalPredicates:
            !!paymentSubmissionEvent.requiresAllConditionallyExecutePredicates,
          conditionalPredicates:
            paymentSubmissionEvent.conditionallyExecutePredicates || [],
          submission: submission,
          formElements: definition.elements,
        })
      )
    },
  )

  if (!paymentSubmissionEvent) {
    return
  }
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

type PaymentDisplayDetail = {
  label: string
  value: string | undefined
  /** A key to identify the detail */
  key: string
  /** Use to determine how you display the detail */
  type: 'text' | 'datetime'
}

/**
 * Retrieve an array of detail items from a form submission payment.
 *
 * #### Example
 *
 * ```js
 * const detailItems =
 *   paymentService.getDisplayDetailsFromFormSubmissionPayment({
 *     formSubmissionPayment,
 *     formatCurrency,
 *   })
 * ```
 *
 * @param options
 * @returns
 */
export const getDisplayDetailsFromFormSubmissionPayment = ({
  formSubmissionPayment,
  formatCurrency,
  formatDateTime,
}: {
  /** The form submission payment to get the details from */
  formSubmissionPayment: SubmissionTypes.FormSubmissionPayment
  /** A function to format any curreny values */
  formatCurrency: (amount: number) => string
  /**
   * A function to format any dates. If this is not passed, datetimes will be
   * returned as iso strings.
   */
  formatDateTime?: (value: string) => string
}): PaymentDisplayDetail[] => {
  switch (formSubmissionPayment.type) {
    case 'NSW_GOV_PAY': {
      const { paymentTransaction } = formSubmissionPayment
      if (!paymentTransaction || !paymentTransaction.agencyCompletionPayment) {
        return []
      }
      return [
        {
          key: 'completionReference',
          type: 'text',
          label: 'Completion Reference',
          value:
            paymentTransaction.agencyCompletionPayment
              .paymentCompletionReference,
        },
        {
          key: 'paymentReference',
          type: 'text',
          label: 'Payment Reference',
          value: paymentTransaction.agencyCompletionPayment.paymentReference,
        },
        {
          key: 'bankReference',
          type: 'text',
          label: 'Bank Reference',
          value: paymentTransaction.agencyCompletionPayment.bankReference,
        },
        {
          key: 'paymentMethod',
          type: 'text',
          label: 'Payment Method',
          value: paymentTransaction.agencyCompletionPayment.paymentMethod,
        },
        {
          key: 'billerCode',
          type: 'text',
          label: 'BPay Biller Code',
          value:
            paymentTransaction.agencyCompletionPayment.paymentMethod === 'BPAY'
              ? paymentTransaction.agencyCompletionPayment.bPay?.billerCode
              : undefined,
        },
        {
          key: 'creditCardMask',
          type: 'text',
          label: 'Card Number',
          value:
            paymentTransaction.agencyCompletionPayment.paymentMethod === 'CARD'
              ? `xxxx xxxx xxxx ${paymentTransaction.agencyCompletionPayment.card?.last4Digits}`
              : undefined,
        },
        {
          key: 'amount',
          type: 'text',
          label: 'Amount',
          value: formatCurrency(
            paymentTransaction.agencyCompletionPayment.amount,
          ),
        },
        {
          key: 'surchargeAmount',
          type: 'text',
          label: 'Surcharge Amount',
          value: formatCurrency(
            paymentTransaction.agencyCompletionPayment.surcharge,
          ),
        },
        {
          key: 'surchargeGST',
          type: 'text',
          label: 'Surcharge GST',
          value: formatCurrency(
            paymentTransaction.agencyCompletionPayment.surchargeGst,
          ),
        },
        {
          key: 'createdDateTime',
          type: 'datetime',
          label: 'Created Date Time',
          value: formatDateTime
            ? formatDateTime(formSubmissionPayment.createdAt)
            : formSubmissionPayment.createdAt,
        },
      ]
    }
    case 'BPOINT': {
      const { paymentTransaction } = formSubmissionPayment
      if (!paymentTransaction) {
        return []
      }
      return [
        {
          key: 'receiptNumber',
          type: 'text',
          label: 'Receipt Number',
          value: paymentTransaction.ReceiptNumber,
        },
        {
          key: 'crn1',
          type: 'text',
          label: 'CRN 1',
          value: paymentTransaction.Crn1,
        },
        {
          key: 'crn2',
          type: 'text',
          label: 'CRN 2',
          value: paymentTransaction.Crn2,
        },
        {
          key: 'crn3',
          type: 'text',
          label: 'CRN 3',
          value: paymentTransaction.Crn3,
        },
        {
          key: 'billerCode',
          type: 'text',
          label: 'Biller Code',
          value: paymentTransaction.BillerCode,
        },
        {
          key: 'creditCardMask',
          type: 'text',
          label: 'Card Number',
          value: paymentTransaction.CardDetails.MaskedCardNumber,
        },
        {
          key: 'amount',
          type: 'text',
          label: 'Amount',
          value: formatCurrency(paymentTransaction.Amount / 100),
        },
        {
          key: 'surchargeAmount',
          type: 'text',
          label: 'Surcharge Amount',
          value: formatCurrency(paymentTransaction.AmountSurcharge / 100),
        },
        {
          key: 'processedDateTime',
          type: 'datetime',
          label: 'Processed Date Time',
          value: formatDateTime
            ? formatDateTime(paymentTransaction.ProcessedDateTime)
            : paymentTransaction.ProcessedDateTime,
        },
      ]
    }
    case 'CP_PAY': {
      const { paymentTransaction } = formSubmissionPayment
      if (!paymentTransaction) {
        return []
      }

      const determineDetails = () => {
        switch (paymentTransaction.cpPayVersion) {
          case 'v2': {
            return {
              transactionId: paymentTransaction.result.id,
              orderNumber:
                paymentTransaction.result.externalReferenceId ?? undefined,
              paymentType: paymentTransaction.result.paymentType,
              creditCardMask: paymentTransaction.result.lastFour
                ? `xxxx xxxx xxxx ${paymentTransaction.result.lastFour}`
                : undefined,
              amount:
                paymentTransaction.result.amount !== undefined
                  ? formatCurrency(paymentTransaction.result.amount)
                  : 'Unknown',
              createdDateTime: paymentTransaction.result.createdOnUtc,
            }
          }
          default: {
            return {
              transactionId: paymentTransaction.transactionId,
              orderNumber: paymentTransaction.orderNumber ?? undefined,
              paymentType:
                paymentTransaction.paymentTypeId === 1
                  ? 'Credit/Debit Card'
                  : paymentTransaction.paymentTypeId === 2
                  ? 'ACH'
                  : undefined,
              creditCardMask: paymentTransaction.lastFour
                ? `xxxx xxxx xxxx ${paymentTransaction.lastFour}`
                : undefined,
              amount: formatCurrency(paymentTransaction.amount),
              createdDateTime: paymentTransaction.createdAt,
            }
          }
        }
      }

      const {
        transactionId,
        orderNumber,
        paymentType,
        creditCardMask,
        amount,
        createdDateTime,
      } = determineDetails()
      return [
        {
          key: 'transactionId',
          type: 'text',
          label: 'Transaction Id',
          value: transactionId,
        },
        {
          key: 'orderNumber',
          type: 'text',
          label: 'Order Number',
          value: orderNumber,
        },
        {
          key: 'paymentType',
          type: 'text',
          label: 'Payment Type',
          value: paymentType,
        },
        {
          key: 'creditCardMask',
          type: 'text',
          label: 'Card Number',
          value: creditCardMask,
        },
        {
          key: 'amount',
          type: 'text',
          label: 'Amount',
          value: amount,
        },
        {
          key: 'createdDateTime',
          type: 'datetime',
          label: 'Created At',
          value:
            formatDateTime && createdDateTime
              ? formatDateTime(createdDateTime)
              : createdDateTime,
        },
      ]
    }
    case 'WESTPAC_QUICK_STREAM': {
      const { paymentTransaction } = formSubmissionPayment
      if (!paymentTransaction) {
        return []
      }

      return [
        {
          key: 'receiptNumber',
          type: 'text',
          label: 'Receipt Number',
          value: paymentTransaction.receiptNumber,
        },
        {
          key: 'paymentReferenceNumber',
          type: 'text',
          label: 'Payment Reference',
          value: paymentTransaction.paymentReferenceNumber,
        },
        {
          key: 'customerReferenceNumber',
          type: 'text',
          label: 'Customer Reference Number',
          value: paymentTransaction.customerReferenceNumber,
        },
        {
          key: 'amount',
          type: 'text',
          label: 'Amount',
          value: paymentTransaction.totalAmount
            ? formatCurrency(
                parseFloat(paymentTransaction.totalAmount.amount.toString()),
              )
            : undefined,
        },
        {
          key: 'surchargeAmount',
          type: 'text',
          label: 'Surcharge Amount',
          value: paymentTransaction.surchargeAmount.amount
            ? formatCurrency(
                parseFloat(
                  paymentTransaction.surchargeAmount.amount.toString(),
                ),
              )
            : undefined,
        },
        {
          key: 'settlementDate',
          type: 'text',
          label: 'Settlement Date',
          value: formatDateTime
            ? formatDateTime(paymentTransaction.settlementDate)
            : paymentTransaction.settlementDate,
        },
      ]
    }
  }
}
