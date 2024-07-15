
<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus';
import {
	updateThreat,
	createThreat,
	getImages,
	deleteImages,
	getThreat,
	getThreatDeal,
	createThreatDeal,
	deleteThreatDeal,
	getRes,
	hostListGetApi,
	urlAddrListGetApi,
} from '../api';
import { Local, Session } from '@/utils/storage';
import ImgWatermark from '@/utils/watermark';
import { getBaseURL } from '@/utils/baseUrl';
const router = useRouter();
const route = useRoute();
const userInfo = Session.get('userInfo');
const roleInfo = userInfo.role_info;
let roles = ref([]);
if (Array.isArray(roleInfo)) {
	roles.value = roleInfo.map((item: any) => {
		return item.name;
	});
}

let height = window.innerHeight - 190;
let action = getBaseURL() + 'api/tools/upload/'; //服务器上传地址
let upload_disabled = ref(false);
let total = ref(0);
let date = ref([]);
let kindOptions = ref([
	{ value: 1, label: '内网' },
	{ value: 2, label: '互联网' },
	{ value: 3, label: '外联网' },
	{ value: 4, label: '其他' },
]);
let importanceOptions = ref([
	{ value: 1, label: '一般' },
	{ value: 2, label: '重要' },
	{ value: 3, label: '紧急' },
]);
let formRules = ref({
	alarm_at: [{ required: true, message: '不能为空', trigger: 'blur' }],
	kind: [{ required: true, message: '不能为空', trigger: 'blur' }],
	importance: [{ required: true, message: '不能为空', trigger: 'blur' }],
	device: [{ required: true, message: '不能为空', trigger: 'blur' }],
	src_ip: [{ required: true, message: '请正确输入IP地址', trigger: 'blur', pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?$/ }],
	dest_ip: [{ required: true, message: '请正确输入IP地址', trigger: 'blur', pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?$/ }],

	abstract: [{ required: true, message: '不能为空', trigger: 'blur' }],
	src_desc: [{ required: true, message: '不能为空', trigger: 'blur' }],
	dest_desc: [{ required: true, message: '不能为空', trigger: 'blur' }],
});
let eventData = ref({
	id: undefined,
	importance: '',
	kind: '',
	status: undefined,
	device: '',
	alarm_at: '',
	src_ip: '',
	src_desc: '',
	dest_ip: '',
	dest_desc: '',
	dest_org: '',
	abstract: '',
	reporter: '',
	report_at: undefined,
});
let headerObj = { Authorization: 'JWT ' + Session.get('token') };
let imageList = ref([]);
let dialogVisible = ref(false);
let screenHeight = ref(document.documentElement.clientHeight * 0.9);
let isEdit = ref(false);
let editID = ref(route.query.editId);
let tid = ref(route.query.editId);
// 以下是研判意见组件的数据
let dealRules = ref({
	content: [{ required: true, message: '不能为空', trigger: 'blur' }],
});
let timelineArr = ref([]);
let determineData = ref({
	tid: route.query.editId,
	from_name: '',
	to_name: '',
	executor: '',
	content: '',
	is_agree: true,
});
let isEventPut = ref(false);
let eventPerson = ref('');
let cname = ref(userInfo.username);
let isShowForm = ref(true);
let imgShow = ref(false);
let upload = ref();
let carousel = ref();
let dataForm = ref();
let dealForm = ref();
let myLabelText = ref('');
const myLabel = () => {
	if (eventData.value.status === 1) {
		myLabelText.value = '监控意见';
		return;
	}
	if (eventData.value.status > 1 && eventData.value.status < 6) {
		myLabelText.value = '研判意见';
		return;
	}
	if (eventData.value.status === 6) {
		myLabelText.value = '处置意见';
		return;
	}
	myLabelText.value = '';
};

const tagFilter = (status: string) => {
	const tagsMap = {
		'1': 'danger',
		'2': 'warning',
		'3': 'warning',
		'4': 'warning',
		'5': 'warning',
		'6': 'primary',
		'7': 'info',
		'8': 'success',
		'9': 'danger',
	};
	let key = String(status);
	return tagsMap[key];
};
const getBaseData = () => {
	if (editID.value) {
		let formData = {
			page: 1,
			limit: 1,
			kind: undefined,
			importance: undefined,
			start_time: '',
			end_time: '',
			status: '',
			ip: '',
			id: editID.value,
		};
		getData(formData);
		getImageList(editID.value);
		getTimelineArr(editID.value);
	}
};
const getData = (data) => {
	getThreat(data).then((res) => {
		if (res.code == 2000 && Array.isArray(res.data.items) && res.data.items.length > 0) {
			eventData.value = res.data.items[0];
			if (cname.value !== eventData.value.reporter) {
				isEdit.value = true;
			} else {
				isEdit.value = false;
			}
			if (eventData.value.status == 7 || eventData.value.status == 8) {
				isShowForm.value = false;
			}
			if (route.query.editStatus != eventData.value.status) {
				ElMessage.error(`数据ID为【${route.query.editId}】事件状态已发生变化，建议退回列表页面进行查看`);
			}
			myLabel();
		} else {
			resetTemp();
		}
	});
};
const getImageList = async (tid) => {
	const { data } = await getImages({ tid: tid });
	if (Array.isArray(data.items)) {
		imageList.value = data.items.map((i: any) => {
			return {
				url: i.file_prefix + i.file,
				id: i.id,
			};
		});
	}
};
const resetTemp = () => {
	eventData.value = {
		id: undefined,
		importance: '',
		kind: '',
		status: undefined,
		device: '',
		alarm_at: '',
		src_ip: '',
		src_desc: '',
		dest_ip: '',
		dest_desc: '',
		dest_org: '',
		abstract: '',
		reporter: '',
		report_at: undefined,
	};
};
const createData = () => {
	if (imageList.value.length === 0) {
		ElMessage.error('图片不能为空');
		return;
	}

	eventData.value.reporter = cname.value;
	if (editID.value) {
		eventData.value.tid = editID.value;
		updateData(eventData.value);
	} else {
		dataForm.value.validate((valid) => {
			if (valid) {
				createThreat(eventData.value).then((res) => {
					if (res.code === 2000) {
						tid.value = res.data.id;
						submitUpload();
						resetTemp();
						ElMessageBox.confirm('新增成功，需要返回列表页吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'success',
						})
							.then(() => {
								router.push({ path: '/threaten-manage/event-handling', query: { ...route.query } });
							})
							.catch(() => {});
					}
				});
			}
		});
	}
};
const updateData = (tempData) => {
	dataForm.value.validate((valid) => {
		if (valid) {
			updateThreat(tempData).then((res) => {
				tid.value = tempData.id;
				submitUpload();
				ElMessage({
					message: '事件信息修改成功',
					type: 'success',
				});
			});
		}
	});
};
//上传提交
const submitUpload = () => {
	upload.value.submit();
	if (!editID.value) {
		upload.value.clearFiles();
	}
};
const handlePreview = (file) => {
	const index = imageList.value.findIndex((item) => item.url === file.url);
	setActiveItem(index);
	dialogVisible.value = true;
};
const setActiveItem = (i) => {
	if (carousel.value) {
		carousel.value.setActiveItem(i);
	}
};
const onSuccess = (response, file, files) => {
	if (response.code === 2000) {
		ElNotification.success({
			title: '成功',
			message: '图片上传完成',
		});
	} else {
		ElNotification.error({
			title: '失败',
			message: response.msg,
		});
	}
};
const onImgChange = (file, files) => {
	imageList.value = files;
};
const beforeRemove = () => {
	if (editID.value) {
		if (cname.value !== eventData.value.reporter && userInfo.org !== '管理组') {
			ElMessage.error('没有删除图片权限');
			return false;
		}
	}
	if (eventData.value.status > 2 || isEdit.value) {
		ElMessage.error('该状态不能删除图片');
		return false;
	}
};
const onRemove = (file) => {
	if (editID.value) {
		ElMessageBox.confirm('此操作将从服务器删除图片, 是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(() => {
				if (file.status == 'success' && editID.value) {
					deleteImages({ id: file.id }).then(() => {
						ElMessage.success({
							title: '成功',
							message: '图片已删除',
						});
					});
				}
			})
			.catch(() => {
				getImageList(editID.value);
			});
	}
};
const queryIpAddress = async (ip) => {
	const loading = ElLoading.service({
		lock: true,
		text: '正在互联网进行归属地查询，请稍候...',
		background: 'rgba(0, 0, 0, 0.5)',
	});
	let url = 'http://ip-api.com/json/' + ip + '?lang=zh-CN';
	let data = await fetch(url).then((response) => response.json());
	loading.close();
	return data;
};
const queryAttackSip = () => {
	queryIpAddress(eventData.value.src_ip).then((res) => {
		if (res.status == 'success') {
			eventData.value.src_desc = res.country + '-' + res.city;
		} else {
			ElMessage.error('没有查询到关于该IP的信息，请手动输入归属地');
		}
	});
};
const queryAlarmSip = () => {
	queryIpAddress(eventData.value.dest_ip).then((res) => {
		if (res.status == 'success') {
			eventData.value.dest_desc = res.country + '-' + res.city;
		} else {
			ElMessage.error('没有查询到关于该IP的信息，请手动输入归属地');
		}
	});
};

const queryAlarmSip1 = async () => {
	eventData.value.dest_desc = '';
	const { data: data3 } = await getRes({ ipkind: '1', ip: eventData.value.dest_ip });
	if (Array.isArray(data3) && data3.length > 0) {
		eventData.value.dest_desc = `${data3[0]['company']}-${data3[0]['area1']}-${data3[0]['area2']}`;
		return;
	}
	const { data: data1 } = await hostListGetApi({ ip: eventData.value.dest_ip });

	if (Array.isArray(data1) && data1.length > 0) {
		eventData.value.dest_desc = `${data1[0]['biz']}`;
		return;
	}
	const { data: data2 } = await urlAddrListGetApi({ map_ip: eventData.value.dest_ip });

	if (Array.isArray(data2) && data2.length > 0) {
		eventData.value.dest_desc = `${data2[0]['business']}`;
		return;
	}
	ElMessage.error('没有查询到关于该IP的信息，请手动输入归属地');
	// queryAlarmSip();
};
// 以下是研判组件内的方法
const getTimelineArr = async (id) => {
	const { data } = await getThreatDeal({ tid: id });
	if (!Array.isArray(data.items) || data.items.length === 0) {
		return;
	}
	timelineArr.value = data.items;
	timelineArr.value.forEach((i: any) => {
		i.to_name$ = tagFilter(i.to_name);
	});
	const element = data.items[0];
	if (element.to_name == '9' || element.from_name == '9') {
		if (element.executor != cname) {
			isEventPut.value = true;
			eventPerson.value = element.executor;
		} else {
			isEventPut.value = false;
		}
	}
};
// 只保存意见，不改状态
const saveDeal = (newStatus: number) => {
	dealForm.value.validate((valid) => {
		determineData.value.from_name = eventData.value.status;
		determineData.value.to_name = newStatus;
		determineData.value.executor = cname.value;
		createThreatDeal(determineData.value).then((res) => {
			submitUpload();
			if (res.code === 2000) {
				ElMessageBox.confirm('更新操作成功，需要返回列表页吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'success',
				})
					.then(() => {
						router.push({ path: '/threaten-manage/event-handling', query: { ...route.query } });
					})
					.catch(() => {
						getBaseData();
						determineData.value = {
							tid: route.query.editId,
							from_name: '',
							to_name: '',
							executor: cname,
							content: '',
							is_agree: true,
						};
					});
			}
		});
	});
};
//删除办理意见
const deleteComment = (pk) => {
	ElMessageBox.confirm('您确定要删除该条办理意见吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		deleteThreatDeal({ id: pk }).then(() => {
			ElMessage.success('删除成功');
			getTimelineArr(editID.value);
		});
	});
};
const getDealTag = (from_, to_) => {
	let from_name = parseInt(from_);
	let to_name = parseInt(to_);
	// 监控节点
	if (from_name == 0 && to_name == 2) return '新增事件';
	if (from_name == 1 && to_name == 3) return '监控修改';
	if (from_name == 1 && to_name == 7) return '监控办结';
	// 研判节点
	if (from_name > 1 && from_name < 6 && to_name == 1) return '研判退回';
	if (from_name > 1 && from_name < 6 && to_name == 6) return '研判通过';
	if (from_name > 1 && from_name < 6 && to_name == 4) return '提交复核';
	if (from_name > 1 && from_name < 6 && to_name == 7) return '研判办结';
	//处置节点
	if (from_name == 6 && to_name == 5) return '处置退回';
	if (from_name == 6 && to_name == 8) return '处置完成';
	if (from_name == 6 && to_name == 7) return '处置办结';
	if ((from_name == 6 || from_name == 4) && to_name == 9) return '事件挂起';
	if ((to_name == 6 || to_name == 4) && from_name == 9) return '取消挂起';
	return '异常状态';
};

getBaseData();
</script>
<template>
  <div>
    <dp title="告警处理"
        @back="router.push({ path: '/threaten-manage/event-handling', query: { ...route.query } })"
        :desc="route.query.editId ? `编辑事件 【ID编号:${route.query.editId}】` : '新增事件'">
      <template #right>
        <div v-if="route.query.editId">
          <el-button v-if="!(eventData.status > 2 || isEdit)"
                     type="primary"
                     @click="createData">
            确认 修改
          </el-button>
        </div>
        <div v-else>
          <el-button type="primary"
                     @click="createData">
            确认 新增
          </el-button>
        </div>
      </template>
      <dl class="dl-container">
        <dt>
          事件编辑
        </dt>
        <dd class="event-edit">
          <el-form ref="dataForm"
                   :rules="formRules"
                   :model="eventData"
                   label-position="right"
                   label-width="130px">
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="告警时间："
                              prop="alarm_at">
                  <el-date-picker :disabled="eventData.status > 2 || isEdit"
                                  v-model="eventData.alarm_at"
                                  type="datetime"
                                  value-format="YYYY-MM-DD HH:mm:ss"
                                  placeholder="请选择告警时间" />
                </el-form-item>
              </el-col>

              <el-col :span="14">
                <el-form-item label="告警设备："
                              prop="device">
                  <el-input :disabled="eventData.status > 2 || isEdit"
                            v-model="eventData.device"
                            placeholder="请输入告警设备" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="事件分类："
                              prop="kind">
                  <el-select :disabled="eventData.status > 2 || isEdit"
                             v-model="eventData.kind"
                             class="filter-item"
                             placeholder="请选择事件分类">
                    <el-option v-for="item in kindOptions"
                               :key="item.index"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="14">
                <el-form-item label="重要程度："
                              prop="importance">
                  <el-select :disabled="eventData.status > 2 || isEdit"
                             v-model="eventData.importance"
                             class="filter-item"
                             placeholder="请选择重要程度">
                    <el-option v-for="item in importanceOptions"
                               :key="item.index"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="10">
                <el-form-item label="攻击IP："
                              prop="src_ip">
                  <el-input :disabled="eventData.status > 2 || isEdit"
                            v-model="eventData.src_ip"
                            placeholder="请输入攻击IP后回车查询归属地址"
                            suffix-icon="Search"
                            @keyup.enter="queryAttackSip">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="地址归属："
                              prop="src_desc">
                  <el-input :disabled="eventData.status > 2 || isEdit"
                            v-model="eventData.src_desc"
                            placeholder="请输入攻击IP地址归属" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">

              <el-col :span="10">
                <el-form-item label="受害IP："
                              prop="dest_ip">
                  <el-input :disabled="eventData.status > 2 || isEdit"
                            v-model="eventData.dest_ip"
                            placeholder="请输入受害IP地址后回车查询归属地址"
                            suffix-icon="Search"
                            @keyup.enter="queryAlarmSip1">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="系统/地址归属："
                              prop="dest_desc">
                  <el-input :disabled="eventData.status > 2 || isEdit"
                            v-model="eventData.dest_desc"
                            placeholder="请输入受害IP所属系统或地址归属" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="事件摘要："
                          prop="abstract">
              <el-input :disabled="eventData.status > 2 || isEdit"
                        v-model="eventData.abstract"
                        placeholder="请输入事件摘要"
                        type="textarea"
                        :autosize="{ minRows: 5, maxRows: 10 }" />
            </el-form-item>

            <el-form-item label="告警截图："
                          class="up-img"
                          required>
              <el-upload class="upload-demo"
                         ref="upload"
                         :headers="headerObj"
                         :action="action"
                         :auto-upload="false"
                         :data="{ tid: tid }"
                         :disabled="eventData.status == 7 || eventData.status == 8"
                         :multiple="true"
                         :on-success="onSuccess"
                         :on-preview="handlePreview"
                         :file-list="imageList"
                         :accept="'.jpg,.png,.jpeg'"
                         list-type="picture-card"
                         :on-change="onImgChange"
                         :on-remove="onRemove"
                         :before-remove="beforeRemove">
                <el-icon>
                  <Plus />
                </el-icon>
              </el-upload>
              <el-dialog v-model="dialogVisible"
                         width="78%"
                         top="0"
                         title="再次点击放大图片">
                <el-carousel :autoplay="false"
                             trigger="click"
                             :height="screenHeight + 'px'"
                             ref="carousel">
                  <el-carousel-item v-for="(list, index) in imageList"
                                    :key="index"
                                    name="index">
                    <div class="img-wrap"
                         v-viewer>
                      <img :src="list.url"
                           class="carousel-image" />
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </el-dialog>
            </el-form-item>
          </el-form>
        </dd>
      </dl>
      <dl class="dl-container"
          v-if="eventData.status">
        <dt>事件进展
        </dt>
        <dd>
          <el-timeline>
            <el-timeline-item placement="top"
                              v-for="(item, index) in timelineArr"
                              :key="index"
                              :timestamp="item.deal_at">
              <el-card>
                <div>
                  <span>
                    <b>{{ item.content }}</b>
                  </span>
                  <br />
                  <br />
                  <span>
                    <el-tag :type="item.to_name$">
                      {{ getDealTag(item.from_name, item.to_name) }}
                    </el-tag>
                    {{ item.executor }} 提交于 {{ item.deal_at }}
                  </span>
                  <el-button v-if="item.from_name > 1 && item.from_name < 6 && item.to_name == 6"
                             style="margin-left: 20px;"
                             link
                             type="primary"
                             @click="router.push({ path: '/threaten-manage/hw-ban/plugging-ip', query: { id: editID, ip: eventData.src_ip } })"
                             v-show="(eventData.status == 6) &&
                      (roles.includes('处置组'))
                      ">
                    >点击进入封禁界面
                  </el-button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <div class="deal-form-box">
            <el-form label-position="top"
                     :model="determineData"
                     v-if="isShowForm"
                     label-suffix=":"
                     :rules="dealRules"
                     ref="dealForm"
                     v-show="(roles.includes('监控组') ||
              roles.includes('研判组') ||
              roles.includes('处置组'))
              ">
              <el-form-item prop="content"
                            :label="myLabelText">
                <el-input v-model="determineData.content"
                          placeholder="意见不得为空"
                          type="textarea"
                          :autosize="{ minRows: 5, maxRows: 10 }" />
              </el-form-item>
              <el-form-item v-show="(roles.includes('监控组') ||
              roles.includes('研判组') ||
              roles.includes('处置组'))
              ">
                <p v-if="isEventPut && eventData.status == 9"
                   style="padding-bottom:10px">
                  <el-tag type="danger">
                    <strong>【{{ eventPerson }} 】提交了挂起状态，处置前请先通知本人是否取消挂起状态</strong>
                  </el-tag>
                </p>
                <span style="margin-right:10px">
                  <el-button type="success"
                             @click="saveDeal(3)"
                             v-show="eventData.status == 1 && roles.includes('监控组')">
                    提交研判
                  </el-button>

                  <!-- status：2，3，4，5 -->
                  <!-- 当前在研判组，通过则提交给处置组，或者退回监控组，或者给二线审核，或办结 -->
                  <el-button type="success"
                             @click="saveDeal(6)"
                             v-show="(eventData.status == 4 || eventData.status == 5 || eventData.status == 9) && roles.includes('研判组')">
                    提交处置
                  </el-button>

                  <el-button type="primary"
                             @click="saveDeal(4)"
                             v-show="(eventData.status == 2 || eventData.status == 3) && roles.includes('研判组')">
                    提交复核
                  </el-button>
                  <!-- status：2，3，4，5 -->
                  <el-button type="warning"
                             @click="saveDeal(1)"
                             v-show="((eventData.status > 1 && eventData.status < 6) || eventData.status == 9) && roles.includes('研判组')">
                    退回监控
                  </el-button>

                  <!--status：1，2，3，4，5，6  -->
                  <!-- 当前在处置组，处置完成可以完成，可以退回研判组，可以办结 -->
                  <!-- status：6 -->
                  <el-button type="success"
                             @click="saveDeal(8)"
                             v-show="eventData.status === 6 && roles.includes('处置组')">
                    处置完成
                  </el-button>
                  <!-- status：2，3，4，5 -->
                  <el-button type="warning"
                             @click="saveDeal(5)"
                             v-show="eventData.status === 6 && roles.includes('处置组')">
                    退回研判
                  </el-button>
                  <el-button type="info"
                             @click="saveDeal(7)"
                             v-show="(eventData.status < 7 || eventData.status == 9) &&
                  (roles.includes('研判组') ||
                    roles.includes('处置组'))
                  ">
                    事件办结
                  </el-button>

                </span>
                <span v-if="eventData.status != 9">
                  <el-button type="danger"
                             @click="saveDeal(9)"
                             v-show="(eventData.status == 4 || eventData.status == 6) &&
                  (roles.includes('研判组') ||
                    roles.includes('处置组'))
                  ">
                    事件挂起
                  </el-button>
                </span>
                <span v-else>
                  <el-button type="danger"
                             @click="saveDeal(4)"
                             v-show="(eventData.status == 9) &&
                  (roles.includes('研判组') ||
                    roles.includes('处置组'))
                  ">
                    挂起恢复
                  </el-button>
                </span>
              </el-form-item>
            </el-form>
          </div>
        </dd>
      </dl>
    </dp>
  </div>
</template>


<style lang="scss" scoped>
.event-edit {
	:deep(.el-dialog__title) {
		font-size: 11px;
		color: red;
		text-align: center;
		display: block;
	}
}
.up-img {
	padding-top: 20px;
}

.carousel-image {
	cursor: pointer;

	max-width: 100%;
	max-height: 100%;
}
.deal-form-box {
	padding: 20px;
	padding-top: 40px;
}
</style>
