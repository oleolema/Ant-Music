import {MenuDataItem} from '@ant-design/pro-layout';
import {QualityMonitorModelState} from '@/pages/Monitor/QualityMonitor/data';
import {ConnectRC} from '@@/plugin-dva/connect';

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    qualityMonitor?: boolean;
  };
}

export interface ConnectState {
  qualityMonitor: QualityMonitorModelState;
  loading: Loading;
}

export type ConnectCS = ConnectRC<ConnectState>;
