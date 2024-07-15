import axios from 'axios'
import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ElLoading, ElNotification, ElMessageBox } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router/index'
import { Local, Session } from '@/utils/storage';
// import { NextLoading } from '@/utils/loading' //全局loading，普通请求不适用
NProgress.configure({
  // easing: 'ease', // 动画方式
  // speed: 3000, // 递增进度条的速度
  showSpinner: true, // 是否显示加载ico
  // trickleSpeed: 200, // 自动递增间隔
  // minimum: 0.3, // 更改启动时使用的最小百分比
  // parent: 'body', //指定进度条的父容器
})

// 开启进度条
let loadingInstance: any = undefined;
let token = Session.get('token');
const start = (text: string = "加载中，请稍候...") => {
  NProgress.start();
  // NextLoading.start()
  loadingInstance = ElLoading.service({
    lock: true,
    text,
    background: 'rgba(0, 0, 0, 0.5)',
  })
};

// 关闭进度条
const close = () => {
  NProgress.done();
  // NextLoading.done()
  if (loadingInstance) {
    loadingInstance.close()
  }
};
let baseURL = import.meta.env.VITE_API_URL as any;
export const request = axios.create({
  baseURL,
  timeout: 0,
})


request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config && config.headers) {
      start()
      config.headers.Authorization = 'JWT ' + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: any) => {
    const res = response.data
    close();
    // 没有状态码，直接返回数据
    if (!res.code) {
      return res
    }
    switch (res.code) {
      case 2000:
        return res
      case 401:
        Session.clear();
        ElMessageBox.alert('登录授权过期，请重新登录', '提示', {
          confirmButtonText: '确认',
          callback: () => {
            window.location.reload();
          },
        });
        break;

      case 403:
        ElMessageBox.alert(res.msg, '登录信息已过期', {
          confirmButtonText: '退出',
          callback: () => {
            router.push({ path: "/login" })
          },
        });
        break
      default:
        ElNotification({
          message: res.msg || '请求错误',
          type: 'error',
          duration: 5 * 1000
        })
        break;
    }
    return res
  },
  async (error: AxiosError) => {
    close();

    if (error.message.includes("timeout")) {
      ElNotification.error("请求超时，请稍后再试");
    } else {
      ElNotification({
        message: error.message || '服务器请求错误，请稍后重试',
        type: 'error',
        duration: 5 * 1000
      })

    }
    return Promise.reject(error);

  }
)

// 文件下载通用方式

export const downloadFile = (params: any, fileName: string = '') => {
  const requestFile = axios.create({
    baseURL,
    timeout: 0, //关闭超时时间
  });

  requestFile.interceptors.request.use((config) => {
    config.headers.Authorization = 'JWT ' + token;
    config.responseType = 'blob';
    start('正在下载，请稍候...')
    return config;
  });

  requestFile.interceptors.response.use(
    (response) => {
      try {
        const res = response.data;
        if (!fileName) {
          fileName = window.decodeURI(response.headers['content-disposition'].split('=')[1]) || '文件导出.xlsx'
        }
        const blob = new Blob([res], {
          type: response.headers['content-type'] //文件下载类型
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName; // 自定义文件名
        close()
        link.click();
        return res
      } catch (error) {
        ElNotification({
          message: '操作失败，请联系管理员',
          type: 'error',
        })
        close()
      }

    },
    (err) => {
      ElNotification({
        message: '操作失败，请联系管理员',
        type: 'error',
      })
      close()
    }
  );
  requestFile(params)
}

