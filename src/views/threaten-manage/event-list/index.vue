
<script setup lang="ts">
import { ref, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElIcon, ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import type { UploadProps, UploadUserFile, FormRules, FormInstance } from 'element-plus';
import importExcel from '@/components/importExcel/index.vue';
import uploadPreview from '@/components/upload-preview/index.vue';
import { getBaseURL } from '@/utils/baseUrl';
import { Session } from '@/utils/storage';
import { downloadFile } from '@/utils/service';
import apis from './api';
const router = useRouter();
const route: any = useRoute();

let columns = [
	{ dataIndex: 'id', title: 'ID', width: 150 },
	{ dataIndex: 'ip', title: '受影响主机IP', width: 110 },
	{ dataIndex: 'biz_level', title: '所属系统', width: 110 },
	{ dataIndex: 'company', title: '所属公司', width: 110 },
	{ dataIndex: 'supplier', title: '攻击源IP', width: 110 },
	{ dataIndex: 'network_area', title: '攻击源地域', width: 110 },
	{ dataIndex: 'biz_state', title: '事件类型', width: 110 },
	{ dataIndex: 'status', title: '状态', width: 110 },
	{ dataIndex: 'tags', title: '标签' },
	{ dataIndex: 'biz_type', title: '事件描述', width: 110},
	{ dataIndex: 'biz_plate', title: '发生次数', width: 100},
	{ dataIndex: 'mail_of_main', title: '风险等级', width: 100},
	{ dataIndex: 'tp_of_main', title: '风险描述', width: 110 },
	{ dataIndex: 'domain', title: '事件发生时间', width: 180},
	{ dataIndex: 'project_desc', title: '所属数据中心', width: 110},
	{ dataIndex: 'external_lan_ip', title: '部署区域', width: 110},
	{ dataIndex: 'load_ip', title: '录入时间', width: 180 },
	{ dataIndex: 'public_ip', title: '数据来源', width: 110 },
	{ dataIndex: 'operate', title: '操作', fixed: 'right', width: 120 },
];

let total = ref(0);
let params = ref({
	id: '',
	company: '',
	project_desc: '',
	biz_state: '',
	status: '',
	exec: '',
	// 公有
	limit: 30,
	page: 1,
});
const tableData = ref([]);
let isLoading = ref(false);
let isShowMoreSearch = ref(false);
let companyList = ref([
	{ label: '人保公司', value: '人保公司' },
	{ label: '人保集团', value: '人保集团' },
]);
let dataCenterList = ref([{ label: '南信息中心', value: '南信息中心' }]);
let eventTypeList = ref([
	{ label: '恶意请求', value: '恶意请求' },
	{ label: '病毒感染', value: '病毒感染' },
]);
let statusList = ref([
	{ label: '未处置', value: '未处置' },
	{ label: '已处置', value: '已处置' },
]);
let executorList = ref([
	{ label: '张三', value: '张三' },
	{ label: '系统自动', value: '系统自动' },
]);
let levelList = ref([{ label: '高危', value: '高危' }]);

// 获取列表
const getList = async () => {
	// let res = await apis.getEventApi(params.value);
	// tableData.value = res.data;
	// total.value = res.total;
	tableData.value = [
		{
			id: 'SJ240101000001',
			ip: '10.1.1.1',
			biz_level: '安全运营平台',
			company: '人保科技',
			supplier: '10.1.101.1',
			network_area: '广东广州',
			biz_state: '恶意请求',
			status: '未处置',
			tags: '新发现',
			biz_type: '发现主机外联Burp Colaborator',
			biz_plate: '15',
			mail_of_main: '未定级',
			tp_of_main: '发现主机外联Burp Colaborator',
			domain: '2024-01-01 08:00:00',
			project_desc: '南信息中心',
			external_lan_ip: 'DMZ',
			load_ip: '2024-01-01 08:00:00',
			public_ip: '态势感知',
		},
		{
			id: 'SJ140101000001',
			ip: '10.1.1.2',
			biz_level: '安全运营平台',
			company: '人保科技',
			supplier: '10.1.101.1',
			network_area: '广东广州',
			biz_state: '恶意请求',
			status: '一级研判',
			tags: '新发现',
			biz_type: '发现主机外联Burp Colaborator',
			biz_plate: '15',
			mail_of_main: '未定级',
			tp_of_main: '发现主机外联Burp Colaborator',
			domain: '2024-01-01 08:00:00',
			project_desc: '南信息中心',
			external_lan_ip: 'DMZ',
			load_ip: '2024-01-01 08:00:00',
			public_ip: '态势感知',
		},
		{
			id: 'S3240101000001',
			ip: '10.1.1.3',
			biz_level: '安全运营平台',
			company: '人保科技',
			supplier: '10.1.101.1',
			network_area: '广东广州',
			biz_state: '恶意请求',
			status: '研判通过',
			tags: '新发现',
			biz_type: '发现主机外联Burp Colaborator',
			biz_plate: '15',
			mail_of_main: '未定级',
			tp_of_main: '发现主机外联Burp Colaborator',
			domain: '2024-01-01 08:00:00',
			project_desc: '南信息中心',
			external_lan_ip: 'DMZ',
			load_ip: '2024-01-01 08:00:00',
			public_ip: '态势感知',
		},
		{
			id: 'S3240101000001',
			ip: '10.1.1.4',
			biz_level: '安全运营平台',
			company: '人保科技',
			supplier: '10.1.101.1',
			network_area: '广东广州',
			biz_state: '恶意请求',
			status: '中途办结',
			tags: '新发现',
			biz_type: '发现主机外联Burp Colaborator',
			biz_plate: '15',
			mail_of_main: '未定级',
			tp_of_main: '发现主机外联Burp Colaborator',
			domain: '2024-01-01 08:00:00',
			project_desc: '南信息中心',
			external_lan_ip: 'DMZ',
			load_ip: '2024-01-01 08:00:00',
			public_ip: '态势感知',
		},
		{
			id: 'S3240101000001',
			ip: '10.1.1.5',
			biz_level: '安全运营平台',
			company: '人保科技',
			supplier: '10.1.101.1',
			network_area: '广东广州',
			biz_state: '恶意请求',
			status: '事件挂起',
			tags: '新发现',
			biz_type: '发现主机外联Burp Colaborator',
			biz_plate: '15',
			mail_of_main: '未定级',
			tp_of_main: '发现主机外联Burp Colaborator',
			domain: '2024-01-01 08:00:00',
			project_desc: '南信息中心',
			external_lan_ip: 'DMZ',
			load_ip: '2024-01-01 08:00:00',
			public_ip: '态势感知',
		},
		{
			id: 'S3240101000001',
			ip: '10.1.1.6',
			biz_level: '安全运营平台',
			company: '人保科技',
			supplier: '10.1.101.1',
			network_area: '广东广州',
			biz_state: '恶意请求',
			status: '事件排查',
			tags: '新发现',
			biz_type: '发现主机外联Burp Colaborator',
			biz_plate: '15',
			mail_of_main: '未定级',
			tp_of_main: '发现主机外联Burp Colaborator',
			domain: '2024-01-01 08:00:00',
			project_desc: '南信息中心',
			external_lan_ip: 'DMZ',
			load_ip: '2024-01-01 08:00:00',
			public_ip: '态势感知',
		},
	];
	total.value = 6;
};

getList();

// 新增
let addDrawer = ref(false);
const addEvent = () => {
	addDrawer.value = true;
};

interface RuleForm {
	eventType: string;
	discovery_time: string;
	attack_ip: string;
	attack_region: string;
	by_attack_ip: string;
	level: string;
	take_num: string;
	event_desc: string;
	solution: string;
}
const ruleFormRef = ref<FormInstance>();
let addForm = ref<RuleForm>({
	eventType: '',
	discovery_time: '',
	attack_ip: '',
	attack_region: '',
	by_attack_ip: '',
	level: '',
	take_num: '',
	event_desc: '',
	solution: '',
});
const rules = ref<FormRules<RuleForm>>({
	eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
	discovery_time: [{ type: 'date', required: true, message: '请选择发现时间', trigger: 'change' }],
	attack_ip: [{ required: true, message: '请正确输入攻击源IP', trigger: 'blur', pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?$/ }],
	by_attack_ip: [{ required: true, message: '请正确输入受攻击主机IP', trigger: 'blur', pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?$/ }],
	level: [{ required: true, message: '请选择风险等级', trigger: 'change' }],
	event_desc: [
		{ required: true, message: '请输入事件描述', trigger: 'blur' },
		{ min: 1, max: 2000, message: '长度在1 ~ 2000个字符', trigger: 'blur' }
	]
});


// 相关截图
const imgList = ref<UploadUserFile[]>([]);
let uploadImgRef = ref();
let showViewer = ref(false); 
let urlIndex = ref(0);
let urlList = ref([]);
let uploadImgUrl = getBaseURL() ;
let uploadHeader = { Authorization: 'JWT ' + Session.get('token') };

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
	console.log(imgList.value)
}
// 图片删除
const imgHandleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
	urlList.value = [];
	uploadFiles.forEach((v,i) => {
		urlList.value.push(v.url);
		v.index = i;
	})
	imgList.value = uploadFiles;
}

// 图片预览
const handlePicturePreview: UploadProps['onPreview'] = (uploadFile) => {
	urlIndex.value = uploadFile.index;
	showViewer.value = true;
}

const closeViewer = () => {
	showViewer.value = false
}

// 文件上传
let uploadFileUrl = getBaseURL();
const files = ref<UploadUserFile[]>([]);
const fileHandelChange = (file, fileList) => {
	if (!file.url) {
      	file.url = URL.createObjectURL(file.raw);
    }
	const fileName = file.name;
	const fileType = fileName.substring(fileName.lastIndexOf('.'))
	for (let i = 0; i < files.value.length; i++) {
		if (fileName == files.value[i].name) {
			ElMessage.warning("文件名已存在")
			fileList.splice(fileList.indexOf(file), 1);
			return false;
		}
	}
	files.value = fileList;
}

// 文件删除
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
	files.value = uploadFiles;
};

// 文件下载
const handlePreview: UploadProps['onPreview'] = (file) => {
	const url = file.url;
	const link = document.createElement('a');
	link.href = url;
	link.download = file.name;
	link.target = '_blank';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

const save = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			addDrawer.value = false;
		} else {
		}
	});
};
const clean = () => {
	ruleFormRef.value.resetFields();
	uploadImgRef.value.clearFiles();
	addForm.value.event_desc = '';
	addForm.value.solution = '';
	imgList.value = [];
	files.value = [];
};
// 取消
const cancelForm = () => {
	addDrawer.value = false;
};
// 导出
const excelDown = async () => {
	ElMessageBox.prompt('自定义导出文件名', '提示', {
		confirmButtonText: '确认导出',
		cancelButtonText: '取消',
		inputPlaceholder: '请输入自定义文件名，无输入时使用默认文件名',
	})
		.then(({ value }) => {
			delete params.value.limit;
			delete params.value.page;
			if (value) {
				value = value + '.xlsx';
			} else {
				value = undefined;
			}
			downloadFile({
				url: '',
				params: params.value,
				method: 'get',
				filename: value,
			});
		})
		.catch(() => {});
};

// table单选框
let selectArr = ref([]);
const handleSelectionChange = (newSelect: any[]) => {
	selectArr.value = newSelect;
};

// 批量派单
const bulkOrder = async () => {
	if (selectArr.value.length == 0) {
		return ElMessage.warning('请选择需要派单的事件');
	}
	router.push({
		path: '/threaten-manage/event-list/dispatch-event',
		query: { arr: JSON.stringify(selectArr.value) },
	});
};
// 搜索
const searchList = async () => {
	getList();
};
// 重置
const searchReset = async () => {
	params.value = {
		id: '',
		company: '',
		project_desc: '',
		biz_state: '',
		status: '',
		exec: '',
		limit: 30,
		page: 1,
	};
	getList();
};
// 详情
const editRow = (row: any) => {
	router.push({
		path: '/threaten-manage/event-list/event-detail',
		query: { detailID: row.id, ...row },
	});
};

// 分页
const handleSizeChange = (val: any) => {
	params.value.limit = val;
	params.value.page = 1;
	searchList();
};
const handleCurrentChange = (val: any) => {
	params.value.page = val;
	searchList();
};
</script>
  

<template>
  <div>
    <div class="menace-container">
      <div class="form-container">
        <div class="form-title">
          <h3>事件列表</h3>
          <div class="button-box">
            <el-button type="primary"
                       @click="addEvent"
                       link
                       icon="CirclePlus">新增</el-button>
            <el-button type="primary"
                       @click="excelDown"
                       link
                       icon="Download">导出数据</el-button>
            <span>
              <importExcel :apiSuffix="false"
                           api="/api/assets/host/">导入数据</importExcel>
            </span>
            <el-button icon="Grid"
                       style="margin:0px 10px "
                       type="primary"
                       link
                       @click="bulkOrder">批量派单</el-button>
            <el-button type="primary"
                       icon="Search"
                       @click="searchList">搜索</el-button>
            <el-button @click="searchReset"
                       icon="RefreshRight">重置</el-button>
          </div>
        </div>
        <div class="form-params"
             :style="isShowMoreSearch ? 'height:100%' : 'height:60px'">
          <div class="more-filter-btn">
            <el-button link
                       type="primary"
                       @click="isShowMoreSearch = !isShowMoreSearch"
                       :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
              {{ isShowMoreSearch ? '收起' : '展开' }}
            </el-button>
          </div>
          <el-form :inline="true"
                   :model="params"
                   :disabled="isLoading"
                   label-width="120px"
                   class="form">
            <span>
              <el-form-item label="关键字">
                <el-input @keydown.enter="searchList"
                          v-model="params.id"
                          clearable />
              </el-form-item>
              <el-form-item label="所属公司">
                <el-select v-model="params.company">
                  <el-option :label="item.label"
                             :value="item.value"
                             v-for="item in companyList"
                             :key="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="数据中心">
                <el-select v-model="params.project_desc">
                  <el-option :label="item.label"
                             :value="item.value"
                             v-for="item in dataCenterList"
                             :key="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="事件类型">
                <el-select v-model="params.biz_state">
                  <el-option :label="item.label"
                             :value="item.value"
                             v-for="item in eventTypeList"
                             :key="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="params.status">
                  <el-option :label="item.label"
                             :value="item.value"
                             v-for="item in statusList"
                             :key="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="挂起执行人">
                <el-select v-model="params.exec">
                  <el-option :label="item.label"
                             :value="item.value"
                             v-for="item in executorList"
                             :key="item.value" />
                </el-select>
              </el-form-item>
            </span>
          </el-form>
        </div>
      </div>
      <div class="table-box">
        <table-unit :columns="columns"
                    :list="tableData"
                    v-loading="isLoading"
                    :total="total"
                    :isSelection="true"
                    :currentPage="params.page"
                    :pageSize="params.limit"
                    @handleSelectionChange="handleSelectionChange"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
          <template v-slot="record">
            <el-button size="small"
                       type="primary"
                       link
                       @click="editRow(record.record)">详情</el-button>
          </template>
        </table-unit>
      </div>

      <el-drawer v-model="addDrawer"
                 size="60%"
                 title="新增事件信息"
                 @close="clean">
        <div>
          <dl class="dl-container"
              style="padding: 10px 30px">
            <dt class="dl-title"
                style="padding: 10px 0">
              <span>事件信息</span>
            </dt>
            <dd class="dl-content">
              <el-form :inline="true"
                       ref="ruleFormRef"
                       :rules="rules"
                       :model="addForm"
                       label-width="110px"
					   class="forms"
                       >
                <el-form-item label="事件类型"
                              prop="eventType">
                  <el-select v-model="addForm.eventType">
                    <el-option :label="item.label"
                               :value="item.value"
                               v-for="item in eventTypeList"
                               :key="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="发现时间"
                              prop="discovery_time" >
                  <el-date-picker v-model="addForm.discovery_time"
                                  type="datetime"
                                  placeholder="请选择发现时间"
                                  value-format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>
                <el-form-item label="攻击源IP"
                              prop="attack_ip" >
                  <el-input v-model="addForm.attack_ip" />
                </el-form-item>
                <el-form-item label="攻击源地域"
                              prop="attack_region">
                  <el-input v-model="addForm.attack_region" />
                </el-form-item>
                <el-form-item label="受攻击主机IP"
                              prop="by_attack_ip">
                  <el-input v-model="addForm.by_attack_ip" />
                </el-form-item>
                <el-form-item label="风险等级"
                              prop="level">
                  <el-select v-model="addForm.level">
                    <el-option :label="item.label"
                               :value="item.value"
                               v-for="item in levelList"
                               :key="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="发生次数"
                              prop="take_num">
                  <el-input v-model="addForm.take_num" />
                </el-form-item>
				<br>
				<el-form-item label="事件描述" prop="event_desc" style="width: 95%;">
					<el-input v-model="addForm.event_desc"
							  maxlength="2000"
							  placeholder="请填写事件描述，字数限制2000字"
							  :autosize="{ minRows: 5 }"
							  show-word-limit
							  type="textarea" />
				  </el-form-item>
				  <br>
				  <el-form-item label="修复建议" style="width: 95%;">
					<el-input v-model="addForm.solution"
					  maxlength="2000"
					  placeholder="请填写修复建议，字数限制2000字"
					  :autosize="{ minRows: 5 }"
					  show-word-limit
					  type="textarea" />
				  </el-form-item>
				  <br>
				  <el-form-item label="截图信息">
					  <div style="padding: 5px;">
						  <el-upload
							  ref="uploadImgRef"
							  :action="uploadImgUrl"
							  :headers="uploadHeader"
							  :file-list="imgList"
							  :multiple="true"
							  :auto-upload="false"
							  list-type="picture-card"
							  :accept="'image/*'"
							  :on-preview="handlePicturePreview"
							  :on-remove="imgHandleRemove"
							  :on-change="imgHandelChange"
						  >
							  <el-icon><Plus /></el-icon>
						  </el-upload>
						  <el-image-viewer
							  :z-index="9999"
							  v-if="showViewer"
							  :initial-index="urlIndex"
							  @close="closeViewer"
							  :url-list="urlList" />
					  </div>
				  </el-form-item>
				  <br>
				  <el-form-item label="附件信息" style="width: 100%;">
						<el-upload 
							v-model:file-list="files"
							class="upload-demo"
							:action="uploadFileUrl"
							:headers="uploadHeader"
							multiple
							:auto-upload="false"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							:on-change="fileHandelChange"
					  >
					  <el-button type="primary" icon="Plus">上传文件</el-button>
					</el-upload>
				  </el-form-item>
              </el-form>
            </dd>
          </dl>
        </div>
        <div class="demo-drawer__footer"
             style="text-align: center;margin-bottom: 20px;">
          <el-button type="primary"
                     @click="save(ruleFormRef)">保存</el-button>
          <el-button @click="cancelForm">取消</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>
  
  
  <style scoped lang="scss">
.menace-container {
	.form {
		.el-input,
		.el-select {
			width: 200px;
		}
	}
	.forms {
		.el-input,
		.el-select {
			width: 220px;
		}
	}
	.upload-demo {
		width: 100%;
		:deep(.el-upload-list__item-info) {
			background: #f5f4f4 !important;
		}
	}
}
</style>
  