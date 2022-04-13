# OneBlink SDK - JavaScript Core | Usage

## Scheduling Service

Helper functions for scheduling

```js
import { schedulingService } from '@oneblink/sdk-core'
```

- [`checkForSchedulingEvent()`](#checkforschedulingevent)

### `checkForSchedulingEvent()`

Examine a submission and its form definition to validate whether a scheduling workflow event needs to run.

```js
const result = schedulingService.checkFormSchedulingEvent(form, submission)
```
