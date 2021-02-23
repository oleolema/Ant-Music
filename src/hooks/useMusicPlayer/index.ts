import { useCallback } from 'react';
import { Song } from '@/services/API';
import { useDispatch } from '@@/plugin-dva/exports';

export default () => {
  const dispatch0 = useDispatch();

  const dispatch = useCallback((type: string, payload: any = null) => {
    dispatch0({ type: `musicPlayer/${type}`, payload });
  }, []);

  return {
    dispatch,
    setPlayList: useCallback((playList: Song[]) => dispatch('setPlayList', playList), []),
    setCurrentSongId: useCallback((songId: number) => dispatch('setCurrentSongId', songId), []),
    setPlayListAndSongId: useCallback(
      (payload: { playList: Song[]; songId: number }) =>
        dispatch('setPlayListAndCurrentSongId', payload),
      [],
    ),
    nextMode: useCallback(() => dispatch('nextMode'), []),
  };
};
