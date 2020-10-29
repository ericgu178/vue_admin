<template>
  <div>
    <a-card title="文章管理" :bordered="false">
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :scroll="{x:1710}"
        bordered
        @change="handleTableChange"
        :loading="tableLoading"
      >
        <h4 slot="name" slot-scope="text" href="javascript:;">{{text}}</h4>
        <span slot="handle" slot-scope="text, record">
          <a-button type="primary" @click="edit(record)" size="default">编辑</a-button>
          <a-popconfirm
            title="你是否要执行此次操作？"
            @confirm="setBanner(record.id,record.isBanner)"
            @cancel="cancel"
            okText="是"
            cancelText="否"
          >
            <a-button v-if="record.isBanner == 0" size="default" type="primary">设为轮播图</a-button>
            <a-button v-if="record.isBanner == 1" size="default" type="danger">取消轮播图</a-button>
            <a-button v-if="record.isBanner == 2" size="default">恢复轮播图</a-button>
          </a-popconfirm>
          <a-button
            size="default"
            @click="updateState(record)"
            v-show="record.state == 1"
            type="danger"
          >开放观看</a-button>
          <a-button
            size="default"
            @click="updateState(record)"
            v-show="record.state == 0"
            type="primary"
          >关闭开放</a-button>
          <a-popconfirm
            title="你是否要删除这篇文章？"
            @confirm="deleted(record.id)"
            @cancel="cancel"
            okText="是"
            cancelText="否"
          >
            <a-button size="default" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
        <template slot="title" slot-scope="currentPageData">
          <div class="components-input-demo-size">
            <a-input placeholder="请输入标题搜索内容" v-model="input" size="large" />
            <a-button type="primary" @click="search()" icon="search" size="large">搜索</a-button>
            <router-link to="/article">
              <a-button size="large" style="background:#fff;margin-left:10px;" icon="edit">写新文章</a-button>
            </router-link>
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
const columns = [{  title: "ID",  dataIndex: "id",  width: 60},
    { title: "文章标题",  dataIndex: "blog_title",  width: 300,},
    { title: "部分内容",  dataIndex: "blog_describe",  width: 600},
    { title: "阅读量",  dataIndex: "reads",  width: 100},
    { title: "评论数",  dataIndex: "comments",  width: 100},
    { title: "创建时间",dataIndex: "create_time",width: 200},
    { title: "操作",dataIndex: "handle",fixed: "right",width: 450,scopedSlots: { customRender: "handle" }},
];
import { getArticle, setBanner,updateArticleState  } from "@/api/index";
export default {
  inject: ["reload"],
  data() {
    return {
      data: [],
      columns,
      input: "",
      tableLoading: true,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0, // 总数，必须先有
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.pagination.current = current;
          this.getList(current);
        },
      },
    };
  },
  created() {},
  methods: {
    async init() {
        let result = await getArticle();
        this.tableLoading = false;
        result.data.filter(item=>{
            item.key = item.id
        })
        this.data = result.data;
        this.pagination.total = result.total;
        this.pagination.current = result.page;
    },
    async getList(page) {
        this.tableLoading = true;
        let result = await getArticle({
            page: page,
            search: this.input,
        });
        this.tableLoading = false;
        result.data.filter(item=>{
            item.key = item.id
        })
        this.data = result.data;
        this.pagination.total = result.total;
        this.pagination.current = result.page;
    },
    async search() {
        this.tableLoading = true;
        let result = await getArticle({ search: this.input });
        result.data.filter(item=>{
            item.key = item.id
        })
        this.tableLoading = false;
        this.data = result.data;
        this.pagination.total = result.total;
        this.pagination.current = result.page;
    },
    deleted: function (id) {
      this.data.filter((item) => {
        if (item.id == id) {
          let del = this.data.indexOf(item);
          if (del != -1) {
            this.data.splice(del, 1);
            this.$message.success("删除成功");
          }
        }
      });
    },
    async setBanner(id, isbanner) {
        let result = await setBanner({id: id,isbanner: isbanner});
        this.$message.success(result.msg);
        this.search();
    },
    handleTableChange(pagination, filters, sorter) {
        console.log(pagination);
    },
    confirm(e) {},
    cancel(e) {},
    edit: function (article) {
        return this.$router.push({ path: '/edit_article',query: { article: JSON.stringify(article)} });
    },
    // 状态修改
    async updateState(record) {
        let res = await updateArticleState({id:record.id});
        if (res.code == 0) {
            this.$message.success(res.msg);
        } else {
            this.$message.error(res.msg);
        }
        this.search();
    },
  },
  mounted() {
    this.init();
  },
};
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
  color: #000;
}
</style>
