<script setup lang='ts' >
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from './api';
const columns = [
	{
		title: '目标表',
		dataIndex: 'target_model',
	},
	{
		title: '规则类型',
		dataIndex: 'cip_type$',
	},
	{
		title: '大类名称',
		dataIndex: 'class_name',
	},
	{
		title: '字段名',
		dataIndex: 'filed_name',
	},
	{
		title: '规则描述',
		dataIndex: 'cip_desc',
	},
	{
		title: '是否启用',
		dataIndex: 'is_use$',
	},
	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
];
let list = ref([]);
let params = ref({
	page: 1,
	limit: 30,
	class_name: '',
	is_use: null,
	cip_type: '',
});
let total = ref(0);
const fetchTableData = async () => {
	const res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
	list.value.forEach((item: any) => {
		item.is_use$ = item.is_use ? '是' : '否';
		switch (item.cip_type) {
			case 1:
				item.cip_type$ = '已知资产判断规则';
				break;
			case 2:
				item.cip_type$ = '资产数据更新规则';
				break;
			default:
				break;
		}
	});
};
fetchTableData();
const handleSizeChange = (val: number) => {
	params.value.page = 1;
	params.value.limit = val;
	fetchTableData();
};
const handleCurrentChange = (val: number) => {
	params.value.page = val;
	fetchTableData();
};
const onSearch = () => {
	params.value.page = 1;
	fetchTableData();
};
const reSearch = () => {
	params.value = {
		page: 1,
		limit: 30,
		class_name: '',
		is_use: null,
		cip_type: '',
	};
	fetchTableData();
};
let editRowData = ref({
	target_model: '',
	cip_type: '',
	class_name: '',
	filed_name: '',
	cip_desc: '',
	is_use: null,
	id: null,
});
let dialogVisible = ref(false);
const editRow = async (val: any) => {
	api.GetObj(val.id).then((res: any) => {
		console.log(res);
		if (res.code == 2000) {
			editRowData.value = res.data;
			dialogVisible.value = true;
		}
	});
};
const confirmEdit = async () => {
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
          <h3>资产分组</h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="onSearch"
                       icon="Search">搜 索</el-button>
            <el-button type="primary"
                       @click="reSearch"
                       plain
                       icon="RefreshRight">重 置</el-button>
            <el-button @click="dialogVisible=true;editRowData={}"
                       icon="Plus">新 增</el-button>
          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="大类名称">
              <el-input v-model="params.class_name"
                        clearable />
            </el-form-item>
            <el-form-item label="规则类型"
                          prop="cip_type">
              <el-select v-model="params.cip_type">
                <el-option label="已知资产判断规则"
                           :value="1" />
                <el-option label="资产数据更新规则"
                           :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-select v-model="params.is_use"
                         style="width: 240px">
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
          </template>
        </table-unit>
      </div>

    </div>
    <el-dialog v-model="dialogVisible"
               title="新增/编辑"
               width="50%">
      <el-form :model="editRowData"
               label-width="100px">
        <el-form-item label="规则类型"
                      prop="cip_type">
          <el-select v-model="editRowData.cip_type">
            <el-option label="已知资产判断规则"
                       :value="1" />
            <el-option label="资产数据更新规则"
                       :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用"
                      prop="is_use">
          <el-select v-model="editRowData.is_use">
            <el-option label="是"
                       :value="true" />
            <el-option label="否"
                       :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标表"
                      prop="target_model">
          <el-input v-model="editRowData.target_model"></el-input>
        </el-form-item>
        <el-form-item label="大类名称"
                      prop="class_name">
          <el-input v-model="editRowData.class_name"></el-input>
        </el-form-item>
        <el-form-item label="字段名"
                      prop="filed_name">
          <el-input v-model="editRowData.filed_name"></el-input>
        </el-form-item>
        <el-form-item label="规则描述">
          <el-input v-model="editRowData.cip_desc"
                    :autosize="{ minRows: 2, maxRows: 10 }"
                    type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="confirmEdit">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang='scss' scoped>
</style>