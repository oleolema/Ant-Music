import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import Meta from 'antd/es/card/Meta';
import { FileImageOutlined } from '@ant-design/icons/lib';
import { useHistory } from 'umi';

export default () => {
  const history = useHistory();

  const { rankingData, rankingDataLoading } = useModel('rankingList');

  return (
    <>
      <Row gutter={16}>
        {rankingData &&
          rankingData.list.map((it) => (
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
                  it.coverImgUrl ? (
                    <img alt="example" src={it.coverImgUrl} />
                  ) : (
                    <FileImageOutlined style={{ fontSize: 40 }} />
                  )
                }
                loading={rankingDataLoading}
                onClick={(i) => {
                  console.info(it.id);
                  history.push('/music-list', { id: it.id });
                }}
              >
                <Meta
                  title={it.name}
                  description={
                    <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: 12 }}>
                      {it.description}
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
