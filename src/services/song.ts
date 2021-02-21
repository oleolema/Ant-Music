import { http } from '@/utils/request';
import { DiscData } from '@/services/API';

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
  play: () => void;
  seek: (n: number) => void;
  stop: () => void;
  togglePlay: () => void;
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

// 歌单详情
export const songDetail = (ids: number[]): Promise<DiscData> =>
  http.get('api/netease/song/detail', { params: { ids: ids.join(',') } });

export const songUrl = (ids: number[]): Promise<DiscData> =>
  http.get('api/netease/song/url', { params: { id: ids.join(',') } });

export const lyric = (id: number): Promise<LyricData> =>
  http.get('api/netease/lyric', { params: { id } });
