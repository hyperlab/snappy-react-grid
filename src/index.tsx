import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useMemo,
  MutableRefObject,
  ComponentType,
} from 'react';
import useResizeObserver from 'use-resize-observer';
import supportsPassive from './utils/supportsPassive';

export interface RenderComponentProps {
  item: any;
  style: ItemStyle | {};
  innerRef: MutableRefObject<null> | null;
}

interface ScrollHandlerArgs {
  firstVisibleIndex: number | null;
  lastVisibleIndex: number | null;
}

interface SnappyReactGridProps {
  items: any[];
  component: ComponentType<RenderComponentProps>;
  overscanRows?: number;
  columns?: number;
  defaultVisible?: number;
  defaultOffset?: number;
  className?: string;
  onScroll?: ({
    firstVisibleIndex,
    lastVisibleIndex,
  }: ScrollHandlerArgs) => void;
}

interface ItemStyle {
  position?: string;
  left?: string;
  top?: string;
  width: string;
}

interface StyleCache {
  [key: number]: ItemStyle;
}

interface StylesForItem {
  index: number;
  cache: StyleCache;
  row: number;
  column: number;
  columns: number;
  itemHeight: number | null;
}

function stylesForItem({
  index,
  cache,
  row,
  column,
  columns,
  itemHeight,
}: StylesForItem) {
  if (itemHeight) {
    cache[index] = cache[index] || {
      position: 'absolute',
      left: `${column * (100 / columns)}%`,
      top: `${row * itemHeight}px`,
      width: 100 / columns + '%',
    };
  } else {
    cache[index] = { width: 100 / columns + '%' };
  }

  return cache[index];
}

let lastKnownHeight: number | null = null;

export function SnappyReactGrid({
  items,
  component: RenderComponent,
  defaultVisible = 16,
  defaultOffset = 0,
  columns = 4,
  overscanRows = 3,
  className,
  onScroll,
}: SnappyReactGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRef = useRef(null);
  const [itemsVisible, setItemsVisible] = useState(defaultVisible);
  const [itemsOffset, setItemsOffset] = useState(defaultOffset);

  const { width: containerWidth, height: containerHeight } = useResizeObserver({
    ref: containerRef,
  });
  const { height: currentItemHeight } = useResizeObserver({
    ref: itemRef,
  });

  if (currentItemHeight > 1) lastKnownHeight = currentItemHeight;
  const itemHeight = lastKnownHeight;

  const styleCache = useRef<StyleCache>({});

  const updateItemVisibility = useCallback(() => {
    if (
      itemHeight &&
      containerWidth &&
      containerHeight &&
      containerRef.current
    ) {
      const fullHeight = window.innerHeight;
      const { top } = containerRef.current.getBoundingClientRect();

      const firstVisibleRow = Math.floor(Math.max(-top, 0) / itemHeight);
      const offsetRows = Math.max(0, firstVisibleRow - overscanRows);

      const overscanRowsBefore = Math.min(overscanRows, firstVisibleRow);

      const rowsInView = Math.ceil(
        (fullHeight - Math.max(top, 0)) / itemHeight
      );
      const rowsToRender = rowsInView + overscanRowsBefore + overscanRows;
      const itemsVisible = rowsToRender * columns;

      setItemsVisible(itemsVisible);
      setItemsOffset(offsetRows * columns);

      const firstVisibleIndex = firstVisibleRow * columns;
      const lastVisibleIndex = Math.min(
        firstVisibleIndex + rowsInView * columns,
        items.length
      );

      return {
        firstVisibleIndex,
        lastVisibleIndex,
      };
    } else {
      return {
        firstVisibleIndex: null,
        lastVisibleIndex: null,
      };
    }
  }, [
    itemHeight,
    containerWidth,
    containerHeight,
    columns,
    overscanRows,
    items.length,
  ]);

  const handleScroll = useCallback(() => {
    const { firstVisibleIndex, lastVisibleIndex } = updateItemVisibility();

    if (onScroll) {
      onScroll({
        firstVisibleIndex,
        lastVisibleIndex,
      });
    }
  }, [updateItemVisibility, onScroll]);

  useLayoutEffect(() => {
    styleCache.current = {};
    updateItemVisibility();

    const options = supportsPassive ? { passive: true } : false;

    window.addEventListener('scroll', handleScroll, options);
    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll,
        options as EventListenerOptions
      );
  }, [updateItemVisibility, handleScroll]);

  const itemsToRender = useMemo(() => {
    let out = [];
    let endIndex = Math.min(itemsOffset + itemsVisible, items.length);

    for (let index = itemsOffset; index < endIndex; index++) {
      const item = items[index];

      const row = Math.floor(index / columns);
      const column = index % columns;

      out.push(
        <RenderComponent
          key={index}
          item={item}
          style={stylesForItem({
            index,
            cache: styleCache.current,
            row,
            column,
            columns,
            itemHeight,
          })}
          innerRef={index === itemsOffset ? itemRef : null}
        />
      );
    }

    return out;
  }, [items, itemsOffset, itemsVisible, itemHeight, columns]);

  const containerStyle =
    itemHeight === null
      ? {
          position: 'relative' as 'relative',
        }
      : {
          position: 'relative' as 'relative',
          height: Math.ceil(items.length / columns) * itemHeight,
        };

  return (
    <div className={className} style={containerStyle} ref={containerRef}>
      {itemsToRender}
    </div>
  );
}

export default SnappyReactGrid;
