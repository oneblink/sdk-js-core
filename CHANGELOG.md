# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
