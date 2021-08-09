import React from 'react';
import { Button, Col, Row, Space } from 'antd';
import { DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons/lib';
import MusicList from '@/components/MusicList';
import { useModel } from '@@/plugin-model/useModel';
import useMusicPlayer from '@/hooks/useMusicPlayer';

export default function <T>() {
  const { history, clearHistory, deleteHistory } = useModel('historyList');
  const { setPlayListAndPlay } = useMusicPlayer();

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
                    setPlayListAndPlay(history);
                  }}
                  disabled={!history || history.length === 0}
                >
                  <PlayCircleOutlined />
                  播放全部
                </Button>
                <Button
                  type="primary"
                  onClick={clearHistory}
                  disabled={!history || history.length === 0}
                  color="red"
                >
                  <DeleteOutlined />
                  清空历史
                </Button>
              </Space>
            </Row>
          </Space>
        </Col>
      </Row>
      <MusicList
        list={history}
        clickType="insert"
        onDeleteItem={(item, index) => {
          deleteHistory(item);
        }}
      />
    </>
  );
}
