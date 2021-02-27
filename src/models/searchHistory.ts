import { useEffect, useState } from 'react';
import store2 from 'store2';
import { SearchData } from '@/services/song';

const MAX_HISTORY_LENGTH = 10;

const HISTORY_SEARCH = 'historySearch';

const store = store2.namespace(HISTORY_SEARCH);

export default () => {
  const [history, setHistory] = useState<string[]>([]);
  const [searchData, setSearchData] = useState<SearchData>();
  console.info('history', history);

  useEffect(() => {
    setHistory(store.get(HISTORY_SEARCH, []));
  }, []);

  return {
    history,
    searchData,
    setSearchData,
    addHistory: (value: string) => {
      if (!value) {
        return;
      }
      const h = history.filter((it) => it !== value);
      h.unshift(value);
      if (h.length > MAX_HISTORY_LENGTH) {
        h.pop();
      }
      setTimeout(() => {
        store.set(HISTORY_SEARCH, h, true);
      });
      setHistory(h);
    },
    clearHistory: () => {
      setHistory([]);
    },
    deleteHistory: (value: string) => {
      setHistory(history.filter((it) => it !== value));
    },
  };
};
