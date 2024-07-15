<script setup lang="ts">
    import { ref, h } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { ElIcon, ElMessage, ElMessageBox, ElNotification } from 'element-plus';
    import type { UploadProps, UploadUserFile } from 'element-plus'
    import importExcel from '@/components/importExcel/index.vue';
    import { downloadFile } from '@/utils/service';
    import apis from './api';
    const router = useRouter();
    const route: any = useRoute();

    let columns = [
        { dataIndex: 'id', title: 'ID',width:'150px' },
        { dataIndex: 'ip', title: '封禁IP',width:'130px' },
        { dataIndex: 'biz_level', title: '所属系统',width:'130px' },
        { dataIndex: 'company', title: '所属公司',width:'130px' },
        { dataIndex: 'supplier', title: '处置对象' ,width:'130px' },
        { dataIndex: 'network_area', title: '初审'},
        { dataIndex: 'biz_state', title: '复审'},
        { dataIndex: "is_storage", title: "处置状态",width:'130px' },
        { dataIndex: 'biz_class', title: '防护墙IP',width:'130px' },
        { dataIndex: 'biz_type', title: '防火墙设备',width:'150px' },
        { dataIndex: 'biz_plate', title: '设备品牌',width:'130px'},
        { dataIndex: 'mail_of_main', title: '设备型号',width:'130px' },
        { dataIndex: 'tp_of_main', title: '所属数据中心',width:'130px' },
        { dataIndex: 'domain', title: '更新时间',width:'180px' },
        { dataIndex: 'operate', title: '操作', fixed: 'right', width: 120 }
    ]

    let total = ref(0);
    let params = ref({
        ip: '',
        fender_wall_ip: '',
        project_desc: '',
        handleObj: '',
        bannedStatus: '',
        status: '',
        first_trial_status: '',
        recheck_status: '',
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
    let eventTypeList = ref([
        { label: '封禁源IP', value: '封禁源IP' },
        { label: '封禁目标IP', value: '封禁目标IP' }
    ])
    let bannedStatusList = ref([
        { label: '已封禁', value: '已封禁' },
        { label: '已解禁', value: '已解禁' },
    ])
    let statusList = ref([
        { label: '已通知', value: '已通知' },
        { label: '已认领', value: '已认领' },
        { label: '已办结', value: '已办结' },
    ])
    let firstTrialList = ref([
        { label: '待审核', value: '待审核' },
        { label: '已通过', value: '已通过' },
        { label: '未通过', value: '未通过' },
    ])
    let recheckList = ref([
        { label: '待审核', value: '待审核' },
        { label: '已通过', value: '已通过' },
        { label: '未通过', value: '未通过' },
    ])

    // 获取列表
    const getList = async () => {
        // let res = await apis.getEventApi(params.value);
        // tableData.value = res.data;
        // total.value = res.total;
        tableData.value = [
            {
                id: 'SJ240101000001',
                ip: '10.1.101.1',
                biz_level: '安全运营平台',
                company: '人保科技',
                supplier: '封禁源IP',
                network_area: '待审核',
                biz_state: '待审核',
                is_storage: '已通知',
                biz_class: '192.168.1.2',
                biz_type: '中心互联网防火墙',
                biz_plate: '新华三',
                mail_of_main: 'F1050',
                tp_of_main: '南数据中心',
                domain: '2024-01-01 08:00:00'
            },
            {
                id: 'SJ240101000001',
                ip: '10.1.101.1',
                biz_level: '安全运营平台',
                company: '人保科技',
                supplier: '封禁源IP',
                network_area: '未通过',
                biz_state: '-',
                is_storage: '已通知',
                biz_class: '192.168.1.1',
                biz_type: '中心互联网防火墙',
                biz_plate: '新华三',
                mail_of_main: 'F1050',
                tp_of_main: '南数据中心',
                domain: '2024-01-01 08:00:00'
            },
            {
                id: 'SJ240101000001',
                ip: '10.1.101.1',
                biz_level: '安全运营平台',
                company: '人保科技',
                supplier: '封禁源IP',
                network_area: '已通过',
                biz_state: '待审核',
                is_storage: '已通知',
                biz_class: '192.168.1.1',
                biz_type: '中心互联网防火墙',
                biz_plate: '新华三',
                mail_of_main: 'F1050',
                tp_of_main: '南数据中心',
                domain: '2024-01-01 08:00:00'
            },
            {
                id: 'SJ240101000001',
                ip: '10.1.101.1',
                biz_level: '安全运营平台',
                company: '人保科技',
                supplier: '封禁源IP',
                network_area: '已通过',
                biz_state: '未通过',
                is_storage: '已办结',
                biz_class: '192.168.1.1',
                biz_type: '中心互联网防火墙',
                biz_plate: '新华三',
                mail_of_main: 'F1050',
                tp_of_main: '南数据中心',
                domain: '2024-01-01 08:00:00'
            },
            {
                id: 'SJ240101000001',
                ip: '10.1.101.1',
                biz_level: '安全运营平台',
                company: '人保科技',
                supplier: '封禁源IP',
                network_area: '已通过',
                biz_state: '已通过',
                is_storage: '已办结',
                biz_class: '192.168.1.1',
                biz_type: '中心互联网防火墙',
                biz_plate: '新华三',
                mail_of_main: 'F1050',
                tp_of_main: '南数据中心',
                domain: '2024-01-01 08:00:00'
            }
        ]
        total.value = 5;
    }

    getList();

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
                // downloadFile({
                //     url: '',
                //     params: params.value,
                //     method: 'get',
                //     filename: value
                // });
            })
            .catch(() => { });
    };

    // 搜索
    const searchList = async () => {
        getList()
    }
    // 重置
    const searchReset = async () => {
        params.value = {
            ip: '',
            fender_wall_ip: '',
            project_desc: '',
            handleObj: '',
            bannedStatus: '',
            status: '',
            first_trial_status: '',
            recheck_status: '',
            limit: 30,
            page: 1
        }
        getList()
    };
    // 详情
    const editRow = (row: any) => {
        router.push({
            path: '/threaten-manage/event-dispose/banned-list/banned-detail',
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
    <div>
        <div class="menace-container">
            <div class="form-container">
                <div class="form-title">
                    <h3>封禁列表</h3>
                    <div class="button-box">
                        <el-button type="primary" @click="excelDown" link icon="Download">导出数据</el-button>
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
                            <el-form-item label="封禁IP">
                                <el-input @keydown.enter="searchList" v-model="params.ip" clearable placeholder="请输入IP等关键字" />
                              </el-form-item>
                            <el-form-item label="防护墙IP">
                                <el-select v-model="params.fender_wall_ip">
                                    <el-option :label="item.label" :value="item.value" v-for="item in fenderWallList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="数据中心">
                                <el-select v-model="params.project_desc">
                                    <el-option :label="item.label" :value="item.value" v-for="item in dataCenterList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="处置对象">
                                <el-select v-model="params.handleObj">
                                    <el-option :label="item.label" :value="item.value" v-for="item in eventTypeList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="封禁状态">
                                <el-select v-model="params.bannedStatus">
                                    <el-option :label="item.label" :value="item.value" v-for="item in bannedStatusList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="处置状态">
                                <el-select v-model="params.status">
                                    <el-option :label="item.label" :value="item.value" v-for="item in statusList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="初审状态">
                                <el-select v-model="params.first_trial_status">
                                    <el-option :label="item.label" :value="item.value" v-for="item in firstTrialList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="复审状态">
                                <el-select v-model="params.recheck_status">
                                    <el-option :label="item.label" :value="item.value" v-for="item in recheckList"
                                        :key="item.value" />
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