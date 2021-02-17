import { Effect } from 'umi';
import { Song } from '@/services/API';
import { Reducer } from '@@/plugin-dva/connect';
import _ from 'lodash';

export type PlayType = 'cycle' | 'random' | 'single';

export interface MusicModelState {
  index: number;
  playList: Song[];
  originList: Song[];
  mode: PlayType;
}

const initMusicState: MusicModelState = {
  index: -1,
  playList: [],
  originList: [],
  mode: 'cycle',
};

export interface MusicModelType {
  namespace: 'musicPlayer';
  state: MusicModelState;
  effects: {
    [index: string]: Effect;
  };
  reducers: {
    [index: string]: Reducer<MusicModelState>;
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions: {};
}

const MusicModel: MusicModelType = {
  namespace: 'musicPlayer',

  state: initMusicState,

  effects: {
    *setPlayListAndCurrentSongId({ payload }, { call, put }) {
      console.info(payload);
      yield put({ type: 'setPlayList', payload: payload.playList });
      yield put({ type: 'setCurrentSongId', payload: payload.songId });
    },
    *setMode({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { mode: payload } });
      yield put({ type: 'setPlayList' });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    next(state = initMusicState, { payload, audioRef }) {
      const { playList, index } = state;
      return {
        ...state,
        index: (index + 1) % playList.length,
      };
    },
    pre(state = initMusicState, { payload, audioRef }) {
      const { playList, index } = state;
      return {
        ...state,
        index: (index - 1 + playList.length) % playList.length,
      };
    },
    setCurrentSongId(state = initMusicState, { payload }) {
      console.info(state);
      const i = state.playList.findIndex((it) => it.id === payload);
      if (i === -1) {
        console.error('未找到该歌曲: ' + payload, state.playList);
      }
      return {
        ...state,
        index: i,
      };
    },
    setPlayList(state = initMusicState, { payload }) {
      console.info(state);
      const { mode, index, originList } = state;
      let list = payload || originList;
      let list0 = list;
      if (mode === 'random') {
        list = _.shuffle(list);
      }
      console.info(list);
      const currentSong = getCurrentSong(state);
      let index0 = list.findIndex((song: Song) => song.id === currentSong?.id);
      index0 = index0 >= 0 ? index0 : index;
      return {
        ...state,
        originList: list0,
        playList: list,
        index: index0,
      };
    },
  },
  subscriptions: {},
};

export default MusicModel;

function getCurrentSong(state: MusicModelState): Song | null {
  const { index, playList } = state;
  if (index === -1) {
    return null;
  }
  return playList[index];
}
