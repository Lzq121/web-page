<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';
import importExcel from '@/components/importExcel/index.vue';
import AssetData from '@/views/asset-manage/asset-list/components/AssetData.vue';
import api from './api';
const columns = [
	{ title: '系统名称', dataIndex: 'business' },
	{ title: '域名/URL', dataIndex: 'domain' },
	{ title: '业务内网IP', dataIndex: 'addr' },
	{ title: '公网IP', dataIndex: 'map_ip' },
	{ title: '对外端口', dataIndex: 'service_port' },
	{ title: '所属公司', dataIndex: 'company_name' },
	{ title: '应用负责人', dataIndex: 'info_admin_name' },
	{ title: '部署位置', dataIndex: 'network_area' },
	{ title: '备注', dataIndex: 'notes' },
	{ title: '资产状态', dataIndex: 'status' },
	{ title: '更新时间', dataIndex: 'update_datetime' },
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
	business: '',
	domain: '',
	addr: '',
	map_ip: '',
	service_port: '',
	company_name: '',
	info_admin_name: '',
	network_area: '',
	status: '',
});
let total = ref(0);
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
// let domainList = ref([]);
// const fetchDomainList = async () => {
// 	const res = await api.getDomainList({ page: 1, limit: 9999 });
// 	domainList.value = res.data;
// };
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
	// if (domainList.value.length === 0) {
	// 	fetchDomainList();
	// }
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
		business: '',
		domain: '',
		addr: '',
		map_ip: '',
		service_port: '',
		company_name: '',
		info_admin_name: '',
		network_area: '',
		status: '',
	};
	fetchTableData();
};
let editRowData = ref({
	business: '',
	domain: '',
	addr: '',
	service_port: '',
	company_id: '',
	info_admin_id: '',
	network_area: '',
	notes: '',
	map_ip: null,
	id: null,
	status: null,
});
let dialogVisible = ref(false);
const add = () => {
	dialogVisible.value = true;
	editRowData.value = {
		business: '',
		domain: '',
		addr: '',
		service_port: '',
		company_id: '',
		info_admin_id: '',
		network_area: '',
		notes: '',
		map_ip: null,
		id: null,
		status: null,
	};
};
const editRow = async (val: any) => {
	api.GetObj(val.id).then((res: any) => {
		if (res.code == 2000) {
			for (const key in editRowData.value) {
				editRowData.value[key] = res.data[key];
			}
			dialogVisible.value = true;
			// businessName.value = res.data.business_name;
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
			editRowData.value = {
				business: '',
				domain: '',
				addr: '',
				service_port: '',
				company_id: '',
				info_admin_id: '',
				network_area: '',
				notes: '',
				map_ip: null,
				id: null,
				status: null,
			};
			fetchTableData();
			dialogVisible.value = false;
			// businessName.value = '';
			// isLoadAssetDataCon.value = false;
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

/*以下注释用于系统名需要外键的时候使用，暂不删除*/
// let drawerRight = ref(false);
// let isLoadAssetDataCon = ref(false);
// let businessName = ref('');
// const addAssets = () => {
// 	isLoadAssetDataCon.value = true;
// 	drawerRight.value = true;
// };
// let addAlllistAfter = [];
// const selectFun = async (val: any) => {
// 	addAlllistAfter = val.data;
// };
// // 确认资产选择
// const yesAssets = async () => {
// 	if (addAlllistAfter.length !== 1) {
// 		ElMessage.warning('请选择系统且只能选择一个系统');
// 		return;
// 	}
// 	businessName.value = addAlllistAfter[0].name;
// 	editRowData.value.business_id = addAlllistAfter[0].id;
// 	drawerRight.value = false;
// };
// const handleCloseTag = () => {
// 	businessName.value = '';
// 	editRowData.value.business_id = '';
// };
let isShowMoreSearch = ref(false);
</script>
<template>
	<div>
		<div class="table-container">
			<div class="form-container">
				<div class="form-title">
					<h3>应用系统信息</h3>
					<div class="button-box">
						<el-button type="primary" @click="excelOutExcel" link icon="Download">导出数据</el-button>
						<importExcel :apiSuffix="false" api="/api/assets/network/url_addr_import/">导入数据</importExcel>
						<el-button link type="primary" @click="add" icon="CirclePlus">新 增</el-button>
						<el-button type="primary" @click="onSearch" icon="Search">搜 索</el-button>
						<el-button type="primary" @click="reSearch" plain icon="RefreshRight">重 置</el-button>
					</div>
				</div>
				<div class="form-params" :class="{ openParams: isShowMoreSearch }">
					<div class="more-filter-btn">
						<el-button link type="primary" @click="isShowMoreSearch = !isShowMoreSearch" :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
							{{ isShowMoreSearch ? '收起' : '展开' }}
						</el-button>
					</div>
					<el-form :inline="true" :model="params">
						<el-form-item label="系统名称">
							<el-input v-model="params.business" clearable />
						</el-form-item>
						<el-form-item label="访问地址">
							<el-input v-model="params.addr" clearable />
						</el-form-item>
						<el-form-item label="公网IP">
							<el-input v-model="params.map_ip" clearable />
						</el-form-item>
						<el-form-item label="域名">
							<el-input v-model="params.domain" clearable />
						</el-form-item>
						<el-form-item label="对外开放端口">
							<el-input v-model="params.service_port" clearable />
						</el-form-item>
						<el-form-item label="所属公司">
							<el-input v-model="params.company_name" clearable />
						</el-form-item>
						<el-form-item label="应用负责人">
							<el-input v-model="params.info_admin_name" clearable />
						</el-form-item>
						<el-form-item label="部署位置">
							<el-input v-model="params.network_area" clearable />
						</el-form-item>
						<el-form-item label="资产状态">
							<el-select v-model="params.status" clearable>
								<el-option label="已上线" value="已上线" />
								<el-option label="已下线" value="已下线" />
							</el-select>
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
			<el-form :model="editRowData" label-suffix=":" label-width="120px" ref="formRef">
				<!-- <el-form-item label="系统名称">
          <el-button type="primary"
                     @click="addAssets"
                     v-if="!businessName">选择系统</el-button>
          <el-tag @close="handleCloseTag"
                  size="large"
                  closable
                  v-else>
            {{ businessName }}
          </el-tag>
        </el-form-item> -->
				<el-form-item label="系统名称" prop="business">
					<el-input v-model="editRowData.business" show-word-limit maxlength="50"></el-input>
				</el-form-item>

				<el-form-item
					label="业务内网ip"
					prop="addr"
					:rules="[
						{
							message: '请正确输入IP',
							pattern:
								/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
							trigger: 'blur',
						},
					]"
				>
					<el-input v-model="editRowData.addr"></el-input>
				</el-form-item>
				<el-form-item
					label="公网ip"
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
					<el-input v-model="editRowData.map_ip"></el-input>
				</el-form-item>
				<el-form-item
					label="域名/url"
					prop="domain"
					:rules="[{ message: '请正确输入域名', pattern: /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/, trigger: 'blur' }]"
				>
					<el-input v-model="editRowData.domain"></el-input>
				</el-form-item>
				<el-form-item label="对外开放端口" prop="service_port">
					<el-input v-model="editRowData.service_port" type="number"></el-input>
				</el-form-item>
				<el-form-item label="部署位置" prop="network_area">
					<el-input v-model="editRowData.network_area"></el-input>
				</el-form-item>

				<el-form-item label="所属公司" prop="company_id">
					<el-select v-model="editRowData.company_id" filterable>
						<el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="应用负责人" prop="info_admin_id">
					<el-select v-model="editRowData.info_admin_id" filterable>
						<el-option v-for="item in adminList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>

				<el-form-item label="资产状态" prop="status">
					<el-select v-model="editRowData.status" clearable>
						<el-option label="在线" value="在线" />
						<el-option label="不在线" value="不在线" />
						<el-option label="未知" value="未知" />
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="editRowData.notes" type="textarea" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="confirmEdit(formRef)"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>
		<!-- <el-drawer v-model="drawerRight"
               title="资产选择"
               size="80%">
      <AssetData @selectFun="selectFun"
                 :selectDisabled="true"
                 :selectValue="'2'"
                 v-if="isLoadAssetDataCon"></AssetData>
      <div style="text-align:right;padding:30px 30px 0;">
        <el-button type="success"
                   style="width:20%"
                   @click="yesAssets">确认选择资产</el-button>
      </div>
    </el-drawer> -->
	</div>
</template>
<style lang="scss" scoped></style>
