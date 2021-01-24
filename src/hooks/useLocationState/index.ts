import { useLocation } from 'umi';
import { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useModel } from '@@/plugin-model/useModel';

interface Options {
  globalCache?: string;
}

/**
 * 缓存 location state 中的内容： 切换页面也不会更新state， 唯一能更新state的方法是其他页面重新传入state
 * @param onChange 当缓存的 state 更新时回调
 * @param defaultState 默认的 state
 * @param options 全局缓存的key，
 *                    若没有指定key， 则为组件级缓存， 但组件被卸载，缓存就会失效，
 *                    若指定key， 则为全局缓存， 组件的生命周期不会影响state的内容
 */
export default <T>(onChange: (v: T) => void, defaultState: T, options?: Options) => {
  const { globalCache = '' } = options || {};
  const { state = defaultState } = useLocation();
  const { __locationState } = useModel('global');
  const cacheState = globalCache ? __locationState : useRef<T>(defaultState);

  if (cacheState.current[globalCache] === undefined) {
    cacheState.current[globalCache] = defaultState;
  }

  useEffect(() => {
    if (state === undefined || _.isEqual(defaultState, state)) {
      return;
    }
    console.info(state);
    cacheState.current[globalCache] = state;
    onChange(cacheState.current[globalCache]);
  }, [state]);

  return [cacheState.current[globalCache], state];
};
