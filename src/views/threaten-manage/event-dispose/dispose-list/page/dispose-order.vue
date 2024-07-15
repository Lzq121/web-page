<script setup lang='ts'>
    import { ElMessage, ElMessageBox } from 'element-plus';
    import type { UploadProps, UploadUserFile, FormRules, FormInstance } from 'element-plus'
    import { ref, reactive } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import uploadPreview from '@/components/upload-preview/index.vue';
    import * as api from '../api';

    //路由
    const route = useRoute();
    const allSelectList = JSON.parse(route.query.arr);

    const router = useRouter();
    const backIndex = () => {
        router.back();
    };

    let isLoading = ref(false);
    let params = ref({
        limit: 30,
        page: 1,
    })
    let columns = [
        { dataIndex: 'id', title: 'ID' },
        { dataIndex: 'ip', title: '受影响主机IP' },
        { dataIndex: 'biz_level', title: '所属系统' },
        { dataIndex: 'company', title: '所属公司' },
        { dataIndex: 'supplier', title: '攻击源IP' },
        { dataIndex: 'network_area', title: '攻击源地域' },
        { dataIndex: 'biz_state', title: '事件类型' },
        { dataIndex: "is_storage", title: "状态", isTag: true, },
        { dataIndex: 'biz_class', title: '标签', isTag: true, },
        { dataIndex: 'biz_type', title: '事件描述',hidden: true },
        { dataIndex: 'biz_plate', title: '发生次数',hidden: true},
        { dataIndex: 'mail_of_main', title: '风险等级',hidden: true},
        { dataIndex: 'tp_of_main', title: '风险描述',hidden: true},
        { dataIndex: 'domain', title: '事件发生时间',hidden: true},
        { dataIndex: 'project_desc', title: '所属数据中心',hidden: true},
        { dataIndex: 'external_lan_ip', title: '部署区域',hidden: true},
        { dataIndex: 'load_ip', title: '录入时间',hidden: true},
        { dataIndex: 'public_ip', title: '数据来源',hidden: true},
        { dataIndex: 'operate', title: '操作', fixed: 'right', width: 120}
    ]
    let distributionType = ref([
        {label: '系统内部工单', value: '系统内部工单'},
        {label: '系统外部工单', value: '系统外部工单'}
    ])
    let orderType = ref([
        {label: '威胁事件排查', value: '威胁事件排查'}
    ])
    let fillerList = ref([
        {label: '张三', value: '张三'}
    ])
    let unitList = ref([
        {label: '人保科技', value: '人保科技'}
    ])
    interface RuleForm {
        disType: string,
        order_type: string,
        orderNum: string,
        orderTitle: string,
        filler: string,
        time: string,
        unit: string,
        email: string,
        phone: string,
        desc: string
    }
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive<RuleForm>({
        disType: '',
        order_type: '',
        orderNum: '',
        orderTitle: '',
        filler: '',
        time: '',
        unit: '',
        email: '',
        phone: '',
        desc: ''
    })
    const rules = reactive<FormRules<RuleForm>>({
        disType: [{required: true, message: '请选择派发类型', trigger: 'change'}],
        order_type: [{ required: true, message: '请选择工单类型', trigger: 'change'}],
        orderNum: [{ required: true, message: '请输入工单编号', trigger: 'blur' }],
        orderTitle: [{ required: true, message: '请输入工单标题', trigger: 'blur' }],
        filler: [{required: true,message: '请选择填单人',trigger: 'change'}],
        time: [{type: 'date',required: true,message: '请选择填单时间',trigger: 'change'}],
        desc: [
            { required: true, message: '请输入工单描述', trigger: 'blur' },
            { min: 1, max: 500, message: '长度在1 ~ 500个字符', trigger: 'blur' }
        ]
    })

    interface RuleOrderForm {
        disposalUnit: string,
        disposer: string
    }
    const orderFormRef = ref<FormInstance>()
    const orderForm = reactive<RuleOrderForm>({
        disposalUnit: '',
        disposer: ''
    })
    const orderRules = reactive<FormRules<RuleOrderForm>>({
        disposalUnit: [{required: true, message: '请选择处置单位', trigger: 'change'}],
        disposer: [{ required: true, message: '请选择处置人', trigger: 'change'}]
    })

    const stepData = reactive({
        stepList: [
            {title: '派发工单', name: '张三', time: '2024-01-01 08:00:00'},
            {title: '审核工单', name: '', time: ''},
            {title: '认领工单', name: '', time: ''},
            {title: '关闭', name: '', time: ''}
        ],
        active: 0
    })
    const tableData = reactive([
        {
            status: '完成',
            time: '2024-01-01 08:00:00',
            node: '派发工单',
            idea: '-',
            section: '安全运营部',
            people: '张三'
        }
    ])
    const paginations = reactive({
      page: 1,
      limit: 30,
      total: allSelectList.length
    });

    // 派发工单
    const distribute = async() => {
        const refBasicForm = async () => {
            if (!ruleFormRef) return
            return await ruleFormRef.value?.validate((valid: any,fields) => {
                if (valid) {
                    console.log('submit!')
                } else {
                    console.log('error submit!',fields)
                    return false
                }
            })
        }
        const refBasicForm2 = async () => {
            if (!orderFormRef) return
            return await orderFormRef.value?.validate((valid: any,fields) => {
                if (valid) {
                    console.log('submit123')
                } else {
                    console.log('error submit123!',fields)
                    return false
                }
            })
        }
        const formRes = await Promise.all([
            refBasicForm(),
            refBasicForm2(),
        ])
        if (formRes[0] == true && formRes[1] == true) {
            console.log('校验通过')
        } else {
            console.log('校验错误')
            return
        }
    }

    // 相关截图
    let imgList = ref([]);
    imgList.value = route.query.imgList ? JSON.parse(route.query.imgList) : [];
    const uploadResult = (val) => {
        imgList.value = val.value;
    };
    // 详情
    const editRow = (row: any) => {
        router.push({
            path: '/threaten-manage/event-dispose/dispose-list/dispose-detail',
            query: { detailID: row.id, ...row},
        });
    };

    // 导出
    const excelDown = () => {
        let str = `ID,受影响主机IP,所属系统,设备名称,所属公司,所属处室,攻击源IP,攻击源地域,事件类型,处置优先级,状态,标签,事件描述,发生次数,风险等级,风险描述,事件发生时间,所属数据中心,部署区域,录入时间,数据来源\n`;
        for(let i = 0 ; i < allSelectList.length ; i++ ){
            for(const key in allSelectList[i]){
                str+=`${allSelectList[i][key] + '\t'},`;     
            }
            str+='\n';
        }
        // encodeURIComponent解决中文乱码
        const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
        // 通过创建a标签实现
        const link = document.createElement("a");
        link.href = uri;
        link.download = "处置列表.csv";
        link.click();
    }

    const selectList = () => {
        return allSelectList.filter((item, index) =>
            index < paginations.page * paginations.limit &&
            index >= paginations.limit * (paginations.page - 1)
        );
    };

    //改变页码
    const handleCurrentChange = (e) => {
        paginations.page = e;
    };
    //改变页数限制
    const handleSizeChange = (e) => {
        paginations.limit = e;
    };

</script>

<template>
    <div class="contains">
        <dp title="派发工单" @back="backIndex">
            <template #right>
                <el-button type="primary" @click="distribute()">派发工单</el-button>
            </template>
            <dl class="dl-container-position" style="margin-top: 10px;">
                <div class="process-title">
                    处理进度
                    <!-- <el-tag type="warning" style="margin-left:20px;">已研判</el-tag> -->
                </div>
                <el-steps :active="stepData.active" align-center style="padding: 40px 50px;">
                    <el-step v-for="item in stepData.stepList" :key="item.title" :title="item.title" icon="CircleCheckFilled">
                        <template #description>
                            <div>{{item.name}}</div>
                            <div>{{ item.time }}</div>
                        </template>
                    </el-step>
                </el-steps>
                <div class="process-title" style="margin: 20px 0;">处置流程信息</div>
                <div class="table-box" style="padding:10px 90px 20px 90px;">
                    <el-table :data="tableData" border  style="width: 100%;">
                        <el-table-column align="center" type="index" label="序号" width="60" />
                        <el-table-column align="center" prop="status" label="状态">
                            <template #default="scope">
                                <span style="color: #00b42a;">{{scope.row.status}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="time" label="处理时间" width="180" />
                        <el-table-column align="center" prop="node" label="处置节点" />
                        <el-table-column align="center" prop="idea" label="处置意见" width="180"/>
                        <el-table-column align="center" prop="section" label="部门" />
                        <el-table-column align="center" prop="people" label="处置人" />
                    </el-table>
                </div>
            </dl>
            <dl class="dl-container-position">
                <dt>基本信息</dt>
                <dd class="dl-content">
                    <el-form :inline="true" ref="ruleFormRef" :rules="rules" :model="ruleForm" label-width="130px" class="forms">
                        <el-form-item label="派发类型" prop="disType">
                            <el-select v-model="ruleForm.disType">
                                <el-option :label="item.label" :value="item.value" v-for="item in distributionType" :key="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="工单类型" prop="order_type">
                            <el-select v-model="ruleForm.order_type">
                                <el-option :label="item.label" :value="item.value" v-for="item in orderType" :key="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="工单编号" prop="orderNum">
                            <el-input v-model="ruleForm.orderNum" />
                        </el-form-item>
                        <el-form-item label="工单标题" prop="orderTitle">
                            <el-input v-model="ruleForm.orderTitle" />
                        </el-form-item>
                        <el-form-item label="填单人" prop="filler">
                            <el-select v-model="ruleForm.filler">
                                <el-option :label="item.label" :value="item.value" v-for="item in fillerList" :key="item.value" />
                            </el-select>
                          </el-form-item>
                        <el-form-item label="填单时间" prop="time">
                            <el-date-picker v-model="ruleForm.time" type="datetime" style="width:300px;"
                                placeholder="请选择发现时间" value-format="YYYY-MM-DD HH:mm:ss" />
                        </el-form-item>
                        <el-form-item label="填单人单位" prop="unit">
                            <el-input v-model="ruleForm.unit" />
                        </el-form-item>
                        <el-form-item label="填单人邮箱" prop="email">
                            <el-input v-model="ruleForm.email" />
                        </el-form-item>
                        <el-form-item label="填单人电话" prop="phone">
                            <el-input v-model="ruleForm.phone" />
                        </el-form-item>
                        <br/>
                        <el-form-item label="工单描述" prop="desc">
                            <el-input 
                                v-model="ruleForm.desc"
                                maxlength="500"
                                style="width:300px;"
                                placeholder="请填写工单描述，字数限制500字"
                                :autosize="{ minRows: 5 }"
                                type="textarea"
                            />
                        </el-form-item>
                    </el-form>
                </dd>
            </dl>
            <dl class="dl-container-position">
                <dt>处置人信息</dt>
                <dd class="dl-content">
                    <el-form :inline="true" :model="orderForm" ref="orderFormRef" :rules="orderRules" label-width="130px" class="forms">
                        <el-form-item label="处置单位" prop="disposalUnit">
                            <el-select v-model="orderForm.disposalUnit">
                                <el-option :label="item.label" :value="item.value" v-for="item in unitList" :key="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="处置人" prop="disposer">
                            <el-select v-model="orderForm.disposer">
                                <el-option :label="item.label" :value="item.value" v-for="item in fillerList" :key="item.value" />
                            </el-select>
                         </el-form-item>
                    </el-form>
                </dd>
            </dl>
            <dl class="dl-container-position">
                <dt>附件文件</dt>
            </dl>
            <dl class="dl-container-position">
                <dt>相关截图</dt>
                <uploadPreview api="" :imgList="imgList"  @uploadResult="uploadResult" />
            </dl>
            <dl class="dl-container-position">
                <dt>事件列表</dt>
                <div style="display: flex;justify-content: end;">
                    <el-button type="primary" @click="excelDown" link icon="Download">导出事件</el-button>
                </div>
                <dd class="dl-content">
                    <div class="table-box">
                        <el-table :data="selectList()" border height="425" style="width: 100%;">
                            <el-table-column align="center" prop="id" label="ID" width="160" />
                            <el-table-column align="center" prop="ip" label="受影响主机IP"  width="120" />
                            <el-table-column align="center" prop="biz_level" label="所属系统" width="120" />
                            <el-table-column align="center" prop="company1"  label="设备名称" width="120" show-overflow-tooltip/>
                            <el-table-column align="center" prop="company" label="所属公司" width="120" />
                            <el-table-column align="center" prop="biz_level1" label="所属处室" width="120" />
                            <el-table-column align="center" prop="supplier" label="攻击源IP" width="120" />
                            <el-table-column align="center" prop="network_area" label="攻击源地域" width="120" />
                            <el-table-column align="center" prop="biz_state" label="事件类型" width="100" />
                            <el-table-column align="center" prop="biz_state1" label="处置优先级" width="100" />
                            <el-table-column align="center" prop="status" label="状态" width="100" />
                            <el-table-column align="center" prop="biz_class" label="标签"  />
                            <el-table-column align="center" prop="biz_type" label="事件描述" show-overflow-tooltip width="150" />
                            <el-table-column align="center" prop="biz_plate" label="发生次数" width="100" />
                            <el-table-column align="center" prop="mail_of_main" label="风险等级" width="100" />
                            <el-table-column align="center" prop="tp_of_main" label="风险描述" show-overflow-tooltip width="150" />
                            <el-table-column align="center" prop="domain" label="事件发生时间" width="180" />
                            <el-table-column align="center" prop="project_desc" label="所属数据中心" width="120" />
                            <el-table-column align="center" prop="external_lan_ip" label="部署区域" width="100" />
                            <el-table-column align="center" prop="load_ip" label="录入时间" width="180" />
                            <el-table-column align="center" prop="public_ip" label="数据来源" width="110" />
                            <el-table-column fixed="right" label="操作">
                                <template #default="scope">
                                    <el-button size="small" type="primary" link @click="editRow(scope.row)">详情</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="paginationBox">
                        <el-pagination
                            background
                            :disabled="paginations.total === 0 ? true : false"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="paginations.page"
                            :page-size="paginations.limit"
                            :page-sizes="[10, 20, 30, 40, 50]"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="paginations.total"
                        ></el-pagination>
                    </div>
                </dd>
            </dl>
        </dp>
    </div>
</template>
<style scoped lang="scss">
    .contains{
        .process-title{
            padding: 0 40px 10px 40px;
            font-weight: bold;
            font-size: 17px;
        }
        .box{
            width:20px;
            height: 20px;
            border-radius: 50%;
        }
        .forms{
            .el-input, .el-select{
                width: 300px;
            }
        }
        .paginationBox{
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>