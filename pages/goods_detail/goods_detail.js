import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏过
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options
    const { goods_id } = options
    this.getGoodsDetail(goods_id);


  },

  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const result = await request({ url: "/goods/detail", data: { goods_id } })
    this.GoodsInfo = result.data.message
    // 1获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsObj: {
        goods_name: result.data.message.goods_name,
        goods_price: result.data.message.goods_price,
        // iphone部分手机不识别webp图片格式
        // 临时自己改 确保后台存在 1.webp => 1.jpg
        goods_introduce: result.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: result.data.message.pics
      },
      isCollect
    })
  },

  // 点击轮播图放大预览
  handlePreviewImage(e) {
    // 1构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    // const current = e.currentTarget.dataset.url
    const index = e.currentTarget.dataset.index
    // 2接收传递过来的图片url
    wx.previewImage({
      current: urls[index],
      urls: urls,

    });
  },

  // 点击加入购物车
  handleCartAdd() {
    // 1.获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart") || [];
    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index) {
      // 不存在 第一次添加
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 已经存在购物车数据 执行num++
      cart[index].num++;
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '添加成功',
      iocn: 'success',
      mask: true
    });
  },

  // 收藏按钮
  handleCollect() {
    let isCollect = false;
    // 1 获取缓存中的收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断商品是否收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 当index!= -1表示已经收藏过
    if (index !== -1) {
      // 已经收藏过
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
    } else {
      // 没有收藏过
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 4把数组存到缓存中
    wx.setStorageSync("collect", collect);
    // 5修改data中的属性
    this.setData({
      isCollect
    })
  }
})