<template>
  <div>
    <!-- <a-button type="primary" size="large" @click="visible = true;" style="margin-top:10px;margin-bottom:20px;">添加账户</a-button> -->
    <a-card title="账户管理" :bordered="false">
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :dataSource="data"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
      >
        <h4 slot="name" slot-scope="text" href="javascript:;">{{text}}</h4>
        <span slot="handle" slot-scope="text, record">
          <a-button
            type="primary"
            v-if="record.status == 0 && current_login_account != record.username"
            @click="switchStatus(record.id)"
          >恢复</a-button>
          <a-button
            type="danger"
            v-if="record.status == 1 && current_login_account != record.username"
            @click="switchStatus(record.id)"
          >禁用</a-button>
        </span>
      </a-table>
    </a-card>
  </div>
</template>
<script>
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 60,
  },
  {
    title: "账户名称",
    dataIndex: "username",
    width: 150,
  },
  {
    title: "状态",
    dataIndex: "status_text",
    width: 150,
  },
  {
    title: "最后登录时间",
    dataIndex: "last_time",
    width: 250,
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    width: 200,
  },
  {
    title: "操作",
    dataIndex: "handle",
    scopedSlots: { customRender: "handle" },
  },
];
import { accountGet, accountSwitchStatus } from "@/api/index";
export default {
  inject: ["reload"],
  data() {
    return {
      data: [],
      columns,
      form: [],
      // 分页
      pagination: {
        defaultPageSize: 1,
        total: 20,
      },
      current_login_account: "admin",
      tableLoading: true,
    };
  },
  created() {
    this.init();
    var userinfo = this.getStore({ key: "userinfo" });
    this.current_login_account = userinfo.username;
  },
  methods: {
    async init() {
      let result = await accountGet();
      this.tableLoading = false;
      this.data = result.data;
      this.pagination = {
        total: parseInt(result.paginate.count),
        current: parseInt(result.paginate.page),
        pageSize: parseInt(result.paginate.pageSize),
        defaultPageSize: parseInt(result.paginate.pageSize),
      };
    },
    async handleTableChange(el) {
      let result = await accountGet({ page: el.current });
      this.tableLoading = false;
      this.data = result.data;
      this.pagination = {
        total: parseInt(result.paginate.count),
        current: parseInt(result.paginate.page),
        pageSize: parseInt(result.paginate.pageSize),
        defaultPageSize: parseInt(result.paginate.pageSize),
      };
    },
    async switchStatus(id) {
      let result = await accountSwitchStatus({ id: id });
      this.$message.success(result.msg);
      setTimeout(() => {
        this.reload();
      }, 1000);
    },
  },
};
</script>
<style>
th.column-money,
td.column-money {
  text-align: right !important;
}
.components-input-demo-size .ant-input {
  width: 200px;
  margin: 0 8px 8px 0;
}
.ant-table-tbody tr {
  background: #ffffff;
  color: #000;
}
</style>
