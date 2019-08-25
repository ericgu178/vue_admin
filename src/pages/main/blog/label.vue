<template>
  <div>
    <a-button style="margin-bottom:10px" type="primary" @click="showAdd">添加标签</a-button>
    <a-table :columns="columns" :dataSource="data" bordered>
      <template v-for="col in ['label_name', 'color']" :slot="col" slot-scope="text, record, index">
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.id, col)"
          />
          <template v-else>{{text}}</template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class='editable-row-operations'>
          <span v-if="record.editable">
            <a-button type="primary" @click="() => save(record.id)">保存</a-button>
            <a-popconfirm title='你确定？' @confirm="() => cancel(record.id)" okText="确定" cancelText="取消">
              <a-button>取消</a-button>
            </a-popconfirm>
          </span>
          <span v-else>
            <a-button type="primary" @click="() => edit(record.id)">编辑</a-button>
            <a-button v-if="record.status==1" @click="() => status(record.id,record.status)">开启</a-button>
            <a-button type="danger" v-if="record.status==0" @click="() => status(record.id,record.status)">禁用</a-button>
          </span>
        </div>
      </template>
    </a-table>

    <!-- 模态框 -->

    <a-modal
      title="添加标签"
      v-model="visible"
      onOk="labelAdd"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="labelAdd">保存</a-button>
      </template>
      <a-input style="margin-top:10px" addonBefore="标签名称" v-model="label.label_name" placeholder="请填写标签名称"></a-input>
      <a-input style="margin-top:10px" addonBefore="标签颜色"   v-model="label.color">
          <colorPicker slot="addonAfter" v-model="label.color"></colorPicker>
      </a-input>
    </a-modal>
  </div>
</template>
<script>

const columns = [{
    title: 'ID',
    dataIndex: 'id',
    width: 60,
},  {
    title: 'label_name',
    dataIndex: 'label_name',
    width: 150,
    scopedSlots: { customRender: 'label_name' },
}, {
    title: 'color',
    dataIndex: 'color',
    width: 200,
    scopedSlots: { customRender: 'color' },
}, {
    title: '状态',
    dataIndex: 'statusText',
    width: 150,
}, {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 160,
}, {
    title: '操作',
    dataIndex : "operation",
    scopedSlots: { customRender: 'operation' },
}];
export default {
    inject:  ['reload'],
    data () {
        return {
            data:[],
            columns,
            cacheData:[],
            visible:false,
            loading: false,
            label:{
                color:'#000000'
            },
        }
    },
    created(){
        this.request.request_get(
            `${this.HOST}/admin/tags/index`,
            res=>{
                this.data = res.data
                this.data.filter(item=>{
                    item.statusText = item.status == 0 ? "开启" : "禁用"
                })
                this.cacheData = this.data.map(item => ({ ...item }))
            },
            err=>{
                this.$message.error('网络错误')
            })
    },
    methods: {
        // 实现实时数据变化
        handleChange (value, id, column) {
            const newData = [...this.data]
            const target = newData.filter(item => id === item.id)[0]
            if (target) {
                target[column] = value
                this.data = newData
            }
        },
        // 点击修改
        edit (id) {
            const newData = [...this.data]
            const target = newData.filter(item => id === item.id)[0]
            if (target) {
                target.editable = true
                this.data = newData
            }
        },
        // 保存
        save (id) {
            const newData = [...this.data]
            const target = newData.filter(item => id === item.id)[0]
    
            const commitData = {
                label_name:target.label_name,
                color:target.color
            }
            if (target) {
                this.$http({
                    method: 'Post',
                    url: `${this.HOST}/admin/tags/edit?id=${id}`,
                    dataType:"json",
                    data:commitData
                }).then(res=>{
                    if (res.data.code>0) {
                        this.$message.error(res.data.msg)
                    } else {
                        delete target.editable
                        this.data = newData
                        this.cacheData = newData.map(item => ({ ...item }))
                        this.$message.success(res.data.msg)
                    }         
                }).catch(err=>{
                    console.log(err)
                })
            }
        },
        // 点击取消
        cancel (id) {
            const newData = [...this.data]
            const target = newData.filter(item => id === item.id)[0]
            if (target) {
                Object.assign(target, this.cacheData.filter(item => id === item.id)[0])
                delete target.editable
                this.data = newData
            }
        },
        status (id,status) {
            this.$http({
                method: 'Post',
                url: `${this.HOST}/admin/tags/setStatus`,
                dataType:"json",
                data:{
                    id:id,
                    status:status == 0 ? 1 : 0
                }
            }).then(res=>{
                if (res.data.code>0) {
                    this.$message.error(res.data.msg)
                } else {
                    this.$message.success(res.data.msg)
                    this.reload()
                }         
            }).catch(err=>{
                console.log(err)
            })
        },
        showAdd () {
            this.visible = true
        },
        // 添加
        labelAdd () {
            this.loading = true
            this.$http({
                method: 'Post',
                url: `${this.HOST}/admin/tags/add`,
                dataType:"json",
                data:this.label
            }).then(res=>{
                this.loading = false
                this.visible = false
                if (res.data.code>0) {
                    this.$message.error(res.data.msg)
                } else {
                    this.$message.success(res.data.msg)
                    this.reload()
                }         
            }).catch(err=>{
                this.loading = false
                this.$message.error('网络错误')
            })
        }
    },
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
th.column-money,
td.column-money {
  text-align: right !important;
}
.components-input-demo-size .ant-input {
  width: 200px;
  margin: 0 8px 8px 0;
}
.ant-table-tbody tr {
  background: #23ffff;
  color:#000;
}
</style>

