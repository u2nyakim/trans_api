/** EasyWeb spa v3.1.8 date:2020-05-04 License By http://easyweb.vip */
layui
  .config({
    version: true, // 更新组件缓存，设为true不缓存，也可以设一个固定值
    base: 'assets/module/'
  })
  .extend({
    steps: 'steps/steps',
    notice: 'notice/notice',
    cascader: 'cascader/cascader',
    dropdown: 'dropdown/dropdown',
    fileChoose: 'fileChoose/fileChoose',
    Split: 'Split/Split',
    Cropper: 'Cropper/Cropper',
    tagsInput: 'tagsInput/tagsInput',
    citypicker: 'city-picker/city-picker',
    introJs: 'introJs/introJs',
    zTree: 'zTree/zTree'
  })
  .use(['layer', 'setter', 'index', 'admin'], function () {
    var $ = layui.jquery;
    var layer = layui.layer;
    var setter = layui.setter;
    var index = layui.index;
    var admin = layui.admin;

    /* 检查是否登录 */
    if (!setter.getToken()) {
      return location.replace('login.html');
    }
    window.queryUser = function () {
      $('#refreshBalance .layui-icon').toggleClass('layui-anim-rotate');
      /* 获取用户信息 */
      admin.req(
        '/auth/user',
        function (res) {
          if (0 === res.code) {
            setter.putUser(res.data);
            admin.renderPerm(); // 移除没有权限的元素
            $('#huName').text(res.data.nickname);
            if (res.data.avatar) {
              $('#huName').prev().attr('src', res.data.avatar);
            }
            $('.user-balance').text('余额：' + res.data.money);
          } else {
            layer.msg('获取用户信息失败', { icon: 2, anim: 6 });
          }
          setTimeout(()=>{
            $('#refreshBalance .layui-icon').removeClass('layui-anim-rotate');
          }, 3000);
        },
        'get',
        { async: false }
      );
    };

    queryUser();
    $('#refreshBalance').click(function () {
      queryUser();
    });

    /* 加载侧边栏 */
    admin.req(
      window.location.origin + '/json/menus.json?v=' + new Date().getTime(),
      function (res) {
        if (0 === res.code) {
          index.regRouter(res.data, function (data) {
            data.name = data.title;
            data.url = data.path;
            data.iframe = data.component;
            data.show = !data.hide;
            data.subMenus = data.children;
            return data;
          }); // 注册路由
          index.renderSide(res.data); // 渲染侧边栏
          // 加载主页
          index.loadHome({
            url: '#/console/workplace',
            name: '<i class="layui-icon layui-icon-home"></i>'
          });
        } else {
          layer.msg('获取菜单列表失败', { icon: 2, anim: 6 });
        }
      }
    );
  });
