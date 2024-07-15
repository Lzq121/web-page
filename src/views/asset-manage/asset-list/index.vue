<script setup lang="ts">
import { ref, watch, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apis from './api';
import treeUnit from '@/components/tree-unit/index.vue';
import { AllList, departmentOption, appList } from './type';
const router = useRouter();
const route = useRoute();
let isLoading = ref(true);
let telescopic = ref(false);
let ipOrApp = ref('1');
let filterText = ref('');

let total: number = 0;
let source_id = ref([]);
let status = ref([]);
let network_area = ref([]);
let data_center = ref([]);
let class_name = ref([]);
let resource_type = ref([]);
let biz_type = ref([]);
let biz_level = ref([]);
let biz_state = ref([]);
let params: any = ref({
	// 主机
	ip: '',
	network_area: '',
	biz: '',
	status: '',
	class_name: '',
	os: '',
	app_admin: '',
	middleware_admin: '',
	os_version: '',
	resource_type: '',
	host_manager: '',
	db_admin: '',
	room: '',
	safe_person: '',
	label: '',
	is_known: '',
	source_id: '',
	condition: 'difference',
	data_center: '',
	// 应用
	name: '',
	biz_manager: '',
	biz_state: '',
	biz_level: '',
	company: '',
	supplier: '',
	biz_class: '',
	biz_type: '',
	biz_plate: '',
	mail_of_main: '',
	tp_of_main: '',
	domain: '',
	project_desc: '',
	external_lan_ip: '',
	load_ip: '',
	public_ip: '',
	open_port: '',
	reviewer: '',
	deploy_info: '',
	// 公有
	limit: 30,
	page: 1,
	dept: '',
});

const appListAll: any = ref([]);
const tableData = ref([]);
const listRef = ref();
const getAllTreeList = async () => {
	const url = '/api/assets/host/all_tree_list/';
	await apis.getTreeList(url);
};
const toDetail = (row: any) => {
	if (ipOrApp.value == '1') {
		router.push({
			path: '/asset-manage/asset-list/page/host-info',
			query: {
				id: row.id,
				parentID: row.class_name,
				agentID: row.agent_id,
				queryName: row.ip,
				ipOrApp: ipOrApp.value,
				...params.value,
			},
		});
	} else {
		router.push({
			path: '/asset-manage/asset-list/page/business-info',
			query: {
				id: row.id,
				queryName: row.name,
				ipOrApp: ipOrApp.value,
				parentID: row.biz_class,
				agentID: row.agent_id,
				...params.value,
			},
		});
	}
};

// 已知资产列表
const knownAPIListGetApi = async () => {
	let res = await apis.knownListGetApi(params.value);
	tableData.value = res.data;
	tableData.value.forEach((item: any) => {
		item.tags = item.assets_label;
	});
	total = res.total;
	isLoading.value = false;
};
// 应用系统列表
const appSystem = async () => {
	let res = await apis.businessListgGetApi(params.value);
	tableData.value = res.data;
	total = res.total;
	isLoading.value = false;
};

const hostList = (val: any) => {
	delete params.value.ipOrApp;
	router.push({
		path: '/asset-manage/asset-list/host-list',
		query: { bizName: val.name, bizId: val.id, ipOrApp: ipOrApp.value, ...params.value },
	});
};

const onClickTree = async (data: any) => {
	if (ipOrApp.value == '1') {
		params.value.company = undefined;
		params.value.data_center = data.data1;
		params.value.network_area = data.data2;
		knownAPIListGetApi();
	} else {
		params.value.company = data.data1;
		params.value.data_center = undefined;
		params.value.network_area = undefined;
		appSystem();
	}
};
// 搜索
const searchList = () => {
	if (source_id.value.length > 0) {
		params.value.source_id = source_id.value.join(',');
	} else {
		params.value.source_id = '';
	}
	if (status.value.length > 0) {
		params.value.status = status.value.join(',');
	} else {
		params.value.status = '';
	}
	if (network_area.value.length > 0) {
		params.value.network_area = network_area.value.join(',');
	} else {
		params.value.network_area = '';
	}
	if (data_center.value.length > 0) {
		params.value.data_center = data_center.value.join(',');
	} else {
		params.value.data_center = '';
	}
	if (class_name.value.length > 0) {
		params.value.class_name = class_name.value.join(',');
	} else {
		params.value.class_name = '';
	}
	if (resource_type.value.length > 0) {
		params.value.resource_type = resource_type.value.join(',');
	} else {
		params.value.resource_type = '';
	}
	if (biz_type.value.length > 0) {
		params.value.biz_type = biz_type.value.join(',');
	} else {
		params.value.biz_type = '';
	}
	if (biz_level.value.length > 0) {
		params.value.biz_level = biz_level.value.join(',');
	} else {
		params.value.biz_level = '';
	}
	if (biz_state.value.length > 0) {
		params.value.biz_state = biz_state.value.join(',');
	} else {
		params.value.biz_state = '';
	}
	if (ipOrApp.value == '1') {
		knownAPIListGetApi();
	} else {
		appSystem();
	}
};
// 分页
const handleSizeChange = (val: any) => {
	params.value.limit = val;
	params.value.page = 1;
	searchList();
};
const handleCurrentChange = (val: any) => {
	params.value.page = val;
	searchList();
};

const searchReset = () => {
	for (let key in params.value) {
		params.value[key] = '';
	}
	params.value.limit = 30;
	params.value.page = 1;
	params.value.condition = 'difference';
	source_id.value = [];
	status.value = [];
	network_area.value = [];
	data_center.value = [];
	class_name.value = [];
	resource_type.value = [];

	biz_type.value = [];
	biz_level.value = [];
	biz_state.value = [];
	if (ipOrApp.value == '1') {
		knownAPIListGetApi();
	} else {
		appSystem();
	}
};

// table单选框
const handleSelectionChange = (newSelectio: any[]) => {
	let arr: any = [];
	newSelectio?.forEach((item) => {
		let obj = {
			id: '',
		};
		obj.id = item.id;
		arr.push(obj);
	});
};

// tree切换
const ipOrAppChange = (val?: any) => {
	tableData.value = [];
	total = 0;
	isLoading.value = true;
	ipOrApp.value = val;
	if (val == '1') {
		listRef.value = AllList;
	} else {
		listRef.value = [
			...appList,
			{
				title: '操作',
				dataIndex: 'operate',
				width: 150,
				fixed: 'right',
			},
		];
	}
	searchReset();
	getTreeList();
};
let treeData = ref([]);
const getTreeList = () => {
	treeData.value = [];
	const url = ipOrApp.value == '1' ? 'api/assets/Hosts/tree_list/' : '/api/assets/Business/tree_list/';
	apis.getTreeList(url).then((res: any) => {
		if (res.code == 2000) {
			treeData.value = res.data;
		}
	});
};
let isShowMoreSearch = ref(false);

let hostOptaions = ref({
	class_name: [],
	resource_type: [],
	data_center: [],
	network_area: [],
	os: [],
	status: [],
});
let bizOptaions = ref({
	biz_class: [],
	biz_type: [],
	network_area: [],
	biz_level: [],
	biz_state: [],
	data_center: [],
});
const fetchAllDropList = () => {
	apis.getAllDropList().then((res: any) => {
		hostOptaions.value = res.data.host;
		bizOptaions.value = res.data.business;
	});
};

getTreeList();
getAllTreeList();

if (route.query.limit && route.query.page) {
	route.query.limit = parseInt(route.query.limit as string);
	route.query.page = parseInt(route.query.page as string);
	for (let e in params.value) {
		params.value[e] = route.query[e];
	}
	if (params.value.source_id) {
		source_id.value = params.value.source_id.split(',');
	}
	if (params.value.status) {
		status.value = params.value.status.split(',');
	}
	if (params.value.network_area) {
		network_area.value = params.value.network_area.split(',');
	}
	if (params.value.data_center) {
		data_center.value = params.value.data_center.split(',');
	}
	if (params.value.class_name) {
		class_name.value = params.value.class_name.split(',');
	}
	if (params.value.resource_type) {
		resource_type.value = params.value.resource_type.split(',');
	}
	if (params.value.biz_type) {
		biz_type.value = params.value.biz_type.split(',');
	}
	if (params.value.biz_level) {
		biz_level.value = params.value.biz_level.split(',');
	}
	if (params.value.biz_state) {
		biz_state.value = params.value.biz_state.split(',');
	}
	ipOrApp.value = route.query.ipOrApp;
	if (ipOrApp.value == '1') {
		listRef.value = AllList;
	} else {
		listRef.value = [
			...appList,
			{
				title: '操作',
				dataIndex: 'operate',
				width: 150,
				fixed: 'right',
			},
		];
	}
	searchList();
}
if (route.query.pageType === 'asset-board') {
	params.value.limit = 30;
	params.value.page = 1;
	params.value.is_known = route.query.is_known;
	params.value.deploy_info = route.query.deploy_info;
	ipOrApp.value = route.query.ipOrApp;
	network_area.value = [route.query.network_area];
	data_center.value = [route.query.data_center];
	if (ipOrApp.value == '1') {
		listRef.value = AllList;
	} else {
		listRef.value = [
			...appList,
			{
				title: '操作',
				dataIndex: 'operate',
				width: 150,
				fixed: 'right',
			},
		];
	}
	apis.getAllDropList().then((res: any) => {
		hostOptaions.value = res.data.host;
		bizOptaions.value = res.data.business;
		status.value = [];
		hostOptaions.value.status.forEach((i: any) => {
			if (i != '-' && i != '离线') {
				status.value.push(i);
			}
		});
		searchList();
	});
} else {
	fetchAllDropList();
}
if (Object.keys(route.query).length === 0) {
	ipOrAppChange('1');
}
</script>

<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>资产台账</h3>
          <div class="button-box">
            <el-button type="primary"
                       icon="Search"
                       @click="searchList"
                       :loading="isLoading">搜索</el-button>
            <el-button @click="searchReset"
                       icon="RefreshRight"
                       :loading="isLoading">重置</el-button>
          </div>
        </div>
        <div class="form-params"
             :style="isShowMoreSearch ? 'height:100%' : 'height:60px'">
          <div class="more-filter-btn">
            <el-button link
                       type="primary"
                       @click="isShowMoreSearch = !isShowMoreSearch"
                       :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
              {{ isShowMoreSearch ? '收起' : '展开' }}
            </el-button>
          </div>
          <el-form :inline="true"
                   :model="params"
                   :disabled="isLoading"
                   label-width="120px"
                   class="demo-form-inline">
            <el-form-item label="所属部门">
              <el-input @keydown.enter="searchList"
                        v-model="params.dept"
                        clearable />
            </el-form-item>

            <span v-show="ipOrApp == '1'">
              <el-form-item label="IP地址">
                <el-input @keydown.enter="searchList"
                          v-model="params.ip"
                          clearable />
              </el-form-item>

              <el-form-item label="主机负责人">
                <el-input @keydown.enter="searchList"
                          v-model="params.host_manager"
                          clearable />
              </el-form-item>
              <el-form-item label="操作系统版本">
                <el-input @keydown.enter="searchList"
                          v-model="params.os_version"
                          clearable />
              </el-form-item>
              <el-form-item label="所属系统">
                <el-input @keydown.enter="searchList"
                          v-model="params.biz"
                          clearable />
              </el-form-item>

              <el-form-item label="应用管理员">
                <el-input @keydown.enter="searchList"
                          v-model="params.app_admin"
                          clearable />
              </el-form-item>
              <el-form-item label="中间件管理员">
                <el-input @keydown.enter="searchList"
                          v-model="params.middleware_admin"
                          clearable />
              </el-form-item>
              <el-form-item label="数据库管理员">
                <el-input @keydown.enter="searchList"
                          v-model="params.db_admin"
                          clearable />
              </el-form-item>
              <el-form-item label="机房">
                <el-input @keydown.enter="searchList"
                          v-model="params.room"
                          clearable />
              </el-form-item>
              <el-form-item label="安全接口人">
                <el-input @keydown.enter="searchList"
                          v-model="params.safe_person"
                          clearable />
              </el-form-item>

              <el-form-item label="标签">
                <el-input @keydown.enter="searchList"
                          v-model="params.label"
                          clearable />
              </el-form-item>
              <el-form-item label="系统状态">
                <el-select clearable
                           v-model="params.is_known">
                  <el-option label="已知"
                             value="1" />
                  <el-option label="未知"
                             value="0" />
                </el-select>
              </el-form-item>
              <el-form-item label="运行状态">
                <el-select clearable
                           multiple
                           collapse-tags
                           v-model="status">
                  <el-option v-for="(v, i) in hostOptaions.status"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产类型">
                <el-select clearable
                           multiple
                           collapse-tags
                           v-model="resource_type">
                  <el-option v-for="(v, i) in hostOptaions.resource_type"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产大类">
                <el-select clearable
                           multiple
                           collapse-tags
                           v-model="class_name">
                  <el-option v-for="(v, i) in hostOptaions.class_name"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
              <el-form-item label="数据中心">
                <el-select clearable
                           multiple
                           collapse-tags
                           v-model="data_center">
                  <el-option v-for="(v, i) in hostOptaions.data_center"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
              <el-form-item label="部署区域">
                <el-select clearable
                           multiple
                           collapse-tags
                           v-model="network_area">
                  <el-option v-for="(v, i) in hostOptaions.network_area"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>

              <el-form-item label="操作系统">
                <el-select clearable
                           v-model="params.os">
                  <el-option v-for="(v, i) in hostOptaions.os"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
            </span>
            <span v-show="ipOrApp != '1'">
              <el-form-item label="系统名称">
                <el-input @keydown.enter="searchList"
                          v-model="params.name"
                          clearable />
              </el-form-item>
              <el-form-item label="应用管理员">
                <el-input @keydown.enter="searchList"
                          v-model="params.biz_manager"
                          clearable />
              </el-form-item>

              <el-form-item label="软件厂商">
                <el-input @keydown.enter="searchList"
                          v-model="params.supplier"
                          clearable />
              </el-form-item>
              <el-form-item label="所属公司">
                <el-input @keydown.enter="searchList"
                          v-model="params.company"
                          clearable />
              </el-form-item>

              <el-form-item label="所属业务板块">
                <el-input @keydown.enter="searchList"
                          v-model="params.biz_plate"
                          clearable />
              </el-form-item>
              <el-form-item label="管理员邮箱">
                <el-input @keydown.enter="searchList"
                          v-model="params.mail_of_main"
                          clearable />
              </el-form-item>
              <el-form-item label="管理员电话">
                <el-input @keydown.enter="searchList"
                          v-model="params.tp_of_main"
                          clearable />
              </el-form-item>
              <el-form-item label="业务域">
                <el-input @keydown.enter="searchList"
                          v-model="params.domain"
                          clearable />
              </el-form-item>
              <el-form-item label="项目描述">
                <el-input @keydown.enter="searchList"
                          v-model="params.project_desc"
                          clearable />
              </el-form-item>
              <el-form-item label="对外业务内网ip">
                <el-input @keydown.enter="searchList"
                          v-model="params.external_lan_ip"
                          clearable />
              </el-form-item>
              <el-form-item label="负载IP">
                <el-input @keydown.enter="searchList"
                          v-model="params.load_ip"
                          clearable />
              </el-form-item>
              <el-form-item label="公网ip">
                <el-input @keydown.enter="searchList"
                          v-model="params.public_ip"
                          clearable />
              </el-form-item>
              <el-form-item label="对外开放端口">
                <el-input @keydown.enter="searchList"
                          v-model="params.open_port"
                          clearable />
              </el-form-item>
              <el-form-item label="审核人">
                <el-input @keydown.enter="searchList"
                          v-model="params.reviewer"
                          clearable />
              </el-form-item>
              <el-form-item label="等保级别">
                <el-select clearable
                           multiple
                           collapse-tags
                           v-model="biz_level">
                  <el-option v-for="(v, i) in bizOptaions.biz_level"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
              <el-form-item label="应用大类">
                <el-select clearable
                           v-model="params.biz_class">
                  <el-option v-for="(v, i) in bizOptaions.biz_class"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
              <el-form-item label="应用类别">
                <el-select clearable
                           multiple
                           collapse-tags
                           v-model="biz_type">
                  <el-option v-for="(v, i) in bizOptaions.biz_type"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
              <el-form-item label="系统状态">
                <el-select clearable
                           multiple
                           collapse-tags
                           v-model="biz_state">
                  <el-option v-for="(v, i) in bizOptaions.biz_state"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
              <el-form-item label="数据中心">
                <el-select v-model="params.deploy_info">
                  <el-option v-for="(v, i) in bizOptaions.data_center"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
              <el-form-item label="部署区域">
                <el-select v-model="params.network_area">
                  <el-option v-for="(v, i) in bizOptaions.network_area"
                             :label="v"
                             :value="v"
                             :key="i" />
                </el-select>
              </el-form-item>
            </span>
            <el-form-item label="数据来源">
              <el-select clearable
                         multiple
                         collapse-tags
                         v-model="source_id">
                <template #header>
                  <el-radio-group v-model="params.condition">
                    <el-radio-button label="精确"
                                     value="difference" />
                    <el-radio-button label="模糊"
                                     value="union" />
                  </el-radio-group>
                </template>
                <el-option label="CMDB"
                           value="CMDB" />
                <el-option label="EDR"
                           value="EDR" />
                <el-option label="手动导入"
                           value="手动导入" />
                <el-option label="扫描器"
                           value="扫描器" />
                <el-option label="采集自动匹配"
                           value="采集自动匹配" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tree-table-container">
        <treeUnit :treeData="treeData"
                  :value="ipOrApp"
                  v-loading="isLoading"
                  @onClickTree="onClickTree"
                  @changeTreeData="ipOrAppChange"></treeUnit>
        <div class="table-container">
          <table-unit :columns="listRef"
                      :list="tableData"
                      :total="total"
                      v-loading="isLoading"
                      :isSelection="true"
                      :currentPage="params.page"
                      :pageSize="params.limit"
                      @handleSelectionChange="handleSelectionChange"
                      @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange">
            <template v-slot="record">
              <el-button size="small"
                         @click="toDetail(record.record)"
                         link
                         type="primary">详情</el-button>
              <el-button v-show="ipOrApp != '1'"
                         type="primary"
                         size="small"
                         link
                         @click="hostList(record.record)">主机列表</el-button>
            </template>
          </table-unit>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
