<template>
  <div>
      <div id="editor" style="float:left;margin-left:1%">
        <a-form :form="form" >
          <a-form-item label="标签" :label-col="{ span:1 }" :wrapper-col="{ span: 5 }">
            <a-select
                mode="multiple"
                placeholder="请选择标签"
                style="width: 500px"
                v-model="input.label_pk_ids"
                radeonly
            >
                <a-select-option v-for="item in initialize.label" :value="item.id">
                    {{item.label_name}}
                </a-select-option>
            </a-select>

          </a-form-item>
          <a-form-item label="标题" :label-col="{ span:1 }" :wrapper-col="{ span: 5 }">
            <a-input type="text" name='title' v-model="input.blog_title"/>
          </a-form-item>
          <a-form-item label="封面" :label-col="{ span:1 }" :wrapper-col="{ span: 5 }">
          <a-upload
           name="file"
           listType="picture-card"
           class="avatar-uploader"
           :showUploadList="false"
           :action=url
           :beforeUpload="beforeUpload"
           @change="handleChange"
          >
              <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
              <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">Upload</div>
              </div>
          </a-upload>
          </a-form-item>
          <a-form-item label="内容" :label-col="{ span:1 }" :wrapper-col="{ span: 23 }">
            <mavon-editor style="height: 100%" @change="markdownSave"></mavon-editor>
          </a-form-item>

          <a-button size="large" style="margin-left:55px;margin-top:1%;margin-bottom:2%" type="primary" @click="save($event)">保存</a-button>
          <a-button size="large" style="margin-left:25px;margin-top:1%;margin-bottom:2%" @click="back">取消</a-button>
        </a-form>
      </div>
  </div>
</template>
<script>

import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  data(){
    return{
      initialize:{
        label:[]
      },
      url:this.HOST+"/admin/image/upload",
      form: this.$form.createForm(this),
      input:{},
      loading: false,
	  imageUrl: '',
    }
  },
  name: 'editor',
  components: {
      mavonEditor
  },
  created(){
	  	// this.article = this.$route.query.article
    	this.$http({
    	    method: 'Get',
    	    url: `${this.HOST}/admin/article/add`,
    	    dataType:"json",
    	}).then(res=>{
    	    this.initialize.label = res.data.label
    	}).catch(err=>{
    	    this.$message.error('网络错误')
    	})
  },
  methods: {
    markdownSave (html,render) {
      this.input.blog_describe = html
      this.input.blog_content = render
    },
    save (e) {
      if (this.input.label_pk_ids == undefined || this.input.label_pk_ids.length == 0) {
        return this.$message.info("请选择至少一个标签")
      }
      if (this.input.blog_title == undefined || this.input.blog_title.length == 0) {
        return this.$message.info("请填写你的博客标题")
      }
      if (this.input.material_id == undefined || this.input.material_id.length == 0 ) {
        return this.$message.info("请上传你的图片")
      }
      if (this.input.blog_content.length == 0) {
        return this.$message.info("请写下的你的文章")
      }

      // return
      this.$http({
        method: 'POST',
        url: `${this.HOST}/admin/article/add`,
        data:this.input,
        dataType:"json",
      }).then(res=>{
        if (res.data.code==0) {
            this.$message.success(res.data.msg)
            this.$router.push({path:'/index'})
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err=>{
        console.log(err)
      })

    },
    back(){
        this.$router.go(-1);
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJPG && isLt2M
    },
    handleChange (info) {
      console.log(info.file.response.url)
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.code==0) {
            this.imageUrl = info.file.response.url
            this.input.material_id = info.file.response.material_id
        } else {
           this.$message.error(info.file.response.msg)
        }
        this.loading = false
      }
    }
  },
  mounted() {

  }
}
</script>
<style>
    #editor {
        margin: auto;
        width: 80%;
        height: 580px;
    }
    .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
