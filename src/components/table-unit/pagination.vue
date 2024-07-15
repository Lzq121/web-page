<!-- 
  分页组件
 -->
 <template>
  <div class="pagination-box">
    <el-pagination background
                   :disabled="total === 0 ? true : false"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[10, 20, 30, 40, 50]"
                   :page-size="10"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>
<script lang="ts" setup>
defineProps({
	currentPage: {
		//当前页码
		type: Number,
		default: 1,
	},
	total: {
		//数据总量
		type: Number,
		default: 0,
	},
	position: {
		type: String,
		defalut: 'center',
	},
});
const emit = defineEmits(['handleSizeChange', 'handleCurrentChange']);
const handleSizeChange = (val: number) => {
	//改变数据条目数量
	emit('handleSizeChange', val);
};
const handleCurrentChange = (val: number) => {
	//改变页码
	emit('handleCurrentChange', val);
};
</script>
<style lang="scss" scoped>
.pagination-box {
	display: flex;
	justify-content: right;
	align-items: center;
	width: 100%;
	padding: 8px 30px;
	box-sizing: border-box;
	background: white;
}
</style>