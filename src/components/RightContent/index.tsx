import { Space } from 'antd';
import { LeftOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useModel } from 'umi';
import styles from './index.less';
import {
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  MinusOutlined,
} from '@ant-design/icons/lib';

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
      <LeftOutlined
        style={{
          cursor: 'pointer',
        }}
        className={styles.action}
        onClick={history.goBack}
      />
      <SearchOutlined
        key="Icon"
        style={{
          cursor: 'pointer',
        }}
        className={styles.action}
        onClick={() => {
          history.push('/search');
        }}
      />
      {titleBar}
    </Space>
  );
};
export default GlobalHeaderRight;
