import { request } from '../../request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消 按钮 是否显示
    isFocus: false,
    // 输入框的值
    inpValue: ''
  },
  TimeId: -1,
  // 输入框的值改变了就会触发的事件
  handleInput(e) {
    // 获取输入框的值
    const { value } = e.detail
    // 检验合法性
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      clearTimeout(this.TimeId);
      // 值不合法
      return;
    }
    // 准备发送请求获取数据
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000);
  },
  // 发送请求获取搜索建议 数据
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } });

    this.setData({
      goods: res.data.message
    })
  },
  // 点击取消
  handleCancel() {
    this.setData({
      inpValue: '',
      isFocus: false,
      goods: []
    })
  }

})