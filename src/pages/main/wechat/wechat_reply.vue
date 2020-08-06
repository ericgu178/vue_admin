<template>
  <div>
    <a-card title="关键词回复" :bordered="false">
      <a-button
        type="primary"
        @click="visible = true;form = {};is_add=true;title='添加关键词'"
        style="margin-bottom:20px;"
      >添加关键词</a-button>
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
          <a-button type="primary" size="small" @click="edit(record)">编辑</a-button>
        </span>
      </a-table>
    </a-card>
    <!-- 模态框 -->
    <a-modal :title="title" v-model="visible" okText="保存" cancelText="取消" @ok="edit_truly(is_add)">
      <a-form>
        <a-form-item label="关键词" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-input type="text" v-model="form.receive_content" placeholder="请输入关键词" />
        </a-form-item>
        <a-form-item label="回复类型" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-radio-group v-model="form.reply_type">
            <a-radio :value="0">文本消息</a-radio>
            <a-radio :value="1">图片消息</a-radio>
            <a-radio :value="2">语音消息</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="回复内容" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-input type="text" v-model="form.reply_content" placeholder="请输入回复内容" />
        </a-form-item>
      </a-form>
    </a-modal>
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
    title: "关键词",
    dataIndex: "receive_content",
    width: 150,
  },
  {
    title: "回复类型",
    dataIndex: "reply_type_status",
    width: 150,
  },
  {
    title: "回复内容",
    dataIndex: "reply_content",
    width: 250,
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    width: 200,
  },
  {
    title: "更新时间",
    dataIndex: "update_time",
    width: 200,
  },
  {
    title: "操作",
    dataIndex: "handle",
    scopedSlots: { customRender: "handle" },
  },
];
import {
  getWechatReply,
  WechatReplyUpdate,
  WechatReplyAdd,
} from "@/api/wechat";

export default {
  inject: ["reload"],
  data() {
    return {
      data: [],
      columns,
      visible: false,
      form: [],
      is_add: false,
      title: "添加关键词",
      // 分页
      pagination: {
        defaultPageSize: 1,
        total: 20,
      },
      tableLoading: true,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let result = await getWechatReply();
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
      let result = await getWechatReply({ page: el.current });
      this.tableLoading = false;
      this.data = result.data;
      this.pagination = {
        total: parseInt(result.paginate.count),
        current: parseInt(result.paginate.page),
        pageSize: parseInt(result.paginate.pageSize),
        defaultPageSize: parseInt(result.paginate.pageSize),
      };
    },
    edit: function (data) {
      this.visible = true;
      this.form = data;
      this.is_add = false;
      this.title = `修改关键词：${data.receive_content}`;
    },
    async edit_truly(is) {
      let result;
      if (is) {
        result = await WechatReplyAdd(this.form);
      } else {
        result = await WechatReplyUpdate(this.form);
      }
      this.$message.success(result.msg);
      setTimeout(() => {
        this.reload();
      }, 1000);
      this.visible = false;
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
