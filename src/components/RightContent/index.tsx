import {Space, Tag, Tooltip} from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {SelectLang, useModel} from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import {CloseOutlined, FullscreenExitOutlined, FullscreenOutlined, MinusOutlined} from "@ant-design/icons/lib";

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

// @ts-ignore
const currentWindow = window.electron?.remote.getCurrentWindow();


const GlobalHeaderRight: React.FC<{}> = () => {
  const {initialState} = useModel('@@initialState');
  const [maximized, setMaximized] = useState(false);

  if (!initialState || !initialState.settings) {
    return null;
  }

  const {navTheme, layout} = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  useEffect(() => {
    const onMaximized = () => setMaximized(true);
    const onRestore = () => setMaximized(false);
    currentWindow.on("maximize", onMaximized);
    currentWindow.on("unmaximize", onRestore);
    return () => {
      currentWindow.removeListener("maximize", onMaximized);
      currentWindow.removeListener("unmaximize", onRestore);
    }
  }, []);

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={[
          {label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui'},
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        // onSearch={value => {
        //   console.log('input', value);
        // }}
      />
      <Tooltip title="使用文档">
        <span
          className={styles.action}
          onClick={() => {
            window.location.href = 'https://pro.ant.design/docs/getting-started';
          }}
        >
          <QuestionCircleOutlined/>
        </span>
      </Tooltip>
      <Avatar/>
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={styles.action}/>
      <div className={styles.action} onClick={() => {
        currentWindow.minimize();
      }}><MinusOutlined/></div>
      {maximized ? <div className={styles.action} onClick={() => {
        currentWindow.restore();
        setMaximized(false);
      }}><FullscreenExitOutlined/></div> : <div className={styles.action} onClick={() => {
        currentWindow.maximize();
        setMaximized(true);
      }}><FullscreenOutlined/></div>}
      {console.info(styles)}
      <div className={`${styles.action} ${styles.closeAction}`}>
        <CloseOutlined className={styles.closeIcon} onClick={() => {
          currentWindow.close();
        }}/></div>
    </Space>
  );
};
export default GlobalHeaderRight;