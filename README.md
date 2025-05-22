# WFace

[![Build Status](https://travis-ci.org/Digiturk/wface.svg?branch=master)](https://travis-ci.org/Digiturk/wface)
[![npm package](https://img.shields.io/npm/v/wface/latest.svg)](https://www.npmjs.com/package/wface)
[![NPM Downloads](https://img.shields.io/npm/dt/wface.svg?style=flat)](https://npmcharts.com/compare/wface?minimal=true)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/wface-im/community)

WFace is a ReactJS and TypeScript-based component library designed to simplify the development of enterprise web applications. It offers a rich set of pre-built and customizable UI components, including forms, charts, tables, dialogs, and more. WFace leverages popular libraries like Material-UI (MUI) and Recharts to provide a robust and versatile foundation for your projects.

## Installation

To install WFace components, you can use npm or yarn:

```bash
npm install wface
```

or

```bash
yarn add wface
```

## Usage

Here's a basic example of how to import and use a WFace component:

```tsx
import React from 'react';
import { WButton } from 'wface';

const MyApp = () => {
  return (
    <div>
      <WButton variant="contained" color="primary" onClick={() => alert('Button Clicked!')}>
        Click Me
      </WButton>
    </div>
  );
};

export default MyApp;
```

For more detailed examples and a live demonstration of all components, please refer to the `demo/` application in this repository.

## Key Features

- **Comprehensive Component Library:** A wide range of pre-built components including forms, tables, charts, dialogs, navigation elements, and more.
- **TypeScript Based:** Written in TypeScript for enhanced code quality, maintainability, and type safety.
- **Material-UI Foundation:** Built on top of Material-UI, providing robust and well-tested components with a consistent look and feel.
- **Customizable:** Offers theming capabilities (e.g., `WThemeProvider`) to allow developers to tailor the appearance to their application's branding.
- **Developer Friendly:** Designed to simplify and accelerate the development of enterprise-grade web applications.

## Documentation

Currently, the primary sources for documentation are:

- **Demo Application:** The `demo/` directory in this repository contains a working application that showcases all available components and their various configurations. This is the best place to see the components in action.
- **Component Source Code:** The source code for each component in the `src/components/` directory, along with its TypeScript interface definitions (props), provides detailed information about component APIs and functionality.

## Available Components

WFace offers a wide array of components to cover common UI needs in enterprise applications. Key categories include:

- **Bars:** App Bar, Notification Bar, Scroll Bar, Tool Bar
- **Buttons:** Button, Button Group, Icon Button, Loading Button, Speed Dial, Toggle Button
- **Charts:** Components for data visualization (e.g., `WChart`)
- **Dialogs:** Dialog, Popover, Popper, Message Dialog for interactive prompts and information display.
- **Forms:** Comprehensive `WForm` component with various field types for data entry.
- **Inputs:** Checkbox, Date/Time Pickers, Radio Group, Select, Slider, Switch, Text Field, and more.
- **Layouts:** Box, Card, Carousel, Collapse, Container, Divider, Drawer, Expansion Panel, Grid, Paper, Tabs, Wizard for structuring application interfaces.
- **Lists:** List, Menu for displaying collections of items.
- **Media Elements:** Avatar, Badge, Icon, Link, Rating.
- **Progress Indicators:** Circular Progress, Linear Progress, Skeleton to provide feedback on loading states.
- **Tables:** Powerful `WTable` component for displaying and managing tabular data.
- **Utilities:** Chip, ClickAwayListener, SnackbarProvider, ThemeProvider (`WThemeProvider`), Tooltip, Typography for various UI enhancements and utilities.

For a complete list and detailed usage, please refer to the `demo/` application and the component source code.

## Contributing

We'd love to have your helping hand on `wface`! See [CONTRIBUTING.md](https://github.com/Digiturk/wface/blob/master/CONTRIBUTING.md) for more information on what we're looking for and how to get started.

If you have any sort of doubt, idea or just want to talk about the project, feel free to join [our chat on Gitter](https://gitter.im/wface-im/community) :)

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
