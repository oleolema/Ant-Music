import { Effect, Reducer, Subscription } from 'umi';
import { Song } from '@/services/API';

export interface MusicModelState {
  index: number;
  playList: Song[];
  mode: 'circle' | 'random' | 'single';
}

export interface MusicModelType {
  namespace: 'music';
  state: MusicModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<MusicModelState>;
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}

const MusicModel: MusicModelType = {
  namespace: 'music',

  state: {
    index: 0,
    playList: [],
    mode: 'circle',
  },

  effects: {
    *query({ payload }, { call, put }) {},
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({
            type: 'query',
          });
        }
      });
    },
  },
};

export default MusicModel;
