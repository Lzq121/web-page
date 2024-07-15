<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AssetData from '@/views/asset-manage/asset-list/components/AssetData.vue';
import api from '../api';

let route = useRoute();
let router = useRouter();
let baseDataRules = ref({});
let drawerRight = ref(false);

let addAllList = ref([]);
let totalDia = ref(0);

let addList = ref({
	maintenance_start_time: '',
	maintenance_end_time: '',
	filter_dates: [],
	filter_time_period: '',
	filter_desc: '',
	host_ids: [],
});

const ipColumns = [
	{
		dataIndex: 'ip',
		title: 'IP地址',
	},
	{
		dataIndex: 'resource_type_display',
		title: '资产类型',
	},
	{
		dataIndex: 'host_manager_name',
		title: '主机负责人',
		width: 100,
	},
	{
		dataIndex: 'biz_display',
		title: '所属系统',
	},
	{
		dataIndex: 'os_version',
		title: '操作系统版本',
		width: 120,
	},
	{
		dataIndex: 'data_center',
		title: '数据中心',
	},
	{
		dataIndex: 'network_area',
		title: '部署区域',
	},

	{
		dataIndex: 'tags',
		title: '标签',
		width: 150,
	},

	{
		dataIndex: 'class_name_display',
		title: '资产大类',
		hidden: true,
	},
	{
		dataIndex: 'dept',
		title: '所属部门',
		hidden: true,
	},

	{
		dataIndex: 'os',
		title: '操作系统',
		hidden: true,
	},
	{
		dataIndex: 'app_admin_name',
		title: '应用管理员',
		hidden: true,
	},
	{
		dataIndex: 'middleware_admin',
		title: '中间件管理员',
		hidden: true,
	},
	{
		dataIndex: 'db_admin',
		title: '数据库管理员',
		hidden: true,
	},

	{
		dataIndex: 'room',
		title: '机房',
		hidden: true,
	},

	{
		dataIndex: 'safe_person',
		title: '安全接口人',
		hidden: true,
	},
];

const propsID = async () => {
	if (route.query.class == 'edit') {
		let { data } = await api.oneDetails(route.query.id);
		const value = {
			maintenance_start_time: data.data.maintenance_start_time,
			maintenance_end_time: data.data.maintenance_end_time,
			filter_dates: data.data.filter_dates,
			filter_time_period: data.data.filter_time_period,
			filter_desc: data.data.filter_desc,
		};
		addList.value = value;
		addAllList.value = data.host_data;
	} else {
		addList.value = {
			maintenance_start_time: '',
			maintenance_end_time: '',
			filter_dates: [],
			filter_time_period: '',
			filter_desc: '',
			host_ids: [],
		};
		addAllList.value = [];
	}
};
propsID();

let delArr = [];
// 删除资产列表
const handleSelectionChange1 = (val: any) => {
	delArr = val;
};
const delAllListFn = () => {
	let arr = addAllList.value.filter((v) => {
		return delArr.every((e) => e.id != v.id);
	});
	addAllList.value = arr;
};

let isLoadAssetDataCon = ref(false);
const addAssets = () => {
	isLoadAssetDataCon.value = true;
	drawerRight.value = true;
};

// 多选选择
let ipOrApp = '1';
let selectArr = [];
let addAlllistAfter = [];
const selectFun = async (val: any) => {
	addAlllistAfter = val.data;
	ipOrApp = val.type;
};
// 确认资产选择
const yesAssets = async () => {
	if (addAlllistAfter.length === 0) {
		ElMessage.warning('请选择资产');
		return;
	}
	if (ipOrApp == '1') {
		addAllList.value.push(...addAlllistAfter);
	} else {
		let idArr = addAlllistAfter.map((i: any) => {
			return i.id;
		});
		let { data } = await api.assetsGetBackBusinessList({ b_ids: idArr });
		addAllList.value.push(...data);
	}
	// 去重
	addAllList.value = addAllList.value.reduce((unique: any, item: any) => {
		return unique.some((i) => i.id === item.id) ? unique : [...unique, item];
	}, []);
	drawerRight.value = false;
};

// 确认
const okFn = async () => {
	let arr = [];
	addAllList.value.forEach((item) => {
		arr.push(item.id);
	});

	addList.value.host_ids = arr;

	if (
		addList.value.maintenance_start_time == '' &&
		addList.value.maintenance_end_time == '' &&
		addList.value.filter_dates.length == 0 &&
		addList.value.filter_time_period == '' &&
		addList.value.filter_desc == '' &&
		addList.value.host_ids.length == 0
	) {
		ElMessage.error('请填写所有选项');
	} else {
		if (route.query.class == 'edit') {
			let res = await api.UpdateObj(route.query.id, addList.value);
			if (res.code == 2000) {
				ElMessageBox.confirm('编辑成功，是否返回列表页?', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'success',
				})
					.then(() => {
						router.push('/asset-manage/base-info/filter-ip');
					})
					.catch(() => {});
			}
		} else {
			let res = await api.AddObj(addList.value);
			if (res.code == 2000) {
				ElMessageBox.confirm('添加成功，是否返回列表页?', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'success',
				})
					.then(() => {
						router.push('/asset-manage/base-info/filter-ip');
					})
					.catch(() => {});
			}
		}
	}
};
const backIndex = () => {
	router.go(-1);
};
</script>


<template>
  <div>
    <dp title="新增/编辑资产"
        @back="backIndex">
      <template #right>
        <el-button type="primary"
                   @click="okFn">确认 提交</el-button>
      </template>
      <dl class="dl-container-position">
        <dt>过滤信息</dt>
        <dd class="dl-content">
          <el-form label-width="120px"
                   :model="addList"
                   :rules="baseDataRules">
            <el-form-item label="执行周期"
                          style="width: 70%">
              <el-date-picker v-model="addList.maintenance_start_time"
                              value-format="YYYY-MM-DD"
                              type="date"
                              placeholder="开始时间"
                              style="margin-right: 10px" />
              -
              <el-date-picker v-model="addList.maintenance_end_time"
                              value-format="YYYY-MM-DD"
                              type="date"
                              placeholder="结束时间"
                              style="margin-left: 10px" />
            </el-form-item>
            <el-form-item label="过滤日期">
              <el-checkbox-group v-model="addList.filter_dates">
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
              <el-radio-group v-model="addList.filter_time_period"
                              class="ml-4">
                <el-radio value="00-24"
                          size="large">全天（24小时）</el-radio>
                <el-radio value="08-20"
                          size="large">工作时间（每日 08时 - 20时）</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="过滤原因"
                          style="width: 50%">
              <el-input v-model="addList.filter_desc"
                        type="textarea" />
            </el-form-item>
          </el-form>
        </dd>
      </dl>
      <dl class="dl-container-position">
        <dt>资产信息</dt>
        <dd>
          <div style="text-align:right;padding:0px 20px 20px 0">
            <el-button type="danger"
                       @click="delAllListFn">删除资产</el-button>
            <el-button type="primary"
                       @click="addAssets">新增资产</el-button>
          </div>
          <table-unit :isSelection="true"
                      :isShowPatination="false"
                      @handleSelectionChange="handleSelectionChange1"
                      :columns="ipColumns"
                      :list="addAllList">
          </table-unit>
        </dd>

      </dl>
    </dp>
    <el-drawer v-model="drawerRight"
               title="资产选择"
               size="80%">
      <AssetData @selectFun="selectFun"
                 v-if="isLoadAssetDataCon"></AssetData>
      <div style="text-align:right;padding:30px 30px 0;">
        <el-button type="success"
                   style="width:20%"
                   @click="yesAssets">确认选择资产</el-button>
      </div>
    </el-drawer>
  </div>
</template>


<style lang="scss" scoped>
</style>