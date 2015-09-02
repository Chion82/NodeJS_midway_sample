/*index的模块加载文件*/
/*尝试加载一个自定义的mymath模块*/

require.config({
    paths:{
        'jquery':'/lib/jquery/dist/jquery.min',
        'bootstrap':'/common/scripts/bootstrap.min',
        'mymath':'/common/scripts/mymath'
    },
    shim:{
        'bootstrap':['jquery']
    }
});

require(['jquery','bootstrap','mymath'],function($,bootstrap,math){
    console.log(math.add(1,1));
    $('#add').click(function(event) {
        $('#about').append('!');
    });
});