<template>
  <div>
	<a-button type="primary" size="large" @click="visible = true;form = {};is_add=true;title='添加关键词'" style="margin-top:10px;margin-bottom:20px;">添加关键词</a-button>
    <a-table :columns="columns" :dataSource="data" bordered :pagination="pagination"  @change="handleTableChange">
        <h4 slot="name"  slot-scope="text" href="javascript:;">{{text}}</h4>
        <span slot="handle" slot-scope="text, record">
            <a-button type="primary" @click="edit(record)">编辑</a-button>
        </span>
    </a-table>
	<a-modal
            :title="title"
            v-model="visible"
            okText = '保存'
            cancelText = '取消'
            @ok="edit_truly(is_add)"
        >
        <a-form>
            <a-form-item label="关键词" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
                <a-input type="text" v-model = "form.receive_content" placeholder="请输入关键词"/>
            </a-form-item>
            <a-form-item label="回复类型" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
      			<a-radio-group v-model = "form.reply_type">
      			  	<a-radio :value="0">文本消息</a-radio>
      			  	<a-radio :value="1">图片消息</a-radio>
      			  	<a-radio :value="2">语音消息</a-radio>
      			</a-radio-group>
    		</a-form-item>
			<a-form-item label="回复内容" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
                <a-input type="text" v-model = "form.reply_content" placeholder="请输入回复内容"/>
            </a-form-item>
        </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [{
    title: 'ID',
    dataIndex: 'id',
    width: 60,
}, {
    title: '关键词',
    dataIndex: 'receive_content',
    width: 150,
}, {
    title: '回复类型',
    dataIndex: 'reply_type_status',
    width: 150,
}, {
    title: '回复内容',
    dataIndex: 'reply_content',
    width: 250,
}, {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 200,
}, {
    title: '更新时间',
    dataIndex: 'update_time',
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
			visible:false,
			form:[],
      		is_add:false,
			title:'添加关键词',
			// 分页
			pagination:{
        defaultPageSize:1,
        total:20
			},
        }
    },
    created(){
        this.request.request_get(
            `${this.request.base_url}/wechat_admin/wechat_reply/get`,
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
            	`${this.request.base_url}/wechat_admin/wechat_reply/get?page=${el.current}`,
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
        edit:function(data) {
			this.visible = true
			this.form = data
      		this.is_add = false
      		this.title = `修改关键词：${data.receive_content}`
		},
		edit_truly:function(is) {
			if (is) {
				var url = `${this.request.base_url}/wechat_admin/wechat_reply/add`
			} else {
				var url = `${this.request.base_url}/wechat_admin/wechat_reply/edit`
			}
			this.request.request_post(
				url,
            	res=>{
            	    this.$message.success(res.data.msg)
            	    setTimeout(()=>{
				        this.reload();
		    	    },1000)
  	        	},err=>{
  	        		this.$message.error('网络错误')
				},
				this.form
			)

			this.visible = false;
		}
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
