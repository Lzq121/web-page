<template>
	<div>
		<div>
			<el-table
				v-if="isReload"
				:stripe="stripe"
				:height="tableHeight"
				@selection-change="handleSelectionChange"
				v-loading="loading"
				show-overflow-tooltip
				:data="list"
				:border="true"
				fit
			>
				<el-table-column v-if="isSelection" type="selection" width="40"> </el-table-column>
				<el-table-column v-if="isIndex" type="index" width="60" label="序号" align="center" :index="indexMethod"> </el-table-column>

				<el-table-column
					v-for="(item, index) in cols"
					:key="index"
					:fixed="item.fixed"
					:align="item.align ? item.align : 'center'"
					:label="item.title"
					:width="item.width"
				>
					<template v-if="index === cols.length - 1" #header>
						<div style="position: relative">
							{{ item.title }}
							<el-icon
								v-if="topColShow"
								@click="drawer = true"
								style="position: absolute; right: 0px; top: 5px; transform: rotate(90deg); cursor: pointer"
							>
								<MoreFilled></MoreFilled>
							</el-icon>
						</div>
					</template>

					<template #default="{ row }">
						<template v-if="item.dataIndex === 'statusT'">
							<el-switch
								v-model="row.statusNew"
								class="ml-2"
								inline-prompt
								style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
								active-text="开启"
								inactive-text="关闭"
								@change="modeFnChange(row)"
							/>
						</template>
						<template v-if="item.dataIndex === 'operate'">
							<slot :record="row"></slot>
						</template>
						<span v-else-if="item.dataIndex === 'tags' && Array.isArray(row.tags)">
							<el-tooltip class="item" v-if="row.tags.length > 1" effect="dark" placement="top">
								<template #content>
									<el-tag style="margin: 5px" v-for="(item, index) in row.tags" :key="index">
										{{ item }}
									</el-tag>
								</template>
								<el-tag> {{ row.tags[0] }}... </el-tag>
							</el-tooltip>
							<el-tag v-else-if="row.tags.length === 1">
								{{ row.tags[0] }}
							</el-tag>
							<span v-else></span>
						</span>
						<span v-else>
							<el-button size="small" v-if="item.isLink" link type="primary" @click="linkFun(row)">
								{{ row[item.dataIndex] }}
							</el-button>
							<span v-else-if="item.isTag">
								<span class="success tag-text" v-if="row[item.dataIndex] && row[item.dataIndex]['code'] === 1">
									{{ row[item.dataIndex]['value'] }}
								</span>
								<span class="warning tag-text" v-if="row[item.dataIndex] && row[item.dataIndex]['code'] === 2">
									{{ row[item.dataIndex]['value'] }}
								</span>
								<span class="danger tag-text" v-if="row[item.dataIndex] && row[item.dataIndex]['code'] === 3">
									{{ row[item.dataIndex]['value'] }}
								</span>
								<span class="info tag-text" v-if="row[item.dataIndex] && row[item.dataIndex]['code'] === 4">
									{{ row[item.dataIndex]['value'] }}
								</span>
								<span class="tag-text" v-if="row[item.dataIndex] && row[item.dataIndex]['code'] === 5">
									{{ row[item.dataIndex]['value'] }}
								</span>
								<span v-else></span>
							</span>
							<span v-else-if="item.isTagClick" style="cursor: pointer" @click="changeFun(row)">
								<el-tag effect="plain" type="success" v-if="row[item.dataIndex] && row[item.dataIndex]['code'] === 1">
									{{ row[item.dataIndex]['value'] }}
								</el-tag>
								<el-tag effect="plain" type="warning" v-else-if="row[item.dataIndex] && row[item.dataIndex]['code'] === 2">
									{{ row[item.dataIndex]['value'] }}
								</el-tag>
								<el-tag effect="plain" type="danger" v-else-if="row[item.dataIndex] && row[item.dataIndex]['code'] === 3">
									{{ row[item.dataIndex]['value'] }}
								</el-tag>
								<el-tag effect="plain" type="info" v-else-if="row[item.dataIndex] && row[item.dataIndex]['code'] === 4">
									{{ row[item.dataIndex]['value'] }}
								</el-tag>
								<el-tag effect="plain" v-else-if="row[item.dataIndex] && row[item.dataIndex]['code'] === 5">
									{{ row[item.dataIndex]['value'] }}
								</el-tag>
								<span v-else></span>
							</span>
							<span v-else>{{ row[item.dataIndex] }} </span>
						</span>
					</template>
				</el-table-column>
			</el-table>
			<div :style="`height: ${tableHeight}px;`" class="toggle-table-view" v-else>
				<el-icon class="icon">
					<Loading />
				</el-icon>
				<p class="text">系统视图切换，请稍候...</p>
			</div>
		</div>
		<div class="pagination-box" v-if="isShowPatination">
			<el-pagination
				background
				:disabled="total === 0 ? true : false"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-size="pageSize"
				:page-sizes="[10, 20, 30, 40, 50]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
			<el-button v-if="bottomColShow" @click="drawer = true" class="table-order" type="primary" icon="Operation" circle />
		</div>
		<el-drawer size="20%" v-model="drawer" title="选项">
			<div class="table-edit-box">
				<div class="col-checkbox-box">
					<el-checkbox-group v-model="checkedCols" :min="5">
						<div class="col-checkbox" v-for="item in columns" :key="item.dataIndex">
							<el-checkbox :disabled="item.dataIndex === 'operate'" :value="item.dataIndex">
								{{ item.title }}
							</el-checkbox>
						</div>
					</el-checkbox-group>
				</div>
				<div class="confirm-btn">
					<el-button @click="drawer = false"> 关 闭 </el-button>
					<el-button type="success" @click="reSet"> 还 原 </el-button>
					<el-button @click="confirmCol" type="primary"> 确 认 </el-button>
				</div>
			</div>
		</el-drawer>
	</div>
</template>
<script  setup lang="ts" >
import { log } from 'console';
import { onUnmounted, ref, onMounted, watch } from 'vue';
import * as api from '../api';
// 定义父组件传过来的值
const props = defineProps({
	columns: {
		type: Array<any>,
		default: () => [],
	},
	list: {
		//表格数据
		type: Array<any>,
		default: () => [],
	},
	loading: {
		//是否使用loading
		type: Boolean,
		default: false,
	},
	// 换行变色
	stripe: {
		type: Boolean,
		default: true,
	},
	isSelection: {
		//是否显示多选框
		type: Boolean,
		default: false,
	},
	// 表格高度
	height: {
		type: Number,
		default: 0,
	},
	// 是否需要序号
	isIndex: {
		type: Boolean,
		default: false,
	},
	// 是否显示顶部表头编辑
	topColShow: {
		type: Boolean,
		default: true,
	},
	// 是否显示底部表头编辑
	bottomColShow: {
		type: Boolean,
		default: false,
	},

	// 分页组件
	currentPage: {
		//当前页码
		type: Number,
		default: 1,
	},
	// 分页组件
	pageSize: {
		//当前页码
		type: Number,
		default: 30,
	},
	total: {
		type: Number,
		default: 0,
	},
	// 是否显示分页组件
	isShowPatination: {
		type: Boolean,
		default: true,
	},
});

let drawer = ref(false);
let modeFn = ref(true);
let checkedCols = ref<string[]>(['default']);
let cols = ref<any[]>([]);
const initCols = () => {
	checkedCols.value = [];
	cols.value = [];
	for (let index = 0; index < props.columns.length; index++) {
		const item = props.columns[index];
		if (item.hidden) {
			continue;
		}
		checkedCols.value.push(item.dataIndex);
		cols.value.push(item);
	}
};
watch(
	() => props.columns,
	(nex, prv) => {
		initCols();
	}
);

initCols();
const modeFnChange = async (val?: any) => {
	if (val.status == 0) {
		val.status = 1;
		val.update_status = true;
		let { data } = await api.UpdateObj(val);
		emits('getList');
	} else {
		val.status = 0;
		val.update_status = true;
		let { data } = await api.UpdateObj(val);
		emits('getList');
	}
};
const confirmCol = () => {
	let arr: any[] = [];
	props.columns.forEach((item: any) => {
		if (checkedCols.value.includes(item.dataIndex)) {
			arr.push(item);
		}
	});
	cols.value = arr;
	drawer.value = false;
};
const reSet = () => {
	if (props.columns.length === checkedCols.value.length) {
		drawer.value = false;
		return;
	}
	let checkArr: any[] = [];
	let arr: any[] = [];
	for (let index = 0; index < props.columns.length; index++) {
		const item = props.columns[index];
		if (item.hidden) {
			continue;
		}
		checkArr.push(item.dataIndex);
		arr.push(item);
	}
	checkedCols.value = checkArr;
	cols.value = arr;
	drawer.value = false;
};
// 定义子组件向父组件传值/事件
const emits = defineEmits(['linkFun', 'changeFun', 'handleSelectionChange', 'handleSizeChange', 'handleCurrentChange', 'getList']);
const selectable = (val: any) => {
	if (val.is_known !== '1') {
		return true;
	} else {
		return false;
	}
};
const linkFun = (val: any) => {
	emits('linkFun', val);
};
const changeFun = (val: any) => {
	emits('changeFun', val);
};
const handleSelectionChange = (val: any) => {
	emits('handleSelectionChange', val);
};
const indexMethod = (index: number) => {
	return index + 1;
};
const handleSizeChange = (val: number) => {
	//改变数据条目数量
	emits('handleSizeChange', val);
};
const handleCurrentChange = (val: number) => {
	//改变页码
	emits('handleCurrentChange', val);
};
let isReload = ref(true);
let tableHeight = props.height ? props.height : window.innerHeight - 280;
let timer: any = null;
let previousHeight: number = 0;
const onResize = () => {
	if (props.height) {
		return;
	}
	var currentHeight = window.innerHeight;
	if (timer || currentHeight === previousHeight) return;
	timer = setTimeout(() => {
		isReload.value = false;
		let fullScreenTimer: any = null;
		fullScreenTimer = setTimeout(() => {
			tableHeight = window.innerHeight - 280;
			previousHeight = currentHeight;
			isReload.value = true;
			if (fullScreenTimer) {
				clearTimeout(fullScreenTimer);
			}
		}, 1000);
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}, 500);
};

window.addEventListener('resize', onResize);
onUnmounted(() => {
	window.removeEventListener('resize', onResize);
});
</script>
<style lang="scss" scoped>
@keyframes rotate {
	to {
		transform: rotate(360deg);
	}
}

.toggle-table-view {
	--el-table-border-color: var(--el-border-color-lighter);
	--el-table-border: 1px solid var(--el-table-border-color);
	border: var(--el-table-border);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	color: #409eff;

	.icon {
		animation: rotate 2s forwards infinite linear;
		font-size: 20px;
	}

	.text {
		padding-top: 10px;
	}
}

.pagination-box {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	padding: 8px 30px;
	// margin: 0 5px;
	box-sizing: border-box;
	--el-table-bg-color: var(--el-fill-color-blank);
	background-color: var(--el-table-bg-color);
	--el-table-border-color: var(--el-border-color-lighter);
	--el-table-border: 1px solid var(--el-table-border-color);
	border: var(--el-table-border);
	position: relative;

	.table-order {
		position: absolute;
		right: 20px;
	}
}

.table-edit-box {
	height: 92vh;
	overflow: hidden;

	.col-checkbox-box {
		height: 85vh;
		overflow: auto;
		padding: 20px;
	}

	.confirm-btn {
		height: 7vh;
		line-height: 8vh;
		text-align: right;
		padding-right: 20px;
		--el-table-bg-color: var(--el-fill-color-blank);
		background-color: var(--el-table-bg-color);
		--el-table-border-color: var(--el-border-color-lighter);
		--el-table-border: 1px solid var(--el-table-border-color);
		border-top: var(--el-table-border);
	}
}

.tag-text {
	font-size: 13px;
	color: var(--el-color-primary);

	&::before {
		content: '';
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 4px;
		background-color: var(--el-color-primary);
		margin-right: 5px;
	}
}

.success {
	color: var(--el-color-success);

	&::before {
		background-color: var(--el-color-success);
	}
}

.warning {
	color: var(--el-color-warning);

	&::before {
		background-color: var(--el-color-warning);
	}
}

.danger {
	color: var(--el-color-danger);

	&::before {
		background-color: var(--el-color-danger);
	}
}

.info {
	color: var(--el-color-info);

	&::before {
		background-color: var(--el-color-info);
	}
}
</style>