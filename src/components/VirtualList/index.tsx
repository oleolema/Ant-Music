import React, { useEffect, useRef } from 'react';
import style from './index.less';
// @ts-ignore
import VList from 'react-virtualized/dist/commonjs/List';
// @ts-ignore
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Spin } from 'antd';
import { useModel } from '@@/plugin-model/useModel';

interface VirtualListProps {
  rowCount: number;
  rowRenderer: (p: { index: number; style: object; key: string }) => React.ReactNode;
  header: React.ReactNode;
  loading?: boolean;
}

const VirtualList = function <T>({
  rowCount,
  rowRenderer,
  header,
  loading = false,
}: VirtualListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const listWrapperRef = useRef<HTMLDivElement>(null);

  const { contentHeight } = useModel('miniMusic');

  useEffect(() => {
    if (!listWrapperRef.current) {
      return;
    }
    // @ts-ignore
    listRef.current = listWrapperRef.current.querySelector('.ReactVirtualized__List');
  }, [listWrapperRef]);

  const vList = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }: any) => (
    <VList
      autoHeight
      height={height}
      isScrolling={isScrolling}
      onScroll={onChildScroll}
      overscanRowCount={2}
      rowCount={rowCount}
      rowHeight={42}
      rowRenderer={rowRenderer}
      onRowsRendered={onRowsRendered}
      scrollTop={scrollTop}
      width={width}
    />
  );

  // @ts-ignore
  const autoSize = (props: any) => {
    const { height, isScrolling, onChildScroll, scrollTop, onRowsRendered } = props;
    return (
      <AutoSizer disableHeight>
        {({ width }: any) =>
          vList({
            height,
            isScrolling,
            onChildScroll,
            scrollTop,
            onRowsRendered,
            width,
          })
        }
      </AutoSizer>
    );
  };

  return (
    <div className={style.virtualList} ref={listWrapperRef}>
      {/*<div className="ant-list-header" style={{ borderBottom: '1px solid #f0f0f0' }}>*/}
      {/*  {header}*/}
      {/*</div>*/}
      {/*<WindowScroller>{autoSize}</WindowScroller>*/}
      <AutoSizer disableHeight>
        {({ width }: any) => (
          <VList
            height={contentHeight - 24}
            overscanRowCount={2}
            noRowsRenderer={() => <>暂无数据</>}
            rowCount={rowCount}
            rowHeight={42}
            rowRenderer={rowRenderer}
            width={width}
          />
        )}
      </AutoSizer>
      {loading && (
        <Spin spinning={loading}>
          <div style={{ height: 50 }} />
        </Spin>
      )}
    </div>
  );
};

export default React.memo(VirtualList);
