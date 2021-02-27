import { useCallback } from 'react';
import { useModel } from '@@/plugin-model/useModel';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const { paused, setPaused } = useModel('pause');

  /**
   * 播放和暂停
   */
  const play = useCallback(() => {
    audioRef.current!.play();
  }, [audioRef]);

  const pause = useCallback(() => {
    audioRef.current!.pause();
  }, [audioRef]);
  return { play, pause, paused, setPaused };
};
