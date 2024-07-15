<template>
  <div class="ALLdata">
    <dp title="安全基线检测任务结果"
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
        <el-form-item label="扫描">
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
        <!-- 表格 -->
        <table-unit :columns="columns"
                    :list="list"
                    :topColShow="false"
                    :total="total"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button size="small"
                       type="primary"
                       link
                       @click="result(record.record)">结果详情</el-button>
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
let columns = [
	{
		title: '序号',
		dataIndex: '1',
	},
	{
		title: '报告名称',
		dataIndex: '2',
	},
	{
		title: '开始时间',
		dataIndex: '3',
	},
	{
		title: '结束时间',
		dataIndex: '4',
		width: 300,
	},
	{
		title: '耗时(min)',
		dataIndex: '5',
		isTag: true,
	},
	{
		title: '扫描结果',
		dataIndex: '6',
		isTag: true,
	},
	{
		title: '检查项数',
		dataIndex: '7',
	},
	{
		title: '未通过资产数',
		dataIndex: '8',
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];
let list = [{ 1: '1', 2: '内网安全基线检查任务', 6: { code: 1, value: '已通过' } }];
let total = ref(0);
const handleSizeChange = (val: number) => {
	console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
	console.log('handleCurrentChange');
};
//结果详情事件
const result = (val: any) => {
	router.push({ path: '/baseline-manage/security-baseline-detection/page/security-baseline-resultdetails/index', query: {} });
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
	router.push({ path: '/baseline-manage/security-baseline-detection', query: {} });
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