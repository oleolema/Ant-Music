import React, { useEffect } from 'react';
import useMusicPlayer from '@/hooks/useMusicPlayer';
import { useModel } from '@@/plugin-model/useModel';
import { useSelector } from '@@/plugin-dva/exports';
import { ConnectState } from '@/models/connect';
import { MusicModelState } from '@/models/musicModel';
import { ShareConstant, WebSocketResult } from '@/services/share';
import { message } from 'antd';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const { slideAfterValue } = useModel('slideAfterChange');
  const { setSelfInfo, setSharerList } = useModel('share');
  const { lyricObj } = useModel('lyricObj');
  const {
    isAdmin,
    adminSendMsg,
    selfName,
    setSelfName,
    sendMsg,
    webSocketIns,
    latestMessage,
    readyState,
  } = useModel('shareWebsocket');
  const { currentSong } = useSelector<ConnectState, MusicModelState>((state) => state.musicPlayer);

  const { insertSong } = useMusicPlayer();

  console.info(latestMessage);

  // 收到消息时触发
  useEffect(() => {
    if (!latestMessage?.data || !audioRef.current) {
      return;
    }
    const webSocketResult = WebSocketResult.fromJson<any>(latestMessage.data);
    console.info(webSocketResult);
    if (webSocketResult.code !== 200) {
      switch (webSocketResult.code) {
        case WebSocketResult.SUCCESS_MESSAGE_CODE:
          message.success(webSocketResult.message);
          return;
        case WebSocketResult.WARN_CODE:
          message.warn(webSocketResult.message);
          return;
        case WebSocketResult.ERROR_CODE:
          message.error(webSocketResult.message);
          return;
        default:
          throw `不支持的code: ${webSocketResult.code}`;
      }
    }
    switch (webSocketResult.type) {
      case ShareConstant.SELF_INFO:
        setSelfInfo(webSocketResult.data);
        setSelfName(webSocketResult.data?.name);
        return;
      case ShareConstant.SHARER_LIST:
        setSharerList(webSocketResult.data);
        return;
      case ShareConstant.OPTIONS:
        return;
      case ShareConstant.PUSH_MUSIC:
        adminSendMsg({ type: ShareConstant.PULL_SONG, data: currentSong });
        sendCurrentTimeAndPause();
        return;
      case ShareConstant.PULL_SONG:
        if (isAdmin) {
          return;
        }
        insertSong(webSocketResult.data);
        return;
      case ShareConstant.PULL_CURRENT_TIME_AND_PAUSED:
        console.info(isAdmin, webSocketResult.data);
        setCurrentTimeAndPause(webSocketResult);
        return;
      case ShareConstant.PULL_CURRENT_TIME_SYNC:
        setCurrentTimeAndPause(webSocketResult, 0.1);
        return;
      default:
        throw '未匹配到任何操作类型';
    }
  }, [latestMessage]);

  useEffect(() => {
    const closeHandler = (e: CloseEvent) => {
      console.info(e);
      setSelfInfo(null);
      setSharerList([]);
      message.warn('断开连接');
    };
    if (webSocketIns) {
      webSocketIns.addEventListener('close', closeHandler);
    }
    return () => {
      if (webSocketIns) {
        webSocketIns.removeEventListener('close', closeHandler);
      }
    };
  }, [webSocketIns]);

  useEffect(() => {
    adminSendMsg({ type: ShareConstant.PULL_SONG, data: currentSong });
    adminSendMsg({
      type: ShareConstant.PULL_CURRENT_TIME_AND_PAUSED,
      data: { currentTime: 0, paused: false },
    });
    const timer = setTimeout(sendCurrentTimeAndPause, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentSong?.id]);

  /**
   * 同步器
   */
  useEffect(() => {
    if (readyState !== 1) {
      return;
    }
    const timer = setInterval(() => {
      adminSendMsg({
        type: ShareConstant.PULL_CURRENT_TIME_SYNC,
        data: { currentTime: audioRef.current?.currentTime, paused: audioRef.current?.paused },
      });
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, [readyState]);

  useEffect(() => {
    sendMsg({ type: ShareConstant.CHANGE_NAME, data: selfName });
  }, [selfName]);

  useEffect(() => {
    sendCurrentTimeAndPause();
  }, [slideAfterValue]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    console.info('bbb');
    const onPauseOrPlay = () => {
      console.info('aaa');
      adminSendMsg({
        type: ShareConstant.PULL_CURRENT_TIME_AND_PAUSED,
        data: { currentTime: audioRef.current?.currentTime, paused: audioRef.current?.paused },
      });
    };
    audioRef.current.addEventListener('pause', onPauseOrPlay);
    audioRef.current.addEventListener('play', onPauseOrPlay);
    return () => {
      audioRef.current.removeEventListener('pause', onPauseOrPlay);
      audioRef.current.removeEventListener('play', onPauseOrPlay);
    };
  });

  function sendCurrentTimeAndPause() {
    adminSendMsg({
      type: ShareConstant.PULL_CURRENT_TIME_AND_PAUSED,
      data: { currentTime: audioRef.current?.currentTime, paused: audioRef.current?.paused },
    });
  }

  /**
   *
   * @param webSocketResult
   * @param minTime
   */
  function setCurrentTimeAndPause(
    webSocketResult: WebSocketResult<{ currentTime: number; paused: boolean }>,
    minTime: number = 0,
  ) {
    if (isAdmin) {
      return;
    }
    setTimeout(() => {
      if (!audioRef.current) {
        return;
      }
      webSocketResult.data.paused ? audioRef.current.pause() : audioRef.current.play();
      const delay = (new Date().getTime() - webSocketResult.sendTime) / 1000;
      const time = webSocketResult.data.currentTime + delay;
      console.info(Math.abs(audioRef.current.currentTime - time), minTime);
      if (Math.abs(audioRef.current.currentTime - time) <= minTime) {
        return;
      }
      audioRef.current.currentTime = time;
      lyricObj?.seek(time * 1000);
    }, 50);
  }

  return <></>;
};
