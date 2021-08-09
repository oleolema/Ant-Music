import React, { useMemo, useState } from 'react';
import useLocationState from '@/hooks/useLocationState';
import { useRequest } from '@@/plugin-request/request';
import { playlistDetail } from '@/services/disc';
import { Avatar, Button, Col, Image, Row, Space, Tag } from 'antd';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { PlayCircleOutlined, UserOutlined } from '@ant-design/icons/lib';
import { DiscMusicData } from '@/data/DiscMusicData';
import { songDetail } from '@/services/song';
import { SongDetailData } from '@/services/API';
import MusicList from '@/components/MusicList';
import moment from 'moment';
import useMusicPlayer from '@/hooks/useMusicPlayer';

export type ListType = 'disc' | 'artist';

export default function <T>() {
  const { loading: playlistDetailLoading, run: playlistDetailRun } = useRequest(playlistDetail, {
    manual: true,
  });

  let { loading: songListLoading, data: songList, run: songListRun } = useRequest(songDetail, {
    manual: true,
  });

  const { setPlayListAndPlay } = useMusicPlayer();

  const songs = useMemo(() => (songList as SongDetailData)?.songs || [], [songList]);

  const [discData, setDiscData] = useState<DiscMusicData>();

  useLocationState(
    ({ id }) => {
      if (id == -1) {
        return;
      }
      playlistDetailRun(id).then((res) => {
        const data = res as DiscMusicData;
        console.info(res);
        setDiscData(data);
        console.info(data.playlist.trackIds.map((it) => it.id));
        songListRun(data.playlist.trackIds.map((it) => it.id));
      });
    },
    { id: -1 },
  );

  return (
    <>
      <Row>
        <Col span={5}>
          <Image src={discData?.playlist.coverImgUrl} />
        </Col>
        <Col span={18} offset={1}>
          <Space direction="vertical">
            <Row>
              <Title>{discData?.playlist.name}</Title>
            </Row>
            <Row align="middle" gutter={10}>
              <Col>
                <Avatar
                  icon={<UserOutlined />}
                  src={`${discData?.playlist.creator.avatarUrl}?param=50y50`}
                />
              </Col>
              <Col>{discData?.playlist.creator.nickname}</Col>
              <Col>{moment(discData?.playlist.updateTime).format('lll')}</Col>
            </Row>
            <Row>
              <Button
                type="primary"
                onClick={() => setPlayListAndPlay(songs)}
                disabled={!songs || songs.length === 0}
              >
                <PlayCircleOutlined />
                播放全部
              </Button>
            </Row>
            <Row>
              {discData?.playlist.tags.map((it) => (
                <Tag key={it}>{it}</Tag>
              ))}
            </Row>
            <Row>
              <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>
                {discData?.playlist.description}
              </Paragraph>
            </Row>
          </Space>
        </Col>
      </Row>
      <MusicList loading={songListLoading || playlistDetailLoading} list={songs} />
    </>
  );
}
