<template>
    <div class="container">
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
    </div>
</template>

<script>
import  { handSend } from '@/api/index'
export default {
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form: {
                src: '',
                text: '',
            },
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
    },
}
</script>

<style scoped>

</style>