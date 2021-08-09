import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Avatar, Card, Col, Row, Slider} from 'antd';
import styles from './index.less';
import Text from 'antd/es/typography/Text';
import {useModel} from '@@/plugin-model/useModel';
import {getTime} from '@/pages/MusicPlayer/index';
import useMusicPlayer from '@/hooks/useMusicPlayer';
import indexStyle from '@/pages/index.less';
import usePaused from '@/hooks/useMusicPlayer/usePaused';
import useNext from '@/hooks/useMusicPlayer/useNext';
import {useSelector} from '@@/plugin-dva/exports';
import {ConnectState} from '@/models/connect';
import {MusicModelState} from '@/models/musicModel';
import playerIcon from '@/assets/player.png';
import useCanSetMusic from '@/hooks/useMusicPlayer/useCanSetMusic';
import {downloadSong} from '@/utils/utils';

interface MiniPlayerProps {
}

const MiniPlayer: React.FC<MiniPlayerProps> = () => {
  const {currentSong, mode} = useSelector<ConnectState, MusicModelState>(
    (state) => state.musicPlayer,
  );
  const {audioRef} = useModel('musicPlayer');
  const {taggerFull} = useModel('full');
  const {nextMode} = useMusicPlayer();
  const {paused, play, pause} = usePaused();
  const {pre, next} = useNext();
  const {volume, setVolume} = useModel('volume');
  const {canSetMusic} = useCanSetMusic();

  return (
    currentSong && (
      <div className={styles.noBorder}>
        <Card className={styles.fixCard}>
          <Row align="middle" gutter={20}>
            <Col sm={{span: 6}} xs={{span: 9}}>
              <Row gutter={10} align="middle" style={{flexWrap: 'nowrap', overflow: 'hidden'}}>
                <Col onClick={taggerFull}>
                  <Avatar
                    style={{cursor: 'pointer'}}
                    size={50}
                    shape="square"
                    src={`${currentSong.al?.picUrl}?param=100y100`}
                  />
                </Col>
                <Col>
                  <div>
                    <Text ellipsis>{currentSong.name}</Text>
                  </div>
                  <div>
                    <Text ellipsis>{currentSong.ar?.map((it) => it.name).join(' / ')}</Text>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col sm={{span: 12}} xs={{span: 14}} className={indexStyle.noneSelect}>
              <Row justify="space-around" align="middle" style={{fontSize: '20px'}}>
                <Col>
                  <div
                    style={{backgroundImage: `url(${playerIcon})`}}
                    className={`${styles[`${mode}Icon`]} ${styles.playerIcon}`}
                    onClick={nextMode}
                  />
                </Col>
                <Col>
                  <div
                    style={{backgroundImage: `url(${playerIcon})`}}
                    className={`${styles.prevIcon} ${styles.playerIcon}`}
                    onClick={() => {
                      if (!canSetMusic()) {
                        return;
                      }
                      pre();
                    }}
                  />
                </Col>
                <Col>
                  {paused ? (
                    <div
                      style={{backgroundImage: `url(${playerIcon})`}}
                      className={`${styles.playIcon} ${styles.playerIcon}`}
                      onClick={() => {
                        if (!canSetMusic()) {
                          return;
                        }
                        play();
                      }}
                    />
                  ) : (
                    <div
                      style={{backgroundImage: `url(${playerIcon})`}}
                      className={`${styles.pauseIcon} ${styles.playerIcon}`}
                      onClick={() => {
                        if (!canSetMusic()) {
                          return;
                        }
                        pause();
                      }}
                    />
                  )}
                </Col>
                <Col>
                  <div
                    style={{backgroundImage: `url(${playerIcon})`}}
                    className={`${styles.nextIcon} ${styles.playerIcon}`}
                    onClick={() => {
                      if (!canSetMusic()) {
                        return;
                      }
                      next();
                    }}
                  />
                </Col>
                <Col>
                  <div
                    style={{backgroundImage: `url(${playerIcon})`}}
                    className={`${styles.downloadIcon} ${styles.playerIcon}`}
                    onClick={() => downloadSong(currentSong)}
                  />
                </Col>
              </Row>
              <MiniSlider entireTime={~~((currentSong?.dt || 0) / 1000)}/>
            </Col>
            <Col sm={{span: 6}} xs={{span: 0}}>
              <Row align="middle">
                <Col>
                  <div
                    style={{backgroundImage: `url(${playerIcon})`}}
                    className={`${styles.volumeIcon} ${styles.playerIcon}`}
                    onClick={nextMode}
                  />
                </Col>
                <Col lg={{span: 10}} span={16}>
                  <Slider
                    defaultValue={volume * 100}
                    min={0}
                    max={100}
                    step={1}
                    tipFormatter={null}
                    onChange={(v: number) => {
                      if (!audioRef.current) {
                        return;
                      }
                      setVolume(v / 100);
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </div>
    )
  );
};

interface MiniSliderType {
  entireTime: number;
}

function MiniSlider({entireTime}: MiniSliderType) {
  // const { currentSong } = useSelector<ConnectState, MusicModelState>((state) => state.musicPlayer);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [sliderValue, setSliderValue] = useState(-1);
  const [sliding, setSliding] = useState(false);
  const {audioRef} = useModel('musicPlayer');
  const {lyricObj, lyricPlay} = useModel('lyricObj');
  const {setSlideAfterValue} = useModel('slideAfterChange');
  const {paused, play} = usePaused();
  const sliderRef = useRef<any>(null);
  const {canSetMusic} = useCanSetMusic();

  useEffect(() => {
    setSliding(false);
  }, [paused, lyricObj]);

  // useEffect(() => {
  //   setCurrentSecond(0);
  // }, [currentSong?.id]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    // 当前时间
    const onTimeUpdate = () => {
      setCurrentSecond((it) => {
        if (it === ~~audioRef.current!.currentTime) {
          return it;
        }
        return ~~audioRef.current!.currentTime;
      });
    };
    audioRef.current.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audioRef.current?.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [audioRef, sliding]);

  // console.info(currentSecond, sliderValue, sliding);

  return (
    <Row gutter={10} align="middle">
      <Col sm={{span: 2}} xs={{span: 5}}>
        {getTime(sliding ? sliderValue : currentSecond)}
      </Col>
      <Col sm={{span: 20}} xs={{span: 14}}>
        <Slider
          ref={sliderRef}
          min={0}
          max={entireTime}
          tipFormatter={null}
          value={sliding ? sliderValue : currentSecond}
          onChange={(v: number) => {
            if (!canSetMusic(false)) {
              return;
            }
            setSliderValue(v);
            setSliding(true);
            console.info('asdf');
          }}
          onAfterChange={(v: number) => {
            if (!canSetMusic(false)) {
              return;
            }
            audioRef.current!.currentTime = v;
            setCurrentSecond(~~v);
            lyricObj?.seek(v * 1000);
            if (paused) {
              lyricPlay();
              play();
            }
            sliderRef.current!.blur();
            setSlideAfterValue(v);
            setTimeout(() => {
              setSliding(false);
            }, 200);
          }}
        />
      </Col>
      <Col span={2}>{useMemo(() => getTime(entireTime), [entireTime])}</Col>
    </Row>
  );
}

export default React.memo(MiniPlayer);
