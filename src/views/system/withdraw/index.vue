<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提现金额" prop="amount">
        <el-input
          v-model="queryParams.amount"
          placeholder="请输入提现金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开户银行" prop="bank">
        <el-input
          v-model="queryParams.bank"
          placeholder="请输入开户银行"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankId">
        <el-input
          v-model="queryParams.bankId"
          placeholder="请输入银行卡号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="tel">
        <el-input
          v-model="queryParams.tel"
          placeholder="请输入手机号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态:1=待审核,2=已审核,3=已驳回" clearable>
          <el-option
            v-for="dict in audit_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:withdraw:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:withdraw:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:withdraw:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <!-- <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:withdraw:export']"
        >导出</el-button> -->
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="withdrawList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="用户" align="center" prop="userId" />
      <el-table-column label="手机号" align="center" prop="tel" />
      <el-table-column label="提现金额" align="center" prop="amount" />
      <el-table-column label="开户银行" align="center" prop="bank" />
      <el-table-column label="银行卡号" align="center" prop="bankId" />
      <el-table-column label="添加时间" align="center" prop="createtime" />
      <el-table-column label="修改时间" align="center" prop="updatetime" />
      <!-- <el-table-column label="状态:1=待审核,2=已审核,3=已驳回" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="audit_status" :value="scope.row.status"/>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:withdraw:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:withdraw:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改提现对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="withdrawRef" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Withdraw">
import { listWithdraw, getWithdraw, delWithdraw, addWithdraw, updateWithdraw } from "@/api/system/withdraw";

const { proxy } = getCurrentInstance();
const { audit_status } = proxy.useDict('audit_status');

const withdrawList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    amount: null,
    bank: null,
    bankId: null,
    name: null,
    tel: null,
    status: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询提现列表 */
function getList() {
  loading.value = true;
  listWithdraw(queryParams.value).then(response => {
    withdrawList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    userId: null,
    amount: null,
    bank: null,
    bankId: null,
    name: null,
    tel: null,
    createtime: null,
    updatetime: null,
    status: null
  };
  proxy.resetForm("withdrawRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加提现";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getWithdraw(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改提现";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["withdrawRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateWithdraw(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addWithdraw(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除提现编号为"' + _ids + '"的数据项？').then(function() {
    return delWithdraw(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/withdraw/export', {
    ...queryParams.value
  }, `withdraw_${new Date().getTime()}.xlsx`)
}

getList();
</script>
