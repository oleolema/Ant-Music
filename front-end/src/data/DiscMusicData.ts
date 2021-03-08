export interface DiscMusicData {
  code: number;
  relatedVideos: null;
  playlist: Playlist;
  urls: null;
  privileges: Privilege[];
}

export interface Playlist {
  subscribers: Creator[];
  subscribed: boolean;
  creator: Creator;
  tracks: Track[];
  videoIds: null;
  videos: null;
  trackIds: TrackID[];
  updateFrequency: null;
  backgroundCoverId: number;
  backgroundCoverUrl: null;
  titleImage: number;
  titleImageUrl: null;
  englishTitle: null;
  opRecommend: boolean;
  trackNumberUpdateTime: number;
  adType: number;
  subscribedCount: number;
  cloudTrackCount: number;
  userId: number;
  createTime: number;
  highQuality: boolean;
  updateTime: number;
  coverImgId: number;
  newImported: boolean;
  specialType: number;
  coverImgUrl: string;
  trackCount: number;
  commentThreadId: string;
  privacy: number;
  trackUpdateTime: number;
  playCount: number;
  ordered: boolean;
  tags: string[];
  description: string;
  status: number;
  name: string;
  id: number;
  shareCount: number;
  coverImgId_str: string;
  commentCount: number;
}

export interface Creator {
  defaultAvatar: boolean;
  province: number;
  authStatus: number;
  followed: boolean;
  avatarUrl: string;
  accountStatus: number;
  gender: number;
  city: number;
  birthday: number;
  userId: number;
  userType: number;
  nickname: string;
  signature: string;
  description: string;
  detailDescription: string;
  avatarImgId: number;
  backgroundImgId: number;
  backgroundUrl: string;
  authority: number;
  mutual: boolean;
  expertTags: null;
  experts: null;
  djStatus: number;
  vipType: number;
  remarkName: null;
  avatarImgIdStr: string;
  backgroundImgIdStr: string;
  avatarImgId_str: string;
}

export interface TrackID {
  id: number;
  v: number;
  at: number;
  alg: null;
}

export interface Track {
  name: string;
  id: number;
  pst: number;
  t: number;
  ar: Ar[];
  alia: string[];
  pop: number;
  st: number;
  rt: string;
  fee: number;
  v: number;
  crbt: null;
  cf: string;
  al: Al;
  dt: number;
  h: H;
  m: H;
  l: H;
  a: null;
  cd: string;
  no: number;
  rtUrl: null;
  ftype: number;
  rtUrls: any[];
  djId: number;
  copyright: number;
  s_id: number;
  mark: number;
  originCoverType: number;
  noCopyrightRcmd: null;
  rtype: number;
  rurl: null;
  mst: number;
  cp: number;
  mv: number;
  publishTime: number;
}

export interface Al {
  id: number;
  name: string;
  picUrl: string;
  tns: any[];
  pic_str: string;
  pic: number;
}

export interface Ar {
  id: number;
  name: string;
  tns: any[];
  alias: any[];
}

export interface H {
  br: number;
  fid: number;
  size: number;
  vd: number;
}

export interface Privilege {
  id: number;
  fee: number;
  payed: number;
  st: number;
  pl: number;
  dl: number;
  sp: number;
  cp: number;
  subp: number;
  cs: boolean;
  maxbr: number;
  fl: number;
  toast: boolean;
  flag: number;
  preSell: boolean;
  playMaxbr: number;
  downloadMaxbr: number;
  chargeInfoList: ChargeInfoList[];
}

export interface ChargeInfoList {
  rate: number;
  chargeUrl: null;
  chargeMessage: null;
  chargeType: number;
}
