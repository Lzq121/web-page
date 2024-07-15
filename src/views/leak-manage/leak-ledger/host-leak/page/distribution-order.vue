<template>
	<div class="distribution-order-layout">
		<dp title="漏洞详情" @back="backIndex">
			<template #right>
				<el-button style="margin-left: 20px"  type="primary" @click="addSureBtn">确认提交</el-button>
			</template>
			<div>
				<dl class="dl-container">
					<dt class="dl-title">处理进度</dt>
					<dd class="dl-content">
						<el-steps :active="scheduleData.active" align-center>
							<el-step :key="index" v-for="(item, index) in scheduleData.arr" icon="CircleCheckFilled" :title="item.title">
								<template #description>
									{{ item.desc }}
									<p style="width: 120px">
										{{ item.time }}
									</p>
								</template>
							</el-step>
						</el-steps>
					</dd>
				</dl>
				<dl class="dl-container" v-if="false">
					<dt class="dl-title">处置流程信息</dt>
					<dd class="dl-content">
						<table class="m_table" style="text-align: center">
							<tr>
								<td>序号</td>
								<td>状态</td>
								<td>处理时间</td>
								<td>处置节点</td>
								<td>处置意见</td>
								<td>部门</td>
								<td>处置人</td>
							</tr>
							<tr>
								<td>1</td>
								<td><el-tag type="success">完成</el-tag></td>
								<td>2023-11-11 11:11:11</td>
								<td>漏洞评估</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
							</tr>
						</table>
					</dd> 
				</dl>
				<dl class="dl-container">
					<dt class="dl-title">基本信息</dt>
					<dd class="dl-content">
						<el-form :inline="true" label-width="100px" :model="baseData" :rules="baseDataRules">
							<!-- <el-form-item label="派发类型" required>
								<el-select v-model="baseData.is_use">
									<el-option label="系统内部工单" :value="true" />
									<el-option label="外部工单(ITSM)" :value="false" />
								</el-select>
							</el-form-item> -->
							<!-- <el-form-item label="工单类型" required>
								<el-select v-model="baseData.is_use">
									<el-option label="漏洞修复" :value="true" />
									<el-option label="外部工单1" :value="false" />
								</el-select>
							</el-form-item>
							<el-form-item label="工单编号" required>
								<el-input v-model="baseData.class_name" clearable />
							</el-form-item> -->
							<el-form-item label="工单名称" required>
								<el-input v-model="baseData.title" clearable />
							</el-form-item>

							<el-form-item label="数据中心" required>
								<el-select v-model="baseData.area" placeholder="-">
									<el-option v-for="item in areaDict" :key="item.key" :label="item.name" :value="item.key" />
								</el-select>
							</el-form-item>
							<!-- <el-form-item label="填单人邮箱">
								<el-input v-model="baseData.class_name" clearable />
							</el-form-item>
							<el-form-item label="接单人电话" style="width: 95%">
								<el-input v-model="baseData.class_name" clearable /> -->
							<!-- </el-form-item> -->
							<el-form-item label="开始时间" required>
								<el-date-picker v-model="baseData.start_time" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" />
							</el-form-item>
							<el-form-item label="结束时间" required>
								<el-date-picker v-model="baseData.end_time" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" />
							</el-form-item>
							<el-form-item label="工单描述" required style="width: 95%">
								<el-input type="textarea" v-model="baseData.desc" clearable />
							</el-form-item>
						</el-form>
					</dd>
				</dl>
				<dl class="dl-container" v-if="false">
					<dt class="dl-title">附件信息</dt>
					<dd class="dl-content">
						<el-upload ref="upload" class="upload-demo" action="#" :limit="1" :on-exceed="handleExceed" :auto-upload="false">
							<template #trigger>
								<el-button type="primary">添加附件</el-button>
							</template>
							<el-button class="ml-3" type="success" @click="submitUpload"> 开始上传 </el-button>
							<template #tip>
								<div class="el-upload__tip text-red">只能添加一个文件</div>
							</template>
						</el-upload>
					</dd>
				</dl>
				<dl class="dl-container" v-if="false">
					<dt class="dl-title">派发信息</dt>
					<dd class="dl-content">
						<el-form :inline="true" :model="baseData" :rules="baseDataRules">
							<el-form-item label="处置单位" required>
								<el-select v-model="baseData.is_use">
									<el-option label="系统内部工单" :value="true" />
									<el-option label="外部工单(ITSM)" :value="false" />
								</el-select>
							</el-form-item>
							<el-form-item label="处置人" required>
								<el-select v-model="baseData.is_use">
									<el-option label="漏洞修复" :value="true" />
									<el-option label="外部工单1" :value="false" />
								</el-select>
							</el-form-item>
						</el-form>
					</dd>
				</dl>
				<dl class="dl-container" v-if="false">
					<dt class="dl-title">漏洞信息</dt>
					<dd class="dl-content">
						<div style="text-align: right; padding: 10px">
							<el-button link type="primary" icon="Download">导出数据</el-button>
							<el-button link type="primary" icon="Plus">新增资产</el-button>
						</div>
						<table-unit
							:pageSize="params.limit"
							:height="500"
							:currentPage="params.page"
							:isSelection="true"
							@handleSelectionChange="handleSelectionChange"
							:columns="columns"
							:list="list"
							:total="total"
							@handleSizeChange="handleSizeChange"
							@handleCurrentChange="handleCurrentChange"
						>
							<template v-slot="record">
								<el-button type="primary" size="small" link @click="viewRow(record.record)">详 情</el-button>
							</template>
						</table-unit>
					</dd>
				</dl>
			</div>
		</dp>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { genFileId, ElMessage, ElMessageBox } from 'element-plus';
import apis from '../api';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
const router = useRouter();
const route = useRoute();

let params = ref({
	page: 1,
	limit: 30,
});
const hidden = true;
const columns = [
	{
		title: '漏洞名称',
		dataIndex: '2',
	},

	{
		title: '受影响主机',
		dataIndex: '3',
	},

	{
		title: '端口',
		dataIndex: '4',
	},

	{
		title: '漏洞ID',
		dataIndex: '5',
	},

	{
		title: '设备所属公司',
		dataIndex: '6',
	},

	{
		title: '所属数据中心',
		dataIndex: '7',
	},

	{
		title: '部署区域',
		dataIndex: '8',
	},

	{
		title: '操作',
		dataIndex: 'operate',
		width: 100,
		fixed: 'right',
	},
];
let list = ref([{ '2': '测试数据' }, { '2': '测试数据' }, { '2': '测试数据' }, { '2': '测试数据' }, { '2': '测试数据' }, { '2': '测试数据' }]);

// 获取数据中心
let areaDict = ref();
const getAreaInfo = async () => {
	let res = await apis.getAreaInfoApi();
	areaDict.value = res.data;
};
getAreaInfo();



// 创建工单
const addSureBtn = async () => {
	baseData.value.id_list = JSON.parse(route.query.selectList);
	let res = await apis.createItsmApi(baseData.value);
	if (res.code == 2000) {
		ElMessage.success(res.msg);
	}
};

let total = ref(0);
const fetchTableData = () => {};
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
	};
	fetchTableData();
};
let drawerOpen = ref(false);
const viewRow = (val: any) => {

	drawerOpen.value = true;
};
const handleSelectionChange = (val: any) => {

};
const upload = ref<UploadInstance>();

const handleExceed: UploadProps['onExceed'] = (files) => {
	upload.value!.clearFiles();
	const file = files[0] as UploadRawFile;
	file.uid = genFileId();
	upload.value!.handleStart(file);
};

const submitUpload = () => {
	upload.value!.submit();
};

const backIndex = () => {
	router.push({ path: '/leak-manage/leak-ledger/host-leak', query: {} });
	// router.push({ path: `${route.query.url}`, query: {} });
};
let scheduleData = ref({
	arr: [
		// { title: '发现漏洞', desc: '', time: '' },
		// { title: '漏洞评估', desc: '', time: '' },
		{ title: '派发工单' },
		{ title: '审核工单' },
		{ title: '认领工单' },
		{ title: '验证漏洞' },
		{ title: '已修复' },
	],
	active: 0,
});
let baseData = ref({});
let baseDataRules = ref({});
</script>

<style lang="scss" scoped>
.distribution-order-layout {
	:deep(.el-form--inline .el-form-item) {
		width: 45%;
	}
}
</style>
