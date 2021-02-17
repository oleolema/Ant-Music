import { useCallback, useEffect, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const [paused, setPaused] = useState(audioRef.current?.paused);
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    const onPause = () => setPaused(true);
    const onPlay = () => setPaused(false);
    audioRef.current.addEventListener('pause', onPause);
    audioRef.current.addEventListener('play', onPlay);
    return () => {
      audioRef.current?.removeEventListener('pause', onPause);
      audioRef.current?.removeEventListener('play', onPlay);
    };
  }, [audioRef]);
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
