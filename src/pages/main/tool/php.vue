<template>
	<div>
	  	<a-menu v-model="current" mode="horizontal">
			<template v-for="item in items">
            	<template v-if="item.subs">
            	    <a-sub-menu :key="item.index">
            	        <span slot="title"><a-icon :type="item.icon" /><span>{{ item.title }}</span></span>
            	        <a-menu-item v-for="sub in item.subs" :key="sub.index" v-on:click="titleClick(sub.index)">
            	            <a-icon :type="sub.icon" />{{ sub.title }}
            	        </a-menu-item>
            	    </a-sub-menu>
            	</template>
            	<template v-else>
            	    <a-menu-item  :key="item.index" v-on:click="titleClick(item.index)">
            	        <a-icon :type="item.icon" /><span>{{item.title}}</span>
            	    </a-menu-item>
            	</template>
        	</template>
	  	</a-menu>

      	<!-- 下方展示 -->
		<template v-if="'json_decode_to_string' == index">
			<div style="width:700px;background:#0f0;float:left">
asd
			</div>
			<div style="width:700px;background:#0ff;float:left;margin-left:20px;">
asd
			</div>
		</template>
	</div>
</template>
<script>
export default {
	data () {
    	return {
			index: 'php',
			items: [{
				icon: 'tool',
				index: 'tool',
                title: '工具',
                subs: [{
                    icon:'area-chart',
                    index: 'json_decode_to_string',
                    title: 'json转可直接输出数组'
                },{
					icon:'area-chart',
                    index: 'asd',
                    title: 'asd'
				}]
            },{
                icon: 'wechat',
                index: 'wechat',
                title: '微信',
                subs: [{
					icon:'setting',
					index: 'config',
					title: '微信配置管理'
				}],
            }]
    	}
  	},
	created() {

	},
	methods:{
		titleClick:function(index) {
			this.index = index
		}
	}
}
</script>
<style>
</style>
