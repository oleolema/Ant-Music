import { useState } from 'react';

export default () => {
  const [volume, setVolume] = useState(0.6);

  return { volume, setVolume };
};
