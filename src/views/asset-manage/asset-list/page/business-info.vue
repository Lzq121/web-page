

<script lang="ts" setup>
import { ref, watch } from 'vue';
import apis from '../api';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { departmentOption, AllList } from '../type';
import AdminTable from '../components/AdminTable.vue';
import importFile from '@/components/importFile/index.vue';
// ref
let disabledB = ref(true);
let disabledBNO = ref(false);

let rawDataListOBJ = ref([]);
let total1 = ref<number>(0);

let dropdownList = ref([
	{
		id: '',
		name: '无',
	},
]);
const columns = [
	{
		title: '更新人',
		dataIndex: 'modifier_name',
	},
	{
		title: '变更内容',
		dataIndex: 'change_data',
	},
	{
		title: '更新时间',
		dataIndex: 'update_datetime',
	},
];
// 新增列表
let addlist: any = ref({
	id: '',
	logical_name: '',
	ip: '',
	class_name: '',
	resource_type: '',
	biz: '',
	status: '',
	company: '',
	dept: '',
	safe_person: '',
	tp_safe: '',
	dept_safe: '',
	external_ip: '',
	internal_ip: '',
	hostname: '',
	description: '',
	//基础信息结束
	data_center: '', //部署信息
	room: '',
	rock: '',
	start_u: '',
	end_u: '',
	unit_digit: '',
	network_area: '',
	equipment_usage: '',
	//部署信息结束
	os: '', //进程信息
	os_version: '',

	// 进程信息结束
	Maintenance_Info: '', //维保信息
	supplier: '',
	Maintenance_staff: '',
});
let changeid = ref({
	change_id: '',
	change_table: 'Business',
	page: 1,
	limit: 30,
});

// 新增
const addYes = async () => {
	if (
		addlist.value.logical_name === '' ||
		addlist.value.ip === '' ||
		addlist.value.class_name === '' ||
		addlist.value.resource_type === '' ||
		addlist.value.biz === '' ||
		addlist.value.status === '' ||
		addlist.value.company === '' ||
		addlist.value.dept === '' ||
		addlist.value.safe_person === '' ||
		addlist.value.data_center === '' ||
		addlist.value.network_area === '' ||
		addlist.value.os === '' ||
		addlist.value.os_version === ''
	) {
		ElMessage.error('请填写必选项');
	}
	let { code, msg } = await apis.knownListBusinessPutIDApi(addlist.value.id, addlist.value);
	if (code == 2000) {
		ElMessageBox.confirm('编辑成功，是否返回列表界面?', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(() => {
				router.push({ path: '/asset-manage/asset-list', query: route.query });
			})
			.catch(() => {});
	}
};

// 所属应用
const getDropdownList = async () => {
	let { data } = await apis.drowdowListgGetApi();
	dropdownList.value = [
		{
			id: '',
			name: '无',
		},
	];
	dropdownList.value = dropdownList.value.concat(data);
};

// 详情展示
let adminObj = ref({});
let filelist = ref([]);
let deployInfoList = ref([]);
const detailsAll = async () => {
	let { data } = await apis.knownListBusinessGetIDApi(detailID.value);
	addlist.value = data;
	adminObj.value = addlist.value.biz_manager_list;
	filelist.value = addlist.value.file_list;
	deployInfoList.value = data.deploy_info;
};

// 更新日志
const journalListGetApi = async () => {
	changeid.value.change_id = addlist.value.id;
	let { data, total } = await apis.journalListGetApi(changeid.value);
	rawDataListOBJ.value = data;
	total1.value = total;
};

const editAssets = () => {
	disabledB.value = false;
	disabledBNO.value = true;
};
const disabledEdit = () => {
	disabledB.value = true;
	disabledBNO.value = false;
};
const handleSizeChange = (val: number) => {
	changeid.value.limit = val;
	changeid.value.page = 1;
	journalListGetApi();
};
const handleCurrentChange = (val: number) => {
	changeid.value.page = val;
	journalListGetApi();
};
const router = useRouter();
const route = useRoute();
let detailID: any = ref('');

let parentTypeID: any = ref('');
let agentID: any = ref('');

const columnsResult = [
	{
		title: '进程PID',
		dataIndex: 'process_id',
	},
	// {
	// 	title: '进程名',
	// 	dataIndex: 'app_name',
	// },
	{
		title: '进程版本',
		dataIndex: 'process_version',
	},
	{
		title: '进程状态',
		dataIndex: 'process_status',
	},
	{
		title: '端口号',
		dataIndex: 'port',
	},
	{
		title: '应用名',
		dataIndex: 'app_name',
	},
	{
		title: '应用版本',
		dataIndex: 'app_version',
	},
	{
		title: '应用类别',
		dataIndex: 'app_type',
	},
];
let agentDetailList = ref([]);
let agentInfo = ref({
	agent_id: '',
});
const agentDetailRq = async () => {
	agentInfo.value.agent_id = agentID.value;

	let { data, total } = await apis.agentDetailApi();

	agentDetailList.value = data;
};

const backIndex = () => {
	const query = {
		ipOrApp: '2',
		...route.query,
	};
	router.push({ path: '/asset-manage/asset-list', query });
};

let baseDataRules = ref({});

let adminDrawerVisible = ref(false);
let isLoadAdminTable = ref(false);

let adminAddData = ref([]);
const selectFun = (val: any) => {
	adminAddData.value = val;
};
const addManager = (val: any) => {
	adminDrawerVisible.value = true;
	if (isLoadAdminTable.value) return;
	isLoadAdminTable.value = true;
};
let officeList = ref([]);
const getOfficeList = async () => {
	if (officeList.value.length > 0) {
		return;
	}
	const { data } = await apis.getOfficeList();
	officeList.value = data;
};
const confirmAdd = async () => {
	if (adminAddData.value.length !== 1) {
		ElMessage.warning('请选择一个添加的管理员');
		return;
	}
	addlist.value.biz_manager = adminAddData.value[0].id;
	let { code, msg } = await apis.knownListBusinessPutIDApi(addlist.value.id, addlist.value);
	if (code == 2000) {
		ElMessage.success(msg);
		detailsAll();
		adminDrawerVisible.value = false;
	}
};
let adminDialogVisible = ref(false);
const editManager = (val: any) => {
	apis.getAdminObj(val.id).then((res: any) => {
		adminObj.value = res.data;
		adminDialogVisible.value = true;
	});
	getOfficeList();
};
const confirmEdit = () => {
	apis.updateAdminObj(adminObj.value).then((res: any) => {
		if (res.code === 2000) {
			ElMessage.success('编辑成功');
			adminDialogVisible.value = false;
			detailsAll();
		}
	});
};
const delManager = (val: any) => {
	ElMessageBox.confirm('删除该条信息，是否确认?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			addlist.value.biz_manager = '';
			let { code, msg } = await apis.knownListBusinessPutIDApi(addlist.value.id, addlist.value);
			if (code == 2000) {
				ElMessage.success(msg);
				detailsAll();
			}
		})
		.catch(() => {});
};

const columnsUrl = [
	{ title: '域名/URL', dataIndex: 'domain' },
	{ title: '业务内网IP', dataIndex: 'addr' },
	{ title: '公网IP', dataIndex: 'map_ip' },
	{ title: '对外端口', dataIndex: 'service_port' },
	{ title: '所属公司', dataIndex: 'company_name' },
	{ title: '应用负责人', dataIndex: 'info_admin_name' },
	{ title: '部署位置', dataIndex: 'network_area' },
	{ title: '备注', dataIndex: 'notes' },
	{ title: '资产状态', dataIndex: 'status' },
	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
];
let urlList = ref([]);
let urlTotal = ref(0);
let urlParams = ref({
	limit: 30,
	page: 1,
	business: '',
	equal: true,
});
let companyList = ref([]);
const fetchCompanyList = async () => {
	const res = await apis.getCompanyList();
	companyList.value = res.data;
};
let adminList = ref([]);
const fetchAdminList = async () => {
	const res = await apis.getAdminList({ page: 1, limit: 9999 });
	adminList.value = res.data;
};
const getUrlInfo = async () => {
	urlParams.value.business = route.query.queryName;
	let { data, total } = await apis.getUrlList(urlParams.value);
	urlTotal.value = total;
	urlList.value = data;
	if (companyList.value.length === 0) {
		fetchCompanyList();
	}
	if (adminList.value.length === 0) {
		fetchAdminList();
	}
};
const handleSizeChangeUrlInfo = (val: number) => {
	urlParams.value.limit = val;
	urlParams.value.page = 1;
	getUrlInfo();
};
const handleCurrentChangeUrlInfo = (val: number) => {
	urlParams.value.page = val;
	getUrlInfo();
};

let editRowUrlData = ref({
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
let urlDialogVisible = ref(false);
const addUrl = () => {
	urlDialogVisible.value = true;
	editRowUrlData.value = {
		business: route.query.queryName,
		domain: '',
		addr: '',
		service_port: '',
		company_id: '',
		info_admin_id: '',
		network_area: '',
		notes: '',
		map_ip: null,
		status: null,
	};
};
const editRowUrl = async (val: any) => {
	apis.getUrlObj(val.id).then((res: any) => {
		if (res.code == 2000) {
			for (const key in editRowUrlData.value) {
				editRowUrlData.value[key] = res.data[key];
			}
			urlDialogVisible.value = true;
		}
	});
};
const urlFormRef = ref<FormInstance>();
const confirmEditUrl = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			if (editRowUrlData.value.id) {
				const res = await apis.updateUrlObj(editRowUrlData.value);
				if (res.code === 2000) {
					ElMessage.success('编辑成功');
				}
			} else {
				const res = await apis.addUrlObj(editRowUrlData.value);
				if (res.code === 2000) {
					ElMessage.success('新增成功');
				}
			}
			editRowUrlData.value = {
				business: route.query.queryName,
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
			getUrlInfo();
			urlDialogVisible.value = false;
		}
	});
};
const delRowUrl = (val: any) => {
	ElMessageBox.confirm('确认删除吗?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await apis.delUrlObj(val.id);
			if (res.code === 2000) {
				ElMessage.success('删除成功');
				getUrlInfo();
			}
		})
		.catch(() => {});
};
let isOpenHostList = ref(false);
let hostListData = ref([]);
let hostCols = [...AllList];
hostCols.pop();
let tableHeight = window.innerHeight - 70;
let hostListTotal = ref(0);
const hostList = async (val) => {
	let params = {
		network_area: val.network_area,
		data_center: val.data_center,
		limit: 99999,
		page: 1,
		biz_id: route.query.id,
	};
	let res = await apis.knownListGetApi(params);
	hostListData.value = res.data;
	hostListTotal.value = res.total;
	hostListData.value.forEach((item: any) => {
		item.tags = item.assets_label;
	});
	isOpenHostList.value = true;
};

if (route.query.id) {
	detailID.value = route.query.id as string;
	addlist.value.id = route.query.id;
	parentTypeID.value = route.query.parentID;
	agentID.value = route.query.agentID;

	disabledEdit();
	detailsAll();
	journalListGetApi();
	getUrlInfo();
	addlist.value = {
		id: '',
		logical_name: '',
		ip: '',
		class_name: '',
		resource_type: '',
		biz: '',
		status: '',
		company: '',
		dept: '',
		safe_person: '',
		tp_safe: '',
		dept_safe: '',
		external_ip: '',
		internal_ip: '',
		hostname: '',
		description: '',
		//基础信息结束
		data_center: '', //部署信息
		room: '',
		rock: '',
		start_u: '',
		end_u: '',
		unit_digit: '',
		network_area: '',
		equipment_usage: '',
		//部署信息结束
		os: '', //进程信息
		os_version: '',

		// 进程信息结束
		Maintenance_Info: '', //维保信息
		supplier: '',
		Maintenance_staff: '',
	};
}
</script>
<template>
  <div>
    <dp @back="backIndex"
        title='资产详情'
        :desc="route.query.queryName">
      <template #right>
        <el-button type="primary"
                   v-show="!disabledBNO"
                   @click="editAssets">编辑</el-button>
        <el-button @click="disabledEdit"
                   v-show="disabledBNO">取消</el-button>
        <el-button type="primary"
                   v-show="disabledBNO"
                   @click="addYes">确认</el-button>
      </template>
      <div :class="{isActivate:!disabledBNO}"
           class="disabled-three-form-layout">
        <dl class="dl-container-position">
          <dt>基本信息</dt>
          <dd>
            <el-form :inline="true"
                     label-width="150px"
                     :model="addlist"
                     :disabled="disabledB"
                     :rules="baseDataRules">
              <el-form-item label="业务系统名称:"
                            required>
                <el-input v-model="addlist.name"
                          clearable />
              </el-form-item>

              <el-form-item label="所属业务板块:"
                            required>
                <el-input v-model="addlist.biz_plate"
                          clearable />
              </el-form-item>
              <el-form-item label="系统状态:"
                            required>
                <el-input v-model="addlist.biz_state" />
              </el-form-item>
              <el-form-item label="所属公司:"
                            required>
                <el-input v-model="addlist.company" />
              </el-form-item>
              <el-form-item label="所属部门:"
                            required>
                <el-select value-key="value"
                           placeholder="-"
                           v-model="addlist.dept">
                  <el-option v-for="item in departmentOption"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>

              <el-form-item label="业务域:">
                <el-input v-model="addlist.domain"
                          clearable />
              </el-form-item>
              <el-form-item label="网络域:">
                <el-input v-model="addlist.network_area"
                          clearable />
              </el-form-item>
              <el-form-item label="对外内网IP:">
                <el-input v-model="addlist.external_lan_ip"
                          clearable />
              </el-form-item>
              <el-form-item label="负载IP:">
                <el-input v-model="addlist.load_ip"
                          clearable />
              </el-form-item>
              <el-form-item label="公网ip:">
                <el-input v-model="addlist.public_ip"
                          clearable />
              </el-form-item>
              <el-form-item label="对外开放端口:">
                <el-input v-model="addlist.open_port"
                          clearable />
              </el-form-item>
              <el-form-item label="软件厂商:">
                <el-input v-model="addlist.supplier"
                          clearable />
              </el-form-item>
              <el-form-item label="可信度:">
                <el-input v-model="addlist.credibility"
                          clearable />
              </el-form-item>
              <el-form-item label="创建人:">
                <el-input v-model="addlist.creator"
                          clearable />
              </el-form-item>
              <el-form-item label="是否互联网应用:">
                <el-select clearable
                           placeholder=""
                           v-model="addlist.or_internet_app">
                  <el-option label="是"
                             value="是" />
                  <el-option label="否"
                             value="否" />
                  <el-option label="未知"
                             value="未知" />
                </el-select>
              </el-form-item>
              <el-form-item label="项目描述:"
                            style="width:95%">
                <el-input type="textarea"
                          v-model="addlist.project_desc"
                          clearable />
              </el-form-item>
            </el-form>
          </dd>
        </dl>
        <dl class="dl-container-position">
          <dt>部署信息</dt>
          <dd>
            <table class="m_table"
                   style="text-align:center">
              <tr class="bold">
                <td>数据中心</td>
                <td>部署区域</td>
                <td>操作</td>
              </tr>
              <tr v-for="(i) in deployInfoList">
                <td>{{i.data_center}}</td>
                <td>{{i.network_area}}</td>
                <td>
                  <el-button type="primary"
                             size="small"
                             link
                             @click="hostList(i)">主机列表</el-button>

                </td>
              </tr>
            </table>
          </dd>
        </dl>
        <dl class="dl-container-position">
          <dt>应用档案
            <importFile :data="{business:route.query.id}"
                        apis="/apis/assets/business/">上传文件</importFile>
          </dt>
          <dd>
            <table class="m_table"
                   style="text-align:center"
                   v-if="Array.isArray(filelist) && filelist.length > 0">
              <tr class="bold">
                <td>文件名称</td>
                <td>上传人员</td>
                <td>上传日期</td>
                <td>修改人员</td>
                <td>更新日期</td>
                <td>文件大小</td>
              </tr>
              <tr v-for="file in filelist"
                  :key="file.url">
                <td>
                  <a :href="file.url"
                     target="_blank">{{file.name}}</a>
                </td>
                <td>{{file.creator_name}}</td>
                <td>{{file.create_datetime}}</td>
                <td>{{file.modifier_name}}</td>
                <td>{{file.update_datetime}}</td>
                <td>{{file.size}}</td>
              </tr>

            </table>
            <el-empty v-else
                      description="数据为空" />
          </dd>
        </dl>
        <dl class="dl-container-position">
          <dt>管理员信息
            <el-button type="primary"
                       style="margin-left:20px"
                       link
                       v-if="!adminObj.uname"
                       @click="addManager">新增管理员</el-button>
          </dt>
          <dd>
            <table class="m_table"
                   style="text-align:center"
                   v-if="adminObj.name">
              <tr class="bold-td">
                <td>应用管理员</td>
                <td>管理员邮箱</td>
                <td>管理员电话</td>
                <td>管理员处室</td>
                <td>操作</td>
              </tr>
              <tr>
                <td>{{adminObj.name}}</td>
                <td>{{adminObj.phone}}</td>
                <td>{{adminObj.email}}</td>
                <td>{{adminObj.office_name}}</td>
                <td>
                  <el-button type="primary"
                             link
                             @click="editManager(adminObj)">编辑</el-button>
                  <el-button type="danger"
                             link
                             @click="delManager(adminObj)">删除</el-button>
                </td>
              </tr>
            </table>
            <el-empty v-else
                      description="信息为空" />
          </dd>
        </dl>
        <dl class="dl-container-position">
          <dt>
            URL信息
            <el-button @click="addUrl"
                       type="primary"
                       icon="CirclePlus"
                       link>新增URL</el-button>
          </dt>
          <dd>
            <table-unit :columns="columnsUrl"
                        :list="urlList"
                        :total="urlTotal"
                        :currentPage="urlParams.page"
                        :pageSize="urlParams.limit"
                        @handleSizeChange="handleSizeChangeUrlInfo"
                        @handleCurrentChange="handleCurrentChangeUrlInfo">
              <template v-slot="{record}">
                <el-button plain
                           size="small"
                           link
                           type="primary"
                           @click="editRowUrl(record)">编辑</el-button>
                <el-button plain
                           size="small"
                           link
                           type="danger"
                           @click="delRowUrl(record)">删除</el-button>
              </template>
            </table-unit>

            <el-dialog v-model="urlDialogVisible"
                       title="新增/编辑"
                       width="50%">
              <el-form :model="editRowUrlData"
                       label-suffix=":"
                       label-width="120px"
                       ref="urlFormRef">
                <el-form-item label="系统名称"
                              prop="business">
                  <el-input v-model="editRowUrlData.business"
                            disabled></el-input>
                </el-form-item>

                <el-form-item label="业务内网ip"
                              prop="addr"
                              :rules="[
        {message: '请正确输入IP',pattern:/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/ ,trigger:'blur'}]">
                  <el-input v-model="editRowUrlData.addr"></el-input>
                </el-form-item>
                <el-form-item label="公网ip"
                              prop="map_ip"
                              :rules="[
        {message: '请正确输入IP',pattern:/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/ ,trigger:'blur'}]">
                  <el-input v-model="editRowUrlData.map_ip"></el-input>
                </el-form-item>
                <el-form-item label="域名/url"
                              prop="domain"
                              :rules="[
        {message: '请正确输入域名',pattern:/^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/ ,trigger:'blur'}]">
                  <el-input v-model="editRowUrlData.domain"></el-input>
                </el-form-item>
                <el-form-item label="对外开放端口"
                              prop="service_port">
                  <el-input v-model="editRowUrlData.service_port"
                            type="number"></el-input>
                </el-form-item>
                <el-form-item label="部署位置"
                              prop="network_area">
                  <el-input v-model="editRowUrlData.network_area"></el-input>
                </el-form-item>

                <el-form-item label="所属公司"
                              prop="company_id">
                  <el-select v-model="editRowUrlData.company_id"
                             filterable>
                    <el-option v-for="item in companyList"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="应用负责人"
                              prop="info_admin_id">
                  <el-select v-model="editRowUrlData.info_admin_id"
                             filterable>
                    <el-option v-for="item in adminList"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id" />
                  </el-select>
                </el-form-item>

                <el-form-item label="资产状态"
                              prop="status">
                  <el-select v-model="editRowUrlData.status"
                             clearable>
                    <el-option label="在线"
                               value="在线" />
                    <el-option label="不在线"
                               value="不在线" />
                    <el-option label="未知"
                               value="未知" />
                  </el-select>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="editRowUrlData.notes"
                            type="textarea" />
                </el-form-item>
              </el-form>
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="urlDialogVisible = false">取消</el-button>
                  <el-button type="primary"
                             @click="confirmEditUrl(urlFormRef)">
                    确认
                  </el-button>
                </div>
              </template>
            </el-dialog>
          </dd>
        </dl>
        <dl class="dl-container-position">
          <dt>更新日志</dt>
          <dd>
            <table-unit :currentPage="changeid.page"
                        :pageSize="changeid.limit"
                        :columns="columns"
                        :list="rawDataListOBJ"
                        :total="total1"
                        @handleSizeChange="handleSizeChange"
                        @handleCurrentChange="handleCurrentChange">
            </table-unit>
          </dd>
        </dl>
      </div>
      <el-dialog v-model="adminDialogVisible"
                 title="编辑管理员"
                 width="50%">
        <el-form :model="adminObj"
                 label-width="150px">
          <el-form-item label="姓名">
            <el-input v-model="adminObj.name"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="adminObj.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮件">
            <el-input v-model="adminObj.email" />
          </el-form-item>
          <el-form-item label="所属处室">
            <el-select v-model="adminObj.office">
              <el-option v-for="item in officeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" />
            </el-select>
          </el-form-item>

        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="adminDialogVisible = false">取消</el-button>
            <el-button type="primary"
                       @click="confirmEdit"> 确认 </el-button>
          </div>
        </template>
      </el-dialog>
      <el-drawer v-model="adminDrawerVisible"
                 title="新增管理员"
                 size="70%">
        <template #header></template>
        <admin-table v-if="isLoadAdminTable"
                     @selectFun="selectFun"></admin-table>
        <div style="text-align:right;padding:30px 50px 0 0">
          <el-button type="primary"
                     @click="confirmAdd"
                     size="large"> 确认 新增 </el-button>
        </div>
      </el-drawer>
      <el-drawer v-model="isOpenHostList"
                 :title="`主机列表（${hostListTotal}条）`"
                 size="80%">
        <table-unit :columns="hostCols"
                    :list="hostListData"
                    :isIndex="true"
                    :height="tableHeight"
                    :isShowPatination="false">
        </table-unit>
      </el-drawer>
    </dp>
  </div>
</template>
<style lang="scss" scoped>
@import '@/theme/mixins/formReset.scss';
</style>
