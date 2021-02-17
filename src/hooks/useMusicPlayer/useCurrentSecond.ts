import { useEffect, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const [currentSecond, setCurrentSecond] = useState<number>(0);
  /**
   * 初始化播放器: 监听播放器事件, 配置播放器属性
   */
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    const onTimeUpdate = () => {
      setCurrentSecond((it) => {
        if (it === ~~audioRef.current!.currentTime) {
          return it;
        }
        return ~~audioRef.current!.currentTime;
      });
    };
    audioRef.current.volume = 1;
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audioRef.current?.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [audioRef]);

  return currentSecond;
};
