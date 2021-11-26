# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
