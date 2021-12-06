// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    timing_time: 25,

    motto_1: '选择专注任务',
    motto_2: '完成任务以获得',

    remain_credit_index: null,

    cateArr:[
      {
        icon: 'work',
        text: '工作'
      },
      {
        icon: 'study',
        text: '学习'
      },
      {
        icon: 'think',
        text: '思考'
      },
      {
        icon: 'write',
        text: '写作'
      },
      {
        icon: 'sport',
        text: '运动'
      },
      {
        icon: 'read',
        text: '阅读'
      }
    ],
    cateActive: '0',

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
        remain_credit_index: app.globalData.remain_credit,
      })
    }
  },

  onShow() {
    // var logs = wx.getStorageSync('logs') || [];
    // var remain_credit = 0;
    // if(logs.length > 0){
    //   for(var i = 0;i < logs.length;i++){
    //     remain_credit += logs[i].credit;
    //   } 
    // };
    // this.setData({
    //   remain_credit_index: remain_credit,
    // })

     //加载当前剩余专注积分

     var logs = wx.getStorageSync('logs') || [];
     var consumed = wx.getStorageSync('consumed') || [];
     var remain_credit = 0;
     var all_credit = 0;
     var consumed_credit = 0;

     if(logs.length > 0){
         for(var i = 0;i < logs.length;i++){
           all_credit += logs[i].credit;
         } 
     };

     if(consumed.length > 0){
       for(var i = 0;i < consumed.length;i++){
         consumed_credit += consumed[i].credit;
       } 
     };

     remain_credit = all_credit - consumed_credit;

     this.setData({
         remain_credit_index: remain_credit,
     })
  },
  
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  TimingTimeRefresh(e){
    console.log(e)

    this.setData({
      timing_time:e.detail.value
    })
  },

  go_to_timing_page: function(){
    var that = this
    // console.log(that.data.cateActive)
    wx.navigateTo({
      url: '../../pages/timing/timing?timing_time=' + that.data.timing_time + '&cateActive=' + that.data.cateActive,
    })
  },

  clickCate:function(e){
    // console.log(e.currentTarget.dataset.index);
    this.setData({
      cateActive:e.currentTarget.dataset.index
    })
  },

})
