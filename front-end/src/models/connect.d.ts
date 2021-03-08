import { ConnectRC, MusicModelState, MusicModelType } from '@@/plugin-dva/connect';

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    qualityMonitor?: boolean;
  };
}

export interface ConnectState {
  loading: Loading;
  musicPlayer: MusicModelState;
}

export type ConnectCS = ConnectRC<ConnectState>;
