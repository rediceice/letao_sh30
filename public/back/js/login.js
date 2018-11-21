$(function(){

  /* 需求: 表单校验 */
  /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
  //使用表单校验插件
$('#form').bootstrapValidator({
  
  //1. 指定校验时的图标显示，默认是bootstrap风格
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },

  //2. 指定校验字段
  fields: {
    //校验用户名，对应name表单的name属性
    username: {
      validators: {
        //不能为空
        notEmpty: {
          message: '用户名不能为空'
        },
        //长度校验
        stringLength: {
          min: 2,
          max: 6,
          message: '用户名长度必须在2到6之间'
        },
        callback: {
          message:'用户名不存在'
        }
      }
    },
    password: {
      validators: {
        //不能为空
        notEmpty: {
          message: '密码不能为空'
        },
        //长度校验
        stringLength: {
          min: 6,
          max: 12,
          message: '用户名长度必须在6到12之间'
        },
        callback: {
          message:'密码错误'
        }
      }
    }
  }

});



/*
  * 2. 注册表单校验成功事件, 在事件中阻止默认成功的表单提交,
  *    通过 ajax 进行提交
  * */
 
   $('#form').on('success.form.bv',function(e){
     //阻止默认表单提交
     e.preventDefault();
     //通过ajax提交
     $.ajax({
       type:'post',
       url:'/employee/employeeLogin',
       data:$('#form').serialize(),
       dataType:'json',
       success:function(info){
         console.log(info);
         if(info.success){
           location.href = 'index.html';
         }
         if(info.error===1000){
           //用户名不存在
           //参数1：字段名称
           //参数2：校验状态
           //配置规则，用于提示
           $('#form').data('bootstrapValidator').updateStatus('username','INVALID','callback');
         }
         if(info.error===1001){
          //密码错误
          $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback');
        }
         
       }
     })
   })





   /*
  * 3. 重置功能 (本身reset按钮就可以重置内容, 需要调用表单校验插件的方法, 重置校验状态)
  * */
  $('[type="reset"]').click(function(){
    //重置状态
    // 重置状态
    // resetForm 如果传 true  表示内容和状态都重置
    //           不传参,      只重置状态
    $('#form').data("bootstrapValidator").resetForm();
  })
  })
