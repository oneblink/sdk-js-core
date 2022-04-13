# OneBlink SDK - JavaScript Core | Usage

## Payment Service

Helper functions for payments

```js
import { paymentService } from '@oneblink/sdk-core'
```

- [`checkForPaymentEvent()`](#checkforpaymentevent)

### `checkForPaymentEvent()`

Examine a submission and its form definition to validate whether a payment workflow event needs to run.

```js
const result = paymentService.checkForPaymentEvent(form, submission)
```
