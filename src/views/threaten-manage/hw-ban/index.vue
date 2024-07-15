
<script setup lang="ts">
import { ref, reactive } from 'vue';

import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import apis from './api';
const router = useRouter();
const route = useRoute();
const columns = [
	{
		title: 'ID',
		dataIndex: 'id',
		align: 'center',
		width: 100,
	},
	{
		title: '恶意IP',
		dataIndex: 'ipStr',
		align: 'center',
		isHidden: true,
	},

	{
		title: '申请动作',
		dataIndex: 'action',
		align: 'center',
		isTag: true,
		width: 100,
	},
	{
		title: '申请人',
		dataIndex: 'applicant',
		align: 'center',
		width: 100,
	},
	{
		title: '初审人员',
		dataIndex: 'checker',
		align: 'center',
		width: 100,
	},
	{
		title: '初审结果',
		dataIndex: 'checker_is_agree',
		align: 'center',
		width: 100,
	},
	{
		title: '复核人员',
		dataIndex: 'reviewer',
		align: 'center',
		width: 100,
	},
	{
		title: '复核结果',
		dataIndex: 'reviewer_is_agree',
		align: 'center',
		width: 100,
	},
	{
		title: '申请时间',
		dataIndex: 'applicant_time',
		align: 'center',
		width: 160,
	},

	{
		title: '申请理由',
		dataIndex: 'ban_reason',
		align: 'center',
		isHidden: true,
	},

	{
		title: '操作',
		dataIndex: 'operate',
		align: 'center',
		width: 180,
	},
];
const resCol = [
	{
		title: '工单号',
		dataIndex: 'sn',
		align: 'center',
	},
	{
		title: '操作员',
		dataIndex: 'operator',
		align: 'center',
		width: 90,
	},
	{
		title: '操作时间',
		dataIndex: 'operate_at',
		align: 'center',
	},
	{
		title: '封禁结果',
		dataIndex: 'message',
		align: 'center',
		isHidden: true,
	},
];
const userinfo = localStorage.getItem('userInfo');
const user = userinfo ? JSON.parse(userinfo) : {};
let resList = ref([]);
let tableHeight = window.innerHeight - 190;
let fileForm = new FormData();
let unsealForm = ref({
	ip: '',
	unsealReason: '',
});
let examineForm = ref({
	opinion: '',
	isExamine: 1,
});
// 复核信息
let reviewForm = ref({
	opinion: '',
	isExamine: 1,
});
let unsealRules = reactive({
	ban_target: [
		{
			required: true,
			message: '请正确输入需要解封的IP地址',
			trigger: 'change',
			pattern:
				/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
		},
	],
	unsealReason: [{ required: true, message: '请填写解封理由', trigger: 'blur' }],
});
let examineRules = ref({
	opinion: [{ required: true, message: '请填写审核意见', trigger: 'blur' }],
	isExamine: [{ required: true, message: '请选择是否同意' }],
});
let params = ref({
	limit: 30,
	page: 1,
	applicant: '',
	targets: '',
	checker: 'True',
	reviewer: '',
	checker_is_agree: '',
	reviewer_is_agree: '',
	action: '',
	start_time: '',
	end_time: '',
});
let total = ref(0);
let tableData = ref([]);
let examinePanel = ref(false);
let isDisabled = ref(true);
let queryDate = ref([]);
let examineInfo = ref({});
let examineStatus = ref('1');
let ban_reason_images = ref([]);
let isPower = ref(false);
let isAgree = ref(false);
let isShowMoreSearch = ref(false);
let pickerOptions = reactive({
	shortcuts: [
		{
			text: '最近一周',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
				picker.$emit('pick', [start, end]);
			},
		},
		{
			text: '最近一个月',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
				picker.$emit('pick', [start, end]);
			},
		},
		{
			text: '最近三个月',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
				picker.$emit('pick', [start, end]);
			},
		},
		{
			text: '最近半年',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
				picker.$emit('pick', [start, end]);
			},
		},
		{
			text: '最近一年',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
				picker.$emit('pick', [start, end]);
			},
		},
	],
	disabledDate(time) {
		return time.getTime() > Date.now();
	},
});
let date = ref([]);
let reviewFormRef = ref();
let examineFormRef = ref();
const setRoles = () => {
	if (roles.includes('研判组') || roles.includes('处置组')) {
		isPower.value = true;
	} else {
		isPower.value = false;
	}
};
const fetchTableData = async () => {
	if (Array.isArray(date.value) && date.value.length > 0) {
		params.value.start_time = date.value[0];
		params.value.end_time = date.value[1];
	} else {
		params.value.start_time = '';
		params.value.end_time = '';
	}
	let res = await apis.getIPPlugginList(params.value);
	let result = [];
	if (res.data && Array.isArray(res.data)) {
		res.data.forEach((item) => {
			let ipArr = [];
			switch (item.action) {
				case 'FENGJIN':
					item.action = { code: 3, value: '封禁' };
					break;
				case 'JIEFENG':
					item.action = { code: 1, value: '解封' };
					break;
				default:
					item.action = { code: 4, value: '未确定' };
					break;
			}
			let obj = { ...item };
			item.targets.forEach((e) => {
				ipArr.push(e.ban_target);
			});
			obj['ipArr'] = ipArr;
			obj['ipStr'] = ipArr.join();
			result.push(obj);
		});
	}
	tableData.value = result;
	total.value = res.total;
};
const handleSizeChange = (val) => {
	params.value.limit = val;
	params.value.page = 1;
	fetchTableData();
};
const handleCurrentChange = (val) => {
	params.value.page = val;

	fetchTableData();
};
const handleSearch = () => {
	params.value.page = 1;
	fetchTableData();
};
const reSearch = () => {
	params.value = {
		limit: 30,
		page: 1,
		applicant: '',
		targets: '',
		checker: 'True',
		reviewer: '',
		checker_is_agree: '',
		reviewer_is_agree: '',
		action: '',
		start_time: '',
		end_time: '',
	};
	examineStatus.value = '1';
	fetchTableData();
};
const toExamine = async (value) => {
	const { data } = await apis.pluggingResult(value.id);
	let file_prefix = data.result.file_prefix;
	resList.value = data.result.sns;
	ban_reason_images.value = data.result.ban_reason_images;
	ban_reason_images.value.forEach((i) => {
		i.image = file_prefix + i.image;
	});
	examineInfo.value = value;
	examineForm.value.opinion = value.checker_advice;

	switch (value.checker_is_agree) {
		case '同意':
			examineForm.value.isExamine = 1;
			isAgree.value = true;
			break;
		case '不同意':
			examineForm.value.isExamine = 2;
			isAgree.value = false;
			break;
		default:
			examineForm.value.isExamine = undefined;
			isAgree.value = false;
			break;
	}
	reviewForm.value.opinion = value.reviewer_advice;
	switch (value.reviewer_is_agree) {
		case '同意':
			reviewForm.value.isExamine = 1;
			break;
		case '不同意':
			reviewForm.value.isExamine = 2;
			break;
		default:
			reviewForm.value.isExamine = undefined;
			break;
	}
	examinePanel.value = true;
};
const examineConfirm = (isEx) => {
	if (isEx) {
		examineFormRef.value.validate((valid) => {
			if (valid) {
				let formData = {};
				formData.checker_advice = examineForm.value.opinion;
				formData.checker_is_agree = examineForm.value.isExamine == 1 ? '同意' : '不同意';
				apis.checker(formData, examineInfo.value.id).then((res) => {
					if (res.code == 2000) {
						ElMessage.success('审核成功');
						examinePanel.value = false;
						fetchTableData();
					}
				});
			} else {
				return false;
			}
		});
	} else {
		reviewFormRef.value.validate((valid) => {
			if (valid) {
				let formData = {};
				formData.reviewer_advice = reviewForm.value.opinion;
				formData.reviewer_is_agree = reviewForm.value.isExamine == 1 ? '同意' : '不同意';
				apis.reviewer(formData, examineInfo.value.id).then((res) => {
					if (res.code == 2000) {
						ElMessage.success('审核成功');
						examinePanel.value = false;
						fetchTableData();
					}
				});
			}
		});
	}
};

const changeExamineStatus = (val) => {
	params.value.page = 1;
	switch (val) {
		case '1':
			params.value.checker = 'True';
			params.value.reviewer = '';
			params.value.reviewer_is_agree = '';
			params.value.checker_is_agree = '';
			break;
		case '2':
			params.value.reviewer = 'True';
			params.value.checker = 'False';
			params.value.checker_is_agree = '同意';
			params.value.reviewer_is_agree = '';

			break;
		case '3':
			params.value.reviewer = 'False';
			params.value.checker = 'False';
			params.value.reviewer_is_agree = '同意';
			params.value.checker_is_agree = '';
			break;
		case '4':
			params.value.reviewer = '';
			params.value.checker = '';
			params.value.reviewer_is_agree = '';
			params.value.checker_is_agree = '';
			break;
	}
};
const initGetData = () => {
	if (route.query.limit && route.query.page) {
		route.query.limit = parseInt(route.query.limit as string);
		route.query.page = parseInt(route.query.page as string);
		for (let e in params.value) {
			params.value[e] = route.query[e];
		}
		examineStatus.value = route.query.examineStatus;
	}
	fetchTableData();
};
initGetData();
</script>
<template>
  <div class="security-onitoring-layout">
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>
            护网阻断
          </h3>
          <div class="button-box">
            <el-button type="warning"
                       link
                       @click="router.push({ path: '/threaten-manage/hw-ban/plugging-ip', query: { ...params, examineStatus } })"
                       icon="Setting">IP封堵/解封</el-button>
            <el-button type="success"
                       link
                       @click="router.push({ path: '/threaten-manage/hw-ban/firewall-info', query: { ...params, examineStatus } })"
                       icon="Bell">防火墙封禁信息</el-button>
            <el-button type="primary"
                       @click="handleSearch"
                       icon="Search">查询</el-button>
            <el-button type="primary"
                       @click="reSearch"
                       plain
                       icon="RefreshLeft">重置</el-button>

          </div>
        </div>
        <div class="form-params"
             :style="isShowMoreSearch ? 'height:100%' : 'height:60px'">
          <div class="more-filter-btn">
            <el-button link
                       type="primary"
                       @click="isShowMoreSearch = !isShowMoreSearch"
                       :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
              {{ isShowMoreSearch ? '收起' : '展开' }}
            </el-button>
          </div>
          <el-form :inline="true"
                   :model="params"
                   label-width="auto">
            <el-form-item label="状态：">
              <el-select @change="changeExamineStatus"
                         v-model="examineStatus"
                         placeholder="请选择审核状态">
                <el-option label="待审核"
                           value="1"></el-option>
                <el-option label="待复核"
                           value="2"></el-option>
                <el-option label="已完成"
                           value="3"></el-option>
                <el-option label="全部"
                           value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请动作：">
              <el-select v-model="params.action"
                         placeholder="请选择审核状态">
                <el-option label="封禁"
                           value="FENGJIN"></el-option>
                <el-option label="解封"
                           value="JIEFENG"></el-option>
                <el-option label="全部"
                           value=""></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请人：">
              <el-input @keyup.enter="handleSearch"
                        clearable
                        v-model="params.applicant"
                        placeholder="请输入申请人名称"></el-input>
            </el-form-item>
            <el-form-item label="IP地址：">
              <el-input @keyup.enter="handleSearch"
                        clearable
                        v-model="params.targets"
                        placeholder="请输入IP，支持模糊查询"></el-input>
            </el-form-item>
            <el-form-item label="告警时间：">

              <el-date-picker v-model="date"
                              type="datetimerange"
                              :picker-options="pickerOptions"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              align="right">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit :list="tableData"
                    :columns="columns"
                    @handleCurrentChange="handleCurrentChange"
                    @handleSizeChange="handleSizeChange"
                    :total="total"
                    :pageSize="params.limit"
                    :currentPage="params.page">
          <template v-slot="record">
            <el-button type="primary"
                       link
                       @click="toExamine(record.record)"
                       icon="View">
              查看 /
              审核</el-button>
          </template>
        </table-unit>
      </div>
    </div>

    <el-drawer v-model="examinePanel"
               size="50%">
      <dl class="dl-container">
        <dt>
          <b>封禁信息</b>
        </dt>
        <dd>
          <div>
            <table class="m_table">
              <tr>
                <td style="width:90px;font-weight:bold">申请人</td>
                <td>{{ examineInfo.applicant }}</td>
              </tr>
              <tr>
                <td style="width:90px;font-weight:bold">申请时间</td>
                <td>{{ examineInfo.applicant_time }}</td>
              </tr>
              <tr>
                <td style="width:90px;font-weight:bold">申请理由</td>
                <td>{{ examineInfo.ban_reason }}</td>
              </tr>
            </table>
            <table v-if="Array.isArray(examineInfo.targets) && examineInfo.targets.length > 0"
                   style="text-align: center;"
                   class="m_table">
              <tr style="font-weight:bold">
                <td>序号</td>
                <td>恶意IP</td>
                <td>位置</td>
                <td>封堵时长（天）</td>
              </tr>
              <tr v-for="(item, index) in examineInfo.targets"
                  :key="item.ban_target">
                <td>{{ index + 1 }}</td>
                <td>{{ item.ban_target }}</td>
                <td>{{ item.ip_address }}</td>
                <td>{{ item.block_time }}</td>
              </tr>
            </table>
          </div>
          <div v-viewer
               class="pluggin-images">
            <div class="img-box"
                 v-for="src, id in ban_reason_images"
                 :key="id">
              <img :src="src.image"
                   alt="封禁/解封图片" />
            </div>
          </div>

        </dd>
      </dl>

      <dl class="dl-container">
        <dt>
          <b>审核</b>
        </dt>
        <dd>
          <el-timeline>
            <el-timeline-item :icon="!!examineInfo.checker_is_agree ? 'el-icon-check' : ''"
                              :color="!!examineInfo.checker_is_agree ? '#0bbd87' : ''"
                              :timestamp="examineInfo.checker_time"
                              placement="top">
              <el-card>
                <div>

                  <el-form ref="examineFormRef"
                           :rules="examineRules"
                           :model="examineForm"
                           label-width="120px">
                    <el-form-item label="初审审核："
                                  prop="isExamine">
                      <el-radio-group :disabled="!!examineInfo.checker_is_agree"
                                      v-model="examineForm.isExamine">
                        <el-radio :value="1">同意</el-radio>
                        <el-radio :value="2">不同意</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="审核意见：">
                      <el-input type="textarea"
                                :disabled="!!examineInfo.checker_is_agree"
                                rows="3"
                                clearable
                                v-model="examineForm.opinion"></el-input>
                    </el-form-item>
                    <el-form-item style="text-align: right;">
                      <div v-if="!!examineInfo.checker_is_agree">
                        <el-tag type="success">初审已完成 |审核人：{{ examineInfo.checker }}</el-tag>
                      </div>
                      <div v-else>
                        <el-button type="primary"
                                   @click="examineConfirm(true)">提交</el-button>
                      </div>

                    </el-form-item>
                  </el-form>
                </div>
              </el-card>
            </el-timeline-item>
            <el-timeline-item :icon="!!examineInfo.reviewer_is_agree ? 'el-icon-check' : ''"
                              v-if="isAgree"
                              :color="!!examineInfo.reviewer_is_agree ? '#0bbd87' : ''"
                              :timestamp="examineInfo.reviewer_time"
                              placement="top">
              <el-card>
                <div>
                  <el-form ref="reviewFormRef"
                           :rules="examineRules"
                           :model="reviewForm"
                           label-width="120px">
                    <el-form-item label="复审审核："
                                  prop="isExamine">
                      <el-radio-group :disabled="!!examineInfo.reviewer_is_agree"
                                      v-model="reviewForm.isExamine">
                        <el-radio :value="1">同意</el-radio>
                        <el-radio :value="2">不同意</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="审核意见：">
                      <el-input :disabled="!!examineInfo.reviewer_is_agree"
                                type="textarea"
                                rows="3"
                                clearable
                                v-model="reviewForm.opinion"></el-input>
                    </el-form-item>
                    <el-form-item style="text-align: right;">
                      <div v-if="!!examineInfo.reviewer_is_agree">

                        <el-tag type="success">复审已完成 | 审核人：{{ examineInfo.reviewer }}</el-tag>
                      </div>
                      <div v-else>

                        <el-button type="primary"
                                   @click="examineConfirm(false)">提交</el-button>
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </dd>
      </dl>

      <dl class="dl-container"
          v-if="resList.length > 0">
        <dt>
          <b>审核结果</b>
        </dt>
        <dd>
          <table-unit :isIndex="true"
                      :columns="resCol"
                      :tableHeight="400"
                      :isShowPatination="false"
                      :list="resList">

          </table-unit>
        </dd>
      </dl>

    </el-drawer>

  </div>
</template>


<style scoped lang="scss">
.pluggin-images {
	.img-box {
		display: inline-block;
		width: 48%;
		cursor: pointer;
		border: solid 1px rgb(180, 179, 179);
		border-radius: 5px;
		padding: 5px;
		margin: 10px 1%;
		text-align: center;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>