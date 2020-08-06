<template>
  <div>
    <a-menu v-model="index" mode="horizontal">
      <template v-for="item in items">
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

    <!-- 下方展示 -->
    <template v-if="'json_decode_to_string' == index">
      <div style="width:700px;float:left;margin-top:10px;margin-right:20px">
        <a-textarea placeholder :rows="40" v-model="form.beforeData" />
      </div>
      <div style="width:50px;float:left;margin:20% auto;">
        <a-button type="primary" @click="toArray">转换成直接可用数组</a-button>
        <a-button style="margin-top:10px" @click="copy" v-if="form.visable">复制可用数组</a-button>
        <a-button
          style="margin-top:10px"
          @click="form.visable = false;form.beforeData = '';form.afterData = ''"
          v-if="form.visable"
        >清空全部</a-button>
      </div>
      <div style="width:750px;float:left;margin-left:130px;margin-top:10px;" v-if="form.visable">
        <pre>{{form.afterData}}</pre>
      </div>
    </template>
  </div>
</template>
<script>
import { jsonToArray } from "@/api/index";
export default {
  data() {
    return {
      index: "php",
      form: {
        beforeData: "",
        afterData: ``,
        visable: false,
      },
      items: [
        {
          icon: "tool",
          index: "tool",
          title: "工具",
          subs: [
            {
              icon: "area-chart",
              index: "json_decode_to_string",
              title: "json转可直接输出数组",
            },
            {
              icon: "area-chart",
              index: "asd",
              title: "asd",
            },
          ],
        },
        {
          icon: "wechat",
          index: "wechat",
          title: "微信",
          subs: [
            {
              icon: "setting",
              index: "config",
              title: "微信配置管理",
            },
          ],
        },
      ],
    };
  },
  created() {},
  methods: {
    titleClick: function (index) {
      this.index = index;
    },
    async toArray() {
      try {
        var b = JSON.parse(this.form.beforeData);
      } catch (error) {
        this.$message.error("请填写正确的的json数据");
        return;
      }
      let result = await jsonToArray({ before: JSON.stringify(b) });
      this.form.visable = true;
      this.form.afterData = result.data;
    },
    copy: function () {
      var oInput = document.createElement("textarea");
      oInput.value = this.form.afterData;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message.success("复制成功");
    },
  },
};
</script>
<style>
</style>
