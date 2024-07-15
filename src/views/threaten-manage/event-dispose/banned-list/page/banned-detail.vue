<script setup lang='ts'>
    import { ElMessage, ElMessageBox } from 'element-plus';
    import type { UploadProps, UploadUserFile } from 'element-plus'
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import * as api from '../api';

    //路由
    const route = useRoute();
    //从路由获取信息
    const bannedInfo = route.query;
    // const bannedInfo = ref({
    //     ip: '10.1.101.1',
    //     biz_level: '安全运营平台',
    //     scan_status: '服务器',
    //     scan_firm: '云主机',
    //     scan_version: '人保科技',
    //     scan_ip: '安全部',
    //     room: '张三',
    //     network_area: '张三',
    //     scan1: '张三',
    //     database: '张三',
    //     centers: '南数据中心',
    //     computer_room: '中心机房406',
    //     description: '内网'
    // })
    const eventInfo = route.query

    const router = useRouter();
    const backIndex = () => {
        router.push({ path: '/threaten-manage/event-dispose/banned-list', query: {} });
    };

    let research = ref({
        idea: '影响Centos 9.0版本以下的主机',
        investigator: '张三',
        researchTime: '2024-01-01 08:00:00'
    })
    let tagList = ref([
        { name: '待研判', color: '#409EFF' },
        { name: '新发现', color: 'red' }
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
    let researchSecond = ref({
        disposalObject: '处置源IP',
        disposalMode: '自动封禁',
        opinion: '建议封禁源IP 10.1.101.1',
        investigator: '张三',
        researchTime: '2024-01-01 08:00:00'
    })
    let isShow = ref(true);
    let opinions = ref({
        firstIdea: '初审意见',
        firstInstance: '张三',
        firstTime: '2024-01-01 08:00:00',
        secondIdea: '复审意见',
        secondInstance: '张三',
        secondTime: '2024-01-01 08:00:00'
    })

    const getDetail = () => {
        newEventTackList.value.push(eventTackList.value[eventTackList.value.length - 1])
    }
    getDetail();

    // 初审
    const firstInstance = () => {
        if(opinions.value.firstIdea == ''){
            ElMessage.warning('请填写初审意见');
            return false;
        }
        router.push({ path: '/threaten-manage/event-dispose/banned-list', query: {} });
    }

    // 复审
    const reExamine = () => {
        if(opinions.value.secondIdea == ''){
            ElMessage.warning('请填写复审意见');
            return false;
        }router.push({ path: '/threaten-manage/event-dispose/banned-list', query: {} });
    }

</script>

<template>
    <div>
        <dp title="封禁列表详情" @back="backIndex" :desc="bannedInfo.id">
            <template #right>
                <el-button type="primary" v-if="bannedInfo.network_area == '待审核'" @click="firstInstance">初审</el-button>
                <el-button type="primary" v-if="bannedInfo.network_area == '已通过' && bannedInfo.biz_state == '待审核'" @click="reExamine">复审</el-button>
            </template>
            <div>
                <dl class="dl-container-position" v-if="bannedInfo.network_area == '待审核'">
                    <dt>初审信息</dt>
                    <el-form :model="opinions" label-width="120px">
                        <el-form-item label="初审意见">
                            <el-input 
                                v-model="opinions.firstIdea" 
                                style="width:400px;"
                                :rows="4"
                                type="textarea"
                                placeholder="请填写初审意见"
                            />
                        </el-form-item>
                    </el-form>
                </dl>
                <dl class="dl-container-position" v-if="bannedInfo.network_area == '已通过' && bannedInfo.biz_state == '待审核'">
                    <dt>复审信息</dt>
                    <el-form :model="opinions" label-width="120px">
                        <el-form-item label="复审意见">
                            <el-input 
                                v-model="opinions.secondIdea" 
                                style="width:400px;"
                                :rows="4"
                                type="textarea"
                                placeholder="请填写复审意见"
                            />
                        </el-form-item>
                    </el-form>
                </dl>
                <dl class="dl-container-position" v-if="bannedInfo.network_area != '待审核'">
                    <dt>初审信息</dt>
                    <el-form :model="opinions" label-width="120px">
                        <el-form-item label="初审意见">
                            <span class="inputs">{{opinions.firstIdea}}</span>
                        </el-form-item>
                        <el-form-item label="初审人">
                            <span class="inputs">{{opinions.firstInstance}}</span>
                        </el-form-item>
                        <el-form-item label="初审时间">
                            <span class="inputs">{{opinions.firstTime}}</span>
                        </el-form-item>
                    </el-form>
                </dl>
                <dl class="dl-container-position" v-if="bannedInfo.network_area == '已通过' && bannedInfo.biz_state != '待审核'">
                    <dt>复审信息</dt>
                    <el-form :model="opinions" label-width="120px">
                        <el-form-item label="复审意见">
                            <span class="inputs">{{opinions.secondIdea}}</span>
                        </el-form-item>
                        <el-form-item label="复审人">
                            <span class="inputs">{{opinions.secondInstance}}</span>
                        </el-form-item>
                        <el-form-item label="复审时间">
                            <span class="inputs">{{opinions.secondTime}}</span>
                        </el-form-item>
                    </el-form>
                </dl>
                <dl class="dl-container-position">
                    <dt>封禁信息</dt>
                    <dd>
                        <table class="m_table">
                            <tr>
                                <td class="table-title">ID</td>
                                <td>{{ bannedInfo.id }}</td>
                                <td class="table-title">封禁对象</td>
                                <td>已封禁</td>
                            </tr>
                            <tr>
                                <td class="table-title">封禁IP</td>
                                <td>{{ bannedInfo.ip }}</td>
                                <td class="table-title">状态</td>
                                <td>已封禁</td>
                            </tr>
                            <tr>
                                <td class="table-title">攻击源区域</td>
                                <td>广东省广州市</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                    </dd>
                </dl>
                <dl class="dl-container-position">
                    <dt>防火墙设备</dt>
                    <dd>
                        <table class="m_table">
                            <tr>
                                <td class="table-title">防火墙IP</td>
                                <td>{{ bannedInfo.biz_class }}</td>
                                <td class="table-title">防火墙设备</td>
                                <td>{{ bannedInfo.biz_type }}</td>
                            </tr>
                            <tr>
                                <td class="table-title">设备品牌</td>
                                <td>{{ bannedInfo.biz_plate }}</td>
                                <td class="table-title">设备型号</td>
                                <td>{{ bannedInfo.mail_of_main }}</td>
                            </tr>
                            <tr>
                                <td class="table-title">所属中心</td>
                                <td>{{ bannedInfo.tp_of_main }}</td>
                                <td class="table-title">管理员</td>
                                <td>张三</td>
                            </tr>
                        </table>
                    </dd>
                </dl>
                <dl class="dl-container-position">
                    <dt>事件跟踪</dt>
                    <div style="display: flex; justify-content: space-between;">
                        <el-timeline class="timelines" v-show="!isShow">
                            <el-timeline-item v-for="(item, index) in eventTackList" :key="index">
                                <div style="font-weight: bold;">{{ item.contents }}<span class="spanBox">{{item.timestamps}}</span></div>
                                <div style="padding-top: 10px;">{{ item.root }}<span>{{item.names}}</span></div>
                                <div style="padding-top: 10px;">{{ item.decs }}</div>
                            </el-timeline-item>
                        </el-timeline>
                        <el-timeline class="timelines" v-show="isShow">
                            <el-timeline-item v-for="(item, index) in newEventTackList" :key="index">
                                <div style="font-weight: bold;">{{ item.contents }}<span class="spanBox">{{item.timestamps}}</span></div>
                            </el-timeline-item>
                        </el-timeline>
                        <div class="more-filter-btn">
                            <el-button link type="primary" @click="isShow = !isShow"
                                :icon="isShow ? 'ArrowDownBold' : 'ArrowUpBold'">
                                {{ isShow ? '展开' : '收起' }}
                            </el-button>
                        </div>
                    </div>
                </dl>
            </div>
        </dp>
    </div>
</template>
<style scoped lang="scss">
    @import '@/theme/mixins/formReset.scss';

    .table-title {
        width: 150px;
        font-weight: bold;
    }
    .inputs{
        padding-left: 12px;
    }
    .tagColor {
        margin-right: 10px;
    }

    .timelines {
        max-width: 80%;
        padding: 20px;
        font-size: 12px;
        .spanBox {
            color: #909399;
            margin-left: 20px;
        }
    }
</style>