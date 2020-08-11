<template>
  <div class="login-container">
    <a-form @submit="login" :form="form" style="margin:0 auto" class="login-form">
      <div class="title-container">
        <h3 class="title">{{title}}</h3>
      </div>
      <a-form-item>
        <a-input
          v-decorator="['username',
          { rules: [{ required: true, message: '请输入你的账户名' }] }]"
          placeholder="账户"
          width="100%"
        >
          <a-icon slot="prefix" type="user" style="color: #889AA4" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="['password',{
            rules: [{ required: true, message: '请输入你的密码' }]
            }]"
          :type="password_show"
          placeholder="密码"
          width="100%"
        >
          <a-icon slot="prefix" theme="filled" type="lock" style="color: #889AA4" />
          <a-icon
            slot="suffix"
            v-if="!is_show"
            theme="filled"
            type="eye-invisible"
            style="color: #889AA4;cursor:pointer"
            @click="is_show=true;password_show='text'"
          />
          <a-icon
            slot="suffix"
            v-if="is_show"
            theme="filled"
            type="eye"
            style="color: #889AA4;cursor:pointer"
            @click="is_show=false;password_show='password'"
          />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" size="large" html-type="submit" style="width:100%;height:50px">登录</a-button>
      </a-form-item>

      <div style="position:relative">
        <div class="tips">
          <!-- <span>Username : admin</span>
          <span>Password : 123456</span>-->
        </div>
      </div>
    </a-form>
  </div>
</template>
<script>
import { getMenus } from "@/api/admin";
import { login } from "@/api/index";
export default {
  data() {
    return {
      // 展示密码
      is_show: false,
      password_show: "password",
      title: "系统后台",
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    async login(e) {
      let userinfo = {};
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let result = await login({
            username: values.username,
            password: values.password,
          });
          if (result.code == 0) {
            this.$message.success(result.msg);
            result.data.userinfo.expire_time = result.data.expire_time;
            this.setStore({ key: "userinfo" }, result.data.userinfo);
            this.afterLogin();
          } else {
            this.$message.error(result.msg);
          }
        }
      });
    },
    async afterLogin() {
      let userinfo = this.getStore({ key: "userinfo" });
      let result = await getMenus({ user_id: userinfo.id });
      this.setStore({ key: "menus", type: "session" }, result.data);
      this.$store.commit("SET_MENUS", { menus: result.data });
    },
  },
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: rgb(43, 7, 7);
$cursor: #fff;

.login-container {
  .ant-input {
    display: inline-block;
    height: 47px;
    width: 100%;
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $cursor;
    height: 47px;
    caret-color: $cursor;
    outline: 0;
    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px $bg inset !important;
      -webkit-text-fill-color: $cursor !important;
    }
  }

  .ant-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    height: 50px;
    margin-bottom: 20px;
  }

  .ant-form-explain {
    margin-top: 1px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    display: inline-block;
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

