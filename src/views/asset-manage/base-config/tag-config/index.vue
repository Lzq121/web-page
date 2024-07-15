<script setup lang="ts" >
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from './api';
const columns = [
	{
		title: '标签名称',
		dataIndex: 'name',
	},
	{
		title: '脚本名称',
		dataIndex: 'func_name',
	},
	{
		title: '数据模型',
		dataIndex: 'class_name',
	},
	{
		title: '启用状态',
		dataIndex: 'is_start$',
		isTagClick: true,
	},
	{
		title: '描述',
		dataIndex: 'desc',
	},
	{
		title: '操作',
		dataIndex: 'operate',
	},
];
let list = ref([]);
let params = ref({
	page: 1,
	limit: 30,
	is_start: null,
	name: '',
});
let total = ref(0);
const fetchTableData = async () => {
	const res = await api.GetList(params.value);

	res.data.forEach((item: any) => {
		item.is_start$ = item.is_start ? { code: 1, value: '启动中' } : { code: 3, value: '已关闭' };
	});
	list.value = res.data;
	total.value = res.total;
};
fetchTableData();

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
		is_start: null,
		name: '',
	};
	fetchTableData();
};

// 1启动 0关闭
const watchInfo = async (val: any) => {
	if (val.is_start) {
		ElMessageBox.confirm('是否关闭当前标签任务?', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				let res = await api.updateList(val.id, { is_start: 0 });
				if (res.code === 2000) {
					ElMessage.success('暂停成功');
					fetchTableData();
				}
			})
			.catch(() => {});
	} else {
		ElMessageBox.confirm('是否启动当前标签任务?', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				let res = await api.updateList(val.id, { is_start: 1 });

				if (res.code === 2000) {
					ElMessage.success('启动成功');
					fetchTableData();
				}
			})
			.catch(() => {});
	}
};

let drawerOpen: any = ref(false);
let detailObj: any = ref({});
const viewRow = async (val: any) => {
	const { data, code } = await api.getListDetail(val.id);
	data.isStart = data.is_start ? '启动中' : '已关闭';
	if (code == 2000) {
		drawerOpen.value = true;
		detailObj.value = data;
	}
};
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>标签管理</h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="onSearch"
                       icon="Search">搜 索</el-button>
            <el-button type="primary"
                       @click="reSearch"
                       plain
                       icon="RefreshRight">重 置</el-button>
            <!-- <el-button @click="dialogVisible=true;editRowData={}" icon="Plus">新 增</el-button> -->
          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="标签名称">
              <el-input v-model="params.name"
                        clearable />
            </el-form-item>

            <el-form-item label="启用状态">
              <el-select v-model="params.is_start"
                         style="width: 240px"
                         clearable>
                <el-option label="启用"
                           :value="1" />
                <el-option label="关闭"
                           :value="0" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit @changeFun="watchInfo"
                    :currentPage="params.page"
                    :pageSize="params.limit"
                    :columns="columns"
                    :list="list"
                    :total="total"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button size="small"
                       link
                       type="primary"
                       @click="viewRow(record.record)">详情</el-button>
          </template>
        </table-unit>
      </div>
    </div>

    <el-drawer v-model="drawerOpen"
               size="25%"
               title="详情">
      <div>
        <dl class="dl-container"
            style="padding: 10px 30px; box-shadow: none">
          <dd class="dl-content">标签名称：{{ detailObj.name }}</dd>
          <dd class="dl-content">脚本名称：{{ detailObj.func_name }}</dd>
          <dd class="dl-content">数据模型：{{ detailObj.class_name }}</dd>
          <dd class="dl-content">
            启动状态：
            <el-tag type="success"
                    v-if="detailObj.is_start == '1'"> 启动中 </el-tag>
            <el-tag type="danger"
                    v-else> 已关闭 </el-tag>
          </dd>
          <dd class="dl-content">字段名称：{{ detailObj.field_name }}</dd>
          <dd class="dl-content">调用次数：{{ detailObj.invoke_num }}</dd>
          <dd class="dl-content">采纳次数：{{ detailObj.adopt_num }}</dd>
          <dd class="dl-content">创建时间：{{ detailObj.inbound_time }}</dd>
          <dd class="dl-content">创建人：{{ detailObj.creator || '-' }}</dd>
          <dd class="dl-content">描述：{{ detailObj.desc }}</dd>
        </dl>
      </div>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped></style>
