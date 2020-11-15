function throttle(func, ms) {
    let isThrottled = false,
        savedArgs,
        savedThis;

    function wrapper() {

        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
        }

        func.apply(this, arguments);

        isThrottled = true;

        setTimeout(function () {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
}

function debounce(f, ms) {

    let isCooldown = false;

    return function () {
        if (isCooldown) return;

        f.apply(this, arguments);

        isCooldown = true;

        setTimeout(() => isCooldown = false, ms);
    };

}

$(function () {
    const $phoneInput = $(`#exampleInputPhone`);
    const $phoneValid = $(`.valid-feedback`);
    const $phoneInValid = $(`.invalid-feedback`);
    const $nameInput = $(`#exampleInputName`);

    let jqxhr;

    $phoneInput.on(`input`, throttle(function (e) {
        const max_len = 18;
        const target = e.target;
        let value = target.value;

        /**
         *  Полностью заполнен, начинаем запрос на сервер
         * */
        if (value.length === max_len) {
            console.log(value);

            /**
             *  Отправка запроса на сервер
             * */
            jqxhr = $.ajax({
                url: `api/verify-phone`,
                method: `GET`,
                data: {phone: value},
                beforeSend: function (xhr) {
                    if(jqxhr) {
                        jqxhr.abort();
                    }
                    /**
                     *  Перед началом отправки запроса
                     *
                     *  Убрать невалидные классы ошибок, если есть
                     * */
                    $phoneInput.removeClass(`is-invalid`);
                    $phoneInValid.addClass(`d-none`);
                    $phoneInput.addClass(`is-valid verifying`);
                }
            })
                .done(function (data, textStatus, jqXHR) {
                    if (data.length > 0) {
                        const titles = [...new Set(data.map(v => v[`title`]))];
                        const names = [...new Set(data.map(v => v[`name`]))];

                        $phoneInput.removeClass(`verifying`);
                        $phoneValid.removeClass(`d-none`);
                        $phoneValid.text(titles);

                        $nameInput.addClass(`is-valid`);
                        $nameInput.val(names);
                    } else {
                        $phoneInput.removeClass(`is-valid verifying`);
                        $phoneValid.addClass(`d-none`);
                        $nameInput.removeClass(`is-valid`);
                        $nameInput.val(``);
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    /**
                     *  Добавить классы вывода сообщений об ошибках
                     * */
                    $phoneInput
                        .removeClass(`is-valid verifying`)
                        .addClass(`is-invalid`);
                    $phoneValid.addClass(`d-none`);
                    $nameInput.removeClass(`is-valid`);
                    $nameInput.val(``);
                    $phoneInValid.removeClass(`d-none`);
                })
                .always(function (jqXHR, textStatus, errorThrown) {
                    // console.log(jqXHR, textStatus, errorThrown)
                });
        }

    }, 550));

});















