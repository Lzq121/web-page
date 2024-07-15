import { request } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

const apiPrefix = '/api/datamodelmanagement/';
export default {
  upDateApi: (query: UserPageQuery) => {
    return request({
      url: apiPrefix + "implementfreshness/",
      method: 'get',
      params: query,
    });
  },
  GetList: (query: UserPageQuery) => {
    return request({
      url: apiPrefix + "integrity_list/",
      method: 'get',
      params: query,
    });
  },
  GetObj: (id: InfoReq) => {
    return request({
      url: apiPrefix + "integrity_list/" + id,
      method: 'get',
    });
  },

  AddObj: (obj: AddReq) => {
    return request({
      url: apiPrefix + "integrity_list/",
      method: 'post',
      data: obj,
    });
  },

  UpdateApi: (query: AddReq) => {
    return request({
      url: apiPrefix + "integrity_list/",
      method: 'post',
      data: query,
    });
  },
  DelObj: (id: DelReq) => {
    return request({
      url: apiPrefix + "integrity_list/" + id + '/',
      method: 'delete',
      data: { id },
    });
  },

}
