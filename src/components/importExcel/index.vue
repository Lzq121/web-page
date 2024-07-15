<template>
  <div style="display:inline-block;margin:0 10px">
    <el-button size="default"
               type="primary"
               link
               icon="Upload"
               @click="handleImport()">
      <slot>导入</slot>
    </el-button>
    <el-dialog :title="props.upload.title"
               v-model="uploadShow"
               append-to-body>
      <div v-loading="loading">
        <el-upload ref="uploadRef"
                   :limit="1"
                   accept=".xlsx, .xls"
                   :headers="props.upload.headers"
                   :action="props.upload.url"
                   :disabled="isUploading"
                   :on-progress="handleFileUploadProgress"
                   :on-success="handleFileSuccess"
				   :on-error="handleFileError"
                   :auto-upload="false"
                   drag>
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            拖动文件到此处或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip"
                 style="color:red;text-align:center;">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary"
                     link
                     icon="Download"
                     @click="importTemplate">下载导入模板</el-button>
          <!-- <el-button type="primary"
                     link
                     plain
                     icon="DCaret"
                     @click="updateTemplate">批量更新模板</el-button> -->
          <el-button :disabled="loading"
                     @click="uploadShow = false">取 消</el-button>
          <el-button type="primary"
                     :disabled="loading"
                     @click="submitFileForm">确定上传</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="importExcel">
import { request, downloadFile } from '@/utils/service';
import { inject, ref } from 'vue';
import { getBaseURL } from '@/utils/baseUrl';
import { Session } from '@/utils/storage';
import { ElMessageBox } from 'element-plus';
import type { Action } from 'element-plus';
const refreshView = inject('refreshView');
const emits = defineEmits(['uploadResult']);

let props = defineProps({
	upload: {
		type: Object,
		default() {
			return {
				// 是否显示弹出层
				open: true,
				// 弹出层标题
				title: '',
				// 是否禁用上传
				isUploading: false,
				// 是否更新已经存在的用户数据
				updateSupport: 0,
				// 设置上传的请求头部
				headers: { Authorization: 'JWT ' + Session.get('token') },
				// 上传的地址
				url: getBaseURL() + 'api/system/file/',
			};
		},
	},
	api: {
		// 导入接口地址
		type: String,
		default() {
			return undefined;
		},
	},
	apiSuffix: {
		// 导入接口地址
		type: Boolean,
		default: true,
	},
});

let loading = ref(false);
const uploadRef = ref();
const uploadShow = ref(false);
const isUploading = ref(false);
/** 导入按钮操作 */
const handleImport = function () {
	uploadShow.value = true;
};

/** 下载模板操作 */
const importTemplate = function () {
	let suffix = props.apiSuffix ? 'import_data/' : '';
	downloadFile({
		url: props.api + suffix,
		params: {},
		method: 'get',
	});
};
/***
 * 批量更新模板
 */
const updateTemplate = function () {
	let suffix = props.apiSuffix ? 'update_template/' : '';
	downloadFile({
		url: props.api + suffix,
		params: {},
		method: 'get',
	});
};
// 文件上传中处理
const handleFileUploadProgress = function (event: any, file: any, fileList: any) {
	isUploading.value = true;
};
// 文件上传成功处理
const handleFileSuccess = function (response: any, file: any, fileList: any) {
	isUploading.value = false;
	loading.value = true;
	uploadRef.value.clearFiles();
	// 是否更新已经存在的用户数据
	let suffix = props.apiSuffix ? 'import_data/' : '';
	return request({
		url: props.api + suffix,
		method: 'post',
		data: {
			url: response.data.url,
		},
	})
		.then((response: any) => {
			loading.value = false;
			ElMessageBox.alert('导入成功', '导入完成', {
				confirmButtonText: 'OK',
				callback: (action: Action) => {
					emits('uploadResult', true);
					refreshView();
					uploadShow.value = false;
				},
			});
		})
		.catch(() => {
			loading.value = false;
			emits('uploadResult', false);
		});
};
const handleFileError = function (error: any, file: any, fileList: any) {
	isUploading.value = false;
	uploadRef.value.clearFiles();
};
// 提交上传文件
const submitFileForm = function () {
	uploadRef.value.submit();
};
</script>

<style scoped>
</style>
