import React, { useState } from 'react';
import { Col, List, Row } from 'antd';
import { Song } from '@/services/API';
import style from './index.less';
import { CloseOutlined, DownloadOutlined } from '@ant-design/icons/lib';
import { getTime } from '@/pages/MusicPlayer';
import useMusicPlayer from '@/hooks/useMusicPlayer';
import VirtualList from '../VirtualList';
import { downloadSong } from '@/utils/utils';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';
import ware from '@/assets/wave.gif';
import useCanSetMusic from '@/hooks/useMusicPlayer/useCanSetMusic';

// 大于该值使用虚拟列表
const VIRTUAL_MAX_NUM = 301;

console.info(style);
const ListItem = ({
  item,
  onClick,
  index = '',
  key,
  styl = {},
  onDeleteItem,
  currentSong,
}: {
  item: Song;
  onClick?: () => void;
  index?: number | string;
  key?: string;
  styl?: any;
  onDeleteItem?: (song: Song, index: number) => void;
  currentSong?: Song | null;
}) => {
  const isClose = onDeleteItem && typeof index === 'number';
  return (
    <Row
      align="middle"
      style={{ ...styl, height: '3em' }}
      className={item.al?.picUrl ? style.listItem : ''}
      key={key || item.id}
      gutter={10}
      onClick={() => onClick && onClick()}
    >
      {currentSong && currentSong?.id === item.id ? (
        <Col md={{ span: 1 }} xs={{ span: 2 }}>
          <img style={{ marginLeft: '2px', filter: 'brightness(0)' }} src={ware} alt="" />
        </Col>
      ) : (
        <Col md={{ span: 1 }} xs={{ span: 2 }}>
          {index}
        </Col>
      )}
      <Col md={{ span: 1 }} xs={{ span: 3 }}>
        {item.al?.picUrl ? (
          <img
            src={`${item.al?.picUrl}?param=30y30`}
            style={{ width: 30, height: 30, borderRadius: 25, padding: 2 }}
            alt=""
          />
        ) : (
          <img style={{ opacity: 0 }} alt="" />
        )}
      </Col>
      <Col md={{ span: 8 }} xs={{ span: 8 }} className={style.ellipsis}>
        {item.name}
      </Col>
      <Col md={{ span: 5 }} xs={{ span: 4 }} className={style.ellipsis}>
        {item.ar?.map((it) => it.name).join(' / ')}
      </Col>
      <Col md={{ span: 5 }} xs={{ span: 0 }} className={style.ellipsis}>
        {item.al?.name}
      </Col>
      <Col md={{ span: 2 }} xs={{ span: 3 }}>
        {item.id ? getTime(item.dt / 1000) : '时长'}
      </Col>
      <Col
        md={{ span: 1, offset: isClose ? 0 : 1 }}
        xs={{ span: 2, offset: isClose ? 0 : 1 }}
        onClick={(event) => {
          event.stopPropagation();
          downloadSong(item);
        }}
      >
        {item.id ? <DownloadOutlined style={{ cursor: 'pointer' }} /> : ''}
      </Col>
      {isClose && (
        <Col md={{ span: 1 }} xs={{ span: 1 }}>
          {item.id ? (
            <CloseOutlined
              style={{ cursor: 'pointer' }}
              onClick={(event) => {
                event.stopPropagation();
                onDeleteItem && onDeleteItem(item, index as number);
              }}
            />
          ) : (
            ''
          )}
        </Col>
      )}
    </Row>
  );
};

export type ClickType = 'insert' | 'replace';

interface MusicListProps {
  list: Song[];
  loading?: boolean;
  onMore?: () => boolean;
  clickType?: ClickType;
  onDeleteItem?: (song: Song, index: number) => void;
}

export default function <T>({
  list,
  loading = false,
  onMore = () => false,
  clickType = 'replace',
  onDeleteItem,
}: MusicListProps) {
  const [internalLoading] = useState(false);
  const { setPlayListAndSongId, insertSong } = useMusicPlayer();
  const { currentSong } = useSelector<ConnectState, MusicModelState>((state) => state.musicPlayer);
  const { canSetMusic } = useCanSetMusic();

  return (
    <div>
      {list.length > VIRTUAL_MAX_NUM ? (
        <VirtualList
          rowCount={list.length}
          rowRenderer={({ index, key, style }: any) => {
            return ListItem({
              item: list[index],
              onClick: () => {
                if (!canSetMusic()) {
                  return;
                }
                clickType === 'insert'
                  ? insertSong(list[index])
                  : setPlayListAndSongId({
                      playList: list,
                      songId: list[index].id,
                    });
              },
              index: index + 1,
              key: key,
              styl: style,
              onDeleteItem,
              currentSong,
            });
          }}
          header={ListItem({
            item: {
              name: '音乐标题',
              ar: [{ name: '歌手' }],
              al: { name: '专辑' },
            } as Song,
          })}
          loading={internalLoading || loading}
        />
      ) : (
        <List
          loading={internalLoading || loading}
          itemLayout="horizontal"
          dataSource={list}
          header={ListItem({
            item: {
              name: '音乐标题',
              ar: [{ name: '歌手' }],
              al: { name: '专辑' },
            } as Song,
          })}
          size="small"
          renderItem={(item, index) => {
            return ListItem({
              item,
              onClick: () => {
                if (!canSetMusic()) {
                  return;
                }
                clickType === 'insert'
                  ? insertSong(item)
                  : setPlayListAndSongId({
                      playList: list,
                      songId: item.id,
                    });
              },
              index: index + 1,
              onDeleteItem,
              currentSong,
            });
          }}
        />
      )}
    </div>
  );
}
