<template>
  <div>
    <div class="table-container">
      <el-row :gutter="15"
              style="margin: 5px"
              class="home-card-one mb15">
        <el-col :xs="24"
                :sm="12"
                :md="12"
                :lg="v.width"
                :xl="v.width"
                v-for="(v, k) in state.homeOne"
                :key="k"
                :class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }">
          <div class="home-card-item flex">
            <div class="flex w100"
                 :class="` home-one-animation${k}`">
              <div class="home-card-item-icon flex"
                   :style="{ background: `var(${v.color2})` }">
                <i class="flex-margin font32"
                   :class="v.num4"
                   :style="{ color: `var(${v.color3})` }"></i>
              </div>
              <div style="margin-left: 10px">
                <div class="mt10">{{ v.num3 }}</div>
                <span class="font30">{{ v.num1 }}</span>
                <div style="margin-left: 10px"
                     class="ml5 font16"
                     v-if="v.name !== 1">
                  <span style="margin-right: 5px; font-size: 13px; color: gray">启动中</span>{{ v.carryingNum }}
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="form-container">
        <div class="form-title">
          <h3>扫描任务wrj</h3>
          <div class="button-box">
            <el-button type="primary"
                       link
                       @click="
								centerDialogVisible = true;
								changeAdd = 1;
							"
                       icon="CirclePlus">新建任务</el-button>
            <el-button type="primary"
                       @click="GetList"
                       icon="Search">搜 索</el-button>
            <el-button @click="resetFn"
                       plain
                       icon="RefreshRight">重 置</el-button>
          </div>
        </div>
        <!-- 筛选条件 -->
        <div class="form-params"
             :style="isShow ? 'height:100%' : 'height:60px'">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="关键字">
              <el-input v-model="params.id_or_name"
                        clearable
                        style="width: 240px" />
            </el-form-item>
            <el-form-item label="任务类型wrj">
							<el-select v-model="params.scan_type" placeholder="请选择" style="width: 240px">
								<el-option label="资产扫描" :value="1" />
								<el-option label="漏洞扫描" :value="2" />
								<el-option label="WEB扫描" :value="3" />
							</el-select>
						</el-form-item>
            <el-form-item label="运行状态">
              <el-select v-model="params.status"
                         placeholder="请选择"
                         style="width: 240px">
                <el-option label="关闭"
                           :value="0" />
                <el-option label="开启"
                           :value="1" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <!-- table -->
      </div>
      <!-- <div class="custom-style">
				<el-segmented v-model="params.scan_type" :options="options" />
			</div> -->
      <div class="page-in">
        <el-radio-group v-model="params.scan_type"
                        @change="GetList">
          <el-radio-button label="漏洞扫描"
                           value="2" />
          <el-radio-button label="资产扫描"
                           value="1" />
          <el-radio-button label="web扫描"
                           value="3" />
        </el-radio-group>
      </div>

      <div class="table-box">
        <table-unit :currentPage="params.page"
                    :columns="params.scan_type == 3 ? columns1 : columns"
                    :list="list"
                    :total="total1"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    @getList="GetList"
                    @changeFun="watchInfo">
          <template v-slot="record">
            <el-button size="small"
                       link
                       type="primary"
                       @click="reportFn(record.record, params.scan_type)">报告</el-button>
            <el-button size="small"
                       link
                       type="primary"
                       @click="
								editFn(record.record);
								changeAdd = 2;
							">编辑</el-button>
          </template>
        </table-unit>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog @close="closed"
               v-model="centerDialogVisible"
               title="新建/编辑扫描任务"
               style="padding: 20px"
               width="800"
               height="1000"
               center>
      <el-steps class="mb-4"
                style="max-width: 100%"
                :space="200"
                :active="active"
                simple>
        <el-step title="① 创建任务" />
        <el-step title="② 选择资产" />
      </el-steps>
      <div v-if="active == 1">
        <el-row>
          <el-col style="width: 50%; height: 100%; padding: 20px"
                  :span="12">
            <el-form label-position="top"
                     label-width="auto"
                     :model="formLabelAlign"
                     style="max-width: 600px">
              <el-form-item label="任务名称">
                <el-input v-model="formLabelAlign.name" />
              </el-form-item>
              <el-form-item label="扫描工具">
                <el-select v-model="formLabelAlign.scanner"
                           collapse-tags
                           placeholder="请选择">
                  <el-option v-for="item in scanToolList"
                             :key="item.id"
                             :label="item.scan_name"
                             :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="扫描类型">
                <el-radio-group v-model="formLabelAlign.scan_type"
                                @change="scanTypeChange">
                  <el-radio :value="2">漏洞扫描</el-radio>
                  <el-radio :value="1">资产扫描</el-radio>
                  <el-radio :value="3">web扫描</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="预计时长（分钟）">
                <el-input v-model="formLabelAlign.predict_duration" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col style="width: 50%; height: 100%; padding: 20px"
                  :span="12">
            <el-form label-position="top"
                     label-width="auto"
                     :model="formLabelAlign"
                     style="max-width: 600px">
              <el-form-item label="执行频率">
                <el-radio-group v-model="formLabelAlign.is_cris_repeataw">
                  <el-radio :value="false">单次执行</el-radio>
                  <el-radio :value="true">重复执行</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 单次执行 -->
              <el-form-item label=""
                            v-if="!formLabelAlign.is_cris_repeataw">
                <el-radio-group v-model="formLabelAlign.is_now_exec">
                  <el-radio :value="true">立即执行</el-radio>
                  <el-radio :value="false">定时执行</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="日期"
                            v-if="formLabelAlign.is_cris_repeataw || !formLabelAlign.is_now_exec">
                <el-date-picker style="width: 100%"
                                v-model="formLabelAlign.plan_time_start"
                                type="datetime"
                                :disabled-date="disabledDate"
                                placeholder="请选择"
                                value-format="YYYY-MM-DD" />
              </el-form-item>
              <el-form-item v-if="formLabelAlign.is_cris_repeataw"
                            label="执行周期">
                <el-date-picker v-model="startAndendTime"
                                type="datetimerange"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                format="YYYY-MM-DD"
                                date-format="YYYY/MM/DD ddd"
                                time-format="HH:mm:ss"
                                value-format="YYYY-MM-DD" />
              </el-form-item>
              <el-form-item label="任务类型"
                            v-if="formLabelAlign.is_cris_repeataw">
                <el-radio-group v-model="formLabelAlign.task_type">
                  <el-radio :value="1">每天</el-radio>
                  <el-radio :value="2">每周</el-radio>
                  <el-radio :value="3">每月</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="日期"
                            v-if="(formLabelAlign.task_type == 2 || formLabelAlign.task_type == 3) && !formLabelAlign.is_now_exec">
                <el-select v-if="formLabelAlign.task_type == 2"
                           v-model="formLabelAlign.execute_date"
                           placeholder="请选择">
                  <el-option label="周一"
                             :value="1" />
                  <el-option label="周二"
                             :value="2" />
                  <el-option label="周三"
                             :value="3" />
                  <el-option label="周四"
                             :value="4" />
                  <el-option label="周五"
                             :value="5" />
                  <el-option label="周六"
                             :value="6" />
                  <el-option label="周七"
                             :value="7" />
                </el-select>
                <el-select v-if="formLabelAlign.task_type == 3"
                           v-model="formLabelAlign.execute_date"
                           placeholder="请选择">
                  <el-option v-for="item in dayNum"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="formLabelAlign.is_cris_repeataw || !formLabelAlign.is_now_exec"
                            label="时间">
                <el-time-picker style="width: 100%"
                                value-format="HH:mm:ss"
                                v-model="formLabelAlign.execute_time"
                                placeholder="请选择"
                                :disabled-hours="disabledHours"
                                :disabled-minutes="disabledMinutes" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-form label-position="top"
                   label-width="auto"
                   :model="formLabelAlign"
                   style="width: 100%; padding: 20px">
            <el-form-item label="任务扫描">
              <el-input v-model="formLabelAlign.description"
                        style="height: 10vh"
                        type="textarea" />
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <div v-else>
        <el-form label-position="top"
                 label-width="auto"
                 :model="formLabelAlign"
                 style="max-width: 600px; padding: 20px">
          <el-form-item label="扫描类型">
            <el-radio-group v-model="formLabelAlign.asset_mode"
                            @change="radioGroupFn">
              <!-- <el-radio value="ass">资产列表</el-radio> -->
              <el-radio :value="2"
                        :disabled="formLabelAlign.scan_type == 3 ? true : false">网段列表</el-radio>
              <el-radio :value="3"
                        :disabled="formLabelAlign.scan_type == 3 ? true : false">区域</el-radio>
              <el-radio :value="1">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <!-- <div v-if="formLabelAlign.asset_mode == 1">
					<div class="button-box" style="display: flex; justify-content: end; margin-bottom: 10px">
						<el-button type="danger" @click="searchFn">批量删除</el-button>
						<el-button type="primary" @click="addAssFn">新增资产</el-button>
					</div>
					<table-unit
						:columns="columns1"
						:currentPage="params.page"
						:list="list"
						:total="total1"
						@handleSizeChange="handleSizeChange"
						@handleCurrentChange="handleCurrentChange"
					>
						<template v-slot="record">
							<el-button size="small" link @click="editRow(record.record)">详情</el-button>
						</template>
					</table-unit>
				</div> -->
        <div v-if="formLabelAlign.asset_mode == 2 || formLabelAlign.asset_mode == 3"
             style="padding: 20px">
          <el-form label-position="top"
                   label-width="auto"
                   :model="formLabelAlign"
                   style="width: 100%:padding:20px">
            <el-form-item label="网段/区域"
                          style="">
              <el-transfer @mouseover="addHover"
                           v-model="formLabelAlign.urls"
                           :data="networkAllList"
                           style="margin: auto"
                           v-if="formLabelAlign.asset_mode == 2" />
              <el-transfer @mouseover="addHover"
                           v-model="formLabelAlign.asset_area"
                           :data="networkAllList"
                           style="margin: auto"
                           v-if="formLabelAlign.asset_mode == 3" />
            </el-form-item>
          </el-form>
        </div>
        <div v-if="formLabelAlign.asset_mode == 1 || formLabelAlign.scan_type == 3">
          <el-form label-position="top"
                   label-width="auto"
                   :model="formLabelAlign"
                   style="width: 100%">
            <el-form-item label=""
                          style="">
              <el-input class="input_textarea"
                        v-model="formLabelAlign.site"
                        type="textarea"
                        style="height: 100px" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="
							centerDialogVisible = false;
							active = 1;
						"
                     v-if="active == 1">取消</el-button>
          <el-button type=""
                     v-if="active == 2"
                     @click="active = 1"> 上一步 </el-button>
          <el-button type="primary"
                     @click="next"
                     v-if="active == 1"> 下一步 </el-button>
          <el-button type="primary"
                     @click="yesok"
                     v-if="active == 2"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage, ElMessageBox, ElTree } from 'element-plus';
import { useRouter } from 'vue-router';

import { regionqy, Tree, dayNum, AllList, TreeList, data3, defaultProps, departmentOption, appList, regionOption } from './type';
import * as api from './api';
const options = ['Delicacy', 'Desserts&Drinks', 'Fresh foods', 'Supermarket'];
const router = useRouter();
// import * as api from './api';
const changeAdd = ref(1);
let asset_total1 = ref(0);
let total1 = ref(0);
let asset_run_total1 = ref(0);
let vuln_run_total1 = ref(0);
let vuln_total1 = ref(0);
let web_run_total1 = ref(0);
let web_total1 = ref(0);
const formLabelAlign = ref({
	name: '',
	scanner: '',
	is_now_exec: false,
	scan_type: 2,
	predict_duration: '',
	is_cris_repeataw: true,
	plan_time_start: '',
	plan_time_end: '',
	asset_area: [],
	task_type: 1,
	urls: [],
	asset_mode: 2,
	execute_date: '',
	execute_time: '',
	description: '',
	update_status: false,
	site: '',
});
let isShow = ref(false);
let centerDialogVisible = ref(false);
let dialogVisible = ref(false);
let ipOrApp = ref('one');
const TreeListLeft = ref();
const treeRef = ref<InstanceType<typeof ElTree>>();
let filterText = ref('');
const active = ref(1);
let scanToolList = ref();
let params = ref({
	id_or_name: '',
	task_type: '',
	scan_idc: '',
	status: '',
	scan_type: 2,
	page: 1,
	limit: 30,
});
let columns = [
	{
		title: '任务名称',
		dataIndex: 'name',
	},

	{
		title: '执行频率',
		dataIndex: 'is_cris_repeataw_name',
	},
	{
		title: '资产扫描范围',
		dataIndex: 'urls',
	},
	{
		title: '创建人',
		dataIndex: 'creator_name',
	},
	{
		title: '创建时间',
		dataIndex: 'create_datetime',
	},
	{
		title: '运行状态（是否开启）',
		dataIndex: 'statusT',
		isTagClick: true,
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];
let columns1 = [
	{
		title: '任务名称',
		dataIndex: 'name',
	},

	{
		title: '执行频率',
		dataIndex: 'is_cris_repeataw_name',
	},
	{
		title: '扫描网站',
		dataIndex: 'site',
	},
	{
		title: '创建人',
		dataIndex: 'creator_name',
	},
	{
		title: '创建时间',
		dataIndex: 'create_datetime',
	},
	{
		title: '运行状态（是否开启）',
		dataIndex: 'statusT',
		isTagClick: true,
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];
const state = ref({
	homeOne: [
		{
			num1: total1.value,
			num2: asset_run_total1.value,
			num3: '任务总数',
			num4: 'fa fa-meetup',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			width: 6,
			name: 1,
		},
		{
			num1: asset_total1.value,
			num3: '资产扫描任务',
			num4: 'iconfont icon-zaosheng',
			color1: '#6690F9',
			color2: '--next-color-warning-lighter',
			color3: '--el-color-warning',
			width: 6,
			carryingNum: asset_run_total1.value,
		},
		{
			num1: vuln_total1.value,
			num3: '漏洞扫描任务',
			num4: 'iconfont icon-zaosheng',
			color1: '#6690F9',
			color2: '--next-color-warning-lighter',
			color3: '--el-color-warning',
			width: 6,
			carryingNum: vuln_run_total1.value,
		},
		{
			num1: web_total1.value,
			num3: 'web扫描任务',
			num4: 'iconfont icon-zaosheng',
			color1: '#6690F9',
			color2: '--next-color-warning-lighter',
			color3: '--el-color-warning',
			width: 6,
			carryingNum: web_run_total1.value,
		},
	],
	homeThree: [
		{
			icon: 'iconfont icon-yangan',
			label: '浅粉红',
			value: '2.1%OBS/M',
			iconColor: '#F72B3F',
		},
		{
			icon: 'iconfont icon-wendu',
			label: '深红(猩红)',
			value: '30℃',
			iconColor: '#91BFF8',
		},
		{
			icon: 'iconfont icon-shidu',
			label: '淡紫红',
			value: '57%RH',
			iconColor: '#88D565',
		},
		{
			icon: 'iconfont icon-shidu',
			label: '弱紫罗兰红',
			value: '107w',
			iconColor: '#88D565',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '中紫罗兰红',
			value: '57DB',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '紫罗兰',
			value: '57PV',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '暗紫罗兰',
			value: '517Cpd',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '幽灵白',
			value: '12kg',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '海军蓝',
			value: '64fm',
			iconColor: '#FBD4A0',
		},
	],
	myCharts: [],
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
});
let list = ref();
let startAndendTime = ref([]);
let radioGroupStr = ref('ass');
let networkAllList = ref([]);
watch(filterText, (val) => {
	treeRef.value!.filter(val);
});
const disabledDate = (time) => {
	return time.getTime() < Date.now() - 8.64e7;
};
const makeRange = (start: number, end: number) => {
	const result: number[] = [];
	for (let i = start; i <= end; i++) {
		result.push(i);
	}
	return result;
};

const disabledHours = () => {
	const today = new Date();
	const hours = today.getHours();
	return makeRange(0, hours - 1);
};
const disabledMinutes = () => {
	const today = new Date();
	const minutes = today.getMinutes();
	return makeRange(0, minutes + 9);
};
// 切换
const watchInfo = async (val?: any) => {
	if (val.status == 0) {
		val.status = 1;
		val.update_status = true;
		let { data } = await api.UpdateObj(val);
		GetList();
	} else {
		val.status = 0;
		val.update_status = true;
		let { data } = await api.UpdateObj(val);
		GetList();
	}
};
// 获取左树列表
const treeGetList = async () => {
	networkAllList.value = [];
	let { data } = await api.treeGetList();
	data.forEach((item) => {
		let obj = {
			key: item,
			label: item,
		};
		networkAllList.value.push(obj);
	});
};
// 编辑详情
const editFn = async (id: any) => {
	centerDialogVisible.value = true;
	let { data } = await api.GetObj(id.id);
	formLabelAlign.value = data;
	formLabelAlign.value.urls = data.urls?.split(',');
	formLabelAlign.value.asset_area = data.asset_area?.split(',');
	startAndendTime.value = [data.plan_time_start, data.plan_time_end];
};
// 新增确认
const yesok = async () => {
	if (changeAdd.value == 1) {
		if (!formLabelAlign.value.is_cris_repeataw) {
			if (formLabelAlign.value.asset_mode == 2) {
				formLabelAlign.value.asset_area = [];
			} else {
				formLabelAlign.value.urls = [];
			}
			let { code } = await api.AddObj(formLabelAlign.value);
			if (code == 2000) {
				ElMessage.success('添加成功');
				centerDialogVisible.value = false;
				GetList();
			}
		} else {
			formLabelAlign.value.plan_time_start = startAndendTime.value[0];
			formLabelAlign.value.plan_time_end = startAndendTime.value[1];
			let { code } = await api.AddObj(formLabelAlign.value);
			if (code == 2000) {
				ElMessage.success('添加成功');
				centerDialogVisible.value = false;
				GetList();
			}
		}
	} else {
		if (!formLabelAlign.value.is_cris_repeataw) {
			let { code } = await api.UpdateObj(formLabelAlign.value);
			if (code == 2000) {
				ElMessage.success('添加成功');
				centerDialogVisible.value = false;
				GetList();
			}
		} else {
			formLabelAlign.value.plan_time_start = startAndendTime.value[0];
			formLabelAlign.value.plan_time_end = startAndendTime.value[1];
			let { code } = await api.UpdateObj(formLabelAlign.value);
			if (code == 2000) {
				ElMessage.success('添加成功');
				centerDialogVisible.value = false;
				GetList();
			}
		}
	}
};
// 获取网段列表
const networkGetList = async () => {
	networkAllList.value = [];
	let { data } = await api.networkGetList();

	data.forEach((item) => {
		let obj = {
			key: item.name,
			label: item.name,
		};
		networkAllList.value.push(obj);
	});
};
// const IPAndAppChange = (val?: any) => {
// 	if (val == 'one' || ipOrApp.value == 'one') {
// 		TreeListLeft.value = treeListLeftALL;
// 		TreeListLeft.value.map((item) => {
// 			if (item.children.length > 0) {
// 				item.children.map((item1) => {
// 					item1.children = [];
// 				});
// 			}
// 		});
// 	} else {
// 		TreeListLeft.value = treeListLeftALLNO;
// 	}
// };

interface Option {
	key: number;
	label: string;
	disabled: boolean;
}
// 获取列表
const GetList = async () => {
	let { total, data, scanner, asset_total, asset_run_total, vuln_run_total, vuln_total, web_run_total, web_total } = await api.GetList(params.value);
	asset_total1.value = asset_total;
	asset_run_total1.value = asset_run_total;
	vuln_run_total1.value = vuln_run_total;
	vuln_total1.value = vuln_total;
	web_run_total1.value = web_run_total;
	web_total1.value = web_total;
	total1.value = total;
	state.value = {
		homeOne: [
			{
				num1: total1.value,
				num2: 0,
				num3: '任务总数',
				num4: 'fa fa-meetup',
				color1: '#FF6462',
				color2: '--next-color-primary-lighter',
				color3: '--el-color-primary',
				width: 6,
				name: 1,
			},
			{
				num1: asset_total1.value,
				num3: '资产扫描任务',
				num4: 'iconfont icon-zaosheng',
				color1: '#6690F9',
				color2: '--next-color-warning-lighter',
				color3: '--el-color-warning',
				width: 6,
				carryingNum: asset_run_total1.value,
			},
			{
				num1: vuln_total1.value,
				num3: '漏洞扫描任务',
				num4: 'iconfont icon-zaosheng',
				color1: '#6690F9',
				color2: '--next-color-warning-lighter',
				color3: '--el-color-warning',
				width: 6,
				carryingNum: vuln_run_total1.value,
			},
			{
				num1: web_total1.value,
				num3: 'web扫描任务',
				num4: 'iconfont icon-zaosheng',
				color1: '#6690F9',
				color2: '--next-color-warning-lighter',
				color3: '--el-color-warning',
				width: 6,
				carryingNum: web_run_total1.value,
			},
		],
		homeThree: [
			{
				icon: 'iconfont icon-yangan',
				label: '浅粉红',
				value: '2.1%OBS/M',
				iconColor: '#F72B3F',
			},
			{
				icon: 'iconfont icon-wendu',
				label: '深红(猩红)',
				value: '30℃',
				iconColor: '#91BFF8',
			},
			{
				icon: 'iconfont icon-shidu',
				label: '淡紫红',
				value: '57%RH',
				iconColor: '#88D565',
			},
			{
				icon: 'iconfont icon-shidu',
				label: '弱紫罗兰红',
				value: '107w',
				iconColor: '#88D565',
			},
			{
				icon: 'iconfont icon-zaosheng',
				label: '中紫罗兰红',
				value: '57DB',
				iconColor: '#FBD4A0',
			},
			{
				icon: 'iconfont icon-zaosheng',
				label: '紫罗兰',
				value: '57PV',
				iconColor: '#FBD4A0',
			},
			{
				icon: 'iconfont icon-zaosheng',
				label: '暗紫罗兰',
				value: '517Cpd',
				iconColor: '#FBD4A0',
			},
			{
				icon: 'iconfont icon-zaosheng',
				label: '幽灵白',
				value: '12kg',
				iconColor: '#FBD4A0',
			},
			{
				icon: 'iconfont icon-zaosheng',
				label: '海军蓝',
				value: '64fm',
				iconColor: '#FBD4A0',
			},
		],
		myCharts: [],
		charts: {
			theme: '',
			bgColor: '',
			color: '#303133',
		},
	};

	// is_cris_repeataw

	scanToolList.value = scanner;
	list.value = data;
	list.value.forEach((item) => {
		if (item.status == 0) {
			item.statusNew = false;

			item.statusT = { code: 3, value: '已关闭' };
		} else {
			item.statusNew = true;
			item.statusT = { code: 1, value: '启动中' };
		}
	});
};

GetList();
const generateData = () => {
	const data: Option[] = [];
	for (let i = 1; i <= 15; i++) {
		data.push({
			key: i,
			label: `Option ${i}`,
			disabled: i % 4 === 0,
		});
	}
	return data;
};

const data = ref<Option[]>(generateData());

// IPAndAppChange();
const next = () => {
	active.value = 2;
	if (formLabelAlign.value.asset_mode == 2) {
		networkGetList();
	} else {
		treeGetList();
	}
	// formLabelAlign.value.urls = [];
};
const scanTypeChange = (val: any) => {
	if (val == 3) {
		formLabelAlign.value.asset_mode = 1;
	}
};
const radioGroupFn = (val: any) => {
	radioGroupStr.value = val;
	if (val == 2) {
		networkGetList();
	} else if (val == 3) {
		treeGetList();
	}
};
const searchFn = () => {
	console.log('searchFn');
};
const reportFn = (val: any, num: any) => {
	router.push({ path: '/scan-manage/scanning-report', query: { id: val.id, name: 'quest', num: num, designation: val.name } });
};
const editRow = () => {
	router.push('/leak-manage/waring-list/assetsDetails');
};
const resetFn = () => {
	params.value = {
		id_or_name: '',
		task_type: '',
		scan_idc: '',
		status: '',
		scan_type: 2,
		page: 1,
		limit: 30,
	};
	GetList();
};
const handleSizeChange = (val: number) => {
	params.value.page = 1;
	params.value.limit = val;
	GetList();
};
const handleCurrentChange = (val: number) => {
	params.value.page = val;
	GetList();
};
const filterNode = (value: string, data: Tree) => {
	if (!value) return true;
	return data.label.includes(value);
};
const addAssFn = () => {
	router.push('/scan-manage/scanning-task/add-assets');
};
const closed = () => {
	formLabelAlign.value = {
		name: '',
		scanner: '',
		scan_type: 2,
		predict_duration: '',
		is_cris_repeataw: false,
		plan_time_start: '',
		plan_time_end: '',
		task_type: 1,
		asset_mode: 2,
		urls: [],
		execute_date: '',
		execute_time: '',
		description: '',
		site: '',
	};
	startAndendTime.value = [];
	active.value = 1;
};
const addHover = (e) => {
	const target = e.target;
	if (target.title) return;
	target.title = target.innerText;
};
</script>

<style scoped lang="scss">
:deep(.ipOrApp .el-radio-group) {
	width: 100%;
	display: flex;
	justify-content: center;
	margin: 5px;
}

.home-card-one,
.home-card-two {
	.home-card-item {
		width: 100%;
		height: 130px;
		border-radius: 4px;
		transition: all ease 0.3s;
		padding: 20px;
		overflow: hidden;
		background: var(--el-color-white);
		color: var(--el-text-color-primary);
		border: 1px solid var(--next-border-color-light);

		&:hover {
			box-shadow: 0 2px 12px var(--next-color-dark-hover);
			transition: all ease 0.3s;
		}

		&-icon {
			width: 70px;
			height: 70px;
			border-radius: 100%;
			flex-shrink: 1;

			i {
				color: var(--el-text-color-placeholder);
			}
		}

		&-title {
			font-size: 15px;
			font-weight: bold;
			height: 30px;
		}
	}
}

.home-card-one {
	@for $i from 0 through 3 {
		.home-one-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
}
:deep(.el-step.is-simple .el-step__icon) {
	display: none;
}
:deep(.input_textarea .el-textarea__inner) {
	height: 500px;
}
:deep(.el-dialog__body) {
	height: 800px;
}
.custom-style .el-segmented {
	--el-segmented-item-selected-color: var(--el-text-color-primary);
	--el-segmented-item-selected-bg-color: #ffd100;
	--el-border-radius-base: 16px;
}
.page-in {
	width: 100%;
	background: var(--el-color-white);
	margin: 0 10px 10px 10px;
	padding: 10px 0 10px 10px;
	--el-table-border-color: var(--el-border-color-lighter);

	--el-table-border: 1px solid var(--el-table-border-color);
	border: var(--el-table-border);
}
:deep(.page-in .el-radio-button__inner) {
	border-radius: 20px;
	margin-right: 10px;
}
</style>
