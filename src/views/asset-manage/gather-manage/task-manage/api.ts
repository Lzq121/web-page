import { request } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

const apiPrefix = '/api/gather/task/';
const apiResult = '/api/gather/task_result/';
const apiUpdate = '/api/gather/task/update_status/';
export default {
  GetList: (query: UserPageQuery) => {
    return request({
      url: apiPrefix,
      method: 'get',
      params: query,
    });
  },
  GetResultList: (query: UserPageQuery) => {
    return request({
      url: apiResult,
      method: 'get',
      params: query,

    });
  },
  GetResultUpdate: (query: UserPageQuery) => {
    return request({
      url: apiUpdate,
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
  getGatherList: () => {
    return request({
      url: `api/gather/task/get_source/`,
      method: 'get',
    });
  },
  executeImmediately: (id: string) => {
    return request({
      url: `api/gather/task/conduct_task/${id}/`,
      method: 'get',
    });
  },
  getModelOptions: (query: object) => {
    return request({
      url: 'api/datamodelmanagement/model_manager/',
      method: 'get',
      params: query,
    });
  },
}

