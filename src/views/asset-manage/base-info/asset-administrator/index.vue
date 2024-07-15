<script setup lang='ts'>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node';
import importExcel from '@/components/importExcel/index.vue';
import { ResponseData, TreeItemType } from './types';
import XEUtils from 'xe-utils';
import api from './api';

const columns = [
	{ title: '账号', dataIndex: 'uname' },
	{ title: '姓名', dataIndex: 'name' },
	{ title: '电话', dataIndex: 'phone' },
	{ title: '邮件', dataIndex: 'email' },
	{ title: '所属处室', dataIndex: 'office_name' },
	{ title: "归属部门", dataIndex: "dept_name"},
  	{ title: "归属公司", dataIndex: "company_name"},
	{ title: '备注', dataIndex: 'remark' },
	{ title: '显示排序', dataIndex: 'sort' },
	{
		title: '操作',
		dataIndex: 'operate',
		width: 200,
	},
];
let list = ref([]);
let isShowMoreSearch = ref(false);
let params = ref({
	uname: '',
	name: '',
	phone: '',
	itsm_id: '',
	email: '',
	office: '',
	remark: '',
	page: 1,
	limit: 10,
});
let adminFormData: any = ref({
	id: '',
	uname: '',
	name: '',
	phone: '',
	itsm_id: '',
	email: '',
	office: '',
	remark: '',
	sort: '',
});
let total = ref(0);
let treeList = ref([]);
let showTotalNum = ref(false);
const getTreeList = async () => {
	let res: ResponseData = await api.getTreeList();
	if (res?.code === 2000 && Array.isArray(res.data)) {
		const result = XEUtils.toArrayTree(res.data, {
			parentKey: 'parent',
			children: 'children',
			//strict: true,
		});
		treeList.value = result;
	}
};

const defaultTreeProps: any = {
	children: 'children',
	value: 'id',
	label: 'name',
	isLeaf: (data: TreeItemType[], node: Node) => {
		if (node.data.hasChild) {
			return false;
		} else {
			return true;
		}
	},
};
/**
 * 所属处室的懒加载
 */
const handleLoadNode = (node: Node, resolve: Function) => {
	if (node.level !== 0) {
		lazyLoadDept({ parent: node.data.id }).then((res: ResponseData) => {
			resolve(res.data);
		});
	}
};
/**
 * 部门的点击事件
 */
const handleNodeClick = (data: any) => {
	adminFormData.value.office = data.id;
};

getTreeList();
const fetchTableData = async () => {
	const res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
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
	adminFormData.value = {
		id: '',
		uname: '',
		name: '',
		phone: '',
		itsm_id: '',
		email: '',
		office: '',
		remark: '',
		sort: '',
	};
	fetchTableData();
};
let editRowData = ref({
	target_model: '',
	cip_type: '',
	class_name: '',
	filed_name: '',
	cip_desc: '',
	is_use: null,
	id: null,
});
let dialogVisible = ref(false);
const editRow = async (val: any) => {
	getTreeList();
	api.GetObj(val.id).then((res: any) => {
		if (res.code == 2000) {
			adminFormData.value = res.data;
			dialogVisible.value = true;
		}
	});
};

const formRef = ref<FormInstance>();
const confirmEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			if (adminFormData.value.id) {
				const res = await api.UpdateObj(adminFormData.value);
				if (res.code === 2000) {
					ElMessage.success('编辑成功');
				}
			} else {
				const res = await api.AddObj(adminFormData.value);
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
const closed = () => {
	adminFormData.value = {
		id: '',
		uname: '',
		name: '',
		phone: '',
		itsm_id: '',
		email: '',
		office: '',
		remark: '',
		sort: '',
	};
};
// 导出
const excelExcel = async () => {
	ElMessageBox.prompt('自定义导出文件名', '提示', {
		confirmButtonText: '确认导出',
		cancelButtonText: '取消',
		inputPlaceholder: '请输入自定义文件名，无输入时使用默认文件名',
	})
		.then(({ value }) => {
			if (value) {
				value = value + '.xlsx';
			} else {
				value = undefined;
			}
			api.downloadFile();
		})
		.catch(() => {});
};
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>管理员台账</h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="dialogVisible = true;
								editRowData = {};"
                       link
                       icon="CirclePlus">新增</el-button>
            <el-button type="primary"
                       @click="excelExcel"
                       link
                       icon="Download">导出数据</el-button>
            <span>
              <importExcel :apiSuffix="false"
                           api="/api/assets/assets/admin_import/">导入数据</importExcel>
            </span>
            <el-button type="primary"
                       @click="onSearch"
                       icon="Search">搜 索</el-button>
            <el-button @click="reSearch"
                       plain
                       icon="RefreshRight">重 置</el-button>

          </div>
        </div>
        <div class="form-params"
             :style="isShowMoreSearch ? 'height:100%' : 'height:60px'">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="账号">
              <el-input v-model="params.uname"
                        clearable />
            </el-form-item>
            <el-form-item label="姓名"
                          prop="name">
              <el-input v-model="params.name"
                        clearable />
            </el-form-item>
            <el-form-item label="电话"
                          prop="phone">
              <el-input v-model="params.phone"
                        clearable />
            </el-form-item>
            <!-- <el-form-item label="item唯一ID" prop="itsm_id">
							<el-input v-model="params.itsm_id" clearable />
						</el-form-item> -->
            <el-form-item label="邮件"
                          prop="email">
              <el-input v-model="params.email"
                        clearable />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit :currentPage="params.page"
                    :pageSize="params.limit"
                    :columns="columns"
                    :list="list"
                    :total="total"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button plain
                       size="small"
                       link
                       type="primary"
                       @click="editRow(record.record)">编辑</el-button>
            <el-button plain
                       size="small"
                       link
                       type="danger"
                       @click="delRow(record.record)">删除</el-button>
          </template>
        </table-unit>
      </div>
    </div>
    <el-dialog v-model="dialogVisible"
               title="新增/编辑"
               width="50%"
               :append-to-body="true"
               @close="closed">
      <el-form :model="adminFormData"
               label-width="100px"
               ref="formRef">
        <el-form-item label="账号">
          <el-input v-model="adminFormData.uname"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="adminFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop="phone"
                      :rules="[
        {message: '请正确输入电话号码',pattern:/^(?:(?:\+|00)86)?1\d{10}$/ ,trigger:'blur'}]">
          <el-input v-model="adminFormData.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email"
                      :rules="[ { message: '请正确输入邮箱',trigger:'blur',pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ },
      ]">
          <el-input v-model="adminFormData.email" />
        </el-form-item>
        <el-form-item label="所属处室">
          <el-tree-select class="trees"
                          v-model="adminFormData.office"
                          :data="treeList"
                          :props="defaultTreeProps"
                          :load="handleLoadNode"
                          :indent="38"
                          highlight-current
                          :render-after-expand="false">
            <template #default="{ node, data }">
              <div :node="node"
                   :showLabelLine="false"
                   :indent="32"
                   @click="handleNodeClick(data)">
                <span v-if="data.status"
                      class="text-center font-black font-normal">
                  <SvgIcon name="iconfont icon-shouye"
                           color="var(--el-color-primary)" />&nbsp;{{ node.label }}
                  <span v-show="showTotalNum">（{{ data.dept_user_count }}人）</span>
                </span>
                <span v-else
                      color="var(--el-color-primary)">
                  <SvgIcon name="iconfont icon-shouye" />&nbsp;{{ node.label }}
                </span>
              </div>
            </template>
          </el-tree-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="adminFormData.remark"
                    :autosize="{ minRows: 2, maxRows: 10 }"
                    type="textarea" />
        </el-form-item>
        <el-form-item label="显示排序">
          <el-input v-model="adminFormData.sort" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="confirmEdit(formRef)"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang='scss' scoped>
</style>