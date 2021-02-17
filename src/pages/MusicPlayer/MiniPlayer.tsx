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
import Icon from '@ant-design/icons';

// @ts-ignore
const RandomSvg = () => (
  <svg viewBox="0 0 1024 1024" version="1.1" width="1em" height="1em">
    <path d="M430.506667 533.333333c4.693333-11.733333 9.173333-23.466667 12.8-35.84a53.12 53.12 0 0 1 2.346666-6.186666A309.333333 309.333333 0 0 1 725.333333 280.746667v66.56a30.506667 30.506667 0 0 0 48.213334 25.173333l130.773333-91.306667a30.72 30.72 0 0 0 0-50.346666l-130.773333-91.306667A30.506667 30.506667 0 0 0 725.333333 164.693333v52.053334a372.053333 372.053333 0 0 0-303.573333 176c-3.413333 5.546667-6.613333 11.306667-9.813333 16.853333a322.56 322.56 0 0 0-16.853334 34.56l-1.92 4.693333a336.426667 336.426667 0 0 0-12.8 35.626667A309.973333 309.973333 0 0 1 114.133333 700.373333a32 32 0 0 0 5.973334 64 372.693333 372.693333 0 0 0 282.24-174.933333c3.413333-5.546667 6.4-11.093333 9.6-16.64a346.453333 346.453333 0 0 0 16.64-34.773333z" />
    <path d="M114.133333 281.6a309.546667 309.546667 0 0 1 251.733334 178.773333 379.306667 379.306667 0 0 1 33.706666-71.68 372.906667 372.906667 0 0 0-279.466666-170.666666A32 32 0 0 0 85.333333 250.026667a31.786667 31.786667 0 0 0 28.8 31.573333zM904.106667 700.16l-130.56-91.306667A30.506667 30.506667 0 0 0 725.333333 634.026667v67.2a309.546667 309.546667 0 0 1-267.52-179.626667 411.946667 411.946667 0 0 1-33.28 71.68A372.266667 372.266667 0 0 0 725.333333 765.226667v51.413333a30.506667 30.506667 0 0 0 48.213334 25.173333l130.773333-91.306666a30.72 30.72 0 0 0-0.213333-50.346667z" />
  </svg>
);

const CycleSvg = () => (
  <svg viewBox="0 0 1024 1024" version="1.1" width="1em" height="1em">
    <path d="M99.743114 674.724385c-24.627619 6.625705-50.005317-7.875837-56.881049-32.503457-10.126077-36.378868-15.251622-74.00787-15.001595-111.886897v-0.500053c-0.37504-110.386738 42.754546-216.398011 120.137775-295.031373C223.756301 156.79431 327.892374 112.664618 436.653939 112.539604h431.545889v-83.633893c0-26.752845 18.001914-36.753908 40.004254-22.252366L1106.475165 136.917197c22.127353 14.501542 21.877326 37.879028-0.500053 52.00553l-197.145964 124.263213c-22.37738 14.251515-40.62932 3.875412-40.62932-22.877432V206.799628H438.029086c-175.393651 0.250027-317.533765 145.01542-317.533765 323.534403 0 30.75327 4.250452 60.506434 12.001276 88.759438 5.375572 24.127566-8.750931 48.255131-32.378443 55.380889l-0.37504 0.250027z m1065.238273-292.781133c9.87605 36.503882 14.876582 74.132883 14.876581 111.886897 0.37504 110.386738-42.754546 216.523024-120.137774 295.281399-75.883069 78.008295-180.019142 122.012974-288.780708 122.012974H339.393597V995.133455c0 26.627831-18.001914 36.628895-40.129267 22.37738L101.243273 887.12197c-22.127353-14.626555-21.877326-38.004041 0.500054-52.00553l197.145963-124.263214c22.37738-14.126502 40.754334-3.875412 40.754334 22.877433v83.50888h430.170742c175.393651-0.125013 317.783792-145.01542 317.783792-323.534403 0-30.628257-4.250452-60.381421-12.12629-88.759438-2.875306-13.751462 0.500053-28.002978 9.250984-38.879135 8.750931-10.876157 22.00234-17.376848 36.003829-17.501861 20.50218 0 38.504094 13.501436 44.379719 33.128523v0.250027z m0 0" />
  </svg>
);

const SingleSvg = () => (
  <svg viewBox="0 0 1024 1024" version="1.1" width="1em" height="1em">
    <path d="M99.743114 674.724385c-24.627619 6.625705-50.005317-7.875837-56.881049-32.503457-10.126077-36.378868-15.251622-74.00787-15.001595-111.886897v-0.500053c-0.37504-110.386738 42.754546-216.398011 120.137775-295.031373C223.756301 156.79431 327.892374 112.664618 436.653939 112.539604h431.545889v-83.633893c0-26.752845 18.001914-36.753908 40.004254-22.252366L1106.475165 136.917197c22.127353 14.501542 21.877326 37.879028-0.500053 52.00553l-197.145964 124.263213c-22.37738 14.251515-40.62932 3.875412-40.62932-22.877432V206.799628H438.029086c-175.393651 0.250027-317.533765 145.01542-317.533765 323.534403 0 30.75327 4.250452 60.506434 12.001276 88.759438 5.375572 24.127566-8.750931 48.255131-32.378443 55.380889l-0.37504 0.250027z m1065.238273-292.781133c9.87605 36.503882 14.876582 74.132883 14.876581 111.886897 0.37504 110.386738-42.754546 216.523024-120.137774 295.281399-75.883069 78.008295-180.019142 122.012974-288.780708 122.012974H339.393597V995.133455c0 26.627831-18.001914 36.628895-40.129267 22.37738L101.243273 887.12197c-22.127353-14.626555-21.877326-38.004041 0.500054-52.00553l197.145963-124.263214c22.37738-14.126502 40.754334-3.875412 40.754334 22.877433v83.50888h430.170742c175.393651-0.125013 317.783792-145.01542 317.783792-323.534403 0-30.628257-4.250452-60.381421-12.12629-88.759438-2.875306-13.751462 0.500053-28.002978 9.250984-38.879135 8.750931-10.876157 22.00234-17.376848 36.003829-17.501861 20.50218 0 38.504094 13.501436 44.379719 33.128523v0.250027z m0 0" />
    <path d="M634.549983 362.566191v306.907635c0 11.75125-8.875944 20.627193-20.12714 20.627194-11.251196 0-20.12714-9.375997-20.127141-20.627194V395.94474L532.914175 429.823343c-9.87605 5.875625-22.127353 3.000319-27.502924-6.875731-5.375572-9.375997-1.50016-22.127353 7.875837-27.502925l90.384611-50.630384c3.375359-2.000213 6.875731-3.000319 10.751144-3.000319 11.75125 0.125013 20.12714 9.50101 20.12714 20.752207z" />
  </svg>
);

const ModeSvg = {
  random: RandomSvg,
  cycle: CycleSvg,
  single: SingleSvg,
};

export interface SongDetail {
  currentTime: number;
  entireTime: number;
}

interface MiniPlayerProps {
  music: Datum;
  songDetail: SongDetail;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ music, songDetail }) => {
  const { paused, currentSong, pre, next, play, pause, mode, changeMode } = useMusicPlayer();

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
                <Icon component={ModeSvg[mode]} onClick={changeMode} />
              </Col>
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
