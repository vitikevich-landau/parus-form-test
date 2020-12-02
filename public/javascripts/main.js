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

const successAlertTemplate = `
    <div id="success_send_alert" class="alert alert-success alert-dismissible fade d-none" role="alert">
      Оправлено. Спасибо за обращение...
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
`;

const errorAlertTemplate = `
    <div id="error_send_alert" class="alert alert-danger alert-dismissible fade d-none" role="alert">
      Ошибка соединения с сервером
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
`;

$(() => {
    const $form = $(`#question-form`);
    const $inputPhone = $(`#input_phone`);
    const $inputCompany = $(`#input_company`);
    const $inputName = $(`#input_name`);
    const $textareaMessage = $(`#textarea_message`);

    const $phoneValid = $(`.valid-feedback`);
    const $phoneInValid = $(`.invalid-feedback`);

    const $sendButton = $(`#send_button`);
    const $spinnerButton = $(`#spinner_button`);

    let phoneRequired = false;

    /***
     *
     *  Можно попробовать добавить другие алгоритмы определения
     *  пуста ли сторока (заполнение по маске)
     */
    const inputIsNotEmpty = s => s.trim().length > 0;

    const isFieldsIsNotEmpty = () =>
        phoneRequired &&
        inputIsNotEmpty($inputName.val()) &&
        inputIsNotEmpty($textareaMessage.val());

    const lockUnlockButton = $button =>
        isFieldsIsNotEmpty()
            ? $button.removeAttr(`disabled`)
            : $button.attr(`disabled`, true);

    /*{
        if (isFieldsIsNotEmpty()) {
            $button.removeAttr(`disabled`);
        } else {
            $button.attr(`disabled`, true);
        }
    };*/

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
            phoneRequired = true;

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
                     *
                     *  Убрать alert если не убран
                     *
                     * */
                    $phoneInValid.addClass(`d-none`);
                    $inputPhone
                        .removeClass(`is-invalid`)
                        .addClass(`is-valid verifying`);
                    $inputName.removeClass(`is-valid`);
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
                                    $inputName.after(dropDownTemplate);
                                    const $dropDownMenu = $(`.dropdown-menu`);

                                    for (const name of names) {
                                        $dropDownMenu.append(dropMenuItemTemplate.replace(`[title]`, name));
                                    }

                                    const $dropdownMenuLinks = $(`.dropdown-menu a`);
                                    const firstMenuTitle = $dropdownMenuLinks.first().text();

                                    $inputName.val(firstMenuTitle);
                                    /***
                                     *  Эмитим событие после вставки
                                     */
                                    $inputName.trigger(`input`);

                                    $dropdownMenuLinks.on(`click`, e => {
                                        e.preventDefault();
                                        const link = $(e.target);

                                        $inputName.val(link.text());
                                        /***
                                         *  Эмитим событие по клику
                                         */
                                        $inputName.trigger(`input`);
                                    });
                                } else {
                                    $inputName.val(names);
                                    /***
                                     *  Эмитим событие после вставки
                                     */
                                    $inputName.trigger(`input`);
                                }
                            }

                        } else {
                            /**
                             *  Удаляем динамический контент
                             * */
                            $(`#dropDown`).remove();

                            if (names.some(v => v)) {
                                $inputName.val(names);
                                /***
                                 *  Эмитим событие после вставки
                                 */
                                $inputName.trigger(`input`);
                            }

                        }

                        $inputPhone.removeClass(`verifying`);
                        $phoneValid.removeClass(`d-none`)
                            .text(titles);

                        /***
                         *  Заполнить поле hidden с организацями
                         */
                        $inputCompany.val(titles);

                        if (names.some(v => v)) {
                            $inputName.addClass(`is-valid`);
                        }

                    } else {
                        /**
                         *  Удаляем динамический контент
                         * */
                        $(`#dropDown`).remove();

                        $inputPhone.removeClass(`is-valid verifying`);
                        $phoneValid.addClass(`d-none`);
                        $inputName.removeClass(`is-valid`);

                        /**
                         *  Может придётся удалить, что бы не затирал принудительно
                         * */
                        // $nameInput.val(``);
                        $inputCompany.val(``);
                    }

                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    /**
                     *  Удаляем динамический контент
                     * */
                    $(`#dropDown`).remove();
                    $(`#success_send_alert`).remove();


                    /**
                     *  Добавить классы вывода сообщений об ошибках
                     * */
                    $inputPhone
                        .removeClass(`is-valid verifying`)
                        .addClass(`is-invalid`);

                    $phoneValid.addClass(`d-none`);

                    $inputName.removeClass(`is-valid`)

                    /**
                     *  Может придётся удалить, что бы не затирал принудительно
                     * */
                    // $nameInput.val(``);
                    $inputCompany.val(``);

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
                phoneRequired = false;
            }

            lockUnlockButton($sendButton);
        },
        onInvalid: (val, e, f, invalid, options) => {
        }
    };

    /***
     *  Вешаем маску на input
     */
    $inputPhone.mask(`+7 (000) 000 0000`, options);

    $inputName.on(`input`, e => {
        lockUnlockButton($sendButton);
    });

    $textareaMessage.on(`input`, e => {
        lockUnlockButton($sendButton);
    });

    /**
     *  Отправка данных формы
     * */
    let $alert;
    $form.submit(e => {
        e.preventDefault();

        $.ajax({
            url: `api/send`,
            method: `post`,
            data: $form.serialize(),
            beforeSend: xhr => {
                /***
                 *  Блокировка кнопки
                 */
                $sendButton.addClass(`d-none`);
                $spinnerButton.removeClass(`d-none`);

            }
        })
            .done((data, textStatus, jqXHR) => {
                console.log(`done`);

                if ($alert) {
                    $alert.remove();
                }

                /***
                 *  Вставляем и показываем alert после успешной отправки
                 *
                 */
                $alert = $(`#success_send_alert`);
                /***
                 *  Показываем только в том случае,
                 *  если alert не присутствует на странице
                 */
                if (!$alert.length) {
                    $form.before(successAlertTemplate);

                    $alert = $(`#success_send_alert`);

                    $alert.removeClass(`d-none`);
                    $alert.addClass(`show`);
                }

                /***
                 *  Очищаем поля формы
                 */
                $inputName.val(``);
                $inputPhone.val(``);
                $inputCompany.val(``);
                $textareaMessage.val(``);

                /***
                 *  Эмитим событие изменения
                 */
                $inputPhone.trigger(`input`);

                /***
                 *  Убираем информационные классы верификации в случае удачной отправки
                 *
                 *  Удаляем динамический контент
                 * */
                $(`#dropDown`).remove();

                $inputPhone
                    .removeClass(`is-valid verifying`)
                    .removeClass(`is-invalid`);
                $inputName.removeClass(`is-valid`);

                $phoneValid.addClass(`d-none`);
                $phoneInValid.addClass(`d-none`);


            })
            .fail((jqXHR, textStatus, errorThrown) => {
                console.log(`fail`);

                if ($alert) {
                    $alert.remove();
                }

                /***
                 *  Вставляем и показываем alert ошибка соединения с сервером
                 *
                 */
                $alert = $(`#error_send_alert`);
                /***
                 *  Показываем только в том случае,
                 *  если alert не присутствует на странице
                 */
                if (!$alert.length) {
                    $form.before(errorAlertTemplate);

                    $alert = $(`#error_send_alert`);

                    $alert.removeClass(`d-none`);
                    $alert.addClass(`show`);
                }
            })
            .always((jqXHR, textStatus, errorThrown) => {
                console.log(`always:unlock-button`);
                /***
                 *  Разблокировка кнопки
                 */
                $spinnerButton.addClass(`d-none`);
                $sendButton.removeClass(`d-none`);
            });
    });

});















