import { useState } from 'react';
import { LyricObj } from '@/services/song';
// @ts-ignore
import Lyric from 'lyric-parser';

export default () => {
  const [lyricObj, setLyricObj] = useState<LyricObj | null>(null);
  const [handler, setHandler] = useState<((p: { lineNum: number; txt: string }) => void) | null>(
    null,
  );

  console.info('lyric 0', handler);
  console.info('lyric 1', lyricObj);

  return {
    lyricObj,
    setLyricObj,
    setHandler,
    handler,
    setLyric: (lyric: string) => {
      lyricObj?.stop();
      setLyricObj(new Lyric(lyric, handler));
    },
  };
};
