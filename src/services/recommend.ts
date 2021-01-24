import {http} from "@/utils/request";
import {DiscData} from "@/services/API";
// 推荐歌单
export const personalized = (): Promise<DiscData> => http.get(`/api/netease/personalized`);
// 轮播图
export const banner = () => http.get(`/api/netease/banner`);
