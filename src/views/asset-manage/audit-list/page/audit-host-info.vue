<template>
  <div class="distribution-order-layout">
    <dp title="审核详情"
        :desc="ip"
        @back="backIndex">
      <div>
        <dl class="dl-container">
          <dt class="dl-title">基本信息</dt>

          <dd class="dl-content">
            <el-form :inline="true"
                     label-width="100px"
                     :model="addlist"
                     :rules="baseDataRules">
              <el-form-item label="设备ID">
                <span>{{ addlist.id }}</span>
              </el-form-item>
              <el-form-item label="设备名称">
                <span :class="{ 'is-active': addlistID?.logical_name }">{{ addlist.logical_name }}</span>
              </el-form-item>
              <el-form-item label="设备IP">
                <span :class="{ 'is-active': addlistID?.ip }">{{ addlist.ip }}</span>
              </el-form-item>
              <el-form-item label="资产大类">
                <span :class="{ 'is-active': addlistID?.class_name }">
                  {{ addlist.class_name_display }}
                </span>
              </el-form-item>
              <el-form-item label="资产类型">
                <span :class="{ 'is-active': addlistID?.resource_type }">
                  {{ addlist.resource_type_display }}
                </span>
              </el-form-item>
              <el-form-item label="所属应用">
                <span :class="{ 'is-active': addlistID?.biz }">{{ addlist.biz_display }}</span>
              </el-form-item>
              <el-form-item label="运行状态">
                <span :class="{ 'is-active': addlistID?.status }">{{ addlist.status }}</span>
              </el-form-item>
              <el-form-item label="所属公司">
                <span :class="{ 'is-active': addlistID?.company }">{{ addlist.company }}</span>
              </el-form-item>
              <el-form-item label="所属部门">
                <span :class="{ 'is-active': addlistID?.dept }">
                  {{ addlist.dept_display }}
                </span>
              </el-form-item>
              <el-form-item label="接口人">
                <span :class="{ 'is-active': addlistID?.safe_person }">{{ addlist.safe_person }}</span>
              </el-form-item>
              <el-form-item label="接口人电话">
                <span :class="{ 'is-active': addlistID?.tp_safe }">{{ addlist.tp_safe }}</span>
              </el-form-item>
              <el-form-item label="接口人部门">
                <span :class="{ 'is-active': addlistID?.dept_safe }">{{ addlist.dept_safe }}</span>
              </el-form-item>
              <el-form-item label="对外内网IP">
                <span :class="{ 'is-active': addlistID?.external_ip }">{{ addlist.external_ip }}</span>
              </el-form-item>
              <el-form-item label="对外外网IP">
                <span :class="{ 'is-active': addlistID?.internal_ip }">{{ addlist.internal_ip }}</span>
              </el-form-item>
              <el-form-item label="主机名">
                <span :class="{ 'is-active': addlistID?.hostname }">{{ addlist.hostname }}</span>
              </el-form-item>
              <el-form-item label="描述信息">
                <span :class="{ 'is-active': addlistID?.description }">{{ addlist.description }}</span>
              </el-form-item>
            </el-form>
          </dd>
        </dl>
        <dl class="dl-container">
          <dt class="dl-title">部署信息</dt>
          <dd class="dl-content">
            <el-form :inline="true"
                     label-width="100px"
                     :model="addlist"
                     :rules="baseDataRules">
              <el-form-item label="数据中心">
                <span :class="{ 'is-active': addlistID?.data_center }">{{ addlist.data_center }}</span>
              </el-form-item>
              <el-form-item label="机房">
                <span :class="{ 'is-active': addlistID?.room }">{{ addlist.room }}</span>
              </el-form-item>
              <el-form-item label="机柜">
                <span :class="{ 'is-active': addlistID?.start_u }">{{ addlist.rock }}</span>
              </el-form-item>

              <el-form-item label="起始U位">
                <span :class="{ 'is-active': addlistID?.start_u }">{{ addlist.start_u }}</span>
              </el-form-item>
              <el-form-item label="终止U位">
                <span :class="{ 'is-active': addlistID?.end_u }">{{ addlist.end_u }}</span>
              </el-form-item>
              <el-form-item label="U位数">
                <span :class="{ 'is-active': addlistID?.unit_digit }">{{ addlist.unit_digit }}</span>
              </el-form-item>
              <el-form-item label="部署区域">
                <span :class="{ 'is-active': addlistID?.network_area }">
                  {{ addlist.network_area }}
                </span>
              </el-form-item>
            </el-form>
          </dd>
        </dl>

        <dl class="dl-container">
          <dt class="dl-title">管理员信息</dt>
          <dd class="dl-content">
            <el-form :inline="true"
                     label-width="150px"
                     :model="addlist"
                     :rules="baseDataRules">
              <el-form-item label="主机管理员">
                <span :class="{'is-active':addlistID?.host_manager}">{{ addlist.host_manager }}</span>
              </el-form-item>
              <el-form-item label="备用管理员">
                <span :class="{'is-active':addlistID?.bak_admin}">{{ addlist.bak_admin }}</span>
              </el-form-item>
              <el-form-item label="应用管理员">
                <span :class="{'is-active':addlistID?.app_admin}">{{ addlist.app_admin }}</span>
              </el-form-item>

              <el-form-item label="数据库管理员">
                <span :class="{'is-active':addlistID?.db_admin}">{{ addlist.db_admin }}</span>
              </el-form-item>
              <el-form-item label="中间件管理员">
                <span :class="{'is-active':addlistID?.middleware_admin}">{{addlist.middleware_admin}}</span>
              </el-form-item>
              <el-form-item label="主机管理员邮箱">
                <span :class="{'is-active':addlistID?.mail_of_main}">{{ addlist.mail_of_main }}</span>
              </el-form-item>
              <el-form-item label="主机管理员电话">
                <span :class="{'is-active':addlistID?.tp_of_main}">{{ addlist.tp_of_main }}</span>
              </el-form-item>
              <el-form-item label="主机管理员部门">
                <span :class="{'is-active':addlistID?.host_manager_dept}">{{ addlist.host_manager_dept }}</span>
              </el-form-item>
            </el-form>
          </dd>
        </dl>
        <dl class="dl-container">
          <dt class="dl-title">进程信息</dt>
          <table-unit :columns="columnsResult"
                      :list="agentDetailList"
                      :isShowPatination="false"> </table-unit>
        </dl>
        <dl class="dl-container">
          <dt class="dl-title">维保信息</dt>
          <dd class="dl-content">
            <el-form :inline="true"
                     label-width="100px"
                     :model="addlist"
                     :rules="baseDataRules">
              <el-form-item label="终止信息">
                <span :class="{'is-active':addlistID?.Maintenance_Info}">{{ addlist.Maintenance_Info }}</span>

              </el-form-item>
              <el-form-item label="维保厂商">
                <span :class="{'is-active':addlistID?.supplier}">{{ addlist.supplier }}</span>

              </el-form-item>

              <el-form-item label="维保人员">
                <span :class="{'is-active':addlistID?.Maintenance_staff}">{{ addlist.Maintenance_staff }}</span>

              </el-form-item>
            </el-form>
          </dd>
        </dl>
        <dl class="dl-container">
          <dt class="dl-title">更新日志</dt>
          <dd class="dl-content">
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { knownAPI } from '../api';
import { useRoute, useRouter } from 'vue-router';

// ref
let disabledB = ref(true);
let disabledBNO = ref(false);

let rawDataListOBJ = ref([]);
let total1 = ref<number>(0);

const columns = [
	{
		title: '更新人',
		dataIndex: 'modifier',
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
	page: 1,
	limit: 30,
});

let addlistID: any = ref([]);
const getChooseItem = async () => {
	let { data } = await knownAPI().getFieldsDApi({ data_id: detailID.value });
	addlistID.value = data;
};

// 详情展示
const detailsAll = async () => {
	if (ipOrApp.value == 'one') {
		let { data } = await knownAPI().knownListHostGetIDApi(detailID.value);
		data.data_center = data.data_center.toString();
		data.dept = data.dept.toString();
		addlist.value = data;
	} else {
		let { data } = await knownAPI().knownListBusinessGetIDApi(detailID.value);
		addlist.value = data;
	}
};

// 更新日志
const journalListGetApi = async () => {
	changeid.value.change_id = addlist.value.id;
	let { data, total } = await knownAPI().journalListGetApi(changeid.value);
	rawDataListOBJ.value = data;
	total1.value = total;
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
let detailID = ref('');
let ip = ref('');
let ipOrApp: any = ref('');
let parentTypeID: any = ref('');
let agentID: any = ref('');
let addType: any = ref('');
if (route.query.id) {
	detailID.value = route.query.id as string;
	ip.value = route.query.ip as string;
	addlist.value.id = route.query.id;
	ipOrApp.value = route.query.ipOrApp;
	parentTypeID.value = route.query.parentID;
	agentID.value = route.query.agentID;
	addType.value = route.query.addType;

	disabledEdit();
	detailsAll();

	journalListGetApi();

	if (ipOrApp.value == 'one') {
		getChooseItem();
		// agentDetailRq();
	}
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
	router.push({ path: `${route.query.url}`, query: {} });
};

let baseDataRules = ref({});
</script>

<style lang="scss" scoped>
.distribution-order-layout {
	:deep(.el-form--inline .el-form-item) {
		width: 45%;
	}
}
.is-active {
	color: red;
}
</style>
