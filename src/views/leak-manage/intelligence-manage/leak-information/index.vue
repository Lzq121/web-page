<template>
	<div>
		<el-row class="top_row" style="background-color: var(--el-fill-color-blank)" >
			<el-col :span="16" style="height: 100%; width: 60%">
				<div style="height: 15vh">
					<div class="home-card-item flex" style="position: relative">
						<div class="flex w100">
							<div class="home-card-item-icon flex" style="background-color: #ecf5ff">
								<i class="flex-margin font32 fa fa-meetup" style="color: #409eff"></i>
							</div>
							<div style="margin-left: 10px">
								<div class="mt10">漏洞情报总量</div>
								<div class="font30">{{ statisticsInfo.news_sum || 0 }} <span style="font-size: 12px">条</span></div>
							</div>
						</div>
						<div class="flex w100">
							<div class="home-card-item-icon flex" style="background-color: #fdf6ec">
								<i class="flex-margin font32 iconfont icon-zaosheng" style="color: #e6a23c"></i>
							</div>
							<div style="margin-left: 10px">
								<div class="mt10">近7日新增</div>
								<div class="font30">{{ statisticsInfo.new_count_in_seven_days || 0 }} <span style="font-size: 12px">条</span></div>
							</div>
						</div>
						<!-- <div style="position: absolute; right: 100px; top:0;">更新日期：2021.12.12 12:12:00</div> -->
					</div>
				</div>
				<div style="height: 45vh">
					<div ref="loopholesNum" style="height: 100%; width: 100%"></div>
				</div>
			</el-col>
			<el-col :span="8" style="height: 100%; width: 40%">
				<el-row class="top_row_col_row">
					<div ref="loopholesRightTop" style="height: 100%; width: 100%"></div>
				</el-row>
				<el-row class="top_row_col_row">
					<div ref="loopholesRightBottom" style="height: 100%; width: 100%"></div>
				</el-row>
			</el-col>
		</el-row>
		<div class="table-container">
			<div class="form-container">
				<div class="form-title">
					<h3>漏洞情报</h3>
					<div class="button-box">
						<el-button link type="primary" icon="Plus" @click="addBtn">新 增</el-button>
						<span>
							<importExcel :apiSuffix="false" api="/api/loophole_news/newsimport/">导入数据</importExcel>
						</span>
						<el-button link type="primary" @click="excelExcel" icon="Download">导出数据</el-button>
						<el-button type="primary" @click="searchFn" icon="Search">搜 索</el-button>
						<el-button type="primary" @click="resetFn" plain icon="RefreshRight">重 置</el-button>
					</div>
				</div>
				<!-- 筛选条件 -->
				<div class="form-params">
					<el-form :inline="true" :model="params">
						<el-form-item label="关键字">
							<el-input v-model="params.loo_name" clearable />
						</el-form-item>
						<el-form-item label="漏洞类型">
							<el-input v-model="params.loo_type" clearable />
						</el-form-item>
						<el-form-item label="严重程度">
							<el-select v-model="params.loo_severity" style="width: 200px">
								<el-option v-for="item in severityList" :key="item.value" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-form>
				</div>
				<!-- table -->
			</div>
			<div class="table-box">
				<table-unit
					:columns="columns"
					:list="tableData"
					:total="total"
					:isSelection="true"
					@handleSelectionChange="handleSelectionChange"
					:pageSize="params.limit"
					:currentPage="params.page"
					@handleSizeChange="handleSizeChange"
					@handleCurrentChange="handleCurrentChange"
				>
					<template v-slot="record">
						<el-button size="small" type="primary" link @click="editRow(record.record)">详情</el-button>
					</template>
				</table-unit>
			</div>
		</div>
		<el-drawer v-model="addDrawer" size="80%" title="新增">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>漏洞情报信息</span>
						<el-button style="margin-left: 20px" size="small" type="primary" @click="addSureBtn">确认提交</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="addForm" label-width="auto" style="max-width: 600px">
							<el-form-item label="漏洞名称">
								<el-input v-model="addForm.name" />
							</el-form-item>
							<el-form-item label="漏洞类型">
								<el-input v-model="addForm.type" />
							</el-form-item>
							<el-form-item label="严重程度">
								<el-input v-model="addForm.severity" />
							</el-form-item>
							<el-form-item label="受影响产品">
								<el-input v-model="addForm.affected_product" />
							</el-form-item>
							<el-form-item label="漏洞描述">
								<el-input v-model="addForm.description" />
							</el-form-item>
							<el-form-item label="CVEID">
								<el-input v-model="addForm.cveid" />
							</el-form-item>
							<el-form-item label="修复建议">
								<el-input v-model="addForm.solution" />
							</el-form-item>
			
							<el-form-item label="更新时间">
								<el-date-picker
									style="width: 100%"
									v-model="addForm.update_time"
									type="datetime"
									placeholder="请选择更新时间"
									value-format="YYYY-MM-DD HH:mm:ss"
								/>
							</el-form-item>
							<el-form-item label="收录时间">
								<el-date-picker
									style="width: 100%"
									v-model="addForm.collection_time"
									type="datetime"
									placeholder="请选择收录时间"
									value-format="YYYY-MM-DD HH:mm:ss"
								/>
							</el-form-item>
							<el-form-item label="收录源">
								<el-input v-model="addForm.source" />
							</el-form-item>
							<el-form-item label="收录方式">
								<el-input v-model="addForm.way" />
							</el-form-item>
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>

		<el-drawer v-model="editDrawer" size="80%" :title="`漏洞情报详情 - ${loopholesDetail.name}`">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>漏洞情报信息</span>
						<el-button style="margin-left: 20px" size="small" type="primary" @click="relevanceAssets">关联资产</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="loopholesDetail" label-width="110" style="max-width: 600px">
							<el-form-item label="漏洞情报ID">
								<span>{{ loopholesDetail.id }}</span>
							</el-form-item>
							<el-form-item label="漏洞情报名称">
								<span>{{ loopholesDetail.name }}</span>
							</el-form-item>
							<el-form-item label="漏洞类型">
								<span>{{ loopholesDetail.type }}</span>
							</el-form-item>
							<el-form-item label="严重程度">
								<span>{{ loopholesDetail.severity }}</span>
							</el-form-item>
							<el-form-item label="漏洞描述">
								<span>{{ loopholesDetail.description }}</span>
							</el-form-item>
							<el-form-item label="修复建议">
								<span>{{ loopholesDetail.solution }}</span>
							</el-form-item>
							<el-form-item label="受影响产品">
								<span>{{ loopholesDetail.affected_product }}</span>
							</el-form-item>
							<el-form-item label="CVEID">
								<span>{{ loopholesDetail.cveid }}</span>
							</el-form-item>
							<el-form-item label="发布时间">
								<span>{{ loopholesDetail.release_time }}</span>
							</el-form-item>
							<el-form-item label="更新时间">
								<span>{{ loopholesDetail.update_time }}</span>
							</el-form-item>
						</el-form>
					</dd>
				</dl>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="padding: 10px 0">
						<span>基础信息</span>
					</dt>
					<dd class="dl-content">
						<el-form :model="loopholesDetail" label-width="110" style="max-width: 600px">
							<el-form-item label="收录时间">
								<span>{{ loopholesDetail.collection_time }}</span>
							</el-form-item>
							<el-form-item label="收录人">
								<span>{{ loopholesDetail.persion }}</span>
							</el-form-item>
							<el-form-item label="收录方式">
								<span>{{ loopholesDetail.way }}</span>
							</el-form-item>
							<el-form-item label="收录来源">
								<el-link :href="loopholesDetail.source" :underline="false" target="_blank" type="primary">{{ loopholesDetail.source }}</el-link>
							</el-form-item>
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>

		<el-drawer v-model="drawerRight" title="资产选择" size="80%">
			<AssetData @selectFun="selectFun" v-if="isLoadAssetDataCon"></AssetData>
			<div style="text-align: right; padding: 30px 30px 0">
				<el-button type="success" style="width: 20%" @click="yesAssets">确认选择资产</el-button>
			</div>
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref } from 'vue';
import * as echarts from 'echarts';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { nextTick } from 'process';
import { downloadFile } from '@/utils/service';
import importExcel from '@/components/importExcel/index.vue';
import AssetData from '@/views/asset-manage/asset-list/components/AssetData.vue';
import apis from './api';
let loopholesNum = ref();
let loopholesRightTop = ref();
let loopholesRightBottom = ref();
const router = useRouter();
type EChartsOption = echarts.EChartsOption;
// import * as api from './api';

let isShow = ref(false);
let dialogVisible = ref(false);
let params = ref({
	limit: 30,
	page: 1,
	loo_name: '',
	loo_type: '',
	loo_severity: '',
});
let columns = [
	{
		title: '漏洞ID',
		dataIndex: 'id',
	},
	{
		title: '漏洞名称',
		dataIndex: 'name',
	},
	{
		title: '漏洞类型',
		dataIndex: 'type',
	},
	{
		title: '受影响产品',
		dataIndex: 'affected_product',
	},
	{
		title: '严重程度',
		dataIndex: 'severity',
	},
	{
		title: 'CVEID',
		dataIndex: 'cveid',
	},
	{
		title: '修复建议',
		dataIndex: 'solution',
	},
	{
		title: '发布时间',
		dataIndex: 'release_time',
	},
	{
		title: '获取情报时间',
		dataIndex: 'collection_time',
	},

	{
		title: '操作',
		dataIndex: 'operate',
		width: 120,
	},
];
let total = ref(0);
let severityList = ref([
	{ label: '低', value: '低' },
	{ label: '中', value: '中' },
	{ label: '高', value: '高' },
]);
let loopholeTypes = ref([]);
let echartTypeNum: any = ref([]);
let sourceTypeNum: any = ref([]);
let dayXNum: any = ref([]);
let dayYNum: any = ref([]);
let echartsAll = () => {
	var myChart = echarts.init(loopholesNum.value);
	// var option: EChartsOption;
	let option = {
		title: {
			text: '漏洞情报每日信息',
		},
		tooltip: { trigger: 'axis' },
		xAxis: {
			type: 'category',
			data: dayXNum.value,
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: '新增漏洞情报',
				data: dayYNum.value,
				type: 'line',
				smooth: true,
				symbolSize: 6,
				symbol: 'circle',
			},
		],
	};
	option && myChart.setOption(option);
	// 右上
	var myChartRightTop = echarts.init(loopholesRightTop.value);
	let option1 = {
		title: {
			text: '漏洞情报类型占比',
			textStyle: {
				fontSize: '12px',
			},
		},
		tooltip: {
			trigger: 'item',
			formatter(params) {
				return params.name + ' : ' + Number(params.value).toFixed(2) + '%';
			},
		},
		legend: {
			type: 'scroll',
			bottom: '0',
			left: 'center',
		},
		series: [
			{
				name: '',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center',
				},
				labelLine: {
					show: false,
				},
				data: echartTypeNum.value,
			},
		],
	};
	option1 && myChartRightTop.setOption(option1);
	// 右下
	var myChartRightBottom = echarts.init(loopholesRightBottom.value);
	let option2 = {
		title: {
			text: '漏洞获取来源占比',
			textStyle: {
				fontSize: '12px',
			},
		},
		tooltip: {
			trigger: 'item',
			formatter(params) {
				return params.name + ' : ' + Number(params.value).toFixed(2) + '%';
			},
		},
		legend: {
			type: 'scroll',
			bottom: '0',
			left: 'center',
		},
		series: [
			{
				name: '',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center',
				},
				labelLine: {
					show: false,
				},
				data: sourceTypeNum.value,
			},
		],
	};
	option2 && myChartRightBottom.setOption(option2);
};
// nextTick(() => {
// 	echartsAll();
// });

// 漏洞情报总量
const statisticsInfo = ref({});
const getLoopholeInfo = async () => {
	let res = await apis.getLoopholeInfoApi();
	res.data.daily_counts.map((day) => {
		dayYNum.value.push(day.count);
		dayXNum.value.push(day.date);
	});
	statisticsInfo.value = res.data;
	// 漏洞类型数据
	loopholeTypes.value = res.data.type_percentages;
	// 处理环形图数据
	res.data.type_percentages.forEach((item) => {
		item.value = item.percentage;
		item.name = item.type;
	});
	echartTypeNum.value = res.data.type_percentages;

	res.data.source_percentages.forEach((item) => {
		item.value = item.percentage;
		item.name = item.source;
	});
	sourceTypeNum.value = res.data.source_percentages;
	echartsAll();
};
getLoopholeInfo();

const tableData = ref([]);
// 获取漏洞情报列表
const getLoopholesList = async () => {
	let res = await apis.getLoopholesApi(params.value);
	tableData.value = res.data;
	total.value = res.total;
};
getLoopholesList();

let addForm = ref({
	name: '', //  #漏洞名称
	type: '-', // #漏洞类型
	severity: '-', //严重程度
	description: '', //  #漏洞描述
	affected_product: '', //#受影响产品
	cveid: '-',
	solution: '', //#修复建议
	source: '', // #收录源
	way: '', // #收录方式
	release_time: '', //#发布时间
	update_time: '', // #更新时间
	collection_time: '', // #收录时间
});
// 新增
let addDrawer: any = ref(false);
const addBtn = async () => {
	addDrawer.value = true;
};
// 新增请求按钮
const addSureBtn = async () => {
	if (!addForm.value.way) {
		addForm.value.way = '手工录入';
	}
	let res = await apis.addLoopholesApi(addForm.value);
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		getLoopholesList();
		addDrawer.value = false;
	}
};

// 导出
const excelExcel = async () => {
	ElMessageBox.prompt('自定义导出文件名', '提示', {
		confirmButtonText: '确认导出',
		cancelButtonText: '取消',
		inputPlaceholder: '请输入自定义文件名，无输入时使用默认文件名',
	})
		.then(({ value }) => {
			
			delete params.value.limit;
			delete params.value.page;
			const data: any = {
				...params.value,
				id_list: selectList.value.join(','),
			};
			if (value) {
				value = value + '.xlsx';
			} else {
				value = undefined;
			}
			downloadFile({
				url: '/api/loophole_news/newsexport/',
				params: data,
				method: 'get',
				filename: value,
			});
		})
		.catch(() => {});
};

// 搜索
const searchFn = () => {
	params.value.page = 1;
	params.value.limit = 30;
	getLoopholesList();
};

// 重置
const resetFn = () => {
	params.value = {
		limit: 30,
		page: 1,
		loo_name: '',
		loo_type: '',
		loo_severity: '',
	};
	getLoopholesList();
};

// 漏洞情报详情
let editDrawer: any = ref(false);
let loopholesDetail: any = ref({});
const editRow = (val: any) => {
	loopholesDetail.value = val;
	if (!val.acquisition_mode) {
		loopholesDetail.value.way = '手工录入';
	}
	editDrawer.value = true;
};

// 关联资产
let drawerRight = ref(false);
let isLoadAssetDataCon = ref(false);
const relevanceAssets = () => {
	isLoadAssetDataCon.value = true;
	drawerRight.value = true;
	addAllList.value = [];
	idList.value = [];
	addAlllistAfter.value = [];
};

// 多选选择
let ipOrApp = '1';
let addAllList = ref([]);
let idList = ref([]);
let addAlllistAfter = ref([]);
const selectFun = async (val: any) => {
	addAlllistAfter.value = val.data;
	ipOrApp = val.type;
};

// 确认资产选择
const yesAssets = async () => {
	if (addAlllistAfter.value.length === 0) {
		ElMessage.warning('请选择资产');
		return;
	}
	if (ipOrApp == '1') {
		addAllList.value.push(...addAlllistAfter.value);
	} else {
		let idArr = addAlllistAfter.value.map((i: any) => {
			return i.id;
		});
		let { data } = await api.assetsGetBackBusinessList({ b_ids: idArr });
		addAllList.value.push(...data);
	}
	// 去重
	addAllList.value = addAllList.value.reduce((unique: any, item: any) => {
		return unique.some((i) => i.id === item.id) ? unique : [...unique, item];
	}, []);
	addAllList.value.forEach((i: any) => {
		idList.value.push(i.id);
	});
	loopholesDetail.value.new_name = loopholesDetail.value.name;
	loopholesDetail.value.new_type = loopholesDetail.value.type;
	loopholesDetail.value.id_list = idList;
	let res = await apis.relevanceAssetsApi(loopholesDetail.value);
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		getLoopholesList();
		drawerRight.value = false;
		// editDrawer.value = false;
	}
};
let selectList: any = ref([]);
const handleSelectionChange = (val: any) => {
	selectList.value = [];
	val.map((item: any) => {
		selectList.value.push(item.id);
	});
};

const handleSizeChange = (val: number) => {
	console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
	console.log('handleCurrentChange');
};
</script>

<style scoped lang="scss">
.top_row {
	height: 60vh;
	background: #ffffff;
	padding: 10px;
	margin: 10px;

	.top_row_col_row {
		height: 50%;
	}
}

.home-card-item {
	width: 100%;
	height: 130px;
	border-radius: 4px;
	transition: all ease 0.3s;
	padding: 20px;
	overflow: hidden;
	background: var(--el-color-white);
	color: var(--el-text-color-primary);

	&-icon {
		width: 70px;
		height: 70px;
		border-radius: 100%;
		flex-shrink: 1;

		i {
			color: var(--el-text-color-placeholder);
		}
	}

	&-title {
		font-size: 15px;
		font-weight: bold;
		height: 30px;
	}
}
</style>
