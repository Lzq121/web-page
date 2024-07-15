<template>
  <div ref="chartsContainer"
       :style="{ height, width }"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
const props = defineProps({
	width: {
		type: String,
		default: '100%',
	},
	height: {
		type: String,
		default: '400px',
	},
	title: {
		type: String,
		default: '',
	},
	subtext: {
		type: String,
		default: '',
	},
	xData: {
		type: Array,
		default: () => [],
	},
	yData: {
		type: Array,
		default: () => [],
	},
	isShowXAxis: {
		type: Boolean,
		default: true,
	},
});
let chartsContainer = ref();
const initCharts = () => {
	var myChart = echarts.init(chartsContainer.value, 'walden');
	var option;

	option = {
		title: {
			text: props.title,
			subtext: props.subtext,
			right: 30,
		},
		tooltip: {
			trigger: 'axis',
			// axisPointer: {
			//   type: 'cross'
			// },
			// padding: [5, 10]
		},
		grid: {
			left: '20',
			right: '50',
			bottom: '10',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: props.xData,
			show: props.isShowXAxis,
			axisLabel: {
				formatter: function (params) {
					let maxLen = 10;
					if (params.length > maxLen) {
						let val = params.substr(0, maxLen) + '...';
						return val;
					} else {
						return params;
					}
				},
				interval: 0,
				// rotate: 45
			},
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: '封禁IP个数',
				type: 'line',
				data: props.yData,
				smooth: true,
				animationDuration: 3000,
				animationEasing: 'cubicInOut',
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: 'rgba(96, 159, 250, .8)', // 0% 处的颜色
							},
							{
								offset: 1,
								color: 'rgba(96, 159, 250, .2)', // 100% 处的颜色
							},
						],
						global: false, // 缺省为 false
					},
				},
				itemStyle: {
					color: 'rgba(96, 159, 250, 1)', //折线点的颜色
					lineStyle: {
						color: 'rgba(96, 159, 250, .5)', //折线的颜色
					},
				},
			},
		],
	};

	option && myChart.setOption(option);
};
onMounted(() => {
	initCharts();
});
</script>
<style scoped></style>