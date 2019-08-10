<template>
  <div>
    <router-link to="/article">
        <a-button size="large" style="margin-bottom:10px;background:skyblue">写文章</a-button>
    </router-link>
    <a-table :columns="columns" :dataSource="data" bordered  @change="handleTableChange">
        <h4 slot="name"  slot-scope="text" href="javascript:;">{{text}}</h4>
        <span slot="handle" slot-scope="text, record">
          <a-popconfirm title="你是否要删除这篇文章？" @confirm="deleted(record.id)" @cancel="cancel" okText="是" cancelText="否">
          <a-button type="danger">删除</a-button>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-popconfirm title="你是否要执行此次操作？" @confirm="setBanner(record.id,record.isBanner)" @cancel="cancel" okText="是" cancelText="否">
          <a-button v-if="record.isBanner == 0" type="primary">设为轮播图</a-button>
          <a-button v-if="record.isBanner == 1" type="danger">取消轮播图</a-button>
          <a-button v-if="record.isBanner == 2">恢复轮播图</a-button>
          </a-popconfirm>
        </span>
        <template slot="title" slot-scope="currentPageData">
            <div class="components-input-demo-size">
              <a-input placeholder="请输入标题搜索内容" v-model="input" size="large"/>
              <a-button type="primary" @click="search()" icon="search" size="large">搜索</a-button>
             </div>
        </template>
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
  dataIndex: 'blog_title',
  width: 150,
}, {
  title: '部分内容',
  dataIndex: 'blog_describe',
  width: 600,
}, {
  title: '创建时间',
  dataIndex: 'create_time',
  width: 160,
}, {
  title: '操作',
  dataIndex : "handle",
  scopedSlots: { customRender: 'handle' },
}];
export default {
  data() {
    return {
      data:[],
      columns,
      input:''
    }
  },
  created(){
        this.$http({
            method: 'Get',
            url: `${this.HOST}/admin/article/index`,
            dataType:"json",
        }).then(res=>{
          this.data = res.data
        }).catch(err=>{
          console.log(err)
        })
  },
  methods: {
      search(){
        this.$http({
            method: 'Post',
            url: `${this.HOST}/admin/article/index`,
            dataType:"json",
            data:{search:this.input}
        }).then(res=>{
          this.data = res.data
        }).catch(err=>{
          console.log(err)
        })
        
      },
      deleted:function(id){
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
      setBanner:function(id,isbanner){
        this.$http({
            method: 'Post',
            url: `${this.HOST}/admin/article/setBanner`,
            dataType:"json",
            data:{
              id:id,
              isbanner:isbanner
            }
        }).then(res=>{
           this.$message.success(res.data.msg)
           this.search()
        }).catch(err=>{
          console.log(err)
        })
      },
      handleTableChange (pagination, filters, sorter) {
        console.log(pagination);
      },
      confirm (e) {
        // console.log(e)
        // this.$message.success('Click on Yes')
      },
      cancel (e) {
        // console.log(e)
        // this.$message.error('')
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