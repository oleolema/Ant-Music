import { useState } from 'react';
import { CreateShare, CreateShareTypeEnum } from '@/services/share';

export default () => {
  const [musicState, setMusicState] = useState(null);
  const [selfInfo, setSelfInfo] = useState<CreateShare | null>(null);
  const [sharerList, setSharerList] = useState<CreateShare[]>([]);
  const [shareType, setShareType] = useState<CreateShareTypeEnum>(CreateShareTypeEnum.CREATE);

  return {
    musicState,
    setMusicState,
    selfInfo,
    setSelfInfo,
    sharerList,
    setSharerList,
    shareType,
    setShareType,
  };
};
