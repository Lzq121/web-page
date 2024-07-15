<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import api from './api';
import { reactive } from 'vue';
const columns = [
	{
		title: '任务名称',
		dataIndex: 'task_name',
	},
	{
		title: '任务类型',
		dataIndex: 'task_type$',
	},
	// {
	//   title: '任务描述',
	//   dataIndex: 'task_desc',
	// },
	{
		title: '数据来源',
		dataIndex: 'task_source',
	},
	{
		title: '是否启动',
		dataIndex: 'is_start$',
		isTagClick: true,
	},
	{
		title: '任务状态',
		dataIndex: 'task_status$',

		isTag: true,
	},
	{
		title: '创建人',
		dataIndex: 'creator_name',
	},
	{
		title: '创建时间',
		dataIndex: 'assert_time',
	},
	{
		title: '生效时间',
		dataIndex: 'assert_time',
	},
	{
		title: '失效时间',
		dataIndex: 'over_time',
	},
	{
		title: '执行间隔(时)',
		dataIndex: 'active_time',
	},

	{
		title: '操作',
		dataIndex: 'operate',

		width: 250,
	},
];
const columnsResult = [
	{
		title: '执行方式',
		dataIndex: 'execution_type',
	},
	{
		title: '数据来源',
		dataIndex: 'task_source',
	},
	{
		title: '执行状态',
		dataIndex: 'task_result',
	},
	{
		title: '结果详情',
		dataIndex: 'result_desc',
	},
	{
		title: '成功数量',
		dataIndex: 'successes_num',
	},
	{
		title: '失败数量',
		dataIndex: 'fail_num',
	},
	{
		title: '任务开始时间',
		dataIndex: 'task_start',
	},
	{
		title: '任务结束时间',
		dataIndex: 'task_end',
	},
];

let list = ref([]);
// let rawDataListPage: number = 1;
// let rawDataListSize: number = 10;
let total = ref<number>(0);

let listResult = ref([]);
// let rawDataListPage: number = 1;
// let rawDataListSize: number = 10;
let totalResult = ref<number>(0);
let params = ref({
	page: 1,
	limit: 30,
	task_source: '',
	task_type: '',
	task_status: '',
});
let paramsResult = ref({
	page: 1,
	limit: 30,
	task_source: '',
	task_type: '',
	task_status: '',
	task_id: '',
});
let dataSourceList = ref([]);
let dataTypeList = ref([]);
const getList = async () => {
	let { data } = await api.getList();
	dataSourceList.value = data.data_source;
	dataTypeList.value = data.data_type;
};
getList();
let gatherList = ref([]);
const getGatherList = async () => {
	let { data } = await api.getGatherList();
	gatherList.value = data.data_source;
};
getGatherList();
let modelList = ref([]);
let checkModelList = ref([]);
const getModelOptions = async () => {
	let { data } = await api.getModelOptions({
		page: 1,
		limit: 99999,
	});
	modelList.value = data;
	checkModelList.value = data.map((item: any) => {
		return item.id;
	});
};
getModelOptions();

const fetchTableData = async () => {
	let res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
	if (Array.isArray(list.value)) {
		list.value.forEach((item: any) => {
			item.is_start$ = item.is_start ? { code: 1, value: '启动中' } : { code: 3, value: '已关闭' };
			switch (item.task_type) {
				case '0':
					item.task_type$ = 'cmdb采集任务';
					break;
				case '1':
					item.task_type$ = 'edr采集任务';
					break;
				case '2':
					item.task_type$ = '合并任务';
					break;
				case '3':
					item.task_type$ = '普通循环任务';
					break;
				default:
					item.task_type$ = '未知';
					break;
			}
			switch (item.task_status) {
				case '0':
					item.task_status$ = { code: 3, value: '未执行' };
					break;
				case '1':
					item.task_status$ = { code: 2, value: '执行中' };
					break;
				case '2':
					item.task_status$ = { code: 1, value: '执行完成' };
					break;
			}
		});
	}
};

fetchTableData();

const onSearch = () => {
	params.value.page = 1;
	fetchTableData();
};
const reSearch = () => {
	params.value = {
		page: 1,
		limit: 30,
		task_source: '',
		task_type: '',
		task_status: '',
	};
	fetchTableData();
};
const handleSizeChange = (val: number) => {
	params.value.limit = val;
	params.value.page = 1;
	fetchTableData();
};
const handleCurrentChangeResult = (val: number) => {
	paramsResult.value.page = val;
	getResult();
};
const handleSizeChangeResult = (val: number) => {
	paramsResult.value.limit = val;
	paramsResult.value.page = 1;
	getResult();
};
const handleCurrentChange = (val: number) => {
	params.value.page = val;
};
let dialogVisible = ref(false);
let editRowData = ref({
	id: null,
	task_name: '',
	task_type: '',
	task_source: '',
	assert_time: '',
	active_time: '',
	over_time: '',
	task_desc: '',
});
interface RuleForm {
	id: null | string;
	task_name: null | string;
	task_type: null | string;
	task_source: null | string;
	assert_time: null | string;
	active_time: null | string;
	over_time: null | string;
	task_desc: null | string;
}
const rules = ref<FormRules<RuleForm>>({
	task_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
	task_type: [{ required: true, message: '不能为空', trigger: 'blur' }],
	task_source: [{ required: true, message: '不能为空', trigger: 'blur' }],
	assert_time: [{ required: true, message: '不能为空', trigger: 'blur' }],
	over_time: [{ required: true, message: '不能为空', trigger: 'blur' }],
});

const editRow = async (val: any) => {
	api.GetObj(val.id).then((res: any) => {
		if (res.code == 2000) {
			editRowData.value = res.data;
			dialogVisible.value = true;
		}
	});
};
let dataInfoDialogVisible = ref(false);
let dataInfo = ref({});
let editRowResult = ref([]);

const viewRow = async (val: any) => {
	paramsResult.value.task_id = val.id;
	api.GetObj(val.id).then((res: any) => {
		if (res.code == 2000) {
			res.data.is_start = res.data.is_start ? '已启动' : '未启动';
			switch (res.data.task_type) {
				case '0':
					res.data.task_type = 'cmdb采集任务';
					break;
				case '1':
					res.data.task_type = 'edr采集任务';
					break;
				case '2':
					res.data.task_type = '合并任务';
					break;
				case '3':
					res.data.task_type = '普通循环任务';
					break;
				default:
					res.data.task_type = '未知';
					break;
			}
			switch (res.data.task_status) {
				case '0':
					res.data.task_status = '未执行';
					break;
				case '1':
					res.data.task_status = '执行中';
					break;
				case '2':
					res.data.task_status = '执行完成';
					break;
			}
			dataInfo.value = res.data;
			dataInfoDialogVisible.value = true;
		}
	});
	getResult();
};
const getResult = async () => {
	api.GetResultList(paramsResult.value).then((res: any) => {
		if (res.code == 2000) {
			editRowResult.value = res.data;
			totalResult.value = res.total;
		}
	});
};
const ruleFormRef = ref<FormInstance>();
const confirmEdit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			if (editRowData.value.id) {
				const res = await api.UpdateObj(editRowData.value);
				if (res.code === 2000) {
					ElMessage.success('编辑成功');
				}
			} else {
				const res = await api.AddObj(editRowData.value);
				if (res.code === 2000) {
					ElMessage.success('新增成功');
				}
			}
			fetchTableData();
			dialogVisible.value = false;
		}
	});
};

const delRow = (val: any) => {
	ElMessageBox.confirm('确认删除吗?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await api.DelObj(val.id);
			if (res.code === 2000) {
				ElMessage.success('删除成功');
				fetchTableData();
			}
		})
		.catch(() => {});
};
const executeImmediately = (val: any) => {
	ElMessageBox.confirm('确认立即执行该任务?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await api.executeImmediately(val.id);
			if (res.code === 2000) {
				ElMessage.success('操作成功');
				fetchTableData();
			}
		})
		.catch(() => {});
};

const disabledDate = (date: Date) => {
	return date.getTime() < Date.now() - 8.64e7;
};
let objUpdate = ref<any>({
	id: '',
	is_start: '',
});
const watchInfo = async (val: any) => {
	//
	objUpdate.value.id = val.id;
	if (val.is_start) {
		objUpdate.value.is_start = 0;
		ElMessageBox.confirm('是否关闭当前任务?', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				let res = await api.GetResultUpdate(objUpdate.value);

				if (res.code === 2000) {
					ElMessage.success('暂停成功');
					fetchTableData();
				}
			})
			.catch(() => {});
	} else {
		objUpdate.value.is_start = 1;
		ElMessageBox.confirm('是否启动当前任务?', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				let res = await api.GetResultUpdate(objUpdate.value);

				if (res.code === 2000) {
					ElMessage.success('启动成功');
					fetchTableData();
				}
			})
			.catch(() => {});
	}
};
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>任务管理</h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="onSearch"
                       icon="Search">搜 索</el-button>
            <el-button type="primary"
                       @click="reSearch"
                       plain
                       icon="RefreshRight">重 置</el-button>
            <el-button @click="
  										dialogVisible = true;
  										editRowData = {};
  									"
                       plain
                       icon="Plus">新 增</el-button>
          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="任务来源">
              <el-select v-model="params.task_source"
                         clearable>
                <el-option v-for="(item, index) in dataSourceList"
                           :key="index"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="任务类型">
              <el-select v-model="params.task_type"
                         clearable>
                <el-option v-for="(item, index) in dataTypeList"
                           :key="index"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="任务状态">
              <el-select v-model="params.task_status"
                         clearable>
                <el-option label="未执行"
                           value="0" />
                <el-option label="执行中"
                           value="1" />
                <el-option label="执行完成"
                           value="2" />
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
          <template v-slot="{record}">
            <el-button plain
                       size="small"
                       link
                       type="success"
                       @click="viewRow(record)">详情</el-button>
            <el-button plain
                       size="small"
                       link
                       type="primary"
                       @click="editRow(record)">编辑</el-button>
            <el-button plain
                       size="small"
                       link
                       type="danger"
                       @click="delRow(record)">删除</el-button>
            <el-button plain
                       size="small"
                       link
                       type="warning"
                       @click="executeImmediately(record)"
                       :disabled="record.task_status=='1' || !record.is_start">立即执行</el-button>
          </template>
        </table-unit>
      </div>
    </div>
    <el-drawer v-model="dataInfoDialogVisible"
               title="任务详情"
               size="70%">
      <dl class="dl-container-position">
        <dt>任务策略信息</dt>
        <dd>
          <table class="m_table">
            <tr>
              <td>任务名</td>
              <td>{{ dataInfo.task_name }}</td>
              <td>任务类型</td>
              <td>{{ dataInfo.task_type }}</td>
              <td>任务描述</td>
              <td>{{ dataInfo.task_desc }}</td>
            </tr>
            <tr>
              <td>数据来源</td>
              <td>{{ dataInfo.task_source }}</td>
              <td>是否启动</td>
              <td>{{ dataInfo.is_start }}</td>
              <td>任务状态</td>
              <td>{{ dataInfo.task_status }}</td>
            </tr>
            <tr>
              <td>管理员</td>
              <td>{{ dataInfo.task_admin }}</td>
              <td>生效时间</td>
              <td>{{ dataInfo.assert_time }}</td>
              <td>失效时间</td>
              <td>{{ dataInfo.over_time }}</td>
            </tr>
            <tr>
              <td>执行间隔</td>
              <td>{{ dataInfo.active_time }}</td>
            </tr>
          </table>
        </dd>
      </dl>
      <dl class="dl-container-position">
        <dt>任务执行结果信息</dt>
        <dd>
          <table-unit :currentPage="paramsResult.page"
                      :pageSize="paramsResult.limit"
                      :columns="columnsResult"
                      :list="editRowResult"
                      :total="totalResult"
                      @handleSizeChange="handleSizeChangeResult"
                      @handleCurrentChange="handleCurrentChangeResult">
          </table-unit>
        </dd>
      </dl>
      <template #footer> </template>
    </el-drawer>
    <el-dialog v-model="dialogVisible"
               title="任务新增/编辑"
               width="60%">
      <dl class="dl-container"
          style="box-shadow:none">
        <dt>任务执行流程</dt>
        <dd>
          <el-steps :active="3"
                    align-center>
            <el-step title="采集"
                     description="将结果入库到任务结果中" />
            <el-step title="整合"
                     description="将数据进行结果对应" />
            <el-step title="清洗"
                     description="将结果进行清洗入库" />
          </el-steps>
        </dd>
      </dl>
      <dl class="dl-container"
          style="box-shadow:none">
        <dt>采集</dt>
        <dd>
          <el-form :model="editRowData"
                   ref="ruleFormRef"
                   :rules="rules">
            <el-form-item label="任务名称"
                          prop="task_name">
              <el-input v-model="editRowData.task_name"></el-input>
            </el-form-item>
            <el-form-item label="数据来源"
                          prop="task_source">
              <el-select v-model="editRowData.task_source">

                <el-option v-for="(item, index) in gatherList"
                           :key="index"
                           :value="item"
                           :label="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据类型"
                          prop="task_type">
              <el-select v-model="editRowData.task_type">
                <el-option label="cmdb采集任务"
                           value="0" />
                <el-option label="edr采集任务"
                           value="1" />
                <el-option label="合并任务"
                           value="2" />
                <el-option label="普通循环任务"
                           value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="生效时间"
                          prop="assert_time">
              <el-date-picker :disabled-date="disabledDate"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              v-model="editRowData.assert_time"
                              type="datetime"
                              placeholder="请选择生效时间" />
            </el-form-item>
            <el-form-item label="失效时间"
                          prop="over_time">
              <el-date-picker :disabled-date="disabledDate"
                              value-format="YYYY-MM-DD HH:mm:ss"
                              v-model="editRowData.over_time"
                              type="datetime"
                              placeholder="请选择失效时间" />
            </el-form-item>
            <el-form-item label="执行间隔">
              <el-input type="number"
                        v-model="editRowData.active_time"
                        style="width:90%"></el-input>（小时）
              <p style="color: orange; font-size: 13px">执行间隔单位为小时，输入0立即执行该任务</p>
            </el-form-item>
            <el-form-item label="任务描述">
              <el-input v-model="editRowData.task_desc"
                        :autosize="{ minRows: 2, maxRows: 10 }"
                        type="textarea" />
            </el-form-item>
          </el-form>
        </dd>
      </dl>
      <div>
        <dl class="dl-container">
          <dt>整合</dt>
          <dd>
            <el-checkbox-group v-model="checkModelList">
              <el-checkbox disabled
                           :value="item.id"
                           v-for="(item,index) in modelList"
                           :key="index">{{item.models_alias}}</el-checkbox>
            </el-checkbox-group>
          </dd>
        </dl>
        <!-- <dl class="dl-container">
          <dt >清洗</dt>
          <dd>
            <el-checkbox v-for="(item,index) in 3" :key="index">清洗名</el-checkbox>
          </dd>
        </dl> -->
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="confirmEdit(ruleFormRef)"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
</style>
