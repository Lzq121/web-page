<script setup lang='ts'>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';
import importExcel from '@/components/importExcel/index.vue';
import api from './api';
const columns = [
	{ title: '系统名称', dataIndex: 'name' },
	{ title: '域名/url', dataIndex: 'url' },
	{ title: '业务内网ip', dataIndex: 'inner_ip' },
	{ title: '公网ip', dataIndex: 'comm_ip' },
	{ title: '对外开放端口', dataIndex: 'out_port' },
	{ title: '所属公司', dataIndex: 'company_name' },
	{ title: '应用负责人', dataIndex: 'info_admin_name' },
	{ title: '部署位置', dataIndex: 'network_area' },
	{ title: '备注', dataIndex: 'notes' },
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
	name: '',
	url: '',
});
let total = ref(0);
const fetchTableData = async () => {
	const res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
	if (companyList.value.length === 0) {
		fetchCompanyList();
	}
	if (adminList.value.length === 0) {
		fetchAdminList();
	}
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
		name: '',
		url: '',
	};
	fetchTableData();
};
let companyList = ref([]);
const fetchCompanyList = async () => {
	const res = await api.getCompanyList();
	companyList.value = res.data;
};
let adminList = ref([]);
const fetchAdminList = async () => {
	const res = await api.getAdminList({ page: 1, limit: 9999 });
	adminList.value = res.data;
};
let editRowData = ref({
	name: '',
	url: '',
	inner_ip: '',
	comm_ip: '',
	out_port: '',
	company_id: '',
	info_admin_id: '',
	network_area: '',
	notes: '',
	id: null,
});
let dialogVisible = ref(false);
const editRow = async (val: any) => {
	api.GetObj(val.id).then((res: any) => {
		if (res.code == 2000) {
			editRowData.value = res.data;
			dialogVisible.value = true;
		}
	});
};

const formRef = ref<FormInstance>();
const confirmEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
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
          <h3>URL管理</h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="dialogVisible=true;editRowData={}"
                       link
                       icon="CirclePlus">新增</el-button>
            <el-button type="primary"
                       @click="excelOutExcel"
                       link
                       icon="Download">导出数据</el-button>
            <importExcel :apiSuffix="false"
                         api="/api/assets/inform/info_system_import/">导入数据</importExcel>
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
            <el-form-item label="系统名称">
              <el-input v-model="params.name"
                        @keydown.enter="onSearch"
                        clearable />
            </el-form-item>
            <el-form-item label="域名/url">
              <el-input v-model="params.url"
                        @keydown.enter="onSearch"
                        clearable />
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
               label-width="100px"
               ref="formRef">

        <el-form-item label="系统名称"
                      prop="name">
          <el-input v-model="editRowData.name"></el-input>
        </el-form-item>
        <el-form-item label="域名/url"
                      prop="url"
                      :rules="[
        {message: '请正确输入域名',pattern:/^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/ ,trigger:'blur'}]">
          <el-input v-model="editRowData.url"></el-input>
        </el-form-item>
        <el-form-item label="业务内网ip"
                      prop="inner_ip"
                      :rules="[
        {message: '请正确输入IP',pattern:/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/ ,trigger:'blur'}]">
          <el-input v-model="editRowData.inner_ip"></el-input>
        </el-form-item>
        <el-form-item label="公网ip"
                      prop="comm_ip"
                      :rules="[
        {message: '请正确输入IP',pattern:/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/ ,trigger:'blur'}]">
          <el-input v-model="editRowData.comm_ip"></el-input>
        </el-form-item>
        <el-form-item label="对外开放端口"
                      prop="out_port">
          <el-input v-model="editRowData.out_port"
                    type="number"></el-input>
        </el-form-item>
        <el-form-item label="所属公司"
                      prop="company_id">
          <el-select v-model="editRowData.company_id"
                     filterable>
            <el-option v-for="item in companyList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="应用负责人"
                      prop="info_admin_id">
          <el-select v-model="editRowData.info_admin_id"
                     filterable>
            <el-option v-for="item in adminList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部署位置"
                      prop="network_area">
          <el-input v-model="editRowData.network_area"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editRowData.notes"
                    type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="confirmEdit(formRef)">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang='scss' scoped>
</style>