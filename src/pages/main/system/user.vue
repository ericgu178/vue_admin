<template>
  <div id="user">
    <a-card title="用户管理" :bordered="false">
      <a-button type="primary" style="margin-bottom:10px;" @click="addModel = true">添加帐号</a-button>
      <a-table :columns="columns" :data-source="data" bordered :pagination="pagination">
        <template slot="action" slot-scope="text">
          <a-button type="primary" @click="edit(text)">编辑</a-button>
          <a-button
            type="primary"
            style="margin-left:10px;"
            @click="switchStatus(text)"
            v-if="text.status == 0 && userinfo.id != text.id"
          >启用</a-button>
          <a-button
            type="danger"
            style="margin-left:10px;"
            @click="switchStatus(text)"
            v-if="text.status == 1 && userinfo.id != text.id"
          >禁用</a-button>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑模态框 -->

    <a-modal
      :title="editTitle"
      :visible="editModel"
      @ok="saveEdit"
      ok-text="保存"
      cancel-text="取消"
      @cancel="editModel = false"
    >
      <a-form-model :model="editForm" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-form-model-item label="帐号名">
          <a-input v-model="editForm.name" />
        </a-form-model-item>
        <a-form-model-item label="角色分配">
          <a-select v-model="editForm.group_id" placeholder="请选择角色" style="width: 120px">
            <a-select-option
              :value="item.id"
              :key="item.id"
              v-for="item in group"
            >{{item.group_name}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 新增模态框 -->

    <a-modal
      title="添加帐号"
      :visible="addModel"
      @ok="saveAdd"
      ok-text="保存"
      cancel-text="取消"
      @cancel="addModel = false"
    >
      <a-form-model :model="addForm" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-form-model-item label="帐号名">
          <a-input v-model="addForm.username" />
        </a-form-model-item>
        <a-form-model-item label="角色分配">
          <a-select v-model="addForm.group_id" placeholder="请选择角色" style="width: 120px">
            <a-select-option
              :value="item.id"
              :key="item.id"
              v-for="item in group"
            >{{item.group_name}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "#",
    dataIndex: "id",
    width: 70,
    align: "center",
  },
  {
    title: "帐号名",
    dataIndex: "username",
    width: 150,
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "link_unit.unit_name",
    width: 150,
    align: "center",
  },
  {
    title: "角色",
    dataIndex: "link_auth_user_group[0].group_name",
    width: 150,
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status_text",
    width: 150,
    align: "center",
  },
  {
    title: "加入时间",
    dataIndex: "create_time",
    width: 200,
  },
  {
    title: "最后登录时间",
    dataIndex: "last_time",
    width: 200,
  },
  {
    title: "操作",
    key: "x",
    scopedSlots: { customRender: "action" },
  },
];

import { getAdminIndex,getGroup,addUser, editUser } from "@/api/admin";

export default {
  data() {
    return {
      editTitle: "",
      editModel: false,
      addModel: false,
      addForm: {
        username: "",
        group_id: "",
        unit_id: "",
      },
      editForm: {
        name: "",
        group_id: "",
        unit_id: "",
      },
      data: [],
      group: [], //角色
      units: [], //单位
      columns,
      userinfo: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0, // 总数，必须先有
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.pagination.current = current;
          this.getList(current);
        },
      },
    };
  },
  methods: {
    async init() {
      this.data = [];
      let result = await getAdminIndex({
        page: 1,
      });
      result.res.filter((item) => {
        item.status_text = item.status == 1 ? "正常" : "禁用";
        item.key = item.id;
      });
      this.data = result.res;
      this.pagination.total = result.total;
      this.pagination.current = result.page;
    },
    // 查询
    async getList(page) {
      let result = await getAdminIndex({
        page: page,
      });
      result.res.filter((item) => {
        item.status_text = item.status == 1 ? "正常" : "禁用";
        item.key = item.id;
      });
      this.data = result.res;
      this.pagination.total = result.total;
      this.pagination.current = result.page;
    },
    edit(row) {
      this.editModel = true;
      this.editForm.id = row.id;
      this.editForm.name = row.username;
      this.editForm.unit_id = row.unit_id;
      this.editForm.group_id = row.link_auth_user_group[0]["id"];
      console.log(row);
    },
    async saveEdit() {
      if (this.editForm.name.length == 0) {
        return this.$message.error("请填写账户名称");
      }
      if (this.editForm.unit_id.length == 0) {
        return this.$message.error("请选择单位信息");
      }
      if (this.editForm.group_id.length == 0) {
        return this.$message.error("请选择角色信息");
      }
      let result = await editUser(this.editForm);
      if (result.code == 0) {
        this.editModel = false;
        this.init();
      }
    },
    // 添加保存
    async saveAdd() {
      if (this.addForm.username.length == 0) {
        return this.$message.error("请填写账户名称");
      }
      if (this.addForm.unit_id.length == 0) {
        return this.$message.error("请选择单位信息");
      }
      if (this.addForm.group_id.length == 0) {
        return this.$message.error("请选择角色信息");
      }
      console.log(this.addForm);
      let result = await addUser(this.addForm);
      if (result.code == 0) {
        this.addModel = false;
        this.init();
      }
    },
    async getGroup() {
      let result = await getGroup();
      this.group = result.data;
    },
    async getAllUnit() {
      let result = await getAllUnit();
      this.units = result.res;
    },
  },
  created() {
    this.userinfo = this.getStore({ key: "userinfo" });
  },
  mounted() {
    this.init();
    this.getGroup();
  },
};
</script>
<style lang="scss" scoped>
th.column-money,
td.column-money {
  text-align: right !important;
}
</style>