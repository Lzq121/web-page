<script lang="ts" setup>
import { toRefs, reactive, onMounted, ref, watch, nextTick, onActivated } from 'vue';
import treeUnit from '@/components/tree-unit/index.vue';
import importExcel from '@/components/importExcel/index.vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';
import apis from './api';
import { message } from '@/utils/message';
import { downloadFile } from '@/utils/service';
let global: any = {
	homeChartOne: null,
	homeChartTwo: null,
	homeCharThree: null,
	dispose: [null, '', undefined],
};
const router = useRouter();
const route = useRoute();
// const homeLineRef = ref();
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const state = ref({
	myCharts: [],
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
});

let dayXData = ref([]);
let dayYData = ref([]);
// 折线图
// const initLineChart = () => {
// 	if (!global.dispose.some((b: any) => b === global.homeChartOne)) global.homeChartOne.dispose();
// 	global.homeChartOne = <any>echarts.init(homeLineRef.value, state.value.charts.theme);
// 	const option = {
// 		backgroundColor: state.value.charts.bgColor,
// 		title: {
// 			text: '每日新增漏洞数量趋势',
// 			x: 'left',
// 			textStyle: { fontSize: '15', color: state.value.charts.color },
// 		},
// 		grid: { top: 70, right: 20, bottom: 30, left: 30 },
// 		tooltip: { trigger: 'axis' },
// 		legend: { data: ['预购队列', '最新成交价'], right: 0 },
// 		xAxis: {
// 			data: dayXData.value,
// 		},
// 		yAxis: [
// 			{
// 				type: 'value',
// 				splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
// 			},
// 		],
// 		series: [
// 			{
// 				name: '新增漏洞数量',
// 				type: 'line',
// 				symbolSize: 6,
// 				symbol: 'circle',
// 				smooth: true,
// 				data: dayYData.value,
// 			},
// 		],
// 	};
// 	(<any>global.homeChartOne).setOption(option);
// 	(<any>state.value.myCharts).push(global.homeChartOne);
// };

// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < state.value.myCharts.length; i++) {
			setTimeout(() => {
				(<any>state.value.myCharts[i]).resize();
			}, i * 1000);
		}
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时
onMounted(() => {
	initEchartsResize();
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
	initEchartsResizeFun();
});
// 监听 vuex 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
	() => isTagsViewCurrenFull.value,
	() => {
		initEchartsResizeFun();
	}
);
// 监听 vuex 中是否开启深色主题
// watch(
// 	() => themeConfig.value.isIsDark,
// 	(isIsDark) => {
// 		nextTick(() => {
// 			state.value.charts.theme = isIsDark ? 'dark' : '';
// 			state.value.charts.bgColor = isIsDark ? 'transparent' : '';
// 			state.value.charts.color = isIsDark ? '#dadada' : '#303133';
// 			setTimeout(() => {
// 				initLineChart();
// 			}, 500);
// 		});
// 	},
// 	{
// 		deep: true,
// 		immediate: true,
// 	}
// );
let params: any = ref({
	page: 1,
	limit: 30,
	name: '', //漏洞名称
	type: 'web漏洞', //漏洞类型
	small_type: '', // 漏洞子类型
	level: '', //漏洞等级
	severity: '', //严重性
	affected_product: '', //受影响产品
	assess_status: '', //处置状态
	cveld: '', //cveld
	utilization_way: '', //利用途径
	create_start_time: '', //收录时间
	create_end_time: '', //	收录时间
	data_source: '', //数据来源
	acquisition_mode: '', //获取方式
	vendor: '', //厂商
	ip: '', //ip
	biz_display: '', //所属系统
	class_name_display: '', //资产大类
	resource_type_display: '', //资产类别
	app_admin_display: '', //应用管理员
	safe_person_display: '', //安全管理员
	data_center: '', //数据中心
	network_area: '', //部署区域
	company: '', //所属公司
	disposer: '',
	information_type: '',
});
let ipOrApp = ref('1');
let isLoading = ref(true);
const onClickTree = async (data: any) => {
	params.value.company = undefined;
	params.value.data_center = data.data1;
	params.value.network_area = data.data2;
	fetchTableData();
};
const ipOrAppChange = () => {
	// params.value.filter_type = ipOrApp.value;
	// params.value.name = '';
	// params.value.ip = '';
	// params.value.dept = '';
	// params.value.network_area = '';
	// params.value.data_center = '';
	// total.value = 0;
	// list.value = [];
	// fetchTableData();
	// getTreeList();
};
const hidden = true;
const columns = [
	{
		title: '归属系统',
		dataIndex: 'biz_display',
	},
	{
		title: '系统所属单位',
		dataIndex: 'company',
	},
	// {
	// 	title: '受影响主机',
	// 	dataIndex: 'ip',
	// },
	{
		title: '受影响站点',
		dataIndex: 'site',
	},
	{
		title: '受影响URL',
		dataIndex: 'url',
	},

	{
		title: '漏洞名称',
		dataIndex: 'name',
	},
	{
		title: '漏洞描述',
		dataIndex: 'description',
		hidden,
	},
	{
		title: '漏洞类型',
		dataIndex: 'type',
		hidden,
	},

	{
		title: '严重程度',
		dataIndex: 'severity',
	},
	{
		title: 'CVEID',
		dataIndex: 'cveld',
	},

	{
		title: '修复建议',
		dataIndex: 'repair_suggestion',
		hidden,
	},

	{
		title: '发现日期',
		dataIndex: 'discovery_time',
		hidden,
	},
	{
		title: '扫描类型',
		dataIndex: 'information_type',
	},
	// {
	// 	title: '漏洞风险级别',
	// 	dataIndex: '9',
	// 	hidden,
	// },

	{
		title: '修复时限',
		dataIndex: 'processing_limit',
		hidden,
	},

	{
		title: '应用负责人',
		dataIndex: 'app_admin_display',
		hidden,
	},

	// {
	// 	title: '漏洞整改负责人',
	// 	dataIndex: '13',
	// 	hidden,
	// },

	// {
	// 	title: '整改负责人归属单位',
	// 	dataIndex: 'data_center',
	// },
	{
		title: '最近扫描时间',
		dataIndex: '16',
		hidden,
	},
	{
		title: '漏洞状态',
		dataIndex: 'assess_status',
	},
	// {
	// 	title: '是否超时',
	// 	dataIndex: '18',
	// 	hidden,
	// },
	// {
	// 	title: '扫描实施人员',
	// 	dataIndex: '19',
	// 	hidden,
	// },
	{
		title: '数据中心',
		dataIndex: 'data_center',
		hidden,
	},

	{
		title: '操作',
		dataIndex: 'operate',
		width: 100,
		fixed: 'right',
	},
];
const tableData = ref([
	{ company: '人保集团', site_count: 53, high_severity_counts: 10, medium_severity_counts: 63, low_severity_counts: 0 },
	{ company: '人保集团', site_count: 53, high_severity_counts: 10, medium_severity_counts: 63, low_severity_counts: 0 },
	{ company: '人保集团', site_count: 53, high_severity_counts: 10, medium_severity_counts: 63, low_severity_counts: 0 },
	{ company: '总计', site_count: 295, high_severity_counts: 87, medium_severity_counts: 368, low_severity_counts: 2 },
]);
const hightLeak = () => {
	router.push({
		path: '/leak-manage/leak-ledger/app-leak/page/web-detail',
		query: { hightLeak: 2 },
	});
};
let list = ref([]);
let total = ref(0);

let drawerMisOpen = ref(false);
// 添加到误报库
const addMisinformationBtn = async () => {
	drawerMisOpen.value = true;
};
let misForm = ref({
	desc: '',
});
// 添加到误报库
const sureAddMis = async () => {
	let res = await apis.posMisreportApi({
		id_list: idList.value,
		desc: misForm.value.desc,
	});
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		drawerMisOpen.value = false;
		drawerOpen.value = false;
		misForm.value.desc = '';
		idList.value = [];
		fetchTableData();
	}
};

// 提交新增
let isAdd = ref(false);
let addDrawer = ref(false);
let addForm: any = ref({
	url: '', // #url
	ip: '',
	// biz_id: '', // #业务系统id
	class_name_id: '', //#设备类型id
	resource_type_id: '', // #资源类型id
	app_admin_id: '', // #应用管理员id
	safe_person_id: '', // #安全接口人id
	name: '', //#漏洞名称
	type: 'web漏洞', //  #漏洞类型
	level: '-', //  #等级
	affected_product: '', //  #受影响的产品
	// cveld: '',
	severity: '-', // #严重性
	description: '', //  #漏洞描述
	utilization_way: '-', //  #利用途径
	processing_limit: '-', // #处理时限
	// discovery_time: '', // #首次发现时间
	repair_suggestion: '', //#修复建议
	other_information: '-', //  #其他信息
	// update_time: null, // #更新时间
	data_source: '', //  #数据来源
	acquisition_mode: '', //  #获取方式
	vendor: '', //#厂商(手动录入：01，
	//	 绿盟：02，启明：03，长亭：														04)
	// assess_status: '-', //  #处置状态

	port: null,
	site: '-', // #站点
	company: '', //#所属公司
	data_center: '', //  #数据中心
	reviewer: '-', //   #审核人
	network_area: '', //  #部署区域
});
let vendorDict: any = ref([
	{
		id: '01',
		name: '绿盟',
	},
	{
		id: '02',
		name: '启明',
	},
	{
		id: '03',
		name: '长亭',
	},
]);
const addLedgerBtn = async () => {
	isAdd.value = true;
	addForm.value = {
		url: '', // #url
		ip: '',
		// biz_id:'', // #业务系统id
		class_name_id: '-', //#设备类型id
		resource_type_id: '', // #资源类型id
		app_admin_id: '', // #应用管理员id
		safe_person_id: '', // #安全接口人id
		name: '-', //#漏洞名称
		type: 'web漏洞', //  #漏洞类型
		level: '-', //  #等级
		affected_product: '-', //  #受影响的产品
		// cveld: '',
		severity: '-', // #严重性
		description: '-', //  #漏洞描述
		utilization_way: '-', //  #利用途径
		processing_limit: '-', // #处理时限
		// discovery_time: '-', // #首次发现时间
		repair_suggestion: '-', //#修复建议
		other_information: '-', //  #其他信息
		// update_time: null, // #更新时间
		data_source: '-', //  #数据来源
		acquisition_mode: '-', //  #获取方式
		vendor: '-', //#厂商(手动录入：01，
		//	 绿盟：02，启明：03，长亭：														04)
		// assess_status: '', //  #处置状态

		port: null,
		site: '-', // #站点
		company: '-', //#所属公司
		data_center: '-', //  #数据中心
		reviewer: '-', //   #审核人
		network_area: '-', //  #部署区域
	};
	addDrawer.value = true;
	// let res = await apis.postLoopholeLedgerApi();
};
let startAndendTime = ref([]);
const fetchTableData = async () => {
	params.value.create_start_time = startAndendTime.value[0];
	params.value.create_end_time = startAndendTime.value[1];
	let res = await apis.getLoopholeLedgerApi(params.value);
	list.value = res.data;
	total.value = res.total;
};
fetchTableData();

// 漏洞台账统计
let homeOne: any = ref([]);
const getLibraryStatistics = async () => {
	let res = await apis.getLoopholeLibraryApi({ type: 'web漏洞' });
	homeOne.value = [
		{
			num1: res.data.found_num,
			// num2: res.data.new,
			num3: '新发现漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			width: 3,
		},
		{
			num1: res.data.evaluated_num,
			num3: '已评估漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			width: 3,
		},
		{
			num1: res.data.notified_num,
			num3: '已通知漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			width: 3,
		},
		{
			num1: res.data.claimed_num,
			num3: '已认领漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			width: 3,
		},
		{
			num1: res.data.verify_num,
			num3: '待验证漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			width: 3,
		},
		{
			num1: res.data.verify_faild_num,
			num3: '验证不通过',
			num4: 'iconfont icon-zaosheng',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			width: 3,
		},
		{
			num1: res.data.fixed_num,
			num3: '已修复漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			width: 3,
		},
		{
			num1: res.data.expired_num,
			num3: '已超期漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			width: 3,
		},
	];
};
getLibraryStatistics();
// 漏洞台账统计

// const getLibraryCountDay = async () => {
// 	let res = await apis.getLoopholeLibraryCountDayApi();
// 	res.data.map((day) => {
// 		dayYData.value.push(day.count);
// 		dayXData.value.push(day.date);
// 	});
// 	initLineChart();
// };
// getLibraryCountDay();

// 安全人和应用管理员下拉框
let admintableDict = ref();
const getAdmintableDict = async () => {
	let res = await apis.getAdmintableDictApi();
	admintableDict.value = res.data;
};
getAdmintableDict();

// 资源类型下拉框
let resourcetypeDict = ref();
const getResourcetypeDict = async () => {
	let res = await apis.getResourcetypeDictApi();
	resourcetypeDict.value = res.data;
};
getResourcetypeDict();
// 资源类型下拉框
let classNameDict = ref();
const getClassNameDict = async () => {
	let res = await apis.getClassNameDictApi();
	classNameDict.value = res.data;
};
getClassNameDict();

// 获取数据中心
let areaDict = ref();
const getAreaInfo = async () => {
	let res = await apis.getAreaInfoApi();
	areaDict.value = res.data;
};
getAreaInfo();
let isSelect: any = ref();
const topSearch = (val: number) => {
	isSelect.value = val;
	switch (val) {
		case 0:
			params.value.assess_status = '发现';
			break;
		case 1:
			params.value.assess_status = '已评估';
			break;
		case 2:
			params.value.assess_status = '已通知';
			break;
		case 3:
			params.value.assess_status = '已认领';
			break;
		case 4:
			params.value.assess_status = '待验证';
			break;
		case 5:
			params.value.assess_status = '验证不通过';
			break;
		case 6:
			params.value.assess_status = '已修复';
			break;
		case 7:
			params.value.assess_status = '已超期';
			break;
		default:
			break;
	}
	fetchTableData();
};

const handleSizeChange = (val: number) => {
	params.value.page = 1;
	params.value.limit = val;
	fetchTableData();
};
const handleCurrentChange = (val: number) => {
	params.value.page = val;
	fetchTableData();
};
const onSearch = () => {
	params.value.page = 1;
	fetchTableData();
};
const reSearch = () => {
	params.value = {
		page: 1,
		limit: 30,
		name: '', //漏洞名称
		type: 'web漏洞', //漏洞类型
		small_type: '', // 漏洞子类型
		level: '', //漏洞等级
		severity: '', //严重性
		affected_product: '', //受影响产品
		assess_status: '', //处置状态
		cveld: '', //cveld
		utilization_way: '', //利用途径
		create_start_time: '', //收录时间
		create_end_time: '', //	收录时间
		data_source: '', //数据来源
		acquisition_mode: '', //获取方式
		vendor: '', //厂商
		ip: '', //ip
		biz_display: '', //所属系统
		class_name_display: '', //资产大类
		resource_type_display: '', //资产类别
		app_admin_display: '', //应用管理员
		safe_person_display: '', //安全管理员
		data_center: '', //数据中心
		network_area: '', //部署区域
		company: '', //所属公司
		disposer: '',
		information_type: '',
	};
	fetchTableData();
};
let drawerOpen = ref(false);

// 工单流程
let itsmFlowList: any = ref([]);
// 漏洞跟踪
let itsmFollowingList: any = ref([]);
let ledgerDetail: any = ref({});
let idList: any = ref([]);
const viewRow = async (val: any) => {
	isAdd.value = false;
	let res1 = await apis.getLoopholeDetailApi(val.id);
	idList.value.push(val.loophole_id);
	ledgerDetail.value = res1.data;
	let res2 = await apis.getItsmFollowingApi(val.loophole_id);
	itsmFollowingList.value = res2.data;
	let res3 = await apis.getItsmFlowApi(val.loophole_id);
	itsmFlowList.value = res3.data;
	drawerOpen.value = true;
};
const buttonRef = ref();
const tooltipRef = ref();
let showSchedule = ref(false);
// 点击鼠标后请求获取工单流程接口
const showContent = async (val: any, e: any) => {
	buttonRef.value = e.currentTarget;
	showSchedule.value = false;
	if (val.node == '派发工单') {
		let res = await apis.getScheduleListApi(val.istm_num);
		scheduleData.value.arr = res.data;
		res.data.length > 0 ? (showSchedule.value = true) : (showSchedule.value = false);
	}
};
const notContent = async (val: any) => {
	scheduleData.value.arr = [];
	showSchedule.value = false;
};

let scheduleData = ref({
	arr: [],
	active: 100,
});

// 新增请求按钮
const addSureBtn = async () => {
	let res = await apis.postLoopholeLedgerApi(addForm.value);
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		fetchTableData();
		addDrawer.value = false;
	}
};

let selectList: any = ref([]);
const handleSelectionChange = (val: any) => {
	selectList.value = [];
	val.map((item: any) => {
		selectList.value.push(item.loophole_id);
	});
};

const toRobat = () => {
	if (selectList.value.length) {
		router.push({
			path: '/leak-manage/leak-ledger/host-leak/distribution-order',
			query: { selectList: JSON.stringify(selectList.value) },
		});
	} else {
		ElMessage.error('请选择漏洞');
	}
};

let treeData = ref([]);
const getTreeList = () => {
	treeData.value = [];
	const url = '/api/loophole/tree_list';
	apis.getTreeList(url).then((res: any) => {
		if (res.code == 2000) {
			treeData.value = res.data;
		}
	});
};
getTreeList();

const excelOutExcel = async () => {
	ElMessageBox.prompt('自定义导出文件名', '提示', {
		confirmButtonText: '确认导出',
		cancelButtonText: '取消',
		inputPlaceholder: '请输入自定义文件名，无输入时使用默认文件名',
	})
		.then(({ value }) => {
			const data: any = {
				...params.value,
				
			};
			delete data.limit;
			delete data.page;
			if (value) {
				value = value + '.xlsx';
			} else {
				value = undefined;
			}
			apis.downloadHostFile(data, value);
		})
		.catch(() => {});
};

let isShowMoreSearch = ref(false);
</script>

<template>
	<div class="host-layout-layout">
		<div style="margin: 0px -10px">
			<div class="form-container" v-if="false">
				<div class="form-title">
					<h3>WEB扫描</h3>
					<div class="button-box">
						<el-button link type="primary" icon="Plus" @click="addLedgerBtn">新 增</el-button>
						<!-- <el-button link type="primary" icon="Upload">导入数据</el-button> -->
						<importExcel api="/api/loophole/web_import/" :apiSuffix="false">导入数据</importExcel>
						<el-button link type="primary" @click="excelOutExcel" icon="Download">导出数据</el-button>
						<!-- <el-button link @click="downloadBtn" type="primary" icon="Download">下载模板</el-button> -->
						<el-button link type="primary" icon="Position" @click="toRobat">派发工单</el-button>
						<el-button type="primary" @click="onSearch" icon="Search">搜 索</el-button>
						<el-button type="primary" @click="reSearch" plain icon="RefreshRight">重 置</el-button>
					</div>
				</div>
				<div class="form-params" :class="{ openParams: isShowMoreSearch }">
					<div class="more-filter-btn">
						<el-button link type="primary" @click="isShowMoreSearch = !isShowMoreSearch" :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
							{{ isShowMoreSearch ? '收起' : '展开' }}
						</el-button>
					</div>
					<el-form :inline="true" :model="params" label-width="100px" label-suffix="：">
						<el-form-item label="站点">
							<el-input v-model="params.site" clearable />
						</el-form-item>
						<el-form-item label="url">
							<el-input v-model="params.url" clearable />
						</el-form-item>

						<el-form-item label="归属系统">
							<el-input v-model="params.biz_display" clearable />
						</el-form-item>
						<el-form-item label="漏洞名称">
							<el-input v-model="params.name" clearable />
						</el-form-item>
						<el-form-item label="处置负责人">
							<el-input v-model="params.disposer" clearable />
						</el-form-item>

						<el-form-item label="扫描类型">
							<el-select v-model="params.information_type">
								<el-option label="原理扫描" value="原理扫描" />
								<el-option label="版本扫描" value="版本扫描" />
							</el-select>
						</el-form-item>
						<el-form-item label="部署区域">
							<el-input v-model="params.network_area" clearable />
						</el-form-item>
						<el-form-item label="漏洞状态">
							<el-select v-model="params.assess_status">
								<el-option label="新发现" value="发现" />
								<el-option label="已评估" value="已评估" />
								<el-option label="已通知" value="已通知" />
								<el-option label="已认领" value="已认领" />
								<el-option label="待验证" value="待验证" />
								<el-option label="验证不通过" value="验证不通过" />
								<el-option label="已修复" value="已修复" />
								<el-option label="已超时" value="已超期" />
							</el-select>
						</el-form-item>
						<el-form-item label="CVEID">
							<el-input v-model="params.cveid" clearable />
						</el-form-item>
						<el-form-item label="所属单位">
							<el-input v-model="params.company" clearable />
						</el-form-item>
						<el-form-item label="受影响产品">
							<el-input v-model="params.affected_product" clearable />
						</el-form-item>
						<el-form-item label="等级">
							<el-input v-model="params.level" clearable />
						</el-form-item>

						<el-form-item label="漏洞途径">
							<el-input v-model="params.utilization_way" clearable />
						</el-form-item>
						<el-form-item label="漏洞来源" multiple collapse-tags>
							<el-input v-model="params.data_source" clearable />
						</el-form-item>
						<el-form-item label="厂商">
							<el-select v-model="params.vendor" placeholder="-">
								<el-option v-for="item in vendorDict" :key="item.id" :label="item.name" :value="item.id" />
							</el-select>
						</el-form-item>
						<el-form-item label="时间">
							<el-date-picker
								v-model="startAndendTime"
								type="datetimerange"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								format="YYYY-MM-DD HH:mm:ss"
								date-format="YYYY/MM/DD HH:mm:ss"
								time-format="HH:mm:ss"
								value-format="YYYY-MM-DD HH:mm:ss"
							/>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="table-container" style="margin: 10px">
				<el-table :data="tableData" :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
					<el-table-column prop="date" label="主业公司" width="150" />
					<el-table-column label="互联网资产">
						<el-table-column label="资产底数（应用数量）" width="120">
							<template #default="scope">
								<el-button link type="primary" @click="hightLeak">10</el-button>
							</template>
						</el-table-column>

						<el-table-column label="高中危漏洞（个）" width="120"
							><template #default="scope">
								<el-button link type="primary" @click="hightLeak">10</el-button>
							</template></el-table-column
						>

						<el-table-column prop="address" label="高危端口（个）">
							<template #default="scope">
								<el-button link type="primary" @click="hightLeak">10</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="zip" label="弱口令（个）" width="120"
							><template #default="scope">
								<el-button link type="primary" @click="hightLeak">10</el-button>
							</template></el-table-column
						> </el-table-column
					><el-table-column label="内网资产">
						<el-table-column prop="state" label="资产底数（IP）" width="120">
							<template #default="scope">
								<el-button link type="primary" @click="hightLeak">10</el-button>
							</template>
						</el-table-column>
						<el-table-column prop="city" label="高中危漏洞（web）" width="120"
							><template #default="scope">
								<el-button link type="primary" @click="hightLeak">10</el-button>
							</template></el-table-column
						>
						<el-table-column prop="address" label="高危端口（DMZ）"
							><template #default="scope">
								<el-button link type="primary" @click="hightLeak">10</el-button>
							</template></el-table-column
						>
						<el-table-column prop="city" label="高中危漏洞（其他）" width="120"
							><template #default="scope">
								<el-button link type="primary" @click="hightLeak">10</el-button>
							</template></el-table-column
						>
						<el-table-column prop="zip" label="弱口令（个）" width="120"
							><template #default="scope">
								<el-button link type="primary" @click="hightLeak">10</el-button>
							</template></el-table-column
						>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-drawer v-model="drawerOpen" size="80%" :title="ledgerDetail.name">
			<div>
				<dl class="dl-container">
					<dt class="dl-title blue-triangle">
						漏洞信息
						<el-button style="position: absolute; right: 20px" type="danger" @click="addMisinformationBtn">添加到误报库</el-button>
					</dt>
					<dd class="dl-content">
						<table class="m_table_no_border">
							<tr>
								<td>漏洞ID</td>
								<td>{{ ledgerDetail.id }}</td>
							</tr>
							<tr>
								<td>漏洞名称</td>
								<td>{{ ledgerDetail.name }}</td>
							</tr>
							<tr>
								<td>漏洞类型</td>
								<td>{{ ledgerDetail.type }}</td>
							</tr>
							<tr>
								<td>漏洞等级</td>
								<td>{{ ledgerDetail.level }}</td>
							</tr>
							<tr>
								<td>受影响产品</td>
								<td>{{ ledgerDetail.affected_product }}</td>
							</tr>
							<tr>
								<td>严重程度</td>
								<td>{{ ledgerDetail.severity }}</td>
							</tr>
							<tr>
								<td>漏洞描述</td>
								<td>{{ ledgerDetail.description }}</td>
							</tr>
							<tr>
								<td>利用途径</td>
								<td>{{ ledgerDetail.utilization_way }}</td>
							</tr>
							<tr>
								<td>处理时限</td>
								<td>{{ ledgerDetail.processing_limit }}</td>
							</tr>
							<tr>
								<td>CVE-ID</td>
								<td>{{ ledgerDetail.cveld }}</td>
							</tr>
							<tr>
								<td>首次发现时间</td>
								<td>{{ ledgerDetail.discovery_time }}</td>
							</tr>
							<tr>
								<td>修复建议</td>
								<td>{{ ledgerDetail.repair_suggestion }}</td>
							</tr>
							<tr>
								<td>厂商补丁</td>
								<td>
									{{ ledgerDetail.vendor_display }}
								</td>
							</tr>
							<tr>
								<td>其它信息</td>
								<td>{{ ledgerDetail.other_information }}</td>
							</tr>
							<tr>
								<td>收录时间</td>
								<td>{{ ledgerDetail.collection_time }}</td>
							</tr>
							<tr>
								<td>最近更新时间</td>
								<td>{{ ledgerDetail.update_time }}</td>
							</tr>
							<tr>
								<td>漏洞扫描类型</td>
								<td>{{ ledgerDetail.information_type }}</td>
							</tr>
							<tr>
								<td>数据来源</td>
								<td>
									{{ ledgerDetail.data_source }}
								</td>
							</tr>
							<tr>
								<td>获取方式</td>
								<td>{{ ledgerDetail.acquisition_mode }}</td>
							</tr>
							<tr>
								<td>厂商和版本</td>
								<td>{{ ledgerDetail.vendor_display }}</td>
							</tr>
						</table>
					</dd>
				</dl>
				<dl class="dl-container">
					<dt class="dl-title blue-triangle">标签信息</dt>
					<dd class="dl-content">
						<table class="m_table_no_border">
							<tr>
								<td>{{ ledgerDetail.assess_status }}</td>
							</tr>
						</table>
					</dd>
				</dl>
				<dl class="dl-container">
					<dt class="dl-title blue-triangle">受影响资产信息</dt>
					<dd class="dl-content">
						<table class="m_table_no_border">
							<tr>
								<td>站点</td>
								<td>{{ ledgerDetail.site }}</td>
								<td>URL</td>
								<td>{{ ledgerDetail.url }}</td>
							</tr>
							<tr>
								<td>系统名称</td>
								<td>{{ ledgerDetail.biz_display }}</td>
								<td>资产类别</td>
								<td>{{ ledgerDetail.resource_type_display }}</td>
							</tr>
							<tr>
								<td>资产大类</td>
								<td>{{ ledgerDetail.class_display }}</td>
								<td>所属公司（应用）</td>
								<td>{{ ledgerDetail.company }}</td>
							</tr>

							<tr>
								<td>应用管理员</td>
								<td>{{ ledgerDetail.app_admin_display }}</td>
								<td>安全接口人</td>
								<td>{{ ledgerDetail.safe_person_display }}</td>
							</tr>
							<tr>
								<td>处置负责人</td>
								<td>{{ ledgerDetail.disposer }}</td>
								<td>处置人处室</td>
								<td>{{ ledgerDetail.disposer_room }}</td>
							</tr>

							<tr>
								<td>部署区域</td>
								<td>{{ ledgerDetail.network_area }}</td>
								<td>数据中心</td>
								<td>{{ ledgerDetail.data_center }}</td>
							</tr>
						</table>
					</dd>
				</dl>
				<dl class="dl-container" v-if="itsmFlowList.length">
					<dt class="dl-title blue-triangle">工单流程</dt>
					<dd class="dl-content">
						<table class="m_table" style="text-align: center">
							<tr>
								<td>节点名称</td>
								<!-- <td>节点状态</td> -->
								<td>处置人</td>
								<td>处置时间</td>
							</tr>
							<tr v-for="(item, index) in itsmFlowList" :key="index">
								<td>{{ item.node }}</td>
								<!-- <td>{{ item.status }}</td> -->
								<td>{{ item.persion }}</td>
								<td>{{ item.handle_time }}</td>
							</tr>
						</table>
					</dd>
				</dl>
				<dl class="dl-container" v-if="itsmFollowingList.length">
					<dt class="dl-title blue-triangle">漏洞跟踪</dt>
					<dd class="dl-content">
						<el-timeline>
							<el-timeline-item v-for="(activity, index) in itsmFollowingList" :key="index" :timestamp="activity.handle_time">
								<template #default>
									<p>{{ activity.node }}</p>
									<el-button v-if="activity.istm_num != '-'" @mousedown="showContent(activity, $event)" @mouseout="notContent(activity, $event)">{{
										activity.istm_num
									}}</el-button>

									<el-tooltip ref="tooltipRef" :visible="showSchedule" :virtual-ref="buttonRef" virtual-triggering>
										<template #content>
											<div style="padding: 30px 20px">
												<el-steps :active="scheduleData.active" align-center>
													<el-step :key="index" v-for="(item, index) in scheduleData.arr" :title="item.node">
														<template #description>
															{{ item.status }}
															<p>
																{{ item.handle_time }}
															</p>
														</template>
													</el-step>
												</el-steps>
											</div>
										</template>
									</el-tooltip>
								</template>
							</el-timeline-item>
						</el-timeline>
					</dd>
				</dl>
			</div>
		</el-drawer>
		<el-drawer v-model="addDrawer" size="80%" title="新增">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>漏洞信息</span>
						<el-button style="margin-left: 20px" size="small" type="primary" @click="addSureBtn">确认提交</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="addForm" label-width="auto" style="max-width: 600px">
							<el-form-item label="漏洞名称">
								<el-input v-model="addForm.name" />
							</el-form-item>
							<!-- <el-form-item label="漏洞类型">
								<el-input v-model="addForm.type" />
							</el-form-item> -->
							<el-form-item label="漏洞等级">
								<el-input v-model="addForm.level" />
							</el-form-item>
							<el-form-item label="严重程度">
								<el-input v-model="addForm.severity" />
							</el-form-item>
							<el-form-item label="漏洞描述">
								<el-input v-model="addForm.description" />
							</el-form-item>
							<el-form-item label="利用途径">
								<el-input v-model="addForm.utilization_way" />
							</el-form-item>
							<el-form-item label="处理时限">
								<el-input v-model="addForm.processing_limit" />
							</el-form-item>
							<!-- <el-form-item label="首次发现时间">
								<el-input v-model="addForm.discovery_time" />
							</el-form-item> -->
							<el-form-item label="修复建议">
								<el-input v-model="addForm.repair_suggestion" />
							</el-form-item>
							<el-form-item label="其他信息">
								<el-input v-model="addForm.other_information" />
							</el-form-item>
							<!-- <el-form-item label="收录时间">
								<el-input v-model="addForm.collection_time" />
							</el-form-item> -->
							<!-- <el-form-item label="漏洞扫描类型">
								<el-input v-model="addForm.collection_time" />
							</el-form-item> -->
							<el-form-item label="数据来源">
								<el-input v-model="addForm.data_source" />
							</el-form-item>
							<el-form-item label="获取方式">
								<el-input v-model="addForm.acquisition_mode" />
							</el-form-item>
							<el-form-item label="厂商和版本">
								<el-select v-model="addForm.vendor" placeholder="-">
									<el-option v-for="item in vendorDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>

							<!-- <el-form-item label="受影响产品">
								<el-input v-model="addForm.affected_product" />
							</el-form-item>
							<el-form-item label="CVEID">
								<el-input v-model="addForm.cveld" />
							</el-form-item> -->
						</el-form>
					</dd>
				</dl>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>受影响资产信息</span>
					</dt>
					<dd class="dl-content">
						<el-form :model="addForm" label-width="auto" style="max-width: 600px">
							<el-form-item label="IP">
								<el-input v-model="addForm.ip" />
							</el-form-item>
							<el-form-item label="端口">
								<el-input v-model="addForm.port" />
							</el-form-item>
							<!-- <el-form-item label="系统名称">
								<el-input v-model="addForm.level" />
							</el-form-item> -->
							<el-form-item label="资产类型">
								<el-select v-model="addForm.resource_type_id" placeholder="-">
									<el-option v-for="item in resourcetypeDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>
							<el-form-item label="资产大类">
								<el-select v-model="addForm.class_name_id" placeholder="-">
									<el-option v-for="item in classNameDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>
							<!-- <el-form-item label="管理员处室">
								<el-input v-model="addForm.utilization_way" />
							</el-form-item> -->
							<el-form-item label="所属公司（应用）">
								<el-input v-model="addForm.company" />
							</el-form-item>
							<el-form-item label="数据中心">
								<el-input v-model="addForm.data_center" />
							</el-form-item>
							<el-form-item label="应用管理员">
								<el-select v-model="addForm.app_admin_id" placeholder="-">
									<el-option v-for="item in admintableDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>
							<el-form-item label="安全接口人">
								<el-select v-model="addForm.safe_person_id" placeholder="-">
									<el-option v-for="item in admintableDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>
							<el-form-item label="处置负责人">
								<el-input v-model="addForm.reviewer" />
							</el-form-item>

							<!-- <el-form-item label="处置人处室">
								<el-input v-model="addForm.data_source" />
							</el-form-item> -->
							<el-form-item label="部署区域">
								<el-input v-model="addForm.network_area" />
							</el-form-item>
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>

		<el-drawer v-model="drawerMisOpen" size="80%" :title="ledgerDetail.name">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>误报描述</span>
						<el-button style="margin-left: 20px" size="small" type="primary" @click="sureAddMis">确认提交</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="misForm" label-width="auto" style="max-width: 600px">
							<el-form-item label="误报描述">
								<el-input type="textarea" v-model="misForm.desc" />
							</el-form-item>
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>
	</div>
</template>

<style scoped lang="scss">
$homeNavLengh: 8;

.is-select {
	box-shadow: inset 0 0 5px #409eff;
}
.host-layout-layout {
	height: calc(100vh - 100px);
	padding: 10px;
	padding-bottom: 0px;
	overflow: auto;
	.home-card-one,
	.home-card-two {
		.home-card-item {
			cursor: pointer;
			width: 100%;
			height: 70px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 10px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);

			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}

			&-icon {
				width: 30px;
				height: 30px;
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
	}

	.home-card-one {
		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/10) + s;
			}
		}
	}

	.home-card-two {
		.home-card-item {
			height: 400px;
			width: 100%;
			overflow: hidden;

			.home-monitor {
				height: 100%;

				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;

					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;

						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}

					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
		}
	}
}

.tree-box {
	margin-left: 10px;
	height: 550px;
	background-color: var(--el-fill-color-blank);
	padding: 10px;
	overflow: auto;
}

.dl-container {
	margin: 10px;
	padding: 10px;
	.dl-title {
		font-weight: bold;
		margin-bottom: 10px;
	}
	.dl-content {
		td:nth-child(odd) {
			width: 150px;
			color: gray;
		}
	}
}
</style>
