<template>
  <div class="ALLdata">
    <dp title="视角详情"
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
        <dl class="dl-container">
          <dt class="dl-title ">检测项信息</dt>
          <dd class="dl-content">
            <!-- <div class="dl-post">
                            <div class="dl-left">1</div>
                            <div class="dl-right">2</div>
                        </div> -->
          </dd>
        </dl>
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
                       @click="result(record.record)">操作</el-button>
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
		title: '操作',
		dataIndex: 'operate',
	},
];
let list = [{ 1: '1', 2: '安全运营平台', 11: { code: 1, value: '已通过' } }];
let total = ref(0);
const handleSizeChange = (val: number) => {
	console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
	console.log('handleCurrentChange');
};
//操作事件
const result = (val: any) => {
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
	router.push({ path: '/baseline-manage/security-baseline-detection/page/security-baseline-resultdetails/index', query: {} });
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
/* .dl-post {
    .dl-left {
        width:60%;
        background:red;
    }
} */
</style>