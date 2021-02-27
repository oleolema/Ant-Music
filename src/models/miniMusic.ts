import { useState } from 'react';
import { useSize } from 'ahooks';

export default () => {
  const [miniVisible, setMiniVisible] = useState(false);
  const size = useSize(document.body);

  return {
    miniVisible,
    setMiniVisible,
    // 内容高度
    contentHeight: (size.height || innerHeight) - (miniVisible ? 78 : 0) - 48,
  };
};
