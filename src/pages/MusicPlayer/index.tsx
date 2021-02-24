import React, { useEffect } from 'react';
import MiniPlayer from '@/pages/MusicPlayer/MiniPlayer';
import FullPlayer from '@/pages/MusicPlayer/FullPlayer';
import MyAudio from '@/pages/MusicPlayer/MyAudio';
import { cloudSearch, searchSuggest } from '@/services/song';

export function getTime(n: number) {
  return `${String(~~(n / 60)).padStart(2, '0')}:${String(~~(n % 60)).padStart(2, '0')}`;
}

const MusicPlayer: React.FC = () => {
  useEffect(() => {
    cloudSearch('时间交错').then((res) => {
      console.info(res);
    });
    searchSuggest('时').then((res) => {
      console.info(res);
    });
  }, []);
  return (
    <>
      <MyAudio />
      <FullPlayer />
      <MiniPlayer />
    </>
  );
};
export default MusicPlayer;
