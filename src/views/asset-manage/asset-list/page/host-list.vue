
<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { request, downloadFile } from '@/utils/service';
import detailDiaComp from '../components/detailDia.vue';
import importExcel from '../components/importExcel.vue';
import treeUnit from '@/components/tree-unit/index.vue';
import apis from '../api';
const router = useRouter();
const route = useRoute();
import { regionqy, AllList, data3, defaultProps, departmentOption, regionOption } from '../type';

let telescopic = ref(false);
let ipOrApp = ref('2');
let addType = ref('');
let detailDia = ref(false);
let total: number = 0;
let arrChaStr = ref();
let params = ref({
	ip: '',
	resource_type: '',
	network_area: '',
	dept: '',
	data_center: '',
	limit: 30,
	page: 1,
	name: '',
	biz: '',
});
const tableData = ref([]);
const detailID = ref('');
const agentID = ref('');
let isLoading = ref(true);
let warehousingArr: any = ref([]);
const handleSelectionChange = (newSelectio: any[]) => {
	let arr: any = [];
	warehousingArr.value = newSelectio;
	newSelectio?.forEach((item) => {
		arr.push(item.id);
	});
	arrChaStr.value = arr.join(',');
};
// 应用系统列表
const appSystem = async () => {
	params.value.biz_id = route.query.bizId as string;
	let res = await apis.knownListGetApi(params.value);
	tableData.value = res.data;
	tableData.value.forEach((item: any) => {
		item.tags = item.assets_label;
	});
	total = res.total;
	isLoading.value = false;
};

const knownListGetApi = async () => {
	params.value.biz_id = '';
	let res = await apis.knownListGetApi(params.value);
	tableData.value = res.data;
	tableData.value.forEach((item: any) => {
		item.tags = item.assets_label;
	});
	total = res.total;
	isLoading.value = false;
};

const toDetail = (row: any) => {
	if (route.query.limit && route.query.page) {
		ElMessageBox.confirm('进入三级菜单会丢失上级路由保存的筛选信息，是否继续?', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(() => {
				router.push({
					path: '/asset-manage/asset-list/page/host-info',
					query: {
						id: row.id,
						parentID: row.class_name,
						agentID: row.agent_id,
						addType: 'edit',
						queryIp: row.ip,
						bizName: route.query.bizName,
					},
				});
			})
			.catch(() => {});
		return;
	}
	router.push({
		path: '/asset-manage/asset-list/page/host-info',
		query: {
			id: row.id,
			parentID: row.class_name,
			agentID: row.agent_id,
			addType: 'edit',
			queryIp: row.ip,
			bizName: route.query.bizName,
		},
	});
};

const handleSizeChange = (val: any) => {
	params.value.limit = val;
	params.value.page = 1;
	if (ipOrApp.value == '1') {
		knownListGetApi();
	} else {
		appSystem();
	}
};
const handleCurrentChange = (val: any) => {
	params.value.page = val;
	if (ipOrApp.value == '1') {
		knownListGetApi();
	} else {
		appSystem();
	}
};
// 搜索
const searchList = () => {
	if (ipOrApp.value == '1') {
		knownListGetApi();
	} else {
		appSystem();
	}
};
const searchReset = () => {
	params.value.ip = '';
	params.value.dept = '';
	params.value.network_area = '';
	params.value.name = '';
	if (ipOrApp.value == '1') {
		knownListGetApi();
	} else {
		appSystem();
	}
};

const onClickTree = async (data: any) => {
	params.value.data_center = data.data1;
	params.value.network_area = data.data2;
	if (ipOrApp.value == '1') {
		knownListGetApi();
	} else {
		appSystem();
	}
};

let treeData = ref([]);
const getTreeList = () => {
	treeData.value = [];
	const url = 'api/assets/Hosts/tree_list/';
	apis.getTreeList(url).then((res: any) => {
		if (res.code == 2000) {
			treeData.value = res.data;
		}
	});
};
const ipOrAppChange = (val?: any) => {
	tableData.value = [];
	isLoading.value = true;
	params.value = {
		ip: '',
		resource_type: '',
		network_area: '',
		dept: '',
		data_center: '',
		limit: 30,
		page: 1,
		name: '',
	};
	if (val == '1') {
		getTreeList();
		knownListGetApi();
	} else {
		treeData.value = [{ id: 1, label: route.query.bizName }];
		appSystem();
	}
};

const backIndex = () => {
	const query = {
		ipOrApp: '2',
		...route.query,
	};
	router.push({ path: '/asset-manage/asset-list', query });
};

ipOrAppChange(ipOrApp.value);
</script>


<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>
            <el-page-header @back="backIndex"
                            icon="ArrowLeft">
              <template #content>
                <span>主机列表</span><i style="font-weight:400;font-size:13px;margin-left:20px">{{route.query.bizName}}</i>
              </template>
            </el-page-header>
          </h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="searchList"
                       icon="Search">搜 索</el-button>
            <el-button type="primary"
                       @click="searchReset"
                       plain
                       icon="RefreshRight">重 置</el-button>
          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="params"
                   class="demo-form-inline">

            <el-form-item label="IP">
              <el-input v-model="params.ip"
                        @keydown.enter="searchList"
                        placeholder="请输入关键字"
                        clearable />
            </el-form-item>
            <!-- <el-form-item label="所属部门">
              <el-select clearable
                         v-model="params.dept"
                         placeholder="请选择所属部门">
                <el-option v-for="item in departmentOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.label" />
              </el-select>
            </el-form-item> -->
          </el-form>
        </div>
      </div>
      <div class="tree-table-container">
        <treeUnit :treeData="treeData"
                  :value="ipOrApp"
                  @onClickTree="onClickTree"
                  @changeTreeData="ipOrAppChange"></treeUnit>
        <div class="table-container">
          <table-unit :columns="AllList"
                      :list="tableData"
                      :loading="isLoading"
                      :total="total"
                      :isSelection="true"
                      :currentPage="params.page"
                      :pageSize="params.limit"
                      @handleSelectionChange="handleSelectionChange"
                      @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange">
            <template v-slot="record">
              <el-button type="primary"
                         size="small"
                         link
                         @click="toDetail(record.record)">详情</el-button>
            </template>
          </table-unit>
        </div>
      </div>

    </div>
  </div>

</template>


<style scoped lang="scss">
</style>
