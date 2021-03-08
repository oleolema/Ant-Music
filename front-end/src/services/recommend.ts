import { http } from '@/utils/request';
import { DiscData } from '@/services/API';

export interface BannerData {
  banners: Banner[];
  code: number;
}

export interface Banner {
  imageUrl: string;
  targetId: number;
  adid: null;
  targetType: number;
  titleColor: TitleColor;
  typeTitle: string;
  url: null | string;
  exclusive: boolean;
  monitorImpress: null;
  monitorClick: null;
  monitorType: null;
  monitorImpressList: null;
  monitorClickList: null;
  monitorBlackList: null;
  extMonitor: null;
  extMonitorInfo: null;
  adSource: null;
  adLocation: null;
  adDispatchJson: null;
  encodeId: string;
  program: null;
  event: null;
  video: null;
  song: null;
  scm: string;
}

export enum TitleColor {
  Blue = 'blue',
  Red = 'red',
}

// 推荐歌单
export const personalized = (): Promise<DiscData> => http.get(`/api/netease/personalized`);
// 轮播图
export const banner = () => http.get(`/api/netease/banner`);
