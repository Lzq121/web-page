import { request } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

const apiPrefix = '/api/assets/cip_rules/';
export default {
  GetList: (query: UserPageQuery) => {
    return request({
      url: apiPrefix,
      method: 'get',
      params: query,
    });
  },
  GetObj: (id: InfoReq) => {
    return request({
      url: apiPrefix + id,
      method: 'get',
    });
  },

  AddObj: (obj: AddReq) => {
    return request({
      url: apiPrefix,
      method: 'post',
      data: obj,
    });
  },

  UpdateObj: (obj: EditReq) => {
    return request({
      url: apiPrefix + obj.id + '/',
      method: 'put',
      data: obj,
    });
  },
  DelObj: (id: DelReq) => {
    return request({
      url: apiPrefix + id + '/',
      method: 'delete',
      data: { id },
    });
  },
  getList: () => {
    return request({
      url: `api/assets/source_model/get_list/`,
      method: 'get',
    });
  },
}
