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