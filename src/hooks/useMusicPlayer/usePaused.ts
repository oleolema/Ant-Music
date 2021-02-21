import { useCallback, useEffect, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const { lyricObj } = useModel('lyricObj');
  const [paused, setPaused] = useState(audioRef.current?.paused);
  console.info('usePaused', lyricObj);
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    const onPause = () => {
      setPaused(true);
      lyricObj?.togglePlay();
    };
    const onPlay = () => {
      setPaused(false);
      lyricObj?.togglePlay();
      console.info('play', lyricObj);
    };
    audioRef.current.addEventListener('pause', onPause);
    audioRef.current.addEventListener('play', onPlay);
    return () => {
      audioRef.current?.removeEventListener('pause', onPause);
      audioRef.current?.removeEventListener('play', onPlay);
    };
  }, [audioRef, lyricObj]);
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
