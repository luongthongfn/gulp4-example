//contact-form
// import { numberFormat} from '../helper/helper.js';

$(function () {
    var Postal_code = require('japan-postal-code'),
        { scrollToX } = require('../helper/helper.js'),
        { checkWindowSP } = require('../helper/helper'),
        bodyScrollLock = require('body-scroll-lock'),
        disableBodyScroll = bodyScrollLock.disableBodyScroll,
        enableBodyScroll = bodyScrollLock.enableBodyScroll,
        targetElement = $(".step-overlay")[0],
        code,
        addressResponse,
        Prefecture,
        Address=$('#address'),
        company,
        request,
        name,
        zipcode,
        address,
        phone,
        fax,
        email,
        question,
        
        setPreview = function () {
            function setText(id, text) {
                if (!!text) {
                    $(`#preview_${id}`).text(text);
                    $(`#preview_${id}`).parents('tr').removeClass('hidden');
                }
                // console.log(id, " : ", text);
            };
            company  = document.getElementById('company').value,
            request  = document.querySelector('input[name=request]:checked').value,
            name     = document.getElementById('name').value,
            zipcode  = document.getElementById('zipcode').value,
            address  = document.getElementById('address').value,
            phone    = document.getElementById('phone').value,
            fax      = document.getElementById('fax').value,
            email    = document.getElementById('email').value,
            question = document.getElementById('question_input').value;
            
            ['company', 'request', 'name','zipcode','address','phone','fax','email','question']
            .forEach(function(item){
                setText(item, eval(item))
            })
            if ( checkWindowSP() ) 
                $('.table-preview').css('margin-top', $('.fixed').height())
        },
        submitCallback = function () {
            
            $(".form-submit .fa").addClass("fa-spinner fa-spin");
            $.ajax({
                url: "mail.php",
                method: "POST",
                data: {
                    contact_form: true,
                    company,
                    request,
                    name,
                    zipcode,
                    address,
                    phone,
                    fax,
                    email,
                    question
                },
                success: function success(res) {
                    $(".form-submit .fa").removeClass("fa-spinner fa-spin");
                    $(".form-submit .fa").addClass("fa-check");
                    $('.step2').removeClass('step-show');
                    $('.step3').addClass('step-show');
                    document.getElementById("contact--form").reset();
                },
                error: function error(xhr, status, err) {
                    $(".form-submit .fa").removeClass("fa-spinner fa-spin");
                    $(".form-submit .fa").addClass("fa-exclamation");
                    $('.step2').removeClass('step-show');
                    $('.step3').addClass('step-show');
                    $('.contact-complete-message').html('Something wrong!')
                }
            });
        };
    
    //
    $('.step2, .step3').removeClass('step-show');
    //get address from postal-code
    $('.get-zipcode').click(function (e) {
        e.preventDefault();
        code = $('#zipcode').val(),
            Postal_code.get(code, function (address) {
                // console.log(address)
                addressResponse = address.prefecture + ' ' + address.city + ' '+ address.area + ' ' + address.street;
                // addressResponse = addressResponse.replace(/,\s*$/, ""); // remove last comma
                Address.val(addressResponse);
            });
    })
    $("#contact--form").validate({
        focusInvalid: true,
        ignore: '',
        rules: {
            //key is name of input
            request: "required",
            name: "required",
            phone: {
                required: true,
                number: true
            },
            fax:{
                number: true
            },
            email: {
                required: true,
                email: true,
                maxlength: 255
            },
            re_email: {
                required: true,
                equalTo: "#email"
            },
            question: {
                required: true,
                minlength: 2
            }
        },
        errorPlacement: function (error, element) {
            return;
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("has-error");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass("has-error")
        },
        submitHandler: function () {
            $(".form-submit .fa").attr('class', 'fa');
            $('.step-overlay').addClass('show');
            checkWindowSP() ? disableBodyScroll(targetElement) : '';
            setPreview();
            var formScrolltop = $('.contact-table').offset().top;
            scrollToX(formScrolltop);
            $('.step2').addClass('step-show');
        }
    });

    //handle event
    $('.form-back, .form-end').click(function(){
        $('.step-overlay').removeClass('show');
        $('.step2, .step3').removeClass('step-show');
        enableBodyScroll(targetElement);
        $('.table-preview tr').addClass('hidden');
    })
    $('.form-submit').click(function(){
        submitCallback();
    })
    

})
