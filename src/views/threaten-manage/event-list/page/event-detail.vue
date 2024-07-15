<script setup lang='ts'>
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import uploadPreview from '@/components/upload-preview/index.vue';

import * as api from '../api';

//路由
const route = useRoute();
//从路由获取信息
// const assetsInfo = route.query;
const assetsInfo = ref({
    ip: '10.1.101.1',
    biz_level: '安全运营平台',
    scan_status: '服务器',
    scan_firm: '云主机',
    scan_version: '人保科技',
    scan_ip: '安全部',
    room: '张三',
    network_area: '张三',
    scan1: '张三',
    database: '张三',
    centers: '南数据中心',
    computer_room: '中心机房406',
    description: '内网'
})
const eventInfo = route.query

const router = useRouter();
const backIndex = () => {
    router.back();
};

let research = ref({
    idea: '影响Centos 9.0版本以下的主机',
    investigator: '张三',
    researchTime: '2024-01-01 08:00:00'
})
let researchSecond = ref({
    disposalObject: '处置源IP',
    disposalMode: '自动封禁',
    opinion: '建议封禁源IP 10.1.101.1',
    investigator: '张三',
    researchTime: '2024-01-01 08:00:00'
})
let disposeObjList = ref([
    { label: '处置源IP', value: '处置源IP' },
    { label: '目标IP', value: '目标IP' },
])
let disposeModeList = ref([
    { label: '自动封禁', value: '自动封禁' },
    { label: '人工派单', value: '人工派单' },
])
let tagList = ref([
    { name: '待研判', color: '#409EFF'},
    { name: '新发现', color: 'red'}
])
const eventTackList = ref([
  {
    contents: '录入事件',
    timestamps: '2024-01-01 08:00:00',
    root: '安全处',
    names: '张三',
    decs: '手动导入数据'
  },
  {
    contents: '事件排查',
    timestamps: '2024-01-01 08:00:00',
    root: '安全处',
    names: '张三',
    decs: '事件排查工单号：PC20240101000001'
  },
  {
    contents: '一级研判',
    timestamps: '2024-01-01 08:00:00',
    root: '安全处',
    names: '张三',
    decs: '影响Centos 9.0版本以下的主机，需要立刻处理。'
  },
  {
    contents: '二级研判',
    timestamps: '2024-01-01 08:00:00',
    root: '安全处',
    names: '张三',
    decs: '处置源IP：10.1.101.1,建议封禁。自动封禁IP单号：PC20240101000001'
  },
  {
    contents: '事件挂起',
    timestamps: '2024-01-01 08:00:00',
    root: '安全处',
    names: '张三',
    decs: '事件挂起。'
  }
])
let newEventTackList = ref([])

let isShow = ref(true)
let showUpload = ref(false);
const getDetail = () => {
    if(eventInfo.status == '未处置' || eventInfo.status == '一级研判'){
        showUpload.value = false;
    }else{
        showUpload.value = true;
    }
    newEventTackList.value.push(eventTackList.value[eventTackList.value.length - 1])
}
getDetail()

// 挂起
const hangUp = () => {
    ElMessageBox.confirm(
        '您正在执行事件挂起操作，其他用户无法编辑和处置挂起状态事件，是否确认继续操作？',
        '挂起事件',
    {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
    }).then(() => {
        ElMessage({
            type: 'success',
            message: '事件挂起成功',
        })
        router.push({ path: '/threaten-manage/event-list'});
    }).catch(() => {})
}

// 办结
let dialogConcludeVisible = ref(false);
let ConcludeForm = ref({
    concludeTime: '',
    concludeAgent: '',
    concludeReason: ''
})
const conclude = () => {
    dialogConcludeVisible.value = true;
    ConcludeForm.value = {
        concludeTime: '',
        concludeAgent: '',
        concludeReason: ''
    }
}
const concludeSure = () => {
    if(ConcludeForm.value.concludeTime == ''){
        return ElMessage.warning('请选择办结时间')
    }else if(ConcludeForm.value.concludeAgent == ''){
        return ElMessage.warning('请填写办结人')
    }else if(ConcludeForm.value.concludeReason == ''){
        return ElMessage.warning('请填写办结原因')
    }
    ElMessage.success('办结操作成功')
    dialogConcludeVisible.value = false;
    router.push({ path: '/threaten-manage/event-list'});
}

// 退回监控
let dialogSendVisible = ref(false);
let sendForm = ref({
    sendTime: '',
    sendAgent: '',
    sendReason: ''
})
const sendBack = () => {
    dialogSendVisible.value = true;
    sendForm.value = {
        sendTime: '',
        sendAgent: '',
        sendReason: ''
    }
}
const sendSure = () => {
    if(sendForm.value.sendTime == ''){
        return ElMessage.warning('请选择退回时间')
    }else if(sendForm.value.sendAgent == ''){
        return ElMessage.warning('请填写退回人')
    }else if(sendForm.value.sendReason == ''){
        return ElMessage.warning('请填写退回原因')
    }
    ElMessage.success('退回监控成功')
    dialogSendVisible.value = false;
    router.push({ path: '/threaten-manage/event-list'});
}

// 派发事件排查工单
const distribute = () => {
    let arr = []
    arr.push(eventInfo)
    router.push({
		path: '/threaten-manage/event-list/dispatch-event',
		query: { arr: JSON.stringify(arr), imgList: JSON.stringify(imgList.value) },
	});
}

// 提交研判信息
const submit = () => {
    if(eventInfo.status == '未处置'){
        if(research.value.idea == ''){
            return ElMessage.warning('请填写一级研判意见')
        }
    }else if(eventInfo.status == '一级研判'){
        if(research.value.idea == ''){
            return ElMessage.warning('请填写一级研判意见')
        }
        if(researchSecond.value.disposalObject == ''){
            return ElMessage.warning('请选择二级研判处置对象')
        }else if(researchSecond.value.disposalMode == ''){
            return ElMessage.warning('请选择二级研判处置方式')
        }else if(researchSecond.value.opinion == ''){
            return ElMessage.warning('请填写二级研判意见')
        }
    }
    
    ElMessage.success('提交研判信息')
    router.push({ path: '/threaten-manage/event-list'});
}

// 解锁
const Unlock = () => {
    ElMessage.success('解锁')
    router.push({ path: '/threaten-manage/event-list'});
}
// 相关截图
let imgList = ref([]);
const uploadResult = (val) => {
	imgList.value = val.value;
};

</script>
  
<template>
    <div>
        <dp title="事件列表详情" @back="backIndex" :desc="route.query.detailID">
            <template #right>
                <el-button type="warning" v-if="eventInfo.status == '未处置' || eventInfo.status == '一级研判'" @click="hangUp">挂起</el-button>
                <el-button type="warning" v-if="eventInfo.status == '事件挂起'" @click="Unlock">解锁</el-button>
                <el-button type="success" v-if="eventInfo.status == '未处置' || eventInfo.status == '一级研判'" @click="conclude">办结</el-button>
                <el-button type="success" v-if="eventInfo.status == '未处置' || eventInfo.status == '一级研判'" @click="sendBack">退回监控</el-button>
                <el-button type="primary" v-if="eventInfo.status == '未处置' || eventInfo.status == '一级研判'" @click="distribute">派发事件排查工单</el-button>
                <el-button type="primary" v-if="eventInfo.status == '未处置' || eventInfo.status == '一级研判'" @click="submit">提交研判信息</el-button>
            </template>
            <div>
                <dl class="dl-container-position" v-if="eventInfo.status == '未处置' || eventInfo.status == '一级研判'">
                    <dt>一级研判信息</dt>
                    <el-form :model="research" label-width="120px">
                        <el-form-item label="研判意见">
                            <el-input 
                                v-model="research.idea" 
                                style="width:400px;"
                                :rows="4"
                                type="textarea"
                            />
                        </el-form-item>
                    </el-form>
                </dl>
                <dl class="dl-container-position" v-if="eventInfo.status == '研判通过' || eventInfo.status == '事件挂起'">
                    <dt>一级研判信息</dt>
                    <dd>
                        <el-form :model="research" label-width="120px">
                            <el-form-item label="研判意见">
                                <span class="inputs">{{research.idea}}</span>
                            </el-form-item>
                            <el-form-item label="研判人">
                                <span class="inputs">{{research.investigator}}</span>
                            </el-form-item>
                            <el-form-item label="研判时间">
                                <span class="inputs">{{research.researchTime}}</span>
                            </el-form-item>
                        </el-form>
                    </dd>
                </dl>
                <dl class="dl-container-position" v-if="eventInfo.status == '一级研判'">
                    <dt>二级研判信息</dt>
                    <el-form :model="researchSecond" label-width="120px">
                        <el-form-item label="处置对象">
                            <el-select v-model="researchSecond.disposalObject" style="width:400px;">
                                <el-option :label="item.label" :value="item.value" v-for="item in disposeObjList" :key="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="处置方式">
                            <el-select v-model="researchSecond.disposalMode" style="width:400px;">
                                <el-option :label="item.label" :value="item.value" v-for="item in disposeModeList" :key="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="研判意见">
                            <el-input 
                                v-model="researchSecond.opinion" 
                                style="width:400px;"
                                :rows="4"
                                type="textarea"
                            />
                        </el-form-item>
                    </el-form>
                </dl>
                <dl class="dl-container-position" v-if="eventInfo.status == '研判通过' || eventInfo.status == '事件挂起'">
                    <dt>二级研判信息</dt>
                    <dd>
                        <el-form :model="researchSecond" label-width="120px">
                            <el-form-item label="处置对象">
                                <span class="inputs">{{researchSecond.disposalObject}}</span>
                            </el-form-item>
                            <el-form-item label="处置方式">
                                <span class="inputs">{{researchSecond.disposalMode}}</span>
                            </el-form-item>
                            <el-form-item label="研判意见">
                                <span class="inputs">{{researchSecond.opinion}}</span>
                            </el-form-item>
                            <el-form-item label="研判人">
                                <span class="inputs">{{researchSecond.investigator}}</span>
                            </el-form-item>
                            <el-form-item label="研判时间">
                                <span class="inputs">{{researchSecond.researchTime}}</span>
                            </el-form-item>
                        </el-form>
                    </dd>
                </dl>
                <dl class="dl-container-position">
                    <dt>受影响资产信息
                        <el-tag v-if="eventInfo.status == '未处置'" type="primary" style="margin-left:20px;">新增事件</el-tag>
                        <el-tag v-if="eventInfo.status == '一级研判'" type="primary" style="margin-left:20px;">一级研判</el-tag>
                        <el-tag v-if="eventInfo.status == '事件挂起'" type="primary" style="margin-left:20px;">挂起</el-tag>
                    </dt>
                    <dd>
                        <table class="m_table">
                            <tr>
                                <td class="table-title">IP</td>
                                <td>{{ assetsInfo.ip }}</td>
                                <td class="table-title">所属应用系统</td>
                                <td>{{ assetsInfo.biz_level }}</td>
                            </tr>
                            <tr>
                                <td class="table-title">资产大类</td>
                                <td>{{ assetsInfo.scan_status }}</td>
                                <td class="table-title">资产类型</td>
                                <td>{{ assetsInfo.scan_firm }}</td>
                            </tr>
                            <tr>
                                <td class="table-title">所属公司</td>
                                <td>{{ assetsInfo.scan_version }}</td>
                                <td class="table-title">所属处室</td>
                                <td>{{ assetsInfo.scan_ip }}</td>
                            </tr>
                            <tr>
                                <td class="table-title">主机管理员</td>
                                <td>{{ assetsInfo.room }}</td>
                                <td class="table-title">应用管理员</td>
                                <td>{{ assetsInfo.network_area }}</td>
                            </tr>
                            <tr>
                                <td class="table-title">中间件管理员</td>
                                <td>{{ assetsInfo.scan1 }}</td>
                                <td class="table-title">数据库管理员</td>
                                <td>{{ assetsInfo.database }}</td>
                            </tr>
                            <tr>
                                <td class="table-title">数据中心</td>
                                <td>{{ assetsInfo.centers }}</td>
                                <td class="table-title">机房</td>
                                <td>{{ assetsInfo.computer_room }}</td>
                            </tr>
                        </table>
                        <table class="m_table">
                            <tr></tr>
                            <tr>
                            <td class="table-title">部署区域</td>
                            <td>{{ assetsInfo.description }}</td>
                            </tr>
                        </table>
                    </dd>
                </dl>
                <dl class="dl-container-position">
                    <dt>事件信息</dt>
                    <dd>
                        <el-form :model="eventInfo" label-width="120px">
                            <el-form-item label="事件ID">
                                <span class="inputs">{{eventInfo.id}}</span>
                            </el-form-item>
                            <el-form-item label="事件类型">
                                <span class="inputs" style="color: #165dff;">{{eventInfo.biz_state}}</span>
                            </el-form-item>
                            <el-form-item label="攻击源IP">
                                <span class="inputs">{{eventInfo.supplier}}</span>
                            </el-form-item>
                            <el-form-item label="攻击源地域">
                                <span class="inputs">{{eventInfo.network_area}}</span>
                            </el-form-item>
                            <el-form-item label="事件描述">
                                <span class="inputs">{{eventInfo.biz_type}}</span>
                            </el-form-item>
                            <el-form-item label="发生次数">
                                <span class="inputs">{{eventInfo.biz_plate}}</span>
                            </el-form-item>
                            <el-form-item label="风险等级">
                                <span class="inputs" style="color: #ff0000;">{{eventInfo.mail_of_main}}</span>
                            </el-form-item>
                            <el-form-item label="风险描述">
                                <span class="inputs">{{eventInfo.tp_of_main}}</span>
                            </el-form-item>
                            <el-form-item label="修复建议">
                                <span class="inputs">{{eventInfo.solution}}</span>
                            </el-form-item>
                            <el-form-item label="发布时间">
                                <span class="inputs">{{eventInfo.domain}}</span>
                            </el-form-item>
                            <el-form-item label="录入时间">
                                <span class="inputs">{{eventInfo.load_ip}}</span>
                            </el-form-item>
                            <el-form-item label="数据来源">
                                <span class="inputs">{{eventInfo.public_ip}}</span>
                            </el-form-item>
                            <el-form-item label="执行人">
                                <span class="inputs">{{eventInfo.exec}}</span>
                            </el-form-item>
                        </el-form>
                    </dd>
                </dl>
                <dl class="dl-container-position" v-if="!showUpload || imgList.length > 0">
                    <dt>相关截图</dt>
                    <uploadPreview api="" :imgList="imgList" :showUpload="showUpload" @uploadResult="uploadResult" />
                </dl>
                <dl class="dl-container-position">
                    <dt>标签信息</dt>
                    <div style="padding: 10px 10px 10px 30px;">
                        <el-tag v-for="item in tagList" :key="item.name" type="primary" class="tagColor" :style="{color:item.color}">{{item.name}}</el-tag>
                    </div>
                </dl>
                <dl class="dl-container-position">
                    <dt>事件跟踪</dt>
                    <div style="display: flex; justify-content: space-between;">
                        <el-timeline class="timelines" v-show="!isShow">
                            <el-timeline-item
                                v-for="(item, index) in eventTackList"
                                :key="index"
                            >
                                <div style="font-weight: bold;">{{ item.contents }}<span class="spanBox">{{item.timestamps}}</span></div>
                                <div style="padding-top: 10px;">{{ item.root }}<span>{{item.names}}</span></div>
                                <div style="padding-top: 10px;">{{ item.decs }}</div>
                            </el-timeline-item>
                        </el-timeline>
                        <el-timeline class="timelines" v-show="isShow">
                            <el-timeline-item
                                v-for="(item, index) in newEventTackList"
                                :key="index"
                            >
                                <div style="font-weight: bold;">{{ item.contents }}<span class="spanBox">{{item.timestamps}}</span></div>
                            </el-timeline-item>
                        </el-timeline>
                        <div class="more-filter-btn">
                            <el-button link type="primary" @click="isShow = !isShow" :icon="isShow ? 'ArrowDownBold' : 'ArrowUpBold'">
                                {{ isShow ? '展开' : '收起' }}
                            </el-button>
                        </div>
                    </div>
                </dl>
            </div>
        </dp>

        <el-dialog v-model="dialogConcludeVisible" title="办结事件" width="500">
            <div style="margin-bottom: 10px;"><span style="color:red;">*</span>办结信息</div>
            <el-form :model="ConcludeForm" label-width="85px">
              <el-form-item label="办结时间" >
                <el-date-picker v-model="ConcludeForm.concludeTime" type="datetime" style="width: 100%;"
                      placeholder="请选择发现时间" value-format="YYYY-MM-DD HH:mm:ss" />
              </el-form-item>
              <el-form-item label="办结人" >
                <el-input v-model="ConcludeForm.concludeAgent" autocomplete="off" />
              </el-form-item>
            </el-form>
            <div><span style="color:red;">*</span>办结原因</div>
            <div style="padding: 10px 0 0 30px;">
                <el-input
                    v-model="ConcludeForm.concludeReason"
                    maxlength="500"
                    :rows="5"
                    placeholder="请填写办结原因，字数限制500字"
                    show-word-limit
                    type="textarea"
                />
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="concludeSure">确定</el-button>
                    <el-button @click="dialogConcludeVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="dialogSendVisible" title="退回监控" width="500">
            <div style="margin-bottom: 10px;"><span style="color:red;">*</span>退回信息</div>
            <el-form :model="sendForm" label-width="85px">
              <el-form-item label="退回时间" >
                <el-date-picker v-model="sendForm.sendTime" type="datetime" style="width: 100%;"
                      placeholder="请选择退回时间" value-format="YYYY-MM-DD HH:mm:ss" />
              </el-form-item>
              <el-form-item label="退回人" >
                <el-input v-model="sendForm.sendAgent" autocomplete="off" />
              </el-form-item>
            </el-form>
            <div><span style="color:red;">*</span>退回原因</div>
            <div style="padding: 10px 0 0 30px;">
                <el-input
                    v-model="sendForm.sendReason"
                    maxlength="500"
                    :rows="5"
                    placeholder="请填写退回原因，字数限制500字"
                    show-word-limit
                    type="textarea"
                />
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="sendSure">确定</el-button>
                    <el-button @click="dialogSendVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<style scoped lang="scss">
    @import '@/theme/mixins/formReset.scss';
    .inputs{
        padding-left: 12px;
    }
    .table-title {
        width: 150px;
        font-weight: bold;
    }
    .tagColor{
        margin-right: 10px;
    }
    .timelines{
        max-width: 80%;
        padding: 20px;
        font-size: 12px;
        .spanBox{
            color:#909399;
            margin-left: 20px;
        }
    }
    :deep(.el-dialog__footer){
        text-align: center;
    }
    
</style>