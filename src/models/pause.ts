import { useState } from 'react';

export default () => {
  const [paused, setPaused] = useState(false);
  return { paused, setPaused };
};
