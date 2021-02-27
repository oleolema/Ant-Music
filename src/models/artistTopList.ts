import { useRequest } from '@@/plugin-request/request';
import { ArtistTopData, toplistArtist } from '@/services/disc';

function defaultData(count: number): any {
  return new Array(count).fill({});
}

export default () => {
  const {
    data: rankingData = defaultData(30),
    loading: rankingDataLoading,
  }: { data: ArtistTopData; loading: boolean } = useRequest(toplistArtist) as any;

  console.info(rankingData);

  return {
    rankingData,
    rankingDataLoading,
  };
};
