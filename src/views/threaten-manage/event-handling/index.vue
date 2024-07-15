<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import * as apis from './api';
// 定义变量内容
const route = useRoute();
const router = useRouter();
const columns = [
	{ title: 'ID', dataIndex: 'id', width: 100 },
	{ title: '提单人', dataIndex: 'reporter', width: 100 },
	{ title: '事件分类', dataIndex: 'kind$', width: 100 },
	{ title: '威胁程度', dataIndex: 'importance$', isTag: true, width: 100 },
	{ title: '提单时间', dataIndex: 'report_at', width: 160 },
	{ title: '告警时间', dataIndex: 'alarm_at', width: 160 },
	{ title: '事件进展', dataIndex: 'status$', isTag: true, width: 160 },
	{ title: '攻击IP', dataIndex: 'src_ip', width: 160 },
	{ title: '事件摘要', dataIndex: 'abstract' },
	{
		title: '操作',
		dataIndex: 'operate',
		width: 120,
	},
];
let height = ref(window.innerHeight - 240);
let list = ref([]);
let total = ref(0);
let date = ref([]);
let params = ref({
	page: 1,
	limit: 30,
	kind: undefined,
	importance: undefined,
	start_time: '',
	end_time: '',
	status: '0',
	ip: '',
	id: '',
	reporter: '',
});
let kindOptions = [
	{ value: '1', label: '内网' },
	{ value: '2', label: '互联网' },
	{ value: '3', label: '外联网' },
	{ value: '4', label: '其他' },
];
let importanceOptions = [
	{ value: '1', label: '一般' },
	{ value: '2', label: '重要' },
	{ value: '3', label: '紧急' },
];
let statusOptions = [
	{ value: '0', label: '【全部】待处置事件' },
	{ value: '1', label: '【监控】研判退回' },
	{ value: '2', label: '【研判】新增事件' },
	{ value: '3', label: '【研判】监控修改' },
	{ value: '4', label: '【研判】二线研判' },
	{ value: '5', label: '【研判】处置退回' },
	{ value: '6', label: '【处置】研判通过' },
	{ value: '7', label: '【办结】中途办结' },
	{ value: '8', label: '【完成】处置完成' },
	{ value: '9', label: '【挂起】事件挂起' },
];
let dialogVisible = ref(false);
let isShowMoreSearch = ref(false);
let settingNumber = ref(5);
let settingDialogVisible = ref(false);
let settingTimer = ref(undefined);

const tagFilter = (status: string) => {
	const tagsMap = {
		1: 'danger',
		2: 'warning',
		3: 'warning',
		4: 'warning',
		5: 'warning',
		6: 'primary',
		7: 'info',
		8: 'success',
		9: 'danger',
	};
	let key = String(status);
	return tagsMap[key];
};
const fetchTableData = async (val: any) => {
	if (Array.isArray(date.value) && date.value.length > 0) {
		params.value.start_time = date.value[0];
		params.value.end_time = date.value[1];
	} else {
		params.value.start_time = '';
		params.value.end_time = '';
	}
	const { data } = await apis.getThreat(params.value);
	total.value = data.total;
	list.value = data.items;
	list.value.forEach((i: any) => {
		switch (i.kind) {
			case 1:
				i.kind$ = '内网';
				break;
			case 2:
				i.kind$ = '互联网';
				break;
			case 3:
				i.kind$ = '外联网';
				break;
			case 4:
				i.kind$ = '其他';
				break;
			default:
				break;
		}
		switch (i.importance) {
			case 1:
				i.importance$ = { code: 5, value: '一般' };
				break;
			case 2:
				i.importance$ = { code: 2, value: '重要' };
				break;
			case 3:
				i.importance$ = { code: 3, value: '紧急' };
				break;
			default:
				break;
		}
		switch (i.status) {
			case 0:
				i.status$ = { code: 4, value: '【全部】待处置事件' };
				break;
			case 1:
				i.status$ = { code: 3, value: '【监控】研判退回' };
				break;
			case 2:
				i.status$ = { code: 2, value: '【研判】新增事件' };
				break;
			case 3:
				i.status$ = { code: 2, value: '【研判】监控修改' };
				break;
			case 4:
				i.status$ = { code: 2, value: '【研判】二线研判' };
				break;
			case 5:
				i.status$ = { code: 2, value: '【研判】处置退回' };
				break;
			case 6:
				i.status$ = { code: 5, value: '【处置】研判通过' };
				break;
			case 7:
				i.status$ = { code: 4, value: '【办结】中途办结' };
				break;
			case 8:
				i.status$ = { code: 1, value: '【完成】处置完成' };
				break;
			case 9:
				i.status$ = { code: 3, value: '【挂起】事件挂起' };
				break;
			default:
				break;
		}
	});
};

const handleSizeChange = (val: any) => {
	params.value.limit = val;
	params.value.page = 1;
	fetchTableData();
};
const handleCurrentChange = (val: any) => {
	params.value.page = val;
	fetchTableData();
};
const reSearch = () => {
	date.value = [];
	params.value = {
		page: 1,
		limit: 30,
		kind: undefined,
		importance: undefined,
		start_time: '',
		end_time: '',
		status: '0',
		ip: '',
		id: '',
		reporter: '',
	};
	fetchTableData();
};

const handleCreate = () => {
	router.push({ path: '/threaten-manage/event-handling/event-edit', query: { ...params.value } });
};
const handleUpdate = (row: any) => {
	router.push({ path: '/threaten-manage/event-handling/event-edit', query: { editId: row.id, editStatus: row.status, ...params.value } });
};

const handleDelete = (row: any) => {
	ElMessageBox.confirm('此操作将删除该记录, 是否继续?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		apis.deleteThreat({ id: row.id }).then(() => {
			ElNotification({
				title: '成功',
				message: '删除成功',
				type: 'success',
				duration: 2000,
			});
			fetchTableData();
		});
	});
};
const handleFilter = () => {
	params.value.page = 1;
	fetchTableData();
};
const confiRmregularSetting = (isStart: boolean) => {
	if (isStart) {
		if (settingTimer.value) {
			ElMessage.error('不可重复开启自动刷新设置，如需要另外设置时长，请关闭后再开启');
			return;
		}
		ElMessage.success('自动刷新设置已开启');
		settingDialogVisible.value = false;
		settingTimer.value = setInterval(() => {
			fetchTableData();
		}, settingNumber.value * 1000);
	} else {
		if (settingTimer.value) {
			clearInterval(settingTimer.value);
			ElMessage.success('自动刷新设置已关闭');
			settingDialogVisible.value = false;
		} else {
			ElMessage.warning('没有定时任务，无需关闭');
		}
	}
};

const initGetData = () => {
	if (route.query.limit && route.query.page) {
		route.query.limit = parseInt(route.query.limit as string);
		route.query.page = parseInt(route.query.page as string);
		for (let e in params.value) {
			params.value[e] = route.query[e];
		}
	}
	fetchTableData();
};
initGetData();
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>事件处置</h3>
          <div class="button-box">
            <el-button style="margin-left: 10px"
                       type="primary"
                       icon="CirclePlus"
                       link
                       @click="handleCreate">
              新增
            </el-button>
            <el-button style="margin-left: 10px"
                       type="primary"
                       link
                       icon="Tools"
                       @click="settingDialogVisible = true">
              设置自动刷新
            </el-button>
            <el-button type="primary"
                       icon="Search"
                       @click="handleFilter"> 搜 索 </el-button>
            <el-button type="primary"
                       @click="reSearch"
                       plain
                       icon="RefreshLeft">重 置</el-button>

          </div>
        </div>
        <div class="form-params"
             :style="isShowMoreSearch ? 'height:100%' : 'height:60px'">
          <div class="more-filter-btn">
            <el-button link
                       type="primary"
                       @click="isShowMoreSearch = !isShowMoreSearch"
                       :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
              {{ isShowMoreSearch ? '收起' : '展开' }}
            </el-button>
          </div>
          <el-form :inline="true"
                   label-width="auto">
            <el-form-item label="进展状态：">
              <el-select v-model="params.status"
                         placeholder="请选择完成进度"
                         clearable>
                <el-option v-for="item in statusOptions"
                           :key="item.index"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="IP地址：">
              <el-input v-model="params.ip"
                        @keydown.enter="handleFilter"
                        placeholder="请输入IP地址"
                        type="text" />
            </el-form-item>
            <el-form-item label="ID：">
              <el-input v-model="params.id"
                        @keydown.enter="handleFilter"
                        placeholder="请输入ID"
                        type="text" />
            </el-form-item>
            <el-form-item label="提单人：">
              <el-input v-model="params.reporter"
                        @keydown.enter="handleFilter"
                        placeholder="请输入提单人名称"
                        type="text" />
            </el-form-item>
            <el-form-item label="事件分类：">
              <el-select v-model="params.kind"
                         placeholder="请选择事件分类"
                         clearable>
                <el-option v-for="item in kindOptions"
                           :key="item.index"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="威胁程度：">
              <el-select v-model="params.importance"
                         placeholder="请选择威胁程度"
                         clearable>
                <el-option v-for="item in importanceOptions"
                           :key="item.index"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="告警时间：">
              <el-date-picker v-model="date"
                              type="datetimerange"
                              range-separator="至"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              align="right">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit :currentPage="params.page"
                    :pageSize="params.limit"
                    :columns="columns"
                    :list="list"
                    :total="total"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button plain
                       size="small"
                       link
                       type="primary"
                       @click="handleUpdate(record.record)">编辑/处置</el-button>
            <!-- <el-button plain
                       size="small"
                       link
                       type="danger"
                       @click="handleDelete(record.record)">删除</el-button> -->
          </template>
        </table-unit>
      </div>

    </div>
    <el-dialog title="自动刷新设置"
               v-model="settingDialogVisible"
               width="50%">
      <div class="block">
        <p>定时时间<b>（{{ settingNumber }}秒）</b></p>
        <el-slider :min="5"
                   v-model="settingNumber"></el-slider>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button @click="settingDialogVisible = false">取 消</el-button> -->
          <el-button type="success"
                     @click="confiRmregularSetting(false)">关闭自动刷新</el-button>
          <el-button type="primary"
                     @click="confiRmregularSetting(true)">确定 设置</el-button>
        </div>
      </template>

    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
@import '@/theme/mixins/formReset.scss';
</style>
