import { V1TaskTopicInfo } from '@/lib/http';

export interface ListResponseData {
  list: V1TaskTopicInfo[] | any[];
  total: number;
  page: number;
  size: number;
}
export function getNextPageParam<
  TPageParam extends App.Service.ListParams,
  TQueryFnData extends ListResponseData,
>(
  lastPage: TQueryFnData,
  _allPages: Array<TQueryFnData>,
  lastPageParam: TPageParam,
  // allPageParams: Array<TPageParam>
): TPageParam | undefined | null {
  const { page, size, total } = lastPage;
  if (page * size > total) {
    return null;
  }

  return { ...lastPageParam, page: page + 1 };
}
