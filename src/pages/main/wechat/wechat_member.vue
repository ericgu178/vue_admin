<template>
  <div>
    <a-progress :percent="percent" :style="`display:${show_progress}`" />
    <a-card title="微信用户管理" :bordered="false">
      <a-button
        type="primary"
        @click="syncMember"
        size="large"
        style="margin-top:10px;margin-bottom:20px;"
      >同步会员</a-button>
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :dataSource="data"
        bordered
        :pagination="pagination"
        @change="handleTableChange"
      >
        <h4 slot="name" slot-scope="text" href="javascript:;">{{text}}</h4>
        <template slot="image" slot-scope="image">
          <img :src="image" style="width:50px;height:50px" />
        </template>
        <span slot="handle" slot-scope="text, record">
          <!-- <a-button type="primary" @click="edit(record)">编辑</a-button> -->
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
    title: "头像",
    dataIndex: "wechat_headimgurl",
    scopedSlots: { customRender: "image" },
    align: "center",
    width: 150,
  },
  {
    title: "用户昵称",
    dataIndex: "member_nickname",
    width: 150,
  },
  {
    title: "性别",
    dataIndex: "member_sex",
    width: 80,
  },
  {
    title: "openid",
    dataIndex: "wechat_openid",
    width: 280,
  },
  {
    title: "地区",
    dataIndex: "area",
    width: 180,
  },
  {
    title: "是否关注",
    dataIndex: "is_subscribe_text",
    width: 100,
    align: "center",
  },
  {
    title: "关注时间",
    dataIndex: "subscribe_time",
    width: 200,
  },
  {
    title: "操作",
    dataIndex: "handle",
    scopedSlots: { customRender: "handle" },
  },
];
import { memberGet, syncMember } from "@/api/wechat";
export default {
  inject: ["reload"],
  data() {
    return {
      data: [],
      columns,
      // 分页
      pagination: {
        defaultPageSize: 1,
        total: 20,
      },
      // process
      show_progress: "none",
      percent: 0,
      tableLoading: true,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let result = await memberGet();
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
      let result = await memberGet({ page: el.current });
      this.tableLoading = false;
      this.data = result.data;
      this.pagination = {
        total: parseInt(result.paginate.count),
        current: parseInt(result.paginate.page),
        pageSize: parseInt(result.paginate.pageSize),
        defaultPageSize: parseInt(result.paginate.pageSize),
      };
    },
    async syncMember() {
      this.show_progress = "block";
      var n = 0,
        timer = setInterval(() => {
          n = (n + Math.random() * 10) | 0;
          if (n > 90) {
            n = 90;
            return false;
          }
          this.percent = n;
        }, 2800 + Math.random() * 1000);
      let result = await syncMember();
      this.percent = 100;
      clearInterval(timer);
      setTimeout(() => {
        this.$message.info(result.msg);
        this.show_progress = "none";
        this.percent = 0;
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
