import React from 'react';
import MiniPlayer from '@/pages/MusicPlayer/MiniPlayer';
import FullPlayer from '@/pages/MusicPlayer/FullPlayer';
import MyAudio from '@/pages/MusicPlayer/MyAudio';
import Share from '@/pages/ShareMusic/Share';

export function getTime(n: number) {
  return `${String(~~(n / 60)).padStart(2, '0')}:${String(~~(n % 60)).padStart(2, '0')}`;
}

const MusicPlayer: React.FC = () => {
  return (
    <>
      <Share />
      <MyAudio />
      <FullPlayer />
      <MiniPlayer />
    </>
  );
};
export default MusicPlayer;
