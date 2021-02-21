import { useState } from 'react';

export default () => {
  const [miniVisible, setMiniVisible] = useState(false);
  return { miniVisible, setMiniVisible };
};
