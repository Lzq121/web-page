import { request } from '@/utils/service';
/**
 *
 * @returns 漏洞库页面
 */
export default {
	// 获取误报列表
	getLoopholeDetailsApi: (data: object) => {
		return request({
			url: '/api/robot/get_loophole_details/',
			method: 'get',
			params: data,
		});
	},
	// 添加误报数据
	posMisreportApi: (params?: object) => {
		return request({
			url: '/api/robot/create_misreport/',
			method: 'post',
			data: params,
		});
	},
	misreportRemoveApi: (params?: object) => {
		return request({
			url: '/api/robot/misreport_remove/',
			method: 'post',
			data: params,
		});
	},
	statusDetail: (params?: object) => {
		return request({
			url: '/api/robot/status_detail/',
			method: 'post',
			data: params,
		});
	},
	getTreeList: (url: string) => {
		return request({
			url,
			method: 'get',
		});
	},

	// 获取漏洞台账列表
	getLoopholeLedgerApi: (data: object) => {
		return request({
			url: '/api/loophole/ledger/',
			method: 'get',
			params: data,
		});
	},
	// 新增台账
	postLoopholeLedgerApi: (params?: object) => {
		return request({
			url: '/api/loophole/ledger/',
			method: 'post',
			data: params,
		});
	},
	// 新增误洞漏报
	postMisholeApi: (params?: object) => {
		return request({
			url: '/api/robot/addition_misreport/',
			method: 'post',
			data: params,
		});
	},
	//漏洞台账统计
	getLoopholeLibraryStatisticsApi: () => {
		return request({
			url: '/api/loophole/loophole_statistics/',
			method: 'get',
		});
	},
	//漏洞台账统计
	getLoopholeLibraryApi: () => {
		return request({
			url: '/api/loophole/library_statistics/',
			method: 'get',
		});
	},
	//漏洞台账每日新增趋势
	getLoopholeLibraryCountDayApi: () => {
		return request({
			url: '/api/loophole/Library_count_day/',
			method: 'get',
		});
	},
	//漏洞台账详情
	getLoopholeDetailApi: (id: string) => {
		return request({
			url: `/api/loophole/ledger/${id}/`,
			method: 'get',
		});
	},

	// 安全人和应用管理员下拉框
	getAdmintableDictApi: () => {
		return request({
			url: '/api/loophole/admintable_display/',
			method: 'get',
		});
	},

	// 资源类型下拉框
	getResourcetypeDictApi: () => {
		return request({
			url: '/api/loophole/resourcetype_display/',
			method: 'get',
		});
	},

	// 资源类型下拉框
	getClassNameDictApi: () => {
		return request({
			url: '/api/loophole/class_name_display/',
			method: 'get',
		});
	},

	/*********************** 工单部分 *********************************/

	// 获取数据中心
	getAreaInfoApi: () => {
		return request({
			url: '/api/robot/get_area_info/',
			method: 'get',
		});
	},
	// 获取所有创建的工单
	getItsmManageApi: () => {
		return request({
			url: '/api/robot/itsm_manage/',
			method: 'get',
		});
	},
	// 工单流程
	getItsmFlowApi: (id: string) => {
		return request({
			url: `/api/robot/itsm_flow/?loo_id=` + id,
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

	// ## 漏洞跟踪
	getItsmFollowingApi: (id: string) => {
		return request({
			url: `/api/robot/itsm_following/?loo_id=` + id,
			method: 'get',
		});
	},
};
