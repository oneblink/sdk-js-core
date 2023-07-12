# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `formElementsService.parseDynamicFormElementOptions()`

### Removed

- **[BREAKING]** `formElementsService.parseFormElementOptionsSet()`

## [3.2.0] - 2023-07-03

### Added

- `toAutoLookupElement` to `typeCastService.formElements`

## [3.1.0] - 2023-06-23

### Added

- `formElementsService.determineIsInfoPage()`
- `gov-pay` payment event to payment event check

## [3.0.0] - 2023-06-05

### Removed

- **[BREAKING]** support for NodeJS 14

### Fixed

- Submission value (Non Element) injectable replacement was only replacing first instance in a string

### Added

- Also inject user email with `replaceInjectablesWithElementValues`

## [2.0.0] - 2023-05-08

### Changed

- **[BREAKING]** `submissionService.replaceElementValues()` to `submissionService.replaceInjectablesWithElementValues()`
- **[BREAKING]** `submissionService.replaceCustomValues()` to `submissionService.replaceInjectablesWithSubmissionValues()`

### Added

- **[BREAKING]** required `formatDateTime()` option to `submissionService.getElementSubmissionValue()`, `submissionService.replaceCustomValues()` and `submissionService.replaceElementValues()`

## [1.0.1] - 2023-04-20

### Added

- `@microsoft/eslint-plugin-sdl` eslint plugin

## [1.0.0] - 2023-04-14

### Added

- unit tests for allowing an element to be used twice in a conditional predicate
- support for NodeJS 18

### Removed

- **[BREAKING]** support for NodeJS 12

## [0.4.6] - 2023-03-03

### Added

- `WYSIWYGRegex` to `formElementsService`
- `matchElementsTagRegex` to `formElementsService`
- `replaceElementValues` to `submissionService`

### Changed

- message returned from ABN service when business name isn't found

## [0.4.5] - 2023-02-10

### Added

- `generateFormElementsConditionallyShown` - Dependant option set elements will now return a `dependencyIsLoading?` property

## [0.4.4] - 2022-09-13

### Changed

- Added `emailVerified`, `phoneNumber` and `phoneNumberVerified` values to `UserProfile`

## [0.4.3] - 2022-08-28

## [0.4.2] - 2022-07-29

### Changed

- update `getABNNumberFromABNRecord` to look for `isCurrentIndicator` equal to 'Y'

## [0.4.1] - 2022-06-17

### Added

- type checks to submission data
- `freshdeskDependentField` form element

## [0.4.0] - 2022-04-19

### Added

- `schedulingService`
- `submissionService`
- `paymentService`
- `fileUploadService`
- `'ELEMENT'` based `'NUMERIC'` conditional predicates to allow showing a form element based on the numeric value of another form element

### Removed

- **[BREAKING]** `validatePaymentAmount()` function. Replaced by `paymentService.checkForPaymentEvent()`
- **[BREAKING]** `getContentDisposition()` function. Replaced by `fileUploadService.getContentDisposition()`
- **[BREAKING]** `replaceCustomValues()` function. Moved into `submissionService`
- **[BREAKING]** `getElementSubmissionValue()` function. Moved into `submissionService`
- **[BREAKING]** `conditionalLogicService.evaluateConditionalPredicate()` function.
- **[BREAKING]** `conditionalLogicService.evaluateConditionalOptionsPredicate()` function.

## [0.3.6] - 2022-03-29

### Added

- Payment validation for payments

## [0.3.5] - 2022-03-16

### Fixed

- Removed test script

## [0.3.4] - 2022-03-15

### Added

- `toStorageElement` to `typeCastService.formElements`
- added generateFormElementsConditionallyShown to conditionalLogicService
- added flattenFormElements to formElementService

## [0.3.3] - 2022-01-24

### Added

- contentDisposition function for file upload

## [0.3.2] - 2021-12-21

### Added

- `abnService`

## [0.3.1] - 2021-12-09

### Added

- `abn` element and relating information

## [0.3.0] - 2021-12-02

### Added

- `bsb` and `files` to lookup form elements

### Changed

- **[BREAKING]** `getElementSubmissionValue` `form` parameter to `formElements`

## [0.2.5] - 2021-11-19

### Fixed

- `replaceCustomValues()` only replacing element submission data that is a string

## [0.2.4] - 2021-11-15

### Fixed

- `getElementSubmissionValue` not catering for `'autocomplete'` form elements having no options

## [0.2.3] - 2021-11-11

### Changed

- **[BREAKING]** `getElementSubmissionValue` function to use labels and obey element rules for certain elements

## [0.1.3] - 2021-09-20

### Fixed

- `replaceCustomValues()` adding `"undefined"` to string

## [0.1.2] - 2021-09-08

### Added

- [`userService`](./docs/userService.md)

## [0.1.1] - 2021-09-01

### Added

- `previousApprovalId` to `replaceCustomValues`

## [0.1.0] - 2021-07-20

Initial release
