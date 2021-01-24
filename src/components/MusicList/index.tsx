import React, { useState } from 'react';
import { Avatar, Col, List, Row, Typography } from 'antd';
import { Song } from '@/services/API';
import style from './index.less';
import { DownloadOutlined } from '@ant-design/icons/lib';
import { getTime } from '@/pages/MusicPlayer';
import useMusicPlayer from '@/hooks/useMusicPlayer';

interface MusicListProps {
  list: Song[];
  loading: boolean;
  onMore?: () => boolean;
}

console.info(style);
const ListItem = (item: Song, onClick?: () => void, index?: number) => (
  <Row
    align="middle"
    style={{ height: '3em' }}
    className={item.al.picUrl ? style.listItem : ''}
    key={item.id}
    gutter={10}
    onClick={() => onClick && onClick()}
  >
    <Col span={1}>{index ? index : ''}</Col>
    <Col span={1}>
      {item.al.picUrl ? (
        <Avatar src={`${item.al.picUrl}?param=30y30`} size="small" />
      ) : (
        <Avatar size="small" style={{ opacity: 0 }} />
      )}
    </Col>
    <Col span={8}>
      <Typography.Text ellipsis style={{ width: '100%' }}>
        {item.name}
      </Typography.Text>
    </Col>
    <Col span={5}>
      <Typography.Text ellipsis style={{ width: '100%' }}>
        {item.ar.map((it) => it.name).join(' / ')}
      </Typography.Text>
    </Col>
    <Col span={5}>
      <Typography.Text ellipsis style={{ width: '100%' }}>
        {item.al.name}
      </Typography.Text>
    </Col>
    <Col span={2}>{item.al.picUrl ? getTime(item.dt / 1000) : '时长'}</Col>
    <Col span={2}>{item.al.picUrl ? <DownloadOutlined style={{ cursor: 'pointer' }} /> : ''}</Col>
  </Row>
);

export default function <T>({ list, loading, onMore = () => false }: MusicListProps) {
  const [internalLoading] = useState(false);
  const { setCurrentSong, setPlayList, setPlayListAndIndex } = useMusicPlayer();

  return (
    <>
      <List
        loading={internalLoading || loading}
        itemLayout="horizontal"
        dataSource={list}
        header={ListItem({
          name: '音乐标题',
          ar: [{ name: '歌手' }],
          al: { name: '专辑' },
        } as Song)}
        size="small"
        renderItem={(item, index) =>
          ListItem(item, () => setPlayListAndIndex(list, index), index + 1)
        }
      />
    </>
  );
}
