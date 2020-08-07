<template>
  <div>
    <a-card title="菜单管理" :bordered="false">
      <a-button type="primary" @click="visible = true" style="margin-bottom:20px;">添加菜单</a-button>
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :dataSource="data"
        bordered
        @change="handleTableChange"
      >
        <h4 slot="name" slot-scope="text" href="javascript:;">{{text}}</h4>
        <span slot="handle" slot-scope="text, record">
          <a-popconfirm
            title="是否禁用这个菜单"
            @confirm="switchStatus(record.id)"
            okText="是"
            cancelText="否"
          >
            <a-button size="small" type="danger" v-if="record.status == 0">禁用</a-button>
            <a-button size="small" type="default" v-if="record.status == 1">启用</a-button>
          </a-popconfirm>
          <a-popconfirm title="是否删除这个菜单" @confirm="dealDel(record.id)" okText="是" cancelText="否">
            <a-button size="small" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>

    <a-modal title="添加菜单" v-model="visible" okText="保存" cancelText="取消" @ok="createMenu">
      <a-form>
        <a-form-item label="一级菜单" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-select placeholder="Please select a country" v-model="form.pid">
            <a-select-option :key="item.id" v-for="item in pid_list" :value="item.id">{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="菜单标题" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-input type="text" v-model="form.title" placeholder="请输入菜单标题" />
        </a-form-item>
        <a-form-item label="菜单地址" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-input type="text" v-model="form.url" placeholder="请输入菜单地址" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    dataIndex: "id",
    width: 80,
  },
  {
    title: "菜单标题",
    dataIndex: "title",
    width: 120,
  },
  {
    title: "地址",
    dataIndex: "url",
    width: 200,
  },
  {
    title: "所属上级",
    dataIndex: "menus.title",
    width: 150,
  },
  {
    title: "状态",
    dataIndex: "statusText",
    width: 70,
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
import { menuGet, switchMenuStatus, delMenu, menuAdd } from "@/api/index";

export default {
  inject: ["reload"],
  data() {
    return {
      data: [],
      columns,
      pid_list: [],
      // 模态框
      visible: false,
      form: {},
      tableLoading: true,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let result = await menuGet();
      this.tableLoading = false;
      this.tableLoading = false;
      result.menu_list.filter((item) => {
        item.statusText = item.status == 0 ? "正常" : "禁用";
      });
      this.pid_list = result.pid_list;
      this.data = result.menu_list;
    },
    async switchStatus(id) {
      let result = await switchMenuStatus({ id: id });
      this.$message.success(result.msg);
      setTimeout(() => {
        this.reload();
      }, 1000);
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
    },
    async dealDel(id) {
      let result = await delMenu({ id: id });
      if (result.code == 0) {
        this.$message.success(result.msg);
        setTimeout(() => {
          this.reload();
        }, 1000);
        return;
      }
      this.$message.error(result.msg);
    },
    async createMenu() {
      if (!this.form.title || this.form.title.length == 0) {
        return this.$message.error("请填写菜单标题");
      }

      if (this.form.pid || this.form.pid.length != 0) {
        if (!this.form.url || this.form.url.length == 0) {
          return this.$message.error("请填写菜单地址");
        }
      }
      let result = await menuAdd(this.form);
      if (result.code == 0) {
        this.$message.success(result.msg);
        setTimeout(() => {
          this.reload();
        }, 1000);
        return;
      }

      this.$message.error(result.msg);
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