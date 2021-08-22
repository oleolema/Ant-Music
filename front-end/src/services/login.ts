import {http} from "@/utils/request";
import {DiscData} from "@/services/API";
// 邮箱登录
export const loginByEmail = (email: string, password: string): Promise<DiscData> => http.post(`/api/netease/login`, {
  requestType: 'form',
  params: {email, password}
});
// 手机登录
export const loginByPhone = (phone: string, password: string): Promise<DiscData> => http.post(`/api/netease/login/cellphone`, {
  requestType: 'form',
  params: {phone, password}
});
// 验证码登录
export const loginByPhoneCode = (phone: string): Promise<DiscData> => http.post(`/api/netease/captcha/sent`, {
  requestType: 'form',
  params: {phone}
});
// 校验验证码
export const verifyPhoneCode = (phone: string, captcha: string): Promise<DiscData> => http.post(`/api/netease/captcha/verify`, {
  requestType: 'form',
  params: {phone, captcha}
});
// 退出登录
export const logout = (): Promise<DiscData> => http.post(`/api/netease/logout`);
// 登录状态
export const loginStatus = (): Promise<DiscData> => http.post(`/api/netease/login/status`);
// 用户信息
export const userDetail = (): Promise<DiscData> => http.post(`/api/netease/user/detail`);
