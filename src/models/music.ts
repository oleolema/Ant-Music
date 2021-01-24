import { useState } from 'react';
import { Song } from '@/services/API';

export default () => {
  // const [playList, setPlayList] = useState<Song[]>([]);
  // const [mode, setMode] = useState<'circle' | 'random' | 'single'>('circle');
  // const [index, setIndex] = useState(0);

  const [state, setState] = useState<{
    index: number;
    playList: Song[];
    mode: 'circle' | 'random' | 'single';
  }>({
    index: 0,
    playList: [],
    mode: 'circle',
  });

  return { state, setState };
};
