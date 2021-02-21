import React, { useEffect, useState } from 'react';
import style from './index.less';
// @ts-ignore
import VList from 'react-virtualized/dist/commonjs/List';
// @ts-ignore
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
// @ts-ignore
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Spin } from 'antd';

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
    <div className={style.virtualList}>
      {/*<div className="ant-list-header" style={{ borderBottom: '1px solid #f0f0f0' }}>*/}
      {/*  {header}*/}
      {/*</div>*/}
      {/*<WindowScroller>{autoSize}</WindowScroller>*/}
      <AutoSizer disableHeight>
        {({ width }: any) => (
          <VList
            ref="List"
            height={731}
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
