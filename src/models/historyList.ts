import { useEffect, useState } from 'react';
import { Song } from '@/services/API';
import store2 from 'store2';

const MAX_HISTORY_LENGTH = 50;

const HISTORY_LIST = 'historyList';

const store = store2.namespace('history');

export default () => {
  const [history, setHistory] = useState<Song[]>([]);
  console.info('history', history);

  useEffect(() => {
    setHistory(store.get(HISTORY_LIST, []));
  }, []);

  return {
    history,
    addHistory: (song: Song | null) => {
      if (!song) {
        return;
      }
      const h = history.filter((it) => it.id !== song.id);
      h.unshift(song);
      if (h.length > MAX_HISTORY_LENGTH) {
        h.pop();
      }
      setTimeout(() => {
        store.set(HISTORY_LIST, h, true);
      });
      setHistory(h);
    },
    clearHistory: () => {
      setHistory([]);
    },
    deleteHistory: (song: Song) => {
      setHistory(history.filter((it) => it.id !== song.id));
    },
  };
};
