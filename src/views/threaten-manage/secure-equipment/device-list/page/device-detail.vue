<script setup lang='ts'>
    import { ElMessage, ElMessageBox } from 'element-plus';
    import type { UploadProps, UploadUserFile, FormRules, FormInstance  } from 'element-plus'
    import { ref, reactive } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import * as api from '../api';

    //路由
    const route = useRoute();
    //从路由获取信息
    const secureInfo = ref({
        id: 'EQ061240101000001',
        biz_level: '北中心内网区EDR',
        scan_status: '在线',
        scan_firm: '10.1.101.1',
        scan_version: '10.1.101.1',
        scan_ip: '安全设备',
        room: 'EDR',
        network_area: '人保集团',
        scan1: '安全部',
        database: '1.0',
        startTime: '2024-01-01',
        endTime: '2024-01-02',

        dataCenter: '北信息中心',
        computer_room: '北中心1层01-0001机房',
        cabinet: '04-001',
        startU: '04-001-12',
        endU: '04-001-16',
        number: '4',
        area: '内网',
    })
    // const secureInfo = route.query

    const router = useRouter();
    const backIndex = () => {
        router.push({ path: '/threaten-manage/secure-equipment/device-list', query: {} });
    };

    let disabledShow = ref(true);
    let companyList = ref([
        { label: '人保科技', value: '人保科技' },
        { label: '人保集团', value: '人保集团' },
    ]);
    let dataCenterList = ref([
        { label: '南信息中心', value: '南信息中心' },
        { label: '北信息中心', value: '北信息中心' }
    ]);
    let statusList = ref([
        { label: '在线', value: '在线' },
        { label: '备机', value: '备机' },
        { label: '拟报废', value: '拟报废' }
    ])
    let executorList = ref([
        { label: '内网', value: '内网' }
    ])
    let tagList = ref([
        { name: '维保即将到期', color: '#409EFF' },
        { name: '支持升级', color: 'red' },
        { name: '支持备份', color: 'red' }
    ])
    let contract_name = ref('2024年北中心扩容采购合同');     // 合同名称
    let userList = ref([
        { role: '主机管理员', name: '张三', phone: '-', email: 'zhangsan@picc.com', section: '南数据中心运维一组'}
    ])
    let maintenanceList = ref([
        { role: '原厂', name: '张三', phone: '-', email: 'zhangsan@picc.com', section: '浪潮'},
        { role: '代理商', name: '张三', phone: '-', email: 'zhangsan@picc.com', section: '联通'},
    ])

    const getDetail = () => {
        
    }
    getDetail()


    // 编辑
    let editShow = ref(false);
    let oldSecureInfo = ref([]);
    const edit = () => {
        editShow.value = true;
        disabledShow.value = false;
        oldSecureInfo.value = JSON.parse(JSON.stringify(secureInfo.value));
    }
    // 确定
    const sure = () => {
        const reg = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?$/;
        if(secureInfo.value.id == ''){
            return ElMessage.warning('请输入ID');
        }else if(secureInfo.value.scan_status == ''){
            return ElMessage.warning('请选择状态');
        }else if(secureInfo.value.scan_firm == '' || !reg.test(secureInfo.value.scan_firm)){
            return ElMessage.warning('请正确输入IP地址');
        }else if(!reg.test(secureInfo.value.scan_version)){
            return ElMessage.warning('请正确输入IPMI地址');
        }else if(secureInfo.value.scan_ip == ''){
            return ElMessage.warning('请输入设备大类');
        }else if(secureInfo.value.room == ''){
            return ElMessage.warning('请输入资产类型');
        }else if(secureInfo.value.network_area == ''){
            return ElMessage.warning('请选择所属公司');
        }else if(secureInfo.value.scan1 == ''){
            return ElMessage.warning('请输入所属处室');
        }else if(secureInfo.value.endTime == '' || secureInfo.value.endTime == null){
            return ElMessage.warning('请选择维保终止时间');
        }else if(Date.parse(secureInfo.value.startTime) >= Date.parse(secureInfo.value.endTime)){
            return ElMessage.warning('维保终止时间必须大于维保开始时间');
        }else if(secureInfo.value.dataCenter == ''){
            return ElMessage.warning('请选择数据中心');
        }else if(secureInfo.value.computer_room == ''){
            return ElMessage.warning('请输入机房');
        }else if(secureInfo.value.cabinet == ''){
            return ElMessage.warning('请输入机柜');
        }else if(secureInfo.value.startU == ''){
            return ElMessage.warning('请输入起始U位');
        }else if(secureInfo.value.endU == ''){
            return ElMessage.warning('请输入终止U位');
        }else if(secureInfo.value.number == ''){
            return ElMessage.warning('请输入U位数');
        }else if(secureInfo.value.area == ''){
            return ElMessage.warning('请选择部署区域');
        }else if(contract_name.value == ''){
            return ElMessage.warning('请输入合同名称');
        }
        editShow.value = false;
        disabledShow.value = true;
    }
    // 取消
    const cancel = () => {
        editShow.value = false;
        disabledShow.value = true;
        secureInfo.value = oldSecureInfo.value;
    }

    // 备份信息
    let backupLoading = ref(false);
    let backupParams = ref({
        page: 1,
        limit: 30,
        total: 6
    })
    let backupColumns = [
        { dataIndex: 'id', title: '任务ID' },
        { dataIndex: 'title', title: '标题' },
        { dataIndex: 'time', title: '完成时间' },
        { dataIndex: 'executor', title: '执行人' },
        { dataIndex: 'section', title: '所属部门' },
        { dataIndex: 'operate', title: '操作', fixed: 'right', width: 120}
    ]
    let backupData = ref([
        { id: 'BF20240101000001', title: '7月-南中心安全设备备份任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' },
        { id: 'BF20240101000001', title: '6月-南中心安全设备备份任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' },
        { id: 'BF20240101000001', title: '7月-南中心安全设备备份任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' },
        { id: 'BF20240101000001', title: '6月-南中心安全设备备份任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' },
        { id: 'BF20240101000001', title: '7月-南中心安全设备备份任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' },
        { id: 'BF20240101000001', title: '6月-南中心安全设备备份任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' }
    ])
    const detailRow = (row: any) => {
        console.log(row);
    }
    const backupSizeChange = (val: any) => {
        backupParams.value.limit = val;
        backupParams.value.page = 1;
    };
    const backupCurrentChange = (val: any) => {
        backupParams.value.page = val;
    };


    // 升级信息
    let upgradeLoading = ref(false);
    let upgradeParams = ref({
        page: 1,
        limit: 30,
        total: 6
    })
    let upgradeColumns = [
        { dataIndex: 'id', title: '任务ID' },
        { dataIndex: 'title', title: '标题' },
        { dataIndex: 'time', title: '完成时间' },
        { dataIndex: 'executor', title: '执行人' },
        { dataIndex: 'section', title: '所属部门' },
        { dataIndex: 'operate', title: '操作', fixed: 'right', width: 120}
    ]
    let upgradeData = ref([
        { id: 'BF20240101000001', title: '7月-南中心安全设备升级任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' },
        { id: 'BF20240101000001', title: '6月-南中心安全设备升级任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' },
        { id: 'BF20240101000001', title: '7月-南中心安全设备升级任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' },
        { id: 'BF20240101000001', title: '6月-南中心安全设备升级任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' },
        { id: 'BF20240101000001', title: '7月-南中心安全设备升级任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' },
        { id: 'BF20240101000001', title: '6月-南中心安全设备升级任务', time: '2024-01-01 08:00:00', executor: '张三', section: '安全运营部' }
    ])
    const getRow = (row: any) => {
        console.log(row);
    }
    const upgradeSizeChange = (val: any) => {
        upgradeParams.value.limit = val;
        upgradeParams.value.page = 1;
    };
    const upgradeCurrentChange = (val: any) => {
        upgradeParams.value.page = val;
    };


    // 维保记录
    let recordLoading = ref(false);
    let addRecordVisible = ref(false);
    let modeList = ref([
        { label: '现场', value: '现场' }
    ])
    let maintainerList = ref([
        { label: '张三', value: '张三' }
    ])
    let recordParams = ref({
        page: 1,
        limit: 30,
        total: 6
    })
    let recordColumns = [
        { dataIndex: 'time', title: '维保时间' },
        { dataIndex: 'method', title: '实施方式' },
        { dataIndex: 'section', title: '厂商' },
        { dataIndex: 'executor', title: '维保人' },
        { dataIndex: 'desc', title: '维保说明' },
        { dataIndex: 'operate', title: '附件', fixed: 'right', width: 120}
    ]
    let recordData = ref([
        { time: '2024-01-01', method: '现场', section: '浪潮', executor: '张三', desc: '设备正常维护升级'},
        { time: '2024-01-01', method: '现场', section: '浪潮', executor: '张三', desc: '设备正常维护升级'},
        { time: '2024-01-01', method: '现场', section: '浪潮', executor: '张三', desc: '设备正常维护升级'},
        { time: '2024-01-01', method: '现场', section: '浪潮', executor: '张三', desc: '设备正常维护升级'},
        { time: '2024-01-01', method: '现场', section: '浪潮', executor: '张三', desc: '设备正常维护升级'},
        { time: '2024-01-01', method: '现场', section: '浪潮', executor: '张三', desc: '设备正常维护升级'},
    ])
    const recordSizeChange = (val: any) => {
        recordParams.value.limit = val;
        recordParams.value.page = 1;
    };
    const recordCurrentChange = (val: any) => {
        recordParams.value.page = val;
    };
    // 新增维保记录
    interface RuleForm {
        mode: string,
        vendor: string,
        maintainer: string,
        time: string,
        email: string,
        phone: string | number,
        explain: string
    }
    const ruleFormRef = ref<FormInstance>()
    let ruleForm = ref<RuleForm>({
        mode: '',
        vendor: '',
        maintainer: '',
        time: '',
        email: '',
        phone: '',
        explain: ''
    })
    const rules = ref<FormRules<RuleForm>>({
        mode: [{required: true, message: '请选择实施方式', trigger: 'change'}],
        vendor: [{ required: true, message: '请填写维保厂商', trigger: 'blur' }],
        maintainer: [{ required: true, message: '请选择维保人', trigger: 'change'}],
        time: [{type: 'date',required: true,message: '请选择维保时间',trigger: 'change'}],
        email: [{ required: true, message: '请填写维保人邮箱', trigger: 'blur' }],
        phone: [{ required: true, message: '请填写维保人电话', trigger: 'blur' }],
        explain: [
            { required: true, message: '请填写维保说明', trigger: 'blur' },
            { min: 1, max: 500, message: '长度在1 ~ 500个字符', trigger: 'blur' }
        ]
    })

    const addRecord = () => {
        addRecordVisible.value = true;
    }
    const recordSure = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                addRecordVisible.value = false;
            } else {
                
            }
        })
    }
    const clean = () => {
        ruleFormRef.value.resetFields();
    }
    const DownLoadRow = (row: any) => {
        
    }
   

    // 策略信息
    let tacticsLoading = ref(false);
    let addTacticsVisible = ref(false);
    let tacticsParams = ref({
        page: 1,
        limit: 30,
        total: 5
    })
    let tacticsColumns = [
        { dataIndex: 'name', title: '策略名称' },
        { dataIndex: 'desc', title: '描述', width: '300px' },
        { dataIndex: 'time', title: '创建时间', width: '190px' },
        { dataIndex: 'executor', title: '创建人' },
        { dataIndex: 'operate', title: '操作', fixed: 'right', width: 120}
    ]
    let tacticsData = ref([
        {name: '防火墙策略', desc: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', time: '2024-01-01 08:00:00', executor: '张三'},
        {name: '防火墙策略', desc: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', time: '2024-01-01 08:00:00', executor: '张三'},
        {name: '防火墙策略', desc: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', time: '2024-01-01 08:00:00', executor: '张三'},
        {name: '防火墙策略', desc: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', time: '2024-01-01 08:00:00', executor: '张三'},
        {name: '防火墙策略', desc: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', time: '2024-01-01 08:00:00', executor: '张三'}
    ])
    const tacticsSizeChange = (val: any) => {
        tacticsParams.value.limit = val;
        tacticsParams.value.page = 1;
    };
    const tacticsCurrentChange = (val: any) => {
        tacticsParams.value.page = val;
    };
    // 新增策略信息
    const addTactics = () => {
        addTacticsVisible.value = true;
    }
    interface TacticsForm {
        name: string,
        creator: string,
        time: string,
        email: string,
        unit: string,
        explain: string
    }
    const tacticsFormRef = ref<FormInstance>()
    let tacticsForm = ref<TacticsForm>({
        name: '',
        creator: '',
        time: '',
        email: '',
        unit: '',
        explain: ''
    })
    const tacticsRules = ref<FormRules<TacticsForm>>({
        name: [{required: true, message: '请填写策略信息', trigger: 'blur'}],
        creator: [{ required: true, message: '请选择创建人', trigger: 'change' }],
        time: [{type: 'date',required: true,message: '请选择创建时间',trigger: 'change'}],
        email: [{ required: true, message: '请填写创建人邮箱', trigger: 'blur' }],
        unit: [{ required: true, message: '请填写创建人单位', trigger: 'blur' }],
        explain: [
            { required: true, message: '请填写策略描述', trigger: 'blur' },
            { min: 1, max: 500, message: '长度在1 ~ 500个字符', trigger: 'blur' }
        ]
    })

    const tacticsSure = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                addTacticsVisible.value = false;
            } else {
                
            }
        })
    }
    const tacticsClean = () => {
        tacticsFormRef.value.resetFields();
    }
    const tacticsDetail = (row: any) => {
        
    }

    
    // 操作日志
    let operateLoading = ref(false);
    let operateParams = ref({
        page: 1,
        limit: 30,
        total: 6
    })
    let operateColumns = [
        { dataIndex: 'time', title: '时间', width: '200px'},
        { dataIndex: 'context', title: '操作内容'},
        { dataIndex: 'executor', title: '操作人', width: '130px'}
    ]
    let operateData = ref([
        {time: '2024-01-01 08:00:00', context: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', executor: '张三'},
        {time: '2024-01-01 08:00:00', context: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', executor: '张三'},
        {time: '2024-01-01 08:00:00', context: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', executor: '张三'},
        {time: '2024-01-01 08:00:00', context: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', executor: '张三'},
        {time: '2024-01-01 08:00:00', context: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', executor: '张三'},
        {time: '2024-01-01 08:00:00', context: '本机防火墙访问策略如下：访问策略描述访问策略描述访问策略描述访问策略描述访问策略描述', executor: '张三'},
    ])
    const operateSizeChange = (val: any) => {
        operateParams.value.limit = val;
        operateParams.value.page = 1;
    };
    const operateCurrentChange = (val: any) => {
        operateParams.value.page = val;
    };



</script>

<template>
    <div>
        <dp title="设备列表详情" @back="backIndex" :desc="route.query.detailID">
            <template #right>
                <el-button type="primary" @click="edit" v-show="!editShow">编辑</el-button>
                <el-button @click="cancel" v-show="editShow">取消</el-button>
                <el-button type="primary" @click="sure" v-show="editShow">确定</el-button>
            </template>
            <div>
                <div class="disabled-three-form-layout">
                    <dl class="dl-container-position">
                        <dt>基础信息</dt>
                        <dd>
                            <el-form :model="secureInfo" :inline="true" label-width="120px" :disabled="disabledShow">
                                <el-form-item label="ID" required>
                                    <el-input v-model="secureInfo.id" />
                                </el-form-item>
                                <el-form-item label="设备名称">
                                    <el-input v-model="secureInfo.biz_level" />
                                </el-form-item>
                                <el-form-item label="状态" required>
                                    <el-select v-model="secureInfo.scan_status" :class="{selectIcon: disabledShow}">
                                        <el-option :label="item.label" :value="item.value" v-for="item in statusList"
                                            :key="item.value" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="IP地址" required>
                                    <el-input v-model="secureInfo.scan_firm" />
                                </el-form-item>
                                <el-form-item label="IPMI地址">
                                    <el-input v-model="secureInfo.scan_version" />
                                </el-form-item>
                                <el-form-item label="设备大类" required>
                                    <el-input v-model="secureInfo.scan_ip" />
                                </el-form-item>
                                <el-form-item label="资产类型" required>
                                    <el-input v-model="secureInfo.room" />
                                </el-form-item>
                                <el-form-item label="所属公司" required>
                                    <el-select v-model="secureInfo.network_area" :class="{selectIcon: disabledShow}">
                                        <el-option :label="item.label" :value="item.value" v-for="item in companyList"
                                            :key="item.value" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="所属处室" required>
                                    <el-input v-model="secureInfo.scan1" />
                                </el-form-item>
                                <el-form-item label="软件版本">
                                    <el-input v-model="secureInfo.database" />
                                </el-form-item>
                                <el-form-item label="维保开始时间">
                                    <el-date-picker
                                        style="width: 100%"
                                        v-model="secureInfo.startTime"
                                        type="date"
									    value-format="YYYY-MM-DD"
                                    />
                                </el-form-item>
                                <el-form-item label="维保终止时间" required>
                                    <el-date-picker
                                        style="width: 100%"
                                        v-model="secureInfo.endTime"
                                        type="date"
									    value-format="YYYY-MM-DD"
                                    />
                                </el-form-item>
                            </el-form>
                        </dd>
                    </dl>
                </div>
                <div class="disabled-three-form-layout">
                    <dl class="dl-container-position">
                        <dt>部署信息</dt>
                        <el-form :model="secureInfo" :inline="true" label-width="120px" :disabled="disabledShow">
                            <el-form-item label="数据中心" required>
                                <el-select v-model="secureInfo.dataCenter" :class="{selectIcon: disabledShow}">
                                    <el-option :label="item.label" :value="item.value" v-for="item in dataCenterList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="机房" required>
                                <el-input v-model="secureInfo.computer_room" />
                            </el-form-item>
                            <el-form-item label="机柜" required>
                                <el-input v-model="secureInfo.cabinet" />
                            </el-form-item>
                            <el-form-item label="起始U位" required>
                                <el-input v-model="secureInfo.startU" />
                            </el-form-item>
                            <el-form-item label="终止U位" required>
                                <el-input v-model="secureInfo.endU" />
                            </el-form-item>
                            <el-form-item label="U位数" required>
                                <el-input v-model="secureInfo.number" />
                            </el-form-item>
                            <el-form-item label="部署区域" required>
                                <el-select v-model="secureInfo.area" :class="{selectIcon: disabledShow}">
                                    <el-option :label="item.label" :value="item.value" v-for="item in executorList"
                                        :key="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </dl>
                </div>
                <dl class="dl-container-position">
                    <dt>标签信息</dt>
                    <div style="padding: 10px 10px 10px 30px;">
                        <el-tag v-for="item in tagList" :key="item.name" type="primary" class="tagColor"
                            :style="{color:item.color}">{{item.name}}</el-tag>
                    </div>
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
                    <dt>备份信息</dt>
                    <div class="table-box paddingBox">
                        <table-unit
                            :columns="backupColumns"
                            :list="backupData"
                            :isIndex="true"
                            v-loading="backupLoading"
                            :total="backupParams.total"
                            :isSelection="false"
                            :currentPage="backupParams.page"
                            :pageSize="backupParams.limit"
                            @handleSizeChange="backupSizeChange"
                            @handleCurrentChange="backupCurrentChange">
                            <template v-slot="record">
                                <el-button size="small" type="primary" link @click="detailRow(record.record)">详情</el-button>
                            </template>
                        </table-unit>
                    </div>
                </dl>
                <dl class="dl-container-position">
                    <dt>升级信息</dt>
                    <div class="table-box paddingBox">
                        <table-unit
                            :columns="upgradeColumns"
                            :list="upgradeData"
                            :isIndex="true"
                            v-loading="upgradeLoading"
                            :total="upgradeParams.total"
                            :isSelection="false"
                            :currentPage="upgradeParams.page"
                            :pageSize="upgradeParams.limit"
                            @handleSizeChange="upgradeSizeChange"
                            @handleCurrentChange="upgradeCurrentChange">
                            <template v-slot="record">
                                <el-button size="small" type="primary" link @click="getRow(record.record)">详情</el-button>
                            </template>
                        </table-unit>
                    </div>
                </dl>
                <dl class="dl-container-position">
                    <dt>合同来源</dt>
                    <div>
                        <el-form label-width="120px" :disabled="disabledShow" class="forms">
                            <el-form-item label="合同名称" required>
                                <el-input v-model="contract_name" />
                            </el-form-item>
                        </el-form>
                    </div>
                </dl>
                <dl class="dl-container-position">
                    <dt>维保干系人</dt>
                    <div class="table-box paddingBox">
                        <el-table :data="maintenanceList" border style="width: 100%;">
                            <el-table-column align="center" type="index" label="序号" width="60"  />
                            <el-table-column align="center" prop="role" label="职责"  />
                            <el-table-column align="center" prop="name" label="姓名" />
                            <el-table-column align="center" prop="phone" label="电话" />
                            <el-table-column align="center" prop="email" label="邮件" />
                            <el-table-column align="center" prop="section" label="厂商" />
                        </el-table>
                    </div>
                </dl>
                <dl class="dl-container-position">
                    <dt>维保记录</dt>
                    <div style="display: flex;justify-content: end;">
                        <el-button type="primary" @click="addRecord">新增维保记录</el-button>
                    </div>
                    <div class="table-box paddingBox">
                        <table-unit
                            :columns="recordColumns"
                            :list="recordData"
                            :isIndex="true"
                            v-loading="recordLoading"
                            :total="recordParams.total"
                            :isSelection="false"
                            :currentPage="recordParams.page"
                            :pageSize="recordParams.limit"
                            @handleSizeChange="recordSizeChange"
                            @handleCurrentChange="recordCurrentChange">
                            <template v-slot="record">
                                <el-button size="small" type="primary" link @click="DownLoadRow(record.record)">下载附件</el-button>
                            </template>
                        </table-unit>
                    </div>
                </dl>
                <dl class="dl-container-position">
                    <dt>相关文档</dt>
                </dl>
                <dl class="dl-container-position">
                    <dt>策略信息</dt>
                    <div style="display: flex;justify-content: end;">
                        <el-button type="primary" @click="addTactics">新增策略信息</el-button>
                    </div>
                    <div class="table-box paddingBox">
                        <table-unit
                            :columns="tacticsColumns"
                            :list="tacticsData"
                            :isIndex="true"
                            v-loading="tacticsLoading"
                            :total="tacticsParams.total"
                            :isSelection="false"
                            :currentPage="tacticsParams.page"
                            :pageSize="tacticsParams.limit"
                            @handleSizeChange="tacticsSizeChange"
                            @handleCurrentChange="tacticsCurrentChange">
                            <template v-slot="record">
                                <el-button size="small" type="primary" link @click="tacticsDetail(record.record)">详情</el-button>
                            </template>
                        </table-unit>
                    </div>
                </dl>
                <dl class="dl-container-position">
                    <dt>操作日志</dt>
                    <div class="table-box paddingBox">
                        <table-unit
                            :columns="operateColumns"
                            :list="operateData"
                            :isIndex="true"
                            v-loading="operateLoading"
                            :total="operateParams.total"
                            :isSelection="false"
                            :currentPage="operateParams.page"
                            :pageSize="operateParams.limit"
                            @handleSizeChange="operateSizeChange"
                            @handleCurrentChange="operateCurrentChange">
                        </table-unit>
                    </div>
                </dl>
            </div>
        </dp>

        <el-dialog
            v-model="addRecordVisible"
            title="新增维保记录"
            width="850"
            @close="clean"
        >
        <div>
            <dl class="dl-container">
                <dt class="dl-title"></dt>
                <dd class="dl-content">
                    <el-form :inline="true" :model="ruleForm" ref="ruleFormRef" :rules="rules" label-width="100px" class="forms">
                        <el-form-item label="实施方式" prop="mode">
                            <el-select v-model="ruleForm.mode">
                                <el-option :label="item.label" :value="item.value" v-for="item in modeList" :key="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="维保厂商" prop="vendor">
                            <el-input v-model="ruleForm.vendor" placeholder="请填写维保厂商" />
                        </el-form-item>
                        <el-form-item label="维保时间" prop="time">
                            <el-date-picker v-model="ruleForm.time" type="datetime"
                            placeholder="请选择发现时间" value-format="YYYY-MM-DD HH:mm:ss" />
                        </el-form-item>
                        <el-form-item label="维保人" prop="maintainer">
                            <el-select v-model="ruleForm.maintainer">
                                <el-option :label="item.label" :value="item.value" v-for="item in maintainerList" :key="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="维保人邮箱" prop="email">
                            <el-input v-model="ruleForm.email" placeholder="请填写维保人邮箱" />
                        </el-form-item>
                        <el-form-item label="维保人电话" prop="phone">
                            <el-input v-model="ruleForm.phone" placeholder="请填写维保人电话" />
                        </el-form-item>
                        <el-form-item label="维保说明" prop="explain">
                            <el-input 
                                v-model="ruleForm.explain" 
                                maxlength="500"
                                placeholder="请填写维保说明，字数限制500字"
                                :autosize="{ minRows: 5 }"
                                show-word-limit
                                type="textarea"
                            />
                        </el-form-item>
                        <br>
                        <el-form-item label="附件信息" prop="attachment">
                            
                        </el-form-item>
                    </el-form>
                </dd>
                </dl>
            </div>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="addRecordVisible = false">取消</el-button>
                <el-button type="primary" @click="recordSure(ruleFormRef)">确定</el-button>
            </div>
            </template>
        </el-dialog>

        <el-dialog
            v-model="addTacticsVisible"
            title="新增策略信息"
            width="850"
            @close="tacticsClean"
        >
        <div>
            <dl class="dl-container">
                <dt class="dl-title"></dt>
                <dd class="dl-content">
                    <el-form :inline="true" :model="tacticsForm" ref="tacticsFormRef" :rules="tacticsRules" label-width="100px" class="forms">
                        <el-form-item label="策略名称" prop="name">
                            <el-input v-model="tacticsForm.name" placeholder="请填写策略名称" />
                        </el-form-item>
                        <br>
                        <el-form-item label="创建人" prop="creator">
                            <el-select v-model="tacticsForm.creator">
                                <el-option :label="item.label" :value="item.value" v-for="item in maintainerList" :key="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="创建时间" prop="time">
                            <el-date-picker v-model="tacticsForm.time" type="datetime"
                            placeholder="请选择创建时间" value-format="YYYY-MM-DD HH:mm:ss" />
                        </el-form-item>
                        <el-form-item label="创建人单位" prop="unit">
                            <el-input v-model="tacticsForm.unit" placeholder="请填写创建人单位" />
                        </el-form-item>
                        <el-form-item label="创建人邮箱" prop="email">
                            <el-input v-model="tacticsForm.email" placeholder="请填写创建人邮箱" />
                        </el-form-item>
                        
                        <el-form-item label="策略描述" prop="explain">
                            <el-input 
                                v-model="tacticsForm.explain" 
                                maxlength="500"
                                placeholder="请填写策略描述，字数限制500字"
                                :autosize="{ minRows: 5 }"
                                show-word-limit
                                type="textarea"
                            />
                        </el-form-item>
                        <br>
                        <el-form-item label="附件信息" prop="attachment">
                            
                        </el-form-item>
                    </el-form>
                </dd>
                </dl>
            </div>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="addTacticsVisible = false">取消</el-button>
                <el-button type="primary" @click="tacticsSure(tacticsFormRef)">确定</el-button>
            </div>
            </template>
        </el-dialog>
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
    .selectIcon{
        :deep(.el-select__suffix){
            display: none;
        }
    }
    :deep(.el-input__prefix){
        display: none;
    }

    .tagColor {
        margin-right: 10px;
    }
    .paddingBox{
        padding:10px 50px 20px 50px;
    }
</style>