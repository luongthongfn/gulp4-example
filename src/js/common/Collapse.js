// html:
//     .collapse-contaner
//         .something-visible
//         .collapse-item

$(function(){
    $('.collapse-container').each(function(){
        var _thisBlock = $(this),
            collapse = _thisBlock.find('.collapse');
            
        $(collapse).not('.collapse-show').find('.collapse-item').slideUp('fast');
        $(collapse).click(function(){
            $(this).toggleClass('collapse-show').find('.collapse-item').slideToggle('fast')
        })

    })
})