import { login, getUserProfile } from '../../utils/asyncWx'
Page({
  // 获取用户信息
  async handleGetUserProflie(e) {
    const { userInfo } = await getUserProfile()
    wx.setStorageSync("userInfo", userInfo);
    wx.navigateBack({
      delta: 2
    });

  },


})