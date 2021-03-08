import { DiscData } from '@/services/API';
import { useRequest } from '@@/plugin-request/request';
import { banner, BannerData, personalized } from '@/services/recommend';

function defaultDiscData(count: number): DiscData[] {
  return new Array(count).fill({});
}

export default () => {
  const { data: discData = defaultDiscData(30), loading: discDataLoading } = useRequest(
    personalized,
  );

  const { data: bannerData, loading: bannerLoading } = useRequest(banner);

  return {
    discData: (discData as any).result as DiscData[],
    discDataLoading,
    bannerData: bannerData as BannerData,
    bannerLoading,
  };
};
