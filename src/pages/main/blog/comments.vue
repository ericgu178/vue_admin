<template>
  <div>
    <a-table :columns="columns" :dataSource="data" bordered  @change="handleTableChange">
        <h4 slot="name"  slot-scope="text" href="javascript:;">{{text}}</h4>
        <span slot="handle" slot-scope="text, record">
            <a-popconfirm title="是否审核通过或不通过" @confirm="adopt(record.id,record.blog_article_id,record.status)" okText="是" cancelText="否">
                <a-button v-if="record.check" type="primary">审核通过</a-button>
                <a-button v-if="!record.check" type="danger">取消通过</a-button>
            </a-popconfirm>
            <!-- <a-divider type="vertical" /> -->
          <!-- <a-popconfirm title="你是否" @confirm="deleted(record.id)" @cancel="cancel" okText="是" cancelText="否">
          <a-button type="danger">删除</a-button> -->
          <!-- </a-popconfirm> -->
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
  title: '文章标题',
  dataIndex: 'link_article.blog_title',
  width: 250,
}, {
  title: '评论内容',
  dataIndex: 'comment_content',
  width: 250,
}, {
  title: 'ip',
  dataIndex: 'ip',
  width: 150,
}, {
  title: '状态',
  dataIndex: 'statusText',
  width: 80,
}, {
  title: '评论时间',
  dataIndex: 'create_time',
  width: 160,
}, {
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
        this.$http({
            method: 'Get',
            url: `${this.HOST}/admin/article/commentsList`,
            dataType:"json",
        }).then(res=>{
          this.data = res.data
          this.data.filter(item=>{
              item.check = item.status == 0 ? true : false
              item.statusText = item.status == 0 ? "未通过" : "通过"
          })
        }).catch(err=>{
          console.log(err)
        })
  },
  methods: {
      adopt:function(id,blog_article_id,status){
          this.$http({
            method: 'Post',
            url: `${this.HOST}/admin/article/isComment`,
            data:{
                id:id,
                blog_article_id:blog_article_id,
                status:status = status == 0 ? 1 : 0
            },
            dataType:"json",
        }).then(res=>{
          if (res.data.code == 0 ) {
            this.data.filter(item=>{
                if (item.id == id) {
                  item.check = res.data.status == 0 ? true : false
                  item.statusText = res.data.status == 0 ? "未通过" : "通过"
                  item.status = res.data.status
                }
            })
            this.reload()
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      deleted:function(id){
        console.log(id)
        this.data.filter(item=>{
          if (item.id == id) {
            let del = this.data.indexOf(item)
            if (del!=-1){
                this.data.splice(del,1)
                this.$message.success("删除成功")
            }
          }
        })
      },
      handleTableChange (pagination, filters, sorter) {
        console.log(pagination);
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