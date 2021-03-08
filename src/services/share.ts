export enum CreateShareTypeEnum {
  JOIN = 'join',
  CREATE = 'create',
  JOIN_ADMIN = 'join_admin',
}

export enum CreateShareRoleEnum {
  ROLE_OWNER = 'ROLE_OWNER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_GUEST = 'ROLE_GUEST',
}

export class CreateShare {
  id: string;
  type: CreateShareTypeEnum;
  name: string;
  adminId: string;
  role: CreateShareRoleEnum;

  constructor(
    id: string,
    type: CreateShareTypeEnum,
    name: string,
    adminId: string,
    role: CreateShareRoleEnum,
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.adminId = adminId;
    this.role = role;
  }
}

export const ShareConstant = {
  OPTIONS: 'OPTIONS',
  SELF_INFO: 'SELF_INFO',
  CHANGE_NAME: 'CHANGE_NAME',
  PUSH_MUSIC: 'PUSH_MUSIC',
  PULL_MUSIC: 'PULL_MUSIC',
  PULL_SONG: 'PULL_SONG',
  PULL_CURRENT_TIME_AND_PAUSED: 'PULL_CURRENT_TIME_AND_PAUSED',
  PULL_CURRENT_TIME_SYNC: 'PULL_CURRENT_TIME_SYNC',
  SHARER_LIST: 'SHARER_LIST',
  CLOSE_CLIENT: 'CLOSE_CLIENT',
};

export class WebSocketResult<T> {
  data: T;
  type: string;
  message: string;
  code: number;
  sendTime: number;
  clientId: string = '';

  static SUCCESS_CODE = 200;
  static SUCCESS_MESSAGE_CODE = 201;
  static ERROR_CODE = 400;
  static WARN_CODE = 401;

  constructor(data: T, type: string, message: string, code: number) {
    this.data = data;
    this.type = type;
    this.message = message;
    this.code = code;
    this.sendTime = new Date().getTime();
  }

  setClientId(clientId: string): WebSocketResult<T> {
    this.clientId = clientId;
    return this;
  }

  static success<T>(type: string, data: T): WebSocketResult<T> {
    return new WebSocketResult(data, type, '', WebSocketResult.SUCCESS_CODE);
  }

  static successMessage(message: string): WebSocketResult<string> {
    return new WebSocketResult('', '', message, WebSocketResult.SUCCESS_MESSAGE_CODE);
  }

  static fail(message: string): WebSocketResult<string> {
    return new WebSocketResult('', '', message, WebSocketResult.ERROR_CODE);
  }

  static warn(message: string): WebSocketResult<string> {
    return new WebSocketResult('', '', message, WebSocketResult.WARN_CODE);
  }

  static fromJson<T>(json: string) {
    return JSON.parse(json) as WebSocketResult<T>;
  }

  toString() {
    return JSON.stringify(this);
  }
}
