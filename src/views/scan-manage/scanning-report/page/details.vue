<template>
	<div>
		<dp @back="backIndex">
			<div class="table-container">
				<h1 style="font-weight: 700; font-size: 18px; color: rgb(29, 33, 41)">漏洞信息</h1>
				<el-main style="line-height: 38px">
					<el-row v-for="item in rowAllList" :key="item.value">
						<el-col :span="2" style="color: rgb(78, 89, 105); font-size: 16px">{{ item.label }}</el-col>
						<el-col :span="20" style="color: rgb(39, 46, 59); font-size: 16px">{{ item.value }}</el-col>
					</el-row>
				</el-main>
			</div>
		</dp>
	</div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
// import * as api from './api';
let rowAllList = ref();
// let rowAllList = [
// 	{
// 		label: '漏洞名称',
// 		value: route.query.name,
// 	},
// 	{
// 		label: 'ip地址',
// 		value: route.query.target__ip,
// 	},
// 	{
// 		label: '漏洞描述',
// 		value: route.query.description,
// 	},
// 	{
// 		label: '发现日期',
// 		value: route.query.date_found,
// 	},
// 	{
// 		label: 'CEVID',
// 		value: route.query.cve_id,
// 	},
// 	{
// 		label: '扫描时间',
// 		value: route.query.time_start_scan,
// 	},
// 	{
// 		label: '修复建议',
// 		value: route.query.solution,
// 	},
// 	{
// 		label: '最近更新时间',
// 		value: route.query.update_datetime,
// 	},
// 	{
// 		label: '厂商和版本',
// 		value: route.query.device_firm_version,
// 	},
// 	{
// 		label: '数据来源',
// 		value: route.query.scanner_device,
// 	},
// ];

const landing = () => {
	rowAllList.value = [
		{
			label: '漏洞名称',
			value: route.query.name,
		},
		{
			label: 'ip地址',
			value: route.query.target__ip,
		},
		{
			label: '漏洞描述',
			value: route.query.description,
		},
		{
			label: '发现日期',
			value: route.query.date_found,
		},
		{
			label: 'CEVID',
			value: route.query.cve_id,
		},
		{
			label: '扫描时间',
			value: route.query.time_start_scan,
		},
		{
			label: '修复建议',
			value: route.query.solution,
		},
		{
			label: '更新时间',
			value: route.query.update_datetime,
		},
		{
			label: '厂商和版本',
			value: route.query.device_firm_version,
		},
		{
			label: '数据来源',
			value: route.query.scanner_device,
		},
	];
};
landing();
const backIndex = () => {
	router.go(-1);
	// router.push({ path: `${route.query.url}`, query: {} });
};
</script>

<style scoped lang="scss">
.table-container {
	width: 100%;
	background: #ffffff;
	padding: 10px;
	padding: 50px;
	.button-box {
		display: flex;
		justify-content: end;
		margin-bottom: 10px;
	}
}
</style>