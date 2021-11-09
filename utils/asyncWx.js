/*
  promise 形式 showToast
*/

export const showToast = ({ title }) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: 'none',
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
    });
  })
}

/*
  promise 形式 getUserProfile
*/
export const getUserProfile = () => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: "完善个人信息",
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}


/*
  promise 形式 login
*/
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}
