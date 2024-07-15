<template>
	<div class="ALLdata">
		<el-form :inline="true" :model="params" class="demo-form-inline">
			<el-form-item label="工单id">
				<el-input v-model="params.sn_id" placeholder="请输入ID" clearable />
			</el-form-item>
			<el-form-item label="工单类型">
				<el-input v-model="params.itsm_type" placeholder="工单类型" clearable />
			</el-form-item>
			<el-form-item label="工单状态">
				<el-input v-model="params.status" placeholder="工单状态" clearable />
			</el-form-item>
			<!-- <el-form-item label="工单类型">
				<el-select v-model="knownAPIListGetApiObj.dept" placeholder="全部" style="width: 240px">
					<el-option label="长亭" value="长亭" />
					<el-option label="启明" value="启明" />
					<el-option label="绿盟" value="绿盟" />
				</el-select>
			</el-form-item>
			<el-form-item label="工单状态">
				<el-select v-model="knownAPIListGetApiObj.network_area" placeholder="全部" style="width: 240px">
					<el-option label="长亭" value="长亭" />
					<el-option label="启明" value="启明" />
					<el-option label="绿盟" value="绿盟" />
				</el-select>
			</el-form-item> -->
			<el-form-item>
				<el-button type="primary" @click="onSearch">搜索</el-button>
				<el-button @click="reSearch">重置</el-button>
			</el-form-item>
		</el-form>
		<div class="table-box">
			<el-row class="demo-tabs">
				<el-col :span="24" class="left">
					<el-button key="">全部工单</el-button>
					<el-button key="">代办工单</el-button>
					<el-button key="">已结束工单</el-button>
					<el-button key="">驳回工单</el-button>
				</el-col>
			</el-row>
			<!-- 表格 -->
			<table-unit
				:columns="columns"
        :currentPage="params.page"
        :pageSize="params.limit"
				:list="list"
				:topColShow="false"
				:total="total"
				@handleSizeChange="handleSizeChange"
				@handleCurrentChange="handleCurrentChange"
			>
				<template v-slot="record">
					<el-button size="small" type="primary" link @click="details(record.record)">详情</el-button>
				</template>
			</table-unit>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apis from './api';
const router = useRouter();
// 工单表单头
let columns = [
	{
		title: '工单ID',
		dataIndex: 'sn_id',
	},
	{
		title: '工单类型',
		dataIndex: 'type',
	},
	{
		title: '工单名称',
		dataIndex: 'title',
	},
	{
		title: '工单描述',
		dataIndex: 'desc',
	},
	{
		title: '工单状态',
		dataIndex: 'status',
	},
	{
		title: '创建人',
		dataIndex: 'creat_user',
	},
	{
		title: '发布时间',
		dataIndex: 'creat_time',
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];
let params: any = ref({
	page: 1,
	limit: 30,
	sn_id: '',
	itsm_type: '',
	status: '',
});
let list = ref([]);
let total = ref(0);
const fetchTableData = async () => {
	let res = await apis.getItsmManageApi(params.value);
	list.value = res.data;
	total.value = res.total;
};
fetchTableData();

const reSearch = () => {
	params.value = {
		page: 1,
		limit: 30,
		sn_id: '',
		itsm_type: '',
		status: '',
	};
	fetchTableData();
};
const onSearch = () => {
	params.value.page = 1;
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
//详情事件
const details = (val: any) => {
	router.push({ path: '/workbench/work-order-management/page/work-order-management-details/index',query: { detailInfo: JSON.stringify(val) }, });
};

</script>

<style lang="scss" scoped>
@import '@/theme/mixins/index.scss';
.ALLdata {
	border-radius: 10px;

	.demo-form-inline {
		background: var(--el-fill-color-blank);
		padding: 16px;
		margin: 5px;
	}
	.demo-tabs {
		background: var(--el-fill-color-blank);
		padding: 6px;
		margin: 5px;

		.right {
			display: flex;
			justify-content: end;
		}
	}
	.tree_table {
		background: var(--el-fill-color-blank);
		margin: 5px;
	}
}
</style>
