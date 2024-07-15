
<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import * as api from './api';
import { Session } from '@/utils/storage';
const userInfo = Session.get('userInfo');

const columns = [
	{ title: '序号', dataIndex: 'id', width: 80 },
	{ title: '报备概要', dataIndex: 'check_desc' },
	{ title: '检测类型', dataIndex: 'check_type' },
	{ title: '源地址', dataIndex: 'source_addr' },
	{ title: '源地址说明', dataIndex: 'source_addr_desc' },
	{ title: '目标地址', dataIndex: 'target_addr' },
	{ title: '目标地址说明', dataIndex: 'target_addr_desc' },
	{ title: '开始时间', dataIndex: 'start_time' },
	{ title: '结束时间', dataIndex: 'end_time' },
	{ title: '报备公司', dataIndex: 'report_company' },
	{ title: '报备人员', dataIndex: 'report_person' },
	{ title: '报备时间', dataIndex: 'create_datetime' },
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
let params = ref({
	page: 1,
	limit: 30,
	source_addr: '',
	target_addr: '',
	check_type: '',
	report_person: '',
});
// 获取
const fetchTableData = async () => {
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
		source_addr: '',
		target_addr: '',
		check_type: '',
		report_person: '',
	};
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
	source_addr: '',
	source_addr_desc: '',
	target_addr: '',
	target_addr_desc: '',
	start_time: '',
	end_time: '',
	check_type: '',
	check_desc: '',
	report_company: '',
});
interface RuleForm {
	id: null | string;
	source_addr: null | string;
	source_addr_desc: null | string;
	target_addr: null | string;
	target_addr_desc: null | string;
	end_time: null | string;
	start_time: null | string;
	check_type: null | string;
	check_desc: null | string;
	report_company: null | string;
}
const rules = ref<FormRules<RuleForm>>({
	source_addr: [
		{
			required: true,
			message: '请输入源地址',
			trigger: 'blur',
		},
	],
	target_addr: [
		{
			required: true,
			message: '请输入目标地址',
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
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>安全检测报备</h3>
          <div class="button-box">
            <el-button @click="dialogVisible=true;editRowData={}"
                       link
                       type="primary"
                       icon="CirclePlus">新 增</el-button>
            <el-button type="primary"
                       @click="onSearch"
                       icon="Search">搜 索</el-button>
            <el-button @click="reSearch"
                       plain
                       icon="RefreshRight">重 置</el-button>

          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="源地址">
              <el-input v-model="params.source_addr"
                        clearable></el-input>

            </el-form-item>
            <el-form-item label="目标地址">
              <el-input v-model="params.target_addr"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="检测类型">
              <el-input v-model="params.check_type"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="报备人员">
              <el-input v-model="params.report_person"
                        clearable></el-input>
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
                    :pageSizes="[30,50,100,200,500]"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
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
               width="70%">
      <div>
        <el-form :model="editRowData"
                 ref="ruleFormRef"
                 :rules="rules"
                 label-suffix="："
                 label-width="auto">
          <el-form-item label="检测类型"
                        prop="check_type">
            <el-select clearable
                       v-model="editRowData.check_type">
              <el-option label="安全扫描"
                         value="安全扫描" />
              <el-option label="渗透测试"
                         value="渗透测试" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间"
                        prop="start_time">
            <el-date-picker v-model="editRowData.start_time"
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
          <el-form-item label="结束时间"
                        prop="end_time">
            <el-date-picker v-model="editRowData.end_time"
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
          <el-form-item label="报备概要"
                        prop="check_desc">
            <el-input type="textarea"
                      v-model="editRowData.check_desc"></el-input>
          </el-form-item>
          <el-form-item label="源地址"
                        prop="source_addr">
            <el-input type="textarea"
                      v-model="editRowData.source_addr"></el-input>
          </el-form-item>

          <el-form-item label="目标地址"
                        prop="target_addr">
            <el-input type="textarea"
                      v-model="editRowData.target_addr"></el-input>
          </el-form-item>
          <el-form-item label="源地址说明"
                        prop="source_addr_desc">
            <el-input type="textarea"
                      v-model="editRowData.source_addr_desc"></el-input>
          </el-form-item>
          <el-form-item label="目标地址说明"
                        prop="target_addr_desc">
            <el-input type="textarea"
                      v-model="editRowData.target_addr_desc"></el-input>
          </el-form-item>
          <el-form-item label="报备公司"
                        prop="report_company"
                        v-show="editRowData.id">
            <el-input disabled
                      v-model="editRowData.report_company"></el-input>
          </el-form-item>
          <el-form-item label="报备人员"
                        prop="report_person"
                        v-show="editRowData.id">
            <el-input disabled
                      v-model="editRowData.report_person"></el-input>
          </el-form-item>
          <el-form-item label="报备时间"
                        prop="create_datetime"
                        v-show="editRowData.id">
            <el-input disabled
                      v-model="editRowData.create_datetime"></el-input>
          </el-form-item>
        </el-form>
      </div>
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