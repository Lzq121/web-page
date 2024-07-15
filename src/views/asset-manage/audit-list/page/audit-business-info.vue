<template>
  <div class="distribution-order-layout">
    <dp title="审核详情"
        :desc="name"
        @back="backIndex">
      <div>
        <dl class="dl-container">
          <dt class="dl-title">基本信息</dt>

          <dd class="dl-content">
            <el-form :inline="true"
                     label-width="150px"
                     :model="addlist"
                     :rules="baseDataRules">
              <!-- <el-form-item label="设备ID">
								<span>{{ addlist.id }}</span>
							</el-form-item> -->
              <el-form-item label="业务系统名称">
                <span>{{ addlist.name }}</span>
              </el-form-item>

              <el-form-item label="所属业务板块">
                {{ addlist.biz_plate }}
              </el-form-item>
              <el-form-item label="系统状态">
                <span>{{ addlist.biz_state }}</span>
              </el-form-item>
              <el-form-item label="所属公司">
                <span>{{ addlist.company }}</span>
              </el-form-item>
              <el-form-item label="所属部门">
                <span>{{ addlist.dept_display }}</span>
              </el-form-item>

              <el-form-item label="业务域">
                <span>{{ addlist.domain }}</span>
              </el-form-item>
              <el-form-item label="网络域">
                <span>{{ addlist.network_area }}</span>
              </el-form-item>
              <el-form-item label="对外内网IP">
                <span>{{ addlist.external_lan_ip }}</span>
              </el-form-item>
              <el-form-item label="负载IP">
                <span>{{ addlist.load_ip }}</span>
              </el-form-item>
              <el-form-item label="公网ip">
                <span>{{ addlist.public_ip }}</span>
              </el-form-item>
              <el-form-item label="对外开放端口">
                <span>{{ addlist.open_port }}</span>
              </el-form-item>
              <el-form-item label="软件厂商">
                <span>{{ addlist.supplier }}</span>
              </el-form-item>
              <el-form-item label="可信度">
                <span>{{ addlist.credibility }}</span>
              </el-form-item>
              <el-form-item label="创建人">
                <span>{{ addlist.creator }}</span>
              </el-form-item>

              <el-form-item label="项目描述">
                <span>{{ addlist.project_desc }}</span>
              </el-form-item>
            </el-form>
          </dd>
        </dl>

        <!-- <dl class="dl-container">
					<dt class="dl-title">进程信息</dt>
					<table-unit :columns="columnsResult" :list="agentDetailList" :isShowPatination="false"> </table-unit>
				</dl> -->
        <dl class="dl-container">
          <dt class="dl-title">管理员信息</dt>
          <dd class="dl-content">
            <el-form :inline="true"
                     label-width="100px"
                     :model="addlist"
                     :rules="baseDataRules">
              <el-form-item label="应用管理员">
                <span>{{ addlist.biz_manager }}</span>
              </el-form-item>
              <el-form-item label="管理员邮箱">
                <span>{{ addlist.mail_of_main }}</span>
              </el-form-item>
              <el-form-item label="管理员电话">
                <span>{{ addlist.tp_of_main }}</span>
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
import { ref, watch } from 'vue';
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
let detailID: any = ref('');
let name: any = ref('');
let ipOrApp: any = ref('');
let parentTypeID: any = ref('');
let agentID: any = ref('');
let addType: any = ref('');
if (route.query.id) {
	detailID.value = route.query.id as string;
	name.value = route.query.name as string;
	addlist.value.id = route.query.id;
	ipOrApp.value = route.query.ipOrApp;
	parentTypeID.value = route.query.parentID;
	agentID.value = route.query.agentID;
	addType.value = route.query.addType;
	disabledEdit();
	detailsAll();
	journalListGetApi();

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
