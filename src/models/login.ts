import {useRequest} from "@@/plugin-request/request";
import {loginByEmail} from "@/services/login";

export default () => {

  const {data: loginData, loading: loginLoading, run: loginRun} = useRequest(() => loginByEmail('yqh6431@163.com', 'y1075056431'));


  return {
    loginData,
    loginLoading,
    loginRun
  };
};
