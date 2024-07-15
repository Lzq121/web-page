import { downloadFile, request } from '@/utils/service';
/**
 *
 * @returns 漏洞库页面
 */
export default {
	// 下载
	getAssetsStat:() => {
		return request({
			url: 'api/assets/assets_stat',
			method: 'get',
		});
	},
	
};
