<script setup lang='ts' >
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as api from '../api';
let dataList = ref({
	id: '', //id
	time_start_scan: '', //开始时间
	time_end_scan: '', //结束时间
});
//路由
const route = useRoute();
//从路由获取信息
const taskList = route.query;
//检测新版本
const inspect = () => {
	ElMessage({
		message: '等待检测接口',
		type: 'success',
	});
};
//返回
const router = useRouter();
const backIndex = () => {
	router.push({ path: '/scan-manage/equipment-list', query: {} });
};
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const date = now.getDate();
const todayDate = `${year}-${month}-${date}`;
const createCalendarHeader = (today = now) => {
	let headers = [];
	let startDate = new Date(today);
	startDate.setDate(startDate.getDate() - today.getDay());
	let endDate = new Date(today);
	endDate.setDate(endDate.getDate() + (6 - today.getDay()));
	let weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let date1 = date.getDate();
		let selectDate = `${year}-${month}-${date1}`;
		let isToday = false;
		let dayOfWeek = weekdays[date.getDay()];
		if (selectDate === todayDate) {
			isToday = true;
		}
		headers.push({
			date: date1,
			week: dayOfWeek,
			selectDate,
			isToday,
		});
	}
	return headers;
};

let calendarData = ref({
	headers: createCalendarHeader(),
	contents: {},
});
let numAllAndList = ref();
let weeksValue = ref(new Date());
const onClickWeek = () => {
	calendarData.value.headers = createCalendarHeader(weeksValue.value);
	dataListFn();
};

// 获取数据
const dataListFn = async () => {
	dataList.value.id = route.query.id;
	dataList.value.time_start_scan = calendarData.value.headers[0].selectDate;
	dataList.value.time_end_scan = calendarData.value.headers[6].selectDate;
	let { data } = await api.taskResultsGet(dataList.value);
	numAllAndList.value = data;
	calendarData.value.contents = numAllAndList.value.contents;
};
dataListFn();
</script>

<template>
  <dp title="任务计划详情"
      @back="backIndex"
      :desc="route.query.scan_name">
    <div>
      <dl class="dl-container-position">
        <dt>处理进度</dt>
        <dd>
          <table class="m_table">
            <tr>
              <td class="table-title">ID</td>
              <td>{{ taskList.id }}</td>
              <td class="table-title">名称</td>
              <td>{{ taskList.scan_name }}</td>
            </tr>
            <tr>
              <td class="table-title">状态</td>
              <td>{{ taskList.scan_status }}</td>
              <td class="table-title">厂家</td>
              <td>{{ taskList.scan_firm }}</td>
            </tr>
            <tr>
              <td class="table-title">版本</td>
              <td>{{ taskList.scan_version }}</td>
              <td class="table-title">IP</td>
              <td>{{ taskList.scan_ip }}</td>
            </tr>
            <tr>
              <td class="table-title">机房</td>
              <td>{{ taskList.room }}</td>
              <td class="table-title">网络区域</td>
              <td>{{ taskList.network_area }}</td>
            </tr>
            <tr>
              <td class="table-title">sn号</td>
              <td>{{ taskList.scan_sn }}</td>
              <td class="table-title">数据中心</td>
              <td>{{ taskList.data_center }}</td>
            </tr>
          </table>
          <table class="m_table">
            <tr></tr>
            <tr>
              <td class="table-title">描述</td>
              <td>{{ taskList.description }}</td>
            </tr>
          </table>
        </dd>
      </dl>
      <dl class="dl-container-position">
        <dt>规则库版本</dt>
        <dd>
          <table class="m_table"
                 style="text-align: center">
            <tr>
              <td></td>
              <td>规则库</td>
              <td>当前版本</td>
              <td>最近升级时间</td>
              <td>最新版本</td>
              <td>操作</td>
            </tr>
            <tr>
              <td>
                <el-icon size="20"
                         color="red">
                  <CircleClose />
                </el-icon>
              </td>
              <td>资产扫描</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td></td>
            </tr>
            <tr>
              <td>
                <el-icon size="20"
                         color="green">
                  <CircleCheck />
                </el-icon>
              </td>
              <td>漏洞扫描</td>
              <td>1.0.1</td>
              <td>2024-01-01 08:00:00</td>
              <td>1.0.1</td>
              <td>
                <el-button link
                           size="small"
                           type="primary"
                           @click="inspect">检测新版本</el-button>
              </td>
            </tr>
          </table>
        </dd>
      </dl>

      <dl class="dl-container-position">
        <dt>扫描日程计划</dt>
        <dd class="calendar-table-box">
          <div class="tag-box">
            <el-tag size="large"
                    type="info">今日任务总计 {{ numAllAndList?.task_sum }}项</el-tag>
            <el-tag size="large"
                    type="primary">未开始 {{ numAllAndList?.executing }}项</el-tag>
            <el-tag size="large"
                    type="success">正在执行 {{ numAllAndList?.afoot }}项</el-tag>
            <el-tag size="large"
                    type="warning">已完成 {{ numAllAndList?.finished }}项</el-tag>
            <el-tag size="large"
                    type="danger">失败 {{ numAllAndList?.fail }}项</el-tag>
            <el-date-picker v-model="weeksValue"
                            type="week"
                            :clearable="false"
                            format="[第] ww [周]"
                            placeholder="请选择周期"
                            @change="onClickWeek" />
          </div>
          <table class="calendar-table">
            <tr class="calendar-haders">
              <td></td>
              <td v-for="(v, i) in calendarData.headers"
                  :key="i + 'header'">
                <p class="week">{{ v.week }}</p>
                <p class="date"
                   :style="v.isToday ? 'color:#409EFF' : ''">{{ v.date }}</p>
              </td>
            </tr>
            <tr v-for="index in 24"
                :key="index"
                class="calendar-contents">
              <td>{{ index - 1 }}:00:00</td>
              <td v-if="Array.isArray(calendarData.contents.sunday) && calendarData.contents.sunday.length > 0">
                <div v-for="(v, i) in calendarData.contents.sunday"
                     :key="i + 'jlfaj'">
                  <div v-if="index > v.start && index <= v.end"
                       class="scan-content"
                       :style="index > v.start && index <= v.end ? `color:var(--el-text-color-primary);background-color:${v.color};` : ''">
                    <el-tooltip effect="dark"
                                placement="top">
                      <template #content>
                        <div>
                          <p>开始时间：{{ v.scan_time }}</p>
                          <p>扫描时长：{{ v.scan_time_count }}</p>
                          <p>扫描类型：{{ v.scan_type }}</p>
                          <p>扫描区域：{{ v.area }}</p>
                        </div>
                      </template>
                      <div class="overflwo-text">
                        <p>{{ v.scan_time }}</p>
                        <p>{{ v.scan_time_count }}</p>
                        <p>{{ v.scan_type }}</p>
                        <p>{{ v.area }}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </td>
              <td v-else>
                <div class="scan-content"></div>
              </td>

              <td v-if="Array.isArray(calendarData.contents.monday) && calendarData.contents.monday.length > 0">
                <div v-for="(v, i) in calendarData.contents.monday"
                     :key="i + 'jlfaj'">
                  <div v-if="index > v.start && index <= v.end"
                       class="scan-content"
                       :style="
											index > v.start && index <= v.end
												? `color:var(--el-text-color-primary);border-bottom-color:${v.color};background-color:${v.color};`
												: ''
										">
                    <el-tooltip effect="dark"
                                placement="top">
                      <template #content>
                        <div>
                          <p>开始时间：{{ v.scan_time }}</p>
                          <p>扫描时长：{{ v.scan_time_count }}</p>
                          <p>扫描类型：{{ v.scan_type }}</p>
                          <p>扫描区域：{{ v.area }}</p>
                        </div>
                      </template>
                      <div class="overflwo-text">
                        <p>{{ v.scan_time }}</p>
                        <p>{{ v.scan_time_count }}</p>
                        <p>{{ v.scan_type }}</p>
                        <p>{{ v.area }}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </td>
              <td v-else>
                <div class="scan-content"></div>
              </td>
              <td v-if="Array.isArray(calendarData.contents.tuesday) && calendarData.contents.tuesday.length > 0">
                <div v-for="(v, i) in calendarData.contents.tuesday"
                     :key="i + 'jlfaj'">
                  <div v-if="index > v.start && index <= v.end"
                       class="scan-content"
                       :style="
											index > v.start && index <= v.end
												? `color:var(--el-text-color-primary);border-bottom-color:${v.color};background-color:${v.color};`
												: ''
										">
                    <el-tooltip effect="dark"
                                placement="top">
                      <template #content>
                        <div>
                          <p>开始时间：{{ v.scan_time }}</p>
                          <p>扫描时长：{{ v.scan_time_count }}</p>
                          <p>扫描类型：{{ v.scan_type }}</p>
                          <p>扫描区域：{{ v.area }}</p>
                        </div>
                      </template>
                      <div class="overflwo-text">
                        <p>{{ v.scan_time }}</p>
                        <p>{{ v.scan_time_count }}</p>
                        <p>{{ v.scan_type }}</p>
                        <p>{{ v.area }}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </td>
              <td v-else>
                <div class="scan-content"></div>
              </td>
              <td v-if="Array.isArray(calendarData.contents.wednesday) && calendarData.contents.wednesday.length > 0">
                <div v-for="(v, i) in calendarData.contents.wednesday"
                     :key="i + 'jlfaj'">
                  <div v-if="index > v.start && index <= v.end"
                       class="scan-content"
                       :style="
											index > v.start && index <= v.end
												? `color:var(--el-text-color-primary);border-bottom-color:${v.color};background-color:${v.color};`
												: ''
										">
                    <el-tooltip effect="dark"
                                placement="top">
                      <template #content>
                        <div>
                          <p>开始时间：{{ v.scan_time }}</p>
                          <p>扫描时长：{{ v.scan_time_count }}</p>
                          <p>扫描类型：{{ v.scan_type }}</p>
                          <p>扫描区域：{{ v.area }}</p>
                        </div>
                      </template>
                      <div class="overflwo-text">
                        <p>{{ v.scan_time }}</p>
                        <p>{{ v.scan_time_count }}</p>
                        <p>{{ v.scan_type }}</p>
                        <p>{{ v.area }}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </td>
              <td v-else>
                <div class="scan-content"></div>
              </td>
              <td v-if="Array.isArray(calendarData.contents.thursday) && calendarData.contents.thursday.length > 0">
                <div v-for="(v, i) in calendarData.contents.thursday"
                     :key="i + 'jlfaj'">
                  <div v-if="index > v.start && index <= v.end"
                       class="scan-content"
                       :style="
											index > v.start && index <= v.end
												? `color:var(--el-text-color-primary);border-bottom-color:${v.color};background-color:${v.color};`
												: ''
										">
                    <el-tooltip effect="dark"
                                placement="top">
                      <template #content>
                        <div>
                          <p>开始时间：{{ v.scan_time }}</p>
                          <p>扫描时长：{{ v.scan_time_count }}</p>
                          <p>扫描类型：{{ v.scan_type }}</p>
                          <p>扫描区域：{{ v.area }}</p>
                        </div>
                      </template>
                      <div class="overflwo-text">
                        <p>{{ v.scan_time }}</p>
                        <p>{{ v.scan_time_count }}</p>
                        <p>{{ v.scan_type }}</p>
                        <p>{{ v.area }}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </td>
              <td v-else>
                <div class="scan-content"></div>
              </td>
              <td v-if="Array.isArray(calendarData.contents.friday) && calendarData.contents.friday.length > 0">
                <div v-for="(v, i) in calendarData.contents.friday"
                     :key="i + 'jlfaj'">
                  <div v-if="index > v.start && index <= v.end"
                       class="scan-content"
                       :style="
											index > v.start && index <= v.end
												? `color:var(--el-text-color-primary);border-bottom-color:${v.color};background-color:${v.color};`
												: ''
										">
                    <el-tooltip effect="dark"
                                placement="top">
                      <template #content>
                        <div>
                          <p>开始时间：{{ v.scan_time }}</p>
                          <p>扫描时长：{{ v.scan_time_count }}</p>
                          <p>扫描类型：{{ v.scan_type }}</p>
                          <p>扫描区域：{{ v.area }}</p>
                        </div>
                      </template>
                      <div class="overflwo-text">
                        <p>{{ v.scan_time }}</p>
                        <p>{{ v.scan_time_count }}</p>
                        <p>{{ v.scan_type }}</p>
                        <p>{{ v.area }}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </td>
              <td v-else>
                <div class="scan-content"></div>
              </td>
              <td v-if="Array.isArray(calendarData.contents.saturday) && calendarData.contents.saturday.length > 0">
                <div v-for="(v, i) in calendarData.contents.saturday"
                     :key="i + 'jlfaj'">
                  <div v-if="index > v.start && index <= v.end"
                       class="scan-content"
                       :style="
											index > v.start && index <= v.end
												? `color:var(--el-text-color-primary);border-bottom-color:${v.color};background-color:${v.color};`
												: ''
										">
                    <el-tooltip effect="dark"
                                placement="top">
                      <template #content>
                        <div>
                          <p>开始时间：{{ v.scan_time }}</p>
                          <p>扫描时长：{{ v.scan_time_count }}</p>
                          <p>扫描类型：{{ v.scan_type }}</p>
                          <p>扫描区域：{{ v.area }}</p>
                        </div>
                      </template>
                      <div class="overflwo-text">
                        <p>{{ v.scan_time }}</p>
                        <p>{{ v.scan_time_count }}</p>
                        <p>{{ v.scan_type }}</p>
                        <p>{{ v.area }}</p>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </td>
              <td v-else>
                <div class="scan-content"></div>
              </td>
            </tr>
          </table>
        </dd>
      </dl>
    </div>
  </dp>
</template>
<style scoped lang="scss">
@import '@/theme/mixins/index.scss';
.table-title {
	width: 150px;
	font-weight: bold;
}

.calendar-table-box {
	.tag-box {
		padding-bottom: 20px;
		:deep(.el-tag) {
			margin-right: 20px;
		}
	}
}

.calendar-table {
	width: 100%;
	text-align: center;
	position: relative;
	td {
		border: 1px solid var(--el-border-color-lighter);
		width: 12.5%;
		height: 100px;
	}
	.calendar-haders {
		position: sticky;
		top: -13px;
		background-color: var(--el-fill-color-blank);
		border: 1px solid var(--el-border-color-lighter);
		z-index: 9;
		td {
			padding-top: 20px;
		}
		.week {
			font-weight: bold;
			color: gray;
		}
		.date {
			font-size: 30px;
		}
	}
	.calendar-contents {
		.scan-content {
			height: 100px;
		}
		.overflwo-text {
			cursor: pointer;
			padding: 10px 0;
			p {
				width: 120px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-left: 50%;
				transform: translateX(-50%);
			}
		}
	}
}
</style>

