<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入昵称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请码" prop="inviteCode">
        <el-input
          v-model="queryParams.inviteCode"
          placeholder="请输入邀请码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender" style="width: 200px;">
        <el-select v-model="queryParams.gender" placeholder="请选择" clearable>
          <el-option
            v-for="dict in sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商户id" prop="mchId">
        <el-input
          v-model="queryParams.mchId"
          placeholder="请输入商户id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请人id" prop="inviteId">
        <el-input
          v-model="queryParams.inviteId"
          placeholder="请输入邀请人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="FAuserList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="昵称" align="center" prop="nickname" />
      <el-table-column label="手机号" align="center" prop="mobile" />
      <el-table-column label="头像" align="center" prop="avatar" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.avatar" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="center" prop="inviteCode" />
      <el-table-column label="性别" align="center" prop="gender">
        <template #default="scope">
          <dict-tag :options="sys_user_sex" :value="scope.row.gender"/>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center" prop="money" />
      <el-table-column label="积分" align="center" prop="score" />
      <el-table-column label="上次登录时间" align="center" prop="prevTime" />
      <el-table-column label="登录时间" align="center" prop="loginTime" />
      <el-table-column label="登录IP" align="center" prop="loginIp" />
      <el-table-column label="失败次数" align="center" prop="loginFailure" />
      <el-table-column label="加入IP" align="center" prop="joinIp" />
      <el-table-column label="加入时间" align="center" prop="joinTime" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="验证" align="center" prop="verification" />
      <el-table-column label="商户id" align="center" prop="mchId" />
      <el-table-column label="邀请人id" align="center" prop="inviteId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:FAuser:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:FAuser:remove']">删除</el-button>
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

    <!-- 添加或修改会员表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="FAuserRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="FAuser">
import { listFAuser, getFAuser, delFAuser, addFAuser, updateFAuser } from "@/api/system/FAuser";

const { proxy } = getCurrentInstance();
const { sys_user_sex } = proxy.useDict('sys_user_sex');

const FAuserList = ref([]);
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
    nickname: null,
    mobile: null,
    inviteCode: null,
    gender: null,
    status: null,
    isMch: null,
    mchId: null,
    inviteId: null
  },
  rules: {
    groupId: [
      { required: true, message: "组别ID不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询会员表列表 */
function getList() {
  loading.value = true;
  listFAuser(queryParams.value).then(response => {
    FAuserList.value = response.rows;
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
    groupId: null,
    nickname: null,
    mobile: null,
    avatar: null,
    inviteCode: null,
    gender: null,
    money: null,
    score: null,
    prevTime: null,
    loginTime: null,
    loginIp: null,
    loginFailure: null,
    joinIp: null,
    joinTime: null,
    createTime: null,
    updateTime: null,
    status: null,
    verification: null,
    openid: null,
    isMch: null,
    mchId: null,
    inviteId: null
  };
  proxy.resetForm("FAuserRef");
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

/** 提交按钮 */
function submitForm() {
  proxy.$refs["FAuserRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFAuser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFAuser(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除会员表编号为"' + _ids + '"的数据项？').then(function() {
    return delFAuser(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>
