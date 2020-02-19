# snappy-react-grid

Snappy React Grid is a simple to use windowing solution for React, built with performance and simplicity in mind.

## Installation

Use yarn to add it to your React app:

```bash
$ yarn add snappy-react-grid
```

## Usage

```javascript
import { SnappyReactGrid } from 'snappy-react-grid';

const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Item = ({ style, innerRef, item }) => (
  <div ref={innerRef} style={style}>
    <div style={{ height: '250px', background: '#f00' }}>
      <h1>{item}</h1>
    </div>
  </div>
);

const App = () => <SnappyReactGrid component={Item} items={items} />;
```

## API

### items: any[]

The data that is used to render the grid. This is passed down to the render component, but could be anything really.

### component: Component

This is used to render all the items. Some important props are passed down to this component:

#### item: any

The item data from the `items` array.

#### style: Object

Apply this to the outermost DOM node for the styling to work.

#### innerRef: ref

Apply this as `ref` on the outermost DOM node. It is used to measure the item height and make sure that all items have the proper offset.

### defaultVisible: number (default: 16)

The amount of items to show by default. Used for server side rendering.

### defaultOffset: number (default: 0)

If you want to offset the default rendering (i.e. not start with the first item), you can override this. You should rarely have to touch this.

### columns: number (default: 4)

The amount of items to render per row.

### overscanRows: number (default: 3)

The amount of rows outside the view that should be rendered. A higher number means less glitching when you scroll fast, but might cause performance issues.

### className: string

CSS class that is applied to the `div` element that wraps the grid.

### onScroll: function

Called whenever the user scrolls with the current range of items in view as arguments. This can be used to implement side effects based on scrolling behaviour, such as automatically fetching more data etc.

#### firstVisibleIndex: number

Index of the first item that is in view.

#### lastVisibleIndex: number

Index of the last item that is in view.

## Issues

If you have any problems with this module, please don't hesitate to open an issue in this repository.

Contributions are always appreciated!

## Development

To build this module, run `yarn build`.

To start the test runner, run `yarn test`.
