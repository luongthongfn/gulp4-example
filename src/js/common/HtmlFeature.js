
//add maxlength attr to input[number]
$(function () {
    $("input[type='number'][maxlength]").on('keyup keydown keypress blur change input', function (e) {
        if (e.keyCode === 8 || e.keyCode === 9) {
            return true
        }
        return this.value.length < +this.attributes.maxlength.value;
    });
})
