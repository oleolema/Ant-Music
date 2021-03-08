declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface LoginStateType {
    status?: 'ok' | 'error';
    type?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }
}

export interface DiscData {
  id: number;
  type: number;
  name: string;
  copywriter: string;
  picUrl: string;
  canDislike: boolean;
  trackNumberUpdateTime: number;
  playCount: number;
  trackCount: number;
  highQuality: boolean;
  alg: string;
}


export interface SongDetailData {
  songs:      Song[];
  privileges: Privilege[];
  code:       number;
}

export interface Privilege {
  id:                 number;
  fee:                number;
  payed:              number;
  st:                 number;
  pl:                 number;
  dl:                 number;
  sp:                 number;
  cp:                 number;
  subp:               number;
  cs:                 boolean;
  maxbr:              number;
  fl:                 number;
  toast:              boolean;
  flag:               number;
  preSell:            boolean;
  playMaxbr:          number;
  downloadMaxbr:      number;
  freeTrialPrivilege: FreeTrialPrivilege;
  chargeInfoList:     ChargeInfoList[];
}

export interface ChargeInfoList {
  rate:          number;
  chargeUrl:     null;
  chargeMessage: null;
  chargeType:    number;
}

export interface FreeTrialPrivilege {
  resConsumable:  boolean;
  userConsumable: boolean;
}

export interface Song {
  name:            string;
  id:              number;
  pst:             number;
  t:               number;
  ar:              Ar[];
  alia:            string[];
  pop:             number;
  st:              number;
  rt:              null | string;
  fee:             number;
  v:               number;
  crbt:            null | string;
  cf:              string;
  al:              Al;
  dt:              number;
  h:               L | null;
  m:               L | null;
  l:               L;
  a:               null;
  cd:              string;
  no:              number;
  rtUrl:           null;
  ftype:           number;
  rtUrls:          any[];
  djId:            number;
  copyright:       number;
  s_id:            number;
  mark:            number;
  originCoverType: number;
  single:          number;
  noCopyrightRcmd: null;
  mv:              number;
  mst:             number;
  cp:              number;
  rtype:           number;
  rurl:            null;
  publishTime:     number;
  tns?:            string[];
}

export interface Al {
  id:       number;
  name:     string;
  picUrl:   string;
  tns:      any[];
  pic_str?: string;
  pic:      number;
}

export interface Ar {
  id:    number;
  name:  string;
  tns:   any[];
  alias: any[];
}

export interface L {
  br:   number;
  fid:  number;
  size: number;
  vd:   number;
}


export interface SongData {
  data: Datum[];
  code: number;
}

export interface Datum {
  id:                 number;
  url:                string;
  br:                 number;
  size:               number;
  md5:                string;
  code:               number;
  expi:               number;
  type:               string;
  gain:               number;
  fee:                number;
  uf:                 null;
  payed:              number;
  flag:               number;
  canExtend:          boolean;
  freeTrialInfo:      null;
  level:              string;
  encodeType:         string;
  freeTrialPrivilege: FreeTrialPrivilege;
  urlSource:          number;
}

export interface FreeTrialPrivilege {
  resConsumable:  boolean;
  userConsumable: boolean;
}
