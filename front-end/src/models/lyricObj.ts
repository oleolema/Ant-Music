import { useRef, useState } from 'react';
import { LyricObj } from '@/services/song';
// @ts-ignore
import Lyric from 'lyric-parser';

export default () => {
  const [lyricObj, setLyricObj] = useState<LyricObj | null>(null);
  const [noLyric, setNoLyric] = useState(false);
  const [hasTLyric, setHasTLyric] = useState(false);
  const paused = useRef(true);

  const lyricPlay = () => {
    paused.current && lyricObj?.togglePlay();
    paused.current = false;
  };
  const lyricPause = () => {
    !paused.current && lyricObj?.togglePlay();
    paused.current = true;
  };
  const lyricStop = () => {
    lyricObj?.stop();
    paused.current = true;
  };

  return {
    lyricPlay,
    lyricPause,
    lyricStop,
    lyricObj,
    noLyric,
    hasTLyric,
    setLyric: (lyric: string, tLyric?: string) => {
      lyricStop();
      if (!lyric) {
        setNoLyric(true);
        return;
      }
      const lo = new Lyric(lyric);
      if (tLyric) {
        const to = new Lyric(tLyric);
        for (let i = 0, j = 0; i < lo.lines.length; i++) {
          let l = lo.lines[i];
          let t = to.lines[j];
          if (l?.time === t?.time) {
            l.txt = `${l.txt}<br>${t.txt}`;
            j++;
          }
        }
      }
      setNoLyric(false);
      setHasTLyric(Boolean(tLyric));
      setLyricObj(lo);
    },
  };
};
