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

interface ItemRendererProps {
  item: any;
  style: ItemStyle | {};
  innerRef: MutableRefObject<null> | null;
}

interface SnappyReactGridProps {
  items: any[];
  component: ComponentType<ItemRendererProps>;
  overscanRows?: number;
  columns?: number;
  defaultVisible?: number;
  className?: string;
}

interface ItemStyle {
  position: string;
  left: string;
  top: string;
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
  }

  return cache[index];
}

export function SnappyReactGrid({
  items,
  component: RenderComponent,
  defaultVisible = 16,
  columns = 4,
  overscanRows = 3,
  className,
}: SnappyReactGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRef = useRef(null);
  const [itemsVisible, setItemsVisible] = useState(defaultVisible);
  const [itemsOffset, setItemsOffset] = useState(0);

  const { width: containerWidth, height: containerHeight } = useResizeObserver({
    ref: containerRef,
  });
  const { height: currentItemHeight } = useResizeObserver({
    ref: itemRef,
  });

  const lastKnownHeight = useRef<null | number>(null);
  if (currentItemHeight > 1) lastKnownHeight.current = currentItemHeight;
  const itemHeight = lastKnownHeight.current;

  const styleCache = useRef<StyleCache>({});

  const updateItemVisibility = useCallback(() => {
    if (
      itemHeight &&
      containerWidth &&
      containerHeight &&
      containerRef.current
    ) {
      const fullHeight = window.innerHeight;
      const scrollOffset = window.pageYOffset;

      const { top } = containerRef.current.getBoundingClientRect();
      const aboveContainer = Math.max(top - scrollOffset, 0);

      const firstVisibleRow = Math.ceil(
        (scrollOffset - aboveContainer) / itemHeight
      );
      const offsetRows = Math.max(0, firstVisibleRow - overscanRows);

      const overscanRowsBefore = Math.min(overscanRows, firstVisibleRow);

      const visibleRows =
        Math.ceil((fullHeight - aboveContainer) / itemHeight) +
        overscanRowsBefore +
        overscanRows;

      setItemsVisible(visibleRows * columns);
      setItemsOffset(offsetRows * columns);
    }
  }, [itemHeight, containerWidth, containerHeight, columns, overscanRows]);

  useLayoutEffect(() => {
    styleCache.current = {};
    updateItemVisibility();

    window.addEventListener(
      'scroll',
      updateItemVisibility,
      supportsPassive ? { passive: true } : false
    );
    return () =>
      (window as any).removeEventListener(
        'scroll',
        updateItemVisibility,
        supportsPassive ? { passive: true } : false
      );
  }, [updateItemVisibility]);

  const styles = useRef<StyleCache>({});

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
            cache: styles.current,
            row,
            column,
            columns,
            itemHeight,
          })}
          innerRef={index === 0 ? itemRef : null}
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
          height: (items.length * itemHeight) / columns,
        };

  return (
    <div className={className} style={containerStyle} ref={containerRef}>
      {itemsToRender}
    </div>
  );
}

export default SnappyReactGrid;
