/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, ExtendOptionsInit } from 'umi-request';
import { message, notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误,服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权,但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录,服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除,且不会再得到的。',
  422: '当创建一个对象时,发生一个验证错误。',
  500: '服务器发生错误,请检查服务器。',
  502: '网关错误。',
  503: '服务不可用,服务器暂时过载或维护。',
  504: '网关超时。',
};

interface ApiResult<T> {
  code: ApiStatus;
  msg: string;
  result: T;
}

// type PromiseResponse<T> = Promise<ApiResult<T>>

interface HttpType {
  (url: string, options?: HttpExtendOptionsInit | undefined): Promise<any>;

  get: (url: string, options?: HttpExtendOptionsInit | undefined) => Promise<any>;
  post: (url: string, options?: HttpExtendOptionsInit | undefined) => Promise<any>;
  put: (url: string, options?: HttpExtendOptionsInit | undefined) => Promise<any>;
  delete: (url: string, options?: HttpExtendOptionsInit | undefined) => Promise<any>;
  patch: (url: string, options?: HttpExtendOptionsInit | undefined) => Promise<any>;
  head: (url: string, options?: HttpExtendOptionsInit | undefined) => Promise<any>;
  options: (url: string, options?: HttpExtendOptionsInit | undefined) => Promise<any>;
}

interface HttpExtendOptionsInit extends ExtendOptionsInit {
  errorMsg?: boolean;
}

enum ApiStatus {
  success = 200,
  failed = 400,
}

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    console.error(response);
    notification.error({
      description: '您的网络发生异常,无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
  // 缓存键为“ url +参数+方法”。
  useCache: true, //默认
  // 缓存持续时间（毫秒）,0为无穷大
  ttl: 24 * 3600 * 1000,
  //是要缓存的最大请求数,0表示无穷大。
  maxCache: 0,
  // 对于某些需要使用其他方法要求缓存数据的情况,
  validateCache: (url, options) => {
    return true;
  },
});

const http: HttpType = (url: string, options?: HttpExtendOptionsInit | undefined): Promise<any> => {
  const { errorMsg = true } = options || {};
  return request(url, options)
    .catch((err) => {
      console.error('error', err);
      return Promise.reject(err);
    })
    .then((res: ApiResult<any>) => {
      if (res == null) {
        message.error('未知错误');
        return Promise.reject(null);
      }
      if (res instanceof Response) {
        return Promise.reject(null);
      }
      if (res.code != ApiStatus.success) {
        if (errorMsg) {
          res.msg ? message.error(res.msg) : message.error('未知错误');
        }
        return Promise.reject({
          message: res.msg,
          status: res.code,
          data: res,
        });
      }
      return Promise.resolve({
        message: res.msg,
        status: res.code,
        data: res,
      });
    });
};

http.get = (url: string, options?: HttpExtendOptionsInit | undefined): Promise<any> =>
  http(url, { method: 'GET', ...options });

http.post = (url: string, options?: HttpExtendOptionsInit | undefined): Promise<any> =>
  http(url, { method: 'POST', ...options });

http.delete = (url: string, options?: HttpExtendOptionsInit | undefined): Promise<any> =>
  http(url, { method: 'DELETE', ...options });

http.put = (url: string, options?: HttpExtendOptionsInit | undefined): Promise<any> =>
  http(url, { method: 'PUT', ...options });

http.patch = (url: string, options?: HttpExtendOptionsInit | undefined): Promise<any> =>
  http(url, { method: 'PATCH', ...options });

http.head = (url: string, options?: HttpExtendOptionsInit | undefined): Promise<any> =>
  http(url, { method: 'HEAD', ...options });

http.options = (url: string, options?: HttpExtendOptionsInit | undefined): Promise<any> =>
  http(url, { method: 'OPTIONS', ...options });

export default request;

export { http };
