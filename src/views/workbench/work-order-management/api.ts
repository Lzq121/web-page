import { request } from '@/utils/service';
/**
 *
 * @returns 工单页面
 */
export default {
	/*********************** 工单部分 *********************************/

	// 获取数据中心
	getAreaInfoApi: () => {
		return request({
			url: '/api/robot/get_area_info/',
			method: 'get',
		});
	},
	// 获取所有创建的工单
	getItsmManageApi: (data: object) => {
		return request({
			url: '/api/robot/itsm_manage/',
			method: 'get',
			params: data,
		});
	},
	// 工单流程
	getItsmFlowApi: () => {
		return request({
			url: '/api/robot/itsm_flow/',
			method: 'get',
		});
	},
	// 工单进度
	getItsmScheduleApi: () => {
		return request({
			url: '/api/robot/itsm_schedule/',
			method: 'get',
		});
	},
	// 工单创建
	createItsmApi: (params?: object) => {
		return request({
			url: '/api/robot/creat_itsm/',
			method: 'post',
			data: params,
		});
	},
};
