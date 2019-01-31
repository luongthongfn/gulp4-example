//custom-select 
// html :
// .custom-select
//     input#custom_select_input
//     .fake_input
//     ul
//         li.selected(data-value="blabla") blabla
//         li(data-value="blabla1") blabla1
//         li(data-value="blabla2") blabla2
$(function () {
    $('.custom-select').each(function () {
        var _this = $(this),
            fakeInput = _this.find('.fake_input'),
            inputHidden = _this.find('.custom_select_input'),
            selected = _this.find('li.selected'),
            errorClass = 'has-error',
            _open = function () {
                _this.addClass('select-open')
            },
            _close = function () {
                _this.removeClass('select-open')
            },
            _changeSlected = function (elem) {
                _this.find('li').removeClass('selected');
                $(elem).addClass('selected');
            },
            _update = function (val) {
                val = val || 'selected not found';
                fakeInput.text(val);
                inputHidden.val(val);
                // console.log(inputHidden.val());
                _validate();

            },
            _validate = function () {
                if (fakeInput.text().trim() == "項目を選択してください") {
                    inputHidden.addClass(errorClass);
                    inputHidden.val('');
                } else {
                    inputHidden.removeClass(errorClass);
                }
            },
            _init = function(){
                if (selected.length) {
                    _update(_this.find(selected).data('value'));
                }
            };

        //init
        _init();

        //handle
        fakeInput.on('click', function () {
            _open();
        })

        _this.on('click', 'li', function () {
            var val = $(this).data('value');
            _changeSlected(this);
            _update(val);
            _close();
        })

        $(document).on('click touchstart', function (event) {
            // Check if clicked outside target
            if (!($(event.target).closest(".custom-select").length)) {
                // Hide target
                _close();
            }
        });
    })
})