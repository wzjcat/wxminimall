// 0 引入用来发送请求的方法 一定要把路径请全
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取分类数据
    /*
    1  先判断一下本地存储中有没有旧的数据
      {time:Date.now(),data:[...]}
    2 没有旧数据 直接发送新请求
    3 有旧数据 同时 旧数据也没有过期 就使用本地存储中的旧数据即可 
    */

    // 1.获取本地存储数据
    const Cates = wx.getStorageSync("cates");
    // 2.判断
    if (!Cates) {
      this.getCates()
    } else {
      // 有旧数据 定义过期时间 
      if (Date.now() - Cates.time > 1000 * 600) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  // 获取分类数据
  async getCates() {
    // request({ url: "/categories" })
    //   .then(result => {
    //     this.Cates = result.data.message;

    //     //把接口的数据存入到本地存储中
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //     // 构造左侧的大菜单数据
    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     // 构造右侧的商品数据
    //     let rightContent = this.Cates[0].children
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })
    // 使用es7的async await来发送请求
    const result = await request({ url: "/categories" })
    this.Cates = result.data.message;
    //把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧分类菜单点击方法
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容的scroll-view标签的距离
      scrollTop: 0
    })
  }

})