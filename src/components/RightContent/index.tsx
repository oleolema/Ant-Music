import { Space, Tag, Tooltip } from 'antd';
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { SelectLang, useHistory, useModel } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import {
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  MinusOutlined,
} from '@ant-design/icons/lib';

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

// @ts-ignore
const currentWindow = window.electron?.remote.getCurrentWindow();

const GlobalHeaderRight: React.FC<{}> = () => {
  const { initialState } = useModel('@@initialState');
  const [maximized, setMaximized] = useState(false);
  const history = useHistory();

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const titleBar = useMemo(() => {
    if (!currentWindow) {
      return null;
    }
    return (
      <>
        <div
          className={styles.action}
          onClick={() => {
            currentWindow.minimize();
          }}
        >
          <MinusOutlined />
        </div>
        {maximized ? (
          <div
            className={styles.action}
            onClick={() => {
              currentWindow.restore();
              setMaximized(false);
            }}
          >
            <FullscreenExitOutlined />
          </div>
        ) : (
          <div
            className={styles.action}
            onClick={() => {
              currentWindow.maximize();
              setMaximized(true);
            }}
          >
            <FullscreenOutlined />
          </div>
        )}
        {console.info(styles)}
        <div
          className={`${styles.action} ${styles.closeAction}`}
          onClick={() => {
            currentWindow.close();
          }}
        >
          <CloseOutlined className={styles.closeIcon} />
        </div>
      </>
    );
  }, [maximized]);

  useEffect(() => {
    if (!currentWindow) {
      return;
    }
    const onMaximized = () => setMaximized(true);
    const onRestore = () => setMaximized(false);
    currentWindow.on('maximize', onMaximized);
    currentWindow.on('unmaximize', onRestore);

    return () => {
      if (!currentWindow) {
        return;
      }
      currentWindow.removeListener('maximize', onMaximized);
      currentWindow.removeListener('unmaximize', onRestore);
    };
  }, []);

  return (
    <Space className={className}>
      <LeftOutlined className={styles.action} onClick={history.goBack} />
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
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
      />
      {titleBar}
    </Space>
  );
};
export default GlobalHeaderRight;
