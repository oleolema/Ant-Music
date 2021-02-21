import React, { useEffect } from 'react';
import MiniPlayer from '@/pages/MusicPlayer/MiniPlayer';
// @ts-ignore
import { useRequest } from '@@/plugin-request/request';
import { lyric, LyricData, songUrl } from '@/services/song';
import { Datum, SongData } from '@/services/API';
// @ts-ignore
import { message } from 'antd';
import useNext from '@/hooks/useMusicPlayer/useNext';
import { useModel } from '@@/plugin-model/useModel';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';
import FullPlayer from '@/pages/MusicPlayer/FullPlayer';

export function getTime(n: number) {
  return `${String(~~(n / 60)).padStart(2, '0')}:${String(~~(n % 60)).padStart(2, '0')}`;
}

const MusicPlayer: React.FC = () => {
  const { currentSong } = useSelector<ConnectState, MusicModelState>((state) => state.musicPlayer);
  const { audioRef } = useModel('musicPlayer');
  const { datum, setDatum } = useModel('datum');
  const { next } = useNext();
  const { lyricObj, setLyric, handler } = useModel('lyricObj');
  const { run: songDataRun } = useRequest(songUrl, {
    manual: true,
  });

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current?.addEventListener('ended', next);
    return () => {
      audioRef.current?.removeEventListener('ended', next);
    };
  }, [audioRef, next]);

  /**
   * 歌曲更改时触发
   */
  useEffect(() => {
    if (!currentSong || !audioRef.current) {
      return;
    }
    let timer0: NodeJS.Timeout;
    let timer1: NodeJS.Timeout;
    let closed = false;
    Promise.all([songDataRun([currentSong.id]), lyric(currentSong.id)]).then(
      ([res, lyric]: [any, LyricData]) => {
        const data = res as SongData;
        if (closed) {
          return;
        } else if (data?.data?.length == 1) {
          const datum = (data.data[0] as unknown) as Datum;
          setDatum(datum);
          console.info(handler);
          setLyric(lyric.data.lrc.lyric);
          setTimeout(() => {
            audioRef.current!.src = datum.url;
          });
          if (!datum.url) {
            message.error('无版权或为付费歌曲, 3秒后播放下一首');
            timer0 = setTimeout(next, 3000);
          }
        } else {
          message.error('播放失败, 3秒后播放下一首');
          timer1 = setTimeout(next, 3000);
        }
      },
    );
    return () => {
      closed = true;
      clearTimeout(timer0);
      clearTimeout(timer1);
    };
  }, [currentSong?.id]);

  // console.info(currentSongDetail);

  return (
    <>
      <audio ref={audioRef} autoPlay />
      <FullPlayer />
      <MiniPlayer entireTime={(currentSong?.dt || 0) / 1000} />
    </>
  );
};
export default MusicPlayer;
