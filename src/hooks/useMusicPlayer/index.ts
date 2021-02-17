import { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';
import { Song } from '@/services/API';
import { useDispatch, useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const { index, playList, mode, originList } = useSelector<ConnectState, MusicModelState>(
    (state) => state.musicPlayer,
  );
  const dispatch0 = useDispatch();
  const [paused, setPaused] = useState(false);
  const currentSong: Song | null = useMemo(() => (playList.length ? playList[index] : null), [
    index,
    playList,
  ]);

  const dispatch = (type: string, payload: any = {}) => {
    dispatch0({ type: `musicPlayer/${type}`, payload });
  };

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

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    const onPause = () => setPaused(true);
    const onPlay = () => setPaused(false);
    audioRef.current.addEventListener('pause', onPause);
    audioRef.current.addEventListener('play', onPlay);
    audioRef.current?.addEventListener('ended', next);
    return () => {
      audioRef.current?.removeEventListener('pause', onPause);
      audioRef.current?.removeEventListener('play', onPlay);
      audioRef.current?.removeEventListener('ended', next);
    };
  }, [audioRef, next]);

  useEffect(() => {
    dispatch('playlist', originList);
  }, [mode]);

  /**
   * 播放和暂停
   */
  const play = useCallback(() => {
    audioRef.current!.play();
  }, [audioRef]);

  const pause = useCallback(() => {
    audioRef.current!.pause();
  }, [audioRef]);

  const changeMode = () => {
    switch (mode) {
      case 'cycle':
        return dispatch('setMode', 'random');
      case 'random':
        return dispatch('setMode', 'single');
      case 'single':
        return dispatch('setMode', 'cycle');
    }
  };

  return {
    currentSong,
    audioRef,
    paused,
    playList,
    mode,
    play,
    pause,
    changeMode,
    pre,
    next,
    setPlayList: useCallback((playList: Song[]) => dispatch('setPlayList', playList), []),
    setCurrentSongId: useCallback((songId: number) => dispatch('setCurrentSongId', songId), []),
    setPlayListAndSongId: useCallback(
      (payload: { playList: Song[]; songId: number }) =>
        dispatch('setPlayListAndCurrentSongId', payload),
      [],
    ),
  };
};
