<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import importExcel from '@/components/importExcel/index.vue';
import api from './api';
const columns = [
	{ title: '网段范围', dataIndex: 'name' },
	{ title: '网段归属', dataIndex: 'network_area' },
	{ title: '数据中心', dataIndex: 'data_center' },
	{ title: '部门名称', dataIndex: 'department_name' },
	{ title: '网段使用说明', dataIndex: 'segment_usage' },
	{ title: '数据来源', dataIndex: 'data_sources' },
	{ title: 'IP属类', dataIndex: 'pace_area' },
	{ title: '地址类型', dataIndex: 'pace_type' },
	{ title: '地址用途', dataIndex: 'use_type' },
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
	name: '',
	data_center: '',
	department_name: '',
	segment_usage: '',
	network_area: '',
	data_sources: '',
	pace_type: '',
	pace_area: '',
	use_type: '',
});
let total = ref(0);
const fetchTableData = async () => {
	const res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
	if (depts.value.length === 0) {
		fetchDepts();
	}
};
let depts = ref([]);
const fetchDepts = async () => {
	const res = await api.getList();
	depts.value = res.data;
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
		data_center: '',
		department_name: '',
		segment_usage: '',
		network_area: '',
		data_sources: '',
		pace_type: '',
		pace_area: '',
		use_type: '',
	};
	fetchTableData();
};
let editRowData = ref({
	data_sources: '',
	notes: '',
	network_area: '',
	name: '',
	filed_name: '',
	segment_usage: '',
	data_center: null,
	department_id: null,
	id: null,
	pace_area: '',
	pace_type: '',
	use_type: '',
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
		ElMessage.success('部门必选');
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
			api.downloadFile(data, value);
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
					<h3>网段管理</h3>
					<div class="button-box">
						<el-button
							type="primary"
							@click="
								dialogVisible = true;
								editRowData = {};
							"
							link
							icon="CirclePlus"
							>新增</el-button
						>
						<el-button type="primary" @click="excelOutExcel" link icon="Download">导出数据</el-button>
						<importExcel :apiSuffix="false" api="/api/assets/network/network_segment_import/">导入数据</importExcel>
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
						<el-form-item label="网段范围">
							<el-input v-model="params.name" @keydown.enter="onSearch" clearable />
						</el-form-item>
						<el-form-item label="数据中心">
							<el-input v-model="params.data_center" @keydown.enter="onSearch" clearable />
						</el-form-item>
						<el-form-item label="部门名称">
							<el-input v-model="params.department_name" @keydown.enter="onSearch" clearable />
						</el-form-item>
						<el-form-item label="网段使用说明">
							<el-input v-model="params.segment_usage" @keydown.enter="onSearch" clearable />
						</el-form-item>
						<el-form-item label="所在网络区域">
							<el-input v-model="params.network_area" @keydown.enter="onSearch" clearable />
						</el-form-item>
						<el-form-item label="数据来源">
							<el-input v-model="params.data_sources" @keydown.enter="onSearch" clearable />
						</el-form-item>
						<el-form-item label="地址类型">
							<el-select v-model="params.pace_type" clearable>
								<el-option label="IPv4" value="IPv4" />
								<el-option label="IPv6" value="IPv6" />
							</el-select>
						</el-form-item>
						<el-form-item label="IP属类">
							<el-select v-model="params.pace_area" clearable>
								<el-option label="内网" value="内网" />
								<el-option label="公网" value="公网" />
							</el-select>
						</el-form-item>
						<el-form-item label="地址用途">
							<el-input v-model="params.use_type" @keydown.enter="onSearch" clearable />
						</el-form-item>
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
					<el-select v-model="editRowData.department_id">
						<el-option v-for="item in depts" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="网段范围" prop="name">
					<el-input v-model="editRowData.name"></el-input>
				</el-form-item>
				<el-form-item label="数据中心" prop="data_center">
					<el-input v-model="editRowData.data_center"></el-input>
				</el-form-item>
				<el-form-item label="数据来源" prop="data_sources">
					<el-input v-model="editRowData.data_sources"></el-input>
				</el-form-item>
				<el-form-item label="网段归属" prop="network_area">
					<el-input v-model="editRowData.network_area"></el-input>
				</el-form-item>
				<el-form-item label="网段使用说明">
					<el-input v-model="editRowData.segment_usage" :autosize="{ minRows: 2, maxRows: 10 }" type="textarea" />
				</el-form-item>
				<el-form-item label="地址类属" prop="pace_area">
					<el-select v-model="editRowData.pace_area">
						<el-option label="内网" value="内网" />
						<el-option label="公网" value="公网" />
					</el-select>
				</el-form-item>
				<el-form-item label="地址类型" prop="pace_type">
					<el-select v-model="editRowData.pace_type">
						<el-option label="IPv4" value="IPv4" />
						<el-option label="IPv6" value="IPv6" />
					</el-select>
				</el-form-item>
				<el-form-item label="用途类型" prop="use_type">
					<el-input v-model="editRowData.use_type" :autosize="{ minRows: 2, maxRows: 10 }" type="textarea" />
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="editRowData.notes" :autosize="{ minRows: 2, maxRows: 10 }" type="textarea" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="confirmEdit(ruleFormRef)"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<style lang="scss" scoped></style>
