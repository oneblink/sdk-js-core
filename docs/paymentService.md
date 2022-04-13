# OneBlink SDK - JavaScript Core | Usage

## Payment Service

Helper functions for payments

```js
import { paymentService } from '@oneblink/sdk-core'
```

- [`checkFormPaymentEvent()`](#checkformpaymentevent)

### `checkFormPaymentEvent()`

Examine a submission and its form definition to validate whether a payment workflow event needs to run.

```js
const result = paymentService.checkFormPaymentEvent(form, submission)
```
