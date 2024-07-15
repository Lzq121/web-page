import { request, downloadFile } from '@/utils/service';
export default {
  // 下载
  downloadHostFile: (data: object, filename: string) => {
    return downloadFile({
      url: 'api/assets/host/export_data/',
      method: 'get',
      params: data,
      filename,
    });
  },
  downloadBusinessFile: (data: object, filename: string) => {
    return downloadFile({
      url: 'api/assets/business/export_data/',
      method: 'get',
      params: data,
      filename
    });
  },

  // 获取
  unknownListGetApi: (params: object) => {
    return request({
      url: 'api/assets/host/',
      method: 'get',
      params,
    });
  },

  // 新增
  unknownListPostApi: (params: object) => {
    return request({
      url: 'api/assets/host/',
      method: 'post',
      data: params,
    });
  },
  // 单个详情
  unknownListGetIDApi: (id: string, params: object) => {
    return request({
      url: `/api/assets/host/${id}/`,
      method: 'get',
      params,
    });
  },

  agentDetailApi: (params: object) => {
    return request({
      url: 'api/assets/process/',
      method: 'get',
      params
    });
  },

  // APP详情
  AppunknownListGetIDApi: (id: string, params: object) => {
    return request({
      url: `/api/assets/business/${id}/`,
      method: 'get',
      params,
    });
  },
  // 访问信息
  accessListGetIDApi: (params: object) => {
    return request({
      url: `/api/assets/access/`,
      method: 'get',
      params,
    });
  },
  accessListPostIDApi: (params: object) => {
    return request({
      url: `/api/assets/access/`,
      method: 'post',
      data: params,
    });
  },
  assEditListPutIDApi: (id: string, params: object) => {
    return request({
      url: `/api/assets/access/${id}/`,
      method: 'put',
      data: params,
    });
  },
  assEditListPdelIDApi: (id: number, params: object) => {
    return request({
      url: `/api/assets/access/${id}/`,
      method: 'delete',
    });
  },
  // 修改
  unknownListPutIDApi: (id: string, params: object) => {
    return request({
      url: `/api/assets/host/${id}/`,
      method: 'put',
      data: params,
    });
  },
  // 应用修改
  bussListPutIDApi: (id: string, params: object) => {
    return request({
      url: `/api/assets/business/${id}/`,
      method: 'put',
      data: params,
    });
  },
  // 原始数据删除
  unknownListDeleteIDApi: (id: number, params: object) => {
    return request({
      url: `/gather/task/${id}`,
      method: 'delete',
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
  
  // 导出数据
  exportListGetHostIDApi: (params: object) => {
    return request({
      url: `api/assets/host/export_data/`,
      method: 'get',
      data: params,
    });
  },
  // 导出数据
  exportListGetBusinessIDApi: (params: object) => {
    return request({
      url: `api/assets/business/export_data/`,
      method: 'get',
      data: params,
    });
  },
  // 入库主机
  storagePostIDApi: (id: any) => {
    return request({
      url: `/api/assets/host/store/`,
      method: 'post',
      data: {
        id
      },
    });
  },
  // 入库应用
  storageBusinessPostIDApi: (id: any) => {
    return request({
      url: `/api/assets/business/store/`,
      method: 'post',
      data: {
        id
      },
    });
  },
  addBusinessApi: (params: object) => {
    return request({
      url: 'api/assets/business/',
      method: 'post',
      data: params,
    });
  },
  // 
  // 主机批量入库
  hostStore: (data: object) => {
    return request({
      url: `/api/assets/host/store/`,
      method: 'post',
      data
    });
  },
  // 应用批量入库
  businessStore: (data: object) => {
    return request({
      url: `/api/assets/business/store/`,
      method: 'post',
      data
    });
  },
  // 资产组织
  assetOrganization: (params: object) => {
    return request({
      url: 'api/assets/business/',
      method: 'get',
      params,
    });
  },
  // 资源大类
  resourceCategoryGetIDApi: () => {
    return request({
      url: 'api/assets/resource_type/host_parent_type/',
      method: 'get',
    });
  },
  // 资产类别
  calssCategoryGetIDApi: (params: object) => {
    return request({
      url: 'api/assets/resource_type/child-types/',
      method: 'get',
      params,
    });
  },
  // app大类
  APPCategoryGetIDApi: () => {
    return request({
      url: 'api/assets/resource_type/business_parent_type/',
      method: 'get',
    });
  },
  replaceInfo: (data: object) => {
    return request({
      url: 'api/assets/host/replace_info/',
      method: 'put',
      data
    });
  },
  getTreeList: (url: string) => {
    return request({
      url,
      method: 'get',
    });
  },
  getEdrNetworkCard: (params:object) => {
    return request({
      url:"/api/assets/edr_network_card/",
      method: 'get',
      params
    });
  },

  // 域名URL 信息
  getUrlList: (query: object) => {
    return request({
      url: '/api/assets/network/url_addr/',
      method: 'get',
      params: query,
    });
  },
  getUrlObj: (id: string) => {
    return request({
      url: '/api/assets/network/url_addr/' + id,
      method: 'get',
    });
  },

  addUrlObj: (obj: object) => {
    return request({
      url: '/api/assets/network/url_addr/',
      method: 'post',
      data: obj,
    });
  },

  updateUrlObj: (obj: any) => {
    return request({
      url: '/api/assets/network/url_addr/' + obj.id + '/',
      method: 'put',
      data: obj,
    });
  },
  delUrlObj: (id: string) => {
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
  getDomainList: (query: object) => {
    return request({
      url: '/api/assets/network/domain/',
      method: 'get',
      params: query,
    });
  },
  getAdminList: (query: object) => {
    return request({
      url: '/api/assets/assets/admin_detail/',
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
  // 批量设置标签选择
  replaceAllTag: (data:object) => {
    return request({
      url: '/api/assets/host/replace_info/',
      method: 'post',
      data,
    });
  },

}