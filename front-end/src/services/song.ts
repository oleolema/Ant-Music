import { http } from '@/utils/request';
import { Song, SongData, SongDetailData } from '@/services/API';
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

export interface ArtistData {
  songs: Song[];
  more: boolean;
  total: number;
  code: number;
}

export enum Eq {
  Pop = 'pop',
}

export interface H {
  br: number;
  fid: number;
  size: number;
  vd: number;
}

export interface SearchData {
  result: SearchResult;
}
export interface SearchResult {
  songs: Song[];
  songCount: number;
}

export interface SearchSuggestData {
  result: SearchSuggestResult;
}

export interface SearchSuggestResult {
  albums: AlbumSuggest[];
  artists: ArtistSuggest[];
  songs: SongSuggest[];
  playlists: PlaylistSuggest[];
  order: string[];
}

export interface AlbumSuggest {
  id: number;
  name: string;
  artist: ArtistSuggest;
  publishTime: number;
  size: number;
  copyrightId: number;
  status: number;
  picId: number | number;
  mark: number;
}

export interface ArtistSuggest {
  id: number;
  name: string;
  picUrl: null | string;
  alias: any[];
  albumSize: number;
  picId: number;
  img1v1Url: string;
  img1v1: number;
  trans: null;
  accountId?: number;
}

export interface PlaylistSuggest {
  id: number;
  name: string;
  coverImgUrl: string;
  creator: null;
  subscribed: boolean;
  trackCount: number;
  userId: number;
  playCount: number;
  bookCount: number;
  specialType: number;
  officialTags: null;
  description: string;
  highQuality: boolean;
}

export interface SongSuggest {
  id: number;
  name: string;
  artists: ArtistSuggest[];
  album: AlbumSuggest;
  duration: number;
  copyrightId: number;
  status: number;
  alias: any[];
  rtype: number;
  ftype: number;
  mvid: number;
  fee: number;
  rUrl: null;
  mark: number;
}
// 歌单详情 (分段请求)
export const songDetail = (ids: number[]): Promise<{ data: SongDetailData }> =>
  Promise.all(
    split(ids, 400)
      .map((it) => () =>
        http.get('api/netease/song/detail', {
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

export const songUrl = (ids: number[]): Promise<{ data: SongData }> =>
  http.get('/api/netease/song/url', { params: { id: ids.join(',') } });

export const lyric = (id: number): Promise<LyricData> =>
  http.get('/api/netease/lyric', { params: { id } });

export const artistSongs = (id: number): Promise<ArtistData> =>
  http.get('/api/netease/artist/songs', { params: { id } });

// type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export const cloudSearch = (keywords: string, type: number = 1): Promise<SearchData> =>
  http.get('/api/netease/cloudsearch', { params: { keywords: keywords.trim(), type } });

export const searchSuggest = (keywords: string): Promise<SearchSuggestData | null> => {
  if (!keywords) {
    return Promise.resolve(null);
  }
  return http.get('/api/netease/search/suggest', { params: { keywords: keywords.trim() } });
};
