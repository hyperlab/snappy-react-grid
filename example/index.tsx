import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SnappyReactGrid } from '../src/';

function Card({ item, style, innerRef }) {
  return (
    <div
      style={{
        ...style,
        height: 200,
        background: 'red',
      }}
      ref={innerRef}
    >
      {item}
    </div>
  );
}

const MemoCard = React.memo(Card);

const App = () => {
  const items = Array.from(new Array(600), (_, i) => i);

  return (
    <div>
      <SnappyReactGrid items={items} component={MemoCard} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
