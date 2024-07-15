<template>
	<div>
		<dp title="基线管理" desc="检测项管理" @back="backIndex">
			

			<div class="table-container">
				<div class="form-container">
					<div class="form-title">
						<h3></h3>
						<div class="button-box">
							<el-button type="primary" @click="onSearch" icon="Search">搜 索</el-button>
							<el-button type="primary" @click="reSearch" plain icon="RefreshRight">重 置</el-button>
							<el-button @click="isShowMoreSearch = !isShowMoreSearch" :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
								{{ isShowMoreSearch ? '收起' : '展开' }}
							</el-button>
						</div>
					</div>

					<div class="form-params" :style="isShowMoreSearch ? 'height:100px' : 'height:60px'">
						<el-form :inline="true" :model="params">
							<el-form-item label="关键字">
								<el-input v-model="params.scan_name" clearable />
							</el-form-item>
							<el-form-item label="检测类别">
								<el-select v-model="params.scan_firm" style="width: 240px">
									<el-option label="主机" value="主机" />
									<el-option label="WEB应用" value="WEB应用" />
									<el-option label="其他" value="其他" />
								</el-select>
							</el-form-item>
							<el-form-item label="漏洞状态">
								<el-select v-model="params.scan_firm" style="width: 240px">
									<el-option label="启用" value="启用" />
									<el-option label="未启用" value="未启用" />
								</el-select>
							</el-form-item>
						</el-form>
					</div>
					<!-- table -->
					<div class="table-box">
						<table-unit
							:columns="columns"
							:list="list"
							:total="total"
							@handleSizeChange="handleSizeChange"
							@handleCurrentChange="handleCurrentChange"
						>
							<template v-slot="record">
								<el-button size="small" type="primary" link @click="viewRow(record.record)">详情</el-button>
							</template>
						</table-unit>
					</div>
				</div>
			</div>
			<el-drawer v-model="drawerOpen" size="35%" title="检测项详情-LINUX KERNEL 系统弱口令检测">
				<div>
					<dl class="dl-container" style="padding: 10px 30px">
						<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
							<span>检测项信息</span>
						</dt>
						<dd class="dl-content">
							<el-form :model="form" label-width="auto" style="max-width: 600px">
								<el-form-item label="检测项ID">
									<span>id111</span>
								</el-form-item>
								<el-form-item label="检测项名称">
									<span>名称</span>
								</el-form-item>
								<el-form-item label="检测项类别">
									<span>类型</span>
								</el-form-item>
								<el-form-item label="检测项内容">
									<span>等级</span>
								</el-form-item>
								<el-form-item label="修复建议">
									<span>产品</span>
								</el-form-item>
								<el-form-item label="检测说明">
									<span>描述</span>
								</el-form-item>
								<el-form-item label="创建时间">
									<span>途径</span>
								</el-form-item>
								<el-form-item label="处理时限">
									<span>2021-12</span>
								</el-form-item>
							</el-form>
						</dd>
					</dl>
				</div>
			</el-drawer>
		</dp>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref } from 'vue';
import * as echarts from 'echarts';
import { ElMessage, ElMessageBox } from 'element-plus';


import { useRoute, useRouter } from 'vue-router'

// import * as api from './api';

let isShow = ref(false);
let dialogVisible = ref(false);
let params = ref({
	scan_name: '',
	scan_ip: '',
	scan_idc: '',
});
let columns = [
	{
		title: '检测项ID',
		dataIndex: 'scan_name',
	},
	{
		title: '检测项名称',
		dataIndex: 'scan_name',
	},
	{
		title: '检测项类别',
		dataIndex: 'scan_name',
	},
	{
		title: '检测项内容',
		dataIndex: 'scan_name',
	},

	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];
let list = [{ scan_name: 'Linux系统', id: '1' }];
let total = ref(0);

let drawerOpen = ref(false);
const viewRow = (val: any) => {
	console.log(val);
	drawerOpen.value = true;
};
let isEdit = ref(false);
let isShowMoreSearch = ref(false);
const onSearch = () => {
	params.value.page = 1;
	fetchTableData();
};
// 搜索
const searchFn = () => {
	console.log('searchFn');
};
const reSearch = () => {};
const editRow = (row: any) => {
	console.log('editRow');
	router.push('/leak-manage/waring-list/details');
};
// 重置
const resetFn = () => {
	console.log('resetFn');
};
const handleSizeChange = (val: number) => {
	console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
	console.log('handleCurrentChange');
};
const form = reactive({
	name: '',
	region: '',
	date1: '',
	date2: '',
	delivery: false,
	type: [],
	resource: '',
	desc: '',
});

const onSubmit = () => {
	console.log('submit!');
};
const router = useRouter()
const route = useRoute()
const backIndex = () => {
  // router.push({ path: "/leak-manage/host-leak", query: {} })
  router.push({ path: `${route.query.url}`, query: {} })

}
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
