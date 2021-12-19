# OneBlink SDK - JavaScript Core | Usage

## ABN Service

Helper functions for handling ABN Records

```js
import { abnService } from '@oneblink/sdk-core'
```

- [`getBusinessNameFromABNRecord()`](#getbusinessnamefromabnrecord)

### `getBusinessNameFromABNRecord()`

Attempts to get the most relevant business name from the data returned in an `ABNRecord`. Will return "Unknown Business Name" if a suitable name is not found.

```js
const businessName = abnService.getBusinessNameFromABNRecord(abnRecord)
```
