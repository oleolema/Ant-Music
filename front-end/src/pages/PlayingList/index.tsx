import React from 'react';
import { Button, Col, Row, Space } from 'antd';
import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons/lib';
import MusicList from '@/components/MusicList';
import useMusicPlayer from '@/hooks/useMusicPlayer';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';

export default function <T>() {
  const { playList } = useSelector<ConnectState, MusicModelState>((state) => state.musicPlayer);
  const { setPlayListAndPlay, deleteSongFromPlayList, clearPlayList } = useMusicPlayer();

  return (
    <>
      <Row>
        <Col span={18}>
          <Space direction="vertical">
            <Row>
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    setPlayListAndPlay(playList);
                  }}
                  disabled={!playList || playList.length === 0}
                >
                  <PlayCircleOutlined />
                  播放全部
                </Button>
                <Button
                  type="primary"
                  onClick={clearPlayList}
                  disabled={!playList || playList.length === 0}
                  color="red"
                >
                  <DeleteOutlined />
                  清空列表
                </Button>
              </Space>
            </Row>
          </Space>
        </Col>
      </Row>
      {console.info(playList)}
      <MusicList
        list={playList}
        clickType="insert"
        onDeleteItem={(item, index) => {
          deleteSongFromPlayList(item);
        }}
      />
    </>
  );
}
