<!--
 * @User: EricGU178
 * @Date: 2019-02-19 11:52:25
 * @LastEditors: EricGU178
 * @LastEditTime: 2019-02-22 10:42:54
 * @温馨提示: 代码千万行 注释第一行 命名不规范 同事^ ^
 * @头部组件
 -->
<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <a-icon v-if="isColl" type="menu-unfold" />
      <a-icon v-if="!isColl" type="menu-fold" />
    </div>
    <div class="logo" :class="{'content-collapse':isColl}">{{$t('title')}}</div>
    <div class="header-right">
      <div class="header-user-con">
        <a-button
          style="margin-right: 10px;"
          @click="switchStatus"
        >{{this.$store.state.i18n.locale == 'en' ? '中文' : 'English'}}</a-button>
        <!-- 全屏显示 -->
        <a-icon
          style="cursor: pointer;"
          v-if="!fullscreen"
          type="fullscreen"
          @click="handleFullScreen"
        />
        <a-icon
          style="cursor: pointer;"
          v-if="fullscreen"
          type="fullscreen-exit"
          @click="handleFullScreen"
        />
        <a-badge :count="barge">
          <a-avatar
            class="user-avator"
            shape="square"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </a-badge>
        <a-dropdown class="user-name" :trigger="['click']">
          <span style="font-size:16px;cursor:pointer" class="ant-dropdown-link">
            {{user}}
            <a-icon type="down" />
          </span>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="logout">{{$t('logout')}}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bars from "../common/bars";
export default {
  data() {
    return {
      isColl: false,
      fullscreen: false,
      barge: null,
      user: "test",
    };
  },
  created() {
    let userinfo = this.getStore({ key: "userinfo" });
    if (userinfo != null) {
      this.user = userinfo.username;
    }
  },
  methods: {
    logout() {
      this.removeStore("userinfo");
      this.removeStore("menus");
      this.$router.push("/login");
    },
    // 侧边栏折叠
    collapseChage() {
      this.barge++;
      this.isColl = !this.isColl;
      bars.$emit("isColl", this.isColl);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    switchStatus() {
      if (this.$store.state.i18n.locale == "cn") {
        this.$i18n.set("en");
      } else {
        this.$i18n.set("cn");
      }
    },
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  background: #000;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}

.header .content-collapse {
  width: 50px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
</style>

