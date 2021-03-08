import { useCallback } from 'react';
import { useDispatch, useSelector } from '@@/plugin-dva/exports';
import { useModel } from '@@/plugin-model/useModel';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const { playList, mode } = useSelector<ConnectState, MusicModelState>(
    (state) => state.musicPlayer,
  );
  const dispatch0 = useDispatch();
  const dispatch = useCallback((type: string, payload: any = {}) => {
    dispatch0({ type: `musicPlayer/${type}`, payload });
  }, []);
  const pre = useCallback(() => {
    if (mode === 'single' || playList.length === 0) {
      if (audioRef.current?.ended) {
        audioRef.current.play();
      }
      return;
    }
    dispatch('pre');
  }, [mode, playList, audioRef]);

  const next = useCallback(() => {
    if (mode === 'single' || playList.length === 0) {
      if (audioRef.current?.ended) {
        audioRef.current.play();
      }
      return;
    }
    dispatch('next');
  }, [mode, playList, audioRef]);

  return {
    pre,
    next,
  };
};
