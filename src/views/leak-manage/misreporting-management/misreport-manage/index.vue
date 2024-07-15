<template>
	<div>
		<div class="table-container">
			<div class="form-container">
				<div class="form-title">
					<h3>漏洞误报管理</h3>
					<div class="button-box">
						<el-button link type="primary" icon="Plus" @click="addBtn">新 增</el-button>
						<span>
							<importExcel :apiSuffix="false" api="/api/robot/misreport_import/">导入数据</importExcel>
						</span>
						<el-button link type="primary" @click="excelExcel" icon="Download">导出数据</el-button>
						<el-button link type="primary" @click="removeBtn">批量移除</el-button>
						
						
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
					<el-form :inline="true" :model="params" label-width="100px" label-suffix="：">
						<el-form-item label="IP">
							<el-input v-model="params.ip" clearable />
						</el-form-item>
						<el-form-item label="归属系统">
							<el-input v-model="params.biz_display" clearable />
						</el-form-item>
						<el-form-item label="漏洞名称">
							<el-input v-model="params.name" clearable />
						</el-form-item>
						<!-- <el-form-item label="数据中心">
							<el-select v-model="params.type">
								<el-option label="主机漏洞" value="主机漏洞" />
								<el-option label="WEB应用" value="WEB应用" />
								<el-option label="其他" value="其他" />
							</el-select>
						</el-form-item> -->
						<el-form-item label="部署区域">
							<el-input v-model="params.network_area" clearable />
						</el-form-item>
						<el-form-item label="漏洞状态">
							<el-select v-model="params.assess_status">
								<el-option label="新发现" value="发现" />
								<el-option label="已评估" value="已评估" />
								<el-option label="已通知" value="已通知" />
								<el-option label="已认领" value="已认领" />
								<el-option label="待验证" value="待验证" />
								<el-option label="验证不通过" value="验证不通过" />
								<el-option label="已修复" value="已修复" />
								<el-option label="已超时" value="已超期" />
							</el-select>
						</el-form-item>
						<el-form-item label="CVEID">
							<el-input v-model="params.cveid" clearable />
						</el-form-item>
						<el-form-item label="所属单位">
							<el-input v-model="params.company" clearable />
						</el-form-item>
						<el-form-item label="受影响产品">
							<el-input v-model="params.affected_product" clearable />
						</el-form-item>
						<el-form-item label="等级">
							<el-input v-model="params.level" clearable />
						</el-form-item>
						<el-form-item label="漏洞描述">
							<el-input v-model="params.description" clearable />
						</el-form-item>
						<el-form-item label="漏洞途径">
							<el-input v-model="params.utilization_way" clearable />
						</el-form-item>
						<el-form-item label="漏洞来源" multiple collapse-tags>
							<el-input v-model="params.data_source" clearable />
						</el-form-item>
						<el-form-item label="厂商">
							<el-select v-model="params.vendor" placeholder="-">
								<el-option v-for="item in vendorDict" :key="item.id" :label="item.name" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-form>
				</div>
				<!-- table -->
			</div>
			<div class="table-box">
				<table-unit
					:pageSize="params.limit"
					:currentPage="params.page"
					:isSelection="true"
					@handleSelectionChange="handleSelectionChange"
					:columns="columns"
					:list="list"
					:total="total"
					@handleSizeChange="handleSizeChange"
					@handleCurrentChange="handleCurrentChange"
				>
					<template v-slot="record">
						<el-button type="primary" size="small" link @click="viewRow(record.record)">详 情</el-button>
					</template>
				</table-unit>
			</div>
		</div>
		<el-drawer v-model="drawerOpen" size="45%" :title="ledgerDetail.name">
			<div>
				<dl class="dl-container">
					<dt class="dl-title blue-triangle">
						漏洞信息
						<!-- <el-button style="position: absolute; right: 20px" type="danger" @click="addMisinformationBtn">添加到误报库</el-button> -->
					</dt>
					<dd class="dl-content">
						<table class="m_table_no_border">
							<tr>
								<td>漏洞ID</td>
								<td>{{ ledgerDetail.id }}</td>
							</tr>
							<tr>
								<td>漏洞名称</td>
								<td>{{ ledgerDetail.name }}</td>
							</tr>
							<tr>
								<td>漏洞类型</td>
								<td style="color: orange">{{ ledgerDetail.type }}</td>
							</tr>
							<tr>
								<td>漏洞等级</td>
								<td>{{ ledgerDetail.level }}</td>
							</tr>
							<tr>
								<td>受影响产品</td>
								<td>{{ ledgerDetail.affected_product }}</td>
							</tr>
							<tr>
								<td>严重程度</td>
								<td style="color: red">{{ ledgerDetail.severity }}</td>
							</tr>
							<tr>
								<td>漏洞描述</td>
								<td>{{ ledgerDetail.description }}</td>
							</tr>
							<tr>
								<td>利用途径</td>
								<td>{{ ledgerDetail.utilization_way }}</td>
							</tr>
							<tr>
								<td>处理时限</td>
								<td>{{ ledgerDetail.processing_limit }}</td>
							</tr>
							<tr>
								<td>CVE-ID</td>
								<td>{{ ledgerDetail.cveld }}</td>
							</tr>
							<tr>
								<td>首次发现时间</td>
								<td>{{ ledgerDetail.discovery_time }}</td>
							</tr>
							<tr>
								<td>修复建议</td>
								<td>{{ ledgerDetail.repair_suggestion }}</td>
							</tr>
							<tr>
								<td>厂商补丁</td>
								<td>
									<el-button link type="primary">{{ ledgerDetail.vendor_display }}</el-button>
								</td>
							</tr>
							<tr>
								<td>其它信息</td>
								<td>{{ ledgerDetail.other_information }}</td>
							</tr>
							<tr>
								<td>收录时间</td>
								<td>{{ ledgerDetail.collection_time }}</td>
							</tr>
							<tr>
								<td>最近更新时间</td>
								<td>{{ ledgerDetail.update_time }}</td>
							</tr>
							<tr>
								<td>漏洞扫描类型</td>
								<td style="color: red">{{ ledgerDetail.information_type }}</td>
							</tr>
							<tr>
								<td>数据来源</td>
								<td>
									<el-button link type="primary">{{ ledgerDetail.data_source }}</el-button>
								</td>
							</tr>
							<tr>
								<td>获取方式</td>
								<td>{{ ledgerDetail.acquisition_mode }}</td>
							</tr>
							<tr>
								<td>厂商和版本</td>
								<td>{{ ledgerDetail.vendor_display }}</td>
							</tr>
						</table>
					</dd>
				</dl>
				<dl class="dl-container">
					<dt class="dl-title blue-triangle">标签信息</dt>
					<dd class="dl-content">
						<table class="m_table_no_border">
							<tr>
								<td>{{ ledgerDetail.assess_status }}</td>
							</tr>
						</table>
					</dd>
				</dl>
				<dl class="dl-container">
					<dt class="dl-title blue-triangle">受影响资产信息</dt>
					<dd class="dl-content">
						<table class="m_table_no_border">
							<tr>
								<td>IP</td>
								<td>{{ ledgerDetail.ip }}</td>
								<td>端口</td>
								<td>{{ ledgerDetail.port }}</td>
							</tr>
							<tr>
								<td>系统名称</td>
								<td>{{ ledgerDetail.biz_display }}</td>
								<td>资产类别</td>
								<td>{{ ledgerDetail.resource_type_display }}</td>
							</tr>
							<tr>
								<td>资产大类</td>
								<td>{{ ledgerDetail.class_display }}</td>
								<td>所属公司（应用）</td>
								<td>{{ ledgerDetail.company }}</td>
							</tr>

							<tr>
								<td>应用管理员</td>
								<td>{{ ledgerDetail.app_admin_display }}</td>
								<td>安全接口人</td>
								<td>{{ ledgerDetail.safe_person_display }}</td>
							</tr>

							<tr>
								<td>部署区域</td>
								<td>{{ ledgerDetail.network_area }}</td>
								<td>数据中心</td>
								<td>{{ ledgerDetail.data_center }}</td>
							</tr>
						</table>
					</dd>
				</dl>
				<dl class="dl-container" v-if="detailsList.length">
					<dt class="dl-title blue-triangle">误报数据</dt>
					<dd class="dl-content">
						<table class="m_table" style="text-align: center">
							<tr>
								<td>处置人</td>
								<td>处置时间</td>
								<td>描述</td>
							</tr>
							<tr v-for="(item, index) in detailsList" :key="index">
								<td>{{ item.evaluate_man }}</td>
								<td>{{ item.time }}</td>
								<td>{{ item.reason }}</td>
							</tr>
						</table>
					</dd>
				</dl>
			</div>
		</el-drawer>

		<el-drawer v-model="drawerMisOpen" size="45%" :title="ledgerDetail.name">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>误报描述</span>
						<el-button style="margin-left: 20px" size="small" type="primary" @click="sureAddMis">确认提交</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="addForm" label-width="auto" style="max-width: 600px">
							<!-- <el-form-item label="处置人">
								<el-input v-model="addForm.evaluate_man" />
							</el-form-item>

							<el-form-item label="处置时间">
								<el-date-picker style="width: 100%;" v-model="addForm.time" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" />
							</el-form-item> -->
							<el-form-item label="误报描述">
								<el-input type="textarea" v-model="addForm.desc" />
							</el-form-item>
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>

		<el-drawer v-model="addDrawer" size="40%" title="新增">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>漏洞信息</span>
						<el-button style="margin-left: 20px" size="small" type="primary" @click="addSureBtn">确认提交</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="addParams" label-width="auto" style="max-width: 600px">
							<el-form-item label="漏洞ID" required>
								<el-input v-model="addParams.name" />
							</el-form-item>
							<!-- <el-form-item label="漏洞类型">
								<el-input v-model="addParams.type" />
							</el-form-item>
							<el-form-item label="漏洞子类型">
								<el-select v-model="addParams.small_type" clearable>
									<el-option label="操作系统" value="操作系统" />
									<el-option label="数据库" value="数据库" />
									<el-option label="中间件" value="中间件" />
									<el-option label="应用软件" value="应用软件" />
									<el-option label="web漏洞" value="web漏洞" />
								</el-select>
							</el-form-item>
							<el-form-item label="漏洞等级">
								<el-input v-model="addParams.level" />
							</el-form-item>
							<el-form-item label="严重程度">
								<el-input v-model="addParams.severity" />
							</el-form-item>
							<el-form-item label="漏洞描述">
								<el-input v-model="addParams.description" />
							</el-form-item>
							<el-form-item label="利用途径">
								<el-input v-model="addParams.utilization_way" />
							</el-form-item>
							<el-form-item label="处理时限">
								<el-input v-model="addParams.processing_limit" />
							</el-form-item>
							<el-form-item label="首次发现时间">
								<el-input v-model="addParams.discovery_time" />
							</el-form-item>
							<el-form-item label="修复建议">
								<el-input v-model="addParams.repair_suggestion" />
							</el-form-item>
							<el-form-item label="其他信息">
								<el-input v-model="addParams.other_information" />
							</el-form-item>
							<el-form-item label="收录时间">
								<el-input v-model="addParams.collection_time" />
							</el-form-item> -->
							<!-- <el-form-item label="漏洞扫描类型">
								<el-input v-model="addParams.collection_time" />
							</el-form-item>
							<el-form-item label="数据来源">
								<el-input v-model="addParams.data_source" />
							</el-form-item>
							<el-form-item label="获取方式">
								<el-input v-model="addParams.acquisition_mode" />
							</el-form-item> -->
							<el-form-item label="厂商和版本">
								<el-select v-model="addParams.vendor" placeholder="-">
									<el-option v-for="item in vendorDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>

							<!-- <el-form-item label="受影响产品">
								<el-input v-model="addParams.affected_product" />
							</el-form-item>
							<el-form-item label="CVEID">
								<el-input v-model="addParams.cveld" />
							</el-form-item> -->
						</el-form>
					</dd>
				</dl>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>受影响资产信息</span>
					</dt>
					<dd class="dl-content">
						<el-form :model="addParams" label-width="auto" style="max-width: 600px">
							<el-form-item label="IP" required>
								<el-input v-model="addParams.ip" />
							</el-form-item>
							<el-form-item label="端口">
								<el-input v-model="addParams.port" />
							</el-form-item>
							<!-- <el-form-item label="站点">
								<el-input v-model="addParams.site" />
							</el-form-item>
							<el-form-item label="url">
								<el-input v-model="addParams.url" />
							</el-form-item>
							<el-form-item label="系统名称">
								<el-input v-model="addParams.level" />
							</el-form-item>
							<el-form-item label="资产类型">
								<el-select v-model="addParams.resource_type_id" placeholder="-">
									<el-option v-for="item in resourcetypeDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>
							<el-form-item label="资产大类">
								<el-select v-model="addParams.class_name_id" placeholder="-">
									<el-option v-for="item in classNameDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>
							<el-form-item label="管理员处室">
								<el-input v-model="addParams.utilization_way" />
							</el-form-item>
							<el-form-item label="所属公司（应用）">
								<el-input v-model="addParams.company" />
							</el-form-item>
							<el-form-item label="数据中心">
								<el-input v-model="addParams.data_center" />
							</el-form-item>
							<el-form-item label="应用管理员">
								<el-select v-model="addParams.app_admin_id" placeholder="-">
									<el-option v-for="item in admintableDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>
							<el-form-item label="安全接口人">
								<el-select v-model="addParams.safe_person_id" placeholder="-">
									<el-option v-for="item in admintableDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>
							<el-form-item label="处置负责人">
								<el-input v-model="addParams.reviewer" />
							</el-form-item>

							<el-form-item label="处置人处室">
								<el-input v-model="addParams.data_source" />
							</el-form-item>
							<el-form-item label="部署区域">
								<el-input v-model="addParams.network_area" />
							</el-form-item> -->
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>

	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import importExcel from '@/components/importExcel/index.vue';
import { downloadFile } from '@/utils/service';
import { useRouter } from 'vue-router';
const router = useRouter();
import apis from './api';
import { tr } from 'element-plus/es/locale';
let resourceDiaTF = ref(false);
let isShow = ref(false);
let assess_status = ref("")
let params: any = ref({
	page: 1,
	limit: 30,
	data_source: '',
	biz_display: '',
	company: '',
	type: '主机漏洞',
	assess_status: '',
	network_area: '',
	data_center: '',
	name: '',
	affected_product: '',
	level: '',
	description: '',
	utilization_way: '',
	vendor: '',
	is_false_alarm: 1,
});

const hidden = true;
const columns = [
	{
		title: '归属系统',
		dataIndex: 'biz_display',
	},
	{
		title: '系统所属单位',
		dataIndex: 'company',
	},
	{
		title: '受影响主机',
		dataIndex: 'ip',
	},
	{
		title: '端口',
		dataIndex: 'port',
	},
	{
		title: '漏洞名称',
		dataIndex: 'name',
	},
	{
		title: '漏洞描述',
		dataIndex: 'description',
		hidden,
	},
	{
		title: '漏洞类型',
		dataIndex: 'type',
		hidden,
	},

	{
		title: '漏洞等级',
		dataIndex: 'level',
	},
	{
		title: '严重程度',
		dataIndex: 'severity',
	},
	{
		title: 'CVEID',
		dataIndex: 'cveld',
	},

	{
		title: '修复建议',
		dataIndex: 'repair_suggestion',
		hidden,
	},

	{
		title: '发现日期',
		dataIndex: 'discovery_time',
		hidden,
	},

	// {
	// 	title: '漏洞风险级别',
	// 	dataIndex: '9',
	// 	hidden,
	// },

	{
		title: '修复时限',
		dataIndex: 'processing_limit',
		hidden,
	},

	{
		title: '应用负责人',
		dataIndex: 'app_admin_display',
		hidden,
	},

	// {
	// 	title: '漏洞整改负责人',
	// 	dataIndex: '13',
	// 	hidden,
	// },

	// {
	// 	title: '整改负责人归属单位',
	// 	dataIndex: 'data_center',
	// },
	{
		title: '最近扫描时间',
		dataIndex: '16',
		hidden,
	},
	{
		title: '漏洞状态',
		dataIndex: 'assess_status',
	},
	// {
	// 	title: '是否超时',
	// 	dataIndex: '18',
	// 	hidden,
	// },
	// {
	// 	title: '扫描实施人员',
	// 	dataIndex: '19',
	// 	hidden,
	// },
	{
		title: '数据中心',
		dataIndex: 'data_center',
		hidden,
	},

	{
		title: '操作',
		dataIndex: 'operate',
		width: 100,
		fixed: 'right',
	},
];
let list = ref([]);
let total = ref(0);
const fetchTableData = async () => {
	let res = await apis.getLoopholeLedgerApi(params.value);
	list.value = res.data;
	total.value = res.total;
};
fetchTableData();

let addDrawer = ref(false);
let addParams: any = ref({
	url: '', // #url
	ip: '',
	// biz_id: '', // #业务系统id
	class_name_id: '', //#设备类型id
	resource_type_id: '', // #资源类型id
	app_admin_id: '', // #应用管理员id
	safe_person_id: '', // #安全接口人id
	name: '', //#漏洞名称
	type: '', //  #漏洞类型
	small_type: '', //  #漏洞子类型
	level: '-', //  #等级
	affected_product: '', //  #受影响的产品
	// cveld: '',
	severity: '-', // #严重性
	description: '', //  #漏洞描述
	utilization_way: '-', //  #利用途径
	processing_limit: '-', // #处理时限
	// discovery_time: '', // #首次发现时间
	repair_suggestion: '', //#修复建议
	other_information: '-', //  #其他信息
	// update_time: null, // #更新时间
	data_source: '', //  #数据来源
	acquisition_mode: '', //  #获取方式
	vendor: '', //#厂商(手动录入：01，
	//	 绿盟：02，启明：03，长亭：														04)
	// assess_status: '-', //  #处置状态

	port: null,
	site: '', // #站点
	company: '', //#所属公司
	data_center: '', //  #数据中心
	reviewer: '-', //   #审核人
	network_area: '', //  #部署区域
});
let vendorDict: any = ref([
	{
		id: '01',
		name: '绿盟',
	},
	{
		id: '02',
		name: '启明',
	},
	{
		id: '03',
		name: '长亭',
	},
]);

// 安全人和应用管理员下拉框
let admintableDict = ref();
const getAdmintableDict = async () => {
	let res = await apis.getAdmintableDictApi();
	admintableDict.value = res.data;
};
getAdmintableDict();

// 资源类型下拉框
let resourcetypeDict = ref();
const getResourcetypeDict = async () => {
	let res = await apis.getResourcetypeDictApi();
	resourcetypeDict.value = res.data;
};
getResourcetypeDict();

// 资产大类下拉框
let classNameDict = ref();
const getClassNameDict = async () => {
	let res = await apis.getClassNameDictApi();
	classNameDict.value = res.data;
};
getClassNameDict();

// 新增
const addBtn = async () => {
	addParams.value = {
		url: '', // #url
		ip: '',
		// biz_id:'', // #业务系统id
		class_name_id: '-', //#设备类型id
		resource_type_id: '', // #资源类型id
		app_admin_id: '', // #应用管理员id
		safe_person_id: '', // #安全接口人id
		name: '', //#漏洞名称
		type: '', //  #漏洞类型
		small_type: '', //  #漏洞子类型
		level: '-', //  #等级
		affected_product: '-', //  #受影响的产品
		// cveld: '',
		severity: '-', // #严重性
		description: '-', //  #漏洞描述
		utilization_way: '-', //  #利用途径
		processing_limit: '-', // #处理时限
		// discovery_time: '-', // #首次发现时间
		repair_suggestion: '-', //#修复建议
		other_information: '-', //  #其他信息
		// update_time: null, // #更新时间
		data_source: '-', //  #数据来源
		acquisition_mode: '-', //  #获取方式
		vendor: '-', //#厂商(手动录入：01，
		//	 绿盟：02，启明：03，长亭：														04)
		// assess_status: '', //  #处置状态
		port: null,
		site: '', // #站点
		company: '-', //#所属公司
		data_center: '-', //  #数据中心
		reviewer: '-', //   #审核人
		network_area: '-', //  #部署区域
	};
	addDrawer.value = true;
};

// 新增请求按钮
const addSureBtn = async () => {
	let res = await apis.postMisholeApi(addParams.value);
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		fetchTableData();
		addDrawer.value = false;
	}
};

// const tableData = ref([]);
// // 获取漏洞库列表
// const fetchTableData = async () => {
// 	let res = await apis.getLoopholeDetailsApi(params.value);
// 	tableData.value = res.data;
// 	total.value = res.total;
// };
// fetchTableData();

let selectList: any = ref([]);
const handleSelectionChange = (val: any) => {
	selectList.value = [];
	val.map((item: any) => {
		selectList.value.push(item.loophole_id);
	});
};
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
let status = ref('');

const statusBtn = async () => {
	let res = await apis.statusDetail({ id_list: selectList.value, status: status.value });
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		fetchTableData();
	}
};

const removeBtn = async () => {
	let res = await apis.misreportRemoveApi({ id_list: selectList.value });
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		fetchTableData();
	}
};
// 导出
const excelExcel = async () => {
	ElMessageBox.prompt('自定义导出文件名', '提示', {
		confirmButtonText: '确认导出',
		cancelButtonText: '取消',
		inputPlaceholder: '请输入自定义文件名，无输入时使用默认文件名',
	})
		.then(({ value }) => {
			delete params.value.limit;
			delete params.value.page;
			const data = {
				id_list: selectList.value.join(','),
				...params.value,
			};
			if (value) {
				value = value + '.xlsx';
			} else {
				value = undefined;
			}
			downloadFile({
				url: '/api/robot/misreport_export/',
				params: data,
				method: 'get',
				filename: value,
			});
		})
		.catch(() => {});
};

let drawerOpen = ref(false);
let ledgerDetail: any = ref({});
let detailsList: any = ref([]);
let idList: any = ref([]);
const viewRow = async (val: any) => {
	let res1 = await apis.getLoopholeDetailApi(val.id);
	ledgerDetail.value = res1.data;
	let res2 = await apis.getLoopholeDetailsApi({ loo_id: val.loophole_id });
	detailsList.value = res2.data;
	idList.value.push(val.loophole_id);
	drawerOpen.value = true;
};

let drawerMisOpen = ref(false);
let addForm = ref({
	desc: '',
});

const addMisinformationBtn = async () => {
	drawerMisOpen.value = true;
	// let res = await apis.posMisreportApi();
};
// 添加到误报库
const sureAddMis = async () => {
	let res = await apis.posMisreportApi({
		id_list: idList.value,
		desc: addForm.value.desc,
	});
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		drawerMisOpen.value = false;
		drawerOpen.value = false;
		addForm.value.desc = '';
		idList.value = [];
	}
};

const reSearch = () => {
	params.value = {
		page: 1,
		limit: 30,
		data_source: '',
		biz_display: '',
		company: '',
		type: '主机漏洞',
		assess_status: '',
		network_area: '',
		data_center: '',
		name: '',
		affected_product: '',
		level: '',
		description: '',
		utilization_way: '',
		vendor: '',
		is_false_alarm: 1,
	};
	fetchTableData();
};
let isShowMoreSearch = ref(false);
</script>

<style></style>
