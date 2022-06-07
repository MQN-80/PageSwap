// index.js
// 获取应用实例
const app = getApp()
var currentStep=0; //代表当前执行到第几步
var option_alo=0; //代表当前选中的算法种类，0代表FIFO算法，1代表LRU算法
var losePage=0; //代表缺页次数，计算缺页率使用
var mid=[0,0,0,0,0,0,0,0,0,0]; //用来计算的中间量
var FIFOpage=0; //代表当前FIFO应更换的页面
var recordLRU=[0,0,0,0]; //记录每个页面最近被使用的时刻
var obj={}; //记录指令运行情况
var message1=[];
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    content:[-1,-1,-1,-1],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
      option1: [
        { text: 'FIFO算法', value: 0 },
        { text: 'LRU算法', value: 1 },
      ],
      value: 0,
      array:[0,0,0,0,0,0,0,0,0,0],
      array1:[0,0,0,0,0,0,0,0,0,0],
      array2:[0,0,0,0,0,0,0,0,0,0],
      array3:[0,0,0,0,0,0,0,0,0,0],  //代表四个页面，共能存放40条指令
      message:[{address:"300",havePage:"是",out:"200",in:"200"}], //存储处理的页请求
      op:[], //存储320条指令
      loseRate:0,  //缺页率
      losePage1:0,  //缺页数
      current_op:0,
  },
  // 事件处理函数
 Onchange(e){
   option_alo=e.detail;
 },
  onLoad() {  
    this.Random();
  },
  //用于生成随机数
  Random(){
  var sum=0;
  var flag=0; //代表是随机数是向前取还是向后取
  var current=0;
  let op1=this.data.op;
  var random=0;
  var current1=0;
  var op2=new Array(321).fill(0);
  var p=0;
  while(sum<319){
    p++;
    if(flag==0)
    {
      var s1=0,s2=0;  //用于确定下两个数
      random=Math.round(Math.random()*(319-current)+current); //生成current到319内的随机数
      if(op2[random]==1)
      {
        while(op2[s1]==1)
        s1++;
        op1.push(s1);
        op2[s1]=1;
      }
      else
     {op1.push(random);
      op2[random]=1;
     }
      if(op2[random+1]==1)
      {
        while(op2[s2]==1)
       s2++;
       
        op1.push(s2);
        op2[s2]=1;
      }
      else{
      op1.push(random+1);
      op2[random+1]=1;
      }
      sum+=2;
      flag=1;   //表明下次向后取随机数
      current=random;
    }
    else if(flag==1)
    {
      var s=0;
      while(op2[s]==1)
      s++;
      op2[s]=1;
      op1.push(op1[s]);
      flag=2;
      sum++;
    }
    else
    {
      random=Math.round(Math.random()*current);  //生成0到current内的随机数
      var s1=0,s2=0;  //用于确定下两个数
      if(op2[random]==1)
      {
        while(op2[s1]==1)
        s1++;
        op1.push(s1);
        op2[s1]=1;
      }
      else
     {op1.push(random);
      op2[random]=1;
     }
      if(op2[random+1]==1)
      {
        while(op2[s2]==1)
       { s2++;
       }
        op1.push(s2);
        op2[s2]=1;
      }
      else{
      op1.push(random+1);
      op2[random+1]=1;
      }
      sum+=2;
      flag=0;
      current=random;
    }
  }
  this.setData({
    op:op1,
  })
  },
  Dispatch(){   //单步执行页面调度
  let currentOp=this.data.op[currentStep]; //获取当前应处理指令
  let content=this.data.content;
  let page=parseInt(currentOp/10); //获取当前页面值
  let pageLocation=currentOp%10; //获取页中处于的位置
  let index=content.indexOf(page); //查看所需要的页是否已载入到内存中
  if(currentStep==319)
  return;
  obj={};
  if(index!=-1)   
  {
    recordLRU[index]=currentStep; //更新该表最近的使用时间，用当前执行次数来代替
    switch(index){
      case 0:
        mid=this.data.array;
        break;
      case 1:
        mid=this.data.array1;
        break;
      case 2:
        mid=this.data.array2;
          break;
      case 3:
        mid=this.data.array3;
        break;
    }
    obj.address=currentOp;
    obj.havePage="否";
    obj.out="-";
    obj.in="-";
    message1.push(obj)
   mid[pageLocation]=1;
   switch(index){
    case 0:
      this.setData({
        array:mid
      }) 
      break;
    case 1:
      this.setData({
        array1:mid
      }) 
      break;
    case 2:
      this.setData({
        array2:mid
      }) 
        break;
    case 3:
      this.setData({
        array3:mid
      }) 
      break;
  }
  }
  else{    //该页尚未加入内存
    let relaxPage=content.indexOf(-1); //查找是否有空闲内存可以直接加载页面
    if(relaxPage!=-1){
      losePage++;
    recordLRU[relaxPage]=currentStep; 
    content[relaxPage]=page;  //加载页面到内存中
    obj.address=currentOp;
    obj.havePage="是";
    obj.out="-";
    obj.in=page.toString();
    message1.push(obj)
    this.setData({
      content:content
    })
    mid=[0,0,0,0,0,0,0,0,0,0];
    mid[pageLocation]=1;
    switch(relaxPage){
      case 0:
        this.setData({
          array:mid
        }) 
        break;
      case 1:
        this.setData({
          array1:mid
        }) 
        break;
      case 2:
        this.setData({
          array2:mid
        }) 
          break;
      case 3:
        this.setData({
          array3:mid
        }) 
        break;      
     }

    }  
    else{   //四个页面已全部被加载，需要进行页面置换,对应的为两种置换算法
    losePage++;
    if(option_alo==0)   //表示当前选中的为FIFO算法
    {
      obj.address=currentOp;
      obj.havePage="是";
      obj.out=content[FIFOpage].toString();
      obj.in=page.toString();
      message1.push(obj)
       mid=[0,0,0,0,0,0,0,0,0,0] 
       content[FIFOpage]=page;
       this.setData({
         content:content,
       })
       mid[pageLocation]=1;
       switch(FIFOpage){
        case 0:
          this.setData({
            array:mid
          }) 
          break;
        case 1:
          this.setData({
            array1:mid
          }) 
          break;
        case 2:
          this.setData({
            array2:mid
          }) 
            break;
        case 3:
          this.setData({
            array3:mid
          }) 
          break;      
       }
       FIFOpage++;
       if(FIFOpage==4)
       FIFOpage=0; 
    }
    else   //表示当前选中的为LRU算法
    {
       var i=0;
       var min1=0;
       var min2=recordLRU[0];
       for(i=1;i<4;i++){
       if(recordLRU[i]<min2)
       {
        min1=i;   //获取最早被使用的页面
        min2=recordLRU[i];
       }
       }
       obj.address=currentOp;
       obj.havePage="是";
       obj.out=content[min1].toString();
       obj.in=page.toString();
       message1.push(obj)
       content[min1]=page;
       recordLRU[min1]=currentStep;
       mid=[0,0,0,0,0,0,0,0,0,0];
       this.setData({
        content:content,
      })
      mid[pageLocation]=1;
      switch(min1){
        case 0:
          this.setData({
            array:mid
          }) 
          break;
        case 1:
          this.setData({
            array1:mid
          }) 
          break;
        case 2:
          this.setData({
            array2:mid
          }) 
            break;
        case 3:
          this.setData({
            array3:mid
          }) 
          break;      
       }
    }
    
    }
    
 }
 currentStep++;
  },
  oneStep(){
  this.Dispatch(); //进行调度
  var message=this.data.message;
  message.push(obj);
  
  this.setData(
    {
    message:message,
    losePage1:losePage,
    loseRate:(losePage/currentStep).toFixed(4),
    current_op:currentStep,
    }
  )
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
  constStep(){   //连续执行
  var i=0;
  let that=this;
 // var mid1=[4,5,10,14,21,23,34,35,15,16,45,46,50,52,14,17];
  var timer=setInterval(function(){
    if(i==319)
   { 
    console.log(losePage);
     clearInterval(timer);
   }
    i++;
    that.oneStep();
    
  },1);
  },
  reset(){  //用于重置当前状态
  losePage=0;
  let mid1=[0,0,0,0,0,0,0,0,0,0]
  this.setData({
    content:[-1,-1,-1,-1],
    array:mid1,
    array1:mid1,
    array2:mid1,
    array3:mid1,
    message:[],
    losePage1:0,
    loseRate:0,
  })
  currentStep=0;
  FIFOpage=0;
  recordLRU=[-1,-1,-1,-1];
  this.Random(); //重新生成随机数
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
/**
 * <text style="position: relative; left: -172rpx; top: -1782rpx">{{index }}</text>
<text style="position: relative; left: -87rpx; top: -1782rpx">{{item.address }}</text>
<text style="position: relative; left: -45rpx; top: -1782rpx">{{item.havePage }}</text>
<text style="position: relative; left: -10rpx; top: -1782rpx; text-align: left">{{item.out }}</text>
<text style="position: relative; left: 57rpx; top: -1782rpx">{{item.in }}</text>
 */
