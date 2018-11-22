$(function(){
   var currentPage =1;
   var pageSize =5;
   render();
   function render(){
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        // console.log(info);
        var htmlstr = template('firsttmp',info);
        $('tbody').html(htmlstr);
        
        $("#paginator").bootstrapPaginator({
            bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
            currentPage:info.page,//当前页
            totalPages:Math.ceil(info.total/info.size),//总页数
            size:"small",//设置控件的大小，mini, small, normal,large
            onPageClicked:function(a, b, c,page){
              //为按钮绑定点击事件 page:当前点击的按钮值
              currentPage =page;
              render();
            }
        });
       
 
      }
 
    })
   }


   //点击添加分类 弹出模态框
   $('#addBtn').click(function(){
     //显示模态框
      $('#oneModal').modal('show');

   })

   //表单验证功能
   $('#form').bootstrapValidator({
       // 配置小图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',   // 校验成功
        invalid: 'glyphicon glyphicon-remove',   // 校验失败
        validating: 'glyphicon glyphicon-refresh'  // 校验中
      },
       // 配置字段
      fields: {
        categoryName: {
          // 配置校验规则
          validators: {
            // 配置非空校验
            notEmpty: {
              message: "请输入一级分类名称"
            }
          }
        }
      }


   })


   //注册表单验证成功事件，阻止默认的表单提交，通过ajax提交
    $('#form').on('success.form.bv',function(e){
      //阻止默认提交
      e.preventDefault();

      $.ajax({
         type:'post',
         url:'/category/addTopCategory',
         data:$('#form').serialize(),
         dataType:'json',
         success:function(info){
           console.log(info);
           if(info.success){
             //关闭模态框
             $('#oneModal').modal('hide');
              currentPage =1;
             //重新渲染
             render();

             $('#form').data('bootstrapValidator').resetForm(true);
           }
         }

      })

    })


})