<template>
	<div style="padding: 5px;">
		<el-upload
			:class="{noneBtnImg:showUpload}"
			:action="uploadImgUrl"
			:headers="uploadHeader"
			:file-list="imgList"
			:multiple="true"
			list-type="picture-card"
			:auto-upload="false"
			:accept="'image/*'"
			:disabled="showUpload"
			:on-preview="handlePicturePreview"
			:on-remove="handleRemove"
			:on-change="imgHandelChange"
		>
			<el-icon v-if="!showUpload"><Plus /></el-icon>
		</el-upload>
		<el-image-viewer
			v-if="showViewer"
			:z-index="9999"
			:initial-index="urlIndex"
			@close="closeViewer"
			:url-list="urlList" />
	</div>
</template>

<script lang="ts" setup name="uploadPreview">
import { ElMessage } from 'element-plus';
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ref } from 'vue';
import { getBaseURL } from '@/utils/baseUrl';
import { Session } from '@/utils/storage';
const emits = defineEmits(['uploadResult']);

let props = defineProps({
	api: {
		// 上传接口地址
		type: String,
		default() {
			return undefined;
		},
	},
	imgList: {
		// 图片列表
		type: Array,
		default() {
			return [];
		},
	},
	showUpload: {
		// 是否显示上传按钮
		type: Boolean,
		default() {
			return false;
		},
	}
});

const imgList = ref<UploadUserFile[]>([])
imgList.value = props.imgList;
let showViewer = ref(false); 
let urlIndex = ref(0);
let urlList = ref([]);
const getFileUrl = () => {
	urlList.value = [];
	imgList.value.forEach((v,i) => {
		urlList.value.push(v.url);
		v.index = i;
	})
}
getFileUrl();

const uploadImgUrl = getBaseURL() + props.api;
const uploadHeader = {Authorization: 'JWT ' + Session.get('token')}

const imgHandelChange = (file, fileList) => {
	const fileName = file.name;
	const fileType = fileName.substring(fileName.lastIndexOf('.'))
	for (let i = 0; i < imgList.value.length; i++) {
		if (fileName == imgList.value[i].name) {
			ElMessage.warning("文件名已存在")
			fileList.splice(fileList.indexOf(file), 1);
			return false;
		}
	}
	// jpeg,.png,.jpg,.bmp,.gif
	if (fileType !== '.jpg' && fileType !== '.png' && fileType !== '.jpeg' && fileType !== '.bmp' && fileType !== '.gif') {
		ElMessage.warning('请上传正确的图片类型');
		fileList.splice(fileList.indexOf(file), 1);
		return false;
	}
	urlList.value = [];
	fileList.forEach((v,i) => {
		urlList.value.push(v.url);
		v.index = i;
	})
	imgList.value = fileList;
	emits('uploadResult', imgList);
}

// 文件删除
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
	urlList.value = [];
	uploadFiles.forEach((v,i) => {
		urlList.value.push(v.url);
		v.index = i;
	})
	imgList.value = uploadFiles;
	emits('uploadResult', imgList);
}

// 文件预览
const handlePicturePreview: UploadProps['onPreview'] = (uploadFile) => {
	urlIndex.value = uploadFile.index;
	showViewer.value = true;
}

const closeViewer = () => {
	showViewer.value = false
}

</script>

<style scoped lang="scss">
	.noneBtnImg{
		:deep(.el-upload--picture-card){
			display: none;		
		}
	}
</style>
