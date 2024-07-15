<template>
  <div ref="borizontalBarChart"
       :style="{ height, width }">

  </div>
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
		default: '300px',
	},
	title: {
		type: String,
		default: '',
	},
	showXAxis: {
		type: Boolean,
		default: true,
	},
	yData: {
		type: Array,
		default: () => [],
	},
	data: {
		type: Object,
		default: () => {
			return {};
		},
	},
	isIsDark: {
		type: Boolean,
		default: false,
	},
});
let borizontalBarChart = ref();
const initCharts = () => {
	let isIsDark = props.isIsDark ? 'dark' : '';
	let backgroundColor = props.isIsDark ? 'transparent' : '';
	var myChart = echarts.init(borizontalBarChart.value, isIsDark);

	var option;

	option = {
		backgroundColor,
		title: {
			text: props.title,
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				// Use axis to trigger tooltip
				type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
			},
		},
		legend: {
			right: '30',
			data: ['处置工单', '研判工单', '监控工单', '封禁工单'],
		},
		grid: {
			left: '2%',
			right: '5%',
			bottom: '1%',
			containLabel: true,
		},
		xAxis: {
			type: 'value',
		},
		yAxis: {
			type: 'category',
			data: props.yData,
		},
		series: [
			{
				//新的一个柱子 注意不设stack
				name: '工单总量',
				type: 'bar',
				barGap: '-100%', // 左移100%，stack不再与上面两个在一列
				label: {
					show: true, //显示数值
					position: 'right', //  位置设为top
					formatter: '{c}',
					// color: '#000',
					// textStyle: { }, //设置数值颜色
				},
				itemStyle: {
					color: '#df2d72', // 设置背景颜色为透明
				},
				data: props.data.totalData,
			},
			{
				name: '处置工单',
				type: 'bar',
				stack: 'total',
				// label: {
				//   show: true
				// },
				// emphasis: {
				//   focus: 'series'
				// },
				data: props.data.data1,
			},
			{
				name: '研判工单',
				type: 'bar',
				stack: 'total',
				// label: {
				//   show: true
				// },
				// emphasis: {
				//   focus: 'series'
				// },
				data: props.data.data2,
			},
			{
				name: '监控工单',
				type: 'bar',
				stack: 'total',
				// label: {
				//   show: true
				// },
				// emphasis: {
				//   focus: 'series'
				// },
				data: props.data.data3,
			},
			{
				name: '封禁工单',
				type: 'bar',
				stack: 'total',
				// label: {
				//   show: true
				// },
				// emphasis: {
				//   focus: 'series'
				// },
				data: props.data.data4,
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