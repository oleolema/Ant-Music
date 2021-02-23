import { http } from '@/utils/request';
import { DiscData, SongDetailData } from '@/services/API';
import { split } from '@/utils/utils';

export interface LyricData {
  status: number;
  data: LyricDataData;
}

export interface LyricDataData {
  sgc: boolean;
  sfy: boolean;
  qfy: boolean;
  lyricUser: LyricUser;
  lrc: Klyric;
  klyric: Klyric;
  tlyric: Klyric;
  code: number;
}

export interface Klyric {
  version: number;
  lyric: string;
}

export interface LyricUser {
  id: number;
  status: number;
  demand: number;
  userid: number;
  nickname: string;
  uptime: number;
}

export interface LyricObj {
  lrc: string;
  tags: Tags;
  lines: Line[];
  state: number;
  curLine: number;
  curNum: number;
  startStamp: number;
  timer: number;
  pauseStamp: number;
  play: () => void;
  seek: (n: number) => void;
  stop: () => void;
  togglePlay: () => void;
  handler: (p: { lineNum: number; txt: string }) => void;
}

export interface Line {
  time: number;
  txt: string;
}

export interface Tags {
  title: string;
  artist: string;
  album: string;
  offset: string;
  by: string;
}

// 歌单详情 (分段请求)
export const songDetail = (ids: number[]): Promise<{ data: SongDetailData }> =>
  Promise.all(
    split(ids, 400)
      .map((it) => () =>
        http.post('api/netease/song/detail', {
          params: { ids: ids.slice(it[0], it[1]).join(',') },
        }) as Promise<{ data: SongDetailData }>,
      )
      .map((it) => it()),
  ).then((a) => {
    const r = a.reduce((previousValue, currentValue) => {
      previousValue.data.songs = [...previousValue.data.songs, ...currentValue.data.songs];
      previousValue.data.privileges = [
        ...previousValue.data.privileges,
        ...currentValue.data.privileges,
      ];
      return previousValue;
    });
    return r;
  });

export const songUrl = (ids: number[]): Promise<DiscData> =>
  http.post('api/netease/song/url', { params: { id: ids.join(',') } });

export const lyric = (id: number): Promise<LyricData> =>
  http.post('api/netease/lyric', { params: { id } });
