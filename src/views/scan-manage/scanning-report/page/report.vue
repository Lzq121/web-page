<template>
	<div>
		<div class="table-container" style="background: #ffffff; height: 100%"></div>
	</div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter();
// import * as api from './api';

let isShow = ref(false);
let dialogVisible = ref(false);
let params = ref({
	scan_name: '',
	scan_ip: '',
	scan_idc: '',
});
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
let list = [{ scan_name: 'nihao', id: '1' }];
let total = ref(0);

// 搜索
const searchFn = () => {
	console.log('searchFn');
};
const editRow = (row: any) => {
	console.log('editRow');
	router.push('/scan-manage/scanning-task/details');
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
</script>

<style>
</style>