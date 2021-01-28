import React, { useMemo, useRef, useState } from 'react';
import { Avatar, Card, Col, Row, Slider } from 'antd';
import style from './miniPlayer.less';
import Text from 'antd/es/typography/Text';
import {
  CaretRightOutlined,
  DownloadOutlined,
  PauseOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons/lib';
import { Datum } from '@/services/API';
import { useModel } from '@@/plugin-model/useModel';
import { getTime } from '@/pages/MusicPlayer/index';
import useMusicPlayer from '@/hooks/useMusicPlayer';
import indexStyle from '@/pages/index.less';

export interface SongDetail {
  currentTime: number;
  entireTime: number;
}

interface MiniPlayerProps {
  music: Datum;
  songDetail: SongDetail;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ music, songDetail }) => {
  const { paused, currentSong, pre, next, play, pause } = useMusicPlayer();

  return (
    currentSong && (
      <Card className={style.fixCard}>
        <Row gutter={10} align="middle">
          <Col>
            <Avatar size={50} shape="square" src={`${currentSong.al.picUrl}?param=100y100`} />
          </Col>
          <Col span={6}>
            <Row>
              <Text>{currentSong.name}</Text>
            </Row>
            <Row>
              <Text>{currentSong.ar.map((it) => it.name).join(' / ')}</Text>
            </Row>
          </Col>
          <Col span={12} className={indexStyle.noneSelect}>
            <Row justify="space-around" style={{ fontSize: '20px' }}>
              <Col>
                <StepBackwardOutlined onClick={pre} />
              </Col>
              <Col>
                {paused ? <CaretRightOutlined onClick={play} /> : <PauseOutlined onClick={pause} />}
              </Col>
              <Col>
                <StepForwardOutlined onClick={next} />
              </Col>
              <Col>
                <DownloadOutlined />
              </Col>
            </Row>
            <MiniSlider
              currentTime={~~songDetail.currentTime}
              entireTime={~~songDetail.entireTime}
            />
          </Col>
        </Row>
      </Card>
    )
  );
};

interface MiniSliderType {
  currentTime: number;
  entireTime: number;
}

function MiniSlider({ currentTime, entireTime }: MiniSliderType) {
  const [sliderValue, setSliderValue] = useState(-1);
  const { audioRef } = useModel('musicPlayer');
  const sliderRef = useRef<any>(null);

  return (
    <Row gutter={10} align="middle">
      <Col span={2}>{getTime(sliderValue === -1 ? currentTime : sliderValue)}</Col>
      <Col span={20}>
        <Slider
          ref={sliderRef}
          min={0}
          max={entireTime}
          tipFormatter={null}
          value={sliderValue === -1 ? currentTime : sliderValue}
          onChange={(v: number) => {
            setSliderValue(v);
          }}
          onAfterChange={(v: number) => {
            audioRef.current!.currentTime = v;
            sliderRef.current!.blur();
            setTimeout(() => {
              setSliderValue(-1);
            }, 20);
          }}
        />
      </Col>
      <Col span={2}>{useMemo(() => getTime(entireTime), [entireTime])}</Col>
    </Row>
  );
}

export default MiniPlayer;
