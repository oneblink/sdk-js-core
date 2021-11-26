# OneBlink SDK - JavaScript Core | Usage

## `getElementSubmissionValue()`

Function to get the display value of a property in submission

```typescript
import { getElementSubmissionValue } from '@oneblink/sdk-core'

const result = getElementSubmissionValue({
  propertyName: 'search',
  submission: {
    search: 'Entered By User',
  },
  formElements: [
    {
      id: 'd4135b47-9004-4d75-aeb3-d2f6232da111',
      name: 'search',
      type: 'text',
      label: 'Search',
      readOnly: false,
      required: false,
      conditionallyShow: false,
      requiresAllConditionallyShowPredicates: false,
      isElementLookup: false,
      isDataLookup: false,
    },
  ],
  formatDate: (value) => new Date(value).toDateString(),
  formatTime: (value) => new Date(value).toTimeString(),
  formatNumber: (value) => Number(value).toString(),
  formatCurrency: (value) => Number(value).toFixed(2),
}: {
  propertyName: string
  formElements: FormTypes.FormElement[]
  submission: SubmissionTypes.S3SubmissionData['submission']
  formatDate: (value: string) => string
  formatTime: (value: string) => string
  formatNumber: (value: number) => string
  formatCurrency: (value: number) => string
})
```
