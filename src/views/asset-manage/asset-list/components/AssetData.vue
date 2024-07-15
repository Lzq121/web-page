<script setup lang="ts">
import { ref } from 'vue';
import apis from '../api';
import treeUnit from '@/components/tree-unit/index.vue';
const emits = defineEmits(['selectFun']);
const props = defineProps({
	selectDisabled: {
		type: Boolean,
		default: false,
	},
	selectValue: {
		type: String,
		default: '1',
	},
});
const ipColumns = [
	{
		dataIndex: 'ip',
		title: 'IP地址',
	},
	{
		dataIndex: 'resource_type_display',
		title: '资产类型',
	},
	{
		dataIndex: 'host_manager_name',
		title: '主机负责人',
		width: 100,
	},
	{
		dataIndex: 'biz_display',
		title: '所属系统',
	},
	{
		dataIndex: 'os_version',
		title: '操作系统版本',
		width: 120,
	},
	{
		dataIndex: 'affected_product',
		title: '受影响产品',
		width: 120,
	},
	{
		dataIndex: 'data_center',
		title: '数据中心',
	},
	{
		dataIndex: 'network_area',
		title: '部署区域',
	},

	{
		dataIndex: 'tags',
		title: '标签',
		width: 150,
	},

	{
		dataIndex: 'class_name_display',
		title: '资产大类',
		hidden: true,
	},
	{
		dataIndex: 'dept',
		title: '所属部门',
		hidden: true,
	},

	{
		dataIndex: 'os',
		title: '操作系统',
		hidden: true,
	},
	{
		dataIndex: 'app_admin_name',
		title: '应用管理员',
		hidden: true,
	},
	{
		dataIndex: 'middleware_admin',
		title: '中间件管理员',
		hidden: true,
	},
	{
		dataIndex: 'db_admin',
		title: '数据库管理员',
		hidden: true,
	},

	{
		dataIndex: 'room',
		title: '机房',
		hidden: true,
	},

	{
		dataIndex: 'safe_person',
		title: '安全接口人',
		hidden: true,
	},
];

const appColumns = [
	{ dataIndex: 'name', title: '系统名称' },
	{ dataIndex: 'biz_manager_name', title: '应用管理员' },
	{ dataIndex: 'biz_level', title: '等保级别' },
	{ dataIndex: 'dept', title: '所属部门' },
	{ dataIndex: 'company', title: '所属公司' },
	{ dataIndex: 'supplier', title: '软件厂商' },
	{ dataIndex: 'biz_state', title: '系统状态' },
	{ dataIndex: 'biz_class', title: '应用大类', hidden: true },
	{ dataIndex: 'biz_type', title: '应用类别', hidden: true },
	{ dataIndex: 'biz_plate', title: '所属业务板块', hidden: true },
	{ dataIndex: 'mail_of_main', title: '管理员邮箱', hidden: true },
	{ dataIndex: 'tp_of_main', title: '管理员电话', hidden: true },
	{ dataIndex: 'domain', title: '业务域', hidden: true },
	{ dataIndex: 'project_desc', title: '项目描述', hidden: true },
	{ dataIndex: 'external_lan_ip', title: '对外业务内网ip', hidden: true },
	{ dataIndex: 'load_ip', title: '负载IP', hidden: true },
	{ dataIndex: 'public_ip', title: '公网ip', hidden: true },
	{ dataIndex: 'open_port', title: '对外开放端口', hidden: true },
	{ dataIndex: 'source_id', title: '数据源来源id', hidden: true },
	{ dataIndex: 'reviewer', title: '审核人', hidden: true },
];
let ipOrApp = ref(props.selectValue);
let total: number = 0;
let params = ref({
	ip: '',
	resource_type: '',
	network_area: '',
	data_center: '',
	limit: 30,
	page: 1,
	name: '',
	os_version: '',
	host_manager_name: '',
	biz_manager_name: '',
	affected_product: '',
});

const appListAll: any = ref([]);
const tableData = ref([]);
const listRef = ref([]);
let isLoading = ref(true);
// 已知资产列表
const knownAPIListGetApi = async () => {
	listRef.value = ipColumns;
	let res = await apis.knownListGetApi(params.value);
	tableData.value = res.data;
	tableData.value.forEach((item: any) => {
		item.tags = item.assets_label;
	});
	total = res.total;
	isLoading.value = false;
};

// 应用系统列表
const appSystem = async () => {
	listRef.value = appColumns;
	let res = await apis.businessListgGetApi(params.value);
	tableData.value = res.data;
	total = res.total;
	isLoading.value = false;
};

const onClickTree = async (data: any) => {
	if (ipOrApp.value == '1') {
		params.value.data_center = data.data1;
		params.value.network_area = data.data2;
		params.value.company = undefined;
		knownAPIListGetApi();
	} else {
		params.value.data_center = undefined;
		params.value.network_area = undefined;
		params.value.company = data.data1;
		appSystem();
	}
};

// 分页
const handleSizeChange = (val: any) => {
	params.value.limit = val;
	params.value.page = 1;
	if (ipOrApp.value == '1') {
		knownAPIListGetApi();
	} else {
		appSystem();
	}
};
const handleCurrentChange = (val: any) => {
	params.value.page = val;
	if (ipOrApp.value == '1') {
		knownAPIListGetApi();
	} else {
		appSystem();
	}
};
// 搜索
const searchList = () => {
	if (ipOrApp.value == '1') {
		knownAPIListGetApi();
	} else {
		appSystem();
	}
};

// table单选框
const handleSelectionChange = (val: any[]) => {
	emits('selectFun', { data: val, type: ipOrApp.value });
};

// tree切换
const ipOrAppChange = (val: string) => {
	isLoading.value = true;
	tableData.value = [];
	total = 0;
	params.value = {
		ip: '',
		resource_type: '',
		network_area: '',
		data_center: '',
		limit: 30,
		page: 1,
		name: '',
		os_version: '',
		host_manager_name: '',
		biz_manager_name: '',
	};
	ipOrApp.value = val;
	if (val == '1') {
		knownAPIListGetApi();
	} else {
		appSystem();
	}
	getTreeList();
};
let treeData = ref([]);
const getTreeList = () => {
	treeData.value = [];
	const url = ipOrApp.value == '1' ? 'api/assets/Hosts/tree_list/' : '/api/assets/Business/tree_list/';
	apis.getTreeList(url).then((res: any) => {
		if (res.code == 2000) {
			treeData.value = res.data;
		}
	});
};

ipOrAppChange(ipOrApp.value);
let isShowMoreSearch = ref(false);
</script>

<template>
	<div>
		<div class="form-container">
			<div class="form-params" :class="{ openParams: isShowMoreSearch }">
				<div class="more-filter-btn">
						<el-button link type="primary" @click="isShowMoreSearch = !isShowMoreSearch" :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
							{{ isShowMoreSearch ? '收起' : '展开' }}
						</el-button>
					</div>
				<el-form :inline="true" :model="params" :disabled="isLoading" class="demo-form-inline">
					<el-form-item :label="ipOrApp == '1' ? 'IP' : '系统名称'">
						<el-input v-show="ipOrApp == '1'" v-model="params.ip" @keydown.enter="searchList" placeholder="请输入关键字" clearable />
						<el-input v-show="ipOrApp != '1'" v-model="params.name" @keydown.enter="searchList" placeholder="请输入关键字" clearable />
					</el-form-item>
					<el-form-item v-show="ipOrApp == '1'" label="操作系统版本">
						<el-input @keydown.enter="searchList" v-model="params.os_version" clearable />
					</el-form-item>
					<el-form-item v-show="ipOrApp == '1'" label="受影响产品">
						<el-input @keydown.enter="searchList" v-model="params.affected_product" clearable />
					</el-form-item>
					<el-form-item v-show="ipOrApp == '1'" label="主机负责人">
						<el-input @keydown.enter="searchList" v-model="params.host_manager_name" clearable />
					</el-form-item>
					<el-form-item v-show="ipOrApp != '1'" label="应用管理员">
						<el-input @keydown.enter="searchList" v-model="params.biz_manager_name" clearable />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="Search" :loading="isLoading" @click="searchList">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="tree-table-container">
			<treeUnit
				:treeData="treeData"
				:value="ipOrApp"
				:selectDisabled="selectDisabled"
				v-loading="isLoading"
				@onClickTree="onClickTree"
				@changeTreeData="ipOrAppChange"
			></treeUnit>
			<div class="table-container">
				<table-unit
					:columns="listRef"
					:list="tableData"
					:loading="isLoading"
					:pageSize="params.limit"
					:total="total"
					:isSelection="true"
					:currentPage="params.page"
					@handleSelectionChange="handleSelectionChange"
					@handleSizeChange="handleSizeChange"
					@handleCurrentChange="handleCurrentChange"
				>
				</table-unit>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss"></style>
