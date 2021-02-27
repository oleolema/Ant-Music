import React, { useMemo, useState } from 'react';
import useLocationState from '@/hooks/useLocationState';
import { useRequest } from '@@/plugin-request/request';
import { Artist } from '@/services/disc';
import { Button, Col, Image, Row, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { PlayCircleOutlined } from '@ant-design/icons/lib';
import { ArtistData, artistSongs, songDetail } from '@/services/song';
import MusicList from '@/components/MusicList';
import useMusicPlayer from '@/hooks/useMusicPlayer';

export default function <T>() {
  let { loading: artistSongsLoading, run: artistSongsRun } = useRequest(artistSongs, {
    manual: true,
  });

  let { loading: songListLoading, data: songList, run: songListRun } = useRequest(songDetail, {
    manual: true,
  });

  const { setPlayListAndPlay } = useMusicPlayer();

  const [artist, setArtist] = useState<Artist>();

  const { songs } = useMemo(() => {
    return {
      songs: songList?.songs || [],
    };
  }, [songList]);

  useLocationState(
    ({ artist }: { artist: Artist | null }) => {
      if (!artist || artist.id == -1) {
        return;
      }
      artistSongsRun(artist.id).then((res: any) => {
        const data = res as ArtistData;
        setArtist(artist);
        songListRun(data.songs.map((it) => it.id));
      });
    },
    { artist: null },
  );

  return (
    <>
      <Row>
        <Col span={5}>
          <Image src={artist?.picUrl} />
        </Col>
        <Col span={18} offset={1}>
          <Space direction="vertical">
            <Row>
              <Title>{artist?.name}</Title>
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
              <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>
                {artist?.briefDesc}
              </Paragraph>
            </Row>
          </Space>
        </Col>
      </Row>
      <MusicList loading={artistSongsLoading || songListLoading} list={songs} />
    </>
  );
}
