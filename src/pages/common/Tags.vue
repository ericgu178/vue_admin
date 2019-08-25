<!--
 * @User: EricGU178
 * @Date: 2019-02-19 11:52:25
 * @LastEditors: EricGU178
 * @LastEditTime: 2019-02-21 11:30:56
 * @温馨提示: 代码千万行 注释第一行 命名不规范 同事^ ^
 * @标签组件
 -->
<template>
    <div class="tags">
        <ul>
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                <router-link :to="item.path" class="tags-li-title">
                    {{item.title}}
                </router-link>
                <span class="tags-li-icon" @click="closeTags(index)"><a-icon type="close" /></span>
            </li>
        </ul>
        <div class="tags-close-box">
             <a-dropdown>
                <a-menu slot="overlay" @click="handleMenuClick">
                  <a-menu-item key="1">关闭当前标签页</a-menu-item>
                  <a-menu-item key="2">关闭其他标签页</a-menu-item>
                  <a-menu-item key="3">关闭全部标签页</a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                    标签选项 <a-icon type="down" />
                </a-button>
            </a-dropdown>
        </div>
    </div>
</template>

<script>
    import bars from './bars';
    export default {
        data() {
            return {
                tagsList: []
            }
        },
        methods: {
            isActive(path) {
                return path === this.$route.fullPath;
            },
            // 关闭单个标签
            closeTags(index) {
                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    delItem.path === this.$route.fullPath && this.$router.push(item.path);
                }else{
                    this.$router.push('/');
                }
            },
            // 设置标签
            setTags(route){
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath;
                })
                if(!isExist){
                    if(this.tagsList.length >= 8){
                        this.tagsList.shift();
                    }
                    this.tagsList.push({
                        title: route.meta.title,
                        path: route.fullPath,
                    })
                }
                bars.$emit('tags', this.tagsList);
            },
            handleMenuClick(e) {
                let index;
                for(let i=0;i<this.tagsList.length;i++){
                    if(this.$route.path==this.tagsList[i].path){
                        index=i
                    }
                }
                // 关闭当前
                if(e.key==1){
                    return this.closeTags(index)
                }

                // 关闭其他
                if(e.key==2){
                        const curItem = this.tagsList.filter(item => {
                            return item.path === this.$route.fullPath;
                        })
                        this.tagsList = curItem;
                        return false;
                }
                // 全部关闭
                if(e.key==3){
                    this.tagsList   =   [];
                    this.$router.push('/')
                }
            },
        },
        computed: {
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        watch:{
            $route(newValue, oldValue){
                this.setTags(newValue);
            }
        },
        created(){
            this.setTags(this.$route);
            // 监听关闭当前页面的标签页
            bars.$on('close_current_tags', () => {
                for (let i = 0, len = this.tagsList.length; i < len; i++) {
                    const item = this.tagsList[i];
                    if(item.path === this.$route.fullPath){
                        if(i < len - 1){
                            this.$router.push(this.tagsList[i+1].path);
                        }else if(i > 0){
                            this.$router.push(this.tagsList[i-1].path);
                        }else{
                            this.$router.push('/');
                        }
                        this.tagsList.splice(i, 1);
                    }
                }
            })
        }
    }
</script>


<style>
    .tags {
        position: relative;
        height: 37px;
        overflow: hidden;
        background: #fff;
        padding-right: 120px;
        box-shadow: 0 5px 10px #ddd;
    }
    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }
    .tags-li {
        float: left;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        border: 1px solid #e9eaec;
        background: #fff;
        padding: 0 5px 0 12px;
        vertical-align: middle;
        color: #666;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }
    .tags-li:not(.active):hover {
        background: #f8f8f8;
    }
    .tags-li a{
        text-decoration: none;
    }
    .tags-li.active {
        border: 1px solid #409EFF;
        background-color: #409EFF;
    }
    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
    }
    .tags-li.active .tags-li-title {
        color: #000;
    }
    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 40px;
        background: #fff;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }
</style>