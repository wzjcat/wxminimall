import { showToast } from '../../utils/asyncWx'
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存仲的收货地址
    const address = wx.getStorageSync("address");
    // 获取缓存仲的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({ address })
    this.setCart(cart)

  },
  // 点击收货地址
  handleCHooseAddress() {
    // 获取收货地址
    wx.chooseAddress({
      success: (result) => {
        wx.setStorageSync("address", result);
      }
    });
  },

  // 商品的选中
  handleChange(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let { cart } = this.data
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 4 取反
    cart[index].checked = !cart[index].checked

    this.setCart(cart)

  },

  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true
    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },

  // 商品全选功能
  handleItemAllcheck() {
    // 1获取data中的数据
    let { cart, allChecked } = this.data
    // 2改数值
    allChecked = !allChecked
    // 3循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },

  // 商品数量的编辑功能
  handleItemNumber(e) {
    // 获取传递过来的参数
    const { id, operation } = e.currentTarget.dataset;
    // 获取购物车数据
    let { cart } = this.data;
    // 找到需要改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      wx.showModal({
        title: '提示',
        content: '您是否要删除',
        success: (result) => {
          if (result.confirm) {
            cart.splice(index, 1)
            this.setCart(cart)
          } else if (result.cancel) {
            console.log("用户点击了取消");
          }
        }
      });
    } else {
      // 进行修改数量
      cart[index].num += operation;
      // 设置回缓存和data中
      this.setCart(cart)
    }

  },

  // 点击结算
  async handlePay() {
    // 获取地址信息
    const { address, totalNum } = this.data
    // 判断有没有收货地址信息
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    // 判断有没有选中商品
    if (totalNum === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
  }

})