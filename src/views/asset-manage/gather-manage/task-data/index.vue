
<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import api from './api';
const columns = [
	{
		title: '数据来源',
		dataIndex: 'data_source',
	},
	{
		title: '数据状态',
		dataIndex: 'label_status$',
		isTag: true,
	},
	{
		title: '数据类型',
		dataIndex: 'data_type',
	},
	{
		title: '数据',
		dataIndex: 'json_data',
	},
	{
		title: '数据标识',
		dataIndex: 'crux_info',
	},
	{
		title: '更新时间',
		dataIndex: 'update_datetime',
	},
];

let rawDataListOBJ = ref([]);
let total = ref<number>(0);
let params = ref({
	page: 1,
	limit: 30,
	data_source: '',
	data_type: '',
	label_status: undefined,
});
let dataSourceList = ref([]);
let dataTypeList = ref([]);
const getList = async () => {
	let { data } = await api.getList();
	dataSourceList.value = data.data_source;
	dataTypeList.value = data.data_type;
};
getList();

// 获取
const fetchTableData = async () => {
	let res = await api.rawDataListGetApi(params.value);
	total.value = res.total;
	rawDataListOBJ.value = res.data;
	rawDataListOBJ.value.forEach((element: any) => {
		switch (element.label_status) {
			case 0:
				element.label_status$ = { code: 1, value: '无变更' };
				break;
			case 1:
				element.label_status$ = { code: 2, value: '减量数据' };
				break;
			case 2:
				element.label_status$ = { code: 3, value: '增量数据' };
				break;
			case 3:
				element.label_status$ = { code: 4, value: '变更数据' };
				break;

			default:
				break;
		}
	});
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
		data_source: '',
		data_type: '',
		label_status: undefined,
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
let dataList: any = [];
const handleSelectionChange = (val: [any]) => {
	dataList = val;
};
const dataMerge = async () => {
	if (dataList.length === 0) {
		ElMessage.warning('请选择任务');
		return;
	}
	const data = dataList.map((item: any) => {
		return { id: item.id, data_source: item.data_source };
	});
	await api.mergeData({ merge_data: data });
	ElMessage.success('整合任务已下发');
};
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>任务数据</h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="onSearch"
                       icon="Search">搜 索</el-button>
            <el-button type="primary"
                       @click="reSearch"
                       plain
                       icon="RefreshRight">重 置</el-button>
            <el-button icon="Edit"
                       type="warning"
                       @click="dataMerge">数据整合</el-button>

          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="数据来源">
              <el-select v-model="params.data_source"
                         clearable>
                <el-option v-for="(item,index) in dataSourceList"
                           :key="index"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据类型">
              <el-select v-model="params.data_type"
                         clearable>
                <el-option v-for="(item,index) in dataTypeList"
                           :key="index"
                           :label="item"
                           :value="item" />

              </el-select>
            </el-form-item>
            <el-form-item label="数据状态">
              <el-select v-model="params.label_status"
                         clearable>
                <el-option label="无变更"
                           :value="0" />
                <el-option label="减量数据"
                           :value="1" />
                <el-option label="增量数据"
                           :value="2" />
                <el-option label="变更数据"
                           :value="3" />

              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit @handleSelectionChange="handleSelectionChange"
                    :isSelection="true"
                    :currentPage="params.page"
                    :pageSize="params.limit"
                    :columns="columns"
                    :list="rawDataListOBJ"
                    :total="total"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
        </table-unit>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
</style>