import {DiscData} from "@/services/API";
import {useRequest} from "@@/plugin-request/request";
import {personalized} from "@/services/recommend";


function defaultDiscData(count: number): DiscData[] {
  return new Array(count).fill({});
}

export default () => {
  const {data: discData = defaultDiscData(30), loading: discDataLoading} =
    useRequest(personalized);

  return {
    discData: (discData as any).result as DiscData[], discDataLoading
  }
}
