<template>
  <div style="background: #ffffff; padding: 20px">
    <el-row style="height: 100%; display: flex; justify-content: space-between">
      <el-col :span="3">
        <h2 style="font-size: 18px; font-weight: 700">基础信息</h2>
      </el-col>
      <el-col :span="20"
              style="display: flex; justify-content: end">
        <template v-if="true">
          <el-col :span="4"
                  v-if="disabledBNO">
            <el-button type="primary"
                       @click="disabledEdit"
                       v-if="addType == 'edit' ? true : false"> 取消 </el-button>
            <el-button type="primary"
                       @click="addYes">确 认</el-button>
          </el-col>
        </template>
        <template v-if="is_knownSon == '2' || is_knownSon == '0'">
          <el-col :span="4"
                  v-if="is_knownSon == '2'">
            <el-button type="primary"
                       @click="storagePostIDApi">入库</el-button>
          </el-col>
        </template>
      </el-col>
    </el-row>
    <!-- 基础信息 -->
    <el-main style="line-height: 40px">
      <el-row>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one"> 设备ID: </span>
          </el-badge>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.id"
                      disabled
                      placeholder="-" />
          </span>
        </el-col>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one"
                  v-if="ipOrApp == 'one'">设备名称:</span>
            <span class="span_one"
                  v-else>系统名称:</span>
          </el-badge>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.logical_name"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one"
                  v-if="ipOrApp == 'one'">设备IP:</span>
            <span class="span_one"
                  v-else>URL:</span>
          </el-badge>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.ip"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one"
                  v-if="ipOrApp == 'one'">资产大类:</span>
            <span class="span_one"
                  v-else>应用大类:</span>
          </el-badge>
          <span>
            <!-- <el-input class="input_span" style="width: 70%; margin-left: 2%" v-model="addlist.class_name" :disabled="disabledB" /> -->
            <el-select value-key="value"
                       placeholder="-"
                       class="input_span"
                       style="width: 70%; margin-left: 2%"
                       v-model="addlist.class_name"
                       :disabled="disabledB"
                       @change="classIPappListFn">
              <el-option v-for="item in resourcesIPappList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" />
            </el-select>
          </span>
        </el-col>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one"
                  v-if="ipOrApp == 'one'">资产类型:</span>
            <span class="span_one"
                  v-else>应用类型:</span>
          </el-badge>
          <span>
            <!-- <el-input class="input_span" style="width: 70%; margin-left: 2%" v-model="addlist.resource_type" :disabled="disabledB" /> -->
            <el-select value-key="value"
                       placeholder="-"
                       class="input_span"
                       style="width: 70%; margin-left: 2%"
                       v-model="addlist.resource_type"
                       :disabled="disabledB">
              <el-option v-for="item in classIPappList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" />
            </el-select>
          </span>
        </el-col>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one"
                  v-if="ipOrApp == 'one'">所属应用:</span>
            <span class="span_one"
                  v-else>部署区域:</span>
          </el-badge>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.biz"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one"
                  v-if="ipOrApp == 'one'">运行状态:</span>
            <span class="span_one"
                  v-else>系统状态:</span>
          </el-badge>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.status"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one">所属公司:</span>
          </el-badge>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.company"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one">所属部门:</span>
          </el-badge>
          <span>
            <el-select value-key="value"
                       placeholder="-"
                       class="input_span"
                       style="width: 70%; margin-left: 2%"
                       v-model="addlist.dept"
                       :disabled="disabledB">
              <el-option v-for="item in departmentOption"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one">接口人:</span>
          </el-badge>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.safe_person"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">接口人电话:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.tp_safe"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">接口人部门:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.dept_safe"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
      <el-row v-if="ipOrApp == 'one'">
        <el-col :span="8">
          <span class="span_one">对外内网IP:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.external_ip"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">对外外网IP:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.internal_ip"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">主机名:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.hostname"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <span class="span_one">描述信息:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.description"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>

      <!-- <el-row>
				<el-col :span="8">
					<span>描述信息:</span>
					<span>111</span>
				</el-col>
			</el-row> -->
    </el-main>
    <!-- 部署信息 -->
    <el-row style="display: flex; justify-content: space-between"
            v-if="ipOrApp == 'one'">
      <el-col :span="3">
        <h2 style="font-size: 18px; font-weight: 700">部署信息</h2>
      </el-col>
      <!-- <el-col :span="4"><el-button type="primary">编辑资产信息</el-button></el-col> -->
    </el-row>
    <el-main style="line-height: 40px"
             v-if="ipOrApp == 'one'">
      <el-row>
        <el-col :span="8">
          <el-badge is-dot
                    class="item">
            <span class="span_one">数据中心:</span>
          </el-badge>
          <span>
            <el-select placeholder="-"
                       class="input_span"
                       style="width: 70%; margin-left: 2%"
                       v-model="addlist.data_center"
                       :disabled="disabledB">
              <el-option v-for="item in regionOption"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">机房:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.room"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">机柜:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.rock"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="span_one">起始U位:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.start_u"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">终止U位:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.end_u"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">U位数:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.unit_digit"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-badge is-dot
                    class="item"> <span class="span_one">部署区域:</span></el-badge>
          <span>
            <el-select value-key="value"
                       placeholder="-"
                       class="input_span"
                       style="width: 70%; margin-left: 2%"
                       v-model="addlist.network_area"
                       :disabled="disabledB">
              <el-option v-for="item in regionqy"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">设备用途:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.equipment_usage"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
    </el-main>
    <!-- 管理员信息 -->
    <el-row style="display: flex; justify-content: space-between">
      <el-col :span="3">
        <h2 style="font-size: 18px; font-weight: 700">管理员信息</h2>
      </el-col>
    </el-row>
    <el-main style="line-height: 40px"
             v-if="ipOrApp == 'one'">
      <el-row>
        <el-col :span="8">
          <span class="span_one">主机管理员:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.host_manager"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">备用管理员:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.bak_admin"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">应用管理员:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.app_admin"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="span_one">数据库管理员:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.db_admin"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">中间件管理员:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.middleware_admin"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">主机管理员邮箱:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.mail_of_main"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span class="span_one">主机管理员电话:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.tp_of_main"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">主机管理员部门:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.host_manager_dept"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
    </el-main>
    <!-- 应用系统————管理员信息 -->
    <el-main style="line-height: 40px"
             v-else>
      <el-row>
        <el-col :span="8">
          <span class="span_one">应用管理员:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.app_admin"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">数据库管理员:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.db_admin"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span class="span_one">中间件管理员:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.middleware_admin"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
    </el-main>

    <!-- 进程信息 -->
    <el-row style="display: flex; justify-content: space-between">
      <el-col :span="3"
              v-if="ipOrApp == 'one'">
        <h2 style="font-size: 18px; font-weight: 700">进程信息</h2>
      </el-col>
      <el-col :span="3"
              v-else>
        <h2 style="font-size: 18px; font-weight: 700">资产可信度</h2>
      </el-col>
      <!-- <el-col :span="4"><el-button type="primary">新增管理员</el-button></el-col> -->
    </el-row>
    <el-main style="line-height: 40px">
      <el-row>
        <el-col :span="8">
          <span v-if="ipOrApp == 'two'">资产可信度:</span>
          <el-badge is-dot
                    class="item1"
                    v-if="ipOrApp == 'one'">
            <span v-if="ipOrApp == 'one'">操作系统:</span>
          </el-badge>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.os"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8"
                v-if="ipOrApp == 'one'">
          <el-badge is-dot
                    class="item1">
            <span>系统版本:</span>
          </el-badge>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.os_version"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
    </el-main>
    <el-row style="display: flex; justify-content: space-between"
            v-if="ipOrApp == 'two'">
      <el-col :span="3">
        <h2 style="font-size: 18px; font-weight: 700">访问信息</h2>
      </el-col>
      <!-- <el-col :span="4"><el-button type="primary">新增访问信息</el-button></el-col> -->
    </el-row>

    <el-table stripe
              style="width: 100%"> </el-table>
    <!-- URL信息 -->
    <div v-if="ipOrApp == 'two'">
      <el-row style="display: flex; justify-content: space-between">
        <el-col :span="3">
          <h2 style="font-size: 18px; font-weight: 700">URL信息</h2>
        </el-col>

        <el-col :span="4">
          <el-button type="primary">新增URL信息</el-button>
        </el-col>
      </el-row>
      <el-table stripe
                style="width: 100%"> </el-table>
    </div>
    <!-- 访问信息 -->
    <el-row style="display: flex; justify-content: space-between"
            v-if="ipOrApp == 'one'">
      <el-col :span="3">
        <h2 style="font-size: 18px; font-weight: 700">访问信息</h2>
      </el-col>
      <!-- <el-col :span="4"><el-button type="primary">新增访问信息</el-button></el-col> -->
    </el-row>
    <el-table stripe
              style="width: 100%"> </el-table>
    <!-- 维保信息 -->
    <el-row style="display: flex; justify-content: space-between">
      <el-col :span="3">
        <h2 style="font-size: 18px; font-weight: 700">维保信息</h2>
      </el-col>
    </el-row>
    <el-main style="line-height: 40px">
      <el-row>
        <el-col :span="8">
          <span>终止信息:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.Maintenance_Info"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span>维保厂商:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.supplier"
                      :disabled="disabledB" /></span>
        </el-col>
        <el-col :span="8">
          <span>维保人员:</span>
          <span>
            <el-input class="input_span"
                      style="width: 70%; margin-left: 2%"
                      v-model="addlist.Maintenance_staff"
                      :disabled="disabledB" /></span>
        </el-col>
      </el-row>
    </el-main>
    <!-- 更新日志 -->
    <el-row style="display: flex; justify-content: space-between">
      <el-col :span="3">
        <h2 style="font-size: 18px; font-weight: 700">更新日志</h2>
      </el-col>
      <!-- <el-col :span="4"><el-button type="primary">新增访问信息</el-button></el-col> -->
    </el-row>
    <table-unit :height="tableHeight"
                :currentPage="changeid.page"
                :columns="columns"
                :list="rawDataListOBJ"
                :pageSize="changeid.limit"
                :total="total1"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange">
    </table-unit>
    <!-- <template #footer>
			<div class="dialog-footer">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false"> 确认 </el-button>
			</div>
		</template> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineExpose } from 'vue';
import { unknownAPI } from '../api';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['update:detailDia', 'unknownListGetApi']);
const props = defineProps({
	detailDia: {
		type: Boolean<boolean>,
		default: false,
	},
	addType: {
		type: String,
		default: () => 'add',
	},
	detailID: {
		type: String,
		default: () => '',
	},
	unknownListGetApi: {
		type: Function,
		default: () => {},
	},
	is_knownSon: {
		type: String,
		default: () => '0',
	},
	ipOrApp: {
		type: String,
		default: () => 'one',
	},
});

// ref
let disabledB = ref(true);
let disabledBNO = ref(false);
let resourcesIPappList = ref([]);
let classIPappList = ref([]);
const tableHeight = window.innerHeight - 2000;
let rawDataListOBJ = ref([]);
let total1 = ref<number>(0);
let rawDataListPS = ref({
	page: 1,
	limit: 30,
});
const columns = [
	{
		title: '更新人',
		dataIndex: 'modifier',
	},
	{
		title: '变更内容',
		dataIndex: 'change_data',
	},
	{
		title: '更新时间',
		dataIndex: 'update_datetime',
	},
];
// 新增列表
let addlist = ref({
	id: '',
	logical_name: '',
	ip: '',
	class_name: '',
	resource_type: '',
	biz: '',
	status: '',
	company: '',
	dept: '',
	safe_person: '',
	tp_safe: '',
	dept_safe: '',
	external_ip: '',
	internal_ip: '',
	hostname: '',
	description: '',
	//基础信息结束
	data_center: '', //部署信息
	room: '',
	rock: '',
	start_u: '',
	end_u: '',
	unit_digit: '',
	network_area: '',
	equipment_usage: '',
	//部署信息结束
	os: '', //进程信息
	os_version: '',

	// 进程信息结束
	Maintenance_Info: '', //维保信息
	supplier: '',
	Maintenance_staff: '',
});
let changeid = ref({
	change_id: '',
	page: 1,
	limit: 30,
});
// watch(
// 	() => props.detailID,
// 	(newValue) => {
// 		detailsAll();
// 	}
// // );

// watch(
// 	() => [props.addType, props.detailID, props.is_knownSon, props.ipOrApp],
// 	([newValue]) => {
// 		if (newValue == 'edit') {
// 			disabledEdit();
// 			// detailsAll();
// 			addlist.value.id = props.detailID;
// 			journalListGetApi();
// 		} else {
// 			addlist.value = {
// 				id: '',
// 				logical_name: '',
// 				ip: '',
// 				class_name: '',
// 				resource_type: '',
// 				biz: '',
// 				status: '',
// 				company: '',
// 				dept: '',
// 				safe_person: '',
// 				tp_safe: '',
// 				dept_safe: '',
// 				external_ip: '',
// 				internal_ip: '',
// 				hostname: '',
// 				description: '',
// 				//基础信息结束
// 				data_center: '', //部署信息
// 				room: '',
// 				rock: '',
// 				start_u: '',
// 				end_u: '',
// 				unit_digit: '',
// 				network_area: '',
// 				equipment_usage: '',
// 				//部署信息结束
// 				os: '', //进程信息
// 				os_version: '',

// 				// 进程信息结束
// 				Maintenance_Info: '', //维保信息
// 				supplier: '',
// 				Maintenance_staff: '',
// 			};
// 			editAssets();
// 		}
// 	}
// );
// // 资源大类
// const resourcesIPGet = async () => {
// 	if (props.ipOrApp == 'two') {
// 		let { data } = await unknownAPI().APPCategoryGetIDApi();
// 		resourcesIPappList.value = data;
// 	} else {
// 		let { data } = await unknownAPI().resourceCategoryGetIDApi();
// 		resourcesIPappList.value = data;
// 	}
// };
// resourcesIPGet();
// // 大类选择
// const classIPappListFn = async (obj: any) => {
// 	let { data } = await unknownAPI().calssCategoryGetIDApi({ id: obj });
// 	classIPappList.value = data;
// };
// // 入库
// const storagePostIDApi = async () => {
// 	let { code, msg } = await unknownAPI().storagePostIDApi(addlist.value.id);
// 	if (code == 2000) {
// 		ElMessage.success(msg);
// 		emit('update:detailDia', false);
// 		emit('unknownListGetApi');
// 	} else {
// 		ElMessage.error(msg);
// 	}
// };
// // 新增
// const addYes = async () => {
// 	if (
// 		addlist.value.logical_name === '' ||
// 		addlist.value.ip === '' ||
// 		addlist.value.class_name === '' ||
// 		addlist.value.resource_type === '' ||
// 		addlist.value.biz === '' ||
// 		addlist.value.status === '' ||
// 		addlist.value.company === '' ||
// 		addlist.value.dept === '' ||
// 		addlist.value.safe_person === '' ||
// 		addlist.value.data_center === '' ||
// 		addlist.value.network_area === '' ||
// 		addlist.value.os === '' ||
// 		addlist.value.os_version === ''
// 	) {
// 		ElMessage.error('请填写必选项');
// 	}
// 	if (props.is_knownSon == '2') {
// 		if (props.ipOrApp == 'one') {
// 			let { code, msg } = await unknownAPI().unknownListPutIDApi(addlist.value.id, addlist.value);
// 			if (code == 2000) {
// 				ElMessage.success(msg);
// 				emit('update:detailDia', false);
// 				emit('unknownListGetApi');
// 			} else {
// 				ElMessage.error(msg);
// 			}
// 		} else {
// 			let { code, msg } = await unknownAPI().bussListPutIDApi(addlist.value.id, addlist.value);
// 			if (code == 2000) {
// 				ElMessage.success(msg);
// 				emit('update:detailDia', false);
// 				emit('unknownListGetApi');
// 			} else {
// 				ElMessage.error(msg);
// 			}
// 		}
// 	} else {
// 		if (props.addType == 'edit') {
// 			if (props.ipOrApp == 'one') {
// 				let { code, msg } = await unknownAPI().unknownListPutIDApi(addlist.value.id, addlist.value);
// 				if (code == 2000) {
// 					ElMessage.success(msg);
// 					emit('update:detailDia', false);
// 					emit('unknownListGetApi');
// 				} else {
// 					ElMessage.error(msg);
// 				}
// 			} else {
// 				let { code, msg } = await unknownAPI().bussListPutIDApi(addlist.value.id, addlist.value);
// 				if (code == 2000) {
// 					ElMessage.success(msg);
// 					emit('update:detailDia', false);
// 					emit('unknownListGetApi');
// 				} else {
// 					ElMessage.error(msg);
// 				}
// 			}
// 		} else if (props.addType == 'add') {
// 			let { code, msg } = await unknownAPI().unknownListPostApi(addlist.value);
// 			if (code == 2000) {
// 				ElMessage.success(msg);
// 				emit('update:detailDia', false);
// 				emit('unknownListGetApi');
// 			} else {
// 				ElMessage.error(msg);
// 			}
// 		}
// 	}
// };
// // 详情展示
// const detailsAll = async () => {
// 	console.log(props.ipOrApp);
// 	if (props.ipOrApp == 'two') {
// 		let { data } = await unknownAPI().AppunknownListGetIDApi(props.detailID);
// 		addlist.value = data;
// 	} else {
// 		let { data } = await unknownAPI().unknownListGetIDApi(props.detailID);
// 		addlist.value = data;
// 	}
// };
// // 更新日志
// const journalListGetApi = async () => {
// 	changeid.value.change_id = addlist.value.id;
// 	let { data, total } = await unknownAPI().journalListGetApi(changeid.value);
// 	rawDataListOBJ.value = data;
// 	total1.value = total;
// };

// const close = () => {
// 	emit('update:detailDia', false);
// };
// const editAssets = () => {
// 	disabledB.value = false;
// 	disabledBNO.value = true;
// };
// const disabledEdit = () => {
// 	disabledB.value = true;
// 	disabledBNO.value = false;
// };
// const handleSizeChange = (val: number) => {
// 	changeid.value.limit = val;
// 	changeid.value.page = 1;
// 	journalListGetApi();
// };
// const handleCurrentChange = (val: number) => {
// 	changeid.value.page = val;
// 	journalListGetApi();
// };

// defineExpose({
// 	detailsAll,
// });
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
	max-height: none !important;
}
:deep(.el-input.is-disabled .el-input__wrapper) {
	box-shadow: 0 0 0 0;
	background-color: #ffffff !important;
	color: rgb(39, 37, 54) !important;
}

:deep(.el-select__wrapper.is-disabled) {
	box-shadow: 0 0 0 0;
	background-color: #ffffff !important;
	color: rgb(39, 37, 54) !important;
}

:deep(.el-input.is-disabled .el-input__inner) {
	-webkit-text-fill-color: rgb(39, 37, 54);
	font-weight: 700;
}
:deep(.el-select__wrapper.is-disabled .el-select__selected-item) {
	-webkit-text-fill-color: rgb(39, 37, 54);
	font-weight: 700;
}

.span_one {
	width: 13.2vh;
	font-size: 1.8vh;
	display: inline-table;
	color: rgb(78, 89, 105);
}
:deep(.el-badge__content.is-fixed.is-dot) {
	right: 14.2vh;
	top: 2vh;
}
:deep(.item1 .el-badge__content.is-fixed.is-dot) {
	right: 9vh;
	top: 2vh;
}

// .item1 {
// 	right: 13.5vh;
// 	top: 5vh;
// }
</style>