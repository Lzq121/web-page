<script setup lang="ts" >
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from './api';
import { update } from 'lodash';

let list: any = ref([]);
let params = ref({
	page: 1,
	limit: 10,
	model_id: '60',
	rule_text: '近日更新',
});
let total = ref(0);
const fetchTableData = async () => {
	const res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
};
fetchTableData();

let paramsModel = ref({
	page: 1,
	limit: 9999,
	models_name: '',
	data_type: '',
	models_alias: '',
	models_purposes: '',
});
let modelList = ref([]);

const getModelList = async () => {
	const res = await api.getModelListApi(paramsModel.value);
	modelList.value = res.data;
};
getModelList();

// 手动执行更新全量任务
const updateBtn = async () => {
	const res = await api.upDateApi();
	if (res.code == 2000) {
		ElMessage({
			type: 'success',
			message: '执行成功',
		});
	}
};

const seventOptions = [
	{
		value: '0',
		label: '0分',
	},
	{
		value: '1',
		label: '1分',
	},
	{
		value: '2',
		label: '2分',
	},
	{
		value: '3',
		label: '3分',
	},
	{
		value: '4',
		label: '4分',
	},
	{
		value: '5',
		label: '5分',
	},
];

// 顶部切换按钮值
const topRadio: any = ref('1');
// 规则切换按钮
const ruleRadio: any = ref('2');

// 权重按钮事件
const weightChange = async (val: any) => {
	ElMessage({
		type: 'success',
		message: val.ziduan + '权重更改成功',
	});
	console.log('weightChange', val);
};
// 分值上限
const limitChange = async (val: any) => {
	console.log('limitChange', val);
};
// 7天
const seventChange = async (val: any) => {
	console.log('seventChange', val);
};
// 30天
const thirtyChange = async (val: any) => {
	console.log('thirtyChange', val);
};

// 7天
const sixtyChange = async (val: any) => {
	console.log('sixtyChange', val);
};
// 顶部类型切换
const typeChange = async (value?: any) => {
	fetchTableData();
};
// 规则切换
const ruleChange = async (value?: any) => {
	params.value.rule_text = ruleRadio.value == '1' ? '错误和冲突' : '近日更新';
	fetchTableData();
};

const activeNames = ref(['0']);
const activeChange = (val: string[]) => {
	console.log(val);
};
</script>
<template>
  <div>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <div class="button-box">
            <el-radio-group v-model="params.model_id"
                            @change="typeChange()">
              <el-radio-button size="small"
                               v-for="(item, index) in modelList"
                               :key="index"
                               :label="item.models_alias"
                               :value="item.id" />
            </el-radio-group>
          </div>
        </div>
        <div class="form-title">
          <div class="button-box">
            <el-radio-group v-model="ruleRadio"
                            @change="ruleChange()">
              <el-radio value="1">规则一：错误和冲突</el-radio>
              <el-radio value="2">规则二：近日更新</el-radio>
            </el-radio-group>
          </div>
          <div>
            <el-button type="primary"
                       @click="updateBtn">更新新鲜度</el-button>
          </div>
        </div>
      </div>
      <div class="table-box">
        <table class="m_table freshness-table"
               style="text-align: center"
               v-if="ruleRadio == '1'">
          <tr>
            <!-- <td>序号</td> -->
            <td>字段</td>
            <td>字段权重</td>
            <!-- <td style="width: 100px">分值上限</td> -->
            <td>错误扣分</td>
            <td>冲突扣分</td>
          </tr>
          <tr v-for="(item, index) in list"
              :key="index">
            <!-- <td>{{ item.index }}</td> -->
            <td>
              {{ item.field_name }}
            </td>
            <td>
              {{ item.weight }}
              <!-- <el-radio-group v-model="item.weightValue" @change="weightChange(item)">
								<el-radio value="1">核心</el-radio>
								<el-radio value="2">一般</el-radio>
								<el-radio value="3">非必填</el-radio>
							</el-radio-group> -->
            </td>

            <td>
              {{ item.error_score }} 分
              <!-- <el-select v-model="item.seventValue" placeholder="Select" @change="seventChange(item)">
								<el-option v-for="item in seventOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select> -->
            </td>
            <td>
              {{ item.conflict_score }} 分
              <!-- <el-select v-model="item.thirtyValue" placeholder="Select" @change="thirtyChange(item)">
								<el-option v-for="item in seventOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select> -->
            </td>
          </tr>
        </table>
        <table class="m_table freshness-table"
               style="text-align: center"
               v-else>
          <tr>
            <td>字段</td>
            <td>应用权重</td>
            <td>近7日未更新</td>
            <td>近30日未更新</td>
            <td>近60日未更新</td>
          </tr>
          <tr v-for="(item, index) in list"
              :key="index">
            <td>
              <!-- {{ item.field_name }} -->
              <el-collapse v-model="activeNames"
                           @change="activeChange"
                           class="active-content"
                           style="border: none">
                <el-collapse-item :title="item.fieldset_name"
                                  :name="index">
                  <div v-for="(field, findex) in item.field_list"
                       :key="findex">{{ field }}</div>
                </el-collapse-item>
              </el-collapse>
            </td>
            <td>
              {{ item.fieldset_weight }}
              <!-- <el-radio-group v-model="item.weightValue" @change="weightChange(item)">
								<el-radio value="1">核心</el-radio>
								<el-radio value="2">一般</el-radio>
								<el-radio value="3">非必填</el-radio>
							</el-radio-group> -->
            </td>

            <td>
              {{ item.first_score }} 分
              <!-- <el-select v-model="item.seventValue" placeholder="Select" @change="seventChange(item)">
								<el-option v-for="item in seventOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select> -->
            </td>
            <td>
              {{ item.second_score }} 分
              <!-- <el-select v-model="item.thirtyValue" placeholder="Select" @change="thirtyChange(item)">
								<el-option v-for="item in seventOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select> -->
            </td>
            <td>
              {{ item.third_score }} 分
              <!-- <el-select v-model="item.sixtyValue" placeholder="Select" @change="sixtyChange(item)">
								<el-option v-for="item in seventOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select> -->
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
.active-content .el-collapse-item__header {
	border-bottom: none !important;
}
.active-content .el-collapse-item__wrap {
	border-bottom: none !important;
}
.freshness-table .el-select {
	min-width: 100px !important;
}
</style>
