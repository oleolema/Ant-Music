import { useRef } from 'react';

export default () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  return { audioRef };
};
