<!-- ECharts图表测试 -->
<template>
  <!-- 图表 -->
  <div class="vol-data">
    <div class="charts" style="width:'100%',height:'8rem'">
      <div id="views" :style="{width:'100%',height:'300px'}"></div>
      <div id="comments" :style="{width:'100%',height:'300px',marginTop:'10px'}"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { dashboardIndex } from "@/api/index";
export default {
  data() {
    return {
      web_views: [],
      article_comments: [],
      dates: [],
    };
  },
  mounted() {
    this.init();
    setTimeout(() => {
      this.comments();
      this.views();
    }, 1500);
  },
  methods: {
    async init() {
      let result = await dashboardIndex();
      this.dates = result.dates;
      this.web_views = result.web_views;
      this.article_comments = result.article_comments;
    },
    comments() {
      // 评论
      var comments = echarts.init(document.getElementById("comments"));
      comments.setOption({
        backgroundColor: "#0E204A",
        title: {
          text: "过去7天的评论数据一览",
          textStyle: {
            fontWeight: "bold",
            fontSize: 16,
            color: "#fff",
          },
          padding: [20, 0, 0, 20],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(255,255,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "rgba(255,255,255,1)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(255,255,255,0)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        },
        textStyle: {
          color: "rgba(255, 255, 255, 0.6)",
        },
        xAxis: {
          type: "category",
          data: this.dates,
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              width: 0.5,
              type: "dashed",
              color: "#fff",
            },
          },
        },
        series: [
          {
            data: this.article_comments,
            type: "line",
          },
        ],
      });
    },
    views() {
      // 浏览量
      var views = echarts.init(document.getElementById("views"));
      views.setOption({
        backgroundColor: "#0E204A",
        title: {
          text: "过去7天的访问一览",
          textStyle: {
            fontWeight: "bold",
            fontSize: 16,
            color: "#fff",
          },
          padding: [20, 0, 0, 20],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(255,255,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: "rgba(255,255,255,1)", // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(255,255,255,0)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        },
        textStyle: {
          color: "rgba(255, 255, 255, 0.6)",
        },
        xAxis: {
          type: "category",
          data: this.dates,
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dashed",
              width: 0.5,
              color: "#fff",
            },
          },
        },
        series: [
          {
            data: this.web_views,
            type: "line",
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbolSize: 8,
            lineStyle: {
              normal: {
                color: "#53fdfe", // 线条颜色
              },
              borderColor: "#f0f",
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#fff",
              },
            },
            itemStyle: {
              normal: {
                color: "rgba(0,255,255,1)",
              },
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0,150,239,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(0,253,252,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              },
            },
          },
        ],
      });
    },
  },
};
</script>
