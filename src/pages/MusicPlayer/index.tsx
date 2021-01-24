import React, { useEffect, useState } from 'react';
import MiniPlayer, { SongDetail } from '@/pages/MusicPlayer/MiniPlayer';
import { useRequest } from '@@/plugin-request/request';
import { songUrl } from '@/services/song';
import { Datum, Song, SongData } from '@/services/API';
import { message } from 'antd';
import useMusicPlayer from '@/hooks/useMusicPlayer';

export function getTime(n: number) {
  return `${String(~~(n / 60)).padStart(2, '0')}:${String(~~(n % 60)).padStart(2, '0')}`;
}

export function initSongDetail(song: Song): SongDetail {
  return {
    currentTime: 0,
    entireTime: song.dt / 1000,
  };
}

const MusicPlayer: React.FC = () => {
  const { currentSong, audioRef } = useMusicPlayer();
  const [currentSongDetail, setCurrentSongDetail] = useState<SongDetail | null>(null);

  const [datum, setDatum] = useState<Datum>();

  const { run: songDataRun } = useRequest(songUrl, {
    manual: true,
  });

  /**
   * 初始化播放器: 监听播放器事件, 配置播放器属性
   */
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.volume = 0.1;
    audioRef.current.ontimeupdate = (e) => {
      if (!audioRef.current) {
        return;
      }
      setCurrentSongDetail((it) => {
        if (it === null || it?.currentTime === ~~audioRef.current!.currentTime) {
          return it;
        }
        return { ...it, currentTime: ~~audioRef.current!.currentTime };
      });
    };
  }, [audioRef]);

  /**
   * 歌曲更改时触发
   */
  useEffect(() => {
    if (!currentSong || !audioRef.current) {
      return;
    }
    songDataRun([currentSong.id]).then((res) => {
      const data = res as SongData;
      if (data?.data?.length == 1) {
        const datum = (data.data[0] as unknown) as Datum;
        setDatum(datum);
        console.info('a', audioRef.current);
        audioRef.current!.src = datum.url;
        if (!datum.url) {
          message.error('无版权或为付费歌曲');
        }
      } else {
        message.error('播放失败');
      }
    });
    setCurrentSongDetail(initSongDetail(currentSong));
  }, [currentSong]);

  useEffect(() => {
    setInterval(() => {
      console.info(audioRef.current);
    }, 1000);
  }, []);

  console.info(currentSongDetail);

  return (
    <>
      <audio ref={audioRef} autoPlay />
      {datum && currentSongDetail && (
        <>
          <MiniPlayer music={datum} songDetail={currentSongDetail} />
        </>
      )}
    </>
  );
};
export default MusicPlayer;
