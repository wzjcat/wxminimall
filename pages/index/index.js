// 0 引入用来发送请求的方法 一定要把路径请全
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航栏数据
    navigationList: [],
    // 楼层数据
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.发送异步请求获取轮播图数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
    this.getSwiperList()
    // 2.发送异步请求获取导航数据 
    this.getNavigationList()
    // 3.发送异步请求获取楼层数据
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result.data.message
        })
      })
  },
  // 获取分类导航数据
  getNavigationList() {
    request({ url: "/home/catitems" })
      .then(result => {
        // console.log(result);
        this.setData({
          navigationList: result.data.message
        })
      })
  },
  // 获取楼层数据
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        // console.log(result);
        this.setData({
          floorList: result.data.message
        })
      })
  }
})