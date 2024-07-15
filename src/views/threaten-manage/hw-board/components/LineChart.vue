<template>
  <div ref="chartRef"
       :style="{ height, width }" />
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
		default: '50vh',
	},
	title: {
		type: String,
		default: '',
	},
	subtitle: {
		type: String,
		default: '',
	},
	autoResize: {
		type: Boolean,
		default: true,
	},
	chartData: {
		type: Object,
		required: true,
	},
	xData: {
		type: Array,
		default: () => [],
	},
	isIsDark: {
		type: Boolean,
		default: false,
	},
});
let chartRef = ref();
const initCharts = () => {
	let isIsDark = props.isIsDark ? 'dark' : '';
	let backgroundColor = props.isIsDark ? 'transparent' : '';
	var myChart = echarts.init(chartRef.value, isIsDark);
	const { redLineData, greenLineData, blueLineData, yellowLineData } = props.chartData;
	const chartType = 'bar';
	const labelOption = {
		show: true,
		// formatter: '{c}{a}',
		position: 'top',
		// fontSize: 16,
		// rotate: 90,
		// align: 'left',
		// verticalAlign: 'middle',
		// position: 'inside',
		// distance: 15,
		// rich: {
		//   name: {}
		// }
	};
	var option;
	option = {
		backgroundColor,
		title: {
			text: props.title,
			subtext: props.subtitle,
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {
			data: ['封禁工单数量', '解封工单数量', '事件处置', '封禁IP数量'],
		},
		grid: {
			left: 20,
			right: 50,
			bottom: 20,
			top: 80,
			containLabel: true,
		},
		toolbox: {
			show: true,
			orient: 'horizontal',
			right: '25',
			top: 'top',
			feature: {
				mark: { show: true },
				// dataView: { show: true, readOnly: false },
				// magicType: { show: true, type: ['line', 'bar', 'stack'] },
				magicType: { show: true, type: ['bar', 'line'] },
				// restore: { show: true },
				saveAsImage: { show: true },
			},
		},
		xAxis: {
			type: 'category',
			axisTick: { show: false },
			data: props.xData,
			// show: true,
			// axisLabel: {
			//   formatter: function (params) {
			//     let maxLen = 10
			//     if (params.length > maxLen) {
			//       let val = params.substr(0, maxLen) + '...';
			//       return val;
			//     } else {
			//       return params;
			//     }
			//   },
			//   interval: 0,
			//   // rotate: 45
			// },
		},
		yAxis: [
			{
				type: 'value',
				axisLabel: {
					show: true,
				},
			},
		],
		series: [
			{
				name: '封禁工单数量',
				itemStyle: {
					color: '#FF005A',
				},
				// smooth: true,
				type: chartType,
				barWidth: 15,
				emphasis: {
					focus: 'series',
				},
				data: redLineData,
				animationDuration: 3000,
				animationEasing: 'cubicInOut',
				label: labelOption,
				// markPoint: {
				//   data: [
				//     { type: 'max', name: 'Max' },
				//     { type: 'min', name: 'Min' }
				//   ]
				// },
				// markLine: {
				//   data: [{ type: 'average', name: 'Avg' }]
				// },
			},
			{
				name: '解封工单数量',
				barWidth: 15,
				data: greenLineData,
				type: chartType,
				emphasis: {
					focus: 'series',
				},
				itemStyle: {
					color: '#67C23A',
				},
				animationDuration: 3000,
				animationEasing: 'quadraticOut',
				label: labelOption,
			},
			{
				name: '事件处置',
				data: blueLineData,
				type: chartType,
				barWidth: 15,
				emphasis: {
					focus: 'series',
				},
				label: labelOption,
				itemStyle: {
					color: '#409EFF',
				},
				animationDuration: 3000,
				animationEasing: 'quadraticOut',
			},

			{
				name: '封禁IP数量',
				data: yellowLineData,
				type: chartType,
				emphasis: {
					focus: 'series',
				},
				barWidth: 15,
				label: labelOption,
				itemStyle: {
					color: '#E6A23C',
				},
				animationDuration: 3000,
				animationEasing: 'quadraticOut',
			},
		],
	};

	option && myChart.setOption(option);
};
onMounted(() => {
	initCharts();
});
</script>
