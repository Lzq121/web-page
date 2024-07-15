<script setup lang='ts'>
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadProps, UploadUserFile, FormRules, FormInstance  } from 'element-plus'
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as echarts from 'echarts';
import * as api from '../api';

//路由
const route = useRoute();
//从路由获取信息
const monitorInfo = ref({
    id: 'EQ061240101000001',
    biz_level: '北中心内网区EDR',
    scan_status: '在线',
    scan_firm: '10.1.101.1',
    scan_version: '10.1.101.1',
    scan_ip: '安全设备',
    room: 'EDR',
    network_area: '人保科技',
    scan1: '安全部',
    database: '1.0',
    startTime: '2024-01-01',
    endTime: '2024-01-01',

    dataCenter: '南数据中心',
    computer_room: '南中心1层01-0001机房',
    cabinet: '04-001',
    startU: '04-001-12',
    endU: '04-001-16',
    number: '4',
    area: '内网',
})
// const monitorInfo = route.query

const router = useRouter();
const backIndex = () => {
    router.push({ path: '/threaten-manage/secure-equipment/device-monitor', query: {} });
};

let disabledShow = ref(true)
let userList = ref([
    { role: '主机管理员', name: '张三', phone: '-', email: 'zhangsan@picc.com', section: '南数据中心运维一组'}
])
let monitorParam = ref({
    cpu_usage: '40',
    memory_usage: '30',
    disk_usage: '75',
})

const getDetail = () => {
    
}
getDetail()

onMounted(() => {
    echartsAll();
})
// cpu
let cpuMonitor = ref();
let cpuDataX = ref(['2024-01-01','2024-01-02','2024-01-03','2024-01-04','2024-01-05','2024-01-06','2024-01-07']);
let cpuDataY= ref([71,82,89,71,70,87,92]);
// 内存
let memoryMonitor = ref();
let memoryDataX = ref(['2024-01-01','2024-01-02','2024-01-03','2024-01-04','2024-01-05','2024-01-06','2024-01-07']);
let memoryDataY= ref([71,82,89,71,70,87,92]);
// 磁盘
let diskMonitor = ref();
let diskDataX = ref(['2024-01-01','2024-01-02','2024-01-03','2024-01-04','2024-01-05','2024-01-06','2024-01-07']);
let diskDataY= ref([71,82,89,71,70,87,92]);
let echartsAll = () => {
    // 近7日CPU占用率趋势
    var myChart = echarts.init(cpuMonitor.value);
    window.addEventListener('resize', () => {
        myChart.resize();
    });
    let option = {
        title: {
            text: '近7日CPU占用率趋势',
        },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: cpuDataX.value,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '近7日CPU占用率趋势',
                data: cpuDataY.value,
                type: 'line',
                smooth: true,
                symbolSize: 6,
                symbol: 'circle',
            },
        ],
    };
    option && myChart.setOption(option);

    // 近7日内存占用率趋势
    var myChart1 = echarts.init(memoryMonitor.value);
    window.addEventListener('resize', () => {
        myChart1.resize();
    });
    let option1 = {
        title: {
            text: '近7日内存占用率趋势',
        },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: memoryDataX.value,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '近7日内存占用率趋势',
                data: memoryDataY.value,
                type: 'line',
                smooth: true,
                symbolSize: 6,
                symbol: 'circle',
            },
        ],
    };
    option1 && myChart1.setOption(option1);

    // 近7日磁盘使用率趋势
    var myChart2 = echarts.init(diskMonitor.value);
    window.addEventListener('resize', () => {
        myChart2.resize();
    });
    let option2 = {
        title: {
            text: '近7日磁盘使用率趋势',
        },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: diskDataX.value,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '近7日磁盘使用率趋势',
                data: diskDataY.value,
                type: 'line',
                smooth: true,
                symbolSize: 6,
                symbol: 'circle',
            },
        ],
    };
    option2 && myChart2.setOption(option2);
}


// 巡检日志
let inspectLoading = ref(false);
let inspectParams = ref({
    page: 1,
    limit: 10,
    total: 5
})
let inspectColumns = [
    { dataIndex: 'status', title: '状态', width: '90px',isTag: true },
    { dataIndex: 'time', title: '巡检时间', width: '190px' },
    { dataIndex: 'task', title: '巡检任务', width: '300px' },
    { dataIndex: 'executor', title: '操作人' },
    { dataIndex: 'operate', title: '操作', fixed: 'right', width: 120}
]
let inspectData = ref([
    {status: '2', task: '2024年1月1日-安全设备日常巡检(上午)', time: '2024-01-01 08:00:00', executor: '张三'},
    {status: '1', task: '2024年1月1日-安全设备日常巡检(下午)', time: '2024-01-01 08:00:00', executor: '张三'},
    {status: '0', task: '2024年1月1日-安全设备日常巡检(下午)', time: '2024-01-01 08:00:00', executor: '张三'},
    {status: '1', task: '2024年1月1日-安全设备日常巡检(上午)', time: '2024-01-01 08:00:00', executor: '张三'},
    {status: '2', task: '2024年1月1日-安全设备日常巡检(下午)', time: '2024-01-01 08:00:00', executor: '张三'}
])
const inspectSizeChange = (val: any) => {
    inspectParams.value.limit = val;
    inspectParams.value.page = 1;
};
const inspectCurrentChange = (val: any) => {
    inspectParams.value.page = val;
};
const examine = (row: any) => {
    
}

</script>

<template>
    <div>
        <dp title="设备监控详情" @back="backIndex" :desc="route.query.detailID">
            <div>
                <dl class="dl-container-position">
                    <dt>基础信息</dt>
                    <dd>
                        <el-form :model="monitorInfo" :inline="true" label-width="120px" :disabled="disabledShow">
                            <el-form-item label="ID">
                                <el-input v-model="monitorInfo.id" />
                            </el-form-item>
                            <el-form-item label="设备名称">
                                <el-input v-model="monitorInfo.biz_level" />
                            </el-form-item>
                            <el-form-item label="状态">
                                <el-input v-model="monitorInfo.scan_status" />
                            </el-form-item>
                            <el-form-item label="IP地址">
                                <el-input v-model="monitorInfo.scan_firm" />
                            </el-form-item>
                            <el-form-item label="IPMI地址">
                                <el-input v-model="monitorInfo.scan_version" />
                            </el-form-item>
                            <el-form-item label="设备大类">
                                <el-input v-model="monitorInfo.scan_ip" />
                            </el-form-item>
                            <el-form-item label="资产类型">
                                <el-input v-model="monitorInfo.room" />
                            </el-form-item>
                            <el-form-item label="所属公司">
                                <el-input v-model="monitorInfo.network_area" />
                            </el-form-item>
                            <el-form-item label="所属处室">
                                <el-input v-model="monitorInfo.scan1" />
                            </el-form-item>
                            <el-form-item label="软件版本">
                                <el-input v-model="monitorInfo.database" />
                            </el-form-item>
                            <el-form-item label="维保开始时间">
                                <el-input v-model="monitorInfo.startTime" />
                            </el-form-item>
                            <el-form-item label="维保终止时间">
                                <el-input v-model="monitorInfo.endTime" />
                            </el-form-item>
                        </el-form>
                    </dd>
                </dl>
                <dl class="dl-container-position">
                    <dt>部署信息</dt>
                    <el-form :model="monitorInfo" :inline="true" label-width="120px" :disabled="disabledShow">
                        <el-form-item label="数据中心">
                            <el-input v-model="monitorInfo.dataCenter" />
                        </el-form-item>
                        <el-form-item label="机房">
                            <el-input v-model="monitorInfo.computer_room" />
                        </el-form-item>
                        <el-form-item label="机柜">
                            <el-input v-model="monitorInfo.cabinet" />
                        </el-form-item>
                        <el-form-item label="起始U位">
                            <el-input v-model="monitorInfo.startU" />
                        </el-form-item>
                        <el-form-item label="终止U位">
                            <el-input v-model="monitorInfo.endU" />
                        </el-form-item>
                        <el-form-item label="U位数">
                            <el-input v-model="monitorInfo.number" />
                        </el-form-item>
                        <el-form-item label="部署区域">
                            <el-input v-model="monitorInfo.area" />
                        </el-form-item>
                    </el-form>
                </dl>
                <dl class="dl-container-position">
                    <dt>管理员信息</dt>
                    <div class="table-box paddingBox">
                        <el-table :data="userList" border style="width: 100%;">
                            <el-table-column align="center" type="index" label="序号" width="60"  />
                            <el-table-column align="center" prop="role" label="职责/角色"  />
                            <el-table-column align="center" prop="name" label="姓名" />
                            <el-table-column align="center" prop="phone" label="电话" />
                            <el-table-column align="center" prop="email" label="邮件" />
                            <el-table-column align="center" prop="section" label="所属部门" />
                        </el-table>
                    </div>
                </dl>
                <dl class="dl-container-position">
                    <dt>性能监控</dt>
                    <div class="progressBox">
                        <div style="display: flex;">
                            CPU占用率
                            <el-progress 
                                v-if="monitorParam.cpu_usage"
                                status="exception"
                                :stroke-width="12"
                                :percentage="parseFloat(monitorParam.cpu_usage) >100 ? 100 : parseFloat(monitorParam.cpu_usage)"
                            >{{monitorParam.cpu_usage}}%</el-progress>
                        </div>
                        <div style="display: flex;">
                            内存占用率
                            <el-progress 
                                v-if="monitorParam.memory_usage"
                                status="exception"
                                :stroke-width="12"
                                :percentage="parseFloat(monitorParam.memory_usage) >100 ? 100 : parseFloat(monitorParam.memory_usage)"
                            >{{monitorParam.memory_usage}}%</el-progress>
                        </div>
                        <div style="display: flex;">
                            磁盘使用率
                            <el-progress 
                                v-if="monitorParam.disk_usage"
                                status="exception"
                                :stroke-width="12"
                                :percentage="parseFloat(monitorParam.disk_usage) >100 ? 100 : parseFloat(monitorParam.disk_usage)"
                            >{{monitorParam.disk_usage}}%</el-progress>
                        </div>
                    </div>
                </dl>
                <dl class="dl-container-position">
                    <dt>近7日趋势</dt>
                    <div class="table-box paddingBox">
                        <div style="height: 400px;">
                            <div ref="cpuMonitor" style="height: 100%; width: 100%"></div>
                        </div>
                        <div style="height: 400px;">
                            <div ref="memoryMonitor" style="height: 100%; width: 100%"></div>
                        </div>
                        <div style="height: 400px;">
                            <div ref="diskMonitor" style="height: 100%; width: 100%"></div>
                        </div>
                    </div>
                </dl>
                <dl class="dl-container-position">
                    <dt>巡检日志</dt>
                    <div class="table-box paddingBox">
                        <table-unit
                            :columns="inspectColumns"
                            :list="inspectData"
                            :isIndex="true"
                            v-loading="inspectLoading"
                            :total="inspectParams.total"
                            :isSelection="false"
                            :currentPage="inspectParams.page"
                            :pageSize="inspectParams.limit"
                            @handleSizeChange="inspectSizeChange"
                            @handleCurrentChange="inspectCurrentChange">
                            <template v-slot="record">
                                <el-button size="small" type="primary" link @click="examine(record.record)">查看报告</el-button>
                            </template>
                        </table-unit>
                    </div>
                </dl>
            </div>
        </dp>
    </div>
</template>
<style scoped lang="scss">
    @import '@/theme/mixins/formReset.scss';
    .forms {
        .el-input,
        .el-select,
        .el-textarea {
            width: 220px;
        }
    }
    .tagColor {
        margin-right: 10px;
    }
    .progressBox{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        
        :deep(.el-progress){
            width: 230px;
            padding-left: 5px;
            .el-progress__text{
                font-size: 14px !important;
            }
            
        }
    }
    .paddingBox{
        padding:10px 50px 20px 50px;
    }
</style>