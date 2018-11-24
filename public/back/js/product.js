$(function(){
  var currentPage =1;
  var pageSize =2;
  var picArr =[];
  render();

  function render(){

    $.ajax({

      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        // console.log(info);
        var htmlstr =template('protmp',info);
        $('tbody').html(htmlstr);


        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(a, b, c,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
        
      }
    })
  }

  //点击添加商品
  $('#addBtn').click(function(){

    //弹出模态框
    $('#proModal').modal('show');

    //发送ajax获取分类信息
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
        var htmlstr = template('twotmp',info);
        $('.cateul').html(htmlstr);
      }
    })
  })
  
  //给下拉菜单添加选中功能
  $('.cateul').on('click','a',function(){
     var txt =$(this).text();
    //  console.log(txt);
    $('.tt').text(txt);

    //获取id
    var id =$(this).data('id');
    console.log(id);
    //赋值给隐藏域
    $('[name="brandId"]').val(id);
    // console.log($('[name="brandId"]').val(id));
    $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
    
  })

  //配置fileupload，实现文件上传
  $('#fileupload').fileupload({
    dataType:'json',
    //文件上传的回调函数
    done:function(e,data){

      var picObj = data.result;//图片地址
      picArr.unshift(picObj);

      //获取图片地址，将图片添加到最前面
      var picUrl =picObj.picAddr;
      $('#imgbox').prepend('<img width="100px" src="'+picUrl+'" >');
      
      //如果长度>3，说明超出范围，需要移除最后的图片
      if(picArr.length>3){

        picArr.pop();
        //图片需移除
        $('#imgbox img:last-of-type').remove();

        
      }
      if(picArr.length===3){
        //手动校验
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
      }
    }


  })


  //表单校验
  //使用表单校验插件
$('#form').bootstrapValidator({
  //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
  excluded: [],

  //2. 指定校验时的图标显示，默认是bootstrap风格
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  //3. 指定校验字段
  fields: {
    //校验用户名，对应name表单的name属性
    brandId: {
      validators: {
        //不能为空
        notEmpty: {
          message: '请选择二级分类'
        }
      }
    },
    proName: {
      validators: {
        //不能为空
        notEmpty: {
          message: '请输入商品名称'
        }
      }
    },
    proDesc: {
      validators: {
        //不能为空
        notEmpty: {
          message: '请输入商品描述'
        }
      }
    },

    num: {
      validators: {
        //不能为空
        notEmpty: {
          message: '请输入商品库存'
        },
        //正则校验
       regexp: {
          regexp:/^[1-9]\d*$/,
          message: '商品库存必须是非零开头的数字'
        }
      }
    },
    size: {
      validators: {
        notEmpty: {
          message: "请输出商品尺码"
        },
        regexp: {
          regexp: /^\d{2}-\d{2}$/,
          message: '必须是xx-xx的格式, xx是两位数字, 例如: 36-44'
        }
      }
    },
    oldPrice: {
      validators: {
        notEmpty: {
          message: "请输入商品原价"
        },
        regexp: {
          regexp: /^\d*$/,
          message: '必须是数字'
        }
      }
    },
    price: {
      validators: {
        notEmpty: {
          message: "请输入商品现价"
        },
        regexp: {
          regexp: /^\d*$/,
          message: '必须是数字'
        }
      }
    },
    picStatus: {
      validators: {
        notEmpty: {
          message: "请上传3张图片"
        }
      }
    }

  }

});




//注册表单校验成功事件
$('#form').on('success.form.bv',function(e){
   //阻止默认表单提交时间
   e.preventDefault();

   //拼接表单数据
   var paramsStr =$('#form').serialize();
   
   //拼接图片地址和名称
    paramsStr +="&picAddr1="+picArr[0].picAddr+"&picName1="+picArr[0].picName;
    paramsStr +="&picAddr2="+picArr[1].picAddr+"&picName2="+picArr[1].picName;
    paramsStr +="&picAddr3="+picArr[2].picAddr+"&picName3="+picArr[2].picName;

  


    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:paramsStr,
      dataType:'json',
      success:function(info){
        console.log(info);
        //关闭模态框
        $('#proModal').modal('hide');
        //从新渲染
        currentPage= 1;
        render();

        $('#form').data('bootstrapValidator').resetForm(true);
     
        $('.tt').text('请选择二级分类');

        $('#imgbox img').remove();
        picArr=[];

      }
    })

})




})