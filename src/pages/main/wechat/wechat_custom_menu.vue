<template>
  <div id="main">
    <div class="content" style="width:1000px;float:left">
      <div id="app-menu">
        <!-- 预览窗 -->
        <div class="weixin-preview">
          <div class="weixin-hd">
            <div class="weixin-title">{{weixinTitle}}</div>
          </div>
          <div class="weixin-bd">
            <ul class="weixin-menu" id="weixin-menu">
              <li
                v-for="(btn,i) in menu.button"
                class="menu-item"
                :class="{current:selectedMenuIndex===i&&selectedMenuLevel()==1}"
                @click="selectedMenu(i,$event)"
              >
                <div class="menu-item-title">
                  <i class="icon_menu_dot"></i>
                  <span>{{ btn.name }}</span>
                </div>
                <ul class="weixin-sub-menu" v-show="selectedMenuIndex===i">
                  <li
                    v-for="(sub,i2) in btn.sub_button"
                    class="menu-sub-item"
                    :class="{current:selectedSubMenuIndex===i2&&selectedMenuLevel()==2}"
                    @click.stop="selectedSubMenu(i2,$event)"
                  >
                    <div class="menu-item-title">
                      <span>{{sub.name}}</span>
                    </div>
                  </li>
                  <li v-if="btn.sub_button.length<5" class="menu-sub-item" @click.stop="addMenu(2)">
                    <div class="menu-item-title">
                      <i class="icon14_menu_add"></i>
                    </div>
                  </li>
                  <i class="menu-arrow arrow_out"></i>
                  <i class="menu-arrow arrow_in"></i>
                </ul>
              </li>
              <li class="menu-item" v-if="menu.button.length<3" @click="addMenu(1)">
                <i class="icon14_menu_add"></i>
              </li>
            </ul>
          </div>
        </div>
        <!-- 主菜单 -->
        <div class="weixin-menu-detail" v-if="selectedMenuLevel()==1">
          <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid;">
            <div class="menu-name">{{menu.button[selectedMenuIndex].name}}</div>
            <div class="menu-del" @click="delMenu">删除菜单</div>
          </div>
          <div class="menu-input-group">
            <div class="menu-label">菜单名称</div>
            <div class="menu-input">
              <input
                type="text"
                name="name"
                placeholder="请输入菜单名称"
                class="menu-input-text"
                v-model="menu.button[selectedMenuIndex].name"
                @input="checkMenuName(menu.button[selectedMenuIndex].name)"
              />
              <p class="menu-tips" style="color:#e15f63" v-show="menuNameBounds">字数超过上限</p>
              <p class="menu-tips">字数不超过4个汉字或8个字母</p>
            </div>
          </div>
          <template v-if="menu.button[selectedMenuIndex].sub_button.length==0">
            <div class="menu-input-group">
              <div class="menu-label">菜单内容</div>
              <div class="menu-input">
                <select
                  v-model="menu.button[selectedMenuIndex].type"
                  name="type"
                  class="menu-input-text"
                >
                  <option value="view">跳转网页(view)</option>
                  <option value="media_id">发送消息(media_id)</option>
                  <!--<option value="view_limited">跳转公众号图文消息链接(view_limited)</option>-->
                  <option value="miniprogram">打开指定小程序(miniprogram)</option>
                  <option value="click">自定义点击事件(click)</option>
                  <option value="scancode_push">扫码上传消息(scancode_push)</option>
                  <option value="scancode_waitmsg">扫码提示下发(scancode_waitmsg)</option>
                  <option value="pic_sysphoto">系统相机拍照(pic_sysphoto)</option>
                  <option value="pic_photo_or_album">弹出拍照或者相册(pic_photo_or_album)</option>
                  <option value="pic_weixin">弹出微信相册(pic_weixin)</option>
                  <option value="location_select">弹出地理位置选择器(location_select)</option>
                </select>
              </div>
            </div>
            <div class="menu-content" v-if="selectedMenuType()==1">
              <div class="menu-input-group">
                <p class="menu-tips">订阅者点击该子菜单会跳到以下链接</p>
                <div class="menu-label">页面地址</div>
                <div class="menu-input">
                  <input
                    type="text"
                    placeholder
                    class="menu-input-text"
                    v-model="menu.button[selectedMenuIndex].url"
                  />
                  <p class="menu-tips cursor" @click="selectNewsUrl">从公众号图文消息中选择</p>
                </div>
              </div>
            </div>
            <div class="menu-msg-content" v-else-if="selectedMenuType()==2">
              <div class="menu-msg-head">
                <i class="icon_msg_sender"></i>图文消息
              </div>
              <div class="menu-msg-panel">
                <div
                  class="menu-msg-select"
                  v-if="menu.button[selectedMenuIndex].media_id==''||menu.button[selectedMenuIndex].media_id==undefined"
                  @click="selectMaterialId"
                >
                  <i class="icon36_common add_gray"></i>
                  <strong>从素材库中选择</strong>
                </div>
                <div class="menu-msg-select" v-else>
                  <div class="menu-msg-title">
                    <i class="icon_msg_sender"></i>
                    {{material.title}}
                  </div>
                  <a :href="material.url" target="_blank" class="btn btn-sm btn-info">查看</a>
                  <div class="btn btn-sm btn-danger" @click="delMaterialId">删除</div>
                </div>
              </div>
            </div>
            <div class="menu-content" v-else-if="selectedMenuType()==3">
              <div class="menu-input-group">
                <p class="menu-tips">用于消息接口推送，不超过128字节</p>
                <div class="menu-label">菜单KEY值</div>
                <div class="menu-input">
                  <input
                    type="text"
                    placeholder
                    class="menu-input-text"
                    v-model="menu.button[selectedMenuIndex].key"
                  />
                </div>
              </div>
            </div>
            <div class="menu-content" v-else-if="selectedMenuType()==4">
              <div class="menu-input-group">
                <p class="menu-tips">订阅者点击该子菜单会跳到以下小程序</p>
                <div class="menu-label">小程序APPID</div>
                <div class="menu-input">
                  <input
                    type="text"
                    placeholder="小程序的appid（仅认证公众号可配置）"
                    class="menu-input-text"
                    v-model="menu.button[selectedMenuIndex].appid"
                  />
                </div>
              </div>
              <div class="menu-input-group">
                <div class="menu-label">小程序路径</div>
                <div class="menu-input">
                  <input
                    type="text"
                    placeholder="小程序的页面路径 pages/Index/index"
                    class="menu-input-text"
                    v-model="menu.button[selectedMenuIndex].pagepath"
                  />
                </div>
              </div>
              <div class="menu-input-group">
                <div class="menu-label">备用网页</div>
                <div class="menu-input">
                  <input
                    type="text"
                    placeholder
                    class="menu-input-text"
                    v-model="menu.button[selectedMenuIndex].url"
                  />
                  <p class="menu-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</p>
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- 子菜单 -->
        <div class="weixin-menu-detail" v-if="selectedMenuLevel()==2">
          <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid;">
            <div
              class="menu-name"
            >{{menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].name}}</div>
            <div class="menu-del" @click="delMenu">删除子菜单</div>
          </div>
          <div class="menu-input-group">
            <div class="menu-label">子菜单名称</div>
            <div class="menu-input">
              <input
                type="text"
                placeholder="请输入子菜单名称"
                class="menu-input-text"
                v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].name"
                @input="checkMenuName(menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].name)"
              />
              <p class="menu-tips" style="color:#e15f63" v-show="menuNameBounds">字数超过上限</p>
              <p class="menu-tips">字数不超过8个汉字或16个字母</p>
            </div>
          </div>
          <div class="menu-input-group">
            <div class="menu-label">子菜单内容</div>
            <div class="menu-input">
              <select
                v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].type"
                name="type"
                class="menu-input-text"
              >
                <option value="view">跳转网页(view)</option>
                <option value="media_id">发送消息(media_id)</option>
                <!--<option value="view_limited">跳转公众号图文消息链接(view_limited)</option>-->
                <option value="miniprogram">打开指定小程序(miniprogram)</option>
                <option value="click">自定义点击事件(click)</option>
                <option value="scancode_push">扫码上传消息(scancode_push)</option>
                <option value="scancode_waitmsg">扫码提示下发(scancode_waitmsg)</option>
                <option value="pic_sysphoto">系统相机拍照(pic_sysphoto)</option>
                <option value="pic_photo_or_album">弹出拍照或者相册(pic_photo_or_album)</option>
                <option value="pic_weixin">弹出微信相册(pic_weixin)</option>
                <option value="location_select">弹出地理位置选择器(location_select)</option>
              </select>
            </div>
          </div>
          <div class="menu-content" v-if="selectedMenuType()==1">
            <div class="menu-input-group">
              <p class="menu-tips">订阅者点击该子菜单会跳到以下链接</p>
              <div class="menu-label">页面地址</div>
              <div class="menu-input">
                <input
                  type="text"
                  placeholder
                  class="menu-input-text"
                  v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].url"
                />
                <p class="menu-tips cursor" @click="selectNewsUrl">从公众号图文消息中选择</p>
              </div>
            </div>
          </div>
          <div class="menu-msg-content" v-else-if="selectedMenuType()==2">
            <div class="menu-msg-head">
              <i class="icon_msg_sender"></i>图文消息
            </div>
            <div class="menu-msg-panel">
              <div
                class="menu-msg-select"
                v-if="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].media_id==''||menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].media_id==undefined"
                @click="selectMaterialId"
              >
                <i class="icon36_common add_gray"></i>
                <strong>从素材库中选择</strong>
              </div>
              <div class="menu-msg-select" v-else>
                <i class="icon_msg_sender"></i>
                {{material.title}}
                <a
                  :href="material.url"
                  target="_blank"
                  class="btn btn-sm btn-info"
                >查看</a>
                <div class="btn btn-sm btn-danger" @click="delMaterialId">删除</div>
              </div>
            </div>
          </div>
          <div class="menu-content" v-else-if="selectedMenuType()==3">
            <div class="menu-input-group">
              <p class="menu-tips">用于消息接口推送，不超过128字节</p>
              <div class="menu-label">菜单KEY值</div>
              <div class="menu-input">
                <input
                  type="text"
                  placeholder
                  class="menu-input-text"
                  v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].key"
                />
              </div>
            </div>
          </div>
          <div class="menu-content" v-else-if="selectedMenuType()==4">
            <div class="menu-input-group">
              <p class="menu-tips">订阅者点击该子菜单会跳到以下小程序</p>
              <div class="menu-label">小程序APPID</div>
              <div class="menu-input">
                <input
                  type="text"
                  placeholder="小程序的appid（仅认证公众号可配置）"
                  class="menu-input-text"
                  v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].appid"
                />
              </div>
            </div>
            <div class="menu-input-group">
              <div class="menu-label">小程序路径</div>
              <div class="menu-input">
                <input
                  type="text"
                  placeholder="小程序的页面路径 pages/Index/index"
                  class="menu-input-text"
                  v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].pagepath"
                />
              </div>
            </div>
            <div class="menu-input-group">
              <div class="menu-label">备用网页</div>
              <div class="menu-input">
                <input
                  type="text"
                  placeholder
                  class="menu-input-text"
                  v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].url"
                />
                <p class="menu-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="weixin-btn-group">
        <div id="btn-create" class="btn btn-success" @click="release">发布</div>
        <div id="btn-clear" class="btn btn-danger" @click="clearMenu">清空</div>
      </div>
    </div>
    <div style="calc(100% - 1000px);margin-right:20px;">
      <h3>生成json查看</h3>
      <pre>{{menu}}</pre>
    </div>
  </div>
</template>
<style>
@import "../../../assets/css/wechat_menu/bootstrap.min.css";
@import "../../../assets/css/wechat_menu/menu.css";
</style>
<script>
import { wechatGetMenu, release } from "@/api/wechat";
export default {
  inject: ["reload"],
  data() {
    return {
      weixinTitle: "公众号菜单",
      menu: {
        button: [],
      }, //当前菜单
      selectedMenuIndex: "", //当前选中菜单索引
      selectedSubMenuIndex: "", //当前选中子菜单索引
      menuNameBounds: false, //菜单长度是否过长
      material: {
        title: "",
        url: "",
        thumb_url: "",
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let result = await wechatGetMenu();
      if (result.code != 0) {
        this.$message.error(result.msg);
      }
      this.selectedMenuIndex = 0; //默认打开第一个
      this.menu.button = result.data.menu.button;
      this.weixinTitle = result.wx_title;
    },
    //选中主菜单
    selectedMenu: function (i, event) {
      this.selectedSubMenuIndex = "";
      this.selectedMenuIndex = i;
      var selectedMenu = this.menu.button[this.selectedMenuIndex];
      //清空选中media_id 防止再次请求
      if (
        selectedMenu.media_id != undefined &&
        selectedMenu.media_id != "" &&
        this.selectedMenuType() == 2
      ) {
        this.getMaterial(selectedMenu.media_id);
      }
      //检查名称长度
      this.checkMenuName(selectedMenu.name);
    },
    //选中子菜单
    selectedSubMenu: function (i, event) {
      this.selectedSubMenuIndex = i;
      var selectedSubMenu = this.menu.button[this.selectedMenuIndex].sub_button[
        this.selectedSubMenuIndex
      ];
      if (
        selectedSubMenu.media_id != undefined &&
        selectedSubMenu != "" &&
        this.selectedMenuType() == 2
      ) {
        this.getMaterial(selectedSubMenu.media_id);
      }
      this.checkMenuName(selectedSubMenu.name);
    },
    //选中菜单级别
    selectedMenuLevel: function () {
      if (this.selectedMenuIndex !== "" && this.selectedSubMenuIndex === "") {
        //主菜单
        return 1;
      } else if (
        this.selectedMenuIndex !== "" &&
        this.selectedSubMenuIndex !== ""
      ) {
        //子菜单
        return 2;
      } else {
        //未选中任何菜单
        return 0;
      }
    },
    //获取菜单类型 1. view网页类型，2. media_id类型和view_limited类型 3. click点击类型，4.miniprogram表示小程序类型
    selectedMenuType: function () {
      if (
        this.selectedMenuLevel() == 1 &&
        this.menu.button[this.selectedMenuIndex].sub_button.length == 0
      ) {
        //主菜单
        switch (this.menu.button[this.selectedMenuIndex].type) {
          case "view":
            return 1;
          case "media_id":
          case "view_limited":
            return 2;
          case "click":
          case "scancode_push":
          case "scancode_waitmsg":
          case "pic_sysphoto":
          case "pic_photo_or_album":
          case "pic_weixin":
          case "location_select":
            return 3;
          case "miniprogram":
            return 4;
        }
      } else if (this.selectedMenuLevel() == 2) {
        //子菜单
        switch (
          this.menu.button[this.selectedMenuIndex].sub_button[
            this.selectedSubMenuIndex
          ].type
        ) {
          case "view":
            return 1;
          case "media_id":
          case "view_limited":
            return 2;
          case "click":
          case "scancode_push":
          case "scancode_waitmsg":
          case "pic_sysphoto":
          case "pic_photo_or_album":
          case "pic_weixin":
          case "location_select":
            return 3;
          case "miniprogram":
            return 4;
        }
      } else {
        return 1;
      }
    },
    //添加菜单
    addMenu: function (level) {
      if (level == 1 && this.menu.button.length < 3) {
        this.menu.button.push({
          type: "view",
          name: "菜单名称",
          sub_button: [],
          url: "",
        });
        this.selectedMenuIndex = this.menu.button.length - 1;
        this.selectedSubMenuIndex = "";
      }
      if (
        level == 2 &&
        this.menu.button[this.selectedMenuIndex].sub_button.length < 5
      ) {
        this.menu.button[this.selectedMenuIndex].sub_button.push({
          type: "view",
          name: "子菜单名称",
          url: "",
        });
        this.selectedSubMenuIndex =
          this.menu.button[this.selectedMenuIndex].sub_button.length - 1;
      }
    },
    //删除菜单
    delMenu: function () {
      if (
        this.selectedMenuLevel() == 1 &&
        confirm("删除后菜单下设置的内容将被删除")
      ) {
        if (this.selectedMenuIndex === 0) {
          this.menu.button.splice(this.selectedMenuIndex, 1);
          this.selectedMenuIndex = 0;
        } else {
          this.menu.button.splice(this.selectedMenuIndex, 1);
          this.selectedMenuIndex -= 1;
        }
        if (this.menu.button.length == 0) {
          this.selectedMenuIndex = "";
        }
      } else if (this.selectedMenuLevel() == 2) {
        if (this.selectedSubMenuIndex === 0) {
          this.menu.button[this.selectedMenuIndex].sub_button.splice(
            this.selectedSubMenuIndex,
            1
          );
          this.selectedSubMenuIndex = 0;
        } else {
          this.menu.button[this.selectedMenuIndex].sub_button.splice(
            this.selectedSubMenuIndex,
            1
          );
          this.selectedSubMenuIndex -= 1;
        }
        if (this.menu.button[this.selectedMenuIndex].sub_button.length == 0) {
          this.selectedSubMenuIndex = "";
        }
      }
    },
    //检查菜单名称长度
    checkMenuName: function (val) {
      if (this.selectedMenuLevel() == 1 && this.getMenuNameLen(val) <= 8) {
        this.menuNameBounds = false;
      } else if (
        this.selectedMenuLevel() == 2 &&
        this.getMenuNameLen(val) <= 16
      ) {
        this.menuNameBounds = false;
      } else {
        this.menuNameBounds = true;
      }
    },
    //获取菜单名称长度
    getMenuNameLen: function (val) {
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        a.match(/[^\x00-\xff]/gi) != null ? (len += 2) : (len += 1);
      }
      return len;
    },
    //选择公众号素材库素材
    selectMaterialId: function () {},
    //选择公众号图文链接
    selectNewsUrl: function () {},
    //设置选择的素材id
    setMaterialId: function (id, title, url) {
      if (this.selectedMenuLevel() == 1) {
        Vue.set(this.menu.button[this.selectedMenuIndex], "media_id", id);
      } else if (this.selectedMenuLevel() == 2) {
        Vue.set(
          this.menu.button[this.selectedMenuIndex].sub_button[
            this.selectedSubMenuIndex
          ],
          "media_id",
          id
        );
      }
      this.material.title = title;
      this.material.url = url;
      layer.close(layer.index);
    },
    //删除选择的素材id
    delMaterialId: function () {
      if (this.selectedMenuLevel() == 1) {
        this.menu.button[this.selectedMenuIndex].media_id = "";
      } else if (this.selectedMenuLevel() == 2) {
        this.menu.button[this.selectedMenuIndex].sub_button[
          this.selectedSubMenuIndex
        ].media_id = "";
      }
    },
    //设置选择的图文链接
    setNewsUrl: function (url) {
      if (this.selectedMenuLevel() == 1) {
        Vue.set(this.menu.button[this.selectedMenuIndex], "url", url);
      } else if (this.selectedMenuLevel() == 2) {
        Vue.set(
          this.menu.button[this.selectedMenuIndex].sub_button[
            this.selectedSubMenuIndex
          ],
          "url",
          url
        );
      }
      layer.close(layer.index);
    },
    //获取素材信息
    getMaterial: function (id) {},
    // 发布
    async release() {
      let result = await release(this.menu);
      if (result.code == 0) {
        this.$notification.open({
          message: "操作通知",
          description: result.msg,
          style: {
            color: "green",
          },
        });
        this.reload();
      } else {
        this.$notification.open({
          message: "操作通知",
          description: result.msg,
          style: {
            color: "red",
          },
        });
      }
    },
    // 清空全部菜单
    clearMenu: function () {
      if (this.menu.button.length == 0) {
        this.$notification.open({
          message: "操作通知",
          description: "已全部清除，不可继续清除",
          style: {
            color: "red",
          },
        });
        return;
      }
      this.menu.button = [];
      this.selectedMenuIndex = "";
      this.selectedSubMenuIndex = "";
      this.$notification.open({
        message: "操作通知",
        description: "菜单已经全部清除，发布前请确认",
        style: {
          color: "green",
        },
      });
    },
  },
};
</script>
<style scoped>
#main {
  display: flex;
  justify-content: space-between;
}
</style>