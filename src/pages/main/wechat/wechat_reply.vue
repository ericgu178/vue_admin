<template>
  <div>
    <a-table :columns="columns" :dataSource="data" bordered  @change="handleTableChange">
        <h4 slot="name"  slot-scope="text" href="javascript:;">{{text}}</h4>
        <span slot="handle" slot-scope="text, record">
            <a-button type="primary" @click="edit(record)">编辑</a-button>
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
    title: '关键词',
    dataIndex: 'receive_content',
    width: 150,
}, {
    title: '回复类型',
    dataIndex: 'reply_type',
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
        }
    },
    created(){
        this.request.request_get(
            `${this.request.base_url}/wechat_admin/wechat_reply/get`,
            res=>{
                this.data = res.data.data
  	        },err=>{
  	            this.$message.error('网络错误')
  	        }
        )
    },
    methods: {
        handleTableChange:function(e) {
            console.log(e)
        },
        edit:function(data) {
            console.log(data)
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