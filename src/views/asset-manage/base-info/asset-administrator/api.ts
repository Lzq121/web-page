import { request } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

const apiPrefix = '/api/assets/assets/admin_detail/';
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
      url: `/api/assets/assets/admin/`,
      method: 'get',
      params: { id: id },
    });
  },

  AddObj: (data: AddReq) => {
    return request({
      url: apiPrefix,
      method: 'post',
      data,
    });
  },

  UpdateObj: (data: EditReq) => {
    return request({
      url: apiPrefix,
      method: 'put',
      data,
    });
  },
  DelObj: (id: DelReq) => {
    return request({
      url: apiPrefix,
      method: 'delete',
      params: { id },
    });
  },
  getOfficeList: () => {
    return request({
      url: "api/assets/network/get_department/",
      method: 'get',
    });
  },
  downloadFile: () => {
    return request({
      url: "/api/assets/assets/admin_export/",
      method: 'get',
    });
  },
  getTreeList: (query: UserPageQuery) => {
    return request({
      url: "/api/system/dept/",
      method: 'get',
      params: query,
    });
  },
}
