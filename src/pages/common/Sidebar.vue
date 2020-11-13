<!--
 * @User: EricGU178
 * @Date: 2019-02-19 13:49:20
 * @LastEditors: EricGU178
 * @LastEditTime: 2019-02-22 10:48:52
 * @温馨提示: 代码千万行 注释第一行 命名不规范 同事^ ^
 * @菜单栏组件
 -->
<template>
  <div class="sidebar">
    <a-menu
      theme="dark"
      mode="inline"
      @openChange="onOpenChange"
      :inlineCollapsed="isColl"
      :openKeys="openkeys"
      :selectedKeys="[onRoutes]"
    >
      <template v-for="item in $store.state.user.menus">
        <template v-if="item.subs">
          <a-sub-menu :key="item.index">
            <span slot="title">
              <a-icon :type="item.icon" />
              <span>{{ item.title }}</span>
            </span>
            <a-menu-item
              v-for="sub in item.subs"
              :key="sub.index"
              v-on:click="titleClick(sub.index)"
            >
              <a-icon :type="sub.icon" />
              {{ sub.title }}
            </a-menu-item>
          </a-sub-menu>
        </template>
        <template v-else>
          <a-menu-item :key="item.index" v-on:click="titleClick(item.index)">
            <a-icon :type="item.icon" />
            <span>{{item.title}}</span>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </div>
</template>

<script>
import bars from "../common/bars";
export default {
  data() {
    return {
      isColl: false,
      openkeys: [],
    };
  },
  methods: {
    // 跳转
    titleClick: function (res) {
      this.$router.push({ path: res });
    },
    onOpenChange: function (res) {
      if (res[1]) {
        this.openkeys = [res[1]];
        return false;
      }
      if (res[0]) {
        this.openkeys = [res[0]];
        return false;
      }
      this.openkeys = [];
    },
  },
  computed: {
    // 计算当前路由的地址 改变 菜单中选中状态
    onRoutes() {
      let openKey = this.$route.path;
      for (let i = 0; i < this.$store.state.user.menus.length; i++) {
        if (this.$store.state.user.menus[i].subs) {
          for (
            let j = 0;
            j < this.$store.state.user.menus[i].subs.length;
            j++
          ) {
            if (openKey == this.$store.state.user.menus[i].subs[j].index) {
              this.openkeys = [this.$store.state.user.menus[i].index];
            }
          }
        }
      }
      return this.$route.path;
    },
  },
  created() {
    bars.$on("isColl", (msg) => {
      this.isColl = msg;
    });
  },
};
</script>
<style>
.sidebar .ant-menu-dark, .ant-menu-dark .ant-menu-sub {
    background: #1a1a1a;
}
</style>
<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.ant-menu:not(.ant-menu-inline-collapsed) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
</style>

