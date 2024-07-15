<template>
  <div style="padding:10px">
    <dl class="dl-container-position">
      <dt>IP归属查询</dt>
      <dd>
        <el-form ref="myFormRef"
                 :model="ipForm"
                 :rules="myRules"
                 label-width="120px">
          <el-form-item label="IP地址"
                        prop="ip">
            <el-input v-model="ipForm.ip"
                      placeholder="请输入要查询的IP地址" />
          </el-form-item>
          <el-form-item label="查询类型"
                        prop="ipkind">
            <el-select v-model="ipForm.ipkind"
                       placeholder="请选择查询类型">
              <el-option label="内网地址"
                         value="1" />
              <el-option label="互联网地址"
                         value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="onSubmit">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <span>{{ msg }}</span>
        <br />
        <p v-for="item, index in ipLocationList"
           style="margin: 15px 0;"
           :style="index===0 ? 'font-weight:bold;color:#4e8e2f':''">
          【{{ index + 1 }}】 {{ item['descValue'] }}
          {{ item['rdate'] ? `，收录日期为：${item['rdate']}` : '' }}
        </p>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getRes, hostListGetApi, urlAddrListGetApi } from './api';
import { ipCheck } from '@/utils/ipCheck';

const validateIpaddress = (rule, value, callback) => {
	if (!ipCheck(value)) {
		callback(new Error('请输入合法的IP地址'));
	} else {
		callback();
	}
};
let ipForm = ref({
	ip: '',
	ipkind: '1',
});
let code = ref(0);
let msg = ref('');
let ipLocationList = ref([]);

let myRules = ref({
	ip: [{ required: true, message: '请正确输入IP地址', trigger: 'change', validator: validateIpaddress }],

	ipkind: [{ required: true, trigger: 'blur', message: '请选择查询类型' }],
});
let myFormRef = ref();

// const queryIpAddress = async (ip) => {
// 	let url = 'http://ip-api.com/json/' + ip + '?lang=zh-CN';
// 	let data = await fetch(url).then((response) => response.json());
// 	return data;
// };
// const queryAlarmSip = () => {
// 	if (ipForm.value.ipkind !== '2') return; //只查询互联网数据
// 	queryIpAddress(ipForm.value.ip).then((res) => {
// 		if (res.status == 'success') {
// 			ipLocationList.value = [{ descValue: `${res.country}-${res.city}，本数据来自互联网` }];
// 		} else {
// 			msg.value = '无数据';
// 			ipLocationList.value = [];
// 		}
// 	});
// };
const fetchData = async () => {
	const dataCountArr = [];
	const { data: data3 } = await getRes(ipForm.value);
	if (Array.isArray(data3) && data3.length > 0) {
		data3.forEach((i: any) => {
			i.descValue = `${i['ip']}-${i['company']}-${i['area1']}-${i['area2']}`;
			dataCountArr.push(i);
		});
	}
	const { data: data2 } = await urlAddrListGetApi({ map_ip: ipForm.value.ip, page: 1, limit: 9999 });
	if (Array.isArray(data2) && data2.length > 0) {
		data2.forEach((i: any) => {
			i.descValue = `系统：${i['business']}--管理员：${i['info_admin_name']}`;
			dataCountArr.push(i);
		});
	}
	const { data: data1 } = await hostListGetApi({ ip: ipForm.value.ip, page: 1, limit: 9999 });
	if (Array.isArray(data1) && data1.length > 0) {
		data1.forEach((i: any) => {
			i.descValue = `系统：${i['biz_display']}--管理员：${i['app_admin_name']}`;
			dataCountArr.push(i);
		});
	}

	if (dataCountArr.length > 0) {
		msg.value = `查询成功，共（${dataCountArr.length}）条数据，第一条数据为推荐取用数据`;
		ipLocationList.value = dataCountArr;
	} else {
		msg.value = `未查询到${ipForm.value.ip}相关的数据`;
	}
};
const onSubmit = () => {
	myFormRef.value.validate((valid) => {
		if (valid) {
			ipLocationList.value = [];
			msg.value = '';
			fetchData();
		} else {
			return false;
		}
	});
};
const resetForm = () => {
	myFormRef.value.resetFields();
	ipLocationList.value = [];
	msg.value = '';
};
</script>

<style scoped>
</style>
