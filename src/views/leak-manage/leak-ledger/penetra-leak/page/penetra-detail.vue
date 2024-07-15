<script lang="ts" setup>
import { ref } from 'vue';

import importExcel from '@/components/importExcel/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import apis from '../api';
const router = useRouter();
const route = useRoute();
let startAndendTime = ref([]);
let params: any = ref({
	page: 1,
	limit: 30,
	name: '',
	site: '',
	url: '',
	source: '',
	network_quality: route.query.source,
	severity: route.query.hightLeak,
	disposer: '',
	company: route.query.company,
	disposer_room: '',
	assess_status: route.query.status,

	create_start_time: '', //
	create_end_time: '', //
	scan_person: '', //
	time_out: '', //

});

const hidden = true;
const columns = [
	{
		title: '归属系统',
		dataIndex: 'biz',
	},
	{
		title: '所属公司',
		dataIndex: 'company',
	},

	{
		title: 'url',
		dataIndex: 'url',
	},
	{
		title: '站点',
		dataIndex: 'site',
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
		title: '网络性质',
		dataIndex: 'network_quality',
		hidden,
	},
	{
		title: '严重性',
		dataIndex: 'severity',
	},
	{
		title: '处置人',
		dataIndex: 'disposer',
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



	{
		title: '修复时间',
		dataIndex: 'processing_limit',
		hidden,
	},

	{
		title: '处置人处室',
		dataIndex: 'disposer_room',
		hidden,
	},

	{
		title: '状态',
		dataIndex: 'assess_status',
	},
	{
		title: '是否超时',
		dataIndex: 'time_out',
		hidden,
	},
	{
		title: '扫描实施人员',
		dataIndex: 'scan_person',
		hidden,
	},
	{
		title: '备注',
		dataIndex: 'desc',
		hidden,
	},

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

let drawerMisOpen = ref(false);

let misForm = ref({
	desc: '',
});
// 添加到误报库
const sureAddMis = async () => {
	let res = await apis.posMisreportApi({
		id_list: idList.value,
		desc: misForm.value.desc,
	});
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		drawerMisOpen.value = false;
		drawerOpen.value = false;
		misForm.value.desc = '';
		idList.value = [];
		fetchTableData();
	}
};

// 提交新增
let isAdd = ref(false);
let addDrawer = ref(false);

let addForm: any = ref({
	name: '',
	description: '',
	repair_suggestion: '',
	discovery_time: '',
	biz: '',
	source: '',
	company: '',
	url: '',
	site: '',
	severity: '',
	disposer: '',
	disposer_room: '',
	processing_limit: '',
	scan_time: '',
	network_quality: '',
	assess_status: '',
	time_out: '',
	scan_person: '',
	desc: '',
	
});

const addLedgerBtn = async () => {
	isAdd.value = true;
	addForm.value = {
		name: '',
		description: '',
		repair_suggestion: '',
		discovery_time: '',
		biz: '',
		source: '',
		company: '',
		url: '',
		site: '',
		severity: '',
		disposer: '',
		disposer_room: '',
		processing_limit: '',
		scan_time: '',
		network_quality: '',
		assess_status: '',
		time_out: '',
		scan_person: '',
		desc: '',
	
	};
	addDrawer.value = true;
	// let res = await apis.postLoopholeLedgerApi();
};

const fetchTableData = async () => {
	params.value.create_start_time = startAndendTime.value[0];
	params.value.create_end_time = startAndendTime.value[1];
	let res = await apis.getTableListApi(params.value);
	list.value = res.data;
	total.value = res.total;
};
fetchTableData();

// 资源类型下拉框
let resourcetypeDict = ref();
const getResourcetypeDict = async () => {
	let res = await apis.getResourcetypeDictApi();
	resourcetypeDict.value = res.data;
};
getResourcetypeDict();
// 资源类型下拉框
let classNameDict = ref();
const getClassNameDict = async () => {
	let res = await apis.getClassNameDictApi();
	classNameDict.value = res.data;
};
getClassNameDict();

// 获取数据中心
let areaDict = ref();
const getAreaInfo = async () => {
	let res = await apis.getAreaInfoApi();
	areaDict.value = res.data;
};
getAreaInfo();

let penetrationSourceList = ref();

const getSourceDict = async () => {
	let res = await apis.penetrationSourceDict();
	penetrationSourceList.value = res.data;
};
getSourceDict();

let companyList = ref();

const companyDict = async () => {
	let res = await apis.companyDictApi();
	companyList.value = res.data;
};
companyDict();

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
		site: '',
		url: '',
		source: '',
		severity: '',
		disposer: '',
		company: '',
		disposer_room: '',
		network_quality: '',
		assess_status: '',
		create_start_time: '', //
		create_end_time: '', //
		scan_person: '', //
		time_out: '', //
	
	};
	fetchTableData();
};
let drawerOpen = ref(false);

let ledgerDetail: any = ref({});

const viewRow = async (val: any) => {
	isAdd.value = false;

	let res = await apis.getLoopholeDetailApi(val.id);
	addForm.value = {
		...res.data,
	};

	drawerOpen.value = true;
};

// 新增请求按钮
const addSureBtn = async () => {
	let res = await apis.postLoopholeLedgerApi(addForm.value);
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		fetchTableData();
		addDrawer.value = false;
	}
};

const editSureBtn = async () => {
	let res = await apis.penetraPutIDApi(addForm.value.id, addForm.value);
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		fetchTableData();
		drawerOpen.value = false;
	}
};
let isEdit = ref(false)
const editBtn = ()=>{
	isEdit.value = true
	console.log("isEdit = true",isEdit)
}
let selectList: any = ref([]);
const handleSelectionChange = (val: any) => {
	selectList.value = [];
	val.map((item: any) => {
		selectList.value.push(item.loophole_id);
	});
};

const excelOutExcel = async () => {
	ElMessageBox.prompt('自定义导出文件名', '提示', {
		confirmButtonText: '确认导出',
		cancelButtonText: '取消',
		inputPlaceholder: '请输入自定义文件名，无输入时使用默认文件名',
	})
		.then(({ value }) => {
			const data: any = {
				...params.value,
			};
			delete data.limit;
			delete data.page;
			if (value) {
				value = value + '.xlsx';
			} else {
				value = undefined;
			}
			apis.downloadHostFile(data, value);
		})
		.catch(() => {});
};
const backIndex = () => {
	router.push({ path: '/leak-manage/leak-ledger/penetra-leak' });
};
let isShowMoreSearch = ref(false);
</script>

<template>
	<div>
		<div class="table-container">
			<div class="form-container">
				<div class="form-title">
					<h3>
						<el-page-header @back="backIndex" icon="ArrowLeft">
							<template #content>
								<span>渗透测试详情</span>
							</template>
						</el-page-header>
					</h3>
					<div class="button-box">
						<el-button link type="primary" icon="Plus" @click="addLedgerBtn">新 增</el-button>
						<importExcel api="/api/loophole/penetration_import/" :apiSuffix="false">导入数据</importExcel>
						<el-button link type="primary" @click="excelOutExcel" icon="Download">导出数据</el-button>
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
					<el-form :inline="true" :model="params" label-width="100px" label-suffix="：">
						<el-form-item label="漏洞名称">
							<el-input v-model="params.name" clearable />
						</el-form-item>
						<el-form-item label="url">
							<el-input v-model="params.url" clearable />
						</el-form-item>
						<el-form-item label="站点">
							<el-input v-model="params.site" clearable />
						</el-form-item>
						<el-form-item label="归属系统">
							<el-input v-model="params.biz" clearable />
						</el-form-item>

						<el-form-item label="数据来源">
							<el-select v-model="params.source" clearable>
								<el-option v-for="item in penetrationSourceList" :key="item" :label="item" :value="item" />
							</el-select>
						</el-form-item>
						<el-form-item label="严重性">
							<el-select v-model="params.severity" clearable>
								<el-option label="高危" value="高危" />
								<el-option label="中危" value="中危" />
								<el-option label="低危" value="低危" />
							</el-select>
						</el-form-item>
						<el-form-item label="处置人">
							<el-input v-model="params.disposer" clearable />
						</el-form-item>
						<el-form-item label="所属公司">
							<el-select v-model="params.company" clearable>
								<el-option v-for="item in companyList" :key="item" :label="item" :value="item" />
							</el-select>
						</el-form-item>
						<el-form-item label="处置人处室">
							<el-input v-model="params.disposer_room" clearable />
						</el-form-item>

						<el-form-item label="网络性质">
							<el-select v-model="params.network_quality" clearable>
								<el-option label="互联网" value="互联网" />
								<el-option label="内网" value="内网" />
							</el-select>
						</el-form-item>
						<el-form-item label="处置状态">
							<el-select v-model="params.assess_status" clearable>
								<el-option label="新发现" value="发现" />
								<el-option label="已评估" value="已评估" />
								<el-option label="已通知" value="已通知" />
								<el-option label="已认领" value="已认领" />
								<el-option label="待验证" value="待验证" />
								<el-option label="验证不通过" value="验证不通过" />
								<el-option label="已修复" value="已修复" />
								<el-option label="残余" value="残余" />
								<el-option label="已超时" value="已超期" />
							</el-select>
						</el-form-item>

						<el-form-item label="是否超时">
							<el-select v-model="params.time_out" clearable>
								<el-option label="是" value="是" />
								<el-option label="否" value="否" />
							</el-select>
						</el-form-item>
						<el-form-item label="扫描实施人">
							<el-input v-model="params.scan_person" clearable />
						</el-form-item>
					
						<el-form-item label="时间">
							<el-date-picker
								v-model="startAndendTime"
								type="datetimerange"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								format="YYYY-MM-DD HH:mm:ss"
								date-format="YYYY/MM/DD HH:mm:ss"
								time-format="HH:mm:ss"
								value-format="YYYY-MM-DD HH:mm:ss"
							/>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tree-table-container" style="margin-left: 10px">
				<div class="table-container">
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
		</div>
		<el-drawer v-model="drawerOpen" size="45%" title="详情">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>漏洞信息</span>
						<span>
							<el-button style="margin-left: 20px" size="small" type="primary" @click="editSureBtn">确认提交</el-button>
							<el-button v-show="isEdit" style="margin-left: 20px" size="small" type="danger" @click="isEdit = false">取消</el-button>
							<el-button v-show="!isEdit" style="margin-left: 20px" size="small" type="primary" @click="editBtn">编辑</el-button>
						</span>
					</dt>
					<dd class="dl-content">
						<el-form :model="addForm" label-width="auto" :disabled="!isEdit" style="max-width: 600px">
							<el-form-item label="归属系统">
								<el-input v-model="addForm.biz" />
							</el-form-item>
							<el-form-item label="漏洞名称">
								<el-input v-model="addForm.name" />
							</el-form-item>
							<el-form-item label="漏洞描述">
								<el-input v-model="addForm.description" />
							</el-form-item>
							<el-form-item label="修复建议">
								<el-input v-model="addForm.repair_suggestion" />
							</el-form-item>
							<el-form-item label="数据来源">
								<el-select v-model="addForm.source" clearable>
									<el-option v-for="item in penetrationSourceList" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="所属公司">
								<el-select v-model="addForm.company" clearable>
									<el-option v-for="item in companyList" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>

							<el-form-item label="url">
								<el-input v-model="addForm.url" />
							</el-form-item>
							<el-form-item label="站点">
								<el-input v-model="addForm.site" />
							</el-form-item>

							<el-form-item label="严重性">
								<el-select v-model="addForm.severity" clearable>
									<el-option label="高危" value="高危" />
									<el-option label="中危" value="中危" />
									<el-option label="低危" value="低危" />
								</el-select>
							</el-form-item>
							<el-form-item label="处置人">
								<el-input v-model="addForm.disposer" />
							</el-form-item>
							<el-form-item label="处置人处室">
								<el-input v-model="addForm.disposer_room" />
							</el-form-item>

						
							<el-form-item label="网络性质">
								<el-select v-model="addForm.network_quality" clearable>
									<el-option label="互联网" value="互联网" />
									<el-option label="内网" value="内网" />
								</el-select>
							</el-form-item>
							<el-form-item label="处置状态">
								<el-select v-model="addForm.assess_status">
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
							<el-form-item label="是否超时">
								<el-input v-model="addForm.time_out" />
							</el-form-item>
							<el-form-item label="扫描实施人员">
								<el-input v-model="addForm.scan_person" />
							</el-form-item>
							<el-form-item label="备注">
								<el-input v-model="addForm.desc" />
							</el-form-item>

							<el-form-item label="修复时间">
								<el-date-picker
									v-model="addForm.processing_limit"
									type="datetime"
									format="YYYY-MM-DD HH:mm:ss"
									date-format="YYYY/MM/DD HH:mm:ss"
									time-format="HH:mm:ss"
									value-format="YYYY-MM-DD HH:mm:ss"
								/>
							</el-form-item>
							<el-form-item label="发现时间">
								<el-date-picker
									v-model="addForm.discovery_time"
									type="datetime"
									format="YYYY-MM-DD HH:mm:ss"
									date-format="YYYY/MM/DD HH:mm:ss"
									time-format="HH:mm:ss"
									value-format="YYYY-MM-DD HH:mm:ss"
								/>
							</el-form-item>
					
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>
		<el-drawer v-model="addDrawer" size="60%" title="新增">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>漏洞信息</span>
						<el-button style="margin-left: 20px" type="primary" @click="addSureBtn">确认提交</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="addForm" label-width="auto" style="max-width: 600px">
							<el-form-item label="归属系统">
								<el-input v-model="addForm.biz" />
							</el-form-item>
							<el-form-item label="漏洞名称">
								<el-input v-model="addForm.name" />
							</el-form-item>
							<el-form-item label="漏洞描述">
								<el-input v-model="addForm.description" />
							</el-form-item>
							<el-form-item label="修复建议">
								<el-input v-model="addForm.repair_suggestion" />
							</el-form-item>
							<el-form-item label="数据来源">
								<el-select v-model="addForm.source" clearable>
									<el-option v-for="item in penetrationSourceList" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
							<el-form-item label="所属公司">
								<el-select v-model="addForm.company" clearable>
									<el-option v-for="item in companyList" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>

							<el-form-item label="url">
								<el-input v-model="addForm.url" />
							</el-form-item>
							<el-form-item label="站点">
								<el-input v-model="addForm.site" />
							</el-form-item>

							<el-form-item label="严重性">
								<el-select v-model="addForm.severity" clearable>
									<el-option label="高危" value="高危" />
									<el-option label="中危" value="中危" />
									<el-option label="低危" value="低危" />
								</el-select>
							</el-form-item>
							<el-form-item label="处置人">
								<el-input v-model="addForm.disposer" />
							</el-form-item>
							<el-form-item label="处置人处室">
								<el-input v-model="addForm.disposer_room" />
							</el-form-item>

						
							<el-form-item label="网络性质">
								<el-select v-model="addForm.network_quality" clearable>
									<el-option label="互联网" value="互联网" />
									<el-option label="内网" value="内网" />
								</el-select>
							</el-form-item>
							<el-form-item label="处置状态">
								<el-select v-model="addForm.assess_status">
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
							<el-form-item label="是否超时">
								<el-select v-model="addForm.time_out" clearable>
									<el-option label="是" value="是" />
									<el-option label="否" value="否" />
								</el-select>
							</el-form-item>
							<el-form-item label="扫描实施人员">
								<el-input v-model="addForm.scan_person" />
							</el-form-item>
							<el-form-item label="备注">
								<el-input v-model="addForm.desc" />
							</el-form-item>

					
							<el-form-item label="发现时间">
								<el-date-picker
									v-model="addForm.discovery_time"
									type="datetime"
									format="YYYY-MM-DD HH:mm:ss"
									date-format="YYYY/MM/DD HH:mm:ss"
									time-format="HH:mm:ss"
									value-format="YYYY-MM-DD HH:mm:ss"
								/>
							</el-form-item>
							<el-form-item label="修复时间">
								<el-date-picker
									v-model="addForm.processing_limit"
									type="datetime"
									format="YYYY-MM-DD HH:mm:ss"
									date-format="YYYY/MM/DD HH:mm:ss"
									time-format="HH:mm:ss"
									value-format="YYYY-MM-DD HH:mm:ss"
								/>
							</el-form-item>
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>

		<el-drawer v-model="drawerMisOpen" size="60%" :title="ledgerDetail.name">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>误报描述</span>
						<el-button style="margin-left: 20px" size="small" type="primary" @click="sureAddMis">确认提交</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="misForm" label-width="auto" style="max-width: 600px">
							<el-form-item label="误报描述">
								<el-input type="textarea" v-model="misForm.desc" />
							</el-form-item>
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>
	</div>
</template>

<style scoped lang="scss">
@import '@/theme/mixins/formReset.scss';
</style>
