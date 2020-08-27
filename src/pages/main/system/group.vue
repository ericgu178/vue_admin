<template>
  <div id="user">
    <a-card title="用户组权限管理" :bordered="false">
      <a-button
        type="primary"
        style="margin-bottom:10px;"
        @click="addModel = true"
        :disabled="routerDisable"
      >添加用户组</a-button>
      <a-spin :spinning="tableLoading" tip="Loading...">
        <a-table :columns="columns" :data-source="data" bordered :pagination="pagination">
          <template slot="action" slot-scope="text">
            <a-button type="primary" @click="edit(text)" :disabled="routerDisable">编辑</a-button>
            <a-button
              type="primary"
              style="margin-left:10px;"
              @click="switchStatus(text)"
              v-if="text.status == 0"
            >启用</a-button>
            <a-button
              type="danger"
              style="margin-left:10px;"
              @click="switchStatus(text)"
              v-if="text.status == 1"
            >禁用</a-button>
            <!-- <a-button type="primary" style="margin-left:10px;" @click="view(text)">查看权限</a-button> -->
          </template>
        </a-table>
      </a-spin>
    </a-card>

    <!-- 编辑 -->
    <a-modal
      :title="editTitle"
      :visible="editModel"
      @ok="saveEdit"
      ok-text="保存"
      cancel-text="取消"
      @cancel="editModel = false"
    >
      <a-form-model :model="editForm" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-form-model-item label="用户组名称">
          <a-input v-model="editForm.name" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-switch
            checked-children="启用"
            :defaultChecked="editForm.status"
            @change="(e)=>{editForm.status = e}"
            un-checked-children="禁用"
          />
        </a-form-model-item>
        <a-form-model-item label="权限">
          <a-tree
            v-model="editForm.permssions"
            :auto-expand-parent="true"
            checkable
            :selected-keys="editForm.permssions"
            :tree-data="treeData"
            @check="onCheckTreeData"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 新增 -->

    <!-- 编辑 -->
    <a-modal
      title="添加用户组"
      :visible="addModel"
      @ok="add"
      ok-text="保存"
      cancel-text="取消"
      @cancel="addModel = false"
    >
      <a-form-model :model="addForm" :label-col="{span:4}" :wrapper-col="{span:20}">
        <a-form-model-item label="用户组名称">
          <a-input v-model="addForm.name" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-switch
            checked-children="启用"
            :defaultChecked="addForm.status"
            @change="(e)=>{addForm.status = e}"
            un-checked-children="禁用"
          />
        </a-form-model-item>
        <a-form-model-item label="权限">
          <a-tree
            v-model="addForm.permssions"
            :auto-expand-parent="true"
            checkable
            :selected-keys="addForm.permssions"
            :tree-data="treeData"
            @check="onCheckTreeData2"
          />
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
    title: "用户组名称",
    dataIndex: "group_name",
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
    title: "创建时间",
    dataIndex: "create_time",
    width: 200,
  },
  {
    title: "修改时间",
    dataIndex: "update_time",
    width: 200,
  },
  {
    title: "操作",
    key: "x",
    scopedSlots: { customRender: "action" },
  },
];
import { getGroup, getRouter,updateGroup, addGroup } from "@/api/admin";
export default {
  inject: ["reload"],
  data() {
    return {
      data: [],
      columns,
      tableLoading: true,
      // 编辑控件
      editTitle: "",
      editModel: false,
      editForm: {
        permssions: [],
        name: "",
      },
      //   节点选中的
      allSelectedNodes: [],
      addForm: {
        name: "",
        status: true,
        permssions: [],
      },
      addModel: false,
      userinfo: {},
      treeData: [],
      temp: [],
      // 编辑控件结束
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
      routerDisable: true,
    };
  },
  methods: {
    async getRouter() {
      this.routerDisable = true;
      let result = await getRouter();
      this.treeData = this.getChild(result.data);
      this.routerDisable = false;
    },
    getChild(list) {
      let temp = [];
      list.filter((item) => {
        temp.push({
          title: item.title,
          key: item.id,
          children: this.getChild(item.children),
          isLeaf: item.children.length > 0 ? false : true,
        });
      });

      return temp;
    },
    async init() {
      this.tableLoading = true;
      let result = await getGroup({
        page: 1,
      });
      result.data.filter((item) => {
        item.status_text = item.status == 0 ? "禁用" : "正常";
        item.key = item.id;
      });
      this.data = result.data;
      this.tableLoading = false;

      //   this.pagination.total = result.total;
      //   this.pagination.current = result.page;
    },
    // 查询
    async getList(page) {
      this.tableLoading = true;
      let result = await getGroup({
        page: page,
      });
      result.data.filter((item) => {
        item.status_text = item.status == 1 ? "禁用" : "正常";
        item.key = item.id;
      });
      this.data = result.res;
      this.pagination.total = result.total;
      this.pagination.current = result.page;
      this.tableLoading = false;
    },
    // 修改编辑用户组
    edit(text) {
      this.allSelectedNodes = [];
      this.editForm.permssions = [];
      this.editTitle = `编辑 ${text.group_name}`;
      this.editForm.id = text.id;
      this.editForm.name = text.group_name;
      this.editForm.status = text.status == 1 ? true : false;
      //   this.compareItem(text.permssions, this.treeData);
      this.editForm.permssions = this.compareItem(
        text.permssions,
        this.getTreeChildren(this.treeData)
      );
      this.allSelectedNodes = text.permssions;
      this.editModel = true;
    },
    // 保存提交
    async saveEdit() {
      this.editForm.permssion = this.allSelectedNodes.join(',');
    //   console.log(this.editForm.permssion)
    //   return;
      let result = await updateGroup(this.editForm);
      this.$message.info(result.msg);
      this.reload();
      this.editModel = false;
    },
    onCheckTreeData(selectedKeys, e) {
      this.editForm.permssions = selectedKeys;
      this.allSelectedNodes = selectedKeys.concat(e.halfCheckedKeys);
    },
    onCheckTreeData2(selectedKeys, e) {
      this.addForm.permssions = selectedKeys;
      this.allSelectedNodes = selectedKeys.concat(e.halfCheckedKeys);
    },

    async add() {
      if (this.addForm.name.length == 0) {
        return this.$message.error("用户组名称不能为空");
      }
      this.addForm.permssion = this.allSelectedNodes.join(',');
      if (this.addForm.permssion.length == 0) {
        return this.$message.error("权限至少勾选一个");
      }
      let result = await addGroup(this.addForm);
      this.$message.info(result.msg);
      this.addModel = false;
      this.addForm = {
        name: "",
        status: true,
        permssions: [],
      };
      this.init();
    },

    // 其他

    getTreeChildren(data) {
      data &&
        data.map((item) => {
          if (item.children && item.children.length > 0) {
            this.getTreeChildren(item.children);
          } else {
            this.temp.push(item.key);
          }
          return null;
        });
      return this.temp;
    },
    // 2.将后台返回的含有父节点的数组和第一步骤遍历的数组做比较
    // 3.如果有相同值，将相同值取出来，push到一个新数组中
    compareItem(all_data, child_data) {
      let uniqueChild = [];
      for (var i in child_data) {
        for (var k in all_data) {
          if (all_data[k] === child_data[i]) {
            uniqueChild.push(all_data[k]);
          }
        }
      }
      return uniqueChild;
    },
  },
  created() {
    this.userinfo = this.getStore({ key: "userinfo" });
  },
  mounted() {
    this.init();
    this.getRouter();
  },
};
</script>
<style lang="scss" scoped>
th.column-money,
td.column-money {
  text-align: right !important;
}
</style>