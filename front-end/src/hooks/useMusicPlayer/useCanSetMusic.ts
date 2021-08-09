import {message} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import {useCallback} from 'react';
import _ from "lodash";

export default () => {
  const {readyState, isAdmin, connected} = useModel('shareWebsocket');

  const canSetMusic = useCallback(_.throttle((notice: boolean = true) => {
    if (readyState !== 1 || isAdmin) {
      return true;
    }
    notice && message.warn('共享中无法切换歌曲, 请先退出');
    return false;
  }, 3000), [readyState, isAdmin, connected]);

  return {
    canSetMusic,
  };
};
