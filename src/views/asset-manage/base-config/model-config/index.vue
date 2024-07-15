<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as api from './api';
const router = useRouter();
const route: any = useRoute();
const columns = [
	{
		title: '资产模型',
		dataIndex: 'models_alias',
		isLink: true,
	},
	{
		title: '模型名称',
		dataIndex: 'models_name',
	},
	{
		title: '数据类型',
		dataIndex: 'data_type',
	},

	{
		title: '模型用途',
		dataIndex: 'models_purposes',
	},

	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
];
let modelForm: any = ref({
	models_name: '',
	data_type: '',
	models_alias: '',
	models_purposes: '',
});
let list = ref([]);
let params = ref({
	page: 1,
	limit: 30,
	models_name: '',
	data_type: '',
	models_alias: '',
	models_purposes: '',
});
let dialogVisible = ref(false);
let total = ref(0);
let isShowMoreSearch = ref(false);
const getTableData = async () => {
	const res = await api.GetList(params.value);
	list.value = res.data;
	total.value = res.total;
};
// getTableData();
if (route.query.limit && route.query.page) {
	route.query.limit = parseInt(route.query.limit as string);
	route.query.page = parseInt(route.query.page as string);
	params.value = {
		models_purposes: route.query.models_purposes,
		models_alias: route.query.models_alias,
		data_type: route.query.data_type,
		limit: route.query.limit,
		page: route.query.page,
		models_name: route.query.models_name,
	};
	getTableData();
} else {
	getTableData();
}
const handleSizeChange = (val: number) => {
	params.value.limit = val;
	getTableData();
};
const handleCurrentChange = (val: number) => {
	params.value.page = val;
	getTableData();
};
const onSearch = () => {
	params.value.page = 1;
	getTableData();
};
const reSearch = () => {
	params.value = {
		page: 1,
		limit: 30,
		models_name: '',
		data_type: '',
		models_alias: '',
		models_purposes: '',
	};
	getTableData();
};
const editRow = async (val: any) => {
	const res = await api.GetObj(val.id);
	modelForm.value = res.data;
	dialogVisible.value = true;
};
const delRow = async (val: any) => {
	ElMessageBox.confirm('确认删除吗', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		const res = await api.DelObj(val.id);
		if (res.code === 2000) {
			getTableData();
			ElMessage({
				type: 'success',
				message: res.msg,
			});
		}
	});
};
const confirmEdit = async () => {
	if (modelForm.value.id) {
		const res = await api.UpdateObj(modelForm.value);
		if (res.code === 2000) {
			ElMessage({
				message: res.msg,
				type: 'success',
			});
			getTableData();
			dialogVisible.value = false;
		}
	} else {
		const res = await api.AddObj(modelForm.value);
		if (res.code === 2000) {
			ElMessage({
				message: res.msg,
				type: 'success',
			});
			getTableData();
			dialogVisible.value = false;
		}
	}
};
const watchInfo = async (val: any) => {
	router.push({
		path: '/asset-manage/base-config/model-config/field-list',
		query: {
			...params.value,
			id: val.id,
			modelsName: val.models_alias,
			queryPathName: 'field-list',
		},
	});
};
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>模型管理</h3>
          <div class="button-box">
            <el-button link
                       type="primary"
                       @click="
								dialogVisible = true;
								modelForm = {};
							"
                       icon="Plus">新 增</el-button>
            <el-button type="primary"
                       @click="onSearch"
                       icon="Search">搜 索</el-button>
            <el-button type="primary"
                       @click="reSearch"
                       plain
                       icon="RefreshRight">重 置</el-button>

          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="模型名称">
              <el-input v-model="params.models_name"
                        clearable />
            </el-form-item>
            <el-form-item label="模型类型">
              <el-input v-model="params.data_type"
                        clearable />
            </el-form-item>
            <el-form-item label="模型别名">
              <el-input v-model="params.models_alias"
                        clearable />
            </el-form-item>
            <el-form-item label="模型用途">
              <el-input v-model="params.models_purposes"
                        clearable />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit :columns="columns"
                    @linkFun="watchInfo"
                    :currentPage="params.page"
                    :pageSize="params.limit"
                    :list="list"
                    :total="total"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button size="small"
                       link
                       type="primary"
                       @click="editRow(record.record)">编辑</el-button>
            <el-button size="small"
                       link
                       type="danger"
                       @click="delRow(record.record)">删除</el-button>
          </template>
        </table-unit>
      </div>
    </div>
    <el-dialog v-model="dialogVisible"
               title="新增/编辑模型"
               width="50%">
      <el-form :model="modelForm"
               label-width="auto">
        <el-form-item label="模型名称">
          <el-input v-model="modelForm.models_name" />
        </el-form-item>
        <el-form-item label="模型类型">
          <el-input v-model="modelForm.data_type" />
        </el-form-item>
        <el-form-item label="模型别名">
          <el-input v-model="modelForm.models_alias" />
        </el-form-item>
        <el-form-item label="模型用途">
          <el-input v-model="modelForm.models_purposes" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="confirmEdit"> 确 认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped></style>
