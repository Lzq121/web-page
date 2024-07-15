import axios from 'axios';
import { get } from 'lodash-es';
import { ElMessageBox, ElLoading } from 'element-plus';
import type { Action } from 'element-plus';
import { errorLog, errorCreate } from './tools.ts';
import { Session } from '@/utils/storage';
import qs from 'qs';
import { getBaseURL } from './baseUrl';

function createService() {
  const service = axios.create({
    timeout: 0,
    headers: {
      // 'Content-Type': 'application/json;charset=utf-8',
    },
    paramsSerializer: {
      serialize(params) {
        interface paramsObj {
          [key: string]: any;
        }
        let result: paramsObj = {};
        for (const [key, value] of Object.entries(params)) {
          if (value !== '') {
            result[key] = value;
          }
          if (typeof value === 'boolean') {
            result[key] = value ? 'True' : 'False';
          }
        }
        return qs.stringify(result);
      },
    },
  });
  // 请求拦截
  let loading: any = undefined

  service.interceptors.request.use(
    (config) => {
      loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      return config
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // 响应拦截
  service.interceptors.response.use(
    (response: any) => {
      if (loading) {
        loading.close()
      }
      if (response.config.responseType === 'blob') {
        return response;
      }
      const dataAxios = response.data;
      const { code } = dataAxios;
      // swagger判断
      if (dataAxios.swagger != undefined) {
        return dataAxios;
      }
      if (code === undefined) {
        errorCreate(`非标准返回：${dataAxios}， ${response.config.url}`, false);
        return dataAxios;
      } else {
        switch (code) {
          case 400:
            errorCreate(`${dataAxios.msg}`);
            break;
          case 401:
            Session.clear();
            errorCreate(`${dataAxios.msg}`);
            break;
          case 2000:
            if (response.config.unpack === false) {
              return dataAxios;
            }
            return dataAxios;
          case 4000:
            errorCreate(`${dataAxios.msg}`);
            break;
          default:
            errorCreate(`${dataAxios.msg}`);
            break;
        }
        return Promise.reject(dataAxios);
      }
    },
    (error) => {
      const status = get(error, 'response.status');
      if (loading) {
        loading.close()
      }
      switch (status) {
        case 400:
          error.message = '请求错误';
          break;
        case 401:
          Session.clear();
          error.message = '登录授权过期，请重新登录';
          ElMessageBox.alert(error.message, '提示', {
            confirmButtonText: 'OK',
            callback: (action: Action) => {
              window.location.reload();
            },
          });
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = `请求地址出错`;
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          error.message = '服务器内部错误';
          break;
        case 501:
          error.message = '服务未实现';
          break;
        case 502:
          error.message = '网关错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网关超时';
          break;
        case 505:
          error.message = 'HTTP版本不受支持';
          break;
        default:
          break;
      }
      errorLog(error);
      return Promise.reject(error);
    }
  );
  return service;
}

function createRequestFunction(service: any) {
  return function (config: any) {
    const configDefault: any = {
      headers: {
        // 'Content-Type': get(config, 'headers.Content-Type', 'application/json'),
      },
      timeout: 0,
      baseURL: getBaseURL(),
      data: {},
    };

    const token = Session.get('token');
    if (token != null) {
      configDefault.headers.Authorization = 'JWT ' + token;
    }
    return service(Object.assign(configDefault, config));
  };
}

export const service = createService();
export const request = createRequestFunction(service);



export const downloadFile = function ({ url, params, method, filename = '' }: any) {
  request({
    url: url,
    method: method,
    params: params,
    responseType: 'blob'
  }).then((res: any) => {
    const xlsxName = window.decodeURI(res.headers['content-disposition'].split('=')[1]) || '文件导出.xlsx'
    const fileName = filename || xlsxName
    const blob = new Blob([res.data], { type: 'charset=utf-8' })
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href)
    document.body.removeChild(elink)
  }).catch((err: any) => {
    errorLog({ message: "文件导出错误，请联系管理员" });
  })
}
