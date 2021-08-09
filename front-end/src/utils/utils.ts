/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import {Song} from '@/services/API';
import {message} from 'antd';
import {songUrl} from '@/services/song';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const {NODE_ENV} = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export function split(a: any[], k: number) {
  const len = ~~(a.length / k);
  return [...new Array(len)]
    .map((_, i) => [i * k, (i + 1) * k])
    .concat([[len * k, len * k + (a.length % k)]]);
}

export function download(url: string, filename: string, ended?: () => void) {
  function downloadFile(content: any, filename: string) {
    const a = document.createElement('a');
    const blob = new Blob([content]);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function ajax(url: string, callback: (xhr: XMLHttpRequest) => void, options: any) {
    window.URL = window.URL || window.webkitURL;
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    if (options.responseType) {
      xhr.responseType = options.responseType;
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr);
      }
    };
    xhr.send();
  }

  ajax(
    url,
    function (xhr) {
      downloadFile(xhr.response, filename);
      ended && ended();
    },
    {
      responseType: 'blob',
    },
  );
}

export const downloadSong = (song: Song) => {
  const close = message.loading('下载中...', 9999);
  songUrl([song.id]).then((res) => {
    console.info(res);
    const url = res?.data?.data[0]?.url;
    if (!url) {
      message.error('歌曲下载失败');
      return;
    }
    download(url, `${song.name} - ${song.ar.map((it) => it.name).join(' / ')}.mp3`, close);
  });
};

export function scrollOptions(element: HTMLDivElement) {
  var keys = {37: 1, 38: 1, 39: 1, 40: 1};

  function preventDefault(e: Event) {
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
  }

  // @ts-ignore
  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  let oldonwheel: any, oldontouchmove: any, oldonkeydown: any;
  let isDisabled: boolean;

  function disableScroll() {
    if (element.addEventListener)
      // older FF
      element.addEventListener('DOMMouseScroll', preventDefault, false);
    oldonwheel = element.onwheel;
    element.onwheel = preventDefault; // modern standard
    oldontouchmove = element.ontouchmove;
    element.ontouchmove = preventDefault; // mobile
    oldonkeydown = document.onkeydown;
    document.onkeydown = preventDefaultForScrollKeys;
    isDisabled = true;
  }

  function enableScroll() {
    if (!isDisabled) return;
    if (element.removeEventListener)
      element.removeEventListener('DOMMouseScroll', preventDefault, false);
    element.onwheel = oldonwheel; // modern standard
    element.ontouchmove = oldontouchmove; // mobile
    document.onkeydown = oldonkeydown;
    isDisabled = false;
  }

  return {
    disableScroll,
    enableScroll,
  };
}

export function isDev() {
  return location.port === '8000' || location.port === '8001' || location.port === '8002'
}
