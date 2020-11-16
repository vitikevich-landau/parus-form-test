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

$(() => {
    const dropDownTemplate = `
        <div id="dropDown" class="input-group-append">
            <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="sr-only">Toggle Dropdown</span>
            </button>
            <div class="dropdown-menu">
            </div>
        </div>
    `;
    const dropDownItemTemplate = `<a class="dropdown-item" href="#">[title]</a>`;


    const $phoneInput = $(`#exampleInputPhone`);
    const $phoneValid = $(`.valid-feedback`);
    const $phoneInValid = $(`.invalid-feedback`);
    const $nameInput = $(`#exampleInputName`);

    const $form = $(`#question-form`);

    $form.submit(e => {
        e.preventDefault();
        console.log(`prevented`);
    });

    let jqxhr;
    $phoneInput.on(`input`, throttle(e => {
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
                beforeSend: xhr => {
                    if (jqxhr) {
                        jqxhr.abort();
                    }
                    /**
                     *  Перед началом отправки запроса
                     *
                     *  Убрать невалидные классы ошибок, если есть
                     * */
                    $phoneInValid.addClass(`d-none`);
                    $phoneInput
                        .removeClass(`is-invalid`)
                        .addClass(`is-valid verifying`);
                }
            })
                .done((data, textStatus, jqXHR) => {
                    if (data.length > 0) {
                        const titles = [...new Set(data.map(v => v[`title`]))];
                        const names = [...new Set(data.map(v => v[`name`]))];

                        if (data.length > 1) {
                            /**
                             *  Добавляем динамический контент
                             * */
                            $nameInput.after(dropDownTemplate);
                            const $dropDownMenu = $(`.dropdown-menu`);

                            for (const name of names) {
                                // console.log(name);
                                $dropDownMenu.append(dropDownItemTemplate.replace(`[title]`, name));
                            }


                            const $dropdownMenuLinks = $(`.dropdown-menu a`);
                            const firstMenuTitle = $dropdownMenuLinks.first().text();

                            $nameInput.val(firstMenuTitle);

                            /**
                             *  Вешаем обработчики событий
                             * */
                            $dropdownMenuLinks.on(`click`, e => {
                                e.preventDefault();
                                const link = $(e.target);

                                $nameInput.val(link.text());
                            });
                        } else  {
                            /**
                             *  Удаляем динамический контент
                             * */
                            $(`#dropDown`).remove();

                            $nameInput.val(names);
                        }

                        $phoneInput.removeClass(`verifying`);
                        $phoneValid.removeClass(`d-none`)
                            .text(titles);

                        $nameInput.addClass(`is-valid`)

                    } else {
                        /**
                         *  Удаляем динамический контент
                         * */
                        $(`#dropDown`).remove();

                        $phoneInput.removeClass(`is-valid verifying`);
                        $phoneValid.addClass(`d-none`);
                        $nameInput.removeClass(`is-valid`);
                        $nameInput.val(``);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    /**
                     *  Удаляем динамический контент
                     * */
                    $(`#dropDown`).remove();

                    /**
                     *  Добавить классы вывода сообщений об ошибках
                     * */
                    $phoneInput
                        .removeClass(`is-valid verifying`)
                        .addClass(`is-invalid`);

                    $phoneValid.addClass(`d-none`);

                    $nameInput
                        .removeClass(`is-valid`)
                        .val(``);

                    $phoneInValid.removeClass(`d-none`);
                })
                .always((jqXHR, textStatus, errorThrown) => {
                    // console.log(jqXHR, textStatus, errorThrown)
                });
        }

    }, 550));

    // const $dropdownMenu = $(`.dropdown-menu`);


    // $('.dropdown-menu a').click(function() {
    //     console.log($(this).attr('data-value'));
    //     $(this).closest('.dropdown').find('input.countrycode')
    //         .val('(' + $(this).attr('data-value') + ')');
    // });

});















