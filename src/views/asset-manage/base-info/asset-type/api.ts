import { request } from '@/utils/service';
import { Session } from '@/utils/storage';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';
/**
 * 
 * @returns 原始数据管理页面
 */

export function assetTypeAPI() {

  return {
    // 下拉
    resourceOptionFnListGetApi: (params?: object) => {
      return request({
        url: 'api/assets/parent_type/',
        method: 'get',
        params,
      });
    },
    // 获取
    assetTypeListGetApi: (params?: object) => {
      return request({
        url: 'api/assets/resourcetypeviewset/',
        method: 'get',
        params,
      });
    },

    // 新增
    assetTypeListPostApi: (params: object) => {
      return request({
        url: 'api/assets/resourcetypeviewset/',
        method: 'post',
        data: params,
      });
    },
    // 单个详情
    assetTypeListGetIDApi: (id: string, params?: object) => {
      return request({
        url: `api/assets/resourcetypeviewset/${id}/`,
        method: 'get',
        params,
      });
    },
    // 修改
    assetTypeListPutIDApi: (id: string, params?: object) => {
      return request({
        url: `api/assets/resourcetypeviewset/${id}/`,
        method: 'put',
        data: params,
      });
    },
    // 数据删除
    assetTypeListDeleteIDApi: (id: number) => {
      return request({
        url: `api/assets/resourcetypeviewset/${id}/`,
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
    // 上传
    FileListPostApi: (params: any) => {
      return request({
        url: 'api/system/file/',
        method: 'post',
        data: params,
        headers: {
          "Authorization": `JWT ${Session.get('token')}`,
          "Content-Type": "multipart/form-data"
        },
      });
    },
    // 多媒体文件
    importDataListPostApi: (params: any) => {
      return request({
        url: 'api/assets/host/import_data/',
        method: 'post',
        data: params,
        headers: {
          "Authorization": `JWT ${Session.get('token')}`,
          "Content-Type": "multipart/form-data"
        },
      });
    },
    // 导出数据
    exportListGetIDApi: (params?: object) => {
      return request({
        url: `api/assets/host/export_data/`,
        method: 'get',
        data: params,
      });
    },
    // 入库
    storagePostIDApi: (id: any) => {
      return request({
        url: `/api/assets/host/${id}/update_is_known/`,
        method: 'put',
        data: {
          is_known: "2"
        },
      });
    },
    // 批量入库/api/assets/host/batch_update_is_known/
    storageAllPostIDApi: (params: object) => {
      return request({
        url: `/api/assets/host/batch_update_is_known/`,
        method: 'put',
        data: params
      });
    },
  }

}