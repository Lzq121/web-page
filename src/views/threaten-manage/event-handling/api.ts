import { request } from '@/utils/service';


export function getThreat(params:object) {
  return request({
    url: '/api/tools/threat/',
    method: 'get',
    params
  })
}


export function createThreat(data:object) {
  return request({
    url: '/api/tools/threat/',
    method: 'post',
    data
  })
}



export function updateThreat(data:object) {
  return request({
    url: '/api/tools/threat/update/',
    method: 'post',
    data
  })
}

export function deleteThreat(data:object) {
  return request({
    url: '/api/tools/threat/delete/',
    method: 'delete',
    data
  })
}


export function getImages(params:object) {
  return request({
    url: '/api/tools/upload/',
    method: 'get',
    params
  })
}


export function deleteImages(data:object) {
  return request({
    url: '/api/tools/upload/delete/',
    method: 'delete',
    data
  })
}


export function getThreatDeal(params:object) {
  return request({
    url: '/api/tools/threatdeal/',
    method: 'get',
    params
  })
}


export function createThreatDeal(data:object) {
  return request({
    url: '/api/tools/threatdeal/',
    method: 'post',
    data
  })
}


export function deleteThreatDeal(data:object) {
  return request({
    url: '/api/tools/threatdeal/delete/',
    method: 'delete',
    data
  })
}

export function getRes(params:object) {
  return request({
    url: '/api/tools/ipquery',
    method: 'get',
    params
  })
}


export function hostListGetApi(params:object) {
  return request({
    url: 'api/assets/host/',
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

