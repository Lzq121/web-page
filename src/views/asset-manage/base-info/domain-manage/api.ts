import { request ,downloadFile} from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

const apiPrefix = '/api/assets/network/domain/';
export default {
  downloadExcel: (data: object, filename: string) => {
    return downloadFile({
      url: '/api/assets/network/domain_export/',
      method: 'get',
      params: data,
      filename,
    });
  },
  getCompanyList: () => {
    return request({
      url: `api/assets/network/get_department/`,
      method: 'get',
    });
  },
  getDomainParentList: () => {
    return request({
      url: `api/assets/network/domain_parent_list/`,
      method: 'get',
    });
  },
  getAdminList: (query: UserPageQuery) => {
    return request({
      url: '/api/assets/assets/admin_detail/',
      method: 'get',
      params: query,
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
  getList: () => {
    return request({
      url: `api/assets/network/get_department/`,
      method: 'get',
    });
  },
}
