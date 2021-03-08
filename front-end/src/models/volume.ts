import { useState } from 'react';
import store2 from 'store2';

const store = store2.namespace('volume');

export default () => {
  const [volume, setVolume] = useState(store.get('volume', 0.6));
  setTimeout(() => {
    store.set('volume', volume);
  });
  return { volume, setVolume };
};
