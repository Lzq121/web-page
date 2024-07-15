<template>
  <div>
    <div class="table-container">
      <h1 style="font-weight: 700; font-size: 18px; color: rgb(29, 33, 41)">漏洞信息</h1>
      <el-main style="line-height: 38px">
        <el-row v-for="item in rowAllList"
                :key="item.value">
          <el-col :span="2"
                  style="color: rgb(78, 89, 105); font-size: 16px">{{ item.label }}</el-col>
          <el-col :span="20"
                  style="color: rgb(39, 46, 59); font-size: 16px">{{ item.value }}</el-col>
        </el-row>
      </el-main>
      <!-- table -->
      <h1 style="font-weight: 700; font-size: 18px; color: rgb(29, 33, 41)">误报资产信息</h1>
      <div class="button-box">
        <el-button type="danger"
                   @click="searchFn">批量删除</el-button>
        <el-button type="primary"
                   @click="addAssFn">新增资产</el-button>
      </div>
      <div class="table-box">
        <table-unit :columns="columns"
                    :list="list"
                    :pageSize="params.limit"
                    :total="total"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button size="small"
                       link
                       @click="editRow(record.record)">详情</el-button>
          </template>
        </table-unit>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// import * as api from './api';

let isShow = ref(false);
let columns = [
	{
		title: '漏洞ID',
		dataIndex: 'scan_name',
	},
	{
		title: '漏洞名称',
		dataIndex: 'scan_name1',
	},
	{
		title: '漏洞类型',
		dataIndex: 'scan_name',
	},
	{
		title: '受影响产品',
		dataIndex: 'scan_name',
	},
	{
		title: '严重程度',
		dataIndex: 'scan_name',
	},
	{
		title: '误报产品数',
		dataIndex: 'scan_name',
	},
	{
		title: '漏洞描述',
		dataIndex: 'scan_name',
	},
	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
];
let rowAllList = [
	{
		label: '漏洞ID',
		value: '022112',
	},
	{
		label: '漏洞名称',
		value: '022112',
	},
	{
		label: '受影响产品',
		value: '022112',
	},
	{
		label: 'IP地址',
		value: '022112',
	},
];
let list = [{ scan_name: 'nihao', id: '1' }];
let total = ref(0);

const addAssFn = () => {
	console.log('addAssFn');
	router.push('/leak-manage/waring-list/addAssets');
};
// 搜索
const searchFn = () => {
	console.log('searchFn');
};
const editRow = () => {
	console.log('editRow');
	router.push('/leak-manage/waring-list/assetsDetails');
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
</script>

<style scoped lang="scss">
.table-container {
	width: 100%;
	background: #ffffff;
	padding: 10px;
	padding: 50px;
	.button-box {
		display: flex;
		justify-content: end;
		margin-bottom: 10px;
	}
}
</style>