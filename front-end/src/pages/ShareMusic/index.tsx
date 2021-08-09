import React, {ReactNode, useEffect} from 'react';
import {Button, Card, Col, Form, Input, Radio, Row, Tag} from 'antd';
import {ReadyState} from 'ahooks/es/useWebSocket';
import Paragraph from 'antd/lib/typography/Paragraph';
import {useModel} from '@@/plugin-model/useModel';
import ProTable, {ProColumns} from '@ant-design/pro-table';
import {CreateShare, CreateShareTypeEnum, ShareConstant} from '@/services/share';
import {CloseCircleOutlined, CloseOutlined, PlusCircleOutlined, SettingOutlined,} from '@ant-design/icons';
import styles from './index.less';
import {v4} from 'uuid';
import Text from 'antd/es/typography/Text';
import Search from 'antd/es/input/Search';
import Title from 'antd/es/typography/Title';

let isFirst = true;

export default () => {
  const {selfInfo, sharerList, shareType, setShareType} = useModel('share');
  const {audioRef} = useModel('musicPlayer');
  const {
    readyState,
    disconnect,
    connect,
    joinUrl,
    setJoinUrl,
    selfName,
    setSelfName,
    adminSendMsg,
    isAdmin,
    adminId,
    setAdminId,
  } = useModel('shareWebsocket');

  useEffect(() => {
    if (!isFirst) {
      return;
    }
    if (location.search) {
      setShareType(CreateShareTypeEnum.JOIN);
      setJoinUrl(location.href);
    } else {
      setShareType(CreateShareTypeEnum.CREATE);
      joinUrl || setJoinUrl(null);
    }
    isFirst = false;
  }, [location]);

  function createShare() {
    connect && connect(CreateShareTypeEnum.CREATE);
  }

  function joinShare() {
    audioRef.current?.play()
    connect && connect(CreateShareTypeEnum.JOIN);
  }

  function exitShare() {
    disconnect && disconnect();
  }

  const columns: ProColumns<CreateShare>[] = [
    {
      title: 'ID',
      width: 80,
      dataIndex: 'id',
    },
    {
      title: '名称',
      width: 80,
      dataIndex: 'name',
    },
    {
      title: 'role',
      width: 80,
      dataIndex: 'type',
      render: (dom, createShare, index, action, schema) => {
        const {id, type} = createShare;
        let nodes: ReactNode[] = [];
        if (type === CreateShareTypeEnum.CREATE) {
          nodes.push(
            <Tag color="red" key="create">
              房主
            </Tag>,
          );
        } else if (type === CreateShareTypeEnum.JOIN) {
          nodes.push(<Tag key="create">成员</Tag>);
        }
        if (id == selfInfo?.id) {
          nodes.push(
            <Tag color="green" key="self">
              自己
            </Tag>,
          );
        }
        return nodes;
      },
    },
    {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (dom, createShare) => {
        const {id, type} = createShare;
        if (type === CreateShareTypeEnum.JOIN && isAdmin) {
          return (
            <CloseOutlined
              onClick={() => {
                adminSendMsg({type: ShareConstant.CLOSE_CLIENT, data: id});
              }}
            />
          );
        }
        return null;
      },
    },
  ];

  console.info(shareType);

  return (
    <>
      <Card className={styles.shareCard}>
        <Title>同一时刻享受同一首音乐</Title>
        <Row>
          <Radio.Group
            size="large"
            disabled={readyState === 1}
            buttonStyle="outline"
            value={shareType}
            defaultValue={shareType}
            onChange={(e) => setShareType(e.target.value)}
            options={[
              {label: '创建', value: CreateShareTypeEnum.CREATE},
              {label: '加入', value: CreateShareTypeEnum.JOIN},
            ]}
          />
          {readyState === 1 && (
            <>
              <Col>名称：</Col>
              <Col>
                <Text editable={{onChange: setSelfName}}>{selfName}</Text>
              </Col>
            </>
          )}
        </Row>
        {shareType === CreateShareTypeEnum.CREATE ? (
          <>
            <Row>房主会将当前播放的音乐共享给房间内的其他成员</Row>
            <Row>
              <Col md={{span: 12}} xs={{span: 24}}>
                <Form.Item label="房间ID">
                  <Search
                    style={{minWidth: 280}}
                    disabled={readyState === 1}
                    placeholder="请输入房间ID(可选)"
                    value={adminId || undefined}
                    defaultValue={adminId || undefined}
                    onChange={(event) => setAdminId(event.target.value)}
                    enterButton={
                      <Button disabled={readyState === 1}>
                        <SettingOutlined/>
                        随机
                      </Button>
                    }
                    onSearch={() => {
                      setAdminId(`admin-${v4()}`);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col md={{span: 12}} xs={{span: 24}}>
                <Button
                  onClick={createShare}
                  type="primary"
                  disabled={readyState === ReadyState.Open}
                >
                  <PlusCircleOutlined/>
                  创建共享
                </Button>
                <Button
                  type="primary"
                  onClick={exitShare}
                  disabled={readyState !== ReadyState.Open}
                >
                  <CloseCircleOutlined/>
                  停止共享
                </Button>
              </Col>
            </Row>
            {selfInfo && (
              <>
                <Row>其他伙伴打开链接就能加入共享啦!</Row>
                <Row>
                  共享链接：
                  <Paragraph copyable>{`${location.protocol}//${location.host}${
                    location.pathname
                  }?type=join&adminId=${encodeURI(selfInfo.id)}`}</Paragraph>
                </Row>
              </>
            )}
          </>
        ) : (
          <>
            <Row>加入房间后会跟随房主播放音乐, 您在共享过程中不能切换歌曲</Row>
            <Row>
              <Col md={{span: 12}} xs={{span: 24}}>
                <Form.Item label="共享链接">
                  <Input
                    style={{minWidth: 280}}
                    disabled={readyState === 1}
                    placeholder="请输入共享链接"
                    value={joinUrl || undefined}
                    defaultValue={joinUrl || undefined}
                    onChange={(event) => setJoinUrl(event.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col md={{span: 12}} xs={{span: 24}}>
                <Button
                  onClick={joinShare}
                  type="primary"
                  disabled={readyState === ReadyState.Open}
                >
                  <PlusCircleOutlined/>
                  加入共享
                </Button>
                <Button
                  onClick={exitShare}
                  type="primary"
                  disabled={readyState !== ReadyState.Open}
                >
                  <CloseCircleOutlined/>
                  退出共享
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Card>
      {readyState === 1 && (
        <ProTable<CreateShare>
          columns={columns}
          dataSource={sharerList}
          rowKey="id"
          options={false}
          search={false}
          dateFormatter="string"
          headerTitle={`共享用户 (${sharerList.length})`}
          pagination={false}
        />
      )}
    </>
  );
};
