import React, { useMemo, useRef, useState } from 'react';
import { Avatar, Card, Col, Row, Slider } from 'antd';
import styles from './index.less';
import Text from 'antd/es/typography/Text';
import { useModel } from '@@/plugin-model/useModel';
import { getTime } from '@/pages/MusicPlayer/index';
import useMusicPlayer from '@/hooks/useMusicPlayer';
import indexStyle from '@/pages/index.less';
import usePaused from '@/hooks/useMusicPlayer/usePaused';
import useNext from '@/hooks/useMusicPlayer/useNext';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';
import playerIcon from '@/assets/player.png';

interface MiniPlayerProps {}

const MiniPlayer: React.FC<MiniPlayerProps> = () => {
  const { currentSong, mode } = useSelector<ConnectState, MusicModelState>(
    (state) => state.musicPlayer,
  );
  const { audioRef } = useModel('musicPlayer');
  const { taggerFull } = useModel('full');
  const { nextMode } = useMusicPlayer();
  const { paused, play, pause } = usePaused();
  const { pre, next } = useNext();
  const { volume, setVolume } = useModel('volume');

  return (
    currentSong && (
      <div className={styles.noBorder}>
        <Card className={styles.fixCard}>
          <Row align="middle">
            <Col span={6}>
              <Row gutter={10} align="middle">
                <Col onClick={taggerFull}>
                  <Avatar
                    style={{ cursor: 'pointer' }}
                    size={50}
                    shape="square"
                    src={`${currentSong.al.picUrl}?param=100y100`}
                  />
                </Col>
                <Col>
                  <Row>
                    <Text>{currentSong.name}</Text>
                  </Row>
                  <Row>
                    <Text>{currentSong.ar.map((it) => it.name).join(' / ')}</Text>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={12} className={indexStyle.noneSelect}>
              <Row justify="space-around" align="middle" style={{ fontSize: '20px' }}>
                <Col>
                  <div
                    style={{ backgroundImage: `url(${playerIcon})` }}
                    className={`${styles[`${mode}Icon`]} ${styles.playerIcon}`}
                    onClick={nextMode}
                  />
                </Col>
                <Col>
                  <div
                    style={{ backgroundImage: `url(${playerIcon})` }}
                    className={`${styles.prevIcon} ${styles.playerIcon}`}
                    onClick={pre}
                  />
                </Col>
                <Col>
                  {paused ? (
                    <div
                      style={{ backgroundImage: `url(${playerIcon})` }}
                      className={`${styles.playIcon} ${styles.playerIcon}`}
                      onClick={play}
                    />
                  ) : (
                    <div
                      style={{ backgroundImage: `url(${playerIcon})` }}
                      className={`${styles.pauseIcon} ${styles.playerIcon}`}
                      onClick={pause}
                    />
                  )}
                </Col>
                <Col>
                  <div
                    style={{ backgroundImage: `url(${playerIcon})` }}
                    className={`${styles.nextIcon} ${styles.playerIcon}`}
                    onClick={next}
                  />
                </Col>
                <Col>
                  <div
                    style={{ backgroundImage: `url(${playerIcon})` }}
                    className={`${styles.downloadIcon} ${styles.playerIcon}`}
                  />
                </Col>
              </Row>
              <MiniSlider entireTime={~~((currentSong?.dt || 0) / 1000)} />
            </Col>
            <Col span={6}>
              <Row align="middle">
                <Col span={2}>
                  <div
                    style={{ backgroundImage: `url(${playerIcon})` }}
                    className={`${styles.volumeIcon} ${styles.playerIcon}`}
                    onClick={nextMode}
                  />
                </Col>
                <Col span={10}>
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

function MiniSlider({ entireTime }: MiniSliderType) {
  const { currentSecond } = useModel('currentSecond');
  const [sliderValue, setSliderValue] = useState(-1);
  const [sliding, setSliding] = useState(false);
  const { audioRef } = useModel('musicPlayer');
  const { lyricObj, lyricPlay } = useModel('lyricObj');
  const { paused, play } = usePaused();
  const sliderRef = useRef<any>(null);

  console.info(currentSecond, sliderValue, sliding);

  return (
    <Row gutter={10} align="middle">
      <Col span={2}>{getTime(sliding ? sliderValue : currentSecond)}</Col>
      <Col span={20}>
        <Slider
          ref={sliderRef}
          min={0}
          max={entireTime}
          tipFormatter={null}
          value={sliding ? sliderValue : currentSecond}
          onChange={(v: number) => {
            setSliderValue(v);
            setSliding(true);
          }}
          onAfterChange={(v: number) => {
            audioRef.current!.currentTime = v;
            lyricObj?.seek(v * 1000);
            if (paused) {
              lyricPlay();
              play();
            }
            sliderRef.current!.blur();
            setTimeout(() => {
              setSliding(false);
            }, 20);
          }}
        />
      </Col>
      <Col span={2}>{useMemo(() => getTime(entireTime), [entireTime])}</Col>
    </Row>
  );
}

export default React.memo(MiniPlayer);
