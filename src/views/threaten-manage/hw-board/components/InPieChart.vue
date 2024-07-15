<template>
  <div ref="pieInCharts"
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
	subtext: {
		type: String,
		default: '',
	},
	inData: {
		type: Array,
		default: () => [],
	},
	outData: {
		type: Array,
		default: () => [],
	},
	outLegendData: {
		type: Array,
		default: () => [],
	},
	isIsDark: {
		type: Boolean,
		default: false,
	},
});
let pieInCharts = ref();
const initCharts = () => {
	let isIsDark = props.isIsDark ? 'dark' : '';
	let backgroundColor = props.isIsDark ? 'transparent' : '';
	var myChart = echarts.init(pieInCharts.value, isIsDark); //添加参数，使用内置主题
	var option;

	option = {
		backgroundColor,
		title: {
			text: props.title,
			subtext: props.subtext,
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)',
		},
		legend: {
			type: 'scroll',
			orient: 'vertical',
			right: 10,
			top: 20,
			bottom: 20,
			data: props.outLegendData,
		},
		series: [
			{
				name: '事件威胁统计',
				type: 'pie',
				selectedMode: 'single',
				radius: [10, '35%'],
				center: ['40%', '50%'],
				label: {
					show: true,
					position: 'inner', //将百分比显示在饼图内部
					color: '#fff',
					fontSize: 13,
					formatter: '{b} \n ({d}%) ',
					fontWeight: 'bold',
				},
				labelLine: {
					show: false,
				},
				data: props.inData,
			},
			{
				name: '提单数量',
				type: 'pie',
				radius: ['45%', '55%'],
				center: ['40%', '50%'],
				label: {
					show: true, //去除饼图的指示标签
				},
				data: props.outData,
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