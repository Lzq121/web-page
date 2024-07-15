import { request } from '@/utils/service';
/**
 *
 * @returns 漏洞情报
 */
export default {
	// 漏洞情报信息
	getLoopholeInfoApi: () => {
		return request({
			url: '/api/loophole_news/get_statistical_data/',
			method: 'get'
		});
	},
	// 获取漏洞库列表
	getLoopholesApi: (data: object) => {
		return request({
			url: '/api/loophole_news/get_newsinfo/',
			method: 'get',
			params: data
		});
	},
	// 新增漏洞情报
	addLoopholesApi: (params?: object) => {
		return request({
			url: '/api/loophole_news/get_newsinfo/',
			method: 'post',
			data: params,
		});
	},
	// 情报关联资产
	relevanceAssetsApi: (params?: object) => {
		return request({
			url: '/api/loophole_news/news_case/',
			method: 'post',
			data: params,
		});
	},
};
