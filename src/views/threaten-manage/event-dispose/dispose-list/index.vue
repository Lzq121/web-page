<script setup lang="ts">
    import { ref, h } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { ElIcon, ElMessage, ElMessageBox} from 'element-plus';
    import { downloadFile } from '@/utils/service';
    import importExcel from '@/components/importExcel/index.vue';
    import apis from './api';
    const router = useRouter();
    const route: any = useRoute();

    let columns = [
        { dataIndex: 'id', title: 'ID',width:'180px' },
        { dataIndex: 'ip', title: '受影响主机IP',width:'130px' },
        { dataIndex: 'company', title: '所属系统',width:'110px' },
        { dataIndex: 'company1', title: '设备名称',width:'130px' },
        { dataIndex: 'supplier', title: '攻击源IP',width:'110px' },
        { dataIndex: 'network_area', title: '攻击源地域',width:'110px' },
        { dataIndex: 'biz_state', title: '事件类型',width:'110px' },
        { dataIndex: 'biz_state1', title: '处置优先级',width:'110px' },
        { dataIndex: "status", title: "状态",width:'110px'},
        { dataIndex: 'biz_class', title: '标签', isTag: true, },
        { dataIndex: 'biz_type', title: '事件描述',width:'110px'},
        { dataIndex: 'biz_plate', title: '发生次数',width:'110px'},
        { dataIndex: 'mail_of_main', title: '风险等级',width:'110px' },
        { dataIndex: 'tp_of_main', title: '风险描述',width:'110px' },
        { dataIndex: 'domain', title: '事件发生时间',width:'180px'},
        { dataIndex: 'biz_level', title: '所属公司',width:'110px'},
        { dataIndex: 'biz_level1', title: '所属处室',width:'110px'},
        { dataIndex: 'project_desc', title: '数据中心',width:'110px' },
        { dataIndex: 'external_lan_ip', title: '部署区域',width:'110px'},
        { dataIndex: 'load_ip', title: '录入时间',width:'180px'},
        { dataIndex: 'public_ip', title: '数据来源',width:'110px' },
        { dataIndex: 'operate', title: '操作', fixed: 'right', width: 120 }
    ]

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
    let dataCenterList = ref([
        { label: '南信息中心', value: '南信息中心' }
    ])
    let eventTypeList = ref([
        { label: '恶意请求', value: '恶意请求' },
        { label: '病毒感染', value: '病毒感染' }
    ])
    let statusList = ref([
        { label: '待处置', value: '待处置' },
        { label: '已通知', value: '已通知' },
        { label: '已审核', value: '已审核' },
        { label: '已认领', value: '已认领' },
        { label: '处置中', value: '处置中' },
        { label: '待验证', value: '待验证' },
        { label: '已办结', value: '已办结' },
        { label: '处置退回', value: '处置退回' },
    ])

    // 获取列表
    const getList = async () => {
        // let res = await apis.getEventApi(params.value);
        // tableData.value = res.data;
        // total.value = res.total;
        tableData.value = [
            {
                id: 'SJ240101000001',
                ip: '10.1.1.1',
                biz_level: '人保科技',
                biz_level1: '安全部',
                company: '安全运营平台',
                company1: '运营平台业务主机01',
                supplier: '10.1.101.1',
                network_area: '广东广州',
                biz_state: '恶意请求',
                biz_state1: '紧急',
                status: '待处置',
                biz_class: '新发现',
                biz_type: '发现主机外联Burp Colaborator',
                biz_plate: '15',
                mail_of_main: '未定级',
                tp_of_main: '发现主机外联Burp Colaborator',
                domain: '2024-01-01 08:00:00',
                project_desc: '南信息中心',
                external_lan_ip: 'DMZ',
                load_ip: '2024-01-01 08:00:00',
                public_ip: '态势感知'
            },
            {
                id: 'SJ140101000001',
                ip: '10.1.1.2',
                biz_level: '人保科技',
                biz_level1: '安全部',
                company: '安全运营平台',
                company1: '运营平台业务主机01',
                supplier: '10.1.101.1',
                network_area: '广东广州',
                biz_state: '恶意请求',
                biz_state1: '一般',
                status: '已通知',
                biz_class: '新发现',
                biz_type: '发现主机外联Burp Colaborator',
                biz_plate: '15',
                mail_of_main: '未定级',
                tp_of_main: '发现主机外联Burp Colaborator',
                domain: '2024-01-01 08:00:00',
                project_desc: '南信息中心',
                external_lan_ip: 'DMZ',
                load_ip: '2024-01-01 08:00:00',
                public_ip: '态势感知'
            },
            {
                id: 'S3240101000001',
                ip: '10.1.1.3',
                biz_level: '人保科技',
                biz_level1: '安全部',
                company: '安全运营平台',
                company1: '运营平台业务主机01',
                supplier: '10.1.101.1',
                network_area: '广东广州',
                biz_state: '恶意请求',
                biz_state1: '紧急',
                status: '已审核',
                biz_class: '新发现',
                biz_type: '发现主机外联Burp Colaborator',
                biz_plate: '15',
                mail_of_main: '未定级',
                tp_of_main: '发现主机外联Burp Colaborator',
                domain: '2024-01-01 08:00:00',
                project_desc: '南信息中心',
                external_lan_ip: 'DMZ',
                load_ip: '2024-01-01 08:00:00',
                public_ip: '态势感知'
            },
            {
                id: 'S3240101000001',
                ip: '10.1.1.4',
                biz_level: '人保科技',
                biz_level1: '安全部',
                company: '安全运营平台',
                company1: '运营平台业务主机01',
                supplier: '10.1.101.1',
                network_area: '广东广州',
                biz_state: '恶意请求',
                biz_state1: '紧急',
                status: '已认领',
                biz_class: '新发现',
                biz_type: '发现主机外联Burp Colaborator',
                biz_plate: '15',
                mail_of_main: '未定级',
                tp_of_main: '发现主机外联Burp Colaborator',
                domain: '2024-01-01 08:00:00',
                project_desc: '南信息中心',
                external_lan_ip: 'DMZ',
                load_ip: '2024-01-01 08:00:00',
                public_ip: '态势感知'
            },
            {
                id: 'S3240101000001',
                ip: '10.1.1.5',
                biz_level: '人保科技',
                biz_level1: '安全部',
                company: '安全运营平台',
                company1: '运营平台业务主机01',
                supplier: '10.1.101.1',
                network_area: '广东广州',
                biz_state: '恶意请求',
                biz_state1: '紧急',
                status: '处置中',
                biz_class: '新发现',
                biz_type: '发现主机外联Burp Colaborator',
                biz_plate: '15',
                mail_of_main: '未定级',
                tp_of_main: '发现主机外联Burp Colaborator',
                domain: '2024-01-01 08:00:00',
                project_desc: '南信息中心',
                external_lan_ip: 'DMZ',
                load_ip: '2024-01-01 08:00:00',
                public_ip: '态势感知'
            },
            {
                id: 'S3240101000001',
                ip: '10.1.1.6',
                biz_level: '人保科技',
                biz_level1: '安全部',
                company: '安全运营平台',
                company1: '运营平台业务主机01',
                supplier: '10.1.101.1',
                network_area: '广东广州',
                biz_state: '恶意请求',
                biz_state1: '紧急',
                status: '待验证',
                biz_class: '新发现',
                biz_type: '发现主机外联Burp Colaborator',
                biz_plate: '15',
                mail_of_main: '未定级',
                tp_of_main: '发现主机外联Burp Colaborator',
                domain: '2024-01-01 08:00:00',
                project_desc: '南信息中心',
                external_lan_ip: 'DMZ',
                load_ip: '2024-01-01 08:00:00',
                public_ip: '态势感知'
            },
            {
                id: 'S3240101000001',
                ip: '10.1.1.7',
                biz_level: '人保科技',
                biz_level1: '安全部',
                company: '安全运营平台',
                company1: '运营平台业务主机01',
                supplier: '10.1.101.1',
                network_area: '广东广州',
                biz_state: '恶意请求',
                biz_state1: '紧急',
                status: '已办结',
                biz_class: '新发现',
                biz_type: '发现主机外联Burp Colaborator',
                biz_plate: '15',
                mail_of_main: '未定级',
                tp_of_main: '发现主机外联Burp Colaborator',
                domain: '2024-01-01 08:00:00',
                project_desc: '南信息中心',
                external_lan_ip: 'DMZ',
                load_ip: '2024-01-01 08:00:00',
                public_ip: '态势感知'
            },
            {
                id: 'S3240101000001',
                ip: '10.1.1.8',
                biz_level: '人保科技',
                biz_level1: '安全部',
                company: '安全运营平台',
                company1: '运营平台业务主机01',
                supplier: '10.1.101.1',
                network_area: '广东广州',
                biz_state: '恶意请求',
                biz_state1: '紧急',
                status: '处置退回',
                biz_class: '新发现',
                biz_type: '发现主机外联Burp Colaborator',
                biz_plate: '15',
                mail_of_main: '未定级',
                tp_of_main: '发现主机外联Burp Colaborator',
                domain: '2024-01-01 08:00:00',
                project_desc: '南信息中心',
                external_lan_ip: 'DMZ',
                load_ip: '2024-01-01 08:00:00',
                public_ip: '态势感知'
            },
            
        ]
        total.value = 8;
    }

    getList();

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
            path: '/threaten-manage/event-dispose/dispose-list/dispose-order',
            query: { arr: JSON.stringify(selectArr.value)},
        });
    }
    // 搜索
    const searchList = async () => {
        getList()
    }
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
            page: 1
        }
        getList()
    };
    // 详情
    const editRow = (row: any) => {
        router.push({
            path: '/threaten-manage/event-dispose/dispose-list/dispose-detail',
            query: { detailID: row.id, ...row },
        });
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
                    <h3>处置列表</h3>
                    <div class="button-box">
                        <el-button type="primary" @click="excelDown" link icon="Download">导出数据</el-button>
                        <el-button icon="Grid" style="margin:0px 10px " type="primary" link
                            @click="bulkOrder">批量派单</el-button>
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
                                <el-input @keydown.enter="searchList" v-model="params.id" clearable />
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
                            <el-form-item label="事件类型">
                                <el-select v-model="params.biz_state">
                                    <el-option :label="item.label" :value="item.value" v-for="item in eventTypeList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="状态">
                                <el-select v-model="params.status">
                                    <el-option :label="item.label" :value="item.value" v-for="item in statusList"
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
                    :isSelection="true"
                    :currentPage="params.page"
                    :pageSize="params.limit"
                    @handleSelectionChange="handleSelectionChange"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                >
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