import { request } from '@/utils/service';
export default {

  rawDataListGetApi: (params?: object) => {
    return request({
      url: '/api/assets/source_model/',
      method: 'get',
      params,
    });
  },

  getList: () => {
    return request({
      url: `api/assets/source_model/get_list/`,
      method: 'get',
    });
  },
  mergeData: (data: object) => {
    return request({
      url: `api/assets/source_model/merge_data/`,
      method: 'put',
      data
    });
  },

}
