import { request } from '@/utils/service';
/**
 *
 * @returns 漏洞库页面
 */
export default {
	// 获取漏洞库列表
	getLoopholesApi: () => {
		return request({
			url: '/api/loophole/loopholes/',
			method: 'get',
		});
	},
  // 获取利用途径字典
  getDictApi: () => {
		return request({
			url: '/api/system/dictionary/?dict_name=liyongtujin/',
			method: 'get',
		});
	},

	// 漏洞库总量
	getLoopholeStatisticsApi: () => {
		return request({
			url: '/api/loophole/loophole_statistics/',
			method: 'get',
		});
	},
	// 漏洞每日新增数量
	getLoopholeDayApi: () => {
		return request({
			url: '/api/loophole/loopholecount_per_day/',
			method: 'get',
		});
	},
	// 未评估漏洞列表
	getEvaluateLoopholesApi: (data: object) => {
		return request({
			url: '/api/loophole/evaluate_loopholes/',
			method: 'get',
			params: data,
		});
	},
	// 未评估漏洞新增
	putEvaluateLoopholesApi: (id: string, params?: object) => {
		return request({
			url: `/api/loophole/evaluate_loopholes/${id}/`,
			method: 'put',
			data: params,
		});
	},
	// 新增漏洞库
	postLoopholesApi: (params?: object) => {
		return request({
			url: '/api/loophole/loopholes/',
			method: 'post',
			data: params,
		});
	},
	// 编辑
	editLoopholesApi: (id: string, params?: object) => {
		return request({
			url: `/api/loophole/loopholes/${id}/`,
			method: 'put',
			data: params,
		});
	},
};
