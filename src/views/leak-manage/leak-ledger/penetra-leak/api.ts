import { downloadFile, request } from '@/utils/service';
/**
 *
 * @returns 漏洞库页面
 */
export default {
	// 下载
	downloadHostFile: (data: object, filename: string) => {
		return downloadFile({
			url: 'api/loophole/penetration_export/',
			method: 'get',
			params: data,
			filename,
		});
	},
	getLoopholeCount: () => {
		return request({
			url: 'api/loophole/penetration_loophole_count/',
			method: 'get',
		});
	},
	penetrationSourceDict: () => {
		return request({
			url: 'api/loophole/penetration_source/',
			method: 'get',
		});
	},
	companyDictApi: () => {
		return request({
			url: 'api/loophole/penetration_company/',
			method: 'get',
		});
	},
	getTreeList: (url: string) => {
		return request({
			url,
			method: 'get',
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

	// 获取列表
	getTableListApi: (data: object) => {
		return request({
			url: '/api/loophole/loophole_penetra/',
			method: 'get',
			params: data,
		});
	},
	// 新增台账
	postLoopholeLedgerApi: (params?: object) => {
		return request({
			url: '/api/loophole/loophole_penetra/',
			method: 'post',
			data: params,
		});
	},

	//漏洞台账详情
	getLoopholeDetailApi: (id: string) => {
		return request({
			url: `/api/loophole/loophole_penetra/${id}/`,
			method: 'get',
		});
	},
	// 修改
	penetraPutIDApi: (id: string, params?: object) => {
		return request({
			url: `/api/loophole/loophole_penetra/${id}/`,
			method: 'put',
			data: params,
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
};
