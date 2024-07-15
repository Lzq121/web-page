<template>
  <div>
    <dp title="资产详情"
        desc=""
        @back="backIndex">
      <dl class="dl-container-position">
        <dt class="dl-title">过滤信息</dt>
        <dd class="dl-content">
          <el-form label-width="120px"
                   :model="objAll"
                   disabled
                   :rules="baseDataRules">
            <el-form-item label="执行周期"
                          style="width: 70%">
              <el-date-picker v-model="objAll.maintenance_start_time"
                              value-format="YYYY-MM-DD"
                              type="date"
                              placeholder="开始时间"
                              style="margin-right: 10px" />
              -
              <el-date-picker v-model="objAll.maintenance_end_time"
                              value-format="YYYY-MM-DD"
                              type="date"
                              placeholder="结束时间"
                              style="margin-left: 10px" />
            </el-form-item>
            <el-form-item label="过滤日期">
              <el-checkbox-group v-model="objAll.filter_dates">
                <el-checkbox label="周一"
                             value="1" />
                <el-checkbox label="周二"
                             value="2" />
                <el-checkbox label="周三"
                             value="3" />
                <el-checkbox label="周四"
                             value="4" />
                <el-checkbox label="周五"
                             value="5" />
                <el-checkbox label="周六"
                             value="6" />
                <el-checkbox label="周日"
                             value="0" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="过滤时段">
              <el-radio-group v-model="objAll.filter_time_period"
                              class="ml-4">
                <el-radio value="00-24"
                          size="large">全天（24小时）</el-radio>
                <el-radio value="08-20"
                          size="large">工作时间（每日 08时 - 20时）</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="过滤原因"
                          style="width: 50%">
              <el-input v-model="objAll.filter_desc"
                        type="textarea" />
            </el-form-item>
          </el-form>
        </dd>
      </dl>
      <dl class="dl-container-position">
        <dt class="dl-title">基础信息</dt>
        <dd class="dl-content information-content">
          <el-row v-for="item in messageList"
                  :key="item.children.value">
            <el-col :span="i.spanNum"
                    v-for="i in item.children"
                    :key="i.value">
              <label>{{ i.label }}:</label>
              <span class="dl-content-row-span"> {{ i.value }} </span>
            </el-col>
          </el-row>
        </dd>
      </dl>
    </dp>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
let route = useRoute();
let router = useRouter();
let messageList = ref();
let baseDataRules = ref();
let objAll = ref({
	maintenance_start_time: '',
});
const propsID = async () => {
	let { data } = await api.oneDetails(route.query.id);
	objAll.value = data.data;
	messageList.value = [
		{
			children: [
				{ label: '设备ID', value: data.data.id, spanNum: 8 },
				{ label: '设备名称', value: data.data.logical_name, spanNum: 8 },
				{ label: '设备IP', value: data.data.ip, spanNum: 8 },
			],
		},
		{
			children: [
				{ label: '资源大类', value: data.data.class_name_display, spanNum: 8 },
				{ label: '资源类型', value: data.data.resource_type_display, spanNum: 8 },
				{ label: '所属应用', value: data.data.biz_display, spanNum: 8 },
			],
		},
		{
			children: [
				{ label: '运行状态', value: data.data.status, spanNum: 8 },
				{ label: '所属公司', value: data.data.company, spanNum: 8 },
				{ label: '所属部门', value: data.data.dept, spanNum: 8 },
			],
		},
		{
			children: [
				{ label: '接口人', value: data.data.safe_person, spanNum: 8 },
				{ label: '接口人电话', value: data.data.tp_safe, spanNum: 8 },
				{ label: '接口人部门', value: data.data.dept_safe, spanNum: 8 },
			],
		},
		{
			children: [
				{ label: '对外内网IP', value: data.data.external_ip, spanNum: 8 },
				{ label: '对内内网IP', value: data.data.internal_ip, spanNum: 8 },
				{ label: '', value: '', spanNum: 8 },
			],
		},
		{
			children: [{ label: '描述信息', value: data.data.description, spanNum: 24 }],
		},
	];
};
propsID();
const backIndex = () => {
	router.go(-1);
};
</script>

<style lang="scss" scoped>
.information-content {
	line-height: 50px;
	padding: 0 40px 0 40px;
	label {
		display: inline-block;
		width: 11vh;
	}
}
</style>