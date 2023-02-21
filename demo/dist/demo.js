(()=>{"use strict";const t="sms:",e=/^sms:/i,s="body=",r=/.body=/i;const n=new class{constructor(t){this.t={allow:{mobile:!0,tablet:!0,facebook:!0},separator:null,encode:!0},this.o=null,Object.assign(this.t,t),this.o=this.i()}fixAll(s=document){return new Promise(((r,n)=>{if(!this.o)return r(501);const o=s.querySelectorAll(`a[href^="${t}"]`);if(!o.length)return r(404);o.forEach((t=>{const s=t.href.replace(e,"");if(s?.trim())try{t.href=this.fixValue(s,this.t.encode)}catch(t){n(t)}})),r(200)}))}fixValue(n,o){if(!n?.trim())throw new TypeError("SMS href text must be provided.");if("string"!=typeof this.o||!r.test(n))return n;"boolean"!=typeof o&&(o=this.t.encode),o&&(n=this.u(n));return(e.test(n)?"":t)+n?.replace(/&amp;/gi,"&").replace(r,this.o+s)}create(e,r){const n=e?.phone?.toString().trim(),o=e?.message?.trim();if(!n&&!o)throw new TypeError("Phone number or message must be provided.");let i=t;return n&&(i+=n),o&&(i+="@"+s+o),this.fixValue(i,r)}h(t){const e=t.match(/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i)?.[1]?.replace("undefined","3_2").replace("_",".").replace("_","");if(!e||isNaN(+e))return-1;const s=parseInt(e),r=/ipad/i.test(t);return this.l(s,r)}p(t){if(!/android/i.test(t))return-1;const e=!/mobile/i.test(t);return this.l(1,e)}m(t){return/fba[nv]/gi.test(t)}u(t){if(t.search(s)<s.length)return t;const e=t.split(s);return e.shift()+s+encodeURIComponent(decodeURIComponent(e.join(s)))}l(t,e){const s=this.t.allow;return s.mobile&&!s.tablet?e?-1:t:s.tablet&&!s.mobile?e?t:-1:t}i(){if(this.t.separator?.trim())return this.t.separator;const t=navigator.userAgent;if(!this.t.allow?.facebook&&this.m(t))return null;if(this.p(t)>0)return"?";const e=this.h(t);return e>0?7<e?";":"&":null}};n.fixAll().then((t=>{const e=document.querySelector(".info");switch(t){case 200:e.classList.add("bg-success"),e.textContent="All sms: href values in anchors on this webpage was updated";break;case 404:e.classList.add("bg-warning"),e.textContent="Anchors with sms: href value doesn't exist";break;case 501:e.classList.add("bg-danger"),e.textContent="Current platform doesn't support sms: href protocol"}})).catch((t=>console.error(t.message)));document.querySelector(".create").addEventListener("submit",(t=>{o(t,((t,e)=>{try{t.output.value=n.create({phone:t.phone.value,message:t.message.value},t["encode-create"].checked)}catch(t){e.textContent=t.message}}))}));function o(t,e){t.preventDefault();const s=t.srcElement,r=function(t){const e={};for(let s=0;s<t.length;s++){const r=t[s],n=r.id;n&&(e[n]=r)}return e}(s),n=s.querySelector(".text-danger");n.textContent="",e?.(r,n)}document.querySelector(".update").addEventListener("submit",(t=>{o(t,((t,e)=>{try{t.fixed.value=n.fixValue(t["sms-text"].value,t["encode-update"].checked)}catch(t){e.textContent=t.message}}))}))})();
//# sourceMappingURL=demo.js.map