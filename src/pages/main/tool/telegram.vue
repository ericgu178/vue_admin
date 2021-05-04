<template>
    <div class="container">
        <h2>telegram电报图片发送</h2>
        <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="图片链接">
                <a-input v-model="form.src" />
            </a-form-model-item>
            <a-form-model-item label="图片说明">
                <a-input v-model="form.text" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="send"> 提交
                </a-button>
            </a-form-model-item>
        </a-form-model>

        <h2>微信背景图片发送</h2>
        <div class="clearfix">
            <a-upload
              :action="img_action"
              listType="picture-card"
              :fileList="fileList"
              @preview="handlePreview"
              @change="handleChange"
              accept="image/*"
            >
              <div v-if="fileList.length < 10">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
            <a-button type="primary" @click="save_img" style="margin-bottom:10px;">保存</a-button>
      </div>
    </div>
</template>

<script>
import  { handSend,upload,saveWechat } from '@/api/index'
export default {
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form: {
                src: '',
                text: '',
            },
            // 保存提交的
            fileList: [],
            previewVisible: false,
            previewImage: "",
            img_action:upload
        }
    },

    methods: {
        async send() {
            if (this.form.src.length == 0) {
                return this.$message.error('链接不完整')
            }
            let res = await handSend(this.form);
            this.$message.success('成功')
        },
        handlePreview(file) {
            this.previewImage = file.url || file.thumbUrl;
            this.previewVisible = true;
        },
        handleChange({ fileList }) {
          this.fileList = fileList;
        },
        async save_img() {
            const image_list = [];
            this.fileList.filter((v) => {
                var start = v.response.url.indexOf("/uploads");
                v.response.url = v.response.url.substr(start);
                image_list.push({
                    filepath: v.response.url,
                });
            });
            let result = await saveWechat({ image_list: JSON.stringify(image_list) });
            if (result.code == 0) {
                this.$message.success(result.msg);
                this.img_visible = false;
                this.reload();
            } else {
                this.$message.error(result.msg);
            }
        },
    },
}
</script>

<style scoped>
</style>