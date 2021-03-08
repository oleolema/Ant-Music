import { message } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { useCallback } from 'react';

export default () => {
  const { readyState, isAdmin, connected } = useModel('shareWebsocket');

  const canSetMusic = useCallback(() => {
    if (readyState !== 1 || isAdmin) {
      return true;
    }
    message.warn('共享中无法切换歌曲, 请先退出');
    return false;
  }, [readyState, isAdmin, connected]);

  return {
    canSetMusic,
  };
};
