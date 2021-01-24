import {http} from "@/utils/request";
import {DiscData} from "@/services/API";
// 歌单详情
export const playlistDetail = (id: number): Promise<DiscData> => http.get("/api/netease/playlist/detail", {params: {id}});