import { request } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';
export default {
  getAdminDetail: () => {
    return request({
      url: 'api/assets/assets/admin_detail/',
      method: 'get',
    });
  },
  // 主机父下拉框
  hostParentListgGetApi: (params?: object) => {
    return request({
      url: 'api/assets/resource_type/host_parent_type/',
      method: 'get',
      params,
    });
  },
  agentDetailApi: (params?: object) => {
    return request({
      url: 'api/assets/process/',
      method: 'get',
      params,
    });
  },
  // 主机子下拉框
  childListgGetApi: (params?: object) => {
    return request({
      url: 'api/assets/resource_type/child-types/',
      method: 'get',
      params,
    });
  },
  // 主机父下拉框
  businessParentListgGetApi: (params?: object) => {
    return request({
      url: 'api/assets/resource_type/business_parent_type/',
      method: 'get',
      params,
    });
  },
  // 所属应用下拉框
  drowdowListgGetApi: (params?: object) => {
    return request({
      url: 'api/assets/Business/dropdown_list/',
      method: 'get',
      params,
    });
  },
  // 修改
  knownListBusinessPutIDApi: (id: string, params?: object) => {
    return request({
      url: `/api/assets/Business/${id}/`,
      method: 'put',
      data: params,
    });
  },
  knownListHostsPutIDApi: (id: string, params?: object) => {
    return request({
      url: `/api/assets/Hosts/${id}/`,
      method: 'put',
      data: params,
    });
  },
  // 业务系统下拉框
  businessListgGetApi: (params?: object) => {
    return request({
      url: 'api/assets/Business/',
      method: 'get',
      params,
    });
  },
  // 已知
  knownListGetApi: (params?: object) => {
    return request({
      url: 'api/assets/Hosts/',
      method: 'get',
      params,
    });
  },

  // 新增
  knownListPostApi: (params: object) => {
    return request({
      url: 'api/assets/Hosts/',
      method: 'post',
      data: params,
    });
  },

  // 主机单个详情
  knownListHostGetIDApi: (id: string, params?: object) => {
    return request({
      url: `/api/assets/Hosts/${id}/`,
      method: 'get',
      params,
    });
  },
  // 应用单个详情
  knownListBusinessGetIDApi: (id: string, params?: object) => {
    return request({
      url: `/api/assets/Business/${id}/`,
      method: 'get',
      params,
    });
  },

  //更新日志
  journalListGetApi: (params: any) => {
    return request({
      url: 'api/assets/change_record/',
      method: 'get',
      params,
    });
  },

  getTreeList: (url: string) => {
    return request({
      url,
      method: 'get',
    });
  },

  // 管理员列表
  getAdminObj: (id: string) => {
    return request({
      url: `/api/assets/assets/admin/`,
      method: 'get',
      params: { id: id },
    });
  },
  updateAdminObj: (obj: object) => {
    return request({
      url: '/api/assets/assets/admin_detail/',
      method: 'put',
      data: obj,
    });
  },
  getOfficeList: () => {
    return request({
      url: "api/assets/network/get_department/",
      method: 'get',
    });
  },
  getAdminList: (query: object) => {
    return request({
      url: '/api/assets/assets/admin_detail/',
      method: 'get',
      params: query,
    });
  },
  // 域名URL 信息
  getUrlList: (query: UserPageQuery) => {
    return request({
      url: '/api/assets/network/url_addr/',
      method: 'get',
      params: query,
    });
  },
  getUrlObj: (id: InfoReq) => {
    return request({
      url: '/api/assets/network/url_addr/' + id,
      method: 'get',
    });
  },

  addUrlObj: (obj: AddReq) => {
    return request({
      url: '/api/assets/network/url_addr/',
      method: 'post',
      data: obj,
    });
  },

  updateUrlObj: (obj: EditReq) => {
    return request({
      url: '/api/assets/network/url_addr/' + obj.id + '/',
      method: 'put',
      data: obj,
    });
  },
  delUrlObj: (id: DelReq) => {
    return request({
      url: '/api/assets/network/url_addr/' + id + '/',
      method: 'delete',
      data: { id },
    });
  },
  getCompanyList: () => {
    return request({
      url: `api/assets/network/get_department/`,
      method: 'get',
    });
  },
  getDomainList: (query: UserPageQuery) => {
    return request({
      url: '/api/assets/network/domain/',
      method: 'get',
      params: query,
    });
  },

    // 获取筛选下拉
    getAllDropList: () => {
      return request({
        url: '/api/assets/assets/all_drop_list/',
        method: 'get',
      });
    },
}
