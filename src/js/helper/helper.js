//re turn number like: 123-1234-1234
export function numberFormat(number, slice = 3, sepatate = '-') {
    var arr = [],
        temp = number.split('').reverse();
    temp.forEach(function (el, i) {
        (i + 1) % slice == 0 && i != 0 ? arr.push(el) && arr.push(sepatate) : arr.push(el)
    })
    return arr.reverse().join('');
}

export function scrollToX(scrollTo, animate = true, clearFixedHeight = true) {
    var pos = clearFixedHeight ?
        scrollTo - $('.fixed').height() :
        scrollTo;
    var time = animate ? 'slow' : 10;
    $("html, body").animate({
        scrollTop: pos
    }, time);
}

export function checkWindowSP() {
    if (window.innerWidth < 768) {
        return true
    }
    return false
}

export function debounce(func, wait) {
    var timeout;

    return function () {
        var context = this,
            args = arguments;

        var executeFunction = function () {
            func.apply(context, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(executeFunction, wait);
    };
};