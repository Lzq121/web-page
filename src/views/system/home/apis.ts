import { request, downloadFile } from '@/utils/service';

export default {
  getHostCount: () => {
    return request({
      url: '/api/assets/assets/host_count/',
      method: 'get',
    });
  },
  getHostFoldline: () => {
    return request({
      url: '/api/assets/assets/host_foldline/',
      method: 'get',
    });
  },
  getColumnar: () => {
    return request({
      url: '/api/assets/assets/columnar/',
      method: 'get',
    });
  },
}