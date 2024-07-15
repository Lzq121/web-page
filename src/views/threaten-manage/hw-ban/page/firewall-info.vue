
<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus';
import moment from 'moment';

import { updateThreat, createThreat, getImages, deleteImages, getThreat, getThreatDeal, createThreatDeal, deleteThreatDeal, getRes } from '../api';
import { Local, Session } from '@/utils/storage';
import apis from '../api';
import BarChart from '../components/barCharts.vue';
import LineCharts from '../components/LineCharts.vue';
let roles = ref([]);
const router = useRouter();
const route = useRoute();
const roleInfo = Session.get('userInfo').role_info;
if (Array.isArray(roleInfo)) {
	roles.value = roleInfo.map((item: any) => {
		return item.name;
	});
}

const columns = [
	{
		title: '防火墙管理IP',
		dataIndex: 'manage_ip',
		align: 'center',
		isHidden: true,
	},
	{
		title: '封禁策略名称',
		dataIndex: 'name',
		align: 'center',
		isHidden: true,
	},
	{
		title: '采集数据日期',
		dataIndex: 'create_time',
		align: 'center',
	},
	{
		title: '命中数',
		dataIndex: 'hit_counts',
		align: 'center',
		width: 150,
	},
];
const banIpColumns = [
	{
		title: '封禁IP',
		dataIndex: 'ban_ip',
		align: 'center',
	},
	{
		title: '防火墙管理IP',
		dataIndex: 'all_manage_ip',
		align: 'center',
	},
	{
		title: '设备品牌',
		dataIndex: 'brand',
		align: 'center',
	},
	{
		title: '设备型号',
		dataIndex: 'device_model',
		align: 'center',
	},
	{
		title: '设备名称',
		dataIndex: 'device_name',
		align: 'center',
		isHidden: true,
	},
	{
		title: '数据中心',
		dataIndex: 'data_center',
		align: 'center',
	},
	{
		title: '更新时间',
		dataIndex: 'update_time',
		align: 'center',
	},
];
const hitIpColumns = [
	{
		title: '命中数',
		dataIndex: 'hit_counts',
		align: 'center',
		width: 120,
	},
	{
		title: '管理IP',
		dataIndex: 'manage_ip',
		align: 'center',
	},
	{
		title: '策略名称',
		dataIndex: 'name',
		align: 'center',
	},
	{
		title: '创建事件',
		dataIndex: 'create_time',
		align: 'center',
	},
];
const pluggingDeviceArr = [
	{
		index: '1',
		manage_ip: '10.138.31.20',
		brand: '飞塔',
		deviceModel: '',
		deviceName: '南中心-DMZ业务子分区飞塔防火墙',
		dataCenter: '南中心',
		isPlugginSend: '是',
	},
	{
		index: '2',
		manage_ip: '10.138.31.14,10.138.31.15',
		brand: '华三',
		deviceModel: '',
		deviceName: '南中心-DMZ办公子分区华三防火墙',
		dataCenter: '南中心',
		isPlugginSend: '是',
	},
	{
		index: '3',
		manage_ip: '10.129.254.17,10.129.254.18',
		brand: '山石',
		deviceModel: '',
		deviceName: '88号机房-集团总部DMZ区山石防火墙',
		dataCenter: '88号机房',
		isPlugginSend: '是',
	},
	{
		index: '4',
		manage_ip: '10.55.205.37,10.55.205.38',
		brand: '山石',
		deviceModel: '',
		deviceName: '北同城-山石防火墙',
		dataCenter: '北同城',
		isPlugginSend: '是',
	},
	{
		index: '5',
		manage_ip: '10.55.205.59,10.55.205.60',
		brand: '山石',
		deviceModel: '',
		deviceName: '北同城-测试DMZ区山石10.55.205.59防火墙',
		dataCenter: '北同城',
		isPlugginSend: '是',
	},
	{
		index: '6',
		manage_ip: '10.31.17.36,10.31.17.37',
		brand: '山石',
		deviceModel: '',
		deviceName: '北中心-DMZ外墙-山石10.31.17.36防火墙',
		dataCenter: '北中心',
		isPlugginSend: '是',
	},
	{
		index: '7',
		manage_ip: '10.31.47.83,10.31.47.84',
		brand: '山石',
		deviceModel: '',
		deviceName: '北中心-SD-WAN区山石10.31.47.83防火墙',
		dataCenter: '北中心',
		isPlugginSend: '是',
	},
	{
		index: '8',
		manage_ip: '10.178.10.64,10.178.10.65',
		brand: '奇安信',
		deviceModel: '',
		deviceName: '云廊坊-业务口奇安信10.178.10.64防火墙',
		dataCenter: '云廊坊',
		isPlugginSend: '是',
	},
];
let nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
let towHourTime = moment().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss');
let banIpTableheight = window.innerHeight - 160;
let list = ref([]);
let firewallIpPluggingList = ref([]);
let pluggingDeviceInfo = ref(pluggingDeviceArr[0]);
let ipValue = ref('1');
let textData = ref([]);
let numberData = ref([]);
let banDataX = ref([]);
let banDataY = ref([]);
let lineBanDataX = ref([]);
let lineBanDataY = ref([]);
let lineHitDataX = ref([]);
let lineHitDataY = ref([]);
let hitDataX = ref([]);
let hitDataY = ref([]);
let isBanEchartsData = ref(false);
let isBanEcharts = ref(true);
let isHitEchartsData = ref(false);
let isHitEcharts = ref(true);
let banLineSubtext = ref('');
let hitLineSubtext = ref('');
let date = ref([towHourTime, nowTime]);
let dateHit = ref([towHourTime, nowTime]);

let banIpList = ref([]);
let hitIpList = ref([]);
let paramsBanIp = ref({
	limit: 10,
	page: 1,
	manage_ip: '',
	ban_ip: '',
	start_time: '',
	end_time: '',
});
let paramsHitIp = ref({
	limit: 10,
	page: 1,
	manage_ip: '',
	ban_ip: '',
	start_time: '',
	end_time: '',
});
let totalBanIp = ref(0);
let totalHitIp = ref(0);
let activeName = ref('1');
const handleSearch = (name) => {
	switch (name) {
		case 'ban':
			paramsBanIp.value.page = 1;
			fetchDataBanIp(paramsBanIp.value);
			break;
		case 'hit':
			paramsHitIp.value.page = 1;
			fetchDataHitIp(paramsHitIp.value);
			break;

		default:
			break;
	}
};
const reSearch = (name) => {
	switch (name) {
		case 'ban':
			paramsBanIp.value = {
				limit: 10,
				page: 1,
				manage_ip: '',
				ban_ip: '',
			};
			let nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
			let towHourTime = moment().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss');
			date = [towHourTime, nowTime];
			fetchDataBanIp(paramsBanIp.value);
			break;
		case 'hit':
			paramsHitIp.value = {
				limit: 10,
				page: 1,
				manage_ip: '',
				ban_ip: '',
			};
			let nowTime1 = moment().format('YYYY-MM-DD HH:mm:ss');
			let towHourTime1 = moment().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss');
			dateHit.value = [towHourTime1, nowTime1];
			fetchDataHitIp(paramsHitIp.value);
			break;

		default:
			break;
	}
};
// 防火墙封禁查询

const fetchDataBanIp = async (params) => {
	if (Array.isArray(date.value) && date.value.length > 0) {
		params.start_time = date.value[0];
		params.end_time = date.value[1];
	} else {
		params.start_time = '';
		params.end_time = '';
	}
	const { data } = await apis.getFirewallBanip(params);
	banIpList.value = [];
	totalBanIp.value = data.total;
	if (Array.isArray(data.result)) {
		data.result.forEach((item) => {
			let obj = { ban_ip: item.ban_ip, update_time: item.update_time, ...item.firewall_ban_info[0] };
			banIpList.value.push(obj);
		});
	}
};
// 命中数列表查询
const fetchDataHitIp = async (params) => {
	if (Array.isArray(dateHit.value) && dateHit.value.length == 2) {
		params.start_time = dateHit.value[0];
		params.end_time = dateHit.value[1];
	} else {
		params.start_time = '';
		params.end_time = '';
	}
	const { data } = await apis.getrFirewallHitInfo(params);
	totalHitIp.value = data.total;
	if (Array.isArray(data.result)) {
		hitIpList.value = data.result;
	}
};
const handleSizeChangeBanIp = (val) => {
	paramsBanIp.value.limit = val;
	paramsBanIp.value.page = 1;
	fetchDataBanIp(paramsBanIp.value);
};
const handleCurrentChangeBanIp = (val) => {
	paramsBanIp.page.value = val;
	fetchDataBanIp(paramsBanIp.value);
};
const handleSizeChangeHitIp = (val) => {
	paramsHitIp.value.limit = val;
	paramsHitIp.value.page = 1;
	fetchDataHitIp(paramsHitIp.value);
};
const handleCurrentChangeHitIp = (val) => {
	paramsHitIp.value.page = val;
	fetchDataHitIp(paramsHitIp.value);
};
const fetchFirewallData = async () => {
	const { data } = await apis.queryNewHitCounts();
	list.value = data.list;
	let list1 = [];
	let list2 = [];
	data.countsList.forEach((item) => {
		list1.push(item.manage_ip);
		list2.push(item.count);
	});
	textData.value = list1;
	numberData.value = list2;
};
const fetchFireWallIpData = (val) => {
	const formData = (array) => {
		let newArr = [];
		let tempArr = [];
		for (let index = 0; index < array.length; index++) {
			const element = array[index];
			tempArr.push(element);
			let i = index + 1;
			if (tempArr.length === 4 || array.length == i) {
				newArr.push(tempArr);
				tempArr = [];
			}
		}
		firewallIpPluggingList.value = newArr;
	};
	apis.fetchFireWallIpData({ manage_ip: val }).then((res) => {
		formData(res.data);
	});
};
const changeIp = (val) => {
	switch (val) {
		case '1':
			pluggingDeviceInfo.value = pluggingDeviceArr[0];
			break;
		case '2':
			pluggingDeviceInfo.value = pluggingDeviceArr[1];
			break;
		case '3':
			pluggingDeviceInfo.value = pluggingDeviceArr[2];
			break;
		case '4':
			pluggingDeviceInfo.value = pluggingDeviceArr[3];
			break;
		case '5':
			pluggingDeviceInfo.value = pluggingDeviceArr[4];
			break;
		case '6':
			pluggingDeviceInfo.value = pluggingDeviceArr[5];
			break;
	}
	fetchFireWallIpData(pluggingDeviceInfo.value.manage_ip);
};
const onTabClick = (val) => {
	switch (val.props.name) {
		case '1':
			if (banDataX.value.length == 0) {
				getFirewallBanCharts();
			}
			if (hitIpList.value.length == 0) {
				fetchDataBanIp(paramsHitIp.value);
			}
			break;
		case '2':
			if (hitDataX.value.length == 0) {
				getFirewallHitCharts();
			}
			if (hitIpList.value.length == 0) {
				fetchDataHitIp(paramsHitIp.value);
			}
			break;
		case '3':
			if (list.value.length == 0) {
				fetchFirewallData();
			}
			if (firewallIpPluggingList.value.length == 0) {
				fetchFireWallIpData(pluggingDeviceArr[0].manage_ip);
			}
			break;
		default:
			break;
	}
};
const getFirewallBanCharts = async () => {
	let end_time = moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
	let start_time = moment().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss');
	banDataX.value = [];
	banDataY.value = [];
	const { data } = await apis.getFirewallChartsInfo({ start_time, end_time });
	if (Array.isArray(data) && data.length > 0) {
		data.forEach((item) => {
			banDataX.value.push(item.manage_ip);
			banDataY.value.push(item.firewall_ban_ip_count);
		});
		isBanEchartsData.value = true;
	} else {
		isBanEchartsData.value = false;
	}
};
const clickBanBar = async (val) => {
	//返回的是单个柱图的名字
	let end_time = moment().format('YYYY-MM-DD HH:mm:ss');
	let start_time = '2024-07-05 00:00:00';
	let formData = { manage_ip: val, end_time, start_time };
	banLineSubtext.value = `防火墙IP:${val}，本数据从2024年7月5日0点开始统计`;
	isBanEcharts.value = !isBanEcharts.value;
	const { data } = await apis.getFirewallChartsInfo(formData);
	lineBanDataX.value = [];
	lineBanDataY.value = [];
	if (Array.isArray(data) && data.length > 0) {
		data.forEach((item) => {
			lineBanDataX.value.unshift(item.update_time);
			lineBanDataY.value.unshift(item.firewall_ban_ip_count);
		});
	}
};
const getFirewallHitCharts = async () => {
	let end_time = moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
	let start_time = moment().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss');
	hitDataX.value = [];
	hitDataY.value = [];
	const { data } = await apis.getFirewallHitCharts({ start_time, end_time });
	if (Array.isArray(data) && data.length > 0) {
		data.forEach((item) => {
			hitDataX.value.push(item.manage_ip);
			hitDataY.value.push(item.hit_counts);
		});
		isHitEchartsData.value = true;
	} else {
		isHitEchartsData.value = false;
	}
};
const clickHitBar = async (val) => {
	//返回的是单个柱图的名字
	let end_time = moment().format('YYYY-MM-DD HH:mm:ss');
	let start_time = '2024-07-05 00:00:00';
	let formData = { manage_ip: val, end_time, start_time };
	hitLineSubtext.value = '防火墙IP：【' + val + '】';
	isHitEcharts.value = !isHitEcharts;
	lineHitDataX.value = [];
	lineHitDataY.value = [];
	const { data } = await apis.getFirewallHitCharts(formData);
	if (Array.isArray(data) && data.length > 0) {
		data.forEach((item) => {
			lineHitDataX.value.unshift(item.create_time);
			lineHitDataY.value.unshift(item.hit_counts);
		});
	}
};
getFirewallBanCharts();
fetchDataBanIp(paramsBanIp.value);
</script>
  
<template>
  <div>
    <dp title="防火墙封禁信息"
        @back="router.push({ path: '/threaten-manage/hw-ban', query: { ...route.query } })">
      <el-tabs v-model="activeName"
               @tab-click="onTabClick"
               type="border-card">
        <el-tab-pane label="封禁数据"
                     name="1">
          <dl class="dl-container-position">
            <dt>防火墙封禁信息统计图</dt>
            <dd>
              <div v-if="isBanEchartsData">
                <BarChart :isEvent="true"
                          :title="'防火墙封禁信息（个）'"
                          :subtext="'最近一小时'"
                          :height="banIpTableheight - 130 + 'px'"
                          @barEvent="clickBanBar"
                          v-if="banDataX.length > 0 && isBanEcharts"
                          :yData="banDataY"
                          :isShowXAxis="false"
                          :xData="banDataX">
                </BarChart>
                <div class="line-charts-box">
                  <div class="btn-box">
                    <el-button type="primary"
                               @click="isBanEcharts = true"
                               link
                               icon="ArrowLeft"
                               circle
                               v-if="!isBanEcharts">
                      返回
                    </el-button>
                  </div>
                  <LineCharts :title="'历史防火墙封禁信息（个）'"
                              :subtext="banLineSubtext"
                              :height="banIpTableheight - 130 + 'px'"
                              v-if="lineBanDataX.length > 0 && !isBanEcharts"
                              :xData="lineBanDataX"
                              :isShowXAxis="false"
                              :yData="lineBanDataY">
                  </LineCharts>
                </div>
              </div>
              <div v-else>
                <el-empty description="数据为空" />
              </div>
            </dd>
          </dl>
          <dl class="dl-container-position">
            <dt>封禁数据明细</dt>
            <dd>
              <div class="form-container"
                   style="text-align: right;">
                <el-form :inline="true"
                         :model="paramsBanIp"
                         label-suffix=":"
                         class="demo-form-inline">

                  <el-form-item label="封禁IP">
                    <el-input @keyup.enter="handleSearch('ban')"
                              clearable
                              v-model="paramsBanIp.ban_ip"
                              placeholder="请输入封禁IP"></el-input>
                  </el-form-item>
                  <el-form-item label="防火墙IP">
                    <el-input @keyup.enter="handleSearch('ban')"
                              clearable
                              v-model="paramsBanIp.manage_ip"
                              placeholder="请输入防火墙IP"></el-input>
                  </el-form-item>
                  <el-form-item label="更新时间">

                    <el-date-picker v-model="date"
                                    type="datetimerange"
                                    value-format="YYYY-MM-DD HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary"
                               @click="handleSearch('ban')"
                               icon="Search">查询</el-button>
                    <el-button type="primary"
                               @click="reSearch('ban')"
                               plain
                               icon="RefreshLeft">重置</el-button>
                  </el-form-item>
                </el-form>

              </div>
              <table-unit :columns="banIpColumns"
                          :tableHeight="banIpTableheight - 130"
                          :list="banIpList"
                          @handleCurrentChange="handleCurrentChangeBanIp"
                          @handleSizeChange="handleSizeChangeBanIp"
                          :total="totalBanIp"
                          :currentPage="paramsBanIp.page">

              </table-unit>

            </dd>
          </dl>
        </el-tab-pane>
        <el-tab-pane label="命中数据"
                     name="2">
          <dl class="dl-container-position">
            <dt>防火墙命中信息统计图</dt>
            <dd>
              <div v-if="isHitEchartsData">
                <BarChart :isEvent="true"
                          :title="'防火墙历史命中信息总计（次）'"
                          :subtext="'每小时更新'"
                          :height="banIpTableheight - 130 + 'px'"
                          @barEvent="clickHitBar"
                          v-if="hitDataX.length > 0 && isHitEcharts"
                          :yData="hitDataY"
                          :isShowXAxis="false"
                          :xData="hitDataX">
                </BarChart>
                <div class="line-charts-box">
                  <div class="btn-box">
                    <el-button type="primary"
                               @click="isHitEcharts = true"
                               link
                               icon="ArrowLeft"
                               circle
                               v-if="!isHitEcharts">
                      返回
                    </el-button>
                  </div>
                  <LineCharts :title="'防火墙历史命中信息（次）'"
                              :subtext="hitLineSubtext"
                              :height="banIpTableheight - 130 + 'px'"
                              v-if="lineHitDataX.length > 0 && !isHitEcharts"
                              :xData="lineHitDataX"
                              :yData="lineHitDataY">
                  </LineCharts>
                </div>
              </div>
              <div v-else>
                <el-empty description="数据为空" />
              </div>
            </dd>
          </dl>
          <dl class="dl-container-position">
            <dt>命中数据明细</dt>
            <dd>
              <div class="form-container"
                   style="text-align: right;">
                <el-form :inline="true"
                         :model="paramsHitIp"
                         label-suffix=":"
                         class="demo-form-inline">

                  <el-form-item label="封禁IP">
                    <el-input @keyup.enter="handleSearch('hit')"
                              clearable
                              v-model="paramsHitIp.ban_ip"
                              placeholder="请输入封禁IP"></el-input>
                  </el-form-item>
                  <el-form-item label="防火墙IP">
                    <el-input @keyup.enter="handleSearch('hit')"
                              clearable
                              v-model="paramsHitIp.manage_ip"
                              placeholder="请输入防火墙IP"></el-input>
                  </el-form-item>
                  <el-form-item label="更新时间：">

                    <el-date-picker v-model="dateHit"
                                    type="datetimerange"
                                    value-format="YYYY-MM-DD HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary"
                               @click="handleSearch('hit')"
                               icon="Search">查询</el-button>
                    <el-button type="primary"
                               @click="reSearch('hit')"
                               plain
                               icon="RefreshLeft">重置</el-button>
                  </el-form-item>
                </el-form>

              </div>
              <table-unit :columns="hitIpColumns"
                          :height="banIpTableheight - 130"
                          :list="hitIpList"
                          @handleCurrentChange="handleCurrentChangeHitIp"
                          @handleSizeChange="handleSizeChangeHitIp"
                          :total="totalHitIp"
                          :currentPage="paramsHitIp.page">

              </table-unit>
            </dd>
          </dl>
        </el-tab-pane>
        <el-tab-pane label="实时数据"
                     name="3">
          <dl class="dl-container-position">
            <dt>最新命中数数据总数统计</dt>
            <dd>
              <BarChart v-if="textData.length > 0"
                        :height="banIpTableheight - 130 + 'px'"
                        :yData="numberData"
                        :xData="textData"></BarChart>
              <div v-else>
                <el-empty description="数据为空" />
              </div>
            </dd>
          </dl>
          <dl class="dl-container-position">
            <dt>封禁策略最新命中数数据明细</dt>
            <dd>

              <table-unit :columns="columns"
                          :list="list"
                          :tableHeight="banIpTableheight"
                          :isShowPatination="false"
                          :isIndex="true">
              </table-unit>
            </dd>
          </dl>
          <dl class="dl-container-position">
            <dt>
              防火墙封禁ip数据
              <el-select @change="changeIp"
                         style="width:50%;margin-left:50px"
                         v-model="ipValue"
                         placeholder="请选择设备">
                <el-option v-for="item in pluggingDeviceArr"
                           :key="item.index"
                           :label="item.deviceName"
                           :value="item.index">
                </el-option>
              </el-select>
            </dt>
            <dd>

              <dl class="dl-container-position">
                <dt>设备基本信息</dt>
                <dd>
                  <table class="m_table">
                    <tr>
                      <td class="bold-td">防火墙管理ip</td>
                      <td>{{ pluggingDeviceInfo.manage_ip }}</td>
                      <td class="bold-td">品牌</td>
                      <td>{{ pluggingDeviceInfo.brand }}</td>
                    </tr>
                    <tr>
                      <td class="bold-td">设备型号</td>
                      <td>{{ pluggingDeviceInfo.deviceModel }}</td>
                      <td class="bold-td">设备名称</td>
                      <td>{{ pluggingDeviceInfo.deviceName }}</td>
                    </tr>
                    <tr>
                      <td class="bold-td">数据中心</td>
                      <td>{{ pluggingDeviceInfo.dataCenter }}</td>
                      <td class="bold-td">是否支持封禁下发</td>
                      <td>{{ pluggingDeviceInfo.isPlugginSend }}</td>
                    </tr>
                  </table>
                </dd>
              </dl>
              <dl class="dl-container-position">
                <dt>封禁IP列表</dt>
                <dd>
                  <table class="m_table"
                         style="text-align:center"
                         v-if="firewallIpPluggingList.length > 0">
                    <tr v-for="(item, index) in firewallIpPluggingList"
                        :key="index + 'r'">
                      <td v-for="i in item"
                          :key="i">{{ i }}</td>
                    </tr>
                  </table>
                  <el-empty v-else
                            description="数据为空" />
                </dd>
              </dl>

            </dd>
          </dl>

        </el-tab-pane>
      </el-tabs>
    </dp>

  </div>
</template>
<style lang="scss" scoped>
.form-container {
	padding: 10px;
}
</style>