import { useRequest } from '@@/plugin-request/request';
import { RankingData, toplist } from '@/services/disc';

function defaultData(count: number): any {
  return new Array(count).fill({});
}

export default () => {
  const {
    data: rankingData = defaultData(30),
    loading: rankingDataLoading,
  }: { data: RankingData; loading: boolean } = useRequest(toplist) as any;

  console.info(rankingData);

  return {
    rankingData,
    rankingDataLoading,
  };
};
