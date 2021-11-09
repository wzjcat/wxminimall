import { showToast } from '../../utils/asyncWx'
import { request } from "../../request/index"

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存仲的收货地址
    const address = wx.getStorageSync("address");
    // 获取缓存仲的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked)
    this.setData({ address })
    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    // 判断数组是否为空
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
    wx.setStorageSync("cart", cart);

  },

  // 点击支付
  async handleOrderPay() {
    // 判断缓存中有没有token
    const token = wx.getStorageSync("token");
    // 判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    // 创建订单
    // 1准备请求头参数
    const header = { Authorization: token }
    // 2准备请求体参数
    const order_price = this.data.totalPrice
    const consignee_adder = this.data.address
    const cart = this.data.cart
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))
    const orderParams = { order_price, consignee_adder, goods }
    // 3准备发送请求 创建订单 
    const res = await request({ url: "/my/orders/create", method: "POST", data: orderParams, header: header })
    console.log(res);
  }

})