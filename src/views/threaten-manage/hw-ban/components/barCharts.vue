<template>
  <div ref="chartsContainer"
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
		default: '400px',
	},
	xData: {
		type: Array,
		default: [],
	},
	title: {
		type: String,
		default: '',
	},
	subtext: {
		type: String,
		default: '',
	},
	yData: {
		type: Array,
		default: [],
	},
	isEvent: {
		type: Boolean,
		default: false,
	},
	isShowXAxis: {
		type: Boolean,
		default: true,
	},
});
const emits = defineEmits(['barEvent']);
let chartsContainer = ref();
const initCharts = () => {
	var myChart = echarts.init(chartsContainer.value, 'walden');
	var option;

	option = {
		title: {
			text: props.title,
			subtext: props.subtext,
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		grid: {
			left: '20',
			right: '20',
			bottom: '10',
			containLabel: true,
		},
		xAxis: {
			show: props.isShowXAxis,
			type: 'category',
			data: props.xData,
			axisLabel: {
				formatter: function (params) {
					let maxLen = 14;
					if (params.length > maxLen) {
						let val = params.substr(0, maxLen) + '...';
						return val;
					} else {
						return params;
					}
				},
				interval: 0,
				// rotate: 45,
			},
			axisTick: {
				show: false,
			},
			axisLine: {
				show: false,
			},
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				data: props.yData,
				type: 'bar',
				barWidth: '30',
				name: '总量',
				animationDuration: 3000,
				itemStyle: {
					borderType: 'solid',
					borderColor: '#73c0de',
					shadowColor: '#5470c6',
					label: {
						show: true, //开启显示
						position: 'top', //在上方显示
						textStyle: {
							//数值样式
							color: '#3fb1e3',
							fontSize: 16,
						},
					},
				},
			},
		],
	};

	option && myChart.setOption(option);

	if (props.isEvent) {
		myChart.getZr().on('mousemove', (param) => {
			var pointInPixel = [param.offsetX, param.offsetY];
			if (myChart.containPixel('grid', pointInPixel)) {
				//若鼠标滑过区域位置在当前图表范围内 鼠标设置为小手
				myChart.getZr().setCursorStyle('pointer');
			} else {
				myChart.getZr().setCursorStyle('default');
			}
		});

		myChart.getZr().on('click', (params) => {
			const pointInPixel = [params.offsetX, params.offsetY];
			if (myChart.containPixel('grid', pointInPixel)) {
				let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY]); // [点击的数字，数据索引]
				let data = props.xData[xIndex[0]];
				// console.log(data);
				emits('barEvent', data);
			}
		});
	}
};
onMounted(() => {
	initCharts();
});
</script>
<style scoped></style>