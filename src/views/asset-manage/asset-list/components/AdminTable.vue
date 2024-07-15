<script lang="ts" setup>
import { ref } from 'vue';
import apis from '../api';
const emits = defineEmits(['selectFun']);
const adminColumns = [
	{ title: '账号', dataIndex: 'uname' },
	{ title: '姓名', dataIndex: 'name' },
	{ title: '电话', dataIndex: 'phone' },
	{ title: '邮件', dataIndex: 'email' },
	{ title: '所属处室', dataIndex: 'office_name' },
	{ title: '备注', dataIndex: 'remark' },
];
let adminParams = ref({
	name: '',
	phone: '',
	page: 1,
	limit: 30,
});
let adminList = ref([]);

let adminTotal = ref(0);
const fetchAdminTableData = async () => {
	const res = await apis.getAdminList(adminParams.value);
	adminList.value = res.data;
	adminTotal.value = res.total;
};
const onSearchAdmin = () => {
	adminParams.value.page = 1;
	fetchAdminTableData();
};
const handleAdminSizeChange = (val: number) => {
	adminParams.value.page = 1;
	adminParams.value.limit = val;
	fetchAdminTableData();
};
const handleAdminCurrentChange = (val: number) => {
	adminParams.value.page = val;
	fetchAdminTableData();
};
const handleSelectionAdminChange = (val: any[]) => {
	emits('selectFun', val);
};
fetchAdminTableData();
</script>
<template>
  <div>
    <div class="form-container">
      <div class="form-params">
        <el-form :inline="true"
                 style="display:flex"
                 :model="adminParams">
          <el-form-item label="姓名"
                        prop="name">
            <el-input v-model="adminParams.name"
                      @keydown.enter="onSearchAdmin"
                      clearable />
          </el-form-item>
          <el-form-item label="电话"
                        prop="phone">
            <el-input v-model="adminParams.phone"
                      @keydown.enter="onSearchAdmin"
                      clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       icon="Search"
                       @click="onSearchAdmin">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div>
      <table-unit :currentPage="adminParams.page"
                  :pageSize="adminParams.limit"
                  :columns="adminColumns"
                  :list="adminList"
                  :total="adminTotal"
                  :isSelection="true"
                  @handleSizeChange="handleAdminSizeChange"
                  @handleSelectionChange="handleSelectionAdminChange"
                  @handleCurrentChange="handleAdminCurrentChange">
      </table-unit>
    </div>
  </div>

</template>
<style lang='scss' scoped>
</style>