# OneBlink SDK - JavaScript Core | Usage

## `replaceCustomValues()`

Function to replace a custom values in text

```js
import { replaceCustomValues } from '@oneblink/sdk-core'

const result = replaceCustomValues(
  'https://example.com/path?submissionId={SUBMISSION_ID}&externalId={EXTERNAL_ID}&search{ELEMENT:search}',
  {
    submissionId: 'abc-123',
    submissionTimestamp: '2021-07-02T02:19:13.670Z',
    formatDate: (value) => new Date(value).toDateString(),
    formatTime: (value) => new Date(value).toTimeString(),
    submission: {
      search: 'Entered By User',
    },
    form: {
      id: 1,
      name: 'Form',
      organisationId: '',
      formsAppEnvironmentId: 1,
      formsAppIds: [],
      isAuthenticated: false,
      isMultiPage: false,
      isInfoPage: false,
      postSubmissionAction: 'FORMS_LIBRARY',
      cancelAction: 'FORMS_LIBRARY',
      submissionEvents: [],
      tags: [],
      elements: [
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
    },
  },
)
```
