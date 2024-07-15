<template>
	<div>
		<div class="table-container">
			<div class="form-container">
				<div class="form-title">
					<h3>督办管理列表</h3>
					<div class="button-box">
						<el-button type="primary" @click="searchFn" icon="Search">搜 索</el-button>
						<el-button type="primary" @click="resetFn" plain icon="RefreshRight">重 置</el-button>
					</div>
				</div>
				<!-- 筛选条件 -->
				<div class="form-params" >
					<el-form :inline="true" :model="params">
						<el-form-item label="关键字">
							<el-input v-model="params.scan_name" clearable />
						</el-form-item>
						<el-form-item label="严重程度">
							<el-select v-model="params.scan_firm" style="width: 240px">
								<el-option label="长亭" value="长亭" />
								<el-option label="启明" value="启明" />
								<el-option label="绿盟" value="绿盟" />
							</el-select>
						</el-form-item>
						<el-form-item label="漏洞类型">
							<el-select v-model="params.is_use" style="width: 240px">
								<el-option label="启用" :value="true" />
								<el-option label="未启用" :value="false" />
							</el-select>
						</el-form-item>
					</el-form>
				</div>
				<!-- table -->
			</div>
			
			<div class="table-box">
				<el-row class="demo-tabs">
					<el-col :span="24" class="right">
						<el-button key="" type="primary" @click="drawerOpen = true">新建督办任务</el-button>
					</el-col>
				</el-row>
				<table-unit :columns="columns" :list="list" :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
					<template v-slot="record">
						<el-button size="small" type="primary" link @click="editRow(record.record)">编辑</el-button>
						<el-button size="small" type="primary" link @click="reportClick(record.record)">报告</el-button>
					</template>
				</table-unit>
			</div>
		</div>
		<!-- 新建督办任务右侧弹出 -->
		<el-drawer v-model="drawerOpen" size="55%" title="新建督办任务">
			<div>
				<dl class="dl-container">
				<dt class="dl-title ">基本信息</dt>
				<dd class="dl-content">
					<el-form :inline="true" label-width="100px" :model="baseData" :rules="baseDataRules">
					<el-form-item label="督办主题" required>
						<el-select v-model="baseData.is_use">
						<el-option label="系统内部工单" :value="true" />
						<el-option label="外部工单(ITSM)" :value="false" />
						</el-select>
					</el-form-item>
					<el-form-item label="任务名称" required>
						<el-input v-model="baseData.class_name" clearable />
					</el-form-item>
					<el-form-item label="创建人" required>
						<el-input v-model="baseData.class_name" clearable />
					</el-form-item>
					<el-form-item label="创建时间" required>
						<el-input v-model="baseData.class_name" clearable />
					</el-form-item>
					<el-form-item label="创建部门" required>
						<el-input v-model="baseData.class_name" clearable />
					</el-form-item>
					<el-form-item label="创建人邮箱" >
						<el-input v-model="baseData.class_name" clearable />
					</el-form-item>
					<el-form-item label="创建人电话">
						<el-input v-model="baseData.class_name" clearable />
					</el-form-item>
					<el-form-item label="督办要求" required style="width:95%">
						<el-input type="textarea" v-model="baseData.class_name" clearable />
					</el-form-item>
					</el-form>
				</dd>
				</dl>
				<dl class="dl-container">
					<dt class="dl-title ">执行信息</dt>
					<dd class="dl-content">
						<el-form :inline="true" label-width="100px" :model="baseData" :rules="baseDataRules">
							<el-form-item label="执行周期" required style="width:95%"></el-form-item>
							<el-form-item label="开始日期" style="width:95%">
								<el-date-picker
									v-model="baseData.date"
									type="date"
									placeholder="Pick a date"
									clearable
								/>
							</el-form-item>
							<el-form-item label="结束日期" style="width:95%">
								<el-date-picker
									v-model="baseData.date"
									type="date"
									placeholder="Pick a date"
									clearable
								/>
							</el-form-item>
							<el-form-item label="执行频率" required style="width:95%"></el-form-item>
							<el-form-item label=" " style="width:95%">
								<el-radio-group v-model="baseData.resource1" size="small" >
									<el-radio-button label="立即执行" value="0" />
									<el-radio-button label="定时执行" value="2" />
								</el-radio-group>
							</el-form-item>
							<el-form-item label=" " style="width:95%">
								<el-radio-group v-model="baseData.resource">
									<el-radio value="立即执行">立即执行</el-radio>
									<el-radio value="定时执行">定时执行</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="日期" style="width:95%">
								<el-date-picker
									v-model="baseData.date"
									type="date"
									placeholder="Pick a date"
									clearable
								/>
							</el-form-item>
							<el-form-item prop="date2" label="时间" style="width:95%">
								<el-time-picker
									v-model="baseData.date2"
									aria-label="Pick a time"
									placeholder="Pick a time"
								/>
							</el-form-item>
						</el-form>
					</dd>
				</dl>
				<dl class="dl-container">
				<dt class="dl-title ">附件信息</dt>
				<dd class="dl-content">
					<el-upload ref="upload" class="upload-demo" action="#" :limit="1" :on-exceed="handleExceed"
					:auto-upload="false">
					<el-button class="ml-3" type="success" @click="submitUpload">
						上传模版附件
					</el-button>
					</el-upload>
				</dd>
				</dl>
				<dl class="dl-container">
					<dt class="dl-title ">派发信息</dt>
					<dd class="dl-content">
						<el-form :inline="true" label-width="100px" :model="baseData" :rules="baseDataRules">
							<el-form-item label="执行人部门" required>
								<el-select v-model="baseData.is_use">
									<el-option label="系统内部工单" :value="true" />
									<el-option label="外部工单(ITSM)" :value="false" />
								</el-select>
							</el-form-item>
							<el-form-item label="执行人" required>
								<el-select v-model="baseData.is_use">
									<el-option label="系统内部工单" :value="true" />
									<el-option label="外部工单(ITSM)" :value="false" />
								</el-select>
							</el-form-item>
						</el-form>
						<div style="text-align:right;padding:10px;font-weight:bold">
							<el-button>+新增执行人</el-button>
						</div>
					</dd>
				</dl>
			</div>
		</el-drawer>
		<!-- 报告页面弹出 -->
		<el-dialog v-model="dialogVisible" title="报告详情" width="70%">
			<el-form :inline="true" :model="unknownListGetApiObj" class="demo-form-inline">
				<el-form-item label="关键字">
					<el-input v-model="unknownListGetApiObj.ip" placeholder="请输入关键字" clearable />
				</el-form-item>
				<el-form-item label="是否完成">
					<el-input v-model="unknownListGetApiObj.ip" placeholder="请输入关键字" clearable />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="appSystem">搜索</el-button>
					<el-button @click="Reset">重置</el-button>
				</el-form-item>
			</el-form>
			<table-unit :columns="report_columns" :list="report_list" :topColShow=false :total="report_total" @handleSizeChange="report_handleSizeChange" @handleCurrentChange="report_handleCurrentChange">
				<template v-slot="record">
					<el-button size="small" type="primary" link @click="report_details(record.record)">详情</el-button>
				</template>
			</table-unit>
		</el-dialog>
		<!-- 报告详情右侧弹出 -->
		<el-drawer v-model="report_drawerOpen" size="55%" title="新建督办任务">
			<dl class="dl-container">
				<dt class="dl-title ">报告列表</dt>
				<dd class="dl-content">
					<table-unit :columns="report_list_columns" :list="report_list_list" :topColShow=false :total="report_list_total" @handleSizeChange="report_list_handleSizeChange" @handleCurrentChange="report_list_handleCurrentChange">
						<template v-slot="record">
							<el-button size="small" type="primary" link @click="report_list_zip(record.record)">下载报告</el-button>
						</template>
					</table-unit>
				</dd>
			</dl>
		</el-drawer>
	</div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import type { UploadInstance} from 'element-plus'
const router = useRouter();
// import * as api from './api';

let isShow = ref(false);
let params = ref({
	scan_name: '',
	scan_ip: '',
	scan_idc: '',
});
// 督办表单头
let columns = ref([
	{
		title: '任务ID',
		dataIndex: 'supervision_id',
	},
	{
		title: '任务名单',
		dataIndex: 'supervision_name',
	},
	{
		title: '督办主题',
		dataIndex: 'supervision_theme',
	},
	{
		title: '开始时间',
		dataIndex: 'supervision_start',
	},
	{
		title: '结束时间',
		dataIndex: 'supervision_end',
	},
	{
		title: '执行频率',
		dataIndex: 'supervision_frequency',
	},
	{
		title: '状态',
		dataIndex: 'supervision_status',
		isTag:true
	},
	{
		title: '创建人',
		dataIndex: 'supervision_name',
	},
	{
		title: '创建时间',
		dataIndex: 'supervision_people',
	},
	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
]);
let list = [{ supervision_id: '012266235', supervision_name: '运营报告' ,supervision_status:{code:1,value:'运行'}}];
let total = ref(0);

// 搜索
const searchFn = () => {
	columns.value = [
	{
		title: '创建时间',
		dataIndex: 'supervision_people',
	},
	]
	console.log(columns.value);
};
const editRow = (row: any) => {
	console.log('editRow');
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

//新建督办任务右侧弹出
let drawerOpen = ref(false)

let baseData = ref({})
let baseDataRules = ref({})
const locationOptions = ['单次执行', '重复执行']
const upload = ref<UploadInstance>()
//上传附件事件
const submitUpload = () => {
  upload.value!.submit()
}

// 报告详情弹出
const dialogVisible = ref(false);
const reportClick = (row: any) => {
	dialogVisible.value = true
};

let unknownListGetApiObj = ref({})
//报告页面的搜索
const appSystem = () => {
	console.log('appSystem');
};

//报告页面的重置
const Reset = () => {
	console.log('Reset');
};

// 报告表单头report
const report_columns = [
	{
		title: '序号',
		dataIndex: 'report_id',
	},
	{
		title: '报告名称',
		dataIndex: 'report_name',
	},
	{
		title: '开始时间',
		dataIndex: 'report_start',
	},
	{
		title: '结束时间',
		dataIndex: 'report_end',
	},
	{
		title: '是否完成',
		dataIndex: 'report_status',
		isTag: true
	},
	{
		title: '结果',
		dataIndex: 'report_result',
	},
	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
];
let report_list = [{ report_id: '1', report_name: '安全-基础安全组每周运营部报告(1月)' ,report_status:{code:1,value:'已完成'}}];
let report_total = ref(0);
const report_handleSizeChange = (val: number) => {
	console.log('report_handleSizeChange');
};
const report_handleCurrentChange = (val: number) => {
	console.log('report_handleCurrentChange');
};

//报告右侧弹出
let report_drawerOpen = ref(false)

// 报告详情
const report_details = (val: any) => {
	report_drawerOpen.value = true
}
// 报告详情列表表单头report
const report_list_columns = [
	{
		title: '序号',
		dataIndex: 'report_list_id',
	},
	{
		title: '执行人',
		dataIndex: 'report_list_people',
	},
	{
		title: '状态',
		dataIndex: 'report_list_status',
		isTag: true
	},
	{
		title: '报告名称',
		dataIndex: 'report_list_name',
	},
	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
];
let report_list_list = [{ report_list_id: '1', report_list_name: '安全-基础安全组每周运营部报告(1月)' ,report_list_status:{code:1,value:'通过审核'}}];
let report_list_total = ref(0);
const report_list_handleSizeChange = (val: number) => {
	console.log('report_list_handleSizeChange');
};
const report_list_handleCurrentChange = (val: number) => {
	console.log('report_list_handleCurrentChange');
};
//下载报告
const report_list_zip = (val: any)=>{
	console.log('report_list_zip');
}
</script>

<style lang="scss" scoped>
.demo-tabs {
	background: var(--el-fill-color-blank);
	padding: 6px;
	margin: 5px 0px 0px 0px;

	.right {
		display: flex;
		justify-content: end;
	}
}
.distribution-order-layout {
  :deep(.el-form--inline .el-form-item) {
    width: 45%
  }
}
</style>