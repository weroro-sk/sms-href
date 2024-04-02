/////////////////////
/*************************
 * Run `npm run build` before editing this file
 **************************/
/////////////////////

import {
    SmsHref_PIAPI as SmsHref,
    STATUS_IS_NODE_JS,
    STATUS_NO_SMS_HREFS,
    STATUS_SEPARATOR_NOT_DEFINED,
    STATUS_SMS_HREFS_FIXED
} from "../../lib";
import {translateMessages} from "../../lib/contants";


(async () => {
    const smsHref = new SmsHref();


////////// Helpers

    const action = (evt, callback) => {
        evt.preventDefault();

        const form = evt.srcElement;
        const inputs = getInputs(form);
        const error = form.querySelector('.text-danger');

        error.textContent = '';

        callback?.(inputs, error);
    }

    const getInputs = (form) => {
        const inputs = {}
        for (let index = 0; index < form.length; index++) {
            const input = form[index];
            const id = input.id;
            if (!!id)
                inputs[id] = input;
        }
        return inputs;
    }


////////////
// FIX ALL SMS HREF LINKS
////////////


    const resultCode = await smsHref.__fixAll();

    const info = document.querySelector('.info');

    console.log(resultCode)

    switch (resultCode.code) {
        case STATUS_SMS_HREFS_FIXED:
            info.classList.add('bg-success');
            let message = translateMessages(STATUS_SMS_HREFS_FIXED);
            const err = resultCode.errors;
            if (err.length) {
                message += '\n\n' + err.map(a => [a.href, a.innerHTML]).join('\n');
            }
            info.textContent = message;
            console.log(resultCode.errors);
            break;
        case STATUS_NO_SMS_HREFS:
            info.classList.add('bg-warning');
            info.textContent = translateMessages(STATUS_NO_SMS_HREFS);
            break;
        case STATUS_IS_NODE_JS:
            info.classList.add('bg-danger');
            info.textContent = translateMessages(STATUS_IS_NODE_JS);
            break;
        case STATUS_SEPARATOR_NOT_DEFINED:
            info.classList.add('bg-danger');
            info.textContent = translateMessages(STATUS_SEPARATOR_NOT_DEFINED);
    }

////////////
// CREATE SMS HREF LINK
////////////

    const create = document.querySelector('.create');
    create.addEventListener('submit', (evt) => {
        action(evt, async (inputs, error) => {

            const smsValue = await smsHref.__create(inputs.phone.value, inputs.message.value);

            if (smsValue) {
                inputs.output.value = smsValue
            } else {
                error.textContent = 'sms value error';
            }

        });
    });

////////////
// UPDATE SMS HREF LINK TEXT
////////////

    const update = document.querySelector('.update');
    update.addEventListener('submit', (evt) => {
        action(evt, async (inputs, error) => {

            const fixedValue = await smsHref.__fixValue(inputs['sms-text'].value);

            if (fixedValue) {
                inputs.fixed.value = fixedValue;
            } else {
                error.textContent = 'Fixed value error';
            }

        });
    });


})()
