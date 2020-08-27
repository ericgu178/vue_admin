<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view v-if="isRouterAlive"></router-view>
    </div>
  </a-config-provider>
</template>
<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
      locale: zh_CN,
      localsRoute: "",
    };
  },
  watch: {
    $route(to, f) {
      this.localsRoute = to.path;
      this.setStore(
        { key: "localsRoute", type: "session" },
        { lastRoutes: this.localsRoute }
      );
    },
  },
  created() {
    // 刷新页面 重新渲染菜单实例
    const unparseRoutes = this.getStore({ key: "menus", type: "session" });
    if (unparseRoutes != null) {
      this.$store.commit("SET_MENUS", {
        menus: unparseRoutes,
        currentRouter: this.getStore({ key: "localsRoute", type: "session" })
          .lastRoutes,
      });
    } else {
        if (this.getStore({key:'userinfo'})) {
            this.$message.info('身份无效,请重新登陆获取');
            this.$router.push({path:'/login'})
        }
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
  },
};
</script>
<style>
@import "./assets/css/main.css";
</style>
