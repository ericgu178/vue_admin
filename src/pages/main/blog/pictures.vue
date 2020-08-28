<template>
  <div>
    <a-card title="标签管理" :bordered="false">
      <a-button style="margin-bottom:10px" type="primary" @click="showAdd">添加相册</a-button>
      <a-table :columns="columns" :dataSource="data" bordered :loading="tableLoading">
        <img slot="imgr" width="100" slot-scope="text" :src="text"/>
        <template slot="operation" slot-scope="text, record, index">
            <a-button type="primary" @click="edit(record)">编辑</a-button>
            <a-button type="primary" @click="oupload(record)">上传图片</a-button>
            <a-button type="primary" v-if="record.link_image.length != 0" @click="viewImg(record)">查看图片</a-button>
        </template>
      </a-table>
    </a-card>
    <!-- 模态框 -->
    <a-modal title="添加相册" v-model="visible">
        <template slot="footer">
            <a-button key="submit" type="primary" :loading="loading" @click="save">保存</a-button>
        </template>
        <a-form-model :model="addform" :label-col="{span:4}" :wrapper-col="{span:16}">
            <a-form-model-item label="相册名称">
                <a-input v-model="addform.picture_title" />
            </a-form-model-item>
            <a-form-model-item label="相册封面">
                <a-upload
                    name="file"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    :action="upload"
                    @change="handleChange"
                >
                    <img v-if="imageUrl" width="200"  :src="imageUrl" alt="avatar" />
                    <div v-else>
                        <a-icon :type="fenmianloading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                            上传
                        </div>
                    </div>
                </a-upload>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
    <!-- 编辑图片 -->
    <a-modal title="编辑相册" v-model="editModal" @cancel="imageUrl = '';editModal = false">
        <template slot="footer">
            <a-button key="submit" type="primary" :loading="loading" @click="pictureSave">保存</a-button>
        </template>
        <a-form-model :model="editform" :label-col="{span:4}" :wrapper-col="{span:16}">
            <a-form-model-item label="相册名称">
                <a-input v-model="editform.picture_titles" />
            </a-form-model-item>
            <a-form-model-item label="相册封面">
                <a-upload
                    name="file"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    :action="upload"
                    @change="handleChange"
                >
                    <img v-if="imageUrl" width="200"  :src="imageUrl" alt="avatar" />
                    <div v-else>
                        <a-icon :type="fenmianloading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                            上传
                        </div>
                    </div>
                </a-upload>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
    <!-- 查看图片 -->
    <a-modal :title="viTitle" width="500" v-model="viewImgModel">
        <div style="display:flex;">
        <a-card hoverable style="width: 240px;height:100%;margin:10px;" :key="index" v-for="(item,index) in viewImgData">
            <img
                slot="cover"
                :alt="item.image_path"
                :src="item.image_path"
            />
        </a-card>
        </div>
        <template slot="footer">
            <a-button key="submit" type="primary" :loading="loading" @click="viewImgModel = false">关闭</a-button>
        </template>
    </a-modal>
    <!-- 上传图片 -->
    <a-modal title="上传图片" width="500" v-model="uploadModel">
        <div style="display:flex;">
            <a-upload
                :action="upload"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                @change="handleChangeImages"
            >
            <div v-if="fileList.length < 8">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                    上传
                </div>
            </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
                <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
        </div>
        <template slot="footer">
            <a-button key="submit" type="primary" :loading="loading" @click="saveImg">保存</a-button>
        </template>
    </a-modal>
  </div>
</template>
<script>
const columns = [
    {title: "ID",dataIndex: "id",width: 60,},
    {title: "相册标题",dataIndex: "picture_title",width: 150,align:'center'},
    {title: "封面",dataIndex: "picture_url",width: 100,align:'center',scopedSlots: { customRender: 'imgr' } },
    {title: "状态",dataIndex: "statusText",width: 100,align:'center'},
    {title: "创建时间",dataIndex: "create_time",width: 200,},
    {title: "修改时间",dataIndex: "update_time",width: 200,},
    {title: "操作",dataIndex: "operation",scopedSlots: { customRender: "operation" }},
];
import { getPicture,addPicture,addPictureImage,editPicture } from "@/api/admin";
import { imgUpload } from "@/api/index"
export default {
  inject: ["reload"],
  data() {
    return {
      data: [],
      columns,
      upload:imgUpload,
      cacheData: [],
      visible: false,
      loading: false,
      fenmianloading: false,
      tableLoading: true,
      addform: {
          picture_title:''
      },
      imageUrl:'',
    //   数据展示
      viewImgData:[],
      viTitle:'',
      viewImgModel:false,
    //   上传图片 数据
      uploadModel:false,
      addImgForm:{
          blog_picture_pk_id:0
      },
      previewVisible: false,
      previewImage: '',
      fileList:[],
        // 编辑
        editform:{
            picture_titles:''
        },
        editModal:false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
        let result = await getPicture();
        this.tableLoading = false;
        this.data = result.data;
        this.data.filter((item) => {
            item.statusText = item.state == 0 ? "显示" : "关闭";
            item.key = item.id;
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
    // 封面图片上传
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.fenmianloading = true;
        return;
      }
      if (info.file.status === 'done') {
          this.imageUrl = info.file.response.url;
          this.fenmianloading = false;
      }
    },
    // 点击修改
    edit(row) {
        this.imageUrl = row.picture_url;
        this.editform.picture_titles = row.picture_title;
        this.editform.id = row.id;
        this.editModal = true;
    },
    async pictureSave() {
        const data = {
            id:this.editform.id,
            picture_title:this.editform.picture_titles,
            picture_url:this.imageUrl
        }
        let result = await editPicture(data);
        this.$message.info(result.msg);
        this.reload();
    },
    // 保存
    async save(id) {
        if (this.addform.picture_title.length == 0) {
            return this.$message.info('请填写相册标题');
        }
        if (this.imageUrl.length == 0) {
            return this.$message.info('请上传封面图');
        }
        this.addform.picture_url = this.imageUrl;
        let result = await addPicture(this.addform);
        this.$message.info(result.msg)
        this.visible = false;
        this.reload();
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
    // 上传图片
    oupload(text) {
        this.addImgForm.blog_picture_pk_id = text.id;
        this.uploadModel = true;
    },
    // 上传图片变化
    handleChangeImages({ fileList }) {
      this.fileList = fileList;
    },
    async handlePreview(file) {
        console.log(file)
    //   this.previewImage = file.url || file.preview;
    //   this.previewVisible = true;
    },
    async saveImg() {
        if (this.fileList.length == 0) {
            return this.$message.error('上传图片后保存')
        }
        this.addImgForm.file_list = this.fileList.map(item=>{
            return item.response.url
        })
        let result = await addPictureImage(this.addImgForm);
        this.$message.info(result.msg);
        this.reload();
    },
    viewImg(text) {
        this.viTitle = "正在看" + text.picture_title + '相册图片';
        this.viewImgData = text.link_image;
        this.viewImgModel = true;
        console.log(text)
    }
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

