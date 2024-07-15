<template>
  <div>
    <div v-if="route.query.name == 'report'">
      <div class="table-container">
        <div class="form-container">
          <div class="form-title">
            <h3>扫描报告</h3>
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
          <!-- 筛选条件 -->
          <div class="form-params"
               :style="isShow ? 'height:120px' : 'height:60px'">
            <div class="more-filter-btn">
              <el-button @click="isShow = !isShow"
                         link
                         type="primary"
                         :icon="isShow ? 'ArrowUpBold' : 'ArrowDownBold'">
                {{ isShow ? '收起' : '展开' }}
              </el-button>
            </div>
            <el-form :inline="true"
                     :model="params">
              <el-form-item style="border-right:var(--el-table-border);padding-right:20px">
                <el-radio-group v-model="params.task_type"
                                @change="getTableData">
                  <el-radio-button label="漏洞扫描"
                                   :value="2" />
                  <el-radio-button label="资产扫描"
                                   :value="1" />
                  <el-radio-button label="web扫描"
                                   :value="3" />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="关键字">
                <el-input v-model="params.id_or_name"
                          clearable />
              </el-form-item>
              <el-form-item label="扫描状态">
                <el-select v-model="params.status"
                           style="width: 240px">
                  <el-option label="等待扫描"
                             :value="0" />
                  <el-option label="任务入库"
                             :value="1" />
                  <el-option label="正在扫描"
                             :value="2" />
                  <el-option label="扫描完成"
                             :value="4" />
                  <el-option label="扫描暂停"
                             :value="5" />
                  <el-option label="异常停止"
                             :value="8" />
                  <el-option label="下发失败"
                             :value="9" />
                </el-select>
              </el-form-item>
              <el-form-item label="开始时间">
                <el-date-picker v-model="params.scan_time_start"
                                type="datetime"
                                placeholder="请选择"
                                value-format="YYYY-MM-DD hh:mm:ss" />
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker v-model="params.scan_time_end"
                                type="datetime"
                                placeholder="请选择"
                                value-format="YYYY-MM-DD hh:mm:ss" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="table-box">
          <table-unit :columns="params.task_type == 1 ? columns : columns1"
                      :currentPage="params.page"
                      :list="list"
                      :total="total1"
                      @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange">
            <template v-slot="record">
              <el-button size="small"
                         type="primary"
                         link
                         @click="resultFN(record.record)">扫描结果</el-button>
              <el-button size="small"
                         type="primary"
                         link
                         @click="downloadReport(record.record)">下载报告</el-button>
              <el-button size="small"
                         type="primary"
                         link
                         @click="jumpReport(record.record)">报告</el-button>
              <el-button size="small" link type="primary" v-if="record.record.status == 0 || record.record.status == 2" @click="changeStFn(record.record,'5')">暂停</el-button>
              <el-button size="small" link type="primary" v-if="record.record.status == 5" @click="changeStFn(record.record,'2')">继续</el-button>
              <el-button size="small" link type="primary" v-if="record.record.status == 0 || record.record.status == 2" @click="changeStFn(record.record,'4')">停止</el-button>
            </template>
          </table-unit>
        </div>
      </div>
    </div>

    <div class="table-container"
         v-if="route.query.name == 'quest'">
      <div class="form-container">
        <div class="form-title">
          <h3>
            <el-page-header @back="backIndex"
                            icon="ArrowLeft">
              <template #content>
                <span>扫描报告</span><i style="font-weight:400;font-size:13px;margin-left:20px">{{route.query.designation}}</i>
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
                        clearable />
            </el-form-item>
            <el-form-item label="扫描结果">
              <el-select v-model="params.status"
                         style="width: 240px">
                <el-option label="等待扫描"
                           :value="0" />
                <el-option label="任务入库"
                           :value="1" />
                <el-option label="正在扫描"
                           :value="2" />
                <el-option label="扫描完成"
                           :value="4" />
                <el-option label="扫描暂停"
                           :value="5" />
                <el-option label="异常停止"
                           :value="8" />
                <el-option label="下发失败"
                           :value="9" />
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker v-model="params.scan_time_start"
                              type="datetime"
                              placeholder="请选择"
                              value-format="YYYY-MM-DD hh:mm:ss" />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="params.scan_time_end"
                              type="datetime"
                              placeholder="请选择"
                              value-format="YYYY-MM-DD hh:mm:ss" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit :columns="params.task_type == 1 ? columns : columns1"
                    :currentPage="params.page"
                    :list="list"
                    :total="total1"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button size="small"
                       type="primary"
                       link
                       @click="resultFN(record.record)">扫描结果</el-button>
            <el-button size="small"
                       type="primary"
                       link
                       @click="downloadReport(record.record)">下载报告</el-button>
            <el-button size="small"
                       type="primary"
                       link
                       @click="jumpReport(record.record)">报告</el-button>
            <el-button size="small" link type="primary" v-if="record.record.status == 0 || record.record.status == 2" @click="changeStFn(record.record,'5')">暂停</el-button>
            <el-button size="small" link type="primary" v-if="record.record.status == 5" @click="changeStFn(record.record,'2')">继续</el-button>
            <el-button size="small" link type="primary" v-if="record.record.status == 0 || record.record.status == 2" @click="changeStFn(record.record,'4')">停止</el-button>
            <!-- <el-button size="small" type="primary" link @click="editRow(record.record)">扫描报告</el-button> -->
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
import * as api from './api';
let isShow = ref(false);
let dialogVisible = ref(false);
let params: any = ref({
	id_or_name: '',
	status: '',
	scan_time_start: '',
	scan_time_end: '',
	scantask_id: '',
	task_type: 1,
	page: 1,
	limit: 30,
});
let columns = ref([
	{
		title: '名称',
		dataIndex: 'name',
	},
	{
		title: ' 扫描开始时间',
		dataIndex: 'time_start_scan',
	},
	{
		title: '扫描结束时间',
		dataIndex: 'time_end_scan',
	},
	{
		title: '耗时',
		dataIndex: 'use_time',
	},
	{
		title: '扫描状态',
		dataIndex: 'status_name',
    isStatus: true,
	},
	{
		title: '资产数量',
		dataIndex: 'asset_count',
	},
  {
		title: '进度',
		dataIndex: 'process',
		width: 200,
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 330,
	},
]);
let columns1 = ref([
	{
		title: '名称',
		dataIndex: 'name',
	},
	{
		title: ' 扫描开始时间',
		dataIndex: 'time_start_scan',
	},
	{
		title: '扫描结束时间',
		dataIndex: 'time_end_scan',
	},
	{
		title: '耗时',
		dataIndex: 'use_time',
	},
	{
		title: '扫描状态',
		dataIndex: 'status_name',
    isStatus: true,
	},
	{
		title: '漏洞数量',
		dataIndex: 'vuln_count',
	},
  {
		title: '进度',
		dataIndex: 'process',
		width: 200,
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 330,
	},
]);
let list = ref();
let total1 = ref(0);
// 切换状态
const changeStFn = async (val: any, name: any) => {
	ElMessageBox.confirm('是否确认修改吗', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		let res = await api.getOperateData({ id: val.id, status: Number(name) });
		ElMessage.success('修改成功');
		getTableData();
	});
};

// 下载扫描报告
const downloadReport = async (row?: any) => {
	let { data } = await api.reportUrlGet({ id: row.id, report_type: 'pdf' });
	window.open(data[0].report_url, '_black');
};

// 跳转报告
const jumpReport = async (row?: any) => {
	let { data } = await api.reportUrlGet({ id: row.id, report_type: 'html' });
	window.open(data[0].report_url, '_black');
};
const getTableData = async () => {
	params.value.task_type = route.query.num || params.value.task_type;
	let { data, total } = await api.GetList(params.value);
	list.value = data;
	total1.value = total;
};

const resultFN = (val: any) => {
	router.push({
		path: '/scan-manage/scanning-report/assets-result',
		query: { resultId: val.id, num: params.value.task_type, nextName: val.name, ...route.query },
	});
};
const backIndex = () => {
	router.push('/scan-manage/scanning-task');
};
const editRow = (row: any) => {
	router.push('/scan-manage/scanning-report/report');
};
// 重置
const resetFn = () => {
	params.value = {
		id_or_name: '',
		status: '',
		scan_time_start: '',
		scan_time_end: '',
		scantask_id: '',
		task_type: 1,
		page: 1,
		limit: 30,
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

const getIdQuery = () => {
	if (route.query.id == undefined || route.query.id == '') {
		route.query.name = 'report';
		getTableData();
	} else {
		params.value.scantask_id = route.query.id;
		getTableData();
	}
};
getIdQuery();
</script>

<style scoped lang="scss">
</style>