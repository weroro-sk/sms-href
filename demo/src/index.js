/////////////////////
/*************************
 * Run `npm run build` before editing this file
 **************************/
/////////////////////
import {CODE_NOT_FOUND, CODE_SUCCESS, CODE_UNSUPPORTED_OS, SmsHref} from "../../lib";

const smsHref = new SmsHref();

////////////
// FIX ALL SMS HREF LINKS
////////////

smsHref.fixAll()
    .then((resultCode) => {
        /** @type {HTMLElement} */
        const info = document.querySelector('.info');
        switch (resultCode) {
            case CODE_SUCCESS:
                info.classList.add('bg-success');
                info.textContent = 'All sms: href values in anchors on this webpage was updated';
                break;
            case CODE_NOT_FOUND:
                info.classList.add('bg-warning');
                info.textContent = 'Anchors with sms: href value doesn\'t exist';
                break;
            case CODE_UNSUPPORTED_OS:
                info.classList.add('bg-danger');
                info.textContent = 'Current platform doesn\'t support sms: href protocol';
                break;
        }
    })
    .catch(err => console.error(err.message));

////////////
// CREATE SMS HREF LINK
////////////

const create = document.querySelector('.create');
create.addEventListener('submit', (evt) => {
    action(evt, (inputs, error) => {
        try {
            inputs.output.value = smsHref.create(
                {
                    phone: inputs.phone.value,
                    message: inputs.message.value
                },
                inputs['encode-create'].checked
            );
        } catch (err) {
            error.textContent = err.message;
        }
    });
});

////////////
// UPDATE SMS HREF LINK TEXT
////////////

const update = document.querySelector('.update');
update.addEventListener('submit', (evt) => {
    action(evt, (inputs, error) => {
        try {
            inputs.fixed.value = smsHref.fixValue(
                inputs['sms-text'].value,
                inputs['encode-update'].checked
            );
        } catch (err) {
            error.textContent = err.message;
        }
    });
});


////////// Helpers

function action(evt, callback) {
    evt.preventDefault();

    const form = evt.srcElement;
    const inputs = getInputs(form);
    const error = form.querySelector('.text-danger');

    error.textContent = '';

    callback?.(inputs, error);
}

function getInputs(form) {
    const inputs = {}
    for (let index = 0; index < form.length; index++) {
        const input = form[index];
        const id = input.id;
        if (!!id)
            inputs[id] = input;
    }
    return inputs;
}
