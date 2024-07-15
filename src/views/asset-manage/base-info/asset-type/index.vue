<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>资源类型</h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="assetTypeListGetApi1"
                       icon="Search">搜索</el-button>
            <el-button @click="reset"
                       type="primary"
                       plain
                       icon="RefreshRight">重置</el-button>
            <el-button icon="Plus"
                       @click="resourceDiaTF = true">新增</el-button>

          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="resourceTypeSearch">
            <el-form-item label="名称">
              <el-input v-model="resourceTypeSearch.name"
                        placeholder="请输入关键字"
                        clearable />
            </el-form-item>
            <el-form-item label="等级">
              <el-input v-model="resourceTypeSearch.level"
                        placeholder="请输入关键字"
                        clearable />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit :currentPage="resourceTypeSearch.page"
                    :pageSize="resourceTypeSearch.limit"
                    :columns="columns"
                    :list="resourceTypeList"
                    :total="total1"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button plain
                       size="small"
                       link
                       type="primary"
                       @click="editDiaFn(record.record)">编辑</el-button>
            <el-button plain
                       size="small"
                       link
                       type="danger"
                       @click="deleOne(record.record)">删除</el-button>
          </template>
        </table-unit>
      </div>
    </div>

    <!-- 新增 -->

    <el-dialog v-model="resourceDiaTF"
               title="新增/编辑"
               @close="closed">
      <el-form :model="resourceTypeForm">
        <el-form-item label="名称"
                      :label-width="formLabelWidth">
          <el-input v-model="resourceTypeForm.name"
                    placeholder="请输入" />
        </el-form-item>
        <el-form-item label="描述"
                      :label-width="formLabelWidth">
          <el-input v-model="resourceTypeForm.desc"
                    autocomplete="off"
                    placeholder="请输入" />
        </el-form-item>
        <el-form-item label="父类型名称"
                      :label-width="formLabelWidth">
          <el-select v-model="resourceTypeForm.parent_type_id"
                     placeholder="请选择">
            <el-option v-for="item in resourceOption"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据存储表"
                      :label-width="formLabelWidth">
          <el-input v-model="resourceTypeForm.to_data_table"
                    autocomplete="off"
                    placeholder="请输入" />
        </el-form-item>
        <el-form-item label="等级"
                      :label-width="formLabelWidth">
          <el-input v-model="resourceTypeForm.level"
                    autocomplete="off"
                    placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resourceDiaTF = false">取消</el-button>
          <el-button type="primary"
                     v-if="YandE"
                     @click="resourceTypeDiaFn"> 确认 </el-button>
          <el-button type="primary"
                     v-else
                     @click="resourceTypeDiaFnEdit"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>


<script lang="ts" setup >
import { ref } from 'vue';
import { assetTypeAPI } from './api';
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus';
import { nextTick } from 'process';
const tableHeight = window.innerHeight - 170;
let total1 = ref<number>(0);
const columns = [
	{
		title: '名称',
		dataIndex: 'name',
	},
	{
		title: '描述',
		dataIndex: 'desc',
	},
	{
		title: '父类型',
		dataIndex: 'parent_type_name',
	},
	{
		title: '数据存储表',
		dataIndex: 'to_data_table',
	},
	{
		title: '等级',
		dataIndex: 'level',
	},
	{
		title: '操作',
		dataIndex: 'operate',
	},
];

const formLabelWidth = '140px';
let resourceDiaTF = ref(false);
let resourceOption = ref();
let YandE = ref(true);
let resourceTypeData = ref();
let resourceTypeList = ref();
let resourceTypeSearch = ref({
	name: '',
	level: '',
	page: 1,
	limit: 30,
});
let resourceTypeForm = ref({
	id: '',
	name: '',
	desc: '',
	parent_type_id: '',
	to_data_table: '',
	level: '',
});
// let rawDataListOBJ = ref();
// 编辑
const resourceTypeDiaFnEdit = async () => {
	let { msg, code } = await assetTypeAPI().assetTypeListPutIDApi(resourceTypeForm.value.id, resourceTypeForm.value);
	if (code == 2000) {
		ElMessage.success(msg);
		assetTypeListGetApi();
		resourceDiaTF.value = false;
	} else {
		ElMessage.error(msg);
	}
};
let editDiaFn = async (val: any) => {
	resourceDiaTF.value = true;
	YandE.value = false;
	let { data } = await assetTypeAPI().assetTypeListGetApi({ id: val.id });
	resourceTypeForm.value = data[0];
};
// 新增
const resourceTypeDiaFn = async () => {
	let { msg, code } = await assetTypeAPI().assetTypeListPostApi(resourceTypeForm.value);
	if (code == 2000) {
		ElMessage.success(msg);
		assetTypeListGetApi();
		resourceDiaTF.value = false;
	} else {
		ElMessage.error(msg);
	}
};

// 搜索111
const assetTypeListGetApi1 = async () => {
	let { data, total } = await assetTypeAPI().assetTypeListGetApi(resourceTypeSearch.value);
	resourceTypeList.value = data;
	total1.value = total;
};
const assetTypeListGetApi = async () => {
	let { data, total } = await assetTypeAPI().assetTypeListGetApi(resourceTypeSearch.value);
	resourceTypeList.value = data;
	total1.value = total;
};
assetTypeListGetApi();
// 页码
const handleSizeChange = (val: number) => {
	resourceTypeSearch.value.limit = val;
	resourceTypeSearch.value.page = 1;
	assetTypeListGetApi();
};
const handleCurrentChange = (val: number) => {
	resourceTypeSearch.value.page = val;
	assetTypeListGetApi();
};
const resourceOptionFn = async () => {
	let { data } = await assetTypeAPI().resourceOptionFnListGetApi();
	let arr: any = [];
	data.forEach((item: any) => {
		let obj = {
			value: '',
			label: '',
		};
		obj.value = item.id;
		obj.label = item.name;
		arr.push(obj);
	});
	resourceOption.value = arr;
};
resourceOptionFn();

// 删除
const deleOne = async (val: any) => {
	ElMessageBox.confirm('确认删除吗?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			let { msg, code } = await assetTypeAPI().assetTypeListDeleteIDApi(val.id);
			if (code == 2000) {
				ElMessage.success(msg);
				assetTypeListGetApi();
			} else {
				ElMessage.error(msg);
			}
		})
		.catch(() => {});
};
// 关闭
const closed = () => {
	resourceTypeForm.value = {
		id: '',
		name: '',
		desc: '',
		parent_type_id: '',
		to_data_table: '',
		level: '',
	};
	YandE.value = true;
};
const reset = () => {
	resourceTypeSearch.value = {
		name: '',
		level: '',
		page: 1,
		limit: 30,
	};
	assetTypeListGetApi();
};
</script>

<style scoped lang="scss">
</style>