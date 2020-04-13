<template>
  <div>
	<!-- <a-button type="primary" size="large" @click="visible = true;" style="margin-top:10px;margin-bottom:20px;">添加账户</a-button> -->
    <a-card title="账户管理" :bordered="false">
        <a-table :loading="tableLoading" :columns="columns" :dataSource="data" bordered :pagination="pagination"  @change="handleTableChange">
            <h4 slot="name"  slot-scope="text" href="javascript:;">{{text}}</h4>
            <span slot="handle" slot-scope="text, record">
                <a-button type="primary" v-if="record.status == 0 && current_login_account != record.username" @click="switchStatus(record.id)">恢复</a-button>
		    	<a-button type="danger" v-if="record.status == 1 && current_login_account != record.username" @click="switchStatus(record.id)">禁用</a-button>
            </span>
        </a-table>
    </a-card>
  </div>
</template>
<script>
const columns = [{
    title: 'ID',
    dataIndex: 'id',
    width: 60,
}, {
    title: '账户名称',
    dataIndex: 'username',
    width: 150,
}, {
    title: '状态',
    dataIndex: 'status_text',
    width: 150,
}, {
    title: '最后登录时间',
    dataIndex: 'last_time',
    width: 250,
}, {
    title: '创建时间',
    dataIndex: 'create_time',
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
			form:[],
			// 分页
			pagination:{
        		defaultPageSize:1,
        		total:20
			},
            current_login_account:'admin',
            tableLoading:true
        }
    },
    created(){
        this.request.request_get(
            `${this.request.base_url}/admin/account/get`,
            res=>{
                this.tableLoading = false;
                this.data = res.data.data
                this.pagination = {
					total:parseInt(res.data.paginate.count),
					current:parseInt(res.data.paginate.page),
					pageSize:parseInt(res.data.paginate.pageSize),
					defaultPageSize:parseInt(res.data.paginate.pageSize)
                }
  	        },err=>{
                this.tableLoading = false;
  	            this.$message.error('网络错误')
  	        }
		)
		var userinfo = JSON.parse(localStorage.getItem('userinfo'))
		this.current_login_account = userinfo.username
    },
    methods: {
        handleTableChange:function(el) {
            this.request.request_get(
            	`${this.request.base_url}/admin/account/get?page=${el.current}`,
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
		switchStatus:function(id) {
			this.request.request_post(
            	`${this.request.base_url}/admin/account/switchStatus`,
            	res=>{
                  this.$message.success(res.data.msg)
                  setTimeout(()=>{
					  this.reload();
				  },1000)
  	        	},err=>{
  	            	this.$message.error('网络错误')
				},
				{id:id}
        	)
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
