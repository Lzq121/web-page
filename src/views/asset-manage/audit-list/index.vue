<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>审核变更</h3>
          <div class="button-box">
            <el-button type="primary"
                       v-if="ipOrApp == 'one'"
                       icon="Search"
                       @click="searchList">搜索</el-button>
            <el-button type="primary"
                       v-else
                       @click="appSystem">搜索</el-button>
            <el-button @click="Reset"
                       icon="RefreshRight">重置</el-button>
          </div>
        </div>
        <div class="form-params">
          <el-form :inline="true"
                   :model="knownAPIListGetApiObj"
                   class="demo-form-inline">
            <el-form-item>
              <el-radio-group v-model="ipOrApp"
                              @change="IPAndAppChange">
                <el-radio-button label="IP视角"
                                 value="one"
                                 border />
                <el-radio-button label="应用系统"
                                 value="two"
                                 border />
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="ipOrApp == 'one' ? 'IP' : '系统名称'">
              <el-input v-show="ipOrApp == 'one'"
                        v-model="knownAPIListGetApiObj.ip"
                        placeholder="请输入关键字"
                        clearable />
              <el-input v-show="ipOrApp != 'one'"
                        v-model="knownAPIListGetApiObj.name"
                        placeholder="请输入关键字"
                        clearable />

            </el-form-item>
            <el-form-item label="所属部门">
              <el-select v-model="knownAPIListGetApiObj.dept"
                         placeholder="请选择所属部门"
                         style="width: 240px"
                         clearable>
                <el-option v-for="item in departmentOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="部署区域">
              <el-select v-model="knownAPIListGetApiObj.network_area"
                         placeholder="请选择部署区域"
                         style="width: 240px"
                         clearable>
                <el-option v-for="item in regionqy"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>

          </el-form>
        </div>
      </div>
      <div class="tree_table">
        <el-container>
          <el-aside style="margin-left:10px;background-color: var(--el-fill-color-blank);height:67vh;padding:10px"
                    :style="Telescopic ? 'display:none' : 'width:15%'">
            <el-input v-model="filterText"
                      placeholder="搜索" />
            <el-tree ref="treeRef"
                     class="filter-tree"
                     :data="TreeListLeft"
                     :props="defaultProps"
                     :filter-node-method="filterNode"
                     @node-click="treeIdChange" />
          </el-aside>
          <div style="cursor: pointer;display: flex;align-items: center;">
            <el-icon v-if="!Telescopic"
                     style="color: #606266"
                     @click="Telescopic = true">
              <ArrowLeftBold />
            </el-icon>
            <el-icon v-else
                     style="color: #606266">
              <ArrowRightBold @click="Telescopic = false" />
            </el-icon>
          </div>
          <div :style="Telescopic ?  'width:98%':'width:82%' ">
            <table-unit :columns="AllListref"
                        :list="tableData"
                        :total="total"
                        :isSelection="true"
                        :currentPage="knownAPIListGetApiObj.page"
                        :pageSize="knownAPIListGetApiObj.limit"
                        @handleSelectionChange="handleSelectionChange"
                        @handleSizeChange="handleSizeChange"
                        @handleCurrentChange="handleCurrentChange">
              <template v-slot="record">
                <el-button link
                           type="primary"
                           v-if="ipOrApp == 'one'"
                           size="small"
                           @click="detailDiaFn(record.record.id)"> 审核 </el-button>
                <el-button link
                           type="primary"
                           v-if="ipOrApp == 'one'"
                           size="small"
                           @click="toDetail(record.record)"> 详情
                </el-button>
                <el-button link
                           type="primary"
                           v-if="ipOrApp != 'one'"
                           size="small"
                           @click="detailDiaFn(record.record.id)"> 审核 </el-button>
                <el-button size="small"
                           v-if="ipOrApp != 'one'"
                           @click="toBusinessDetail(record.record)"
                           link>详情</el-button>
              </template>
            </table-unit>
          </div>
        </el-container>
      </div>
    </div>
    <el-dialog v-model="dialogTableVisible"
               title="字段列表"
               width="75%">
      <div class="dialog-footer"
           style="text-align: right; margin-bottom: 20px">
        <el-button plain
                   type="primary"
                   @click="agreeRowAll()">批量审核</el-button>
        <!-- <el-button plain type="danger" @click="refuseRowAll()"> 批量驳回 </el-button> -->
      </div>
      <el-table :data="recordList"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55" />
        <el-table-column prop="data_table"
                         label="表名称" />
        <el-table-column prop="link_value"
                         label="关联表值" />
        <el-table-column prop="change_field"
                         label="变更字段" />
        <!-- <el-table-column prop="change_old_value" label="变更前值" /> -->
        <!-- <el-table-column prop="change_new_value" label="变更后的值" /> -->
        <el-table-column prop="change_new_value"
                         label="变更值选择">
          <template #default="scope">
            <el-radio-group v-model="scope.row.chk_value"
                            class="ml-4">
              <el-tooltip class="box-item"
                          effect="dark"
                          content="当前值"
                          placement="top-start">
                <el-radio style="color: red"
                          value="change_old_value"
                          size="small">{{ scope.row.change_old_value
									}}</el-radio>
              </el-tooltip>
              <el-tooltip class="box-item"
                          effect="dark"
                          content="最新值"
                          placement="top-start">
                <el-radio value="change_new_value"
                          size="small">{{ scope.row.change_new_value }}</el-radio>
              </el-tooltip>
              <el-tooltip class="box-item"
                          effect="dark"
                          content="关联表当前值"
                          placement="top-start">
                <el-radio value="link_value"
                          size="small">{{ scope.row.link_value }}</el-radio>
              </el-tooltip>

              <!-- <el-radio value="2"  size="small">变更前的值</el-radio> -->

            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column prop="create_time"
                         label="生成时间" />
        <el-table-column prop="audit_time"
                         label="审核时间" />
        <el-table-column prop="auditor"
                         label="审核人" />
        <el-table-column prop="change_new_value"
                         label="操作"
                         width="200">
          <template #default="scope">
            <el-button plain
                       size="small"
                       type="primary"
                       @click="agreeRow(scope.row)">审核</el-button>
            <!-- <el-button plain size="small" type="danger" @click="refuseRow(scope.row)">驳回</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-model="dialogVisible"
               :title="tipsTitle"
               width="500">
      <span>{{ tipsValue }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="submitBtn"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue';
import { ElIcon, ElMessage, ElTree } from 'element-plus';
import { knownAPI } from './api';
import { useRouter } from 'vue-router';
const router = useRouter();

import { treeListLeftALLNO, regionqy, treeListLeftALL, Tree, AllList, data3, defaultProps, departmentOption, appList } from './type';

const treeRef = ref<InstanceType<typeof ElTree>>();

let submitObj: any = ref({
	id: '',
	chk_value: '',
});
const tipsTitle = ref('');
const tipsValue = ref('');
let recordList = ref([]);
let dialogVisible = ref(false);
let dialogTableVisible = ref(false);

let Telescopic = ref(false);
let ipOrApp = ref('one');
let filterText = ref('');

let total: number = 0;

let knownAPIListGetApiObj = ref({
	biz: '',
	tree_id: '',
	ip: '',
	resource_type: '',
	network_area: '',
	dept: '',
	data_center: '',
	limit: 30,
	page: 1,
	is_known: '2',
	name: '',
});

const appListAll: any = ref([]);

const TreeListLeft = ref();

const data2: any = ref(data3);
// const data2: TreeList[] = data3;
const tableData = ref([]);
const AllListref = ref(AllList);

watch(filterText, (val) => {
	treeRef.value!.filter(val);
});

let dataIdList: any = [];

const handleSelectionChange = (val: [any]) => {
	dataIdList = val;
	// .map((item) => {
	// 	if(item.chk_value == item.link_value){
	// 		return item.link_valu;
	// 	}else if(item.chk_value == item.change_new_value){
	// 		return item.change_new_value;
	// 	}
	// 	console.log('dataIdList',dataIdList)
	// });
};

const agreeRow = async (val: any) => {
	dialogVisible.value = true;
	tipsTitle.value = '同意';
	tipsValue.value = '是否同意当前审核？';
	// submitObj.value.audit_status = '2';
	submitObj.value.id = val.id;
	submitObj.value.chk_value = val.chk_value;
};
const refuseRow = async (val: any) => {
	dialogVisible.value = true;
	tipsTitle.value = '驳回';
	tipsValue.value = '是否驳回当前审核？';
	submitObj.value.audit_status = '1';
	submitObj.value.id = val.id.toString();
};
const sureListAll: any = ref([]);
const agreeRowAll = async (val?: any) => {
	sureListAll.value = [];
	dataIdList.map((item: any) => {
		sureListAll.value.push({
			id: item.id,
			chk_value: item.chk_value,
		});
	});

	const res = await knownAPI().auditRecordAllPutIDApi({ audit_data: sureListAll.value });
	if (res.code == 2000) {
		ElMessage({
			message: '提交成功',
			type: 'success',
		});
		knownAPIListGetApi();
		dialogTableVisible.value = false;
		dialogVisible.value = false;
	}

	// dialogTableVisible.value = true;
	// tipsTitle.value = '同意';
	// tipsValue.value = '是否同意当前审核？';
	// submitObj.value.audit_status = '2';
	// submitObj.value.id = val.id.toString();
};
const refuseRowAll = async (val?: any) => {
	let params = {
		id_list: dataIdList,
		audit_status: '1',
	};
	const res = await knownAPI().auditRecordAllPutIDApi(params);
	if (res.code == 2000) {
		ElMessage({
			message: '提交成功',
			type: 'success',
		});
		knownAPIListGetApi();
		dialogTableVisible.value = false;
		dialogVisible.value = false;
	}
};

const submitBtn = async (val: any) => {
	if (submitObj.value.chk_value) {
		const res = await knownAPI().auditRecordAllPutIDApi({ audit_data: [submitObj.value] });
		if (res.code == 2000) {
			ElMessage({
				message: '提交成功',
				type: 'success',
			});
			if (ipOrApp.value == 'one') {
				knownAPIListGetApi();
			} else {
				appSystem();
			}
			dialogTableVisible.value = false;
			dialogVisible.value = false;
		}
	} else {
		ElMessage({
			message: '资产台账不能为空',
			type: 'error',
		});
	}

	return;
	if (submitObj.value.audit_status == '2') {
		const res = await knownAPI().auditRecordPutIDApi(submitObj.value);
		if (res.code == 2000) {
			ElMessage({
				message: '提交成功',
				type: 'success',
			});
			if (ipOrApp.value == 'one') {
				knownAPIListGetApi();
			} else {
				appSystem();
			}
			dialogTableVisible.value = false;
			dialogVisible.value = false;
		}
	} else {
		const res = await knownAPI().auditRecordPutIDApi(submitObj.value);
		if (res.code == 2000) {
			ElMessage({
				message: '提交成功',
				type: 'success',
			});
			if (ipOrApp.value == 'one') {
				knownAPIListGetApi();
			} else {
				appSystem();
			}
			dialogTableVisible.value = false;
			dialogVisible.value = false;
		}
	}
};

// 数据处理
const appListDataFilter = () => {
	Object.entries(appList).forEach(([key, value], index) => {
		if (index == 0 || index == 1 || index == 2 || index == 3 || index == 4 || index == 5 || index == 6) {
			let obj = {
				dataIndex: '',
				title: '',
				hidden: true,
			};
			obj.dataIndex = key;
			obj.title = value;
			appListAll.value.push(obj);
		} else {
			let obj1 = {
				dataIndex: '',
				title: '',
				hidden: false,
			};
			obj1.dataIndex = key;
			obj1.title = value;
			appListAll.value.push(obj1);
		}
	});
};
appListDataFilter();
const filterNode = (value: string, data: Tree) => {
	if (!value) return true;
	return data.label.includes(value);
};

// 已知资产列表
const knownAPIListGetApi = async () => {
	data2.value = AllList;
	AllListref.value = AllList;
	let res = await knownAPI().knownListGetApi(knownAPIListGetApiObj.value);
	tableData.value = res.data;
	total = res.total;
};
// 应用系统列表
const appSystem = async () => {
	data2.value = appListAll.value;
	AllListref.value = [
		...appListAll.value,
		{
			title: '操作',
			dataIndex: 'operate',
			width: 150,
			fixed: 'right',
		},
	];
	// knownAPIListGetApiObj.value.is_know = '2';
	let res = await knownAPI().businessListgGetApi(knownAPIListGetApiObj.value);
	tableData.value = res.data;
	total = res.total;
};
// knownAPIListGetApi();
provide('knownAPIListGetApi', knownAPIListGetApi);
const detailDiaFn = async (id?: any) => {
	let obj = {
		audit_status: 0,
		data_id: id,
	};
	let res = await knownAPI().auditRecordGetApi(obj);
	recordList.value = res.data;

	dialogTableVisible.value = true;
};

const toDetail = (row: any) => {
	router.push({
		path: '/asset-manage/audit-list/page/audit-host-info',
		query: {
			id: row.id,
			url: '/asset-manage/audit-list',
			ip: row.ip,
			ipOrApp: ipOrApp.value,
			parentID: row.class_name,
			agentID: row.agent_id,
			addType: 'edit',
		},
	});
};
const toBusinessDetail = (row: any) => {
	router.push({
		path: '/asset-manage/audit-list/page/audit-business-info',
		query: {
			id: row.id,
			url: '/asset-manage/audit-list',
			ip: row.ip,
			ipOrApp: ipOrApp.value,
			parentID: row.biz_class,
			agentID: row.agent_id,
			name: row.name,
			addType: 'edit',
		},
	});
};

// 分页
const handleSizeChange = (val: any) => {
	knownAPIListGetApiObj.value.limit = val;
	knownAPIListGetApiObj.value.page = 1;
	if (ipOrApp.value == 'one') {
		knownAPIListGetApi();
	} else {
		appSystem();
	}
};
const handleCurrentChange = (val: any) => {
	knownAPIListGetApiObj.value.page = val;
	if (ipOrApp.value == 'one') {
		knownAPIListGetApi();
	} else {
		appSystem();
	}
};
// 搜索
const searchList = () => {
	knownAPIListGetApi();
};
const Reset = () => {
	knownAPIListGetApiObj.value.ip = '';
	knownAPIListGetApiObj.value.dept = '';
	knownAPIListGetApiObj.value.network_area = '';
	knownAPIListGetApiObj.value.name = '';
};
const treeIdChange = async (val: any) => {
	if (ipOrApp.value == 'one') {
		knownAPIListGetApiObj.value.tree_id = val.id;
		knownAPIListGetApi();
	} else {
		knownAPIListGetApiObj.value.tree_id = val.id;
		appSystem();
	}
};

// tree切换
const IPAndAppChange = (val?: any) => {
	if (val == 'one' || ipOrApp.value == 'one') {
		TreeListLeft.value = treeListLeftALL;
		knownAPIListGetApi();
		TreeListLeft.value.map((item: any) => {
			if (item.children.length > 0) {
				item.children.map((item1: any) => {
					item1.children = [];
				});
			}
		});
	} else {
		knownAPIListGetApiObj.value.biz = '';
		TreeListLeft.value = treeListLeftALLNO;
		appSystem();
	}
};
IPAndAppChange();
</script>

<style scoped lang="scss">
</style>
