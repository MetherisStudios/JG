
const WA='59898100017';
document.querySelectorAll('[data-wa]').forEach(a=>{a.href='https://wa.me/'+(a.dataset.n||WA)+'?text='+encodeURIComponent(a.dataset.wa);a.target='_blank';a.rel='noopener'});

const hd=document.getElementById('hd');
addEventListener('scroll',()=>hd.classList.toggle('sc',scrollY>8),{passive:true});

const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function count(el){
 const to=+el.dataset.to,d=+el.dataset.d,fmt=new Intl.NumberFormat('es-UY',{minimumFractionDigits:d,maximumFractionDigits:d});
 if(still){el.textContent=fmt.format(to);return}
 const t0=performance.now();
 (function step(t){const p=Math.min((t-t0)/1300,1);el.textContent=fmt.format(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)})(t0);
}
const io=new IntersectionObserver(es=>es.forEach(e=>{
 if(!e.isIntersecting)return;
 e.target.classList.add('in');
 e.target.querySelectorAll('[data-to]').forEach(count);
 io.unobserve(e.target);
}),{threshold:.15});
document.querySelectorAll('.rv,.stats').forEach(el=>io.observe(el));

const f=document.getElementById('f'),st=document.getElementById('st');
const q=n=>document.getElementById('f-'+n);
const nm=q('nombre'),ap=q('apellido'),em=q('email'),ph=q('phone'),ms=q('message'),tp=q('topic'),rp=f.querySelector('[name=replyto]'),sb=f.querySelector('[name=subject]');
const LET='A-Za-zÁÉÍÓÚÜÑáéíóúüñ';
[nm,ap].forEach(el=>el.addEventListener('input',()=>{el.value=el.value.replace(new RegExp("[^"+LET+"'’ -]","g"),'')}));
ph.addEventListener('input',()=>{ph.value=ph.value.replace(/[^\d+ -]/g,'')});
const letters=v=>v.replace(new RegExp("[^"+LET+"]","g"),'').length>=2;
const rules=[
 [nm,letters,'Ingresá tu nombre (solo letras).'],
 [ap,letters,'Ingresá tu apellido (solo letras).'],
 [em,v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),'Ingresá un correo válido, por ejemplo nombre@correo.com.'],
 [ph,v=>/^(\+?598)?(09\d{7}|9\d{7}|[24]\d{7})$/.test(v.replace(/[\s-]/g,'')),'Ingresá un teléfono válido de Uruguay, por ejemplo 099 123 456.'],
 [ms,v=>v.trim().length>=10&&(v.match(new RegExp("["+LET+"]","g"))||[]).length>=5,'Escribí un mensaje de al menos 10 caracteres.']
];
const check=r=>{const ok=r[1](r[0].value),e=r[0].parentElement.querySelector('.er');e.textContent=ok?'':r[2];r[0].setAttribute('aria-invalid',ok?'false':'true');return ok};
rules.forEach(r=>{r[0].addEventListener('blur',()=>check(r));r[0].addEventListener('input',()=>{if(r[0].getAttribute('aria-invalid')==='true')check(r)})});

f.addEventListener('submit',async e=>{
 e.preventDefault();
 const bad=rules.filter(r=>!check(r));if(bad.length){bad[0][0].focus();return}
 rp.value=em.value.trim();sb.value='Jota Garaje: consulta de '+nm.value.trim()+' '+ap.value.trim()+': '+tp.value;
 const b=f.querySelector('button');b.disabled=true;b.textContent='Enviando...';st.className='';st.textContent='';
 try{
  const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{Accept:'application/json'},body:new FormData(f)});
  const j=await r.json();
  if(!j.success)throw 0;
  f.reset();document.getElementById('fields').hidden=true;document.getElementById('ok').hidden=false;
 }catch(_){
  st.className='er';st.innerHTML='No pudimos enviar el mensaje. <a target="_blank" rel="noopener">Escribinos por WhatsApp</a>.';
  st.querySelector('a').href='https://wa.me/'+WA+'?text='+encodeURIComponent('Hola, te escribo desde la web de Jota Garaje.');
 }
 b.disabled=false;b.textContent='Enviar consulta';
});

document.getElementById('again').addEventListener('click',()=>{document.getElementById('ok').hidden=true;document.getElementById('fields').hidden=false;st.textContent=''});
const ck=document.getElementById('chk'),cr=document.getElementById('c-r');
ck.addEventListener('submit',e=>{
 e.preventDefault();
 const s=+document.getElementById('c-s').value,a=document.getElementById('c-a').value==='1',c=document.getElementById('c-c').value;
 cr.className='';
 if(!s){cr.className='er';cr.textContent='Ingresá tu sueldo mensual para continuar.';return}
 let t,p;
 if(c==='x'){p='quiero confirmar si estoy en clearing';t='Primero necesitamos confirmar si estás en clearing. Escribinos y lo vemos juntos. Con la financiación de la casa, el clearing no importa.'}
 else if(c==='n'&&a&&s>31000){p='el paquete bancario';t='Según los requisitos publicados, podrías acceder al paquete bancario: hasta el 100% del valor en hasta 60 cuotas.'}
 else{p='la financiación de la casa';t='Te conviene la financiación de la casa: financiás el 50% en hasta 36 cuotas y el clearing no importa. Necesitás entregar el 50% y contar con un garante.'}
 const msg='Hola Jota Garaje, hice la consulta en la web. Sueldo: $'+s+', antigüedad: '+(a?'6 meses o más':'menos de 6 meses')+', clearing: '+({n:'no',s:'sí',x:'no sé'})[c]+'. Me interesa '+p+'.';
 cr.innerHTML='<p></p><small>Sujeto a aprobación crediticia.</small><br><a class="btn sm" target="_blank" rel="noopener">Consultar con estos datos</a>';
 cr.querySelector('p').textContent=t;
 cr.querySelector('a').href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
});

if(INTRO){
 const intro=document.getElementById('intro'),root=document.documentElement;
 let done=0;const end=()=>{if(done)return;done=1;intro.classList.add('out');root.classList.remove('wait');setTimeout(()=>intro.remove(),600)};
 if(still){intro.remove();root.classList.remove('wait')}else{setTimeout(end,1500);['wheel','touchmove','keydown','click'].forEach(e=>addEventListener(e,end,{passive:true}))}
}
