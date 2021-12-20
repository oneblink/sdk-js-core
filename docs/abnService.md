# OneBlink SDK - JavaScript Core | Usage

## ABN Service

Helper functions for handling ABN Records

```js
import { abnService } from '@oneblink/sdk-core'
```

- [`getBusinessNameFromABNRecord()`](#getbusinessnamefromabnrecord)
- [`displayBusinessNameFromABNRecord()`](#displaybusinessnamefromabnrecord)
- [`getABNNumberFromABNRecord()`](#getabnnumberfromabnrecord)
- [`displayABNNumberFromABNRecord()`](#displayabnnumberfromabnrecord)

### `getBusinessNameFromABNRecord()`

Attempts to get the most relevant business name from the data returned in an `ABNRecord`. Will return `undefined` if a suitable name is not found.

```js
const businessName = abnService.getBusinessNameFromABNRecord(abnRecord)
```

### `displayBusinessNameFromABNRecord()`

Get the most relevant business name from the data returned in an `ABNRecord`. Will return "Unknown Business Name" if a suitable name is not found.

```js
const businessName = abnService.displayBusinessNameFromABNRecord(abnRecord)
```

### `getABNNumberFromABNRecord()`

Attempts to get the most recent ABN number from the data returned in an `ABNRecord`. Will return `undefined` if an ABN is not found.

```js
const ABN = abnService.getABNNumberFromABNRecord(abnRecord)
```

### `displayABNNumberFromABNRecord()`

Attempts to get the most recent ABN number from the data returned in an `ABNRecord`. Will return "Unknown ABN Number" if an ABN is not found.

```js
const businessName = abnService.displayBusinessNameFromABNRecord(abnRecord)
```
