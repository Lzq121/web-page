<template>
	<div class="distribution-order-layout">
		<dp title="工单详情" desc="" @back="backIndex">
			<div>
				<dl class="dl-container">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>
							漏洞信息
							<el-button style="margin-left: 20px" size="small" type="success" plain>已通知</el-button>
						</span>
						<span>
							<el-button style="margin-left: 20px" size="small" type="primary">认领</el-button>
							<el-button style="margin-left: 20px" size="small" type="danger">驳回</el-button>
						</span>
					</dt>
					<dd class="dl-content">
						<el-form :inline="true" label-width="100px" :model="detailInfo">
							<el-form-item label="工单ID">
								<span>{{ detailInfo.sn_id }}</span>
							</el-form-item>
							<el-form-item label="工单名称">
								<span>{{ detailInfo.title }}</span>
							</el-form-item>
							<el-form-item label="工单类型">
								<span>{{ detailInfo.type }}</span>
							</el-form-item>
							<el-form-item label="填单人">
								<span>{{ detailInfo.creat_user }}</span>
							</el-form-item>
							<el-form-item label="工单发布时间">
								<span>{{ detailInfo.creat_time }}</span>
							</el-form-item>
							<!-- <el-form-item label="填单人单位">
								<span>{{ detailInfo. }}</span>
							</el-form-item> -->
							<!-- <el-form-item label="填单人电话">
                <span>{{ detailInfo. }}</span>
							</el-form-item> -->
							<!-- <el-form-item label="填单人邮箱">
								<span>{{ detailInfo. }}</span>
							</el-form-item> -->
							<el-form-item label="工单状态">
								<span>{{ detailInfo.status }}</span>
							</el-form-item>
							<el-form-item label="描述信息">
								<span>{{ detailInfo.desc }}</span>
							</el-form-item>
						</el-form>
					</dd>
				</dl>
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
				<dl class="dl-container">
					<dt class="dl-title">处置流程信息</dt>
					<dd class="dl-content">
						<table class="m_table" style="text-align: center">
							<tr>
						
								<td>状态</td>
								<td>处理时间</td>
								<td>处置节点</td>
								<td>处置意见</td>
								<td>部门</td>
								<td>处置人</td>
							</tr>
							<tr v-for="(item, index) in itsmList" :key="index">
						
								<td>{{ item.status }}</td>
								<td>{{ item.handle_time }}</td>
								<td>{{ item.node }}</td>
								<td>{{ item.proposal }}</td>
								<td>{{ item.department }}</td>
								<td>{{ item.persion }}</td>
							</tr>
						</table>
					</dd>
				</dl>
				<dl class="dl-container" v-if="false">
					<dt class="dl-title">漏洞信息</dt>
					<dd class="dl-content">
						<!-- <div style="text-align:right;padding:0 10px 10px 10px 10px">
                            <el-button link type="primary" icon="Download">导出数据</el-button>
                            <el-button link type="primary" icon="Plus">新增资产</el-button>
                        </div> -->
						<table-unit
							:height="500"
							:pageSize="params.limit"
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

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
import apis from '../../api';
const backIndex = () => {
	router.push({ path: '/workbench/work-order-management', query: {} });
	//   router.push({ path: `${route.query.url}`, query: {} })
};
//步骤数据
let scheduleData = ref({
	arr: [
		{ title: '发现漏洞', desc: '', time: '' },
		{ title: '漏洞评估', desc: '', time: ''  },
		{ title: '派发工单', desc: '', time: ''  },
		{ title: '认领工单', desc: '', time: ''  },
		{ title: '验证漏洞', desc: '', time: ''  },
		{ title: '已修复' , desc: '', time: '' },
	],
	active: 1,
});

let params = ref({
	page: 1,
	limit: 30,
});

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
let detailInfo: any = ref({});
detailInfo.value = JSON.parse(route.query.detailInfo);
let itsmList = ref([]);
let scheduleList = ref([]);
if (detailInfo.value.sn_id) {
	const getItsmFlow = async () => {
		let res = await apis.getItsmFlowApi();
		itsmList.value = res.data;
	};
	getItsmFlow();
	const getSchedule = async () => {
		let res = await apis.getItsmScheduleApi();
		scheduleList.value = res.data;
		let obj = ref({});
		obj.value = res.data.pop();

		switch (obj.value.status) {
			case '修复':
				scheduleData.value.active = 6;
				
				break;
			case '验证漏洞':
				scheduleData.value.active = 5;
				break;
			case '认领工单':
				scheduleData.value.active = 4;
				break;
			case '派发工单':
				scheduleData.value.active = 3;
				break;
			default:
				scheduleData.value.active = 2;
				break;
		}
	};
	getSchedule();
}

let list = ref([{ '2': '测试数据' }, { '2': '测试数据' }, { '2': '测试数据' }, { '2': '测试数据' }, { '2': '测试数据' }, { '2': '测试数据' }]);
let total = ref(0);

const handleSelectionChange = (val: any) => {
	console.log(val);
};

const handleSizeChange = (val: number) => {
	params.value.page = 1;
	params.value.limit = val;
	// fetchTableData();
};

const handleCurrentChange = (val: number) => {
	params.value.page = val;
	// fetchTableData();
};
</script>

<style lang="scss" scoped>
.distribution-order-layout {
	:deep(.el-form--inline .el-form-item) {
		width: 45%;
	}
}
.dl-content {
	padding: 10px 0;
	margin-left: 5vw;
}
.el-row-top {
	margin-bottom: 0.8vw;
}
.span_one {
	width: 13.2vh;
	font-size: 2.5vh;
	display: inline-table;
	color: #7f8692;
}
</style>
