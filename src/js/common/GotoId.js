$(window).on('load', function () {
    //go-top button
    $("#go-top, .go-top").click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
        return false;
    });

    //goto #id
    // eg:   <a href="#example" class="go-to">go to</a>
    $("a.go-to[href^='#']").click(function (e) {
        e.preventDefault();
        $('#menu').removeClass('is-active');

        var target = $($(this).attr('href'));
        if (target.length) {
            var fixedHeight = $('.fixed').height() || 0;
            var pos = target.offset().top - fixedHeight;
            $("html, body").animate({
                scrollTop: pos
            }, "slow");
        }
    });
})
