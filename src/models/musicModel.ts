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
  currentSong: Song | null;
  isFull: boolean;
}

const initMusicState: MusicModelState = {
  index: -1,
  playList: [],
  originList: [],
  mode: 'cycle',
  currentSong: null,
  isFull: false,
};

export interface MusicModelType {
  namespace: 'musicPlayer';
  state: MusicModelState;
  effects: {
    [index: string]: Effect;
  };
  reducers: {
    [index: string]: Reducer<MusicModelState>;
  };
  subscriptions: {};
}

const MusicModel: MusicModelType = {
  namespace: 'musicPlayer',

  state: initMusicState,

  effects: {
    *setPlayListAndCurrentSongId({ payload }, { call, put }) {
      yield put({ type: 'setPlayList', payload: payload.playList });
      yield put({ type: 'setCurrentSongId', payload: payload.songId });
    },
    *setMode({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { mode: payload } });
      yield put({ type: 'setPlayList' });
    },
    *nextMode({ payload }, { call, put }) {
      yield put({ type: 'changeMode' });
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
      const i = (index + 1) % playList.length;
      return {
        ...state,
        index: i,
        currentSong: playList[i],
      };
    },
    pre(state = initMusicState, { payload, audioRef }) {
      const { playList, index } = state;
      const i = (index - 1 + playList.length) % playList.length;
      return {
        ...state,
        index: i,
        currentSong: playList[i],
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
        currentSong: state.playList[i],
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
      let i = list.findIndex((song: Song) => song.id === currentSong?.id);
      i = i >= 0 ? i : index;
      return {
        ...state,
        originList: list0,
        playList: list,
        index: i,
        currentSong: list[i],
      };
    },
    changeMode(state = initMusicState, { payload }) {
      switch (state.mode) {
        case 'cycle':
          return { ...state, mode: 'random' };
        case 'random':
          return { ...state, mode: 'single' };
        case 'single':
          return { ...state, mode: 'cycle' };
      }
    },
    setFull(state = initMusicState, { payload }) {
      if (payload) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return { ...state, isFull: payload };
    },
    taggerFull(state = initMusicState, { payload }) {
      const { isFull } = state;
      // if (!isFull) {
      //   document.body.style.overflow = 'hidden';
      // } else {
      //   document.body.style.overflow = '';
      // }
      return { ...state, isFull: !isFull };
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
