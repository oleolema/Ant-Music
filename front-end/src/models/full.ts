import { useCallback, useState } from 'react';
// @ts-ignore
import Lyric from 'lyric-parser';

export default () => {
  const [isFull, setFull] = useState(false);

  // 隐藏滚动条
  setTimeout(() => {
    const scrollY = document.querySelector(`#baseLayout`)
      ?.lastElementChild as HTMLDivElement | null;
    if (scrollY) {
      if (isFull) {
        scrollY.style.zIndex = '-100';
      } else {
        scrollY.style.zIndex = '0';
      }
    }
  });

  return {
    isFull,
    setFull,
    taggerFull: useCallback(() => setFull((it) => !it), []),
  };
};
