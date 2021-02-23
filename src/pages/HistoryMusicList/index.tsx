import React from 'react';
import { Button, Col, Image, Row, Space } from 'antd';
import Title from 'antd/es/typography/Title';
import { PlayCircleOutlined } from '@ant-design/icons/lib';
import MusicList from '@/components/MusicList';
import { useModel } from '@@/plugin-model/useModel';

export default function <T>() {
  const { history } = useModel('historyList');

  return (
    <>
      <Row>
        <Col span={5}>
          <Image />
        </Col>
        <Col span={18} offset={1}>
          <Space direction="vertical">
            <Row>
              <Title>播放历史</Title>
            </Row>
            <Row>
              <Button type="primary">
                <PlayCircleOutlined />
                播放全部
              </Button>
            </Row>
          </Space>
        </Col>
      </Row>
      <MusicList list={history} />
    </>
  );
}
