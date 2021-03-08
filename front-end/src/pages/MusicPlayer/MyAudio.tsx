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
import store2 from 'store2';
import useMusicPlayer from '@/hooks/useMusicPlayer';

const store = store2.namespace('music');

export default () => {
  const musicPlayer = useSelector<ConnectState, MusicModelState>((state) => state.musicPlayer);
  const { currentSong, playList, autoPlay } = musicPlayer;
  const { audioRef } = useModel('musicPlayer');
  const { setDatum } = useModel('datum');
  const { addHistory } = useModel('historyList');
  const { volume } = useModel('volume');
  const { setMiniVisible } = useModel('miniMusic');
  const { lyricObj, lyricPause, lyricPlay, setLyric } = useModel('lyricObj');
  const { next } = useNext();
  const { setAutoPlay } = useMusicPlayer();
  const { setPaused, pause } = usePaused();
  const { run: songDataRun } = useRequest(songUrl, {
    manual: true,
  });

  useEffect(() => {
    store.setAll({ ...musicPlayer, autoPlay: !Boolean(currentSong?.id) });
  }, [musicPlayer]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (playList.length === 0) {
      audioRef.current.src = '';
      setMiniVisible(false);
    }
  }, [playList]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.volume = volume;
  }, [volume]);

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

    audioRef.current.addEventListener('pause', onPause);
    audioRef.current.addEventListener('play', onPlay);
    audioRef.current?.addEventListener('ended', next);

    return () => {
      audioRef.current?.removeEventListener('pause', onPause);
      audioRef.current?.removeEventListener('play', onPlay);
      audioRef.current?.removeEventListener('ended', next);
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
          setLyric(lyric.data?.nolyric ? '' : lyric.data?.lrc?.lyric, lyric.data?.tlyric?.lyric);
          setTimeout(() => {
            audioRef.current!.src = datum.url;
            setTimeout(() => {
              setAutoPlay(true);
            }, 500);
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
      pause();
      audioRef.current && (audioRef.current.src = '');
      setLyric('');
    };
  }, [currentSong?.id]);

  return <audio ref={audioRef} autoPlay={autoPlay} />;
};
