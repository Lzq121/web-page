import { request } from '@/utils/service';

export function getRes(params:object) {
    return request({
      url: '/api/tools/ipquery',
      method: 'get',
      params
    })
  }

  
export function hostListGetApi(params:object) {
  return request({
    url: '/api/assets/Hosts/',
    method: 'get',
    params,
  });
}

export function urlAddrListGetApi(params:object) {
  return request({
    url: '/api/assets/network/url_addr/',
    method: 'get',
    params,
  });
}