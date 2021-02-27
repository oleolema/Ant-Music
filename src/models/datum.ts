import { useEffect, useState } from 'react';
import { Datum } from '@/services/API';
import { useModel } from '@@/plugin-model/useModel';

export default () => {
  const [datum, setDatum] = useState<Datum>();
  const { miniVisible, setMiniVisible } = useModel('miniMusic');
  useEffect(() => {
    datum && !miniVisible && setMiniVisible(true);
  }, [datum]);
  return { datum, setDatum };
};
