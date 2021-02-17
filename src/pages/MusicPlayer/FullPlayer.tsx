import React from 'react';
import { Card } from 'antd';
import { Datum } from '@/services/API';
import useMusicPlayer from '@/hooks/useMusicPlayer';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';

export interface SongDetail {
  currentTime: number;
  entireTime: number;
}

interface MiniPlayerProps {
  music: Datum;
  songDetail: SongDetail;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ music, songDetail }) => {
  const { currentSong } = useSelector<ConnectState, MusicModelState>((state) => state.musicPlayer);

  return currentSong && <Card>full</Card>;
};

export default MiniPlayer;
