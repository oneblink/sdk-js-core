import {
  FormTypes,
  SubmissionEventTypes,
  SubmissionTypes,
} from '@oneblink/types'
import { conditionalLogicService, formElementsService } from '.'
import {
  getRootElementValueById,
  ReplaceInjectablesFormatters,
} from './submissionService'

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
  value: string
  /** A key to identify the detail */
  key: string
}

/**
 * Retrieve an array of detail items from a form submission payment.
 *
 * #### Example
 *
 * ```js
 * const detailItems =
 *   paymentService.getDisplayDetailsFromFormSubmissionPayment(
 *     formSubmissionPayment,
 *     {
 *       formatCurrency,
 *       formatDateTime,
 *       formatDate,
 *     },
 *   )
 * ```
 *
 * @param formSubmissionPayment
 * @param options
 * @returns
 */
export const getDisplayDetailsFromFormSubmissionPayment = (
  /** The form submission payment to get the details from */
  formSubmissionPayment: SubmissionTypes.FormSubmissionPayment,
  {
    formatCurrency,
    formatDateTime,
    formatDate,
  }: Pick<
    ReplaceInjectablesFormatters,
    'formatCurrency' | 'formatDate' | 'formatDateTime'
  >,
): PaymentDisplayDetail[] => {
  switch (formSubmissionPayment.type) {
    case 'NSW_GOV_PAY': {
      const { paymentTransaction } = formSubmissionPayment
      if (!paymentTransaction || !paymentTransaction.agencyCompletionPayment) {
        return []
      }
      return [
        {
          key: 'completionReference',
          label: 'Completion Reference',
          value:
            paymentTransaction.agencyCompletionPayment
              .paymentCompletionReference,
        },
        {
          key: 'paymentReference',
          label: 'Payment Reference',
          value: paymentTransaction.agencyCompletionPayment.paymentReference,
        },
        {
          key: 'bankReference',
          label: 'Bank Reference',
          value: paymentTransaction.agencyCompletionPayment.bankReference,
        },
        {
          key: 'paymentMethod',
          label: 'Payment Method',
          value: paymentTransaction.agencyCompletionPayment.paymentMethod,
        },
        ...(paymentTransaction.agencyCompletionPayment.paymentMethod ===
          'BPAY' && paymentTransaction.agencyCompletionPayment.bPay?.billerCode
          ? [
              {
                key: 'billerCode',
                label: 'BPay Biller Code',
                value:
                  paymentTransaction.agencyCompletionPayment.bPay.billerCode,
              },
            ]
          : []),
        ...(paymentTransaction.agencyCompletionPayment.paymentMethod === 'CARD'
          ? [
              {
                key: 'creditCardMask',
                label: 'Card Number',
                value: `xxxx xxxx xxxx ${paymentTransaction.agencyCompletionPayment.card?.last4Digits}`,
              },
            ]
          : []),
        {
          key: 'amount',
          label: 'Amount',
          value: formatCurrency(
            paymentTransaction.agencyCompletionPayment.amount,
          ),
        },
        {
          key: 'surchargeAmount',
          label: 'Surcharge Amount',
          value: formatCurrency(
            paymentTransaction.agencyCompletionPayment.surcharge,
          ),
        },
        {
          key: 'surchargeGST',
          label: 'Surcharge GST',
          value: formatCurrency(
            paymentTransaction.agencyCompletionPayment.surchargeGst,
          ),
        },
        {
          key: 'createdDateTime',
          label: 'Created Date Time',
          value: formatDateTime(formSubmissionPayment.createdAt),
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
          label: 'Receipt Number',
          value: paymentTransaction.ReceiptNumber,
        },
        {
          key: 'crn1',
          label: 'CRN 1',
          value: paymentTransaction.Crn1,
        },
        {
          key: 'crn2',
          label: 'CRN 2',
          value: paymentTransaction.Crn2,
        },
        {
          key: 'crn3',
          label: 'CRN 3',
          value: paymentTransaction.Crn3,
        },
        {
          key: 'billerCode',
          label: 'Biller Code',
          value: paymentTransaction.BillerCode,
        },
        {
          key: 'creditCardMask',
          label: 'Card Number',
          value: paymentTransaction.CardDetails.MaskedCardNumber,
        },
        {
          key: 'amount',
          label: 'Amount',
          value: formatCurrency(paymentTransaction.Amount / 100),
        },
        {
          key: 'surchargeAmount',
          label: 'Surcharge Amount',
          value: formatCurrency(paymentTransaction.AmountSurcharge / 100),
        },
        {
          key: 'processedDateTime',
          label: 'Processed Date Time',
          value: formatDateTime(paymentTransaction.ProcessedDateTime),
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
      const result = []
      if (transactionId) {
        result.push({
          key: 'transactionId',
          label: 'Transaction Id',
          value: transactionId,
        })
      }
      if (orderNumber) {
        result.push({
          key: 'orderNumber',
          label: 'Order Number',
          value: orderNumber,
        })
      }
      if (paymentType) {
        result.push({
          key: 'paymentType',
          label: 'Payment Type',
          value: paymentType,
        })
      }
      if (creditCardMask) {
        result.push({
          key: 'creditCardMask',
          label: 'Card Number',
          value: creditCardMask,
        })
      }
      if (amount) {
        result.push({
          key: 'amount',
          label: 'Amount',
          value: amount,
        })
      }
      if (createdDateTime) {
        result.push({
          key: 'createdDateTime',
          label: 'Created At',
          value: formatDateTime(createdDateTime),
        })
      }

      return result
    }
    case 'WESTPAC_QUICK_STREAM': {
      const { paymentTransaction } = formSubmissionPayment
      if (!paymentTransaction) {
        return []
      }

      return [
        {
          key: 'receiptNumber',
          label: 'Receipt Number',
          value: paymentTransaction.receiptNumber,
        },
        {
          key: 'paymentReferenceNumber',
          label: 'Payment Reference',
          value: paymentTransaction.paymentReferenceNumber,
        },
        {
          key: 'customerReferenceNumber',
          label: 'Customer Reference Number',
          value: paymentTransaction.customerReferenceNumber,
        },
        ...(paymentTransaction.totalAmount
          ? [
              {
                key: 'amount',
                label: 'Amount',
                value: formatCurrency(
                  parseFloat(paymentTransaction.totalAmount.amount.toString()),
                ),
              },
            ]
          : []),
        ...(paymentTransaction.surchargeAmount.amount
          ? [
              {
                key: 'surchargeAmount',
                label: 'Surcharge Amount',
                value: formatCurrency(
                  parseFloat(
                    paymentTransaction.surchargeAmount.amount.toString(),
                  ),
                ),
              },
            ]
          : []),
        {
          key: 'settlementDate',
          label: 'Settlement Date',
          value: formatDate(paymentTransaction.settlementDate),
        },
      ]
    }
  }
}
