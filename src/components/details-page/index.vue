<!-- 
全局详情界面功能介绍：
@back：点击返回后的事件
title:顶部返回头的名称
desc：顶部返回头的描述
height：content的高度
isLoadContent：是否加载content组件
isLoadTitle：是否加载顶部返回头
 -->
<template>
  <div class="details-page-layout">
    <slot name="title"
          v-if="isLoadTitle">
      <div class="back-index">
        <el-page-header @back="back"
                        icon="ArrowLeft">
          <template #content>
            <span class="desc-title"> {{title}} </span>
            <i class="desc">{{desc}}</i>
            <span class="add-left">
              <slot name="left"></slot>
            </span>
          </template>
          <template #extra>
            <div style="padding-right:20px">
              <slot name="right"></slot>
            </div>
          </template>
        </el-page-header>
      </div>
    </slot>
    <div v-if="isLoadContent"
         class="page-content-layout"
         :style="{height}">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
	isLoadContent: {
		type: Boolean,
		default: true,
	},
	isLoadTitle: {
		type: Boolean,
		default: true,
	},
	title: {
		type: String,
		default: '',
	},
	desc: {
		type: String,
		default: '',
	},
	height: {
		type: String,
		default: 'calc(100vh - 140px)',
	},
});
const emits = defineEmits(['back']);
const back = () => {
	emits('back');
};
</script>

<style lang="scss" scoped>
.details-page-layout {
	.page-content-layout {
		padding: 10px;
		overflow: auto;
	}

	.back-index {
		padding: 10px;
		border-bottom: 1px solid var(--el-border-color);
		background-color: var(--el-fill-color-blank);
		.desc {
			font-size: 13px;
			margin-left: 20px;
			color: gray;
		}
		.add-left {
			display: inline-block;

			margin-left: 20px;
			border-left: 1px var(--el-border-color) var(--el-border-style);
			padding-left: 10px;
		}

		:deep(.el-page-header__back) {
			color: #1492ff;
		}

		:deep(.el-page-header__main) {
			display: none;
		}
	}
}
</style>