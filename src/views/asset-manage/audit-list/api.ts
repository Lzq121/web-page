import { request } from '@/utils/service';

/**
 *
 * @returns 原始数据管理页面
 */

export function knownAPI() {
  return {
    auditRecordGetApi: (params: object) => {
      return request({
        url: 'api/assets/audit_record/',
        method: 'get',
        params,
      });
    },
    // 新增
    auditRecordAllPutIDApi: (params: object) => {
      return request({
        url: `/api/assets/audit_record/update_audits/`,
        method: 'post',
        data: params,
      });
    },
    // 获取详情
    getFieldsDApi: (params: object) => {
      return request({
        url: `/api/assets/audit_record/get_fields/`,
        method: 'post',
        data: params,
      });
    },

    auditRecordPutIDApi: (params: any) => {
      return request({
        url: `/api/assets/audit_record/` + params.id + '/',
        method: 'put',
        data: params,
      });
    },
    // 进程信息
    agentDetailApi: () => {
      return request({
        url: 'api/assets/process/',
        method: 'get',

      });
    },

    // 业务系统下拉框
    businessListgGetApi: (params?: object) => {
      return request({
        url: 'api/assets/business/',
        method: 'get',
        params,
      });
    },
    // 已知
    knownListGetApi: (params?: object) => {
      return request({
        url: 'api/assets/host/',
        method: 'get',
        params,
      });
    },


    // 主机单个详情
    knownListHostGetIDApi: (id: string, params?: object) => {
      return request({
        url: `/api/assets/host/${id}/`,
        method: 'get',
        params,
      });
    },
    // 应用单个详情
    knownListBusinessGetIDApi: (id: string, params?: object) => {
      return request({
        url: `/api/assets/business/${id}/`,
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
  };
}
