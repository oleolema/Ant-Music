import { useEffect, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';

export default () => {
  const { audioRef } = useModel('musicPlayer');
  const {} = useModel('music');
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current!.onpause = () => setPaused(true);
    audioRef.current!.onplay = () => setPaused(false);
  }, [audioRef]);

  return { paused };
};
