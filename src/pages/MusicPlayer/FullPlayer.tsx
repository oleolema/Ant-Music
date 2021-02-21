import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';
import style from './index.less';
import anime from 'animejs/lib/anime.es.js';
import { useModel } from '@@/plugin-model/useModel';

export interface SongDetail {
  currentTime: number;
  entireTime: number;
}

interface MiniPlayerProps {}

const MiniPlayer: React.FC<MiniPlayerProps> = () => {
  const { currentSong, isFull } = useSelector<ConnectState, MusicModelState>(
    (state) => state.musicPlayer,
  );
  const { setHandler, lyricObj } = useModel('lyricObj');
  const lyricLinesRef = useRef();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setHandler((it: any) => ({ lineNum, txt }) => {
      console.info(txt);
    });
  }, []);
  // const lyricHandler = useCallback(({ lineNum, txt }) => {
  //   console.info(txt);
  // }, []);
  //
  // useEffect(() => {
  //   if (!currentSong) {
  //     return;
  //   }
  //   lyric(currentSong?.id).then((res) => {
  //     console.info(res.data.lrc.lyric);
  //     console.info(res.data.tlyric.lyric);
  //
  //   });
  // }, [currentSong?.id]);

  // useEffect(() => {
  //   console.info('ad');

  // }, []);

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    if (isFull) {
      anime({
        targets: '.animeBaseFull',
        translateY: 0,
        easing: 'spring(1, 100, 15, 5)',
        opacity: 1,
      });
      setVisible(true);
    } else {
      anime({
        targets: '.animeBaseFull',
        translateY: window.innerHeight + 100,
        easing: 'spring(1, 100, 15, 5)',
        opacity: 0.5,
      });
      timer1 = setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timer1);
    };
  }, [isFull]);
  // ${
  //             isFull ? style.fullVisible : style.fullHidden
  //           }
  return (
    <>
      {currentSong && (
        <div
          className={`${style.baseFull} animeBaseFull `}
          style={{ transform: `translateY(${window.innerHeight + 100}px)` }}
        >
          {visible && (
            <>
              <div className={style.backgroundColor} />
              <div
                className={style.backgroundImage}
                style={{ backgroundImage: `url(${currentSong.al.picUrl}?param=100y100)` }}
              />
              <Card className={style.fullCard} style={{ overflowY: 'scroll' }}>
                <li style={{ height: 10000 }}>
                  {lyricObj.lines.map((it) => (
                    <ul>${it}</ul>
                  ))}
                </li>
              </Card>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MiniPlayer;
