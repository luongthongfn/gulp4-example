//==== js-tab ====//
// .js-tab
//     ul.js-tabnav
//         a[href="#tab1"]
//         a[href="#tab2"]
//     .js-tab-content
//         #tab1.tab-panel.fade.in
//         #tab2.tab-panel.fade
$(function () {

    $('.js-tab').each(function () {
        var _this = $(this);
        var nav = _this.find('.js-tabnav');
        var handleClick = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
        $(nav).on(handleClick, "a[href^='#']", function (e) {

            e.preventDefault();
            if ($(this).parent().hasClass('active')) {
                return;
            }
            $(nav).find('.active').removeClass('active');
            $(this).parent().addClass('active');


            var target = $($(this).attr('href'));
            target.siblings().removeClass('in');
            setTimeout(function () {
                target.siblings().removeClass('active');
            }, 100);
            target.addClass('active');
            setTimeout(function () {
                target.addClass('in');
            }, 100);
        })
    })
})