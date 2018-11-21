
$(function(){

  // NProgress.start();

  // NProgress.done();

  /*
  ajax 全局事件
  需求：
    1.在第一个ajax发送的时候，开启进度条
    2.在全部的ajax请求完hou，关闭进度条
  
  
  */

  $(document).ajaxStart(function(){
    NProgress.start();
  })

  $(document).ajaxStop(function(){
    NProgress.done();
  })

})


//左侧二级切换
$('.cate').click(function(){
  $(this).next().slideToggle();
})

$('.lt_topbar .icon_left').click(function(){
  $('.lt_aside').toggleClass('hidemenu');
  $('.lt_main').toggleClass('hidemenu');
  $('.lt_topbar').toggleClass('hidemenu');
})

$('.lt_topbar .icon_right').click(function(){
  $('#myModal').modal('show');
  
})

$('.btn-out').click(function(){
  $.ajax({
    type:'get',
    url:'/employee/employeeLogout',
    dataType:'json',
    success:function(info){
      // console.log(info);
      if(info.success){
        location.href ='login.html';
      }
      
      
    }
  })
  
})