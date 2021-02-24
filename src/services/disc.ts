import { http } from '@/utils/request';
import { DiscData } from '@/services/API';

export interface RankingData {
  code: number;
  list: MusicTopList[];
  artistToplist: ArtistToplist;
}

export interface ArtistToplist {
  coverUrl: string;
  name: string;
  upateFrequency: string;
  position: number;
  updateFrequency: string;
}

export interface MusicTopList {
  subscribers: any[];
  subscribed: null;
  creator: null;
  artists: null;
  tracks: null;
  updateFrequency: string;
  backgroundCoverId: number;
  backgroundCoverUrl: null;
  titleImage: number;
  titleImageUrl: null;
  englishTitle: null;
  opRecommend: boolean;
  recommendInfo: null;
  adType: number;
  trackNumberUpdateTime: number;
  subscribedCount: number;
  cloudTrackCount: number;
  userId: number;
  createTime: number;
  highQuality: boolean;
  updateTime: number;
  coverImgId: number;
  newImported: boolean;
  anonimous: boolean;
  trackCount: number;
  coverImgUrl: string;
  specialType: number;
  totalDuration: number;
  commentThreadId: string;
  trackUpdateTime: number;
  privacy: number;
  playCount: number;
  description: null | string;
  ordered: boolean;
  tags: string[];
  status: number;
  name: string;
  id: number;
  coverImgId_str: string;
  ToplistType?: string;
}

export interface ArtistTopData {
  list: ArtistTopList;
  code: number;
}

export interface ArtistTopList {
  artists: Artist[];
  updateTime: number;
  type: number;
}

export interface Artist {
  name: string;
  id: number;
  picId: number;
  img1v1Id: number;
  briefDesc: string;
  picUrl: string;
  img1v1Url: string;
  albumSize: number;
  alias: string[];
  trans: Trans;
  musicSize: number;
  topicPerson: number;
  lastRank?: number;
  score: number;
  picId_str?: string;
  img1v1Id_str?: string;
  transNames?: Trans[];
}

export enum Trans {
  Empty = '',
  EricChou = 'Eric Chou',
  Kun = 'KUN',
}

// 歌单详情
export const playlistDetail = (id: number): Promise<DiscData> =>
  http.post('/api/netease/playlist/detail', { params: { id } });

// 排行榜
export const toplist = (): Promise<RankingData> => http.post('/api/netease/toplist');

// 歌手排行榜
export const toplistArtist = (): Promise<ArtistTopData> => http.post('/api/netease/toplist/artist');
