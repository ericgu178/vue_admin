<!--
 * @User: EricGU178
 * @Date: 2019-02-19 11:52:25
 * @LastEditors: EricGU178
 * @LastEditTime: 2019-02-22 10:45:14
 * @温馨提示: 代码千万行 注释第一行 命名不规范 同事^ ^
 * @主视图组件
 -->

<template>
    <div class="wrapper">
        <vHead></vHead>
        <vSidebar></vSidebar>
        <div class="content-box" :class="{'content-collapse':isColl}">
            <vTags></vTags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                      <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bars from './bars';
export default {
    data(){
        return {
            tagsList: [],
            isColl:false
        }
    },
    components:{
            vHead,vSidebar,vTags
    },
    created(){
        bars.$on('isColl', msg => {
            this.isColl = msg;
        })
        bars.$on('tags', msg => {
            let arr = [];
            for(let i = 0, len = msg.length; i < len; i ++){
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        })
    }
}
</script>



