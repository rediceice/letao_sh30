$(function(){
  var currentPage = 1;
  var pageSize = 5;
  var currentId,isDelete;
  
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/user/queryUser',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        // console.log(info);
        var htmlstr = template('usertmp',info);
        $('tbody').html(htmlstr);
  
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(a, b, c,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
           console.log(page);
           currentPage = page;
           render();
          }
        });
        
      }
  
    })
  }

  //点击按钮切换状态 禁用变启用 状态变不正常
  $('tbody').on('click','.btn',function(){
    //显示模态框
    $('#stopModal').modal('show');
    //获取id
    currentId = $(this).parent().data('id');
    // console.log(currentId);
    //获取需要修改的状态，根据按钮的类名来判断具体传什么
    //禁用按钮 ？ 0 ：1
    isDelete = $(this).hasClass('btn-dt') ? 0 :1;
    // console.log(isDelete);
  })

  //点击确认按钮，完成用户的启用禁用
  $('.btn-sure').click(function(){
    $.ajax({
      type:'post',
      url:'/user/updateUser',
      data:{
        id:currentId,
        isDelete:isDelete
      },
      dataType:'json',
      success:function(info){
        console.log(info)
        if(info.success){
          // 关闭模态框
          $('#stopModal').modal('hide');
          render();
        }
      }
    })
  })
})