
<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import LineChart from './components/LineChart.vue';
import BarChart from './components/barCharts.vue';
import PieChart from './components/PieChart.vue';
import PieCharts1 from './components/PieCharts1.vue';
import InPieChart from './components/InPieChart.vue';
import BorizontalBarChart from './components/BorizontalBarChart.vue';
import { home, banStat } from './api';
import { useThemeConfig } from '@/stores/themeConfig';
import { storeToRefs } from 'pinia';
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
let lineChartData = ref({
	redLineData: [],
	greenLineData: [],
	blueLineData: [],
	yellowLineData: [],
});
let lineChartDataX = ref([]);
let statusData = ref([]);
let pieData = ref({
	data1: [],
	data2: [],
	data3: [],
	data4: [],
	totalData: [],
});
let statusTotal = ref(0);
let importanceData = ref([]);
let importanceTotal = ref(0);
let kindDataX = ref([]);
let kindDataY = ref([]);
let pieLegendData = ref([]);
let isShowEcharts = ref(true);
let weekValue = ref('');
const getBanStat = async (weekRange) => {
	lineChartData.value = {
		redLineData: [],
		greenLineData: [],
		blueLineData: [],
		yellowLineData: [],
	};
	lineChartDataX.value = [];
	const banData = await banStat(weekRange);
	if (banData.data && Array.isArray(banData.data.ban_stat)) {
		banData.data.ban_stat.forEach((item) => {
			switch (item.action) {
				case 'FENGJIN':
					lineChartDataX.value.push(item.update_time);
					lineChartData.value.redLineData.push(item.count);
					break;
				case 'JIEFENG':
					lineChartData.value.greenLineData.push(item.count);
					break;
				default:
					break;
			}
		});
	}

	if (banData.data && Array.isArray(banData.data.ban_stat_list)) {
		banData.data.ban_stat_list.forEach((item) => {
			lineChartData.value.yellowLineData.push(item.count);
		});
	}
	if (banData.data && Array.isArray(banData.data.threat_list)) {
		banData.data.threat_list.forEach((item) => {
			lineChartData.value.blueLineData.push(item.count);
		});
	}
};
const getData = async () => {
	importanceData.value = [];
	kindDataX.value = [];
	kindDataY.value = [];
	pieLegendData.value = [];
	statusData.value = [];
	pieData.value = {
		data1: [],
		data2: [],
		data3: [],
		data4: [],
		totalData: [],
	};
	getBanStat({});
	const { data } = await home();
	if (Array.isArray(data.executor)) {
		const sort_fun = function (a, b) {
			return a.total - b.total;
		};
		data.executor.forEach((item) => {
			let total = parseInt(item.disposal + item.judge + item.monitor + item.ban);
			item.total = total;
		});
		data.executor.sort(sort_fun);
		data.executor.forEach((i) => {
			pieData.value.data1.push(i.disposal);
			pieData.value.data2.push(i.judge);
			pieData.value.data3.push(i.monitor);
			pieData.value.data4.push(i.ban);
			pieLegendData.value.push(i.executor);
			pieData.value.totalData.push(i.total);
		});
	}
	if (Array.isArray(data.status)) {
		data.status.forEach((item) => {
			let name = '';
			switch (item.status) {
				case 1:
					name = '【监控】研判退回';
					break;
				case 2:
					name = '【研判】新增事件';
					break;
				case 3:
					name = '【研判】监控修改';
					break;
				case 4:
					name = '【研判】二线研判';
					break;
				case 5:
					name = '【研判】处置退回';
					break;
				case 6:
					name = '【处置】研判通过';
					break;
				case 7:
					name = '【完成】中途办结';
					break;
				case 8:
					name = '【完成】处置完成';
					break;
				case 9:
					name = '【挂起】事件挂起';
					break;
				default:
					name = '未知状态';
					break;
			}
			let obj = { value: item.count, name };
			statusTotal.value += item.count;
			statusData.value.push(obj);
		});
	}
	if (Array.isArray(data.importance)) {
		data.importance.forEach((item, index) => {
			let name = '';
			switch (item.importance) {
				case 1:
					name = '一般';
					break;
				case 2:
					name = '重要';
					break;
				case 3:
					name = '紧急';
					break;
				default:
					name = '未知状态';
					break;
			}
			let colorList = ['#6666ff', '#409eff', '#f56c6c', '#e6a23c'];
			let itemStyle = {
				color: colorList[index],
			};
			let obj = { value: item.count, name, itemStyle };
			importanceTotal.value += item.count;
			importanceData.value.push(obj);
		});
	}
	if (Array.isArray(data.kind)) {
		data.kind.forEach((item) => {
			let name = '';
			switch (item.kind) {
				case 1:
					name = '内网';
					break;
				case 2:
					name = '互联网';
					break;
				case 3:
					name = '外联网';
					break;
				case 4:
					name = '其他';
					break;

				default:
					name = '未知状态';
					break;
			}
			kindDataX.value.push(name);
			kindDataY.value.push(item.count);
		});
	}
};

let reloadEchart = ref(true);

const createCalendarHeader = (day) => {
	let endDate = new Date(day);
	endDate.setDate(endDate.getDate() + (7 - day.getDay()));
	day.setDate(day.getDate() + 1);
	return { start_time: day.toISOString().slice(0, 10), end_time: endDate.toISOString().slice(0, 10) };
};
const changeWeek = (val) => {
	let weekRange = {};
	if (val) {
		weekRange = createCalendarHeader(val);
	}
	getBanStat(weekRange);
};

const disabledDate = (time: Date | null) => {
	return time.getTime() > Date.now();
};
getData();
watch(
	() => themeConfig.value.isCollapse,
	(isCollapse) => {
		reloadEchart.value = false;
		nextTick(() => {
			reloadEchart.value = true;
			let timer = setTimeout(() => {
				getData();
			}, 500);
		});
	}
);
let isIsDark = ref(themeConfig.value.isIsDark);
watch(
	() => themeConfig.value.isIsDark,
	(isDark) => {
		isIsDark.value = isDark;
		getData();
	}
);
</script>


<template>
  <div class="dashboard-container"
       v-if="reloadEchart">
    <el-row :gutter="24">
      <el-col :xs="24"
              :sm="24"
              :lg="24">
        <div class="chart-wrapper"
             style="height:550px">
          <div>
            <span style="font-weight:bold;font-size:18px;margin-right:30px;color:var(--el-text-color-primary)">护网信息统计</span>
            <el-date-picker @change="changeWeek"
                            :disabled-date="disabledDate"
                            v-model="weekValue"
                            type="week"
                            value-format=""
                            format="[第] ww [周]"
                            placeholder="请选择周期" />
          </div>
          <line-chart v-if="lineChartData.redLineData.length > 0 || lineChartData.greenLineData.length > 0"
                      :chartData="lineChartData"
                      :xData="lineChartDataX"
                      :height="'500px'"
                      :isIsDark="isIsDark"></line-chart>
          <div style="height:500px"
               v-else>
            <el-empty description="数据为空" />
          </div>
        </div>
      </el-col>

    </el-row>
    <el-row :gutter="24">
      <el-col :xs="24"
              :sm="24"
              :lg="12">
        <div class="chart-wrapper">
          <PieCharts1 :height="'500px'"
                      v-if="statusData.length > 0"
                      :total="statusTotal"
                      :data="statusData"
                      :isIsDark="isIsDark"
                      :title="'事件进展统计'">
          </PieCharts1>
          <div style="height:480px"
               v-else>
            <el-empty description="数据为空" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="24"
              :lg="12">
        <div class="chart-wrapper">
          <PieChart :height="'500px'"
                    v-if="importanceData.length > 0"
                    :data="importanceData"
                    :total="importanceTotal"
                    :isIsDark="isIsDark"
                    :title="'事件威胁程度统计'">
          </PieChart>
          <div style="height:480px"
               v-else>
            <el-empty description="数据为空" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :xs="24"
              :sm="24"
              :lg="12">
        <div class="chart-wrapper"
             style="overflow-y: auto;">
          <BorizontalBarChart v-if="pieLegendData.length > 0"
                              :height="'3500px'"
                              :yData="pieLegendData"
                              :data="pieData"
                              :isIsDark="isIsDark"
                              :title="'个人工单量统计'">
          </BorizontalBarChart>
          <div style="height:480px"
               v-else>
            <el-empty description="数据为空" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24"
              :sm="24"
              :lg="12">
        <div class="chart-wrapper">
          <BarChart :title="'事件分类统计'"
                    :height="'500px'"
                    v-if="kindDataX.length > 0"
                    :yData="kindDataY"
                    :isIsDark="isIsDark"
                    :xData="kindDataX">
          </BarChart>
          <div style="height:480px"
               v-else>
            <el-empty description="数据为空" />
          </div>
        </div>

      </el-col>
    </el-row>

  </div>
</template>

<style lang="scss" scoped>
@import '@/theme/mixins/index.scss';
.dashboard-container {
	padding: 15px;

	.chart-wrapper {
		height: 500px;
		box-shadow: 0 0 5px gray;
		margin: 10px 0;
		border-radius: 5px;
		padding: 10px;

		overflow: hidden;
		@include scrollBar;
	}
}
</style>
