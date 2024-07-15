<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from './api';
import importExcel from '@/components/importExcel/index.vue';
let depts = ref([]);
const fetchDepts = async () => {
	const res = await api.getList();
	depts.value = res.data;
};
fetchDepts();
const columns = [
	// { 'title': 'Id', 'dataIndex': 'id' },
	{ title: '域名', dataIndex: 'domain' },
	{ title: '域名负责人', dataIndex: 'info_admin_name' },
	{ title: '父域名', dataIndex: 'parent_domain_id' },

	{ title: '部门', dataIndex: 'department_name' },
	{ title: '使用说明', dataIndex: 'instructions' },
	{ title: '更新时间', dataIndex: 'update_datetime' },
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
	domain: '',
	service_port: '',
	map_ip: '',
	department_name: '',
	info_admin_name: '',
	parent_domain_id: '',
});
let total = ref(0);
const fetchTableData = async () => {
	const res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
};
fetchTableData();

let parentList:any = ref([]);
const fetchCompanyList = async () => {
	const res = await api.getDomainParentList();
	parentList.value = res.data;
};
fetchCompanyList();

let adminList = ref([]);
const fetchAdminList = async () => {
	const res = await api.getAdminList({ page: 1, limit: 9999 });
	adminList.value = res.data;
};
fetchAdminList();
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
		domain: '',
		service_port: null,
		map_ip: '',
		parent_domain_id: '',
	};
	fetchTableData();
};
let editRowData = ref({
	parent_domain: '',
	map_ip: '',
	domain: '',
	instructions: '',
	notes: '',
	service_port: null,
	id: null,
	department_id: null,
	info_admin_id: '',
	parent_domain_id: '',
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
const confirmEdit = async () => {
	if (!editRowData.value.department_id) {
		ElMessage.warning('部门必选');
		return;
	}
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
let isShowMoreSearch = ref(false);
</script>
<template>
	<div>
		<div class="table-container">
			<div class="form-container">
				<div class="form-title">
					<h3>域名管理</h3>
					<div class="button-box">
						<el-button type="primary" @click="excelOutExcel" link icon="Download">导出数据</el-button>
						<importExcel :apiSuffix="false" api="/api/assets/network/domain_import/">导入数据</importExcel>
						<el-button
							type="primary"
							link
							@click="
								dialogVisible = true;
								editRowData = {};
							"
							icon="CirclePlus"
							>新 增</el-button
						>
						<el-button type="primary" @click="onSearch" icon="Search">搜 索</el-button>
						<el-button type="primary" @click="reSearch" plain icon="RefreshRight">重 置</el-button>
					</div>
				</div>

				<div class="form-params" :style="isShowMoreSearch ? 'height:100%' : 'height:60px'">
					<div class="more-filter-btn">
						<el-button link type="primary" @click="isShowMoreSearch = !isShowMoreSearch" :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
							{{ isShowMoreSearch ? '收起' : '展开' }}
						</el-button>
					</div>
					<el-form :inline="true" :model="params" label-width="120px" class="demo-form-inline">
						<el-form :inline="true" :model="params">
							<el-form-item label="域名">
								<el-input v-model="params.domain" clearable />
							</el-form-item>
							<el-form-item label="父域名">
								<el-input v-model="params.parent_domain_id" clearable />
							</el-form-item>

							<el-form-item label="部门">
								<el-input v-model="params.department_name" clearable />
							</el-form-item>
							<el-form-item label="域名负责人">
								<el-input v-model="params.info_admin_name" clearable />
							</el-form-item>
						</el-form>
					</el-form>
				</div>
			</div>
			<div class="table-box">
				<table-unit
					:currentPage="params.page"
					:pageSize="params.limit"
					:columns="columns"
					:list="list"
					:total="total"
					@handleSizeChange="handleSizeChange"
					@handleCurrentChange="handleCurrentChange"
				>
					<template v-slot="record">
						<el-button plain size="small" link type="primary" @click="editRow(record.record)">编辑</el-button>
						<el-button plain size="small" link type="danger" @click="delRow(record.record)">删除</el-button>
					</template>
				</table-unit>
			</div>
		</div>
		<el-dialog v-model="dialogVisible" title="新增/编辑" width="50%">
			<el-form :model="editRowData" label-width="100px">
				<el-form-item required label="部门" prop="department_id">
					<el-select v-model="editRowData.department_id" filterable>
						<el-option v-for="item in depts" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="父域名">
					<el-select v-model="editRowData.parent_domain_id" filterable clearable>
						<el-option v-for="item in parentList" :key="item.id" :label="item.domain" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item
					label="域名"
					prop="domain"
					:rules="[{ message: '请正确输入域名', pattern: /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/, trigger: 'blur' }]"
				>
					<el-input v-model="editRowData.domain" clearable />
				</el-form-item>
				<!-- <el-form-item
					label="映射ip"
					prop="map_ip"
					:rules="[
						{
							message: '请正确输入IP',
							pattern:
								/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
							trigger: 'blur',
						},
					]"
				>
					<el-input v-model="editRowData.map_ip" clearable />
				</el-form-item> -->
				<el-form-item label="管理员" prop="info_admin_id">
					<el-select v-model="editRowData.info_admin_id" filterable>
						<el-option v-for="item in adminList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="服务端口">
					<el-input type="number" v-model="editRowData.service_port" clearable />
				</el-form-item> -->
				<el-form-item label="使用说明">
					<el-input v-model="editRowData.instructions" clearable />
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="editRowData.notes" clearable />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="confirmEdit"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<style lang="scss" scoped></style>
