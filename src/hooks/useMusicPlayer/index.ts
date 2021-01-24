import { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';
import { Song } from '@/services/API';
import _ from 'lodash';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const { state, setState } = useModel('music');
  const [paused, setPaused] = useState(false);
  const currentSong: Song | null = useMemo(
    () => (state.playList.length ? state.playList[state.index] : null),
    [state.index, state.playList],
  );
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current!.onpause = () => setPaused(true);
    audioRef.current!.onplay = () => setPaused(false);
  }, [audioRef]);

  const setPlayList = useCallback(
    (list: Song[]) => {
      if (state.mode === 'circle') {
        setState((it) => ({
          ...it,
          playList: list,
        }));
      } else if (state.mode === 'random') {
        setState((it) => ({
          ...it,
          playList: _.shuffle(list),
        }));
      }
    },
    [state.mode],
  );

  const setIndex = (i: number) => {
    setState((it) => ({
      ...it,
      index: i,
    }));
  };

  const setPlayListAndIndex = useCallback(
    (list: Song[], i: number) => {
      setPlayList(list);
      setIndex(i);
    },
    [state.mode],
  );

  function setCurrentSong(song: Song) {
    const i = state.playList.findIndex((it) => it.id === song.id);
    if (i === -1) {
      console.error('未找到该歌曲: ' + song, state.playList);
    }
    setIndex(i);
  }

  const next = useCallback(() => {
    if (state.mode === 'single' || state.playList.length === 0) {
      return;
    }
    setIndex((state.index + 1) % state.playList.length);
  }, [state.index, state.mode, state.playList]);

  useEffect(() => {
    setPlayList(state.playList);
  }, [state.mode]);

  return {
    setIndex,
    currentSong,
    setCurrentSong,
    audioRef,
    paused,
    playList: state.playList,
    setPlayList,
    mode: state.mode,
    setPlayListAndIndex,
  };
};
