<template>
  <div ref="pieCharts"
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
	data: {
		type: Array,
		default: () => [],
	},
	total: {
		type: Number,
		default: 0,
	},
	isIsDark: {
		type: Boolean,
		default: false,
	},
});
let pieCharts = ref();
const initCharts = () => {
	let isIsDark = props.isIsDark ? 'dark' : '';
	let backgroundColor = props.isIsDark ? 'transparent' : '';
	var myChart = echarts.init(pieCharts.value, isIsDark);
	var option;

	option = {
		backgroundColor,
		title: {
			text: props.title,
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			top: '0%',
			left: '200',
			type: 'scroll',
		},
		graphic: [
			{
				type: 'text', // 类型，可以是文字、图片或其它类型
				id: 'text1',
				left: 'center',
				top: '50%',
				style: {
					text: '总数',
					fill: '#919399', // 文字的颜色
					fontSize: 20,
				},
			},
			{
				type: 'text',
				id: 'text2',
				left: 'center',
				top: '58%',
				style: {
					text: props.total,
					fill: '#f36666',
					fontSize: 30,
					fontWeight: 'bold',
				},
			},
		],

		series: [
			{
				name: '数量',
				type: 'pie',
				radius: ['40%', '60%'],
				center: ['50%', '56%'],
				label: {
					alignTo: 'edge',
					formatter: '{b}\n\n\n\n{d} %',
					minMargin: 15,
					edgeDistance: 20,
					lineHeight: 5,
					rich: {
						time: {
							fontSize: 10,
							color: '#999',
						},
					},
				},
				labelLine: {
					length: 30,
					length2: 5,
					maxSurfaceAngle: 30,
				},
				labelLayout: function (params) {
					const isLeft = params.labelRect.x < myChart.getWidth() / 2;
					const points = params.labelLinePoints;
					// Update the end point.
					points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
					return {
						labelLinePoints: points,
					};
				},
				data: props.data,
				animationDuration: 3500,
				animationEasing: 'quadraticOut',
			},
		],
	};

	option && myChart.setOption(option);
	// window.addEventListener("resize", function () {
	//   myChart.resize();
	// });
};
onMounted(() => {
	initCharts();
});
</script>
<style scoped></style>