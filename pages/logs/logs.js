//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    activeIndex:0,//默认显示“今日”
    activeIndex2:2,//默认显示“专注”
    dayList:[],
    dayList_ambitionL:[],
    list:[],
    list_ambition:[],

    list_show:[],

    sum:[
      {
        title:'今日番茄次数',
        val:'0'
      },
      {
        title:'累计番茄次数',
        val:'0'
      },
      {
        title:'今日专注时长',
        val:'0分钟'
      },
      {
        title:'累计专注时长',
        val:'0分钟'
      },
      {
        title:'已经花费积分',
        val:'0分'
      },
      {
        title:'累计专注积分',
        val:'0分'
      },
      
    ],
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
  },
  onShow: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })

    var logs = wx.getStorageSync('logs') || [];
    var consumed = wx.getStorageSync('consumed') || [];

    var day = 0; // 今日番茄次数
    var total = logs.length; //累计番茄次数
    var dayTime = 0; // 今日专注时长
    var totalTime = 0; // 累计专注时长
    var consumed_credit = 0; // 已经花费积分
    var all_credit = 0; // 累计专注积分

    var dayList = [];
    var dayList_ambition = [];
    
    //统计专注事件的部分
    if(logs.length > 0){ 
      for(var i = 0;i < logs.length;i++){

        // 今日的
        if(logs[i].date.substr(0,10) == util.formatTime(new Date).substr(0,10)){ 
          day = day + 1;
          dayTime = dayTime + parseInt(logs[i].time);
          dayList.push(logs[i]);
        };

        // 累计的
        all_credit = all_credit + parseInt(logs[i].credit);
        totalTime = totalTime + parseInt(logs[i].time);
      }
    };


    //统计欲望花费的部分
    if(consumed.length > 0){
      for(var i = 0;i < consumed.length;i++){

        // 今日的
        if(consumed[i].date.substr(0,10) == util.formatTime(new Date).substr(0,10)){ 
          dayList_ambition.push(consumed[i]);
        };
        
        //累计的
        consumed_credit += consumed[i].credit;
      };
    };

    //传数值
    this.setData({
      'sum[0].val':day,
      'sum[1].val':total,
      'sum[2].val':dayTime+'分钟',
      'sum[3].val':totalTime+'分钟',
      'sum[4].val':consumed_credit+'分',
      'sum[5].val':all_credit+'分',

      dayList:dayList,
      dayList_ambition:dayList_ambition,
      list:logs,
      list_ambition:consumed,
      
      list_show: logs, //默认显示“今日”“专注”

    })
  },
  
  changeType:function(e){
    var index = e.currentTarget.dataset.index;
    console.log("currentbuttonindex="+index);
    
    this.setData({
      activeIndex:index
    })

    if(index == 0){
      if(this.data.activeIndex2==2){
        this.setData({
          list_show:this.data.dayList
        });
      }else{
        this.setData({
          list_show:this.data.dayList_ambition
        });
      }
      
    }else if(index == 1){
      if(this.data.activeIndex2==2){
        this.setData({
          list_show:this.data.list
        });
      }else{
        this.setData({
          list_show:this.data.list_ambition
        });
      }
    }

  },

  changeType2:function(e){
    var index = e.currentTarget.dataset.index;
    console.log("currentbuttonindex2="+index);

    this.setData({
      activeIndex2:index
    })

    if(index == 2){
      if(this.data.activeIndex==0){
        this.setData({
          list_show:this.data.dayList
        });
      }else{
        this.setData({
          list_show:this.data.list
        });
      }
      
    }else if(index == 3){
      if(this.data.activeIndex==1){
        this.setData({
          list_show:this.data.dayList_ambition
        });
      }else{
        this.setData({
          list_show:this.data.list_ambition
        });
      }
    }

  },
})
