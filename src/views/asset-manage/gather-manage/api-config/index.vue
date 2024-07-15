
<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import * as api from './api';
const columns = [
	{
		title: '接口地址',
		dataIndex: 'data_url',
	},
	{
		title: '管理员',
		dataIndex: 'creator_name',
	},
	// {
	//   title: '数据类型',
	//   dataIndex: 'data_type',

	// },
	// {
	//   title: '描述',
	//   dataIndex: 'desc',

	// },
	{
		title: '验证通过',
		dataIndex: 'is_valid$',

		isTag: true,
	},
	{
		title: '是否可用',
		dataIndex: 'is_usable$',

		isTag: true,
	},
	{
		title: '数据名称',
		dataIndex: 'name',
	},
	// {
	//   title: '登录密码',
	//   dataIndex: 'password',

	// },
	// {
	//   title: '登录用户',
	//   dataIndex: 'user',

	// },
	{
		title: '请求参数',
		dataIndex: 'req_data',
	},
	{
		title: '请求类型',
		dataIndex: 'req_type',
	},

	{
		title: '操作',
		dataIndex: 'operate',

		width: 300,
	},
];

let list = ref([]);
let total = ref<number>(0);
let params = ref({
	page: 1,
	limit: 30,
	data_url: '',
	admin: '',
	is_usable: '',
	is_valid: '',
});
// 获取
const fetchTableData = async () => {
	let res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
	if (Array.isArray(list.value)) {
		list.value.forEach((item: any) => {
			item.is_valid$ = item.is_valid ? { code: 1, value: '已通过' } : { code: 3, value: '未通过' };
			item.is_usable$ = item.is_usable ? { code: 1, value: '可用' } : { code: 3, value: '不可用' };
		});
	}
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
		data_url: '',
		admin: '',
		is_usable: '',
		is_valid: '',
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
	data_url: '',
	admin: '',
	data_type: '',
	desc: '',
	is_valid: '',
	is_usable: '',
	task_status: '',
	name: '',
	password: '',
	user: '',
	req_data: '',
	req_type: '',
});
interface RuleForm {
	id: null | string;
	data_url: null | string;
	admin: null | string;
	data_type: null | string;
	desc: null | string;
	is_valid: null | string;
	is_usable: null | string;
	task_status: null | string;
	name: null | string;
	password: null | string;
	user: null | string;
	req_data: null | string;
	req_type: null | string;
}
const rules = ref<FormRules<RuleForm>>({
	data_url: [{ required: true, message: '不能为空', trigger: 'blur' }],
	req_type: [{ required: true, message: '不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '不能为空', trigger: 'blur' }],
});

const editRow = async (val: any) => {
	editRowData.value = val;
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
const checkUrl = (val: any) => {
	api.checkUrl(val.id).then((res: any) => {
		if (res.code === 2000) {
			ElMessage.info(res.msg);
		}
	});
};
const disabledDate = (date: Date) => {
	return date.getTime() < Date.now() - 8.64e7;
};
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>接口配置</h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="onSearch"
                       icon="Search">搜 索</el-button>
            <el-button type="primary"
                       @click="reSearch"
                       plain
                       icon="RefreshRight">重 置</el-button>
            <el-button @click="dialogVisible=true;editRowData={}"
                       plain
                       icon="Plus">新 增</el-button>
          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="接口地址">
              <el-input v-model="params.data_url"
                        clearable></el-input>

            </el-form-item>
            <el-form-item label="管理员">
              <el-input v-model="params.admin"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="是否可用">
              <el-select v-model="params.is_usable"
                         clearable>
                <el-option label="是"
                           :value="true" />
                <el-option label="否"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="验证通过">
              <el-select v-model="params.is_valid"
                         clearable>
                <el-option label="是"
                           :value="true" />
                <el-option label="否"
                           :value="false" />
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
            <el-button size="small"
                       link
                       @click="checkUrl(record.record)">测试连接</el-button>
          </template>
        </table-unit>
      </div>
    </div>
    <el-dialog v-model="dialogVisible"
               title="任务新增/编辑"
               width="50%">
      <el-form :model="editRowData"
               ref="ruleFormRef"
               :rules="rules">
        <el-form-item label="数据名称"
                      prop="name">
          <el-input v-model="editRowData.name"></el-input>
        </el-form-item>
        <el-form-item label="接口地址"
                      prop="data_url">
          <el-input v-model="editRowData.data_url"></el-input>
        </el-form-item>
        <el-form-item label="请求类型"
                      prop="req_type">
          <el-input v-model="editRowData.req_type"></el-input>
        </el-form-item>
        <el-form-item label="数据类型"
                      prop="data_type">
          <el-input v-model="editRowData.data_type"></el-input>
        </el-form-item>
        <el-form-item label="登录密码"
                      prop="password">
          <el-input v-model="editRowData.password"></el-input>
        </el-form-item>
        <el-form-item label="登录用户"
                      prop="user">
          <el-input v-model="editRowData.user"></el-input>
        </el-form-item>
        <el-form-item label="请求参数"
                      prop="req_data">
          <el-input v-model="editRowData.req_data"></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="editRowData.desc"
                    :autosize="{ minRows: 2, maxRows: 10 }"
                    type="textarea" />
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
</style>