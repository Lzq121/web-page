<script setup lang="ts">
    import { ref, h } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { ElIcon, ElMessage, ElMessageBox} from 'element-plus';
    import importExcel from '@/components/importExcel/index.vue';
    import { downloadFile } from '@/utils/service';
    import apis from './api';
    const router = useRouter();
    const route: any = useRoute();

    let columns = [
        { dataIndex: 'id', title: 'ID', width: '150' },
        { dataIndex: 'ip', title: 'IP', width: '110' },
        { dataIndex: 'company', title: '设备名称', width: '110' },
        { dataIndex: 'supplier', title: '设备大类', width: '110' },
        { dataIndex: 'network_area', title: '资产类型', width: '110' },
        { dataIndex: 'biz_state', title: '状态' },
        { dataIndex: 'is_storage', title: '数据中心', width: '110' },
        { dataIndex: "biz_class", title: "机房", width: '110' },
        { dataIndex: 'biz_type', title: '标签', isTag: true, },
        { dataIndex: 'biz_plate', title: '部署区域', width: '110'},
        { dataIndex: 'mail_of_main', title: '能否备份', width: '110' },
        { dataIndex: 'tp_of_main', title: '能否升级', width: '110'},
        { dataIndex: 'domain', title: '合同来源', width: '110' },
        { dataIndex: 'project_desc', title: '所属公司', width: '110'},
        { dataIndex: 'external_lan_ip', title: '所属处室', width: '110'},
        { dataIndex: 'operate', title: '操作', fixed: 'right', width: 120 }
    ]

    let total = ref(0);
    let params = ref({
        ip: '',
        company: '',
        project_desc: '',
        is_storage: '',
        backup: '',
        upgrades: '',
        exec: '',
        // 公有
        limit: 30,
        page: 1,
    });
    const tableData = ref([]);
    let isLoading = ref(false);
    let isShowMoreSearch = ref(false);
    let companyList = ref([
        { label: '人保科技', value: '人保科技' },
        { label: '人保集团', value: '人保集团' },
    ]);
    let dataCenterList = ref([
        { label: '南信息中心', value: '南信息中心' },
        { label: '北信息中心', value: '北信息中心' }
    ])
    let statusList = ref([
        { label: '在线', value: '在线' },
        { label: '备机', value: '备机' },
        { label: '拟报废', value: '拟报废' }
    ])
    let BackupList = ref([
        { label: '支持', value: '支持' },
        { label: '不支持', value: '不支持' }
    ])
    let executorList = ref([
        { label: '内网', value: '内网' }
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
                company: '北中心内网区EDR',
                supplier: '安全设备',
                network_area: 'EDR',
                biz_state: '在线',
                is_storage: '北信息中心',
                biz_class: '北中心机房304',
                biz_type: '维保即将到期',
                biz_plate: '内网',
                mail_of_main: '支持',
                tp_of_main: '支持',
                domain: '北中心扩容采购合同',
                project_desc: '人保科技',
                external_lan_ip: '安全部'
            },
            {
                id: 'SJ240101000001',
                ip: '10.1.1.1',
                company: '北中心内网区EDR',
                supplier: '安全设备',
                network_area: 'EDR',
                biz_state: '拟报废',
                is_storage: '北信息中心',
                biz_class: '北中心机房304',
                biz_type: '维保即将到期',
                biz_plate: '内网',
                mail_of_main: '不支持',
                tp_of_main: '支持',
                domain: '北中心扩容采购合同',
                project_desc: '人保集团',
                external_lan_ip: '安全部'
            },
            {
                id: 'SJ240101000001',
                ip: '10.1.1.1',
                company: '北中心内网区EDR',
                supplier: '安全设备',
                network_area: 'EDR',
                biz_state: '备机',
                is_storage: '北信息中心',
                biz_class: '北中心机房304',
                biz_type: '维保即将到期',
                biz_plate: '内网',
                mail_of_main: '支持',
                tp_of_main: '不支持',
                domain: '北中心扩容采购合同',
                project_desc: '人保科技',
                external_lan_ip: '安全部'
            }
        ]
        total.value = 3;
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
				// 	url: '',
				// 	params: params.value,
				// 	method: 'get',
				// 	filename: value
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
            company: '',
            project_desc: '',
            is_storage: '',
            backup: '',
            upgrades: '',
            exec: '',
            limit: 30,
            page: 1
        }
        getList()
    };
    // 详情
    const editRow = (row: any) => {
        router.push({
            path: '/threaten-manage/secure-equipment/device-list/device-detail',
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
        <div class="device-container">
            <div class="form-container">
                <div class="form-title">
                    <div class="boxs">
                        <h3>设备列表</h3>
                        <span>更新时间：2024-01-01 08:00:00  监控每小时更新一次</span>
                    </div>
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
                                <el-select v-model="params.is_storage">
                                    <el-option :label="item.label" :value="item.value" v-for="item in statusList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="能否备份">
                                <el-select v-model="params.backup">
                                    <el-option :label="item.label" :value="item.value" v-for="item in BackupList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="能否升级">
                                <el-select v-model="params.upgrades">
                                    <el-option :label="item.label" :value="item.value" v-for="item in BackupList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="部署区域">
                                <el-select v-model="params.exec">
                                    <el-option :label="item.label" :value="item.value" v-for="item in executorList"
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
    .device-container {
        .boxs{
            display: flex;
            align-items: center;
            span{
                margin-left: 50px;
                font-size: 12px;
            }
        }
        .form {
            .el-input,
            .el-select {
                width: 200px;
            }
        }
    }
</style>