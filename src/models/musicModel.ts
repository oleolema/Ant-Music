import { Effect } from 'umi';
import { Song } from '@/services/API';
import { Reducer } from '@@/plugin-dva/connect';
import _ from 'lodash';
import { ConnectState } from '@/models/connect';

export type PlayType = 'cycle' | 'random' | 'single';

export interface MusicModelState {
  index: number;
  playList: Song[];
  originList: Song[];
  mode: PlayType;
  currentSong: Song | null;
}

const initMusicState: MusicModelState = {
  index: -1,
  playList: [],
  originList: [],
  mode: 'cycle',
  currentSong: null,
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
    *deleteSongFromPlayList({ payload }, { call, put, select }) {
      const { playList, index }: MusicModelState = yield select(
        (state: ConnectState) => state.musicPlayer,
      );
      yield put({
        type: 'setPlayList',
        payload: playList.filter((it, i) => {
          if (it.id === payload.id) {
            if (i === index) {
              put({ type: 'next' });
            }
            return false;
          }
          return true;
        }),
      });
    },
    *setPlayListAndPlay({ payload }, { call, put, select }) {
      yield put({ type: 'setPlayList', payload: payload });
      const { playList }: MusicModelState = yield select(
        (state: ConnectState) => state.musicPlayer,
      );
      yield put({ type: 'setCurrentSongId', payload: playList[0].id });
    },
    *setPlayListAndCurrentSongId({ payload }, { call, put }) {
      yield put({ type: 'setPlayList', payload: payload.playList });
      yield put({ type: 'setCurrentSongId', payload: payload.songId });
    },
    *insertSong({ payload }, { call, put, select }) {
      const { playList, index }: MusicModelState = yield select(
        (state: ConnectState) => state.musicPlayer,
      );
      if (playList.find((it) => it.id === payload.id)) {
        yield put({ type: 'setCurrentSongId', payload: payload.id });
        return;
      } else {
        playList.splice(index + 1, 0, payload);
        yield put({
          type: 'setPlayListAndCurrentSongId',
          payload: { playList, songId: payload.id },
        });
      }
    },
    *setCurrentSongId({ payload }, { call, put, select }) {
      const { playList }: MusicModelState = yield select(
        (state: ConnectState) => state.musicPlayer,
      );
      const i = playList.findIndex((it) => it.id === payload);
      if (i === -1) {
        console.error('未找到该歌曲: ' + payload, playList);
      }
      console.info(playList[i]);
      yield put({ type: 'setIndex', payload: i });
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
      if (!playList.length) {
        return state;
      }
      const i = (index + 1) % playList.length;
      return {
        ...state,
        index: i,
        currentSong: playList[i],
      };
    },
    pre(state = initMusicState, { payload, audioRef }) {
      const { playList, index } = state;
      if (!playList.length) {
        return state;
      }
      const i = (index - 1 + playList.length) % playList.length;
      return {
        ...state,
        index: i,
        currentSong: playList[i],
      };
    },
    setIndex(state = initMusicState, { payload }) {
      return {
        ...state,
        index: payload,
        currentSong: state.playList[payload],
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
