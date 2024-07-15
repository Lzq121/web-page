
<script lang="ts" setup>
import { toRefs, reactive, onMounted, ref, watch, nextTick, onActivated } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';
let global: any = {
	homeChartOne: null,
	homeChartTwo: null,
	homeCharThree: null,
	dispose: [null, '', undefined],
};
const router = useRouter();
const route = useRoute();
const homeLineRef = ref();
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const state = ref({
	homeOne: [
		{
			num1: '125,12',
			num2: '12.32%',
			num3: '今日新增漏洞',
			num4: 'fa fa-meetup',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
			width: 6,
		},
		{
			num1: '125,65',
			num3: '待评估漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#6690F9',
			color2: '--next-color-warning-lighter',
			color3: '--el-color-warning',
			width: 5,
		},
		{
			num1: '125,65',
			num3: '待认领漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#6690F9',
			color2: '--next-color-warning-lighter',
			color3: '--el-color-warning',
			width: 5,
		},
		{
			num1: '125,65',
			num3: '处置中漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#6690F9',
			color2: '--next-color-warning-lighter',
			color3: '--el-color-warning',
			width: 4,
		},
		{
			num1: '125,65',
			num3: '待验证漏洞',
			num4: 'iconfont icon-zaosheng',
			color1: '#6690F9',
			color2: '--next-color-warning-lighter',
			color3: '--el-color-warning',
			width: 4,
		},
	],
	homeThree: [
		{
			icon: 'iconfont icon-yangan',
			label: '浅粉红',
			value: '2.1%OBS/M',
			iconColor: '#F72B3F',
		},
		{
			icon: 'iconfont icon-wendu',
			label: '深红(猩红)',
			value: '30℃',
			iconColor: '#91BFF8',
		},
		{
			icon: 'iconfont icon-shidu',
			label: '淡紫红',
			value: '57%RH',
			iconColor: '#88D565',
		},
		{
			icon: 'iconfont icon-shidu',
			label: '弱紫罗兰红',
			value: '107w',
			iconColor: '#88D565',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '中紫罗兰红',
			value: '57DB',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '紫罗兰',
			value: '57PV',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '暗紫罗兰',
			value: '517Cpd',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '幽灵白',
			value: '12kg',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '海军蓝',
			value: '64fm',
			iconColor: '#FBD4A0',
		},
	],
	myCharts: [],
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
});

// 折线图
const initLineChart = () => {
	if (!global.dispose.some((b: any) => b === global.homeChartOne)) global.homeChartOne.dispose();
	global.homeChartOne = <any>echarts.init(homeLineRef.value, state.value.charts.theme);
	const option = {
		backgroundColor: state.value.charts.bgColor,
		title: {
			text: '每日新增漏洞数量趋势',
			x: 'left',
			textStyle: { fontSize: '15', color: state.value.charts.color },
		},
		grid: { top: 70, right: 20, bottom: 30, left: 30 },
		tooltip: { trigger: 'axis' },
		legend: { data: ['预购队列', '最新成交价'], right: 0 },
		xAxis: {
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		},
		yAxis: [
			{
				type: 'value',
				splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
			},
		],
		series: [
			{
				name: '新增漏洞数量',
				type: 'line',
				symbolSize: 6,
				symbol: 'circle',
				smooth: true,
				data: [0, 41.1, 30.4, 65.1, 53.3, 53.3, 53.3, 41.1, 30.4, 65.1, 53.3, 10],
			},
		],
	};
	(<any>global.homeChartOne).setOption(option);
	(<any>state.value.myCharts).push(global.homeChartOne);
};

// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < state.value.myCharts.length; i++) {
			setTimeout(() => {
				(<any>state.value.myCharts[i]).resize();
			}, i * 1000);
		}
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时
onMounted(() => {
	initEchartsResize();
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
	initEchartsResizeFun();
});
// 监听 vuex 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
	() => isTagsViewCurrenFull.value,
	() => {
		initEchartsResizeFun();
	}
);
// 监听 vuex 中是否开启深色主题
watch(
	() => themeConfig.value.isIsDark,
	(isIsDark) => {
		nextTick(() => {
			state.value.charts.theme = isIsDark ? 'dark' : '';
			state.value.charts.bgColor = isIsDark ? 'transparent' : '';
			state.value.charts.color = isIsDark ? '#dadada' : '#303133';
			setTimeout(() => {
				initLineChart();
			}, 500);
		});
	},
	{
		deep: true,
		immediate: true,
	}
);
let params = ref({
	page: 1,
	limit: 30,
});
const hidden = true;
const columns = [
	{
		title: 'IP地址',
		dataIndex: '1',
		hidden,
	},

	{
		title: '所属业务系统',
		dataIndex: '2',
	},

	{
		title: '组件数据库',
		dataIndex: '3',
		hidden,
	},

	{
		title: '所属公司',
		dataIndex: '4',
		hidden,
	},

	{
		title: '所属部门',
		dataIndex: '5',
		hidden,
	},

	{
		title: '主机管理员',
		dataIndex: '6',
	},

	{
		title: '数据中心',
		dataIndex: '7',
	},

	{
		title: '机房',
		dataIndex: '8',
	},

	{
		title: '部署区域',
		dataIndex: '9',
		hidden,
	},

	{
		title: '结果',
		dataIndex: '10',
		hidden,
	},

	{
		title: '未通过项',
		dataIndex: '11',
		hidden,
	},

	{
		title: '操作',
		dataIndex: 'operate',
		width: 100,
		fixed: 'right',
	},
];
let list = ref([
	{ '2': '安全运营平台' },
	{ '2': '安全运营平台' },
	{ '2': '安全运营平台' },
	{ '2': '安全运营平台' },
	{ '2': '安全运营平台' },
	{ '2': '安全运营平台' },
]);
let total = ref(0);
const fetchTableData = () => {};
const handleSizeChange = (val: number) => {
	params.value.page = 1;
	params.value.limit = val;
	fetchTableData();
};
const handleCurrentChange = (val: number) => {
	params.value.page = val;
	fetchTableData();
};
const onSearch = () => {
	params.value.page = 1;
	fetchTableData();
};
const reSearch = () => {
	params.value = {
		page: 1,
		limit: 30,
	};
	fetchTableData();
};
//详情查看右侧弹出
let drawerOpen = ref(false);
const viewRow = (val: any) => {
	console.log(val);
	drawerOpen.value = true;
};
const handleSelectionChange = (val: any) => {
	console.log(val);
};
const defaultProps = {
	children: 'children',
	label: 'label',
};
const treeData = [
	{
		id: 1,
		label: 'Level one 1',
		children: [
			{
				id: 4,
				label: 'Level two 1-1',
				children: [
					{
						id: 9,
						label: 'Level three 1-1-1',
					},
					{
						id: 10,
						label: 'Level three 1-1-2',
					},
				],
			},
		],
	},
	{
		id: 2,
		label: 'Level one 2',
		children: [
			{
				id: 5,
				label: 'Level two 2-1',
			},
			{
				id: 6,
				label: 'Level two 2-2',
			},
		],
	},
	{
		id: 3,
		label: 'Level one 3',
		children: [
			{
				id: 7,
				label: 'Level two 3-1',
			},
			{
				id: 8,
				label: 'Level two 3-2',
			},
		],
	},
];
let isShowMoreSearch = ref(false);
</script>

<template>
  <div class="host-layout-layout">
    <div style="text-align:right;padding:10px;font-weight:bold">
      更新时间：2021-11-11 10:10:10
    </div>
    <el-row :gutter="15"
            class="home-card-one mb15">
      <el-col :xs="24"
              :sm="12"
              :md="12"
              :lg="v.width"
              :xl="v.width"
              v-for="(v, k) in state.homeOne"
              :key="k"
              :class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }">
        <div class="home-card-item flex">
          <div class="flex w100"
               :class="` home-one-animation${k}`">
            <div class="home-card-item-icon flex"
                 :style="{ background: `var(${v.color2})` }">
              <i class="flex-margin font32"
                 :class="v.num4"
                 :style="{ color: `var(${v.color3})` }"></i>
            </div>
            <div style="margin-left:10px">
              <div class="mt10">{{ v.num3 }}</div>
              <span class="font30">{{ v.num1 }}</span>
              <div v-if="v.num2"
                   style="margin-left:10px"
                   class="ml5 font16"
                   :style="{ color: v.color1 }">
                <span style="margin-right:5px;font-size:13px;color:gray">较昨日</span>{{ v.num2 }}
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15"
            class="home-card-two mb15">
      <el-col :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="24">
        <div class="home-card-item">
          <div style="height: 100%"
               ref="homeLineRef"></div>
        </div>
      </el-col>
    </el-row>
    <div class="table-container">
      <div class="form-container">
        <div class="form-title">
          <h3>基线漏洞列表</h3>
          <div class="button-box">
            <el-button link
                       type="primary"
                       icon="Plus">新 增</el-button>
            <el-button link
                       type="primary"
                       icon="Upload">导入数据</el-button>
            <el-button link
                       type="primary"
                       icon="Download">导出数据</el-button>
            <el-button link
                       type="primary"
                       icon="Download">下载模板</el-button>
            <el-button @click="router.push({path:'/leak-manage/host-leak/distribution-order',query:{'url':'/leak-manage/baseline-leak'}})">派发工单</el-button>
            <el-button type="primary"
                       @click="onSearch"
                       icon="Search">搜 索</el-button>
            <el-button type="primary"
                       @click="reSearch"
                       plain
                       icon="RefreshRight">重 置</el-button>
            <el-button @click="isShowMoreSearch = !isShowMoreSearch"
                       :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
              {{ isShowMoreSearch ? "收起" : "展开" }}
            </el-button>
          </div>
        </div>
        <div class="form-params"
             :style="isShowMoreSearch ? 'height:100%' : 'height:60px'">
          <el-form :inline="true"
                   :model="params">
            <el-form-item label="关键字">
              <el-input v-model="params.class_name"
                        clearable
                        placeholder='请输入漏洞名称关键字' />
            </el-form-item>
            <el-form-item label="数据中心">
              <el-select v-model="params.is_use">
                <el-option label="是"
                           :value="true" />
                <el-option label="否"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="部署区域">
              <el-select v-model="params.is_use">
                <el-option label="是"
                           :value="true" />
                <el-option label="否"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="漏洞状态">
              <el-select v-model="params.is_use"
                         multiple
                         collapse-tags>
                <el-option label="新发现"
                           :value="1" />
                <el-option label="已评估"
                           :value="2" />
                <el-option label="已通知"
                           :value="3" />
                <el-option label="已认领"
                           :value="4" />
                <el-option label="待验证"
                           :value="5" />
                <el-option label="已修复"
                           :value="6" />
                <el-option label="已超时"
                           :value="7" />
              </el-select>
            </el-form-item>
            <el-form-item label="漏洞类型">
              <el-select v-model="params.is_use"
                         multiple
                         collapse-tags>
                <el-option label="操作系统漏洞"
                           :value="1" />
                <el-option label="应用漏洞"
                           :value="2" />
                <el-option label="中间件漏洞"
                           :value="3" />
                <el-option label="数据库漏洞"
                           :value="4" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属公司">
              <el-select v-model="params.is_use">
                <el-option label="是"
                           :value="true" />
                <el-option label="否"
                           :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item label="漏洞来源"
                          multiple
                          collapse-tags>
              <el-select v-model="params.is_use">
                <el-option label="漏洞情报"
                           :value="1" />
                <el-option label="扫描工具"
                           :value="2" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-row :gutter="15"
              class="home-card-two mb15">
        <el-col :xs="24"
                :sm="8"
                :md="8"
                :lg="4"
                :xl="4">
          <div class="tree-box">
            <div style="margin-bottom:20px">
              <el-input placeholder="Please Input"
                        suffix-icon="Search" />
            </div>
            <el-tree :data="treeData"
                     show-checkbox
                     node-key="id"
                     :default-expanded-keys="[2, 3]"
                     :default-checked-keys="[5]"
                     :props="defaultProps" />
          </div>
        </el-col>
        <el-col :xs="24"
                :sm="16"
                :md="16"
                :lg="20"
                :xl="20">
          <div class="table-box">
            <table-unit :height="500"
                        :pageSize="params.limit"
                        :currentPage="params.page"
                        :isSelection="true"
                        @handleSelectionChange="handleSelectionChange"
                        :columns="columns"
                        :list="list"
                        :total="total"
                        @handleSizeChange="handleSizeChange"
                        @handleCurrentChange="handleCurrentChange">
              <template v-slot="record">
                <el-button type="primary"
                           size="small"
                           link
                           @click="viewRow(record.record)">详 情</el-button>
              </template>
            </table-unit>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-drawer v-model="drawerOpen"
               size="45%"
               title="基线漏洞详情">
      <div>
        <dl class="dl-container">
          <dt class="dl-title blue-triangle">基线漏洞信息
            <el-button style="margin-left:20px"
                       type="danger">添加到误报库</el-button>
          </dt>
          <dd class="dl-content">
            <table class="m_table">
              <tr>
                <td>IP地址</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>所属业务系统</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>组件\数据库</td>
                <td style="color:orange">12212</td>
              </tr>
              <tr>
                <td>所属公司</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>所属部门</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>主机管理员</td>
                <td style="color:red">12212</td>
              </tr>
              <tr>
                <td>数据中心</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>机房</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>部署区域</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>结果</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>未通过项</td>
                <td>12212</td>
              </tr>
            </table>
          </dd>
        </dl>
        <dl class="dl-container">
          <dt class="dl-title blue-triangle">受影响资产信息</dt>
          <dd class="dl-content">
            <table class="m_table">
              <tr>
                <td>URL</td>
                <td>12212</td>
                <td>站点</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>所属业务系统</td>
                <td>12212</td>
                <td>组件/数据库</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>资产大类</td>
                <td>12212</td>
                <td>资产类型</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>组件/数据库</td>
                <td>12212</td>
                <td>组件/数据库版本</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>所属公司</td>
                <td>12212</td>
                <td>所属处室</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>应用管理员</td>
                <td>12212</td>
                <td>中间件管理员</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>数据库管理员</td>
                <td>12212</td>
                <td>主机管理员</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>安全接口人</td>
                <td>12212</td>
                <td>数据中心</td>
                <td>12212</td>
              </tr>
              <tr>
                <td>机房</td>
                <td>12212</td>
                <td>部署区域</td>
                <td>12212</td>
              </tr>
            </table>
          </dd>
        </dl>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
$homeNavLengh: 8;

.host-layout-layout {
	height: calc(100vh - 100px);
	padding: 10px;
	padding-bottom: 0px;
	overflow: auto;

	.home-card-one,
	.home-card-two {
		.home-card-item {
			width: 100%;
			height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);

			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}

			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;

				i {
					color: var(--el-text-color-placeholder);
				}
			}

			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
		}
	}

	.home-card-one {
		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/10) + s;
			}
		}
	}

	.home-card-two {
		.home-card-item {
			height: 400px;
			width: 100%;
			overflow: hidden;

			.home-monitor {
				height: 100%;

				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;

					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;

						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}

					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
		}
	}
}

.tree-box {
	margin-left: 10px;
	height: 550px;
	background-color: var(--el-fill-color-blank);
	padding: 10px;
	overflow: auto;
}

.dl-container {
	margin: 10px;
	padding: 10px;
	.dl-title {
		font-weight: bold;
		margin-bottom: 10px;
	}
	.dl-content {
		td:nth-child(odd) {
			width: 150px;
			color: gray;
		}
	}
}
</style>
