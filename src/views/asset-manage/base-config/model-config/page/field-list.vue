<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as api from './api';
const route = useRoute();
// 定义变量内容
let id = ref('');
let modelsName = ref('');
if (route.query.id) {
	id.value = route.query.id as string;
}
if (route.query.modelsName) {
	modelsName.value = route.query.modelsName as string;
}

const columns = [
	{
		title: '字段说明',
		dataIndex: 'field_help',
	},
	// {
	//   title: '字段类型',
	//   dataIndex: 'field_type',

	// },
	{
		title: '模型名称',
		dataIndex: 'models_manage_name',
	},
	{
		title: '数据来源模型名称',
		dataIndex: 'data_source_model_name',
	},
	{
		title: '数据来源字段名称',
		dataIndex: 'data_source_field_name',
	},

	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
];
let modelForm: any = ref({
	field_name: '',
	field_help: '',
	field_type: '',
	models_manage: '',
	data_source_model_name: '',
	data_source_field_name: '',
});
let modelList = ref([]);
let list = ref([]);
let params = ref({
	page: 1,
	limit: 30,
	field_name: '',
	field_type: '',
	models_manage: '',
	data_source_model_name: '',
	data_source_field_name: '',
	id: id.value,
});
let dialogVisible = ref(false);
let total = ref(0);
let isShowMoreSearch = ref(false);
const getModelList = async () => {
	const res = await api.getModelListApi(params.value);
	modelList.value = res.data;
	total.value = res.total;
};
getModelList();
const getTableData = async () => {
	const res = await api.GetList(params.value);
	list.value = res.data;
	total.value = res.total;
};
getTableData();
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
		field_name: '',
		field_type: '',
		models_manage: '',
		data_source_model_name: '',
		data_source_field_name: '',
		id: id.value,
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
const router = useRouter();
const back = () => {
	router.push({
		path: '/asset-manage/base-config/model-config',
		query: {
			...route.query,
		},
	});
};
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>
            <el-page-header @back="back"
                            icon="ArrowLeft">
              <template #content>
                <span> {{ modelsName }} </span>
              </template>
            </el-page-header>
          </h3>
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
            <el-form-item label="字段名称">
              <el-input v-model="params.field_name"
                        clearable />
            </el-form-item>
            <el-form-item label="字段类型">
              <el-input v-model="params.field_type"
                        clearable />
            </el-form-item>
            <el-form-item label="模型名称">
              <el-input v-model="params.models_manage"
                        clearable />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit :columns="columns"
                    :list="list"
                    :total="total"
                    :currentPage="params.page"
                    :pageSize="params.limit"
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
               title="新增/编辑"
               width="50%">
      <el-form :model="modelForm"
               label-width="auto">
        <el-form-item label="字段说明">
          <el-input v-model="modelForm.field_help" />
        </el-form-item>
        <el-form-item label="字段名称">
          <el-input v-model="modelForm.field_name" />
        </el-form-item>
        <el-form-item label="字段类型">
          <el-input v-model="modelForm.field_type" />
        </el-form-item>
        <el-form-item label="模型名称">
          <el-select v-model="modelForm.models_manage">
            <el-option v-for="model in modelList"
                       :key="model.id"
                       :label="model.models_name"
                       :value="model.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据来源模型名称">
          <el-input v-model="modelForm.data_source_model_name" />
        </el-form-item>
        <el-form-item label="数据来源字段名称">
          <el-input v-model="modelForm.data_source_field_name" />
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
