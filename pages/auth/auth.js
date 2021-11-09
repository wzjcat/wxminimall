import { request } from "../../request/index"
// import regeneratorRuntime from '../../lib'
import { login, getUserProfile } from '../../utils/asyncWx'
Page({
  // 获取用户信息
  async handleGetUserProflie(e) {
    try {
      const { encryptedData, rawData, iv, signature } = await getUserProfile()
      // 获取登录的code值
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code }
      // 发送请求 获取用户的token值
      const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "POST" })
      wx.setStorageSync('token', BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt - XeLnjV - _1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  },


})