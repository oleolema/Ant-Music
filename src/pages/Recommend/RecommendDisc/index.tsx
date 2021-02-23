import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import Meta from 'antd/es/card/Meta';
import { FileImageOutlined } from '@ant-design/icons/lib';
import { useHistory } from 'umi';

export default () => {
  const favDisc = JSON.parse(`[
    {"id":4859300541,"type":0,"name":"我想把这些甜甜的歌都唱给你听","copywriter":"热门推荐","picUrl":"https://p2.music.126.net/10y5QCWU9Q-dzAYI2Q2hpQ==/109951164769529260.jpg","canDislike":true,"trackNumberUpdateTime":1585824519105,"playCount":3342940,"trackCount":115,"highQuality":false,"alg":"cityLevel_unknow"},
    {"id":6625732150,"type":0,"name":"回忆录｜你是我最热烈的青春，最稚拙的浪漫","copywriter":"编辑推荐：最好的我们之间 隔了一整个青春","picUrl":"https://p1.music.126.net/pp31s6f_HosKP0GFCf8huQ==/109951165745234229.jpg","canDislike":false,"trackNumberUpdateTime":1613811696581,"playCount":220452,"trackCount":30,"highQuality":false,"alg":"featured"}
    ]`);
  const history = useHistory();

  const { discData, discDataLoading } = useModel('recommendDisc');

  return (
    <>
      <Row gutter={16}>
        {discData &&
          [...favDisc, ...discData].map((it) => (
            <Col
              style={{ paddingBottom: 16 }}
              key={it.id}
              lg={{ span: 4 }}
              md={{ span: 6 }}
              xs={{ span: 12 }}
            >
              <Card
                hoverable
                bordered={false}
                cover={
                  it.picUrl ? (
                    <img alt="example" src={it.picUrl} />
                  ) : (
                    <FileImageOutlined style={{ fontSize: 40 }} />
                  )
                }
                loading={discDataLoading}
                onClick={(i) => {
                  console.info(it.id);
                  history.push('/music-list', { id: it.id });
                }}
              >
                <Meta
                  title={it.name}
                  description={
                    <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: 12 }}>
                      {it.copywriter}
                    </Typography.Paragraph>
                  }
                />
              </Card>
            </Col>
          ))}
      </Row>
    </>
  );
};
