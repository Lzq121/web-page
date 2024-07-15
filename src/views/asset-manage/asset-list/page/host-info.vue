
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { genFileId, ElMessage, ElMessageBox } from 'element-plus';
import apis from '../api';
import { regionqy, departmentOption, regionOption } from '../type';
import AdminTable from '../components/AdminTable.vue';

// ref
let disabledB = ref(true);
let disabledBNO = ref(false);

let rawDataListOBJ = ref([]);
let total1 = ref<number>(0);

let parentTypeList = ref([]);
let businessTypeList = ref([]);
let childList = ref([]);
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
	change_table: 'Hosts',
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
	let { code, msg } = await apis.knownListHostsPutIDApi(addlist.value.id, addlist.value);
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

// 主机父级
const hostParentListgGet = async () => {
	let { data } = await apis.hostParentListgGetApi();
	parentTypeList.value = data;
};

// 应用父级
const businessParentListgGet = async () => {
	let { data } = await apis.businessParentListgGetApi();
	businessTypeList.value = data;
};

// 子类
const childListgGet = async () => {
	let { data } = await apis.childListgGetApi({ id: parentTypeID.value });
	childList.value = data;
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

const parentChange = (val: any) => {
	parentTypeID.value = val;
	addlist.value.resource_type = '';
	childListgGet();
};
let assetFreshness: any = ref({});
// 详情展示
const detailsAll = async () => {
	let { data } = await apis.knownListHostGetIDApi(detailID.value);
	data.data_center = data.data_center.toString();
	data.dept = data.dept.toString();
	addlist.value = data;
	assetFreshness.value = data.asset_freshness || {};
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
let agentDetailList = ref([]);
let agentInfo = ref({
	agent_id: '',
	page: 1,
	limit: 30,
});
let agentTotal = ref<number>(0);
const agentDetailRq = async () => {
	agentInfo.value.agent_id = agentID.value;

	let { data, total } = await apis.agentDetailApi(agentInfo.value);
	agentTotal.value = total;
	agentDetailList.value = data;
};

const agentSizeChange = (val: number) => {
	agentInfo.value.limit = val;
	agentInfo.value.page = 1;
	agentDetailRq();
};
const agentCurrentChange = (val: number) => {
	agentInfo.value.page = val;
	agentDetailRq();
};

const router = useRouter();
const route = useRoute();
let detailID: any = ref('');

let parentTypeID: any = ref('');
let agentID: any = ref('');
if (route.query.id) {
	detailID.value = route.query.id as string;
	addlist.value.id = route.query.id;
	parentTypeID.value = route.query.parentID;
	agentID.value = route.query.agentID;
	disabledEdit();
	detailsAll();

	journalListGetApi();
	hostParentListgGet();
	childListgGet();
	getDropdownList();
	agentDetailRq();
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

const backIndex = () => {
	if (route.query.bizName) {
		router.push({ path: '/asset-manage/asset-list/host-list', query: { bizName: route.query.bizName } });
	} else {
		const query = {
			...route.query,
			ipOrApp: '1',
		};
		router.push({ path: '/asset-manage/asset-list', query });
	}
};
let baseData = ref({});
let baseDataRules = ref({});
let officeList = ref([]);
const getOfficeList = async () => {
	if (officeList.value.length > 0) {
		return;
	}
	const { data } = await apis.getOfficeList();
	officeList.value = data;
};

let adminDrawerVisible = ref(false);
let isLoadAdminTable = ref(false);

let adminType = ref('');
let adminTypeList = ref([
	{ id: 'safe_person', name: '安全接口人', disabled: false },
	{ id: 'host_manager', name: '主机管理员', disabled: false },
	{ id: 'app_admin', name: '应用管理员', disabled: false },
	{ id: 'db_admin', name: '数据库管理员', disabled: false },
	{ id: 'middleware_admin', name: '中间件管理员', disabled: false },
]);
let adminAddData = ref([]);
const selectFun = (val: any) => {
	adminAddData.value = val;
};
const addManager = () => {
	adminDrawerVisible.value = true;
	if (isLoadAdminTable.value) return;
	if (Array.isArray(addlist.value.manager_list)) {
		adminTypeList.value.forEach((item) => {
			addlist.value.manager_list.forEach((v: any) => {
				if (item.id === v.tag) {
					item.disabled = true;
				}
			});
		});
	}
	isLoadAdminTable.value = true;
};

const confirmAdd = async () => {
	if (adminAddData.value.length !== 1) {
		ElMessage.warning('请选择一个添加的管理员');
		return;
	}
	if (!adminType.value) {
		ElMessage.warning('请选择添加的管理员类型');
		return;
	}
	addlist.value[adminType.value] = adminAddData.value[0].id;
	let { code, msg } = await apis.knownListHostsPutIDApi(addlist.value.id, addlist.value);
	if (code == 2000) {
		ElMessage.success(msg);
		detailsAll();
		adminDrawerVisible.value = false;
	}
};
let adminDialogVisible = ref(false);
let managerData = ref({});
const editManager = (val: any) => {
	apis.getAdminObj(val.id).then((res: any) => {
		managerData.value = res.data;
		adminDialogVisible.value = true;
	});
	getOfficeList();
};
const confirmEdit = () => {
	apis.updateAdminObj(managerData.value).then((res) => {
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
			let idType = val.tag;
			addlist.value[idType] = '';
			let { code, msg } = await apis.knownListHostsPutIDApi(addlist.value.id, addlist.value);
			if (code == 2000) {
				ElMessage.success(msg);
			}
			detailsAll();
		})
		.catch(() => {});
};
</script>


<template>
  <div>
    <dp title="资产详情"
        :desc="route.query.queryName"
        @back="backIndex">
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
              <el-form-item label="设备IP:"
                            required>
                <span>{{addlist.ip}}</span>
              </el-form-item>
              <el-form-item label="设备名称:"
                            required>
                <el-input v-model="addlist.logical_name"
                          clearable />
              </el-form-item>

              <el-form-item label="资产大类:"
                            required>
                <el-select v-model="addlist.class_name"
                           @change="parentChange"
                           placeholder="-">
                  <el-option v-for="item in parentTypeList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="资产类型:"
                            required>
                <el-select v-model="addlist.resource_type"
                           placeholder="-">
                  <el-option v-for="item in childList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="所属应用:"
                            required>
                <el-select v-model="addlist.biz_display"
                           filterable
                           placeholder="-">
                  <el-option v-for="item in dropdownList"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="运行状态:"
                            required>
                <el-input class="input_span"
                          v-model="addlist.status" />
              </el-form-item>
              <el-form-item label="所属公司:"
                            required>
                <el-input class="input_span"
                          v-model="addlist.company" />
              </el-form-item>
              <el-form-item label="所属部门:"
                            required>
                <el-select value-key="value"
                           placeholder="-"
                           class="input_span"
                           v-model="addlist.dept">
                  <el-option v-for="item in departmentOption"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="接口人:"
                            required>
                <el-input v-model="addlist.safe_person_name"
                          clearable />
              </el-form-item>
              <el-form-item label="接口人电话:">
                <el-input v-model="addlist.tp_safe"
                          clearable />
              </el-form-item>
              <el-form-item label="接口人部门:">
                <el-input v-model="addlist.dept_safe"
                          clearable />
              </el-form-item>
              <el-form-item label="对外内网IP:">
                <el-input v-model="addlist.external_ip"
                          clearable />
              </el-form-item>
              <el-form-item label="对外外网IP:">
                <el-input v-model="addlist.internal_ip"
                          clearable />
              </el-form-item>
              <el-form-item label="主机名:">
                <el-input v-model="addlist.hostname"
                          clearable />
              </el-form-item>
              <el-form-item label="系统版本:">
                <el-input v-model="addlist.os_version"
                          clearable />
              </el-form-item>
              <el-form-item label="描述信息:"
                            style="width:95%">
                <el-input v-model="addlist.description"
                          type="textarea"
                          clearable />
              </el-form-item>
            </el-form>
          </dd>
        </dl>
        <dl class="dl-container-position">
          <dt>部署信息</dt>
          <dd>
            <el-form :inline="true"
                     label-width="150px"
                     :model="addlist"
                     :disabled="disabledB"
                     :rules="baseDataRules">
              <el-form-item label="数据中心:"
                            required>
                <el-select placeholder="-"
                           v-model="addlist.data_center">
                  <el-option v-for="item in regionOption"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="机房:">
                <el-input v-model="addlist.room"
                          clearable />
              </el-form-item>
              <el-form-item label="机柜:">
                <el-input v-model="addlist.rock"
                          clearable />
              </el-form-item>

              <el-form-item label="起始U位:">
                <el-input class="input_span"
                          v-model="addlist.end_u" />
              </el-form-item>
              <el-form-item label="终止U位:">
                <el-input class="input_span"
                          v-model="addlist.end_u" />
              </el-form-item>
              <el-form-item label="U位数:">
                <el-input class="input_span"
                          v-model="addlist.unit_digit" />
              </el-form-item>
              <el-form-item label="部署区域:"
                            required>
                <el-select value-key="value"
                           placeholder="-"
                           class="input_span"
                           v-model="addlist.network_area">
                  <el-option v-for="item in regionqy"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
            </el-form>
          </dd>
        </dl>
        <dl class="dl-container-position"
            v-if="assetFreshness.freshness_level">
          <dt>新鲜度和完整度</dt>
          <dd style="padding: 20px">
            <table class="m_table"
                   style="text-align: center">
              <tr class="bold-td">
                <td>新鲜度等级</td>
                <td>新鲜度得分</td>
                <td>完整度</td>
              </tr>
              <tr>
                <td>{{ assetFreshness.freshness_level }}</td>
                <td>{{ assetFreshness.freshness_score }}</td>
                <td>{{ assetFreshness.completion }}</td>
              </tr>
            </table>
          </dd>
        </dl>
        <dl class="dl-container-position"
            v-if="Array.isArray(addlist.manager_list)">
          <dt>管理员信息
            <el-button type="primary"
                       style="margin-left:20px"
                       link
                       @click="addManager">新增管理员</el-button>
          </dt>
          <dd>
            <table class="m_table"
                   style="text-align:center">
              <tr class="bold-td">
                <td>职责/角色</td>
                <td>姓名</td>
                <td>电话</td>
                <td>邮件</td>
                <td>所属部门</td>
                <td>操作</td>
              </tr>
              <tr v-for="item in addlist.manager_list"
                  :key="item.id">
                <td>{{item.duty}}</td>
                <td>{{item.name}}</td>
                <td>{{item.phone}}</td>
                <td>{{item.email}}</td>
                <td>{{item.office_name}}</td>
                <td>
                  <el-button type="primary"
                             link
                             @click="editManager(item)">编辑</el-button>
                  <el-button type="danger"
                             link
                             @click="delManager(item)">删除</el-button>
                </td>
              </tr>
            </table>
          </dd>
          <div></div>
        </dl>
        <dl class="dl-container-position">
          <dt>进程信息</dt>
          <table-unit :columns="columnsResult"
                      :list="agentDetailList"
                      :currentPage="agentInfo.page"
                      :pageSize="agentInfo.limit"
                      :total="agentTotal"
                      @handleSizeChange="agentSizeChange"
                      @handleCurrentChange="agentCurrentChange">
          </table-unit>
        </dl>
        <dl class="dl-container-position">
          <dt>维保信息</dt>
          <dd>
            <el-form :inline="true"
                     label-width="150px"
                     :model="addlist"
                     :disabled="disabledB"
                     :rules="baseDataRules">
              <el-form-item label="终止信息:">
                <el-input v-model="addlist.Maintenance_Info"
                          clearable />
              </el-form-item>
              <el-form-item label="维保厂商:">
                <el-input v-model="addlist.supplier"
                          clearable />
              </el-form-item>

              <el-form-item label="维保人员:">
                <el-input class="input_span"
                          v-model="addlist.Maintenance_staff"
                          clearable />
              </el-form-item>
            </el-form>
          </dd>
        </dl>
        <dl class="dl-container-position">
          <dt>更新日志</dt>
          <dd>
            <table-unit :currentPage="changeid.page"
                        :columns="columns"
                        :list="rawDataListOBJ"
                        :total="total1"
                        @handleSizeChange="handleSizeChange"
                        @handleCurrentChange="handleCurrentChange">
            </table-unit>
          </dd>
        </dl>
      </div>
    </dp>
    <el-dialog v-model="adminDialogVisible"
               title="编辑管理员"
               width="50%">
      <el-form :model="managerData"
               label-width="150px">
        <el-form-item label="姓名">
          <el-input v-model="managerData.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="managerData.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮件">
          <el-input v-model="managerData.email" />
        </el-form-item>
        <el-form-item label="所属处室">
          <el-select v-model="managerData.office"
                     placeholder="-">
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
        <el-select v-model="adminType"
                   style="width:50%;margin-right:20px"
                   placeholder="请选择管理员类型"
                   size="large">
          <el-option v-for="item in adminTypeList"
                     :key="item.id"
                     :label="item.name"
                     :disabled="item.disabled"
                     :value="item.id" />
        </el-select>
        <el-button type="primary"
                   @click="confirmAdd"
                   size="large"> 确认 新增 </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
@import '@/theme/mixins/formReset.scss';
</style>
