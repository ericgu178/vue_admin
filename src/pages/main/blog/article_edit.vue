<template>
    <div>
        <div id="editor" style="float:left;margin-left:1%">
            <a-form :form="form" >
                <a-form-item label="标签" :label-col="{ span:2 }" :wrapper-col="{ span: 5 }">
                    <a-select
                        mode="multiple"
                        placeholder="请选择标签"
                        style="width: 500px"
                        v-model="input.label_pk_ids"
                        radeonly
                    >
                        <a-select-option v-for="(item,index) in initialize.label" :value="item.id" :key="index">
                            {{item.label_name}}
                        </a-select-option>
                    </a-select>

                </a-form-item>
                <a-form-item label="标题" :label-col="{ span:2 }" :wrapper-col="{ span: 11 }">
                    <a-input type="text" name='title' v-model="input.blog_title"/>
                </a-form-item>
                <a-form-item label="文章简介" :label-col="{ span:2 }" :wrapper-col="{ span: 11 }">
                    <a-textarea name='blog_describe' v-model="input.blog_describe" placeholder="请书写文章简介"  :autosize="{ minRows: 3, maxRows: 10 }"/>
                </a-form-item>
                <a-form-item label="封面" :label-col="{ span:2 }" :wrapper-col="{ span: 5 }">
                <a-upload
                    name="file"
                    listType="picture-card"
                    class="avatar-uploader"
                    :showUploadList="false"
                    :action=url
                    :beforeUpload="beforeUpload"
                    @change="handleChange"
                >
                    <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width:960px;height:540px"/>
                    <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">Upload</div>
                    </div>
                </a-upload>
                </a-form-item>
                <a-form-item label="文章内容" :label-col="{ span:2 }" :wrapper-col="{ span: 22 }">
                    <mavon-editor ref="md" @imgAdd="imgAdd" style="height: 100%;width:1200px;" @change="markdownSave" :value="input.wenzhang"></mavon-editor>
                </a-form-item>

                <a-button size="large" style="margin-left:85px;margin-top:1%;margin-bottom:2%" type="primary" @click="save($event)">保存</a-button>
                <a-button size="large" style="margin-left:15px;margin-top:1%;margin-bottom:2%" @click="back">取消</a-button>
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
            initialize:{label:[]},
            url:this.HOST+"/admin/image/upload",
            form: this.$form.createForm(this),
            input:{},
            loading: false,
            imageUrl: '',
            editArticile:{}
        }
    },
    name: 'editor',
    components: {
        mavonEditor
    },
    created(){
        if (this.$route.query.article.id == undefined) {
            history.back(-1)
            return this.$message.error("也许你刷新页面了数据未传入错误！！",5)
        }
        this.input = this.$route.query.article
        var x = [];
        this.$route.query.article.label_pk_ids.filter(v=>{
            x.push(v.id)
        })
        this.input.label_pk_ids = x // 数组 标签
        this.input.wenzhang = this.$route.query.article.blog_source_code // 源代码
        this.imageUrl = this.HOST + this.$route.query.article.material_id.filepath // 图片路径
        this.input.material_id_edit = this.$route.query.article.material_id.id // 素材id
        console.log(this.input,this.$route.query)
    },
    methods: {
        init() {
            this.request.request_get(
                `${this.HOST}/admin/article/getLabels`,
                res=>{
                    this.initialize.label = res.data.label
                },
                err=>{
                    this.$message.error('网络错误')
                }
            )
        },
        markdownSave (html,render) {
            this.input.wenzhang = html // 源代码
            this.input.blog_content = render // 编译后的html代码
        },
        save (e) {
            if (this.input.label_pk_ids == undefined || this.input.label_pk_ids.length == 0) {
                return this.$message.info("请选择至少一个标签！")
            }
            if (this.input.blog_title == undefined || this.input.blog_title.length == 0) {
                return this.$message.info("请填写你的博客标题！")
            }
            if (this.input.blog_describe == undefined || this.input.blog_describe.length == 0) {
                return this.$message.info("文章简介请写一下！")
            }
            if (this.input.material_id == undefined || this.input.material_id.length == 0 ) {
                return this.$message.info("请上传你的文章首页图片！")
            }
            if (this.input.blog_content == undefined || this.input.blog_content.length == 0) {
                return this.$message.info("文章不写不能提交！")
            }

            this.$http({
                method: 'POST',
                url: `${this.HOST}/admin/article/edit`,
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
                this.$message.error('网络错误')
            })

        },
        back(){
            this.$router.go(-1);
        },
        beforeUpload (file) {
            const isJPG = file.type === 'image/jpeg'
            if (!isJPG) {
                this.$message.error('上传图片兄弟！',4)
            }
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) {
                this.$message.error('大小不超过 2MB 兄弟!',4)
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
                    this.input.material_id_edit = info.file.response.material_id
                } else {
                    this.$message.error(info.file.response.msg)
                }
                this.loading = false
            }
        },
        // 添加图片
        imgAdd:function(file,fileinfo) {
            let formdata = new FormData()
            formdata.append('file',fileinfo)
            this.request.request_post(
                `${this.HOST}/admin/image/upload`,
                res=>{
                    if(res.data.code == 0) {
                        this.$refs.md.$img2Url(file,res.data.url)
                        this.$message.success('上传成功')
                        return 
                    }
                    this.$message.error(res.data.msg)
                },
                error=>{
                    this.$message.error('出现错误')
                },
                formdata,
                {'Content-Type': 'multipart/form-data'}
            )
        }
    },
    mounted() {
        this.init()
    }
}
</script>
<style scoped>
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
