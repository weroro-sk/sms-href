(()=>{"use strict";const t="sms:",e=/^sms:/i,s="body=",n=/.body=/i,r=t=>null!==typeof t&&"object"==typeof t,o=(t,e)=>{if(r(t)&&r(e))for(const s in e){const n=e[s];r(n)?o(t[s],n):t[s]=n}};const i=new class{constructor(t){this.t={allow:{mobile:!0,tablet:!0,facebook:!0},separator:null,encode:!0},this.o=null,o(this.t,t),this.o=this.i()}fixAll(s=document){return new Promise(((n,r)=>{if(!this.o)return n(501);const o=s?.querySelectorAll(`a[href^="${t}"]`);if(!o?.length)return n(404);o.forEach((t=>{const s=t.href.replace(e,"");if(s?.trim())try{t.href=this.fixValue(s,this.t.encode)}catch(t){r(t)}})),n(200)}))}fixValue(r,o){if(!r?.trim())throw new TypeError("SMS href text must be provided.");if("string"!=typeof this.o||!n.test(r))return r;"boolean"!=typeof o&&(o=this.t.encode),o&&(r=this.u(r));return(e.test(r)?"":t)+r?.replace(/&amp;/gi,"&").replace(n,this.o+s)}create(e,n){const r=e?.phone?.toString().trim(),o=e?.message?.trim();if(!r&&!o)throw new TypeError("Phone number or message must be provided.");let i=t;return r&&(i+=r),o&&(i+="@"+s+o),this.fixValue(i,n)}h(t){const e=t.match(/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i)?.[1]?.replace("undefined","3_2").replace("_",".").replace("_","");if(!e||isNaN(+e))return-1;const s=parseInt(e),n=/ipad/i.test(t);return this.l(s,n)}p(t){if(!/android/i.test(t))return-1;const e=!/mobile/i.test(t);return this.l(1,e)}m(t){return/fba[nv]/gi.test(t)?1:-1}u(t){if(t.search(s)<s.length)return t;const e=t.split(s);return e.shift()+s+encodeURIComponent(decodeURIComponent(e.join(s)))}l(t,e){const s=this.t.allow;return s.mobile&&!s.tablet?e?-1:t:s.tablet&&!s.mobile?e?t:-1:t}i(){if(this.t.separator?.trim())return this.t.separator;const t=navigator.userAgent;if(!this.t.allow?.facebook&&this.m(t)>0)return null;if(this.p(t)>0)return"?";const e=this.h(t);return e>0?e<=7?";":"&":null}};i.fixAll().then((t=>{const e=document.querySelector(".info");switch(t){case 200:e.classList.add("bg-success"),e.textContent="All sms: href values in anchors on this webpage was updated";break;case 404:e.classList.add("bg-warning"),e.textContent="Anchors with sms: href value doesn't exist";break;case 501:e.classList.add("bg-danger"),e.textContent="Current platform doesn't support sms: href protocol"}})).catch((t=>console.error(t.message)));document.querySelector(".create").addEventListener("submit",(t=>{c(t,((t,e)=>{try{t.output.value=i.create({phone:t.phone.value,message:t.message.value},t["encode-create"].checked)}catch(t){e.textContent=t.message}}))}));function c(t,e){t.preventDefault();const s=t.srcElement,n=function(t){const e={};for(let s=0;s<t.length;s++){const n=t[s],r=n.id;r&&(e[r]=n)}return e}(s),r=s.querySelector(".text-danger");r.textContent="",e?.(n,r)}document.querySelector(".update").addEventListener("submit",(t=>{c(t,((t,e)=>{try{t.fixed.value=i.fixValue(t["sms-text"].value,t["encode-update"].checked)}catch(t){e.textContent=t.message}}))}))})();
//# sourceMappingURL=demo.js.map