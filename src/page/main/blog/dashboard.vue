<!-- ECharts图表测试 -->
<template>
    <!-- 图表 -->
    <div class="vol-data">
        <div class="charts" style="width:'100%',height:'6.54rem'">
            <h3>过去7天的访问一览</h3>
            <div id="views" :style="{width:'100%',height:'300px'}"></div>
            <h3 style="margin-top:20px;" >过去7天的评论一览</h3>
            <div id="comments" :style="{width:'100%',height:'300px'}"></div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
export default {
    data () {
        return {
            web_views:[],
            article_comments:[],
            dates:[]
        }
    },
    created() {
        this.request.request_get(
            `${this.request.base_url}/admin/dashboard/index`,
            response=>{
                this.dates = response.data.dates
                this.web_views = response.data.web_views
                this.article_comments = response.data.article_comments
            },error=>{
                this.$message.error('网络错误')
            }
        )
    },
    mounted () {
        setTimeout(()=>{

            // 浏览量
            var views = echarts.init(document.getElementById('views'));
            views.setOption({
                backgroundColor: '#2c343c',
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.6)',
                },
                xAxis: {
                    type: 'category',
                    data: this.dates
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: this.web_views,
                    type: 'line'
                }]
            })

            // 评论
            var comments = echarts.init(document.getElementById('comments'));
            comments.setOption({
                backgroundColor: '#2c343c',
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.6)'
                },
                xAxis: {
                    type: 'category',
                    data: this.dates
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: this.article_comments,
                    type: 'line'
                }]
            })      
        },1500)
    },
    methods:{
    }
}
</script>