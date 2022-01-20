# OneBlink SDK - JavaScript Core | Usage

## File Upload Service

Helper functions for handling file uploads

```js
import { getContentDisposition } from '@oneblink/sdk-core'
```

- [`getContentDisposition()`](#getcontentdisposition)

### `getContentDisposition()`

Attempts to get the content disposition for the header by compiling a string of UTF-8 formatting based on the file name.

```js
const contentDisposition = getContentDisposition(fileName)
```
