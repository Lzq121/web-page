<template>
	<div>
		<div class="table-container">
			<div class="form-container">
				<div class="form-title">
					<h3>过滤IP</h3>
					<div class="button-box">
						<el-button type="primary" @click="onSearch" icon="Search" :loading="isLoading">搜 索</el-button>
						<el-button type="primary" @click="reSearch" plain :loading="isLoading" icon="RefreshRight">重 置</el-button>
						<el-button icon="Plus" plain @click="router.push({ path: '/asset-manage/base-info/filter-ip/add-assets' })">新增过滤IP资产</el-button>
					</div>
				</div>
				<div class="form-params">
					<el-form :inline="true" :model="params">
						<el-form-item label="IP" v-show="ipOrApp == '1'">
							<el-input v-model="params.ip" @keydown.enter="onSearch" clearable />
						</el-form-item>
						<el-form-item label="审核状态" >
							<el-select clearable v-model="params.verify_status">
								<el-option label="已审核" value="1" />
								<el-option label="未审核" value="0" />
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="tree-table-container">
				<treeUnit :treeData="treeData" :value="ipOrApp" @onClickTree="onClickTree" @changeTreeData="ipOrAppChange"></treeUnit>
				<div class="table-container">
					<table-unit
						:currentPage="params.page"
						:pageSize="params.limit"
						:columns="columns"
						:list="list"
						:total="total"
						:loading="isLoading"
						@handleSizeChange="handleSizeChange"
						@handleCurrentChange="handleCurrentChange"
					>
						<template v-slot="record">
							<el-button plain size="small" link type="primary" @click="editRow(record.record)">详情</el-button>
							<el-button plain size="small" link type="warning" @click="editOr(record.record)">编辑</el-button>
							<el-button v-if="userInfo.org === '管理组' && record.record.verify_status == '0'" plain size="small" link type="info" @click="auditBtn(record.record)">审核</el-button>

							<el-button v-if="userInfo.org === '管理组'" plain size="small" link type="danger" @click="delRow(record.record)">删除</el-button>
						</template>
					</table-unit>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage, ElMessageBox, ElTree } from 'element-plus';
import treeUnit from '@/components/tree-unit/index.vue';
import api from './api';
import router from '@/router';
import { Session } from '@/utils/storage';
const userInfo = Session.get('userInfo');
const columns = [
	{ title: 'IP', dataIndex: 'ip' },
	{ title: '设备名称', dataIndex: 'logical_name' },
	{ title: '所属系统', dataIndex: 'biz_display' },
	{ title: '所属公司', dataIndex: 'company' },
	{ title: '执行开始时间', dataIndex: 'maintenance_start_time', hidden: true },
	{ title: '执行开始结束', dataIndex: 'maintenance_end_time', hidden: true },

	{ title: '审核状态', dataIndex: 'verify_status$', isTag: true },
	{ title: '过滤日期', dataIndex: 'filter_dates' },
	{ title: '过滤时间段', dataIndex: 'filter_time_period' },
	{ title: '过滤原因', dataIndex: 'filter_desc' },
	{
		title: '操作',
		dataIndex: 'operate',
		width: 220,
		fixed: 'right',
	},
];

let list = ref([]);

let ipOrApp = ref('1');
let params = ref({
	filter_type: '1',
	name: '',
	ip: '',
	dept: '',
	network_area: '',
	data_center: '',
	page: 1,
	limit: 30,
	verify_status: '',
});

let total = ref(0);
let editOr = (val: any) => {
	router.push({
		path: '/asset-manage/base-info/filter-ip/add-assets',
		query: { id: val.id, class: 'edit', isAudit: 'false' },
	});
};
let auditBtn = (val: any) => {
	ElMessageBox.confirm('确认审核吗?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await api.UpdateObj(val.id, { verify_status: 1 });
			if (res.code === 2000) {
				ElMessage.success('审核成功');
				fetchTableData();
			}
		})
		.catch(() => {});
};
let isLoading = ref(true);
const fetchTableData = async () => {
	isLoading.value = true;
	const res = await api.GetList(params.value);
	res.data.map((item: any) => {
		item.verify_status$ = item.verify_status == '1' ? { code: 1, value: '已审核' } : { code: 3, value: '未审核' };
	});
	total.value = res.total;
	list.value = res.data;
	isLoading.value = false;
};
fetchTableData();
const handleSizeChange = (val: number) => {
	params.value.page = 1;
	params.value.limit = val;
	fetchTableData();
};

// tree选择

// 删除
const delOkFn = async (val: any) => {
	let res = await api.DelObj(val.record.id);
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
		filter_type: '1',
		name: '',
		ip: '',
		dept: '',
		network_area: '',
		data_center: '',
		page: 1,
		limit: 30,
		verify_status: '',
	};
	fetchTableData();
};

const editRow = async (val: any) => {
	router.push({
		path: '/asset-manage/base-info/filter-ip/detailDia',
		query: { id: val.id },
	});
};

const delRow = (val: any) => {
	ElMessageBox.confirm('确认删除吗?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await api.DelObj(val.id);
			if (res.code === 2000) {
				ElMessage.success('删除成功');
				fetchTableData();
			}
		})
		.catch(() => {});
};

const onClickTree = (data: any) => {
	if (ipOrApp.value === '2') {
		params.value.company = data.data1;
		params.value.data_center = undefined;
		params.value.network_area = undefined;
	} else {
		params.value.company = undefined;
		params.value.data_center = data.data1;
		params.value.network_area = data.data2;
	}

	fetchTableData();
};

let treeData = ref([]);
const getTreeList = () => {
	treeData.value = [];
	api.getTreeList({ filter_type: ipOrApp.value }).then((res: any) => {
		if (res.code == 2000) {
			treeData.value = res.data;
		}
	});
};
const ipOrAppChange = () => {
	params.value.filter_type = ipOrApp.value;
	params.value.name = '';
	params.value.ip = '';
	params.value.dept = '';
	params.value.network_area = '';
	params.value.data_center = '';
	total.value = 0;
	list.value = [];
	fetchTableData();
	getTreeList();
};
ipOrAppChange();
</script>

<style lang="scss" scoped>
.demo-tabs {
	--el-table-bg-color: var(--el-fill-color-blank);
	background-color: var(--el-table-bg-color);
	border: var(--el-table-border);
	margin: 10px;
	height: 8vh;
	display: flex;
	align-items: center;
	padding-left: 10px;
}
</style>
