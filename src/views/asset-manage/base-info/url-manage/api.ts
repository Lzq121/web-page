import { request, downloadFile } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

const apiPrefix = '/api/assets/inform/info_system/';
export default {
  downloadExcel: (data: object, filename: string) => {
    return downloadFile({
      url: '/api/assets/inform/info_system_export/',
      method: 'get',
      params: data,
      filename,
    });
  },
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
  getAdminList: (query: UserPageQuery) => {
    return request({
      url: '/api/assets/assets/admin_detail/',
      method: 'get',
      params: query,
    });
  },
  getCompanyList: () => {
    return request({
      url: `api/assets/network/get_department/`,
      method: 'get',
    });
  },
}
