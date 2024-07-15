<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import apis from './api';
const router = useRouter();
const goToSearchAssets = (biz_type: string, data_center: string, network_area: string) => {
	if (biz_type && data_center && network_area) {
		let query = { data_center, network_area, pageType: 'asset-board', ipOrApp: '1' };
		if (biz_type === 'biz_count') {
			query = { deploy_info: data_center, network_area, pageType: 'asset-board', ipOrApp: '2' };
		}
		if (biz_type === 'unknown_assets_count') {
			query = { data_center, network_area, is_known: '0', pageType: 'asset-board', ipOrApp: '1' };
		}
		router.push({
			path: '/asset-manage/asset-list',
			query,
		});
	}
};
let isLoading = ref(true);
const resetTableSize = () => {
	let tablePadding = Math.ceil(window.innerHeight / 40);
	let tableCellCon: [HTMLElement] = document.querySelectorAll('.el-table--default .el-table__cell');
	tableCellCon.forEach((element: HTMLElement) => {
		element.style = `padding:${tablePadding}px 0;font-size:${tablePadding - 2}px`;
	});
	isLoading.value = false;
};
const tableDataList = ref([]);
const fetchTableData = async () => {
	isLoading.value = true;
	let res = await apis.getAssetsStat();
	tableDataList.value = res.data;
	nextTick(() => {
		resetTableSize();
	});
};

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
	if (columnIndex === 0) {
		if (rowIndex % 2 === 0) {
			return {
				rowspan: 2,
				colspan: 1,
			};
		} else {
			return {
				rowspan: 0,
				colspan: 0,
			};
		}
	}
};
fetchTableData();
</script>

<template>
  <div class="asset-board-layout">
    <el-table :data="tableDataList"
              :span-method="objectSpanMethod"
              v-loading="isLoading"
              border>
      <el-table-column prop="data_center"
                       label="数据中心"
                       align="center"
                       width="180" />
      <el-table-column prop="network_area"
                       align="center"
                       label="区域" />
      <el-table-column prop="biz_count"
                       align="center"
                       label="业务系统数">
        <template #default="{row}">
          <el-button link
                     type="primary"
                     :disabled="row.biz_count==0 || row.data_center=='合计'"
                     @click="goToSearchAssets('biz_count', row.data_center, row.network_area)">{{ row.biz_count }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="online_assets_count"
                       align="center"
                       label="资产IP数">
        <template #default="{row}">
          <el-button link
                     type="primary"
                     :disabled="row.online_assets_count==0 || row.data_center=='合计'"
                     @click="goToSearchAssets('online_assets_count', row.data_center, row.network_area)">{{ row.online_assets_count }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="unknown_assets_count"
                       align="center"
                       label="现存未知资产">
        <template #default="{row}">
          <el-button link
                     type="primary"
                     :disabled="row.unknown_assets_count==0 || row.data_center=='合计'"
                     @click="goToSearchAssets('unknown_assets_count',row.data_center, row.network_area)">{{ row.unknown_assets_count }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="recognition_rate"
                       align="center"
                       label="识别率" />
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.asset-board-layout {
	padding: 10px;
}
</style>
