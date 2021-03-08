import { useState } from 'react';

export default () => {
  const [slideAfterValue, setSlideAfterValue] = useState(0);
  return { slideAfterValue, setSlideAfterValue };
};
