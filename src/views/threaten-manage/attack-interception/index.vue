
<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import * as api from './api';

import { Session } from '@/utils/storage';
const userInfo = Session.get('userInfo');

const pickerOptions = [
	{
		text: '最近1小时',
		value: () => {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000);
			return [start, end];
		},
	},
	{
		text: '最近24小时',
		value: () => {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24);
			return [start, end];
		},
	},
	{
		text: '最近7天',
		value: () => {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
			return [start, end];
		},
	},
];
const columns = [
	{ title: '拦截IP', dataIndex: 'attack_ip' },
	{ title: 'IP属地', dataIndex: 'attack_ip_addr' },
	{ title: '拦截时间', dataIndex: 'attack_time' },
	{ title: '设备类型', dataIndex: 'equipment_type' },
	{ title: '设备名称', dataIndex: 'equipment_name' },
	{ title: '拦截原因', dataIndex: 'attack_reason' },
	{ title: '拦截设备IP', dataIndex: 'attack_equipment_ip', hidden: true },
	{ title: '设备位置', dataIndex: 'equipment_addr', hidden: true },
	{ title: '目的IP', dataIndex: 'target_ip', hidden: true },
	{ title: '对应互联网应用系统', dataIndex: 'service_name', hidden: true },
];
if (userInfo.org === '管理组') {
	columns.push({
		title: '操作',
		dataIndex: 'operate',
		width: 150,
	});
}

let list = ref([]);
let total = ref<number>(0);
let isShowMoreSearch = ref(false);
let attack_time_range = ref([]);
let params = ref({
	page: 1,
	limit: 30,
	attack_ip: '',
	attack_equipment_ip: '',
	equipment_type: '',
	attack_reason: '',
	equipment_name: '',
	start_time: '',
	end_time: '',
});
// 获取
const fetchTableData = async () => {
	if (Array.isArray(attack_time_range.value) && attack_time_range.value.length === 2) {
		params.value.start_time = attack_time_range.value[0];
		params.value.end_time = attack_time_range.value[1];
	} else {
		params.value.start_time = '';
		params.value.end_time = '';
	}

	let res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
};

fetchTableData();

const onSearch = () => {
	params.value.page = 1;
	fetchTableData();
};
const reSearch = () => {
	params.value = {
		page: 1,
		limit: 30,
		attack_ip: '',
		attack_equipment_ip: '',
		equipment_type: '',
		attack_reason: '',
		equipment_name: '',
		start_time: '',
		end_time: '',
	};
	attack_time_range.value = [];
	fetchTableData();
};
const handleSizeChange = (val: number) => {
	params.value.limit = val;
	params.value.page = 1;
	fetchTableData();
};
const handleCurrentChange = (val: number) => {
	params.value.page = val;
	fetchTableData();
};
let dialogVisible = ref(false);
let editRowData = ref({
	id: null,
	attack_ip: '',
	attack_ip_addr: '',
	attack_time: '',
	attack_equipment_ip: '',
	equipment_type: '',
	equipment_addr: '',
	attack_reason: '',
	target_ip: '',
	service_name: '',
});
interface RuleForm {
	id: null | string;
	attack_ip: null | string;
	attack_ip_addr: null | string;
	attack_time: null | string;
	attack_equipment_ip: null | string;
	equipment_type: null | string;
	equipment_addr: null | string;
	attack_reason: null | string;
	target_ip: null | string;
	service_name: null | string;
}
const rules = ref<FormRules<RuleForm>>({
	attack_ip: [
		{
			required: true,
			message: '请正确输入IP',
			pattern:
				/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
			trigger: 'blur',
		},
	],
	attack_equipment_ip: [
		{
			required: true,
			message: '请正确输入IP',
			pattern:
				/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
			trigger: 'blur',
		},
	],
});

const editRow = async (val: any) => {
	const { data } = await api.GetObj(val.id);
	editRowData.value = data;
	dialogVisible.value = true;
};
const ruleFormRef = ref<FormInstance>();
const confirmEdit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			if (editRowData.value.id) {
				const res = await api.UpdateObj(editRowData.value);
				if (res.code === 2000) {
					ElMessage.success('编辑成功');
				}
			} else {
				const res = await api.AddObj(editRowData.value);
				if (res.code === 2000) {
					ElMessage.success('新增成功');
				}
			}
			fetchTableData();
			dialogVisible.value = false;
		}
	});
};

const delRow = (val: any) => {
	ElMessageBox.confirm('确认删除吗?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await api.DelObj(val.id);
			if (res.code === 2000) {
				ElMessage.success('删除成功');
				fetchTableData();
			}
		})
		.catch(() => {});
};
const excelOutExcel = async () => {
	ElMessageBox.prompt('自定义导出文件名', '提示', {
		confirmButtonText: '确认导出',
		cancelButtonText: '取消',
		inputPlaceholder: '请输入自定义文件名，无输入时使用默认文件名',
	})
		.then(({ value }) => {
			const data = {
				...params.value,
			};
			delete data.limit;
			delete data.page;
			if (value) {
				value = value + '.xlsx';
			} else {
				value = undefined;
			}
			api.downloadExcel(data, value);
		})
		.catch(() => {});
};
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>攻击拦截清单</h3>
          <div class="button-box">
            <span v-if="userInfo.username!='公告组'">
              <el-button type="primary"
                         @click="excelOutExcel"
                         link
                         icon="Download">导出数据</el-button>
              <importExcel api="/api/operate/attack-blocker-list/import/"
                           :apiSuffix="false">导入数据</importExcel>
              <el-button @click="dialogVisible=true;editRowData={}"
                         link
                         type="primary"
                         icon="CirclePlus">新 增</el-button>
            </span>
            <el-button type="primary"
                       @click="onSearch"
                       icon="Search">搜 索</el-button>
            <el-button @click="reSearch"
                       plain
                       icon="RefreshRight">重 置</el-button>
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
                   :model="params">
            <el-form-item label="拦截IP">
              <el-input v-model="params.attack_ip"
                        clearable
                        @keydown.enter="onSearch"></el-input>

            </el-form-item>
            <el-form-item label="拦截设备IP">
              <el-input v-model="params.attack_equipment_ip"
                        clearable
                        @keydown.enter="onSearch"></el-input>
            </el-form-item>
            <el-form-item label="设备名称">
              <el-input v-model="params.equipment_name"
                        clearable
                        @keydown.enter="onSearch"></el-input>
            </el-form-item>
            <el-form-item label="拦截原因">
              <el-input v-model="params.attack_reason"
                        clearable
                        @keydown.enter="onSearch"></el-input>
            </el-form-item>
            <el-form-item label="拦截时间">
              <el-date-picker v-model="attack_time_range"
                              type="datetimerange"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              :shortcuts="pickerOptions"
                              value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="设备类型">
              <el-select clearable
                         v-model="params.equipment_type">
                <el-option label="WAF"
                           value="WAF" />
                <el-option label="防火墙"
                           value="防火墙" />
              </el-select>
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
                    @handleCurrentChange="handleCurrentChange"
                    :pageSizes="[30,50,100,200,500]">
          <template v-slot="record">
            <el-button plain
                       size="small"
                       link
                       type="primary"
                       @click="editRow(record.record)">编辑</el-button>
            <el-button plain
                       size="small"
                       link
                       type="danger"
                       @click="delRow(record.record)">删除</el-button>
          </template>
        </table-unit>
      </div>
    </div>
    <el-dialog v-model="dialogVisible"
               :title="editRowData.id ? '任务详情':'新增任务'"
               width="50%">
      <el-form :model="editRowData"
               ref="ruleFormRef"
               label-width="auto"
               label-suffix="："
               :rules="rules">
        <el-form-item label="拦截IP"
                      prop="attack_ip">
          <el-input v-model="editRowData.attack_ip"></el-input>
        </el-form-item>
        <el-form-item label="IP属地"
                      prop="attack_ip_addr">
          <el-input v-model="editRowData.attack_ip_addr"></el-input>
        </el-form-item>
        <el-form-item label="拦截设备IP"
                      prop="attack_equipment_ip">
          <el-input v-model="editRowData.attack_equipment_ip"></el-input>
        </el-form-item>
        <el-form-item label="拦截时间"
                      prop="attack_time">
          <el-date-picker v-model="editRowData.attack_time"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="设备类型"
                      prop="equipment_type">
          <el-input v-model="editRowData.equipment_type"></el-input>
        </el-form-item>
        <el-form-item label="设备位置"
                      prop="equipment_addr">
          <el-input v-model="editRowData.equipment_addr"></el-input>
        </el-form-item>
        <el-form-item label="拦截原因"
                      prop="attack_reason">
          <el-input type="textarea"
                    v-model="editRowData.attack_reason"></el-input>
        </el-form-item>
        <el-form-item label="目的IP"
                      prop="target_ip">
          <el-input v-model="editRowData.target_ip"></el-input>
        </el-form-item>
        <el-form-item label="对应互联网应用系统"
                      prop="service_name">
          <el-input v-model="editRowData.service_name"></el-input>
        </el-form-item>
        <el-form-item label="录入人"
                      prop="report_person"
                      v-show="editRowData.id">
          <el-input disabled
                    v-model="editRowData.report_person"></el-input>
        </el-form-item>
        <el-form-item label="录入时间"
                      prop="create_datetime"
                      v-show="editRowData.id">
          <el-input disabled
                    v-model="editRowData.create_datetime"></el-input>
        </el-form-item>
        <el-form-item label="录入人公司"
                      prop="report_company"
                      v-show="editRowData.id">
          <el-input disabled
                    v-model="editRowData.report_company"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="confirmEdit(ruleFormRef)">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>


<style scoped lang="scss">
@import '@/theme/mixins/formReset.scss';
</style>