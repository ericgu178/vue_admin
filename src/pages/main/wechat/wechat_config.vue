<template>
  <div>
    <a-card title="微信公众号配置管理" :bordered="false">
      <!-- <a-button type="primary" size="large" @click="visible = true;" style="margin-top:10px;margin-bottom:20px;">添加账户</a-button> -->
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
            size="small"
            v-show="record.status == 0"
            @click="switchStatus(record.id,record.status = 1)"
          >启用</a-button>
          <a-button
            type="danger"
            size="small"
            v-show="record.status == 1"
            @click="switchStatus(record.id,record.status = 0)"
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
    title: "公众号名称",
    dataIndex: "wechat_title",
    width: 150,
  },
  {
    title: "app_id",
    dataIndex: "app_id",
    width: 200,
  },
  {
    title: "token",
    dataIndex: "wechat_token",
    width: 150,
  },
  {
    title: "状态",
    dataIndex: "status_text",
    width: 150,
  },
  {
    title: "类型",
    dataIndex: "type_text",
    width: 150,
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    width: 250,
  },
  {
    title: "操作",
    dataIndex: "handle",
    scopedSlots: { customRender: "handle" },
  },
];
import { getWechatConfig, switchStatus } from "@/api/wechat";
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
  },
  methods: {
    async init() {
      let result = await getWechatConfig();
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
      let result = await getWechatConfig({ page: el.current });
      this.tableLoading = false;
      this.data = result.data;
      this.pagination = {
        total: parseInt(result.paginate.count),
        current: parseInt(result.paginate.page),
        pageSize: parseInt(result.paginate.pageSize),
        defaultPageSize: parseInt(result.paginate.pageSize),
      };
    },
    async switchStatus(id, status) {
      let result = await switchStatus({ id: id, status: status });
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
