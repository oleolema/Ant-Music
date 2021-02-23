import { useState } from 'react';

export default () => {
  const [currentSecond, setCurrentSecond] = useState<number>(0);
  return { currentSecond, setCurrentSecond };
};
