<template>
  <div class="ALLdata">
    <dp title="安全基线检测任务结果详情"
        desc=" "
        @back="backIndex">
      <el-form :inline="true"
               :model="knownAPIListGetApiObj"
               class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input v-model="knownAPIListGetApiObj.ip"
                    placeholder="请输入关键字"
                    clearable />
        </el-form-item>
        <el-form-item label="检查结果">
          <el-select v-model="knownAPIListGetApiObj.dept"
                     placeholder="全部"
                     style="width: 240px"
                     clearable>
            <el-option label="长亭"
                       value="长亭" />
            <el-option label="启明"
                       value="启明" />
            <el-option label="绿盟"
                       value="绿盟" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="searchList">搜索</el-button>
          <el-button @click="Reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <el-row class="demo-tabs">
          <el-col :span="24"
                  class="left">
            <el-button :type="angleView == '检测视角' ? 'primary' : ''"
                       plain
                       @click="switchView('检测视角')">
              检测视角
            </el-button>
            <el-button :type="angleView == '主机视角' ? 'primary' : ''"
                       plain
                       @click="switchView('主机视角')">
              主机视角
            </el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <table-unit :columns="angleView == '检测视角' ? detectionColumns:hostColumns"
                    :list="angleView == '检测视角' ? detectionList:hostList"
                    :topColShow="false"
                    :total="total"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button v-if="angleView == '检测视角'"
                       size="small"
                       type="primary"
                       link
                       @click="detectionResult(record.record)">
              详情
            </el-button>
            <el-button v-if="angleView == '主机视角'"
                       size="small"
                       type="primary"
                       link
                       @click="hostDistribution(record.record)">
              派发工单
            </el-button>
            <el-button v-if="angleView == '主机视角'"
                       size="small"
                       type="primary"
                       link
                       @click="hostResult(record.record)">
              详情
            </el-button>
          </template>
        </table-unit>
      </div>
    </dp>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// 工单表单头
let detectionColumns = [
	{
		title: '序号',
		dataIndex: '1',
	},
	{
		title: '检测名称',
		dataIndex: '2',
	},
	{
		title: '检测类别',
		dataIndex: '3',
	},
	{
		title: '检测结果',
		dataIndex: '4',
		isTag: true,
	},
	{
		title: '未通过资产数',
		dataIndex: '5',
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];
let detectionList = [{ 1: '1', 2: '内网安全基线检查任务', 4: { code: 1, value: '已通过' } }];
let hostColumns = [
	{
		title: '序号',
		dataIndex: '1',
	},
	{
		title: 'IP地址',
		dataIndex: '2',
	},
	{
		title: '所属业务系统',
		dataIndex: '3',
	},
	{
		title: '组件数据库',
		dataIndex: '4',
	},
	{
		title: '所属公司',
		dataIndex: '5',
	},
	{
		title: '所属部门',
		dataIndex: '6',
	},
	{
		title: '主机管理员',
		dataIndex: '7',
	},
	{
		title: '数据中心',
		dataIndex: '8',
	},
	{
		title: '机房',
		dataIndex: '9',
	},
	{
		title: '部署区域',
		dataIndex: '10',
	},
	{
		title: '结果',
		dataIndex: '11',
		isTag: true,
	},
	{
		title: '未通过项',
		dataIndex: '12',
		isTag: true,
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];
let hostList = [{ 1: '1', 2: '安全运营平台', 11: { code: 1, value: '已通过' } }];
let total = ref(0);
const handleSizeChange = (val: number) => {
	console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
	console.log('handleCurrentChange');
};
//检测详情事件
const detectionResult = (val: any) => {
	router.push({ path: '/baseline-manage/security-baseline-detection/page/security-baseline-detection-detection/index', query: {} });
};
//主机详情事件
const hostResult = (val: any) => {
	// router.push({path:'/baseline-manage/security-baseline-detection/page/security-baseline-resultdetails/index',query:{}})
};
//检测详情事件
const hostDistribution = (val: any) => {
	// router.push({path:'/baseline-manage/security-baseline-detection/page/security-baseline-resultdetails/index',query:{}})
};
const knownAPIListGetApiObj = ref({});
//搜索事件
const searchList = () => {
	console.log('searchList');
};
//
const Reset = () => {
	console.log('Reset');
};

//返回事件
const backIndex = () => {
	router.push({ path: '/baseline-manage/security-baseline-detection/page/security-baseline-detection-result/index', query: {} });
};

// 检测视角与主机视角的切换
const angleView = ref('检测视角');

//
const switchView = (val: string) => {
	angleView.value = val;
};
</script>

<style lang="scss" scoped>
@import '@/theme/mixins/index.scss';
.ALLdata {
	border-radius: 10px;

	.demo-form-inline {
		background: #ffffff;
		padding: 16px;
		margin: 5px;
	}
	.demo-tabs {
		background: #ffffff;
		padding: 6px;
		margin: 5px;

		.right {
			display: flex;
			justify-content: end;
		}
	}
	.tree_table {
		background: #ffffff;
		margin: 5px;
	}
}
</style>