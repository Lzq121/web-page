<template>
  <div>

    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>
            <el-page-header @back="backIndex"
                            icon="ArrowLeft">
              <template #content>
                <span>扫描结果</span><i style="font-weight:400;font-size:13px;margin-left:20px">{{route.query.nextName}}</i>
              </template>
            </el-page-header>
          </h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="getTableData"
                       icon="Search">搜 索</el-button>
            <el-button type="primary"
                       @click="resetFn"
                       plain
                       icon="RefreshRight">重 置</el-button>
          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="关键字">
              <el-input v-model="params.id_or_name"
                        clearable
                        style="width: 240px" />
            </el-form-item>
            <el-form-item label="任务类型">
              <el-select v-model="params.task_type"
                         placeholder="请选择"
                         style="width: 240px">
                <el-option label="资产扫描"
                           :value="1" />
                <el-option label="漏洞扫描"
                           :value="2" />
                <el-option label="WEB扫描"
                           :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="运行状态">
              <el-select v-model="params.status"
                         placeholder="请选择"
                         style="width: 240px">
                <el-option label="关闭"
                           :value="0" />
                <el-option label="开启"
                           :value="1" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit :columns="route.query.num == 2 || route.query.num == 3 ? columns1 : columns"
                    :currentPage="params.page"
                    :pageSize="params.limit"
                    :list="list"
                    :total="total1"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button size="small"
                       link
                       type="primary"
                       @click="editRow(record.record)">详情</el-button>
          </template>
        </table-unit>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
import * as api from '../api';
let isShow = ref(false);

let dialogVisible = ref(false);
let params = ref({
	id_or_name: '',
	task_type: '',
	scan_idc: '',
	status: '',
	page: 1,
	limit: 10,
});
let columns = [
	{
		title: 'IP',
		dataIndex: 'ip',
	},
	{
		title: '扫描状态',
		dataIndex: 'status_name',
	},
];
let columns1 = [
	{
		title: '漏洞名称',
		dataIndex: 'name',
	},
	{
		title: route.query.num == 3 ? '站点' : 'ip地址',
		dataIndex: route.query.num == 3 ? 'target__site' : 'target__ip',
	},
	{
		title: '漏洞描述',
		dataIndex: 'description',
	},
	{
		title: '发现日期',
		dataIndex: 'date_found',
	},
	{
		title: 'CEVID',
		dataIndex: 'cve_id',
	},
	{
		title: '扫描时间',
		dataIndex: 'time_start_scan',
	},
	{
		title: '修复建议',
		dataIndex: 'solution',
	},
	{
		title: '最近更新时间',
		dataIndex: 'update_datetime',
	},
	{
		title: '厂商和版本',
		dataIndex: 'device_firm_version',
	},
	{
		title: '数据来源',
		dataIndex: 'scanner_device',
	},

	{
		title: '操作',
		dataIndex: 'operate',
		width: 100,
	},
];
let list = ref();
let total1 = ref(0);

const getTableData = async () => {
	if (route.query.num == '1') {
		let { data, total } = await api.GetResultList(params.value);
		list.value = data;
		total1.value = total;
	} else {
		let { data, total } = await api.loopholeGetList(params.value);
		list.value = data;
		total1.value = total;
	}
};
// 获取ID
const getIdQuery = () => {
	params.value.id = route.query.resultId;
	getTableData();
};
const backIndex = () => {
	if (route.query.name == 'report') {
		router.push({ path: '/scan-manage/scanning-report' });
	} else {
		router.push({ path: '/scan-manage/scanning-report', query: route.query });
	}
};
getIdQuery();

getTableData();
const resultFN = () => {
	router.push('/scan-manage/scanning-report/assets-result');
};

const editRow = (row: any) => {
	router.push({ path: '/scan-manage/scanning-report/details', query: row });
};
// 重置
const resetFn = () => {
	params.value = {
		id_or_name: '',
		task_type: '',
		scan_idc: '',
		status: '',
		page: 1,
		limit: 10,
	};
	getTableData();
};
const handleSizeChange = (val: number) => {
	params.value.page = 1;
	params.value.limit = val;
	getTableData();
};
const handleCurrentChange = (val: number) => {
	params.value.page = val;
	getTableData();
};
</script>

<style>
</style>