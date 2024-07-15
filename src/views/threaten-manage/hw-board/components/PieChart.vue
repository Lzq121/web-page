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
		default: '300px',
	},
	title: {
		type: String,
		default: '',
	},
	data: {
		type: Array,
		default: () => [],
	},
	isIsDark: {
		type: Boolean,
		default: false,
	},
});
const chartRef = ref();
const initCharts = () => {
	let isIsDark = props.isIsDark ? 'dark' : '';
	let backgroundColor = props.isIsDark ? 'transparent' : '';
	let chart = echarts.init(chartRef.value, isIsDark);
	chart.setOption({
		backgroundColor,
		title: {
			text: props.title,
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} ({d}%)',
		},
		legend: {
			top: '0%',
			left: '220',
			type: 'scroll',
		},
		series: [
			{
				name: '提单数量',
				type: 'pie',
				center: ['50%', '54%'],
				data: props.data,
				animationEasing: 'cubicInOut',
				animationDuration: 3000,
				label: {
					show: true,
					// position: 'inner',  //将百分比显示在饼图内部
					// color: '#fff',
					// fontSize: 13,
					formatter: '{b}\n {d}%',
					// formatter: '{b}【{c}条】\n {d}%',
					// fontWeight: 'bold',
				},
				// animationDuration: 3500,
				// animationEasing: 'quadraticOut'
			},
		],
	});
};
onMounted(() => {
	initCharts();
});
</script>
