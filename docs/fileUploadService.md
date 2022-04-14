# OneBlink SDK - JavaScript Core | Usage

## File Upload Service

Helper functions for handling file uploads

```js
import { fileUploadService } from '@oneblink/sdk-core'
```

- [`fileUploadService.getContentDisposition()`](#getcontentdisposition)

### `getContentDisposition()`

Attempts to get the content disposition for the header by compiling a string of UTF-8 formatting based on the file name.

```js
const contentDisposition = fileUploadService.getContentDisposition(fileName)
```
