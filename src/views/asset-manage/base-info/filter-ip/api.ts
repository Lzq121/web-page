import { request } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

const apiPrefix = '/api/assets/assets/filter_asset_detail/';
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
      url: `/api/assets/assets/filter_asset/`,
      method: 'get',
      params: { id: id },
    });
  },
  AddObj: (obj: AddReq) => {
    return request({
      url: apiPrefix,
      method: 'post',
      data: obj,
    });
  },
  // 获取左树
  getLeftTree: (query?: any) => {
    return request({
      url: '/api/assets/assets/filter_tree/',
      method: 'get',
      params: query,
    });
  },

  // UpdateObj:(obj: EditReq)=> {
  //   return request({
  //     url: apiPrefix,
  //     method: 'put',
  //     data: obj,
  //   });
  // },
  DelObj: (id: DelReq) => {
    return request({
      url: `/api/assets/assets/filter_asset/${id}/`,
      method: 'delete',

    });
  },
  UpdateObj: (id: any, obj: any) => {
    return request({
      url: `/api/assets/assets/filter_asset/${id}/`,
      method: 'put',
      data: obj,
    });
  },
  // 获取单个的
  oneDetails: (id: any) => {
    return request({
      url: `/api/assets/assets/filter_asset/${id}/`,
      method: 'get',
    });
  },
  // 资产获取
  assetsGetHostList: (query: any) => {
    return request({
      url: `/api/assets/Hosts/`,
      method: 'get',
      params: query,
    });
  },
  assetsGetBusinessList: (query: any) => {
    return request({
      url: `/api/assets/Business/`,
      method: 'get',
      params: query,
    });
  },
  // 资产获取列表
  assetsGetBackBusinessList: (obj: any) => {
    return request({
      url: `/api/assets/assets/business/hosts/`,
      method: 'post',
      data: obj,
    });
  },
  getList: () => {
    return request({
      url: `api/assets/source_model/get_list/`,
      method: 'get',
    });
  },
  getOfficeList: () => {
    return request({
      url: "api/assets/assets/host_list/",
      method: 'get',
    });
  },

  getTreeList: (params: object) => {
    return request({
      url: '/api/assets/assets/filter_tree/',
      method: 'get',
      params
    });
  },

}
