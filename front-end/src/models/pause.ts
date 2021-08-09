import { useState } from 'react';

export default () => {
  const [paused, setPaused] = useState(true);
  return { paused, setPaused };
};
