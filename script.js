$(document).ready(function (){
    $('#ham,#ex').click(function (){
        $('#ham,#ex').toggle();
        $('nav #links,#indexBanner #heroText').toggleClass('visible');
    });
});