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
			<div style="width:700px;float:left;margin-top:10px;margin-right:20px">
				<a-textarea placeholder='格式如下
请以方括号[]或者花括号{}开始结束
[{"nav_name":"test","category_id":"categoryProductId1","products":[{"id":11,"goods_name":"829日优惠券商品1","stock":10,"end_effective_time":2147483647,"start_effective_time":0,"purchase_num":10,"agreement":"这是一件自动退款的商品","instructions":"看清楚了再买","goods_pid":27,"skus":[{"goods_spec_id":47,"biz":2333,"shelves_goods_id":46,"property":"22","property_name":[""],"goods_sn":"00001","cost_integral":20,"cost_price":5,"market_integral":1,"market_price":0.01,"goods_number":10,"stock_number":10,"stock_lock":0,"create_time":1567244420,"update_time":1567244420,"delete_time":0,"name_str":"","stock":10}],"sku":[],"property_status":0,"freight_id":0,"original_price":5,"original_integral":20,"market_price":0.01,"market_integral":1,"buy_limit":3,"imgs":[{"id":393,"filepath":"https:\/\/oss.xinliu.org\/uploads\/20190829\/image190829134530566.png"}]}]}]' :rows="40" v-model="form.beforeData"/>
			</div>
      		<div style="width:50px;float:left;margin:20% auto;">
        		<a-button type="primary" @click="toArray">转换成直接可用数组</a-button>
    			<a-button style="margin-top:10px" @click="copy" v-if="form.visable">复制可用数组</a-button>
				<a-button style="margin-top:10px" @click="form.visable = false;form.beforeData = '';form.afterData = ''" v-if="form.visable">清空全部</a-button>
			</div>
			<div style="width:750px;float:left;margin-left:130px;margin-top:10px;" v-if="form.visable">
        		<pre>{{form.afterData}}</pre>
			</div>
		</template>
	</div>
</template>
<script>
export default {
	data () {
    	return {
      		index: 'php',
      		form:{
      		    beforeData:'',
				afterData:``,
				visable:false
      		},
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
		},
		toArray:function() {
			try {
				var b = JSON.parse(this.form.beforeData)
			} catch (error) {
        		this.$message.error('请填写正确的的json数据')
        		return;
			}
			this.request.request_post(
				`${this.request.base_url}/admin/tool/jsonToArray`,
				res=>{
          			this.form.visable = true
					this.form.afterData = res.data.data
				},e=>{
					this.$message.error('网络错误')
				},
				{before:JSON.stringify(b)}
			)
		},
		copy:function() {
			var oInput = document.createElement("textarea");
            oInput.value = this.form.afterData;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = "oInput";
            oInput.style.display = "none";
            this.$message.success("复制成功");
		}
	}
}
</script>
<style>
</style>
