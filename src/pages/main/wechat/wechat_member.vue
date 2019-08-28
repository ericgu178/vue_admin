<template>
  	<div>
      	<a-progress :percent="percent" :style="`display:${show_progress}`"/>
  		<a-button type="primary" @click="syncMember" size="large" style="margin-top:10px;margin-bottom:20px;">同步会员</a-button>
  	  	<a-table :columns="columns" :dataSource="data" bordered :pagination="pagination"  @change="handleTableChange">
  	      	<h4 slot="name"  slot-scope="text" href="javascript:;">{{text}}</h4>
  	      	<template slot="image" slot-scope="image">
  	      	  <img :src="image" style="width:50px;height:50px" />
  	      	</template>
  	      	<span slot="handle" slot-scope="text, record">
  	      	    <!-- <a-button type="primary" @click="edit(record)">编辑</a-button> -->
  	      	</span>
  	  	</a-table>
  	</div>
</template>
<script>
const columns = [{
    title: 'ID',
    dataIndex: 'id',
    width: 60,
}, {
    title: '头像',
    dataIndex: 'wechat_headimgurl',
    scopedSlots: { customRender: 'image' },
    align:'center',
    width: 150,
}, {
    title: '用户昵称',
    dataIndex: 'member_nickname',
    width: 150,
}, {
    title: '性别',
    dataIndex: 'member_sex',
    width: 150,
}, {
    title: 'openid',
    dataIndex: 'wechat_openid',
    width: 250,
}, {
    title: '地区',
    dataIndex: 'area',
    width: 200,
}, {
    title: '是否关注',
    dataIndex: 'is_subscribe_text',
    width: 100,
}, {
    title: '关注时间',
    dataIndex: 'subscribe_time',
    width: 200,
},{
    title: '操作',
    dataIndex : "handle",
    scopedSlots: { customRender: 'handle' },
}];
export default {
    inject: ['reload'],
    data() {
        return {
            data:[],
            columns,
			// 分页
			pagination:{
        		defaultPageSize:1,
        		total:20
			},
			// process
      		show_progress:'none',
      		percent:0,
        }
    },
    created(){
        this.request.request_get(
            `${this.request.base_url}/wechat_admin/wechat_member/get`,
            res=>{
                this.data = res.data.data
                this.pagination = {
					total:parseInt(res.data.paginate.count),
					current:parseInt(res.data.paginate.page),
					pageSize:parseInt(res.data.paginate.pageSize),
					defaultPageSize:parseInt(res.data.paginate.pageSize)
                }
  	        },err=>{
  	            this.$message.error('网络错误')
  	        }
        )
    },
    methods: {
        handleTableChange:function(el) {
            this.request.request_get(
            	`${this.request.base_url}/wechat_admin/wechat_member/get?page=${el.current}`,
            	res=>{
                	this.data = res.data.data
                	this.pagination = {
						total:parseInt(res.data.paginate.count),
						current:parseInt(res.data.paginate.page),
						pageSize:parseInt(res.data.paginate.pageSize),
						defaultPageSize:parseInt(res.data.paginate.pageSize)
                	}
  	        	},err=>{
  	            	this.$message.error('网络错误')
  	        	}
        	)
		},
		syncMember () {
      		this.show_progress = 'block'
			var n = 0, timer = setInterval(()=>{
                n = n + Math.random()*10|0;
                if(n>90){
                  	n = 90;
                  	return false;
				}
				this.percent = n
            }, 2800+Math.random()*1000);
			this.request.request_get(
				`${this.request.base_url}/wechat_admin/wechat_member/syncMember`,
				response=>{
					this.percent = 100
					clearInterval(timer)
					setTimeout(()=>{
						this.$message.info(response.data.msg)
						this.show_progress = 'none'
						this.percent = 0
					},1000)
				},error=>{
					this.percent = 100
					clearInterval(timer)
					setTimeout(()=>{
						this.$message.error('网络错误')
						this.show_progress = 'none'
						this.percent = 0
					},1000)
				}
			)
		},
	}
}
</script>
<style>
th.column-money,
td.column-money {
    text-align: right !important;
}
.components-input-demo-size .ant-input {
    width: 200px;
    margin: 0 8px 8px 0;
}
.ant-table-tbody tr {
    background: #ffffff;
    color:#000;
}
</style>
