<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import * as api from './api';
import { departmentOption, regionOption, regionqy, statusAll } from './type';
//路由
const router = useRouter();
const columns = [
	{ title: '扫描器名称', dataIndex: 'scan_name' },
	{ title: '厂商', dataIndex: 'scan_firm' },
	{ title: '运行状态', dataIndex: 'scan_status$', isTag: true },
	{ title: '版本', dataIndex: 'scan_version' },
	{ title: '扫描器sn号', dataIndex: 'scan_sn' },
	{ title: '网络区域位置', dataIndex: 'network_area' },
	{ title: 'IP', dataIndex: 'scan_ip' },
	{ title: '数据中心', dataIndex: 'data_center' },
	{ title: '机房', dataIndex: 'room' },
	{ title: '是否可用', dataIndex: 'is_use$', isTag: true },
	{ title: '操作', dataIndex: 'operate', width: 200 },
];
let scanForm = ref({
	scan_name: '',
	scan_id: '',
	scan_sn: '',
	scan_firm: '',
	scan_v: '',
	scan_ip: '',
	scan_area: '',
	scan_status: '',
	desc: '',
	scan_idc: '',
	motor_room: '',
	is_use: '',
	id: undefined,
});
let list = ref([]);

let params = ref({
	page: 1,
	limit: 30,
	cip_name: '',
	is_use: null,
	cip_type: '',
	data_center: '',
});
let dialogVisible = ref(false);
let total = ref(0);
let isShowMoreSearch = ref(false);
const getTableData = async () => {
	const res = await api.GetList(params.value);
	list.value = res.data;
	// changeReflection(list, statusAll, 'scan_status', 'value');
	list.value.map((item: any) => {
		statusAll.forEach((i) => {
			item.scan_status == i.value ? (item.scan_status = i.label) : i.value;
		});
		regionqy.forEach((i) => {
			item.network_area == i.value ? (item.network_area = i.label) : i.value;
		});
		regionOption.forEach((i) => {
			item.room == i.value ? (item.room = i.label) : i.value;
		});
		departmentOption.forEach((i) => {
			item.data_center == i.value ? (item.data_center = i.label) : i.value;
		});
	});

	list.value.forEach((item: any) => {
		switch (true) {
			case item.scan_status == '已停用':
				item.scan_status$ = { code: 3, value: '停用' };
				break;
			case item.scan_status == '空闲':
				item.scan_status$ = { code: 1, value: '空闲' };
				break;
			case item.scan_status == '正在执行':
				item.scan_status$ = { code: 2, value: '正在执行' };
				break;
			case item.scan_status == '故障':
				item.scan_status$ = { code: 3, value: '故障' };
				break;
			case item.scan_status == '暂停':
				item.scan_status$ = { code: 4, value: '暂停' };
				break;
		}

		item.is_use$ = item.is_use ? { code: 1, value: '可用' } : { code: 3, value: '不可用' };
	});

	total.value = res.total;
};
const changeNum = (name: any, list: any) => {
	let str = '';
	list.forEach((item) => {
		if (item.label == name) {
			str = item.value;
		}
	});
	return str;
};
getTableData();
// 切换字典对象函数
const changeReflection = (list1: any, list2: any, fields: any, fields2?: any) => {
	list1.value.map((item: any) => {
		list2.forEach((i) => {
			item.fields == i.fields2 ? (item.scan_status = i.label) : i.value;
		});
	});
};
const handleSizeChange = (val: number) => {
	params.value.page = val;
	getTableData();
};
const handleCurrentChange = (val: number) => {
	params.value.limit = val;
	getTableData();
};
const onSearch = () => {
	params.value.page = 1;
	getTableData();
};
const reSearch = () => {
	params.value = {
		page: 1,
		limit: 30,
		cip_name: '',
		is_use: null,
		cip_type: '',
	};
	getTableData();
};
const editRow = async (val: any) => {
	const res = await api.GetObj(val.id);
	scanForm.value = res.data;
	dialogVisible.value = true;
};
// 停用启用按钮
const stopFn = async (val: any, num: any) => {
	ElMessageBox.confirm('是否确认修改吗', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		const { code } = await api.UpdateObj({ id: val.id, is_use: num, modifier: '吴彦祖' });
		getTableData();
	});
};
//任务计划跳转
const taskRow = (val: any) => {
	router.push({
		path: '/scan-manage/equipment-list/task-plan',
		query: val, // 通过params传递参数
	});
};
const delRow = async (val: any) => {
	ElMessageBox.confirm('确认删除吗', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		const res = await api.DelObj(val.id);
		if (res.code === 2000) {
			getTableData();
			ElMessage({
				type: 'success',
				message: res.msg,
			});
		}
	});
};
const confirmEdit = async () => {
	if (scanForm.value.scan_name == undefined && scanForm.value.scan_ip == undefined && scanForm.value.scan_firm == undefined) {
		ElNotification({
			title: '未填写必选项',
			message: '请确认"扫描器名称","IP","厂商"是否填写',
			type: 'warning',
		});
		return;
	}
	console.log(scanForm.value.scan_name, scanForm.value.scan_ip, scanForm.value.scan_firm);

	if (scanForm.value.id) {
		const res = await api.UpdateObj(scanForm.value);
		if (res.code === 2000) {
			ElMessage({
				message: res.msg,
				type: 'success',
			});
			getTableData();
			dialogVisible.value = false;
		}
	} else {
		const res = await api.AddObj(scanForm.value);
		if (res.code === 2000) {
			ElMessage({
				message: res.msg,
				type: 'success',
			});
			getTableData();
			dialogVisible.value = false;
		}
	}
};
</script>
<template>
	<div>
		<div class="table-container">
			<div class="form-container">
				<div class="form-title">
					<h3>扫描器管理</h3>
					<div class="button-box">
						<el-button
							link
							type="primary"
							@click="
								dialogVisible = true;
								scanForm = {};
							"
							icon="CirclePlus"
							>新 增</el-button
						>
						<el-button type="primary" @click="onSearch" icon="Search">搜 索</el-button>
						<el-button @click="reSearch" plain icon="RefreshRight">重 置</el-button>
					</div>
				</div>
				<div class="form-params" :style="isShowMoreSearch ? 'height:120px' : 'height:60px'">
					<div class="more-filter-btn">
						<el-button link type="primary" @click="isShowMoreSearch = !isShowMoreSearch" :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
							{{ isShowMoreSearch ? '收起' : '展开' }}
						</el-button>
					</div>
					<el-form :inline="true" :model="params" label-width="120px" class="form">
						<el-form-item label="扫描器名称">
							<el-input v-model="params.scan_name" clearable />
						</el-form-item>
						<el-form-item label="IP">
							<el-input v-model="params.scan_ip" clearable />
						</el-form-item>
						<el-form-item label="数据中心">
							<el-select v-model="params.data_center">
								<el-option :label="item.label" :value="item.value" v-for="item in departmentOption" :key="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item label="厂商">
							<el-select v-model="params.scan_firm">
								<el-option label="长亭" value="长亭" />
								<el-option label="启明" value="启明" />
								<el-option label="绿盟" value="绿盟" />
							</el-select>
						</el-form-item>
						<el-form-item label="是否启用">
							<el-select v-model="params.is_use">
								<el-option label="启用" :value="true" />
								<el-option label="未启用" :value="false" />
							</el-select>
						</el-form-item>
						<el-form-item label="状态">
							<el-select v-model="params.scan_status">
								<el-option label="空闲" value="空闲" />
								<el-option label="已停用" value="已停用" />
								<el-option label="正在执行" value="正在执行" />
								<el-option label="故障" value="故障" />
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="table-box">
				<table-unit :columns="columns" :list="list" :total="total" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
					<template v-slot="record">
						<el-button link size="small" v-if="record.record.is_use == true" type="danger" @click="stopFn(record.record, 0)">停用</el-button>
						<el-button link size="small" v-if="record.record.is_use == false" type="success" @click="stopFn(record.record, 1)"> 启用 </el-button>
						<!-- <el-button link size="small" v-if="record.record.scan_status == '正在执行'" type="primary" @click="stopFn(record.record, 5)">
							暂停
						</el-button> -->
						<el-button link size="small" type="primary" @click="editRow(record.record)">编辑</el-button>
						<el-button link size="small" type="primary" @click="taskRow(record.record)">任务计划</el-button>
						<!-- <el-button link size="small" type="danger" @click="delRow(record.record)">删除</el-button> -->
					</template>
				</table-unit>
			</div>
		</div>
		<el-dialog v-model="dialogVisible" title="新增/编辑扫描器" width="50%">
			<el-form :model="scanForm" label-width="100px">
				<el-form-item label="扫描器名称">
					<el-input v-model="scanForm.scan_name" />
				</el-form-item>
				<!-- <el-form-item label="扫描器ID">
          <el-input v-model="scanForm.scan_id" />
        </el-form-item> -->
				<el-form-item label="扫描器sn号">
					<el-input v-model="scanForm.scan_sn" />
				</el-form-item>
				<el-form-item label="版本">
					<el-input v-model="scanForm.scan_version" :disabled="true" />
				</el-form-item>
				<el-form-item label="IP">
					<el-input v-model="scanForm.scan_ip" />
				</el-form-item>
				<el-form-item label="机房">
					<el-select v-model="scanForm.room">
						<el-option :label="item.label" :value="item.value" v-for="item in regionOption" :key="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="数据中心">
					<el-select v-model="scanForm.data_center">
						<el-option :label="item.label" :value="item.value" v-for="item in departmentOption" :key="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="扫描器描述">
					<el-input v-model="scanForm.description" />
				</el-form-item>
				<el-form-item label="部署区域">
					<!-- <el-input v-model="scanForm.network_area" /> -->
					<el-select v-model="scanForm.network_area">
						<el-option :label="item.label" :value="item.value" v-for="item in regionqy" :key="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="厂商">
					<el-select v-model="scanForm.scan_firm">
						<el-option label="长亭" value="长亭" />
						<el-option label="启明" value="启明" />
						<el-option label="绿盟" value="绿盟" />
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="scanForm.scan_status" :disabled="true">
						<el-option label="空闲" :value="1" />
						<el-option label="已停用" :value="2" />
						<el-option label="正在执行" :value="3" />
						<el-option label="故障" :value="4" />
						<el-option label="暂停" :value="5" />
					</el-select>
				</el-form-item>
				<el-form-item label="是否可用">
					<el-select v-model="scanForm.is_use">
						<el-option label="可用" :value="true" />
						<el-option label="不可用" :value="false" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="confirmEdit"> 确 认 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<style lang='scss' scoped>
	.form {
		.el-input,
		.el-select {
			width: 200px;
		}
	}
</style>