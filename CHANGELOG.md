# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2021-03-19

### Changed

- Add `id` prop to be able to use snappy-react-grid multiple times on the same site, but with different item heights. The item height is persisted in a global variable, but now you can specify an ID to identify this specific grid and not conflict with the persisted item height from other grids.

## [0.2.0] - 2020-05-28

### Changed

- Add `height` to style object passed to items. This fixes a bug when using `align-items: stretch` and the first item of the grid is not the tallest one.

## [0.1.4] - 2020-02-19

First production-ready version.

[unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/hyperlab/snappy-react-grid/compare/v0.1.4...v0.2.0
[0.1.4]: https://github.com/hyperlab/snappy-react-grid/releases/tag/v0.1.4
