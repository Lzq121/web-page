<template>
  <div>
    <dp title="报告详情"
        desc="报告"
        @back="backIndex">
      <div class="table-container">
        <div class="form-container">
          <div class="form-title"
               style="justify-content: end">
            <div class="button-box">
              <el-button type="primary"
                         @click="searchFn"
                         icon="Search">搜 索</el-button>
              <el-button type="primary"
                         @click="resetFn"
                         plain
                         icon="RefreshRight">重 置</el-button>
              <!-- <el-button @click="isShow = !isShow" :icon="isShow ? 'ArrowUpBold' : 'ArrowDownBold'">
								{{ isShow ? '收起' : '展开' }}
							</el-button> -->
            </div>
          </div>
          <!-- 筛选条件 -->
          <div class="form-params"
               :style="isShow ? 'height:120px' : 'height:60px'">
            <el-form :inline="true"
                     :model="params">
              <el-form-item label="关键字">
                <el-input v-model="params.scan_name"
                          clearable />
              </el-form-item>
              <el-form-item label="任务类型">
                <el-select v-model="params.scan_firm"
                           style="width: 240px">
                  <el-option label="长亭"
                             value="长亭" />
                  <el-option label="启明"
                             value="启明" />
                  <el-option label="绿盟"
                             value="绿盟" />
                </el-select>
              </el-form-item>
              <el-form-item label="运行状态">
                <el-select v-model="params.is_use"
                           style="width: 240px">
                  <el-option label="启用"
                             :value="true" />
                  <el-option label="未启用"
                             :value="false" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- table -->
        <div class="table-box">
          <table-unit :columns="columns"
                      :list="list"
                      :total="total"
                      @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange">
            <template v-slot="record">
              <el-button size="small"
                         link
                         @click="resultFN(record.record)">扫描结果</el-button>
              <el-button size="small"
                         link
                         @click="editRow(record.record)">扫描报告</el-button>
            </template>
          </table-unit>
        </div>
      </div>
    </dp>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
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
		title: '报告名称',
		dataIndex: 'scan_name',
	},
	{
		title: '开始时间',
		dataIndex: 'scan_name1',
	},
	{
		title: '结束时间',
		dataIndex: 'scan_name',
	},
	{
		title: '耗时',
		dataIndex: 'scan_name',
	},
	{
		title: '是否完成',
		dataIndex: 'scan_name',
	},
	{
		title: '漏洞数量',
		dataIndex: 'scan_name',
	},
	{
		title: '后影响产数',
		dataIndex: 'scan_name',
	},
	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
];
let list = [
	{ scan_name: 'nihao', id: '1' },
	{ scan_name: 'nihao', id: '1' },
	{ scan_name: 'nihao', id: '1' },
	{ scan_name: 'nihao', id: '1' },
	{ scan_name: 'nihao', id: '1' },
	{ scan_name: 'nihao', id: '1' },
	{ scan_name: 'nihao', id: '1' },
	{ scan_name: 'nihao', id: '1' },
	{ scan_name: 'nihao', id: '1' },
	{ scan_name: 'nihao', id: '1' },
	{ scan_name: 'nihao', id: '1' },
];
let total = ref(0);

const resultFN = () => {
	console.log('resultFN');
	router.push('/scan-manage/scanning-task/scanReport');
};
const searchFn = () => {
	console.log('searchFn');
};
const editRow = (row: any) => {
	console.log('editRow');
	router.push('/scan-manage/scanning-task/details');
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
const backIndex = () => {
	router.go(-1);
	// router.push({ path: `${route.query.url}`, query: {} });
};
</script>

<style>
</style>