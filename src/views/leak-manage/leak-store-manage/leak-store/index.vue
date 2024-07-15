<template>
	<div>
		<el-row class="top_row" style="background-color: var(--el-fill-color-blank)">
			<el-col :span="18" style="height: 100%; width: 70%">
				<div style="height: 15vh">
					<div class="home-card-item flex" style="position: relative">
						<div class="flex w100">
							<div class="home-card-item-icon flex" style="background-color: #ecf5ff">
								<i class="flex-margin font32 fa fa-meetup" style="color: #409eff"></i>
							</div>
							<div style="margin-left: 10px">
								<div class="mt10">漏洞库总数</div>
								<div class="font30">{{ statisticsInfo.num || 0 }} <span style="font-size: 12px">条</span></div>
							</div>
						</div>
						<div class="flex w100">
							<div class="home-card-item-icon flex" style="background-color: #fdf6ec">
								<i class="flex-margin font32 iconfont icon-zaosheng" style="color: #e6a23c"></i>
							</div>
							<div style="margin-left: 10px">
								<div class="mt10">近7日新增</div>
								<div class="font30">{{ statisticsInfo.new_num || 0 }} <span style="font-size: 12px">条</span></div>
							</div>
						</div>
						<div class="flex w100">
							<div class="home-card-item-icon flex" style="background-color: #fdf6ec">
								<i class="flex-margin font32 iconfont icon-zaosheng" style="color: #e6a23c"></i>
							</div>
							<div style="margin-left: 10px">
								<div class="mt10">待评估漏洞</div>
								<div class="font30">{{ statisticsInfo.not_evaluated_num || 0 }} <span style="font-size: 12px">条</span></div>
							</div>
						</div>
						<!-- <div style="position: absolute; right: 100px; top:0;">更新日期：2021.12.12 12:12:00</div> -->
					</div>
				</div>
				<div style="height: 45vh">
					<div ref="loopholesNum" style="height: 100%; width: 100%"></div>
				</div>
			</el-col>
			<el-col :span="6" style="height: 100%; width: 30%">
				<el-row class="top_row_col_row">
					<div ref="loopholesRightTop" style="height: 100%; width: 100%"></div>
				</el-row>
				<el-row class="top_row_col_row">
					<div ref="loopholesRightBottom" style="height: 100%; width: 100%"></div>
				</el-row>
			</el-col>
		</el-row>
		<div class="table-container">
			<div class="form-container">
				<div class="form-title">
					<h3>漏洞库</h3>
					<div class="button-box">
						<el-button link type="primary" icon="Plus" @click="addBtn">新 增</el-button>
						<importExcel api="/api/loophole/loopholes_import/" :apiSuffix="false">导入数据</importExcel>
						<el-button link type="primary" @click="excelOutExcel" icon="Download">导出数据</el-button>
						<el-button type="primary" @click="onSearch" icon="Search">搜 索</el-button>
						<el-button type="primary" @click="reSearch" plain icon="RefreshRight">重 置</el-button>
						<el-button @click="isShowMoreSearch = !isShowMoreSearch" :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
							{{ isShowMoreSearch ? '收起' : '展开' }}
						</el-button>
					</div>
				</div>

				<div class="form-params" :style="isShowMoreSearch ? 'height:260px' : 'height:60px'">
					<el-form :inline="true" :model="params">
						<el-form-item label="漏洞ID">
							<el-input v-model="params.loophole_id" clearable />
						</el-form-item>
						<el-form-item label="漏洞名称">
							<el-input v-model="params.name" clearable />
						</el-form-item>
						<el-form-item label="扫描类型">
							<el-select v-model="params.information_type">
								<el-option label="原理扫描" value="原理扫描" />
								<el-option label="版本扫描" value="版本扫描" />
							</el-select>
						</el-form-item>
						<el-form-item label="漏洞类型">
							<el-select v-model="params.type" style="width: 240px">
								<el-option label="主机漏洞" value="主机漏洞" />
								<el-option label="WEB漏洞" value="WEB漏洞" />
								<el-option label="其他" value="其他" />
							</el-select>
						</el-form-item>
						<el-form-item label="漏洞子类型">
							<el-select v-model="params.small_type" clearable>
								<el-option label="操作系统" value="操作系统" />
								<el-option label="数据库" value="数据库" />
								<el-option label="中间件" value="中间件" />
								<el-option label="应用软件" value="应用软件" />
								<el-option label="web漏洞" value="web漏洞" />
							</el-select>
						</el-form-item>
						<el-form-item label="评估状态">
							<el-select v-model="params.evaluate" style="width: 240px">
								<el-option label="已评估" value="1" />
								<el-option label="未评估" value="0" />
							</el-select>
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
						<el-form-item label="CVEID">
							<el-input v-model="params.cveld" clearable />
						</el-form-item>
						<el-form-item label="厂商">
							<el-select v-model="params.vendor" placeholder="-">
								<el-option v-for="item in vendorDict" :key="item.id" :label="item.name" :value="item.id" />
							</el-select>
							<!-- <el-input v-model="params.vendor_display" clearable /> -->
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
				<!-- table -->
			</div>
			<div class="table-box">
				<table-unit
					:columns="columns"
					:isTips="true"
					:list="tableData"
					:pageSize="params.limit"
					:currentPage="params.page"
					:total="total"
					:isSelection="true"
					@handleSelectionChange="handleSelectionChange"
					@handleSizeChange="handleSizeChange"
					@handleCurrentChange="handleCurrentChange"
				>
					<template v-slot="record">
						<el-button size="small" type="primary" link @click="viewRow(record.record)">详情</el-button>
						<!-- <el-button size="small" type="primary" link @click="viewRowAssess(record.record)">评估</el-button> -->
					</template>
				</table-unit>
			</div>
		</div>
		<el-drawer v-model="drawerOpen" size="80%" :title="leakDetail.name">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>漏洞信息</span>
						<el-button style="margin-left: 20px" size="small" type="primary" @click="isEditBtn">{{ isEdit == true ? '确认' : '编辑' }}</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="leakDetail" label-width="auto" style="max-width: 600px">
							<el-form-item label="漏洞ID">
								<span>{{ leakDetail.loophole_id }}</span>
							</el-form-item>
							<el-form-item label="漏洞名称">
								<!-- <el-input v-if="isEdit"
                          v-model="leakDetail.name" /> -->
								<span>{{ leakDetail.name }}</span>
							</el-form-item>
							<el-form-item label="漏洞类型">
								<el-select v-if="isEdit" v-model="leakDetail.type">
									<el-option label="主机漏洞" value="主机漏洞" />
									<el-option label="WEB漏洞" value="WEB漏洞" />
									<el-option label="其他" value="其他" />
								</el-select>
								<span v-else>{{ leakDetail.type }}</span>
							</el-form-item>
							<el-form-item label="漏洞子类型">
								<el-select v-if="isEdit" v-model="leakDetail.small_type" clearable>
									<el-option label="操作系统" value="操作系统" />
									<el-option label="数据库" value="数据库" />
									<el-option label="中间件" value="中间件" />
									<el-option label="应用软件" value="应用软件" />
									<el-option label="web漏洞" value="web漏洞" />
								</el-select>
								<span v-else>{{ leakDetail.small_type }}</span>
							</el-form-item>

							<el-form-item label="漏洞等级">
								<el-select v-model="leakDetail.level" v-if="isEdit">
									<el-option v-for="item in levelDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
								<span v-else>{{ leakDetail.level }}</span>
							</el-form-item>
							<el-form-item label="修复建议">
								<el-input type="textarea" :rows="4" v-if="isEdit" v-model="leakDetail.repair_suggestion" />
								<span v-else>{{ leakDetail.repair_suggestion }}</span>
							</el-form-item>
							<el-form-item label="受影响产品">
								<span>{{ leakDetail.affected_product }}</span>
							</el-form-item>
							<el-form-item label="漏洞描述">
								<span>{{ leakDetail.description }}</span>
							</el-form-item>
							<el-form-item label="利用途径">
								<span>{{ leakDetail.utilization_way }}</span>
							</el-form-item>
							<!-- <el-form-item label="处理时限">
								<el-input v-if="isEdit" v-model="leakDetail.processing_limit" />
								<span v-else>{{ leakDetail.processing_limit }}</span>
							</el-form-item> -->
							<el-form-item label="CVEID">
								<span>{{ leakDetail.cveld }}</span>
							</el-form-item>

							<!-- <el-form-item label="厂商补丁">
								<el-input v-if="isEdit" v-model="leakDetail.name" />
								<span v-else>补丁1</span>
							</el-form-item> -->
							<el-form-item label="其他信息">
								<!-- <el-input v-if="isEdit" v-model="leakDetail.other_information" /> -->
								<span>{{ leakDetail.other_information }}</span>
							</el-form-item>
							<!-- <el-form-item label="收录时间">
								<el-input v-if="isEdit" v-model="leakDetail.collection_time" />
								<span v-else>{{ leakDetail.collection_time }}</span>
							</el-form-item> -->
							<!-- <el-form-item label="最近更新时间">
								<el-input v-if="isEdit" v-model="leakDetail.update_time" />
								<span v-else>{{ leakDetail.update_time }}</span>
							</el-form-item> -->
							<el-form-item label="数据来源">
								<!-- <el-input v-if="isEdit" v-model="leakDetail.data_source" /> -->
								<span>{{ leakDetail.data_source }}</span>
							</el-form-item>
							<el-form-item label="获取方式">
								<!-- <el-input v-if="isEdit" v-model="leakDetail.acquisition_mode" /> -->
								<span>{{ leakDetail.acquisition_mode }}</span>
							</el-form-item>
							<el-form-item label="厂商和版本">
								<!-- <el-select v-if="isEdit" v-model="leakDetail.vendor" placeholder="-">
									<el-option v-for="item in vendorDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select> -->

								<span>{{ leakDetail.vendor_display }}</span>
							</el-form-item>
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>
		<el-drawer v-model="addDrawer" size="80%" title="新增">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>漏洞信息</span>
						<el-button style="margin-left: 20px" size="small" type="primary" @click="addSureBtn">确认提交</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="addForm" label-width="auto" style="max-width: 600px">
							<el-form-item label="漏洞名称">
								<el-input v-model="addForm.name" />
							</el-form-item>
							<el-form-item label="漏洞类型">
								<el-select v-model="addForm.type">
									<el-option label="主机漏洞" value="主机漏洞" />
									<el-option label="WEB漏洞" value="WEB漏洞" />
									<el-option label="其他" value="其他" />
								</el-select>
							</el-form-item>
							<el-form-item label="漏洞子类型">
								<el-select v-model="addForm.small_type" clearable>
									<el-option label="操作系统" value="操作系统" />
									<el-option label="数据库" value="数据库" />
									<el-option label="中间件" value="中间件" />
									<el-option label="应用软件" value="应用软件" />
									<el-option label="web漏洞" value="web漏洞" />
								</el-select>
							</el-form-item>
							<el-form-item label="漏洞等级">
								<el-input v-model="addForm.level" />
							</el-form-item>
							<el-form-item label="受影响产品">
								<el-input v-model="addForm.affected_product" />
							</el-form-item>
							<el-form-item label="漏洞描述">
								<el-input v-model="addForm.description" />
							</el-form-item>
							<el-form-item label="利用途径">
								<el-input v-model="addForm.utilization_way" />
							</el-form-item>
							<el-form-item label="处理时限">
								<el-input v-model="addForm.processing_limit" />
							</el-form-item>
							<el-form-item label="CVEID">
								<el-input v-model="addForm.cveld" />
							</el-form-item>
							<!-- <el-form-item label="首次发现时间">
								<el-input v-model="addForm.discovery_time" />
							</el-form-item> -->
							<el-form-item label="修复建议">
								<el-input v-model="addForm.repair_suggestion" />
							</el-form-item>

							<el-form-item label="其他信息">
								<el-input v-model="addForm.other_information" />
							</el-form-item>
							<!-- <el-form-item label="收录时间">
								<el-input v-model="addForm.collection_time" />
							</el-form-item> -->

							<el-form-item label="数据来源">
								<el-input v-model="addForm.data_source" />
							</el-form-item>
							<el-form-item label="获取方式">
								<el-input v-model="addForm.acquisition_mode" />
							</el-form-item>
							<el-form-item label="厂商和版本">
								<el-select v-model="addForm.vendor" placeholder="-">
									<el-option v-for="item in vendorDict" :key="item.id" :label="item.name" :value="item.id" />
								</el-select>
							</el-form-item>
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>
		<el-drawer v-model="drawerAssess" size="80%" :title="leakDetail.name">
			<div>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>漏洞信息</span>
						<el-button style="margin-left: 20px" size="small" type="primary" @click="assessEditBtn">提交评估信息</el-button>
					</dt>
					<dd class="dl-content">
						<el-form :model="leakDetail" label-width="auto" style="max-width: 600px">
							<el-form-item label="漏洞类型">
								<el-input v-model="leakDetail.type" />
							</el-form-item>
							<el-form-item label="漏洞子类型">
								<el-select v-model="addForm.small_type" clearable>
									<el-option label="操作系统" value="操作系统" />
									<el-option label="数据库" value="数据库" />
									<el-option label="中间件" value="中间件" />
									<el-option label="应用软件" value="应用软件" />
									<el-option label="web漏洞" value="web漏洞" />
								</el-select>
							</el-form-item>
							<el-form-item label="漏洞等级">
								<el-input v-model="leakDetail.level" />
							</el-form-item>

							<el-form-item label="利用途径">
								<el-input v-model="leakDetail.utilization_way" />
							</el-form-item>
							<el-form-item label="漏洞别名">
								<el-input v-model="leakDetail.alias" />
							</el-form-item>

							<el-form-item label="其他信息">
								<el-input v-model="leakDetail.other_information" />
							</el-form-item>
						</el-form>
					</dd>
				</dl>
				<dl class="dl-container" style="padding: 10px 30px">
					<dt class="dl-title" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0">
						<span>漏洞信息</span>
					</dt>
					<dd class="dl-content">
						<el-form :model="leakDetail" label-width="auto" style="max-width: 600px">
							<el-form-item label="漏洞ID">
								<span>{{ leakDetail.loophole_id }}</span>
							</el-form-item>
							<el-form-item label="漏洞名称">
								<span>{{ leakDetail.name }}</span>
							</el-form-item>

							<el-form-item label="受影响产品">
								<span>{{ leakDetail.affected_product }}</span>
							</el-form-item>
							<el-form-item label="漏洞描述">
								<span>{{ leakDetail.description }}</span>
							</el-form-item>

							<el-form-item label="处理时限">
								<span>{{ leakDetail.processing_limit }}</span>
							</el-form-item>
							<el-form-item label="CVEID">
								<span>{{ leakDetail.cveld }}</span>
							</el-form-item>
							<!-- <el-form-item label="首次发现时间">
								<span>{{ leakDetail.discovery_time }}</span>
							</el-form-item> -->
							<el-form-item label="修复建议">
								<span>{{ leakDetail.repair_suggestion }}</span>
							</el-form-item>
							<!-- <el-form-item label="收录时间">
								<span>{{ leakDetail.collection_time }}</span>
							</el-form-item> -->
							<!-- <el-form-item label="最近更新时间">
								<span>{{ leakDetail.update_time }}</span>
							</el-form-item> -->
							<el-form-item label="数据来源">
								<span>{{ leakDetail.data_source }}</span>
							</el-form-item>
							<el-form-item label="获取方式">
								<span>{{ leakDetail.acquisition_mode }}</span>
							</el-form-item>
							<el-form-item label="厂商和版本">
								<span>{{ leakDetail.vendor_display }}</span>
							</el-form-item>
						</el-form>
					</dd>
				</dl>
			</div>
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref } from 'vue';
import * as echarts from 'echarts';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import importExcel from '@/components/importExcel/index.vue';
import { nextTick } from 'process';
let loopholesNum = ref();
let loopholesRightTop = ref();
let loopholesRightBottom = ref();
const router = useRouter();
type EChartsOption = echarts.EChartsOption;
import apis from './api';
let startAndendTime = ref([]);
let params = ref({
	limit: 30,
	page: 1,
	description: '',
	utilization_way: '',
	name: '', //  漏洞名称
	type: '', //  漏洞类型
	small_type: '', // 漏洞子类型
	level: '', //  漏洞等级
	evaluate: '', // 评估状态
	affected_product: '', // 受影响产品
	vendor: '', //	厂商
	severity: '', //	严重性
	cveld: '', //	cveld
	create_start_time: '', //	收录时间
	create_end_time: '', //		收录时间
	data_source: '', //		数据来源
	acquisition_mode: '', //	获取方式
	information_type: '',
});
let columns = [
	{
		title: '漏洞ID',
		dataIndex: 'loophole_id',
	},
	{
		title: '漏洞名称',
		dataIndex: 'name',
	},
	{
		title: '漏洞类型',
		dataIndex: 'type',
	},
	{
		title: '扫描类型',
		dataIndex: 'information_type',
	},
	{
		title: '漏洞子类型',
		dataIndex: 'small_type',
	},
	{
		title: '受影响产品',
		dataIndex: 'affected_product',
	},
	{
		title: '等级',
		dataIndex: 'level',
	},
	{
		title: '严重程度',
		dataIndex: 'severity',
	},
	{
		title: '漏洞描述',
		dataIndex: 'description',
	},
	{
		title: '收录日期',
		dataIndex: 'collection_time',
	},
	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];

let total = ref(0);
let echartTypeNum: any = ref([]);
let sourceTypeNum: any = ref([]);
let dayXNum: any = ref([]);
let dayYNum: any = ref([]);
let echartsAll = () => {
	var myChart = echarts.init(loopholesNum.value);
	// var option: EChartsOption;
	let option = {
		title: {
			text: '漏洞库每日新增漏洞数量',
		},
		xAxis: {
			type: 'category',
			data: dayYNum.value,
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				data: dayYNum.value,
				type: 'line',
				smooth: true,
				symbol: 'none',
			},
		],
	};
	option && myChart.setOption(option);
	// 右上
	var myChartRightTop = echarts.init(loopholesRightTop.value);
	let option1 = {
		title: {
			text: '漏洞类型占比',
			textStyle: {
				fontSize: '12px',
			},
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			bottom: '0',
			left: 'center',
		},
		series: [
			{
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,

				label: {
					show: false,
					position: 'center',
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 14,
						fontWeight: 'bold',
					},
				},
				labelLine: {
					show: false,
				},
				data: echartTypeNum.value,
			},
		],
	};
	let option2 = {
		title: {
			text: '漏洞获取来源占比',
			textStyle: {
				fontSize: '12px',
			},
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			bottom: '0',
			left: 'center',
		},
		series: [
			{
				name: '',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center',
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 14,
						fontWeight: 'bold',
					},
				},
				labelLine: {
					show: false,
				},
				data: sourceTypeNum.value,
			},
		],
	};
	option1 && myChartRightTop.setOption(option1);
	// 右下
	var myChartRightBottom = echarts.init(loopholesRightBottom.value);
	option2 && myChartRightBottom.setOption(option2);
};
// nextTick(() => {
// 	echartsAll();
// });

let levelDict: any = ref([]);
for (var i = 1; i < 19; i++) {
	levelDict.value.push({ name: i, id: i });
}
// 漏洞库总量
const statisticsInfo = ref({});
const getStatisticsInfo = async () => {
	let res = await apis.getLoopholeStatisticsApi();
	statisticsInfo.value = res.data;
	echartTypeNum.value = [
		{ value: res.data.host_num, name: '主机漏洞' },
		{ value: res.data.web_num, name: 'WEB漏洞' },
		{ value: res.data.other_num, name: '其他' },
	];
	sourceTypeNum.value = [
		{ value: res.data.lvmeng_num, name: '绿盟' },
		{ value: res.data.qiming_num, name: '启明' },
		{ value: res.data.changting_num, name: '长亭' },
	];
	echartsAll();
};
getStatisticsInfo();

// 漏洞每日新增数量
const loopholeDayInfo = ref({});
const getLoopholeDayInfo = async () => {
	let res = await apis.getLoopholeDayApi();
	loopholeDayInfo.value = res.data;
	res.data.map((day) => {
		dayYNum.value.push(day.count);
		dayXNum.value.push(day.date);
	});
};
getLoopholeDayInfo();

let addForm = ref({
	alias: '-', //#别名
	level: '-', // #等级
	type: '-', // #漏洞类型
	small_type: '', //漏洞子类
	utilization_way: '-', //#利用途径
	name: '', //  #漏洞名称
	severity: '-', // #严重程度
	description: '', //  #漏洞描述
	affected_product: '', //#受影响产品
	cveld: '-',
	processing_limit: '-', //#处理时限
	// discovery_time: '', //#首次发现时间
	repair_suggestion: '', //#修复建议
	other_information: '-', // #其他信息
	information_type: '-',
	data_source: '', // #数据来源
	acquisition_mode: '', // #获取方式
	vendor: '', // #厂商(手动录入：01，绿盟：02，启明：03，长亭：														04)
	// evaluate: '', //#是否评估(0：为评估，1已评估)
});
let addDrawer: any = ref(false);
const addBtn = async () => {
	addDrawer.value = true;
};

// 新增请求按钮
const addSureBtn = async () => {
	if (!addForm.value.acquisition_mode) {
		addForm.value.acquisition_mode = '手工录入';
	}
	let res = await apis.postLoopholesApi(addForm.value);
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		getLoopholesList();
		addDrawer.value = false;
	}
};
const tableData = ref([]);
// 获取漏洞库列表
const getLoopholesList = async () => {
	params.value.create_start_time = startAndendTime.value[0];
	params.value.create_end_time = startAndendTime.value[1];
	let res = await apis.getLoopholesApi(params.value);
	tableData.value = res.data;
	total.value = res.total;
};
getLoopholesList();

const isEditBtn = async (val: any) => {
	isEdit.value = !isEdit.value;
	if (!isEdit.value) {
		let res = await apis.editLoopholesApi(leakDetail.value.id, leakDetail.value);
		if (res.code == 2000) {
			ElMessage.success(res.msg);
			getLoopholesList();
			drawerOpen.value = false;
		}
	}
};

let drawerOpen: any = ref(false);
let leakDetail: any = ref({});
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
const viewRow = (val: any) => {
	leakDetail.value = val;
	if (!val.acquisition_mode) {
		leakDetail.value.acquisition_mode = '手工录入';
	}
	drawerOpen.value = true;
};

let drawerAssess: any = ref(false);
const viewRowAssess = (val: any) => {
	leakDetail.value = val;
	drawerAssess.value = true;
};
// 提交评估请求按钮
const assessEditBtn = async () => {
	if (!leakDetail.value.acquisition_mode) {
		leakDetail.value.acquisition_mode = '手工录入';
	}
	let res = await apis.putEvaluateLoopholesApi(leakDetail.value.id, leakDetail.value);
	if (res.code == 2000) {
		ElMessage.success(res.msg);
		getLoopholesList();
		drawerAssess.value = false;
	}
};

let isEdit = ref(false);
let isShowMoreSearch = ref(false);
const onSearch = () => {
	params.value.page = 1;
	getLoopholesList();
};

const reSearch = () => {
	params.value = {
		limit: 30,
		page: 1,
		description: '',
		utilization_way: '',
		name: '', //  漏洞名称
		type: '', //  漏洞类型
		small_type: '', // 漏洞子类型
		level: '', //  漏洞等级
		evaluate: '', // 评估状态
		affected_product: '', // 受影响产品
		vendor: '', //	厂商
		severity: '', //	严重性
		cveld: '', //	cveld
		create_start_time: '', //	收录时间
		create_end_time: '', //		收录时间
		data_source: '', //		数据来源
		acquisition_mode: '', //	获取方式
		information_type: '',
	};
	getLoopholesList();
};

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
	getLoopholesList();
};
const handleCurrentChange = (val: number) => {
	params.value.page = val;
	getLoopholesList();
};
const form = reactive({
	name: '',
	region: '',
	date1: '',
	date2: '',
	delivery: false,
	type: [],
	resource: '',
	desc: '',
});

const excelOutExcel = async () => {
	ElMessageBox.prompt('自定义导出文件名', '提示', {
		confirmButtonText: '确认导出',
		cancelButtonText: '取消',
		inputPlaceholder: '请输入自定义文件名，无输入时使用默认文件名',
	})
		.then(({ value }) => {
			const data: any = {
				...params.value,
				id_list: selectList.value.join(','),
			};
			delete data.limit;
			delete data.page;
			if (value) {
				value = value + '.xlsx';
			} else {
				value = undefined;
			}
			apis.downloadHostFile(data);
		})
		.catch(() => {});
};
</script>

<style scoped lang="scss">
.top_row {
	height: 60vh;
	background: #ffffff;
	padding: 10px;
	margin: 10px;
	.top_row_col_row {
		height: 50%;
	}
}
.home-card-item {
	width: 100%;
	height: 130px;
	border-radius: 4px;
	transition: all ease 0.3s;
	padding: 20px;
	overflow: hidden;
	background: var(--el-color-white);
	color: var(--el-text-color-primary);

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
</style>
