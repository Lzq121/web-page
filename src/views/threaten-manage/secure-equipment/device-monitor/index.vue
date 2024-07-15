<script setup lang="ts">
    import { ref, h, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { ElIcon, ElMessage, ElMessageBox, ElNotification } from 'element-plus';
    import type { UploadProps, UploadUserFile } from 'element-plus'
    import * as echarts from 'echarts';
    import apis from './api';
    const router = useRouter();
    const route: any = useRoute();

    let columns = [
        { dataIndex: 'id', title: 'ID', width: '150'},
        { dataIndex: 'ip', title: 'IP', width: '110' },
        { dataIndex: 'company', title: '设备名称', width: '110' },
        { dataIndex: 'is_storage', title: '数据中心', width: '110' },
        { dataIndex: 'network_area', title: '资产类型', width: '110' },
        { dataIndex: 'biz_state', title: '状态' },
        { dataIndex: 'cpu', title: 'CPU' },
        { dataIndex: 'biz_type', title: '内存' },
        { dataIndex: 'domain', title: '硬盘' },
        { dataIndex: 'external_lan_ip', title: '管理员'},
        { dataIndex: "biz_class", title: "机房", width: '130' },
        { dataIndex: 'biz_plate', title: '部署区域', width: '110'},
        { dataIndex: 'mail_of_main', title: '能否备份', width: '110'},
        { dataIndex: 'tp_of_main', title: '能否升级', width: '110'},
        { dataIndex: 'project_desc', title: '所属公司', width: '110'},
        { dataIndex: 'operate', title: '操作', fixed: 'right', width: 120 }
    ]

    let total = ref(0);
    let params = ref({
        ip: '',
        company: '',
        project_desc: '',
        handleObj: '',
        status: '',
        backup: '',
        upgrade: '',
        executor: '',
        type: 1,
        cpu: '',
        memory: '',
        disk: '',
        // 公有
        limit: 30,
        page: 1,
    });
    const tableData = ref([]);
    let isLoading = ref(false);
    let isShowMoreSearch = ref(false);
    let fenderWallList = ref([
        { label: '192.168.1.1', value: '192.168.1.1' },
        { label: '192.168.1.2', value: '192.168.1.2' },
    ])
    let companyList = ref([
        { label: '人保公司', value: '人保公司' },
        { label: '人保集团', value: '人保集团' },
    ]);
    let dataCenterList = ref([
        { label: '南信息中心', value: '南信息中心' }
    ])
    let statusList = ref([
        { label: '在线', value: '在线' },
        { label: '备机', value: '备机' },
    ])
    let backupList = ref([
        { label: '支持', value: '支持' },
        { label: '不支持', value: '不支持' },
    ])
    let executorList = ref([
        { label: '内网', value: '内网' }
    ])

    const changeType = () => {
        echartsAll();
    }

    // 获取列表
    const getList = async () => {
        // let res = await apis.getEventApi(params.value);
        // tableData.value = res.data;
        // total.value = res.total;
        tableData.value = [
        {
                id: 'SJ240101000001',
                ip: '10.1.1.1',
                company: '北中心内网区EDR',
                cpu: '30%',
                network_area: 'EDR',
                biz_state: '在线',
                is_storage: '北中心',
                biz_class: '北中心机房304',
                biz_type: '45%',
                biz_plate: '内网',
                mail_of_main: '支持',
                tp_of_main: '支持',
                domain: '21%',
                project_desc: '人保中心',
                external_lan_ip: '张三'
            },
            {
                id: 'SJ240101000001',
                ip: '10.1.1.1',
                company: '北中心内网区EDR',
                cpu: '78%',
                network_area: 'EDR',
                biz_state: '拟报废',
                is_storage: '北中心',
                biz_class: '北中心机房304',
                biz_type: '25%',
                biz_plate: '内网',
                mail_of_main: '不支持',
                tp_of_main: '支持',
                domain: '48%',
                project_desc: '人保中心',
                external_lan_ip: '张三'
            },
            {
                id: 'SJ240101000001',
                ip: '10.1.1.1',
                company: '北中心内网区EDR',
                cpu: '30%',
                network_area: 'EDR',
                biz_state: '备机',
                is_storage: '北中心',
                biz_class: '北中心机房304',
                biz_type: '75%',
                biz_plate: '内网',
                mail_of_main: '支持',
                tp_of_main: '不支持',
                domain: '59%',
                project_desc: '人保中心',
                external_lan_ip: '张三'
            }
        ]
        total.value = 3;
    }

    getList();
    
    onMounted(() => {
        echartsAll();
    })  

    let memoryDetection = ref();
    let memoryLoad = ref();
    let memoryData = ref([
        { "name": "60%以下", "value": 5.8 },
        { "name": "60%~70%", "value": 11.9 },
        { "name": "70%~80%", "value": 25.2 },
        { "name": "80%~90%", "value": 40.7 },
        { "name": "90%以上", "value": 16.4 },
    ])
    let dataX = ref(['10.1.101.67','10.1.101.45','10.1.101.162','10.1.101.75','10.1.101.24']);
	let dataY = ref([60,91,34,75,87]);
    let echartsAll = () => {
		// 内存负载检测
		var myChartLeft = echarts.init(memoryDetection.value);
        window.addEventListener('resize', () => {
            myChartLeft.resize();
        });
		let option1 = {
			title: {
				text: params.value.type == '1' ? 'CPU负载检测': (params.value.type == '2' ? '内存使用检测' : '磁盘使用检测'),
				textStyle: {
					fontSize: '12px',
				},
                top:'10'
			},
			tooltip: {
				trigger: 'item',
				formatter(params) {
					return params.name + '(' + Number(params.value) + '%)';
				}
			},
			legend: {
				type: 'scroll',
				bottom: '0',
                left: '3%',
                right: '3%'
			},
			series: [
				{
					name: '',
					type: 'pie',
					radius: ['40%', '60%'],
					avoidLabelOverlap: false,
					labelLine: {
						show: true,
					},
					data: memoryData.value,
				},
			],
		};
		option1 && myChartLeft.setOption(option1);

        // 内存负载TOP5
        var myChartRight = echarts.init(memoryLoad.value);
        window.addEventListener('resize', () => {
            myChartRight.resize();
        });
		let option = {
			title: {
				text: params.value.type == '1' ? 'CPU负载TOP5': (params.value.type == '2' ? '内存使用TOP5' : '磁盘使用TOP5'),
                textStyle: {
					fontSize: '12px',
				},
                top:'10'
			},
            grid: {
                left: '6%',
                right: '8%',
                bottom: '6%',
                containLabel: true
            },
			xAxis: {
				type: 'value',
                name: "%",
                axisLine: {
                    show: true
                },
			},
			yAxis: {
                type: 'category',
				data: dataX.value
			},
			series: [
                {
                    name: '内存负载TOP5',
                    type: 'bar',
                    barWidth: 30,
                    data: dataY.value,
                    label:{
                        show:true,
                        position:['45%', '30%'],
                        fontSize: '12px',
                        color: '#fff',
                        formatter: '{c}%'
                    }
                },
			],
		};
		option && myChartRight.setOption(option);
	};


    // 搜索
    const searchList = async () => {
        getList()
    }
    // 重置
    const searchReset = async () => {
        params.value = {
            ip: '',
            company: '',
            project_desc: '',
            handleObj: '',
            status: '',
            backup: '',
            upgrade: '',
            executor: '',
            type: 1,
            limit: 30,
            page: 1
        }
        getList()
    };
    // 详情
    const editRow = (row: any) => {
        router.push({
            path: '/threaten-manage/secure-equipment/device-monitor/monitor-detail',
            query: { ...row },
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
    <div  class="monitor-container">
        <div class="monitorBox">
            <div class="page-in">
                <el-radio-group v-model="params.type" @change="changeType">
                    <el-radio-button label="CPU负载" value="1" />
                    <el-radio-button label="内存使用率" value="2" />
                    <el-radio-button label="硬盘使用率" value="3" />
                </el-radio-group>
            </div>
            <div>更新时间：2024-01-01 08:00:00  监控每小时更新一次</div>
        </div>
        <el-row class="top_row">
			<el-col :span="11" style="height: 100%; width: 40%">
				<div ref="memoryDetection" style="height: 80%; width: 80%"></div>
			</el-col>
			<el-col :span="13" style="height: 100%; width: 60%">
				<div ref="memoryLoad" style="height: 100%; width: 100%"></div>
			</el-col>
		</el-row>
        <div>
            <div class="form-container">
                <div class="form-title">
                    <h3>设备监控</h3>
                    <div class="button-box">
                        <el-button type="primary" icon="Search" @click="searchList">搜索</el-button>
                        <el-button @click="searchReset" icon="RefreshRight">重置</el-button>
                    </div>
                </div>
                <div class="form-params" :style="isShowMoreSearch ? 'height:100%' : 'height:60px'">
                    <div class="more-filter-btn">
                        <el-button link type="primary" @click="isShowMoreSearch = !isShowMoreSearch"
                            :icon="isShowMoreSearch ? 'ArrowUpBold' : 'ArrowDownBold'">
                            {{ isShowMoreSearch ? '收起' : '展开' }}
                        </el-button>
                    </div>
                    <el-form :inline="true" :model="params" :disabled="isLoading" label-width="120px" class="form">
                        <span>
                            <el-form-item label="关键字">
                                <el-input @keydown.enter="searchList" v-model="params.ip" clearable placeholder="请输入IP等关键字" />
                              </el-form-item>
                            <el-form-item label="所属公司">
                                <el-select v-model="params.company">
                                    <el-option :label="item.label" :value="item.value" v-for="item in companyList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数据中心">
                                <el-select v-model="params.project_desc">
                                    <el-option :label="item.label" :value="item.value" v-for="item in dataCenterList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="状态">
                                <el-select v-model="params.status">
                                    <el-option :label="item.label" :value="item.value" v-for="item in statusList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="能否备份">
                                <el-select v-model="params.backup">
                                    <el-option :label="item.label" :value="item.value" v-for="item in backupList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="能否升级">
                                <el-select v-model="params.upgrade">
                                    <el-option :label="item.label" :value="item.value" v-for="item in backupList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="部署区域">
                                <el-select v-model="params.executor">
                                    <el-option :label="item.label" :value="item.value" v-for="item in executorList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="CPU">
                                <el-select v-model="params.cpu">
                                    
                                </el-select>
                            </el-form-item>
                            <el-form-item label="内存">
                                <el-select v-model="params.memory">
                                    
                                </el-select>
                            </el-form-item>
                            <el-form-item label="硬盘">
                                <el-select v-model="params.disk">
                                    
                                </el-select>
                            </el-form-item>
                        </span>
                    </el-form>
                </div>
            </div>
            <div class="table-box">
                <table-unit
                    :columns="columns"
                    :list="tableData" 
                    v-loading="isLoading"
                    :total="total"
                    :isSelection="false"
                    :currentPage="params.page"
                    :pageSize="params.limit"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange">
                    <template v-slot="record">
                        <el-button size="small" type="primary" link @click="editRow(record.record)">详情</el-button>
                    </template>
                </table-unit>
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
    .monitor-container {
        .monitorBox {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 10px;
            font-size: 12px;
            color: #908080;
        }
        :deep(.page-in .el-radio-button__inner) {
            border-radius: 20px;
            margin-right: 10px;
        }
        .top_row {
            height: 60vh;
            background: #ffffff;
            padding: 10px;
            margin: 10px;
        }
        .form {

            .el-input,
            .el-select {
                width: 200px;
            }
        }
    }
</style>