import { request } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

const apiPrefix = '/api/datamodelmanagement/';

export default {
  getModelListApi: (query: UserPageQuery) => {
    return request({
      url: apiPrefix + "model_manager/",
      method: 'get',
      params: query,
    });
  },
  GetList: (query: UserPageQuery) => {
    return request({
      url: apiPrefix + "freshness_list/",
      method: 'get',
      params: query,
    });
  },
  upDateApi: (query: UserPageQuery) => {
    return request({
      url: apiPrefix + "implementcompletion/",
      method: 'get',
      params: query,
    });
  },


}

