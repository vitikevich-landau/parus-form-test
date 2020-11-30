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
    const $phoneInput = $(`#exampleInputPhone`);
    const $phoneValid = $(`.valid-feedback`);
    const $phoneInValid = $(`.invalid-feedback`);
    const $nameInput = $(`#exampleInputName`);
    const $message = $(`#exampleFormControlMessage`);

    const $form = $(`#question-form`);
    const $sendButton = $(`#send_button`);
    const $spinnerButton = $(`#spinner_button`);

    /***
     *
     *  Можно попробовать добавить другие алгоритмы определения
     *  пуста ли сторока (заполнение по маске)
     */
    const inputIsNotEmpty = s => s.trim().length > 0;

    const isFieldsIsNotEmpty = () =>
        inputIsNotEmpty($nameInput.val()) &&
        inputIsNotEmpty($message.val());

    const lockUnlockButton = ($button) => {
        if (isFieldsIsNotEmpty()) {
            $button.removeAttr(`disabled`);
        } else {
            $button.attr(`disabled`, true);
        }
    };

    const dropDownTemplate = `
        <div id="dropDown" class="input-group-append">
            <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="sr-only">Toggle Dropdown</span>
            </button>
            <div class="dropdown-menu">
            </div>
        </div>
    `;
    const dropMenuItemTemplate = `<a class="dropdown-item" href="#">[title]</a>`;


    const throttleDelay = 550;
    /***
     *  Настройка jQuery Mask
     */
    let jqxhr;
    const options = {
        onComplete: throttle(function (cep) {
            /**
             *  Если номер полностью ввели
             * */
            lockUnlockButton($sendButton);

            /**
             *  Отправка запроса на сервер
             * */
            jqxhr = $.ajax({
                url: `api/verify-phone`,
                method: `GET`,
                data: {phone: cep},
                beforeSend: xhr => {
                    /***
                     *  Отмена операции, если запрос уже отпрален
                     */
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
                    $nameInput.removeClass(`is-valid`);
                }
            })
                .done((data, textStatus, jqXHR) => {
                    if (data.length > 0) {

                        const titles = [...new Set(data.map(v => v[`title`]))];
                        const names = [...new Set(data.map(v => v[`name`]))];

                        if (data.length > 1) {
                            /**
                             *  Удаляем динамический контент, если он был
                             * */
                            $(`#dropDown`).remove();

                            /***
                             *  Если есть не пустые имена
                             */
                            if (names.some(v => v)) {
                                /***
                                 *  Если их 2 и более вешаем dropDownMenu
                                 */
                                if (names.length > 1) {
                                    /***
                                     *  Добавляем динамический контент
                                     */
                                    $nameInput.after(dropDownTemplate);
                                    const $dropDownMenu = $(`.dropdown-menu`);

                                    // console.log(names);

                                    for (const name of names) {
                                        $dropDownMenu.append(dropMenuItemTemplate.replace(`[title]`, name));
                                    }

                                    const $dropdownMenuLinks = $(`.dropdown-menu a`);
                                    const firstMenuTitle = $dropdownMenuLinks.first().text();

                                    $nameInput.val(firstMenuTitle);
                                    /***
                                     *  Эмитим событие после вставки
                                     */
                                    $nameInput.trigger(`input`);

                                    $dropdownMenuLinks.on(`click`, e => {
                                        e.preventDefault();
                                        const link = $(e.target);

                                        $nameInput.val(link.text());
                                        /***
                                         *  Эмитим событие по клику
                                         */
                                        $nameInput.trigger(`input`);
                                    });
                                } else {
                                    $nameInput.val(names);
                                    /***
                                     *  Эмитим событие после вставки
                                     */
                                    $nameInput.trigger(`input`);
                                }
                            }

                        } else {
                            /**
                             *  Удаляем динамический контент
                             * */
                            $(`#dropDown`).remove();

                            $nameInput.val(names);
                        }

                        $phoneInput.removeClass(`verifying`);
                        $phoneValid.removeClass(`d-none`)
                            .text(titles);

                        if (names.some(v => v)) {
                            $nameInput.addClass(`is-valid`);
                        }

                    } else {
                        /**
                         *  Удаляем динамический контент
                         * */
                        $(`#dropDown`).remove();

                        $phoneInput.removeClass(`is-valid verifying`);
                        $phoneValid.addClass(`d-none`);
                        $nameInput.removeClass(`is-valid`);

                        /**
                         *  Может придётся удалить, что бы не затирал принудительно
                         * */
                        // $nameInput.val(``);
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

                    $nameInput.removeClass(`is-valid`)

                    /**
                     *  Может придётся удалить, что бы не затирал принудительно
                     * */
                    // $nameInput.val(``);

                    $phoneInValid.removeClass(`d-none`);
                })
                .always((jqXHR, textStatus, errorThrown) => {

                });

        }, throttleDelay),
        onKeyPress: (cep, event, currentField, options) => {
        },
        onChange: cep => {
            /***
             *  Если номер введён не полностью
             */
            if (cep.length < 18) {
                $sendButton.attr(`disabled`, true);
            }
        },
        onInvalid: (val, e, f, invalid, options) => {
        }
    };

    /***
     *  Вешаем маску на input
     */
    $phoneInput.mask(`+7 (000) 000 0000`, options);

    $nameInput.on(`input`, e => {
        lockUnlockButton($sendButton);
    });

    $message.on(`input`, e => {
        lockUnlockButton($sendButton);
    });

    /**
     *  Отправка данных формы
     * */
    $form.submit(e => {
        e.preventDefault();

        $.ajax({
            url: `api/send`,
            method: `post`,
            data: $form.serialize(),
            beforeSend: xhr => {
                console.log($form.serialize());
                /***
                 *  Блокировка кнопки
                 */
                $sendButton.addClass(`d-none`);
                $spinnerButton.removeClass(`d-none`);

            }
        })
            .done((data, textStatus, jqXHR) => {
                console.log(`done`);
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                console.log(`fail`);
            })
            .always((jqXHR, textStatus, errorThrown) => {
                /***
                 *  Разблокировка кнопки
                 */
                $sendButton.removeClass(`d-none`);
                $spinnerButton.addClass(`d-none`);
            });
    });

});















