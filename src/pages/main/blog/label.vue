<template>
  <div>
    <a-card title="标签管理" :bordered="false">
      <a-button style="margin-bottom:10px" type="primary" @click="showAdd">添加标签</a-button>
      <a-table :columns="columns" :dataSource="data" bordered :loading="tableLoading">
        <template
          v-for="col in ['label_name', 'color']"
          :slot="col"
          slot-scope="text, record, index"
        >
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
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a-button type="primary" size="small" @click="() => save(record.id)">保存</a-button>
              <a-popconfirm
                title="你确定？"
                @confirm="() => cancel(record.id)"
                okText="确定"
                cancelText="取消"
              >
                <a-button size="small">取消</a-button>
              </a-popconfirm>
            </span>
            <span v-else>
              <a-button type="primary" @click="() => edit(record.id)" size="small">编辑</a-button>
              <a-button
                v-if="record.status==1"
                @click="() => status(record.id,record.status)"
                size="small"
              >开启</a-button>
              <a-button
                type="danger"
                v-if="record.status==0"
                @click="() => status(record.id,record.status)"
                size="small"
              >禁用</a-button>
            </span>
          </div>
        </template>
      </a-table>
    </a-card>
    <!-- 模态框 -->
    <a-modal title="添加标签" v-model="visible" onOk="labelAdd">
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="labelAdd">保存</a-button>
      </template>
      <a-input
        style="margin-top:10px"
        addonBefore="标签名称"
        v-model="label.label_name"
        placeholder="请填写标签名称"
      ></a-input>
      <a-input style="margin-top:10px" addonBefore="标签颜色" v-model="label.color">
        <colorPicker slot="addonAfter" v-model="label.color"></colorPicker>
      </a-input>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 60,
  },
  {
    title: "标签名称",
    dataIndex: "label_name",
    width: 150,
    scopedSlots: { customRender: "label_name" },
  },
  {
    title: "颜色",
    dataIndex: "color",
    width: 100,
    scopedSlots: { customRender: "color" },
  },
  {
    title: "状态",
    dataIndex: "statusText",
    width: 80,
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
    width: 200,
  },
  {
    title: "最后修改时间",
    dataIndex: "update_time",
    width: 200,
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
import { tagsIndex, tagsAdd, tagsUpdate, tagsSetStatus } from "@/api/index";
export default {
  inject: ["reload"],
  data() {
    return {
      data: [],
      columns,
      cacheData: [],
      visible: false,
      loading: false,
      tableLoading: true,
      label: {
        color: "#000000",
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let result = await tagsIndex();
      this.tableLoading = false;
      this.data = result;
      this.data.filter((item) => {
        item.statusText = item.status == 0 ? "开启" : "禁用";
      });
      this.cacheData = this.data.map((item) => ({ ...item }));
    },
    // 实现实时数据变化
    handleChange(value, id, column) {
      const newData = [...this.data];
      const target = newData.filter((item) => id === item.id)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    // 点击修改
    edit(id) {
      const newData = [...this.data];
      const target = newData.filter((item) => id === item.id)[0];
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    // 保存
    async save(id) {
      const newData = [...this.data];
      const target = newData.filter((item) => id === item.id)[0];

      const commitData = {
        id: id,
        label_name: target.label_name,
        color: target.color,
      };
      let result = await tagsUpdate(commitData);
      if (result.code > 0) {
        this.$message.error(result.msg);
      } else {
        delete target.editable;
        this.data = newData;
        this.cacheData = newData.map((item) => ({ ...item }));
        this.$message.success(result.msg);
      }
    },
    // 点击取消
    cancel(id) {
      const newData = [...this.data];
      const target = newData.filter((item) => id === item.id)[0];
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter((item) => id === item.id)[0]
        );
        delete target.editable;
        this.data = newData;
      }
    },
    async status(id, status) {
      let result = await tagsSetStatus({
        id: id,
        status: status == 0 ? 1 : 0,
      });
      if (result.code > 0) {
        this.$message.error(result.msg);
      } else {
        this.$message.success(result.msg);
        this.reload();
      }
    },
    showAdd() {
      this.visible = true;
    },
    // 添加
    async labelAdd() {
      this.loading = true;
      let result = await tagsAdd(this.label);
      this.loading = false;
      this.visible = false;
      if (result.code > 0) {
        this.$message.error(result.msg);
      } else {
        this.$message.success(result.msg);
        this.reload();
      }
    },
  },
};
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
  color: #000;
}
.box {
  width: 210px;
  z-index: 9999999;
}
</style>

