import React, { useEffect } from 'react';
import { useModel } from '@@/plugin-model/useModel';
import useNext from '@/hooks/useMusicPlayer/useNext';
import usePaused from '@/hooks/useMusicPlayer/usePaused';
import { useRequest } from '@@/plugin-request/request';
import { lyric, LyricData, songUrl } from '@/services/song';
import { Datum, SongData } from '@/services/API';
import { message } from 'antd';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';

export default () => {
  const { currentSong } = useSelector<ConnectState, MusicModelState>((state) => state.musicPlayer);
  const { audioRef } = useModel('musicPlayer');
  const { setDatum } = useModel('datum');
  const { setCurrentSecond } = useModel('currentSecond');
  const { addHistory } = useModel('historyList');
  const { lyricObj, lyricPause, lyricPlay, setLyric } = useModel('lyricObj');
  const { next } = useNext();
  const { setPaused } = usePaused();
  const { run: songDataRun } = useRequest(songUrl, {
    manual: true,
  });

  /**
   * 播放/暂停/自动下一首/歌曲当前时间
   */
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    // 暂停
    const onPause = () => {
      setPaused(true);
      lyricPause();
    };
    // 播放
    const onPlay = () => {
      setPaused(false);
      lyricPlay();
      console.info('play', lyricObj);
    };
    // 当前时间
    const onTimeUpdate = () => {
      setCurrentSecond((it) => {
        if (it === ~~audioRef.current!.currentTime) {
          return it;
        }
        return ~~audioRef.current!.currentTime;
      });
    };
    audioRef.current.volume = 1;
    audioRef.current.addEventListener('pause', onPause);
    audioRef.current.addEventListener('play', onPlay);
    audioRef.current?.addEventListener('ended', next);
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audioRef.current?.removeEventListener('pause', onPause);
      audioRef.current?.removeEventListener('play', onPlay);
      audioRef.current?.removeEventListener('ended', next);
      audioRef.current?.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [audioRef, lyricObj, next]);

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
          // @ts-ignore
          setLyric(lyric.data.nolyric ? '' : lyric.data.lrc.lyric, lyric.data.tlyric.lyric);
          setTimeout(() => {
            audioRef.current!.src = datum.url;
          });
          if (!datum.url) {
            message.error('无版权或为付费歌曲, 3秒后播放下一首');
            timer0 = setTimeout(next, 3000);
          } else {
            addHistory(currentSong);
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

  return <audio ref={audioRef} autoPlay />;
};