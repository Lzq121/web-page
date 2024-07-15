<script lang="ts" setup>
import { ref } from 'vue';

import importExcel from '@/components/importExcel/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import apis from './api';
const router = useRouter();
const route = useRoute();
let startAndendTime = ref([]);
let params: any = ref({
	page: 1,
	limit: 30,
	name: '',
	site: '',
	url: '',
	source: '',
	severity: '',
	disposer: '',
	company: '',
	disposer_room: '',
	assess_status: '',
	create_start_time: '', //
	create_end_time: '', //
	scan_person: '', //
	time_out: '', //
	protection_status: '', //
});

const hightLeak = (val: any, str: any, company: any) => {
	router.push({
		path: '/leak-manage/leak-ledger/penetra-leak/page/penetra-detail',
		query: { hightLeak: val, company: company == '总计' ? '' : company, status: str, source: activeName.value == 'first' ? '互联网' : '内网' },
	});
};



const tableDataList = ref([]);
const fetchTableData = async () => {
	params.value.create_end_time = startAndendTime.value[1];
	let res = await apis.getLoopholeCount();
	tableDataList.value = res.data;
};
fetchTableData();

// 资源类型下拉框
let resourcetypeDict = ref();
const getResourcetypeDict = async () => {
	let res = await apis.getResourcetypeDictApi();
	resourcetypeDict.value = res.data;
};
getResourcetypeDict();
// 资源类型下拉框
let classNameDict = ref();
const getClassNameDict = async () => {
	let res = await apis.getClassNameDictApi();
	classNameDict.value = res.data;
};
getClassNameDict();

// 获取数据中心
let areaDict = ref();
const getAreaInfo = async () => {
	let res = await apis.getAreaInfoApi();
	areaDict.value = res.data;
};
getAreaInfo();

const activeName = ref('first');

const tableHeight = window.innerHeight - 170;
</script>

<template>
	<div class="host-layout-layout">
		
		<el-tabs v-model="activeName" class="demo-tabs" >
			<el-tab-pane label="互联网应用" name="first" >
				<el-table
					:data="tableDataList"
					:height="tableHeight"
					:header-cell-style="{ 'text-align': 'center', background: 'transparent' }"
					:cell-style="{ 'text-align': 'center' }"
				>
					<el-table-column prop="company" label="归属单位" width="100" />
					<el-table-column prop="site_count" label="系统数量" width="100"> </el-table-column>
					<el-table-column label="高危">
						<el-table-column label="累计发现">
							<template #default="scope">
								<el-button link type="primary" :disabled="!scope.row.high_severity_counts" @click="hightLeak('高危', '', scope.row.company)">{{
									scope.row.high_severity_counts
								}}</el-button>
							</template>
						</el-table-column>
						<el-table-column label="已修复">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.solve_high_severity_counts"
									@click="hightLeak('高危', '已修复', scope.row.company)"
									>{{ scope.row.solve_high_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
						<el-table-column label="残余">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.wait_high_severity_counts"
									@click="hightLeak('高危', '残余', scope.row.company)"
									>{{ scope.row.wait_high_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="中危">
						<el-table-column label="累计发现">
							<template #default="scope">
								<el-button link type="primary" :disabled="!scope.row.medium_severity_counts" @click="hightLeak('中危', '', scope.row.company)">{{
									scope.row.medium_severity_counts
								}}</el-button>
							</template>
						</el-table-column>
						<el-table-column label="已修复">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.solve_medium_severity_counts"
									@click="hightLeak('中危', '已修复', scope.row.company)"
									>{{ scope.row.solve_medium_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
						<el-table-column label="残余">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.wait_medium_severity_counts"
									@click="hightLeak('中危', '残余', scope.row.company)"
									>{{ scope.row.wait_medium_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
					</el-table-column>

					<el-table-column label="低危">
						<el-table-column label="累计发现">
							<template #default="scope">
								<el-button link type="primary" :disabled="!scope.row.low_severity_counts" @click="hightLeak('低危', '', scope.row.company)">{{
									scope.row.low_severity_counts
								}}</el-button>
							</template>
						</el-table-column>
						<el-table-column label="已修复">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.solve_low_severity_counts"
									@click="hightLeak('低危', '已修复', scope.row.company)"
									>{{ scope.row.solve_low_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
						<el-table-column label="残余" width="100">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.wait_low_severity_counts"
									@click="hightLeak('低危', '残余', scope.row.company)"
									>{{ scope.row.wait_low_severity_counts }}</el-button
								>
							</template>
						</el-table-column></el-table-column
					>
				</el-table></el-tab-pane
			>
			<el-tab-pane label="内网应用" name="second">
				<el-table
					:data="tableDataList"
					:height="tableHeight"
					:header-cell-style="{ 'text-align': 'center', background: 'transparent' }"
					:cell-style="{ 'text-align': 'center' }"
				>
					<el-table-column prop="company" label="归属单位" width="100" />
					<el-table-column label="系统数量" width="100"
						><template #default="scope">
							<span>{{ scope.row.inner_site_count }}</span>
						</template></el-table-column
					>
					<el-table-column label="高危">
						<el-table-column label="累计发现">
							<template #default="scope">
								<el-button link type="primary" :disabled="!scope.row.inner_high_severity_counts" @click="hightLeak('高危', '', scope.row.company)">{{
									scope.row.inner_high_severity_counts
								}}</el-button>
							</template>
						</el-table-column>
						<el-table-column label="已修复">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.inner_solve_high_severity_counts"
									@click="hightLeak('高危', '已修复', scope.row.company)"
									>{{ scope.row.inner_solve_high_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
						<el-table-column label="残余">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.inner_wait_high_severity_counts"
									@click="hightLeak('高危', '残余', scope.row.company)"
									>{{ scope.row.inner_wait_high_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="中危">
						<el-table-column label="累计发现">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.inner_medium_severity_counts"
									@click="hightLeak('中危', '', scope.row.company)"
									>{{ scope.row.inner_medium_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
						<el-table-column label="已修复">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.inner_solve_medium_severity_counts"
									@click="hightLeak('中危', '已修复', scope.row.company)"
									>{{ scope.row.inner_solve_medium_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
						<el-table-column label="残余">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.inner_wait_medium_severity_counts"
									@click="hightLeak('中危', '残余', scope.row.company)"
									>{{ scope.row.inner_wait_medium_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
					</el-table-column>

					<el-table-column label="低危">
						<el-table-column label="累计发现">
							<template #default="scope">
								<el-button link type="primary" :disabled="!scope.row.inner_low_severity_counts" @click="hightLeak('低危', '', scope.row.company)">{{
									scope.row.inner_low_severity_counts
								}}</el-button>
							</template>
						</el-table-column>
						<el-table-column label="已修复">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.inner_solve_low_severity_counts"
									@click="hightLeak('低危', '已修复', scope.row.company)"
									>{{ scope.row.inner_solve_low_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
						<el-table-column label="残余" width="100">
							<template #default="scope">
								<el-button
									link
									type="primary"
									:disabled="!scope.row.inner_wait_low_severity_counts"
									@click="hightLeak('低危', '残余', scope.row.company)"
									>{{ scope.row.inner_wait_low_severity_counts }}</el-button
								>
							</template>
						</el-table-column>
					</el-table-column>

					<template #empty> 暂无数据，<el-button type="primary" @click="hightLeak('', '', '')" link>点击进入详情页导入数据</el-button> </template>
				</el-table></el-tab-pane
			>
		</el-tabs>
	</div>
</template>

<style scoped lang="scss">
$homeNavLengh: 8;

.is-select {
	box-shadow: inset 0 0 5px #409eff;
}
.host-layout-layout {
	height: calc(100vh - 100px);
	padding: 10px;
	padding-bottom: 0px;
	overflow: auto;
	.home-card-one,
	.home-card-two {
		.home-card-item {
			cursor: pointer;
			width: 100%;
			height: 70px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 10px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);

			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}

			&-icon {
				width: 30px;
				height: 30px;
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
