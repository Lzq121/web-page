<template>
  <div style="display: flex">
    <el-aside width="20%"
              style="background: #ffffff; margin: 10px 0 10px 10px; padding: 10px">
      <el-input v-model="filterText"
                style="width: 100%"
                placeholder="搜索" />
      <div class="ipOrApp">
        <el-radio-group v-model="ipOrApp"
                        @change="IPAndAppChange">
          <el-radio-button label="IP视角"
                           value="one"
                           border />
          <el-radio-button label="应用系统"
                           value="two"
                           border />
        </el-radio-group>
      </div>
      <el-tree ref="treeRef"
               style="max-width: 600px"
               class="filter-tree"
               :data="TreeListLeft"
               :props="defaultProps"
               :filter-node-method="filterNode"
               @node-click="treeIdChange" />
    </el-aside>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>漏洞误报管理</h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="searchFn"
                       icon="Search">搜 索</el-button>
            <el-button type="primary"
                       @click="resetFn"
                       plain
                       icon="RefreshRight">重 置</el-button>
            <el-button type="success"
                       @click="
								dialogVisible = true;
								scanForm = {};
							"
                       icon="Plus">确 认</el-button>
            <el-button @click="isShow = !isShow"
                       :icon="isShow ? 'ArrowUpBold' : 'ArrowDownBold'">
              {{ isShow ? '收起' : '展开' }}
            </el-button>
          </div>
        </div>
        <!-- 筛选条件 -->
        <div class="form-params"
             :style="isShow ? 'height:63vh' : 'height:60px'">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="所属公司">
              <el-input v-model="params.scan_name"
                        clearable
                        style="width: 240px" />
            </el-form-item>
            <el-form-item label="数据中心">
              <el-select v-model="params.scan_firm"
                         style="width: 240px">
                <el-option label="长亭"
                           value="长亭" />
                <el-option label="启明"
                           value="启明" />
                <el-option label="绿盟"
                           value="绿盟" />
              </el-select>
            </el-form-item>
            <el-form-item label="部署区域">
              <el-select v-model="params.is_use"
                         style="width: 240px">
                <el-option label="启用"
                           :value="true" />
                <el-option label="未启用"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="关键字">
              <el-select v-model="params.is_use"
                         style="width: 240px">
                <el-option label="启用"
                           :value="true" />
                <el-option label="未启用"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="资产类型">
              <el-select v-model="params.is_use"
                         style="width: 240px">
                <el-option label="启用"
                           :value="true" />
                <el-option label="未启用"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="操作系统">
              <el-select v-model="params.is_use"
                         style="width: 240px">
                <el-option label="启用"
                           :value="true" />
                <el-option label="未启用"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="版本范围">
              <el-select v-model="params.is_use"
                         style="width: 240px">
                <el-option label="启用"
                           :value="true" />
                <el-option label="未启用"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="中间件">
              <el-select v-model="params.is_use"
                         style="width: 240px">
                <el-option label="启用"
                           :value="true" />
                <el-option label="未启用"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="版本范围">
              <el-select v-model="params.is_use"
                         style="width: 240px">
                <el-option label="启用"
                           :value="true" />
                <el-option label="未启用"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据库">
              <el-select v-model="params.is_use"
                         style="width: 240px">
                <el-option label="启用"
                           :value="true" />
                <el-option label="未启用"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="版本范围">
              <el-select v-model="params.is_use"
                         style="width: 240px">
                <el-option label="启用"
                           :value="true" />
                <el-option label="未启用"
                           :value="false" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <!-- table -->
        <div class="table-box">
          <table-unit :columns="columns"
                      :list="list"
                      :total="total"
                      :pageSize="params.limit"
                      @handleSizeChange="handleSizeChange"
                      @handleCurrentChange="handleCurrentChange">
            <template v-slot="record">
              <el-button size="small"
                         link
                         @click="editRow(record.record)">详情</el-button>
            </template>
          </table-unit>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue';
import { ElMessage, ElMessageBox, ElTree } from 'element-plus';
import { useRouter } from 'vue-router';
import {
	treeListLeftALLNO,
	regionqy,
	treeListLeftALL,
	Tree,
	AllList,
	TreeList,
	data3,
	defaultProps,
	departmentOption,
	appList,
	regionOption,
} from './type';
const router = useRouter();
// import * as api from './api';

let isShow = ref(false);
let dialogVisible = ref(false);
let ipOrApp = ref('one');
const TreeListLeft = ref();
const treeRef = ref<InstanceType<typeof ElTree>>();
let filterText = ref('');
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
watch(filterText, (val) => {
	treeRef.value!.filter(val);
});

const IPAndAppChange = (val?: any) => {
	if (val == 'one' || ipOrApp.value == 'one') {
		TreeListLeft.value = treeListLeftALL;
		TreeListLeft.value.map((item) => {
			if (item.children.length > 0) {
				item.children.map((item1) => {
					item1.children = [];
				});
			}
		});
	} else {
		TreeListLeft.value = treeListLeftALLNO;
	}
};
IPAndAppChange();

const searchFn = () => {
	console.log('searchFn');
};
const editRow = () => {
	console.log('editRow');
	router.push('/leak-manage/waring-list/assetsDetails');
};
const resetFn = () => {
	console.log('resetFn');
};
const handleSizeChange = (val: number) => {
	console.log('handleSizeChange');
};
const handleCurrentChange = (val: number) => {
	console.log('handleCurrentChange');
};
const filterNode = (value: string, data: Tree) => {
	if (!value) return true;
	return data.label.includes(value);
};
</script>

<style scoped lang="scss">
:deep(.ipOrApp .el-radio-group) {
	width: 100%;
	display: flex;
	justify-content: center;
	margin: 5px;
}
</style>