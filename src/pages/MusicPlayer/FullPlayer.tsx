import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';
import styles from './index.less';
import anime from 'animejs';
import { useModel } from '@@/plugin-model/useModel';
import Scroll from '@/components/MyScroll';
import { Col, Image, Row } from 'antd';

export interface SongDetail {
  currentTime: number;
  entireTime: number;
}

interface MiniPlayerProps {}

const MiniPlayer: React.FC<MiniPlayerProps> = () => {
  const { currentSong } = useSelector<ConnectState, MusicModelState>((state) => state.musicPlayer);
  const { lyricObj, noLyric, hasTLyric } = useModel('lyricObj');
  const { isFull } = useModel('full');
  const lyricLinesRef = useRef<HTMLUListElement>(null);
  const scrollRef = useRef<{ scrollToElement: any; scrollTo: any }>(null);
  // @ts-ignore
  const [visible, setVisible] = useState(false);

  // 设置歌词处理方法
  useEffect(() => {
    if (!lyricObj) {
      return;
    }
    const maxLineNum = hasTLyric ? 2 : 4;
    lyricObj.handler = (p: { lineNum: number; txt: string }) => {
      const { lineNum } = p;
      if (!lyricLinesRef.current) {
        return;
      }
      const lis = Array.from(lyricLinesRef.current.children);
      lis.forEach((it) => (it.className = styles.lyricItem));
      lis[lineNum].className = styles.currentLyric;
      if (lineNum - maxLineNum >= 0) {
        scrollRef.current?.scrollToElement(lis[lineNum - maxLineNum], 1000);
      }
    };
  }, [lyricLinesRef, scrollRef, hasTLyric, lyricObj]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [lyricObj, scrollRef]);

  // 全屏动画效果
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
      // 删除元素
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
          className={`${styles.baseFull} animeBaseFull `}
          style={{ transform: `translateY(${window.innerHeight + 100}px)` }}
        >
          <div className={styles.backgroundColor} />
          <div
            className={styles.backgroundImage}
            style={{ backgroundImage: `url(${currentSong.al.picUrl}?param=100y100)` }}
          />

          <div className={styles.fullCard}>
            <Row style={{ padding: '24px 0' }}>
              <Col
                offset={1}
                className={styles.cover}
                span={10}
                style={{ textAlign: 'center', alignSelf: 'center' }}
              >
                <Image src={`${currentSong.al.picUrl}`} width="70%" height="auto" />
              </Col>
              <Col offset={1} span={12}>
                <Scroll
                  reference={scrollRef}
                  click={true}
                  height={'calc(100vh - 78px - 48px)'}
                  animation={{ speed: 50 }}
                >
                  {noLyric ? (
                    <div className={styles.noLyric}>没有歌词</div>
                  ) : (
                    <ul ref={lyricLinesRef}>
                      {lyricObj?.lines.map((it, index) => (
                        <li
                          className={styles.lyricItem}
                          key={index}
                          dangerouslySetInnerHTML={{ __html: it.txt }}
                        />
                      ))}
                    </ul>
                  )}
                </Scroll>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default MiniPlayer;
