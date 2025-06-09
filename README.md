# WFace

[![Build Status](https://travis-ci.org/Digiturk/wface.svg?branch=master)](https://travis-ci.org/Digiturk/wface)
[![npm package](https://img.shields.io/npm/v/@wface/components/latest.svg)](https://www.npmjs.com/package/@wface/components)
[![NPM Downloads](https://img.shields.io/npm/dt/@wface/components.svg?style=flat)](https://npmcharts.com/compare/@wface/components?minimal=true)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/wface-im/community)

Enterprise web application platform based on ReactJS and Typescript.

## Contributing

We'd love to have your helping hand on `wface`! See [CONTRIBUTING.md](https://github.com/Digiturk/wface/blob/master/CONTRIBUTING.md) for more information on what we're looking for and how to get started.

If you have any sort of doubt, idea or just want to talk about the project, feel free to join [our chat on Gitter](https://gitter.im/wface-im/community) :)

## License

This project is licensed under the terms of the [MIT license](/LICENSE).

## Responsive Design

The `WTable` component is designed to be responsive primarily through horizontal scrolling.

- **Horizontal Scrolling:** The table is rendered within a Material-UI `TableContainer`. If the table's content (due to numerous or wide columns) exceeds the width of its container, the `TableContainer` will automatically enable horizontal scrolling. This ensures all data remains accessible on smaller screens.

- **Advanced Responsive Patterns:** For more complex responsive behaviors, such as:
    - Hiding or showing columns based on screen size.
    - Stacking table cells on very small screens.
    - Significantly altering the table layout for mobile.

  These adaptations should be implemented at the application level. You can achieve this using:
    - CSS media queries to adjust column widths or visibility.
    - JavaScript logic in your components to pass different `columns` props to `WTable` based on screen size or other conditions.
    - Using Material-UI's responsive utilities or other layout components to wrap or adapt the table's presentation.

`WTable` focuses on providing a feature-rich data grid, while detailed responsive layout adjustments are best handled by the application consuming the table, allowing for maximum flexibility.
