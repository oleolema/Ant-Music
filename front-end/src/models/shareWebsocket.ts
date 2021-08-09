import {useLocalStorageState, useWebSocket} from 'ahooks';
import {useState} from 'react';
import {message} from 'antd';
import {CreateShareTypeEnum, WebSocketResult} from '@/services/share';
import {isDev} from "@/utils/utils";

const SHARE_WEBSOCKET_JOIN_URL = 'SHARE_WEBSOCKET_JOIN_URL';
const SHARE_WEBSOCKET_SELF_NAME = 'SHARE_WEBSOCKET_SELF_NAME';
const SHARE_WEBSOCKET_ADMIN_ID = 'SHARE_WEBSOCKET_ADMIN_ID';
const SERVER_PORT = isDev() ? "8080" : location.port;
console.info('port', SERVER_PORT);
export default () => {
  const [socketUrl, setSocketUrl] = useState<string>('');
  const [joinUrl, setJoinUrl] = useLocalStorageState<string | null>(SHARE_WEBSOCKET_JOIN_URL, null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selfName, setSelfName] = useLocalStorageState<string | null>(
    SHARE_WEBSOCKET_SELF_NAME,
    null,
  );
  const [adminId, setAdminId] = useLocalStorageState<string | null>(SHARE_WEBSOCKET_ADMIN_ID, null);
  const {
    readyState,
    sendMessage,
    latestMessage,
    disconnect,
    connect,
    webSocketIns,
  } = useWebSocket(socketUrl, {
    manual: true,
    reconnectLimit: 0,
    reconnectInterval: Number.MAX_SAFE_INTEGER,
  });

  /**
   * only admin can send message
   * @param type
   * @param data
   * @param clientId
   */
  function adminSendMsg({
                          type,
                          data,
                          clientId = '',
                        }: {
    type: string;
    data: any;
    clientId?: string;
  }) {
    // 不是房主, 或者未连接
    if (!isAdmin || readyState !== 1) {
      return;
    }

    sendMsg({type, data, clientId});
  }

  /**
   * client send msg
   * @param type
   * @param data
   * @param clientId null: 全部发送 成员包括房主;  "": 只发送给成员;  "123123": 只发送给指定
   */
  const sendMsg = ({
                     type,
                     data,
                     clientId = '',
                   }: {
    type: string;
    data?: any;
    clientId?: string;
  }) => {
    // 未连接
    if (readyState !== 1) {
      return;
    }
    sendMessage &&
    sendMessage(JSON.stringify(WebSocketResult.success(type, data || '').setClientId(clientId)));
  };

  console.info(isAdmin);

  return {
    connected: readyState === 1,
    readyState,
    sendMessage,
    latestMessage,
    disconnect,
    connect: (type: CreateShareTypeEnum) => {
      try {
        console.info(joinUrl);
        let sUrl = null;
        let sUrlObj = null;
        if (type === CreateShareTypeEnum.JOIN) {
          const url = new URL(joinUrl || '');
          if (url.searchParams.get('type') !== 'join' || !url.searchParams.get('adminId')) {
            throw 'join params error';
          }
          sUrl = `ws://${location.host.split(':')[0]}:${SERVER_PORT}/websocket/share${url.search}`;
          setIsAdmin(false);
          sUrlObj = new URL(sUrl);
        } else if (type === CreateShareTypeEnum.CREATE) {
          sUrl = `ws://${location.host.split(':')[0]}:${SERVER_PORT}/websocket/share?type=create`;
          setIsAdmin(true);
          sUrlObj = new URL(sUrl);
          adminId && sUrlObj.searchParams.append('id', encodeURI(adminId));
        } else {
          throw `未知类型: ${type}`;
        }
        selfName && sUrlObj.searchParams.append('name', encodeURI(selfName));
        setSocketUrl(sUrlObj.href);
        setTimeout(() => {
          connect && connect();
        }, 100);
      } catch (e) {
        console.error(e);
        message.error('不是有效链接');
      }
    },
    webSocketIns,
    setSocketUrl,
    socketUrl,
    isAdmin,
    setIsAdmin,
    selfName,
    setSelfName,
    joinUrl,
    setJoinUrl,
    adminId,
    setAdminId,
    adminSendMsg,
    sendMsg,
  };
};
