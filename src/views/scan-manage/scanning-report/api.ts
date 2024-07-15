import { request } from '@/utils/service';
import { UserPageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

export const apiPrefix = '/api/scan/scantask/results/';
export function GetList(query?: UserPageQuery) {
  return request({
    url: apiPrefix,
    method: 'get',
    params: query,
  });
}
export function GetObj(id: InfoReq) {
  return request({
    url: apiPrefix + id,
    method: 'get',
  });
}

export function AddObj(obj: AddReq) {
  return request({
    url: apiPrefix,
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj: EditReq) {
  return request({
    url: apiPrefix + obj.id + '/',
    method: 'put',
    data: obj,
  });
}

export function DelObj(id: DelReq) {
  return request({
    url: apiPrefix + id + '/',
    method: 'delete',
    data: { id },
  });
}
export function checkUrl(id: InfoReq) {
  return request({
    url: '/api/gather/chk_url/' + id + '/',
    method: 'get',
  });
}

export function GetResultList(query?: UserPageQuery) {
  return request({
    url: "/api/scan/scantask/result_details/",
    method: 'get',
    params: query,
  });
}
// 下载
export function reportUrlGet(query?: UserPageQuery) {
  return request({
    url: "/api/scan/scantask_result/reports/",
    method: 'get',
    params: query,
  });
}
// 切换状态
export function statusChangeGet(query?: UserPageQuery) {
  return request({
    url: "/api/scan/scantask_result/status/",
    method: 'get',
    params: query,
  });
}
// 漏洞扫描结果
export function loopholeGetList(query?: any) {
  return request({
    url: "/api/scan/scantask_result/vulus/",
    method: 'get',
    params: query,
  });
}

export function getOperateData(obj: EditReq) {
  return request({
    url: "/api/scan/scantask_result/status/",
    method: 'put',
    data: obj,
  });
}
