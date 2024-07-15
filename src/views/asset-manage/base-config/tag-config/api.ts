import { request } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

const apiPrefix = '/api/assets/lable_rules/';
const apiUpdatefix = '/api/assets/rules_start/';
export default {
  GetList: (query: UserPageQuery) => {
    return request({
      url: apiPrefix,
      method: 'get',
      params: query,
    });
  },
  updateList: (id: InfoReq, query: UserPageQuery) => {
    return request({
      url: apiUpdatefix + id + '/',
      method: 'get',
      params: query,
    });
  },
  getListDetail: (id: InfoReq) => {
    return request({
      url: apiPrefix + id,
      method: 'get',

    });
  },

}
