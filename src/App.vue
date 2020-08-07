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
import { getMenus } from "@/api/admin";

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
    };
  },
  created() {
    // this.init();
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
    async init() {
      this.isRouterAlive = false;
      let userinfo = this.getStore({ key: "userinfo" });
      let result = await getMenus({ user_id: userinfo.id });
      this.$store.commit("SET_MENUS", { menus: result.data });
      this.isRouterAlive = true;
    },
  },
};
</script>
<style>
@import "./assets/css/main.css";
</style>
