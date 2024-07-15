<template>
  <div class="distribution-order-layout">
    <dp title="新建安全基线检测任务"
        desc=" "
        @back="backIndex">
      <el-steps style="max-width: 100%"
                :space="200"
                :active="active"
                simple>
        <el-step title="① 创建任务" />
        <el-step title="② 选择资产" />
      </el-steps>
      <div v-if="active == 1">
        <el-form :inline="true"
                 label-width="100px"
                 :model="baseData"
                 :rules="baseDataRules">
          <el-form-item label="任务名称"
                        required
                        style="width:95%"></el-form-item>
          <el-form-item class="el-form-item-left">
            <el-input v-model="baseData.class_name"
                      clearable />
          </el-form-item>
          <el-form-item label="执行周期"
                        required
                        style="width:95%"></el-form-item>
          <el-form-item label="开始日期"
                        style="width:95%">
            <el-date-picker v-model="baseData.date"
                            type="date"
                            placeholder="Pick a date"
                            clearable />
          </el-form-item>
          <el-form-item label="结束日期"
                        style="width:95%">
            <el-date-picker v-model="baseData.date"
                            type="date"
                            placeholder="Pick a date"
                            clearable />
          </el-form-item>
          <el-form-item label="执行频率"
                        required
                        style="width:95%"></el-form-item>
          <el-form-item style="width:95%"
                        class="el-form-item-left">
            <el-radio-group v-model="baseData.resource1"
                            size="small">
              <el-radio-button label="立即执行"
                               value="0" />
              <el-radio-button label="定时执行"
                               value="2" />
            </el-radio-group>
          </el-form-item>
          <el-form-item style="width:95%"
                        class="el-form-item-left">
            <el-radio-group v-model="baseData.resource">
              <el-radio value="立即执行">立即执行</el-radio>
              <el-radio value="定时执行">定时执行</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="日期"
                        style="width:95%">
            <el-date-picker v-model="baseData.date"
                            type="date"
                            placeholder="Pick a date"
                            clearable />
          </el-form-item>
          <el-form-item prop="date2"
                        label="时间"
                        style="width:95%">
            <el-time-picker v-model="baseData.date2"
                            aria-label="Pick a time"
                            placeholder="Pick a time" />
          </el-form-item>
          <el-form-item label="检查模版"
                        required
                        style="width:95%"></el-form-item>
          <table-unit :height="500"
                      :isSelection="true"
                      :topColShow="false"
                      :isShowPatination="false"
                      @handleSelectionChange="handleSelectionChange"
                      :columns="columns"
                      :list="list">
          </table-unit>
        </el-form>
      </div>
      <div v-else>
        <el-form :inline="true"
                 label-width="100px"
                 :model="baseData"
                 :rules="baseDataRules">
          <el-form-item label="检查区域"
                        required
                        style="width:95%"></el-form-item>
          <el-form-item class="el-form-item-left">
            <el-radio-group v-model="baseData.resource">
              <el-radio value="内网">内网</el-radio>
              <el-radio value="DMZ">DMZ</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="资产类型"
                        required
                        style="width:95%"></el-form-item>
          <el-form-item class="el-form-item-left">
            <el-radio-group v-model="baseData.resource">
              <el-radio value="IP地址段">IP地址段</el-radio>
              <el-radio value="应用系统">应用系统</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-transfer v-model="value"
                       :titles="['待选网段', '已选网段']"
                       filterable
                       :filter-method="filterMethod"
                       filter-placeholder="State Abbreviations"
                       :data="data" />
        </el-form>
      </div>
      <div class="footer-table">
        <el-button @click="cancellation()">取消</el-button>
        <el-button v-if="active == 1"
                   type="primary"
                   @click="next()"> 下一步 </el-button>
        <el-button v-else
                   type="success"
                   @click="determine()">确定</el-button>
      </div>
    </dp>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const backIndex = () => {
	router.push({ path: '/baseline-manage/security-baseline-detection', query: {} });
};

const columns = [
	{
		title: '模版名称',
		dataIndex: '2',
	},
	{
		title: '模版描述',
		dataIndex: '2',
	},
];
let list = ref([{ '2': 'Linux系统口令检查' }, { '2': 'Linux系统口令检查' }, { '2': 'Linux系统口令检查' }, { '2': 'Linux系统口令检查' }]);

const handleSelectionChange = (val: any) => {
	console.log(val);
};
//步骤
const active = ref(1);

let baseData = ref({});
let baseDataRules = ref({});

//下一步
const next = () => {
	if (active.value++ > 2) active.value = 0;
};

//取消
const cancellation = () => {
	router.push({ path: '/baseline-manage/security-baseline-detection', query: {} });
	active.value = 1;
};

//确认
const determine = () => {
	router.push({ path: '/baseline-manage/security-baseline-detection', query: {} });
	active.value = 1;
};

//穿梭框
interface Option {
	key: number;
	label: string;
	initial: string;
}

const generateData = () => {
	const data: Option[] = [];
	const states = ['California', 'Illinois', 'Maryland', 'Texas', 'Florida', 'Colorado', 'Connecticut '];
	const initials = ['CA', 'IL', 'MD', 'TX', 'FL', 'CO', 'CT'];
	states.forEach((city, index) => {
		data.push({
			label: city,
			key: index,
			initial: initials[index],
		});
	});
	return data;
};

const data = ref<Option[]>(generateData());
const value = ref([]);

const filterMethod = (query: any, item: any) => {
	return item.initial.toLowerCase().includes(query.toLowerCase());
};
</script>

<style lang="scss" scoped>
.distribution-order-layout {
	:deep(.el-form--inline .el-form-item) {
		width: 45%;
	}
}
:deep(.ipOrApp .el-radio-group) {
	width: 100%;
	display: flex;
	justify-content: center;
	margin: 5px;
}

.home-card-one,
.home-card-two {
	.home-card-item {
		width: 100%;
		height: 130px;
		border-radius: 4px;
		transition: all ease 0.3s;
		padding: 20px;
		overflow: hidden;
		background: var(--el-color-white);
		color: var(--el-text-color-primary);
		border: 1px solid var(--next-border-color-light);

		&:hover {
			box-shadow: 0 2px 12px var(--next-color-dark-hover);
			transition: all ease 0.3s;
		}

		&-icon {
			width: 70px;
			height: 70px;
			border-radius: 100%;
			flex-shrink: 1;

			i {
				color: var(--el-text-color-placeholder);
			}
		}

		&-title {
			font-size: 15px;
			font-weight: bold;
			height: 30px;
		}
	}
}

:deep(.el-step.is-simple .el-step__icon) {
	display: none;
}
:deep(.input_textarea .el-textarea__inner) {
	height: 500px;
}
:deep(.el-dialog__body) {
	height: 800px;
}
.el-form-item-left {
	margin-left: 2vw;
}
.footer-table {
	margin-top: 2vw;
	margin-left: 33vw;
}
</style>