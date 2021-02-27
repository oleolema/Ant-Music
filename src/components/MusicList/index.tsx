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
}) => (
  <Row
    align="middle"
    style={{ ...styl, height: '3em' }}
    className={item.al.picUrl ? style.listItem : ''}
    key={key || item.id}
    gutter={10}
    onClick={() => onClick && onClick()}
  >
    {currentSong && currentSong?.id === item.id ? (
      <Col span={1}>
        <img style={{ marginLeft: '2px', filter: 'brightness(0)' }} src={ware} alt="" />
      </Col>
    ) : (
      <Col span={1}>{index}</Col>
    )}
    <Col span={1}>
      {item.al.picUrl ? (
        <img
          src={`${item.al.picUrl}?param=30y30`}
          style={{ width: 30, height: 30, borderRadius: 25, padding: 2 }}
          alt=""
        />
      ) : (
        <img style={{ opacity: 0 }} alt="" />
      )}
    </Col>
    <Col span={8} className={style.ellipsis}>
      {item.name}
    </Col>
    <Col span={5} className={style.ellipsis}>
      {item.ar.map((it) => it.name).join(' / ')}
    </Col>
    <Col span={5} className={style.ellipsis}>
      {item.al.name}
    </Col>
    <Col span={2}>{item.id ? getTime(item.dt / 1000) : '时长'}</Col>
    <Col
      span={1}
      onClick={(event) => {
        event.stopPropagation();
        downloadSong(item);
      }}
    >
      {item.id ? <DownloadOutlined style={{ cursor: 'pointer' }} /> : ''}
    </Col>
    {onDeleteItem && typeof index === 'number' && (
      <Col span={1}>
        {item.id ? (
          <CloseOutlined
            style={{ cursor: 'pointer' }}
            onClick={(event) => {
              event.stopPropagation();
              onDeleteItem(item, index!);
            }}
          />
        ) : (
          ''
        )}
      </Col>
    )}
  </Row>
);

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

  return (
    <div>
      {list.length > VIRTUAL_MAX_NUM ? (
        <VirtualList
          rowCount={list.length}
          rowRenderer={({ index, key, style }: any) => {
            return ListItem({
              item: list[index],
              onClick: () =>
                clickType === 'insert'
                  ? insertSong(list[index])
                  : setPlayListAndSongId({
                      playList: list,
                      songId: list[index].id,
                    }),
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
              onClick: () =>
                clickType === 'insert'
                  ? insertSong(item)
                  : setPlayListAndSongId({
                      playList: list,
                      songId: item.id,
                    }),
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
