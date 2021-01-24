import {http} from "@/utils/request";
import {DiscData} from "@/services/API";
// 歌单详情
export const songDetail = (ids: number[]): Promise<DiscData> => http.get("api/netease/song/detail", {params: {ids: ids.join(',')}});

export const songUrl = (ids: number[]): Promise<DiscData> => http.get("api/netease/song/url", {params: {id: ids.join(',')}});


