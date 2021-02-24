import { useCallback } from 'react';
import { Song } from '@/services/API';
import { useDispatch } from '@@/plugin-dva/exports';
import { useModel } from '@@/plugin-model/useModel';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const dispatch0 = useDispatch();

  const dispatch = useCallback((type: string, payload: any = null) => {
    dispatch0({ type: `musicPlayer/${type}`, payload });
  }, []);

  return {
    dispatch,
    setPlayList: useCallback((playList: Song[]) => dispatch('setPlayList', playList), []),
    clearPlayList: useCallback(() => dispatch('setPlayList', []), []),
    deleteSongFromPlayList: useCallback(
      (song: Song) => dispatch('deleteSongFromPlayList', song),
      [],
    ),
    setCurrentSongId: useCallback((songId: number) => dispatch('setCurrentSongId', songId), []),
    setPlayListAndSongId: useCallback(
      (payload: { playList: Song[]; songId: number }) =>
        dispatch('setPlayListAndCurrentSongId', payload),
      [],
    ),
    insertSong: useCallback((payload: Song) => dispatch('insertSong', payload), []),
    setPlayListAndPlay: useCallback((playList: Song[]) => {
      dispatch('setPlayListAndPlay', playList);
      audioRef.current?.play();
    }, []),
    nextMode: useCallback(() => dispatch('nextMode'), []),
  };
};
