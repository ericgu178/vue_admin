<template>
  <div id="user">
    <a-card title="用户组权限管理" :bordered="false">
      <a-button type="primary" style="margin-bottom:10px;" @click="tianjiazijiedian">添加子节点</a-button>
      <a-button type="primary" style="margin-bottom:10px;background:#000;color:#f90;font-weight:bold;outline:none" @click="tianjiafujiedian">添加父节点</a-button>
      <div class="main">
        <div class="left">
          <a-alert
            :message="message"
            type="info"
            show-icon
            style="margin-bottom:10px"
            @close="closeAlert"
          ></a-alert>
          <!-- <a-alert message="当前选择编辑：" type="info" show-icon style="margin-bottom:10px">当前训责</a-alert> -->

          <a-spin :spinning="routerDisable" tip="Loading...">
            <a-tree
              v-model="checkedKeys"
              checkable
              :selected-keys="allSelectedNodes"
              :tree-data="treeData"
              @select="onSelect"
            />
          </a-spin>
        </div>
        <div class="right">
          <div class="ll">
            <a-form-model :model="form" :label-col="{span:4}" :wrapper-col="{span:20}">
              <a-form-model-item label="前端组件名称">
                <a-input v-model="form.name" />
              </a-form-model-item>
              <a-form-model-item label="菜单名称">
                <a-input v-model="form.title" />
              </a-form-model-item>
              <a-form-model-item label="路由地址">
                <a-input v-model="form.path" />
              </a-form-model-item>
              <a-form-model-item label="图标">
                <a-input v-model="form.icon" style="width: calc(70% - 8px); margin-right: 8px" />
                <a-button type="primary" style="width:30%" @click="chooseIcon">选择图标</a-button>
              </a-form-model-item>
              <a-form-model-item label="前端组件">
                <a-input v-model="form.component" />
              </a-form-model-item>
              <a-form-model-item label="排序">
                <a-input-number :min="1" :max="10" v-model="form.sort_order" />
              </a-form-model-item>
              <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="updateRole" :disabled="updateDisable">修改并保存</a-button>
                <a-button style="margin-left: 10px;" :disabled="updateDisable">重置</a-button>
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 添加子节点 -->

    <a-modal
      title="添加子节点"
      :visible="addModel"
      @ok="addSonRole"
      ok-text="保存"
      cancel-text="取消"
      @cancel="addModel = false"
    >
      <a-form-model :model="addSonForm" :label-col="{span:6}" :wrapper-col="{span:16}">
        <a-form-model-item label="上级节点">{{father.ptitle}}</a-form-model-item>
        <a-form-model-item label="前端组件名称">
          <a-input v-model="addSonForm.name" />
        </a-form-model-item>
        <a-form-model-item label="菜单名称">
          <a-input v-model="addSonForm.title" />
        </a-form-model-item>
        <a-form-model-item label="路由地址">
          <a-input v-model="addSonForm.path" />
        </a-form-model-item>
        <a-form-model-item label="图标">
          <a-input v-model="addSonForm.icon" style="width: calc(70% - 8px); margin-right: 8px" />
          <a-button type="primary" style="width:30%" @click="chooseIcon">选择图标</a-button>
        </a-form-model-item>
        <a-form-model-item label="前端组件">
          <a-input v-model="addSonForm.component" />
        </a-form-model-item>
        <a-form-model-item label="排序">
          <a-input-number :min="1" :max="10" v-model="addSonForm.sort_order" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>


    <a-modal
      title="添加父节点"
      :visible="addFatherModel"
      @ok="addSonRole"
      ok-text="保存"
      cancel-text="取消"
      @cancel="addFatherModel = false"
    >
      <a-form-model :model="addSonForm" :label-col="{span:6}" :wrapper-col="{span:16}">
        <a-form-model-item label="前端组件名称">
          <a-input v-model="addSonForm.name" />
        </a-form-model-item>
        <a-form-model-item label="菜单名称">
          <a-input v-model="addSonForm.title" />
        </a-form-model-item>
        <a-form-model-item label="路由地址">
          <a-input v-model="addSonForm.path" />
        </a-form-model-item>
        <a-form-model-item label="图标">
          <a-input v-model="addSonForm.icon" style="width: calc(70% - 8px); margin-right: 8px" />
          <a-button type="primary" style="width:30%" @click="chooseIcon">选择图标</a-button>
        </a-form-model-item>
        <a-form-model-item label="前端组件">
          <a-input v-model="addSonForm.component" />
        </a-form-model-item>
        <a-form-model-item label="排序">
          <a-input-number :min="1" :max="10" v-model="addSonForm.sort_order" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getRouter } from "@/api/admin";

import { getRole, addRole, editRole, deleteRole } from "@/api/admin";
export default {
  inject: ["reload"],
  data() {
    return {
      checkedKeys: [],
      //   节点选中的
      allSelectedNodes: [],
      addModel: false,
      userinfo: {},
      treeData: [],
      routerDisable: true,
      form: {},
      updateDisable: true,
      message: "当前选择编辑:",
      father: {
        pid: 0,
        ptitle: "",
      },
      addFatherModel:false,

      //   添加

      addSonForm: {},
    };
  },
  watch: {
    form(xin, old) {
      this.updateDisable = xin.name != undefined ? false : true;
    },
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
          other: item,
          children: this.getChild(item.children),
          isLeaf: item.children.length > 0 ? false : true,
        });
      });

      return temp;
    },
    async updateRole() {
      let result = await editRole(this.form);
      this.$message.info(result.msg);
      if (result.code == 0) {
        this.reload();
      }
    },
    tianjiazijiedian() {
      if (this.father.ptitle.length == 0) {
        return this.$message.info("请选择一个父节点");
      }
      this.addModel = true;
    },
    tianjiafujiedian() {
      this.addFatherModel = true;
    },
    async addSonRole() {
      this.addSonForm.pid = this.father.pid;
      let result = await addRole(this.addSonForm);
      if (result.code == 0) {
        this.$message.info(result.msg);
        this.addModel = false;
        this.addFatherModel = false;
        this.reload();
      }
    },
    onSelect(key, { node }) {
      this.form = node.dataRef.other;
      this.message = `当前选择编辑：${this.form.title}`;
      this.father.pid = this.form.id;
      this.father.ptitle = this.form.title;
    },
    chooseIcon() {
      this.$message.info("暂不开放");
    },
    closeAlert(e) {
      this.message = "当前选择编辑：";
      return false;
    },
  },
  created() {
    this.userinfo = this.getStore({ key: "userinfo" });
  },
  mounted() {
    this.getRouter();
  },
};
</script>
<style lang="scss" scoped>
th.column-money,
td.column-money {
  text-align: right !important;
}
.main {
  margin-top: 20px;
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.left {
  width: 25%;
  height: 100%;
}
.right {
  width: calc(75% - 20px);
  margin-left: 20px;
}
.ll {
  width: 50%;
}
</style>