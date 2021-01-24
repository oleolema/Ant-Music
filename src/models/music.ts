import { useState } from 'react';
import { Song } from '@/services/API';

export default () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playList, setPlayList] = useState<Song[] | null>(null);
  const [mode, setMode] = useState<'circle' | 'random' | 'single'>('circle');

  return { currentSong, setCurrentSong, playList, setPlayList, mode, setMode };
};
