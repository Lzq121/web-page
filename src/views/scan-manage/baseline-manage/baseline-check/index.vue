<template>
	<div class="ALLdata">
		<el-form :inline="true" :model="knownAPIListGetApiObj" class="demo-form-inline">
			<el-form-item label="关键字">
				<el-input v-model="knownAPIListGetApiObj.ip" placeholder="请输入关键字" clearable />
			</el-form-item>
			<el-form-item label="检查范围">
				<el-select v-model="knownAPIListGetApiObj.dept" placeholder="全部" style="width: 240px" clearable>
					<el-option label="长亭" value="长亭" />
						<el-option label="启明" value="启明" />
						<el-option label="绿盟" value="绿盟" />
				</el-select>
			</el-form-item>
			<el-form-item label="任务状态">
				<el-select v-model="knownAPIListGetApiObj.network_area" placeholder="全部" style="width: 240px" clearable>
					<el-option label="长亭" value="长亭" />
						<el-option label="启明" value="启明" />
						<el-option label="绿盟" value="绿盟" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="searchList">搜索</el-button>
				<el-button @click="Reset">重置</el-button>
        <el-button type="primary" @click="baselineAdd">新增任务</el-button>
			</el-form-item>
		</el-form>
		<div class="table-box">
			<!-- 表格 -->
			<table-unit :columns="columns" :list="list" :topColShow="false" :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
				<template v-slot="record">
					<el-button size="small" type="primary" link @click="result(record.record)">结果</el-button>
					<el-button size="small" type="primary" link @click="details(record.record)">编辑</el-button>
				</template>
			</table-unit>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {useRouter} from 'vue-router'
const router = useRouter()
// 工单表单头
let columns = [
	{
		title: '任务ID',
		dataIndex: 'secure_id',
	},
	{
		title: '任务名称',
		dataIndex: 'secure_name',
	},
	{
		title: '检测范围',
		dataIndex: 'secure_range',
	},
	{
		title: '执行频率',
		dataIndex: 'secure_frequency',
		width: 300,
	},
	{
		title: '任务状态',
		dataIndex: 'secure_status',
		isTag: true
	},
	{
		title: '创建人',
		dataIndex: 'secure_people',
	},
	{
		title: '创建时间',
		dataIndex: 'secure_time',
		isTag:true
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];
let list = [{ secure_id: 'LD45456565', secure_name: '内网安全基线检查任务' ,secure_status:{code:1,value:'开启'}, secure_people: '张三'}];
let total = ref(0);
const handleSizeChange = (val: number) => {
	console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
	console.log('handleCurrentChange');
};
//编辑事件
const details = (val: any) => {
	// router.push({path:'/workbench/work-order-management/page/work-order-management-details/index',query:{}})
}
//结果事件
const result = (val: any) => {
	router.push({path:'/baseline-manage/security-baseline-detection/page/security-baseline-detection-result/index',query:{}})
}
const knownAPIListGetApiObj = ref({})
//搜索事件
const searchList = ()=>{
	console.log("searchList")
}
//
const Reset = ()=>{
	console.log("Reset")
}


//基线添加事件
const baselineAdd = ()=>{
  router.push({path:'/baseline-manage/security-baseline-detection/page/security-base-line-detection-add/index',query:{}})
}

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