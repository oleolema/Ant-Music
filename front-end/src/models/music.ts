import { useState } from 'react';
import { Song } from '@/services/API';

export type PlayMode = 'cycle' | 'random' | 'single';

export default () => {
  const [playList, setPlayList] = useState<Song[]>([]);
  const [mode, setMode] = useState<PlayMode>('cycle');
  const [index, setIndex] = useState(0);

  return { index, setIndex, playList, setPlayList, mode, setMode };
};
