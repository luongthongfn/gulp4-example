import { checkWindowSP, debounce } from "../helper/helper";
$(function () {
    const owlCarousel = require('owl.carousel2');
    var owl = $('.slider-case');
    
    function slideInit() {
        owl.on('initialized.owl.carousel changed.owl.carousel resized.owl.carousel', function(e) {
            $(e.target).toggleClass('hide-owl-next', e.item.index >= e.item.count - e.page.size);
            $(e.target).toggleClass('hide-owl-prev', e.item.index == 0);
        });
        owl.owlCarousel({
            items: 1,
            responsive: {
                768: {
                    items: 2
                },
            },
            loop: false,
            rewind: true,
            autoplay: false,
            autoplayTimeout: 2000,
            autoplayHoverPause: false,
            smartSpeed: 500, //slide speed smooth
            margin: 1,
            // stagePadding: 50,
            // autoWidth: true,
            dots: false,
            nav: true,
            navText: ['<i class="fa fa-angle-left"><i/>', '<i class="fa fa-angle-right"><i/>'],
            center: false
        });
    }
    if (checkWindowSP()) {
        slideInit()
    }
    $(window).on('resize', debounce(function(){
        if (checkWindowSP()) {
            slideInit();
        } else{
            owl.owlCarousel('destroy');
            console.log('dstroy')
        }
    }, 200))
});