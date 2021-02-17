import { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';
import { Song } from '@/services/API';
import _ from 'lodash';
import { PlayMode } from '@/models/music';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const {
    index,
    setIndex: setIndex0,
    playList,
    setPlayList: setPlayList0,
    mode,
    setMode: setMode0,
  } = useModel('music');
  const [paused, setPaused] = useState(false);
  const currentSong: Song | null = useMemo(() => (playList.length ? playList[index] : null), [
    index,
    playList,
  ]);

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

  const setIndex = useCallback(
    (fun: (it: number) => number) => {
      if (!audioRef.current) {
        return;
      }
      setIndex0(fun);
      audioRef.current.src = '';
    },
    [audioRef],
  );

  /**
   * 下一首 和 上一首
   */
  const next = useCallback(() => {
    if (mode === 'single' || playList.length === 0) {
      if (audioRef.current?.ended) {
        audioRef.current.play();
      }
      return;
    }
    setIndex((it) => (it + 1) % playList.length);
  }, [index, mode, playList]);

  const pre = useCallback(() => {
    if (mode === 'single' || playList.length === 0) {
      if (audioRef.current?.ended) {
        audioRef.current.play();
      }
      return;
    }
    setIndex((it) => (it - 1 + playList.length) % playList.length);
  }, [index, mode, playList]);

  /**
   * 播放结束自动播放下一首
   */
  useEffect(() => {
    audioRef.current?.addEventListener('ended', next);
    return () => {
      audioRef.current?.removeEventListener('ended', next);
    };
  }, [audioRef, next]);

  /**
   * 设置播放列表
   */
  const setPlayList = useCallback(
    (fun: (list: Song[]) => Song[]) => {
      if (mode === 'cycle') {
        setPlayList0(fun);
      } else if (mode === 'random') {
        setPlayList0((it) => _.shuffle(fun(it)));
      }
    },
    [mode],
  );

  /**
   * 设置播放列表和索引
   */

  const setPlayListAndSongId = useCallback(
    (list: Song[], songId: number) => {
      setPlayList(() => list);
      setCurrentSong(songId);
    },
    [mode],
  );

  /**
   * 设置当前歌曲
   * @param song
   */
  const setCurrentSong = useCallback(
    (songId: number) => {
      const i = playList.findIndex((it) => it.id === songId);
      if (i === -1) {
        console.error('未找到该歌曲: ' + songId, playList);
      }
      setIndex(() => i);
    },
    [playList],
  );

  /**
   * 设置播放模式
   */
  const setMode = useCallback(
    (fun: (m: PlayMode) => PlayMode) => {
      setMode0(fun);
      // setPlayList(playList);
    },
    [playList],
  );

  useEffect(() => {
    setPlayList((it) => it);
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

  return {
    setIndex,
    currentSong,
    setCurrentSong,
    audioRef,
    paused,
    playList,
    setPlayList,
    mode,
    setMode,
    setPlayListAndIndex: setPlayListAndSongId,
    pre,
    next,
    play,
    pause,
  };
};
