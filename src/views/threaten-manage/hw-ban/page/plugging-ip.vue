<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';
import apis from '../api';
import { ipCheck } from '@/utils/ipCheck';
const router = useRouter();
const route = useRoute();
const validateIpaddress = (rule, value, callback) => {
	if (!ipCheck(value)) {
		callback(new Error('请输入合法的IP地址'));
	} else {
		callback();
	}
};
const query = route.query;
const pluggingReason = query.id ? `研判通过事件ID:【${query.id}】` : '';
const ip = query.ip ? query.ip : '';
let pluggingFormData: any = ref({
	ip,
	pluggingReason,
	action: 'FENGJIN',
});

let activeName = ref('1'),
	rules = ref({
		ip: [{ required: true, message: '请正确输入需要申请操作的IP地址', trigger: 'blur', validator: validateIpaddress }],
		action: [{ required: true }],
		pluggingReason: [
			{ required: true, message: '请输入申请理由' },
			{ min: 3, message: '理由不得低于3个字符', trigger: 'blur' },
		],
	}),
	moreRules = ref({
		ip: [{ required: true, message: '请输入申请操作的IP地址' }],
		action: [{ required: true }],
		pluggingReason: [
			{ required: true, message: '请输入申请理由' },
			{ min: 3, message: '理由不得低于3个字符', trigger: 'blur' },
		],
	}),
	pluggingFormMore = ref({
		pluggingReason: '',
		ip: '',
		action: 'FENGJIN',
	}),
	imgDialogVisible = ref(false),
	dialogImageUrl = ref(''),
	fileData = new FormData();
const formName = ref();
const imageFileUpload = ref();
const imageFileUploadMore = ref();
const pluggingConfirm = () => {
	formName.value.validate((valid) => {
		if (valid) {
			if (!fileData.get('ban_reason')) {
				fileData.append('targets', JSON.stringify([pluggingFormData.value.ip]));
				fileData.append('ban_reason', pluggingFormData.value.pluggingReason);
				fileData.append('action', pluggingFormData.value.action);
			}
			apis
				.attackIpCreate(fileData)
				.then((res) => {
					if (res.code == 2000) {
						ElMessage.success('操作成功');
						pluggingFormData.value = {
							ip: '',
							pluggingReason: '',
							action: 'FENGJIN',
						};
						fileData = new FormData();
						imageFileUpload.value.clearFiles();
					}
				})
				.catch((err) => {
					pluggingFormData.value = {
						ip: ' ',
						pluggingReason: ' ',
						action: 'FENGJIN',
					};
					fileData = new FormData();
					imageFileUpload.value.clearFiles();
				});
		} else {
			return false;
		}
	});
};
const morePluggingConfirm = () => {
	if (pluggingFormMore.value.pluggingReason.length < 3) {
		ElMessage.warning('请输入申请理由，不得低于3个字符');
		return;
	}
	let splitChart = ',';
	if (pluggingFormMore.value.ip.includes('\n')) {
		splitChart = '\n';
	}
	let ipArr = pluggingFormMore.value.ip.split(splitChart);
	if (ipArr.length < 2) {
		ElMessage.warning('批量申请IP不能低于两条');
		return;
	}
	for (let index = 0; index < ipArr.length; index++) {
		let ip = ipArr[index];
		if (!ipCheck(ip)) {
			ElMessage.warning(`第【${index + 1}】条：【${ip}】IP地址输入不正确，请检查`);
			return;
		}
	}
	if (!fileData.get('ban_reason')) {
		fileData.append('targets', JSON.stringify(ipArr));
		fileData.append('ban_reason', pluggingFormMore.value.pluggingReason);
		fileData.append('action', pluggingFormMore.value.action);
	}

	apis
		.attackIpCreate(fileData)
		.then((res) => {
			if (res.code == 2000) {
				pluggingFormMore.value = {
					pluggingReason: '',
					ip: ' ',
					action: 'FENGJIN',
				};
				fileData = new FormData();
				imageFileUploadMore.value.clearFiles();
				ElMessage.success('操作成功');
			}
		})
		.catch((err) => {
			ElMessage.error('服务器错误:' + err.message);
			pluggingFormMore.value = {
				ip: ' ',
				pluggingReason: ' ',
				action: 'FENGJIN',
			};
			fileData = new FormData();
			imageFileUpload.value.clearFiles();
		});
};

const handlePictureCardPreview = (file) => {
	dialogImageUrl.value = file.url;
	imgDialogVisible.value = true;
};
const handleRemove = (file, fileList) => {
	fileData = new FormData();
	fileList.forEach((item) => {
		fileData.append('ban_reason_images', item.raw);
	});
};
const onFileChange = (file, fileList) => {
	fileData = new FormData();
	fileList.forEach((item) => {
		fileData.append('ban_reason_images', item.raw);
	});
};

const onTabClick = (val) => {
	switch (val.name) {
		case '1':
			fileData = new FormData();
			imageFileUpload.value.clearFiles();
			break;
		case '2':
			fileData = new FormData();
			imageFileUploadMore.value.clearFiles();
			break;
	}
};
const readerData = (rawFile) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = e.target.result;
			const workbook = XLSX.read(data, { type: 'array' });
			const firstSheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[firstSheetName];
			const results = XLSX.utils.sheet_to_json(worksheet);
			resolve(results);
		};
		reader.readAsArrayBuffer(rawFile);
	});
};
// 文件上传下载
const handleDownload = () => {
	var filename = 'IP上传模板.xlsx'; //文件名称
	var data = [['IP'], ['127.0.0.1']]; //数据
	var ws_name = 'Sheet1'; //sheet的名称
	var wb = XLSX.utils.book_new();
	var ws = XLSX.utils.aoa_to_sheet(data);
	XLSX.utils.book_append_sheet(wb, ws, ws_name);
	XLSX.writeFile(wb, filename); //导出Excel到本地
};
const beforeUpload = (file) => {
	if (!/\.(xlsx|xls|csv)$/.test(file.raw.name)) {
		ElMessage.error('只能上传【.xlsx, .xls, .csv】格式文档');
		return false;
	}
	const isLt1M = file.size / 1024 / 1024 < 1;
	if (isLt1M) {
		return true;
	}
	ElMessage({
		message: '请将文件大小控制在1M以内',
		type: 'warning',
	});
	return false;
};
const onExcelChange = (file) => {
	const rawFile = file.raw;
	if (!beforeUpload(file)) {
		return;
	}
	if (!rawFile) return;
	let ipList = [];
	readerData(rawFile).then((data) => {
		if (data.length < 2) {
			ElMessage.warning('请正确上传包含IP地址的文件，且IP不得低于2条');
			return;
		}
		if (data.length > 300) {
			ElMessage.warning('IP不得高于300条');
			return;
		}
		data.forEach((item) => {
			ipList.push(item['IP']);
		});
		pluggingFormMore.value.ip = ipList.join(',');
	});
};
</script>

<template>
  <div>
    <dp title="IP 封堵/解封"
        @back="router.push({ path: '/threaten-manage/hw-ban', query: { ...route.query } })">
      <div class="plugging-layout">
        <el-tabs v-model="activeName"
                 @tab-click="onTabClick"
                 type="border-card">
          <el-tab-pane label="单条 封堵/解封"
                       name="1">
            <el-form :rules="rules"
                     :model="pluggingFormData"
                     ref="formName"
                     label-width="150px">
              <el-form-item label="IP地址："
                            prop="ip">
                <el-input clearable
                          v-model="pluggingFormData.ip"
                          placeholder="请输入IP地址">
                </el-input>
              </el-form-item>
              <el-form-item label="申请动作："
                            prop="action">
                <el-radio-group v-model="pluggingFormData.action">
                  <el-radio value="FENGJIN">封堵</el-radio>
                  <el-radio value="JIEFENG">解封</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="申请理由："
                            prop="pluggingReason">
                <el-input type="textarea"
                          rows="5"
                          clearable
                          v-model="pluggingFormData.pluggingReason"
                          placeholder="请输入申请理由"></el-input>
              </el-form-item>
              <el-form-item label="上传图片：">
                <el-upload ref="imageFileUpload"
                           action="#"
                           accept=".jpg,.png,.jpeg"
                           :multiple="true"
                           :auto-upload="false"
                           list-type="picture-card"
                           :on-change="onFileChange"
                           :on-preview="handlePictureCardPreview"
                           :on-remove="handleRemove">
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-upload>
                <el-dialog :visible.sync="imgDialogVisible">
                  <img width="100%"
                       :src="dialogImageUrl"
                       alt="">
                </el-dialog>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           @click="pluggingConfirm">
                  确认 提交
                </el-button>
              </el-form-item>

            </el-form>
          </el-tab-pane>
          <el-tab-pane label="多条 封堵/解封"
                       name="2">
            <div class="btns">
              <el-button type="warning"
                         icon="Download"
                         style="margin-bottom:20px"
                         @click="handleDownload">下载模板</el-button>

              <el-upload action="#"
                         :limit="1"
                         :auto-upload="false"
                         :on-change="onExcelChange">
                <el-button type="success"
                           icon="Upload">上传Excel文件</el-button>
              </el-upload>

            </div>
            <div class="input-box">
              <el-form :rules="moreRules"
                       label-width="150px"
                       ref="pluggingFormMoreRef"
                       :model="pluggingFormMore">
                <el-form-item label="IP地址："
                              prop="ip">

                  <el-input type="textarea"
                            rows="8"
                            clearable
                            v-model="pluggingFormMore.ip"
                            placeholder="
                  请输入IP地址，并使用英文逗号或者换行对IP地址进行分割，
                  换行时不用加逗号，使用逗号分割时最后一个IP后不加逗号。
                  IP输入示例（英文逗号方式）：110.242.68.4,27.128.221.234,1.180.18.85
                  IP输入示例（换行方式）：
                  110.242.68.4
                  27.128.221.234
                  1.180.18.85
                  ">
                  </el-input>

                </el-form-item>
                <el-form-item label="申请动作："
                              prop="action">
                  <el-radio-group v-model="pluggingFormMore.action">
                    <el-radio value="FENGJIN">封堵</el-radio>
                    <el-radio value="JIEFENG">解封</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="申请理由："
                              prop="pluggingReason">

                  <el-input type="textarea"
                            v-model="pluggingFormMore.pluggingReason"
                            rows="5"
                            clearable
                            placeholder="请输入申请理由">
                  </el-input>
                </el-form-item>
                <el-form-item label="上传图片：">

                  <el-upload ref="imageFileUploadMore"
                             action="#"
                             accept=".jpg,.png,.jpeg"
                             :multiple="true"
                             :auto-upload="false"
                             list-type="picture-card"
                             :on-change="onFileChange"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleRemove">
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </el-upload>
                  <el-dialog v-model="imgDialogVisible">
                    <img width="100%"
                         :src="dialogImageUrl"
                         alt="">
                  </el-dialog>
                </el-form-item>
                <el-form-item>

                  <el-button type="primary"
                             @click="morePluggingConfirm">确认 提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </dp>

  </div>
</template>
<style lang="scss" scoped>
.plugging-layout {
	padding: 20px 50px;

	.btns {
		padding: 10px;
		text-align: right;
		// display: flex;
	}

	.input-box {
		padding: 10px 0;
	}
}
</style>