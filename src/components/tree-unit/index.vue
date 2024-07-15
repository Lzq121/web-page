<template>
  <div class="tree-layout">
    <div class="tree-container"
         :style="show ? 'width:220px;padding:5px;margin-left:10px' : 'width:0px;opacity: 0;'">
      <el-input v-model="filterText"
                @input="filterTextFn"
                suffix-icon="Search"
                placeholder="搜索" />
      <div class="select-box">
        <span class="title">
          视角：
        </span>
        <el-select style="min-width:60px"
                   @change="changeTreeData"
                   v-model="selectValue"
                   :disabled="selectDisabled">
          <el-option v-for="item in selectData"
                     :key="item.value"
                     :label="item.label"
                     :disabled="item.disabled"
                     :value="item.value" />
        </el-select>
      </div>
      <div class="tree-box">
        <el-tree ref="treeRef"
                 class="filter-tree"
                 :data="treeData"
                 :disabled="true"
                 :props="treeProps"
                 :filter-node-method="filterNode"
                 @node-click="onClickTree" />
      </div>
    </div>
    <div class="arrow-icon">
      <el-icon :style="show ? 'transform: rotate(0deg);':'transform: rotate(180deg);'"
               @click="show = !show">
        <ArrowLeftBold />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElTree } from 'element-plus';
const props = defineProps({
	treeData: {
		type: Array,
		default: [],
	},
	selectData: {
		type: Array,
		default: [
			{ value: '1', label: '数据中心' },
			{ value: '2', label: '系统名称' },
			{ value: '3', label: '归属公司', disabled: true },
		],
	},
	value: {
		type: String,
		default: '1',
	},
	selectDisabled: {
		type: Boolean,
		default: false,
	},
});
const treeProps = {
	children: 'children',
	label: 'label',
	disabled: 'disabled',
};
const selectValue = ref(props.value);

const show = ref(true);

const emits = defineEmits(['onClickTree', 'changeTreeData']);
const treeRef = ref<InstanceType<typeof ElTree>>();
let filterText = ref('');
const filterTextFn = () => {
	treeRef.value!.filter(filterText.value);
};
const filterNode = (value: string, data: any) => {
	if (!value) return true;
	return data.label.includes(value);
};
const onClickTree = async (_: any, node: any) => {
	const data = { data1: '', data2: '' };
	if (Array.isArray(node.data.children) && node.data.children.length > 0) {
		if (node.data.not_click) {
			return;
		}
		data.data1 = node.data.label;
		data.data2 = '';
	} else {
		if (node.parent.not_click) {
			return;
		}
		if (node.parent.label) {
			data.data1 = node.parent.label;
			data.data2 = node.data.label;
		} else {
			data.data1 = node.data.label;
			data.data2 = '';
		}
	}
	if (data.data1) {
		data.data1 = data.data1.replace(/\(\d+\)/g, '');
	}
	if (data.data2) {
		data.data2 = data.data2.replace(/\(\d+\)/g, '');
	}
	emits('onClickTree', data);
};

const changeTreeData = (val: string) => {
	emits('changeTreeData', val);
};
</script>

<style lang="scss" scoped>
.tree-layout {
	display: flex;
}
.tree-container {
	height: 67.5vh;
	background-color: var(--el-fill-color-blank);
	overflow: hidden;
	transition: width 0.5s;
}
.tree-box {
	height: 54vh;
	overflow: auto;
	opacity: 1;
	transition: width 0.5s;
}
.select-box {
	display: flex;
	margin: 10px 0;
	align-items: center;
	.title {
		font-weight: bold;
		color: var(--el-text-color-primary);
		width: 80px;
	}
}

.arrow-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	margin-left: -6px;
	:deep(.el-icon) {
		color: var(--el-text-color-primary);
		cursor: pointer;
	}
}
</style>