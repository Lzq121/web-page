<script setup lang='ts' >
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from './api';
let hosts = ref([]);
const fetchHosts = async () => {
	const res = await api.getList();
	hosts.value = res.data;
};
fetchHosts();
let segments = ref([]);
const fetchSegments = async () => {
	const res = await api.fetchSegments({
		page: 1,
		limit: 100,
		name: '',
		data_center: null,
	});

	segments.value = res.data;
};
fetchSegments();
const columns = [
	// { 'title': 'Id', 'dataIndex': 'id' },
	{ title: 'IP', dataIndex: 'ip' },
	{ title: '主机', dataIndex: 'host_ip' },
	{ title: '网段', dataIndex: 'segment_name' },
	{ title: '物理地址', dataIndex: 'mac_addr' },
	{ title: '子网掩码', dataIndex: 'subnet_mask' },
	{ title: '所在网络区域', dataIndex: 'network_area' },
	// { 'title': 'EDR_agent_id', 'dataIndex': 'edr_agent_id' },
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
	ip: '',
	mac_addr: null,
	network_area: '',
});
let total = ref(0);
const fetchTableData = async () => {
	const res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
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
		ip: '',
		mac_addr: null,
		network_area: '',
	};
	fetchTableData();
};
let editRowData = ref({
	network_area: '',
	ip: '',
	subnet_mask: '',
	mac_addr: null,
	id: null,
	host_id: null,
	segment_id: null,
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
	if (!editRowData.value.host_id || !editRowData.value.segment_id) {
		ElMessage.success('主机和网段必选');
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
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>IP管理</h3>
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
            <el-form-item label="IP">
              <el-input v-model="params.ip"
                        clearable />
            </el-form-item>
            <el-form-item label="物理地址">
              <el-input v-model="params.mac_addr"
                        clearable />
            </el-form-item>
            <el-form-item label="子网掩码">
              <el-input v-model="params.subnet_mask"
                        clearable />
            </el-form-item>
            <el-form-item label="所在网络区域">
              <el-input v-model="params.network_area"
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
               label-width="100px">
        <el-form-item label="主机"
                      prop="host_id"
                      required>
          <el-select v-model="editRowData.host_id">
            <el-option v-for="item in hosts"
                       :key="item.id"
                       :label="item.ip"
                       :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="网段"
                      prop="segment_id"
                      required>
          <el-select v-model="editRowData.segment_id">
            <el-option v-for="item in segments"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="IP">
          <el-input v-model="editRowData.ip"
                    clearable />
        </el-form-item>
        <el-form-item label="物理地址">
          <el-input v-model="editRowData.mac_addr"
                    clearable />
        </el-form-item>
        <el-form-item label="子网掩码">
          <el-input v-model="editRowData.subnet_mask"
                    clearable />
        </el-form-item>
        <el-form-item label="所在网络区域">
          <el-input v-model="editRowData.network_area"
                    clearable />
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
<style lang='scss' scoped>
</style>