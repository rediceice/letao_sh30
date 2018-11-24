$(function(){
   var currentPage =1;
   var pageSize =5;

   render();
   function render(){
      $.ajax({
        type:'get',
        url:'/category/querySecondCategoryPaging',
        data:{
          page:currentPage,
          pageSize:pageSize
        },
        dataType:'json',
        success:function(info){
          // console.log(info);
          var htmlstr =template('secondtmp',info);
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




  //  添加分类,点击分类，弹出模态框
  $('#addBtn').click(function(){
     //显示模态框
     $('#twoModal').modal('show');

    //  发送ajax请求，请求所有一级分类列表
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlstr =template('catetmp',info);
        $('.cateul').html(htmlstr);
      }
    })

  })




  //给下拉菜单添加选中功能（事件委托）
  $('.cateul').on('click','a',function(){
     //获取a里的内容
     var txt =$(this).text();
    //  console.log(txt)
     //赋值给按钮里的span
     $('.tt').text(txt);
     //获取a中自定义属性id
     var id =$(this).data('id');
     //赋值给隐藏域，用于提交
     $('[name="categoryId"]').val(id);
     $('#form').data("bootstrapValidator").updateStatus( "categoryId", "VALID" );
  })
  
  //调用fileupload方法 发送文件上传请求
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      // console.log(data);
      var result =data.result.picAddr;
  
      $('#imgbox img').attr('src',result);
      //将图片地址赋值给隐藏域
      $('[name="brandLogo"]').val(result);
      $('#form').data("bootstrapValidator").updateStatus( "brandLogo", "VALID" );
    }
});




  //添加表单校验
  $('#form').bootstrapValidator({
    // 配置排除项, 需要对隐藏域进行校验
    excluded: [],

    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  })
  
  $("#form").on("success.form.bv", function( e ) {
    // 阻止默认的提交
    e.preventDefault();

    $.ajax({
      url: "/category/addSecondCategory",
      type: "post",
      data: $('#form').serialize(),
      success: function( info ) {
        console.log( info )

        // 关闭模态框
        $('#twoModal').modal("hide");
        

        // 重新渲染第一页
        currentPage = 1;
        render();
        
        // 重置表单里面的内容和校验状态
        $('#form').data("bootstrapValidator").resetForm( true );
        // 找到下拉菜单文本重置
        $('.tt').text("请选择1级分类")

        // 找到图片重置
        $('#imgbox img').attr("src", "./images/default.png")
      }
    })
  })

})


