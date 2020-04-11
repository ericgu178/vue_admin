<template>
    <div>
		<a-progress :percent="percent" :style="`display:${show_progress}`"/>
        <a-button type="primary" size="large" @click="img_visible=true" style="margin-top:10px;margin-bottom:20px;">批量上传图片</a-button>
  	    <a-button type="primary" @click="syncMaterial" size="large" style="margin-top:10px;margin-bottom:20px;">同步微信素材</a-button>
		<a-list
        	:grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 3, xl: 3, xxl: 3 }"
        	:dataSource="material_list"
  	    >
        	<a-list-item slot="renderItem" slot-scope="item, index">
				<a-card :title="item.title">
              		<img :src="item.file_path" alt="" @click="showImage(item.file_path,item.media_id)" class="index_list" onerror="this.src='http://ericgu178.com/static/images/404.jpg'">
  					<a-card-meta :title="item.media_id" style="padding-top:20px;">
  					  <template slot="description">{{item.create_time}}</template>
  					</a-card-meta>
				</a-card>
        	</a-list-item>
  	    </a-list>
        <!-- 分页 -->
        <a-pagination showQuickJumper :pageSize="paginate.pageSize" :defaultCurrent="1" :total="paginate.total" @change="onChange" style="text-align:right;margin-bottom:40px;"/>
        <!-- 模态框 -->
        <a-modal
          v-model="visible"
          okText="复制media_id"
          cancelText="关闭"
          @ok="copy_filepath"
        >
        <img :src="show_filepath" alt="" class="index_list" style="width:100%;height:100%" onerror="this.src='http://ericgu178.com/static/images/404.jpg'">
        </a-modal>
        <!-- 图片模态框 -->
        <a-modal
            v-model="img_visible"
            okText="保存"
            cancelText="取消"
            @ok="save_img"
        >
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
    			<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      				<img alt="example" style="width: 100%" :src="previewImage" />
    			</a-modal>
  			</div>
    	</a-modal>
    </div>
</template>
<script>

export default {
    inject:['reload'],
  	data () {
    	return {
          	material_list:[],
          	visible:false,
          	show_filepath:null,
          	paginate:{
          	  defaultCurrent:1,
          	  total:0,
          	  pageSize:12
		  	},
		  	// img
          	img_action:`${this.HOST}/admin/material/upload`,
          	img_visible:false,
		  	previewVisible: false,
          	previewImage: '',
          	// 保存提交的
            fileList: [],
			media_id:'',
			// 进度条
      percent:0,
      show_progress:'none'
    	}
  	},
  	created() {
    	this.$http({
        	method: 'get',
        	url: `${this.HOST}/wechat_admin/wechat_material/get`,
        	dataType:"json",
            data:{},
      	}).then(res=>{
 		    if (res.data.code == 0) {
                this.paginate.total = res.data.paginate.count
                this.paginate.pageSize = res.data.paginate.pageSize
                res.data.data.filter(v=>{
                	this.material_list.push({
					  	create_time:v.create_time,
                    	file_path:`${v.material_url}`,
                    	media_id:v.media_id,
                    	title:v.material_title,
                	  	material_id:v.id
					})
            	})
				return false
            }
		  	this.$message.error(res.data.msg)
        }).catch(e=>{
            console.log(e)
        })
    },
    methods:{
        showImage:function(filepath,media_id){
            this.visible = true
            this.show_filepath = filepath
            this.media_id = media_id
        },
        copy_filepath:function(){
            this.visible = false
            var oInput = document.createElement("input");
            oInput.value = this.media_id;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = "oInput";
            oInput.style.display = "none";
            this.$message.success("复制成功");
        },
        onChange(pageNumber) {
		  	this.$http({
        		method: 'get',
        		url: `${this.HOST}/wechat_admin/wechat_material/get?page=${pageNumber}`,
        		dataType:"json",
      		}).then(res=>{
 		      	if (res.data.code == 0) {
					this.material_list = []
                    this.paginate.total = res.data.paginate.count
                    this.paginate.pageSize = res.data.paginate.pageSize
              		res.data.data.filter(v=>{
                		this.material_list.push({
						  	create_time:v.create_time,
                        	file_path:`${v.material_url}`,
                        	media_id:v.media_id,
                        	title:v.material_title,
                		  	material_id:v.id
						})
            		})
					return false
          		}
		  		this.$message.error(res.data.msg)
        	}).catch(e=>{
            	console.log(e)
        	})
		},
		save_img:function() {
      		const image_list = []
      		this.fileList.filter(v=>{
                var start = v.response.url.indexOf('/uploads');
                v.response.url = v.response.url.substr(start)
      		  	image_list.push({
      		    	filepath:v.response.url
      			})
			})
			this.$http({
        		method: 'post',
        		url: `${this.HOST}/wechat_admin/wechat_material/image_save`,
        		dataType:"json",
        	  	data:{
					image_list:image_list
				},
      		}).then(res=>{
 			    if (res.data.code == 0) {
					this.$message.success(res.data.msg)
                    this.img_visible = false
                    this.reload()
        	  	} else {
					this.$message.error(res.data.msg)
				}
        	}).catch(e=>{
        	    console.log(e)
        	})
		},
		handleCancel () {
    	    this.previewVisible = false
    	},
    	handlePreview (file) {
    	    this.previewImage = file.url || file.thumbUrl
    	    this.previewVisible = true
    	},
    	handleChange ({ fileList }) {
    	  	this.fileList = fileList
		},
		syncMaterial () {
      		this.show_progress = 'block'
			var n = 0, timer = setInterval(()=>{
                n = n + Math.random()*10|0;
                if(n>90){
                  	n = 90;
                  	return false;
				}
				this.percent = n
            }, 2800+Math.random()*1000);
			this.request.request_get(
				`${this.request.base_url}/wechat_admin/wechat_material/syncMaterial`,
				response=>{
					this.percent = 100
					clearInterval(timer)
					setTimeout(()=>{
						this.$message.info(response.data.msg)
						this.show_progress = 'none'
						this.percent = 0
					},1000)
				},error=>{
					this.percent = 100
					clearInterval(timer)
					setTimeout(()=>{
						this.$message.error('网络错误')
						this.show_progress = 'none'
						this.percent = 0
					},1000)
				}
			)
		},
    }
}
</script>
<style>
.index_list {
  width:100%;
  height:350px;
  cursor:pointer;
}

/*图片上传格式*/
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
</style>
