# OneBlink SDK - JavaScript Core | Usage

## Payment Amount Validation

Helper functions for validating payment totals

```js
import { validatePaymentAmount } from '@oneblink/sdk-core'
```

- [`validatePaymentAmount()`](#validatepaymentamount)

### `validatePaymentAmount()`

Examine a submission and its form definition to validate whether a payment form event needs to run.

```js
const result = validatePaymentAmount(form.definition, submission)
```
