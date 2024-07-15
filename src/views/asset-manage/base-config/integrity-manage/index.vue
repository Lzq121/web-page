<script setup lang="ts" >
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from './api';

let list: any = ref([]);
let params = ref({
	page: 1,
	limit: 9999,
});
let total = ref(0);
const fetchTableData = async () => {
	const res = await api.GetList(params.value);
	total.value = res.total;
	list.value = res.data;
};
fetchTableData();
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

// 权重按钮事件
const weightChange = async (val: any) => {
	console.log('weightChange', val);
};

// 是否启用事件
const useChange = async (val: any) => {
	console.log('useChange', val);
};

// 分值选择事件
const scoreChange = async (val: any) => {
	console.log('scoreChange', val);
};
const updateObj = ref({
	field_id: '',
	fiedld_status: '',
});
// 1启动 0关闭
const changeStatus = async (val: any) => {
	updateObj.value.field_id = val.field_id;
	if (val.fiedld_status == '1') {
		updateObj.value.fiedld_status = '0';
		ElMessageBox.confirm('是否关闭当前任务?', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				let res = await api.UpdateApi(updateObj.value);
				if (res.code === 2000) {
					ElMessage.success('暂停成功');
					fetchTableData();
				}
			})
			.catch(() => {});
	} else {
		updateObj.value.fiedld_status = '1';
		ElMessageBox.confirm('是否启动当前任务?', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(async () => {
				let res = await api.UpdateApi(updateObj.value);
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
        <h1 style="padding: 20px 20px 0; font-size: 16px; font-weight: 600">完整度规则介绍</h1>
        <dl class="dl-container"
            style="margin-left: 40px; box-shadow: none">
          <dt>
            <span style="font-size: 14px">基本信息</span>
          </dt>
          <dd class="top-tips">1.每条资产数据根据缺失信息的字段，只做评级，不做评分，评级以状态或者便签的形式展现;</dd>
          <dd class="top-tips">2.资产信息的每个字段根据业务必要性，进行权重设置;</dd>
          <dd class="top-tips">
            3.基础信息中的网段信息、部署信息(数据中心)、组织架构信息可作为自动补全和校验信息的依据，在界面中给与提示，或者系统自动补全空缺;
          </dd>
          <dd class="top-tips">4.资产页面中，展示资产完整度百分比;</dd>
        </dl>
        <dl class="dl-container"
            style="margin-left: 40px; padding-top: 0px !important; box-shadow: none">
          <dt>
            <span style="font-size: 14px">数值计算规则</span>
          </dt>
          <dd class="top-tips">1.原则上，资产完整度百分比范围为0%~100%;</dd>
          <dd class="top-tips">2.每条资产完整度总分值不设置上限值，下限值为0;</dd>
          <dd class="top-tips">3.资产每条信息字段设置权重，权重分为5级:核心(5分)、重要(3分)、一般(2分)、其他(0分)、非必填(0分);</dd>
          <dd class="top-tips">4.判断规则:字段为不为空，则获得对应的权限分值，否则不得分;</dd>
          <dd class="top-tips">5.资产完整度总分值:总分值=字段1权重分值+字段2权重分值+…+字段N权重分值;</dd>
          <dd class="top-tips">6.资产完整度百分比:百分比(%)=得分值/总分值*100(%);</dd>
        </dl>
        <div class="form-title">
          <div>
            <!-- 搜索条件 -->
          </div>
          <div>
            <el-button type="primary"
                       @click="updateBtn">更新完整度</el-button>
          </div>
        </div>
      </div>
      <div class="table-box">
        <table class="m_table"
               style="text-align: center">
          <tr>
            <!-- <td>序号</td> -->
            <td>字段</td>
            <td>字段权重</td>
            <td>是否启用</td>
            <td>分值</td>
          </tr>
          <tr v-for="(item, index) in list"
              :key="index">
            <!-- <td>{{ index }}</td> -->
            <td>{{ item.field_name }}</td>
            <td>
              {{ item.weight }}
              <!-- <el-radio-group v-model="item.weightValue" @change="weightChange(item)">
								<el-radio value="1">核心</el-radio>
								<el-radio value="2">一般</el-radio>
								<el-radio value="3">非必填</el-radio>
							</el-radio-group> -->
            </td>
            <td>
              <el-tag type="success"
                      v-if="item.fiedld_status == '1'"
                      style="cursor: pointer"
                      @click="changeStatus(item)"> 启动中 </el-tag>
              <el-tag type="danger"
                      v-else
                      style="cursor: pointer"
                      @click="changeStatus(item)"> 已关闭 </el-tag>

              <!-- <el-switch v-model="item.isStart"  @change="useChange(item)" /> -->
            </td>

            <td>
              {{ item.completion_degree_score }} 分
              <!-- <el-select v-model="item.score" placeholder="Select" style="width: 100px" @change="scoreChange(item)" >
								<el-option v-for="item in seventOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select> -->
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dl-container {
	margin-top: 0 !important;
}
.dl-container dd {
	padding: 0 !important;
}
.top-tips {
	margin-left: 20px;
}
</style>
