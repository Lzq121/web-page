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
import { useRouter } from 'vue-router';
const router = useRouter();
// import * as api from './api';

let isShow = ref(false);
let columns = [
	{
		title: '漏洞ID',
		dataIndex: 'scan_name',
	},
	{
		title: '漏洞名称',
		dataIndex: 'scan_name1',
	},
	{
		title: '漏洞类型',
		dataIndex: 'scan_name',
	},
	{
		title: '受影响产品',
		dataIndex: 'scan_name',
	},
	{
		title: '严重程度',
		dataIndex: 'scan_name',
	},
	{
		title: '误报产品数',
		dataIndex: 'scan_name',
	},
	{
		title: '漏洞描述',
		dataIndex: 'scan_name',
	},
	{
		title: '操作',
		dataIndex: 'operate',

		width: 200,
	},
];
let rowAllList = [
	{
		label: '漏洞ID',
		value: '022112',
	},
	{
		label: '漏洞名称',
		value: '022112',
	},
	{
		label: '受影响产品',
		value: '022112',
	},
	{
		label: 'IP地址',
		value: '022112',
	},
	{
		label: '严重程度',
		value: '022112',
	},
	{
		label: '漏洞描述',
		value: 'Linux kernel是美国Linux基金会的开源操作系统Linux所使用的内核。',
	},
	{
		label: '漏洞ID',
		value: '022112',
	},
	{
		label: '漏洞名称',
		value: '022112',
	},
	{
		label: '受影响产品',
		value: '022112',
	},
	{
		label: 'IP地址',
		value: '022112',
	},
	{
		label: '严重程度',
		value: '022112',
	},
	{
		label: '漏洞描述',
		value: 'Linux kernel是美国Linux基金会的开源操作系统Linux所使用的内核。',
	},
	{
		label: '修复建议',
		value: '如果问题仍然存在，你还可以尝试在电脑上创建一个新的用户账户，以便临时使用计算机。',
	},
];
let list = [{ scan_name: 'nihao', id: '1' }];
let total = ref(0);

const addAssFn = () => {
	console.log('addAssFn');
	router.push('/leak-manage/waring-list/addAssets');
};
// 搜索
const searchFn = () => {
	console.log('searchFn');
};
const editRow = () => {
	console.log('editRow');
	router.push('/leak-manage/waring-list/assetsDetails');
};
// 重置
const resetFn = () => {
	console.log('resetFn');
};
const handleSizeChange = (val: number) => {
	console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
	console.log('handleCurrentChange');
};
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