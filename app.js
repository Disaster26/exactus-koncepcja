(function(){
var d=document;
/* menu */
var b=d.querySelector('.burger'),m=d.getElementById('menu');
function zamknij(){m.classList.remove('otw');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Otwórz menu')}
b.addEventListener('click',function(){var o=m.classList.toggle('otw');b.setAttribute('aria-expanded',o?'true':'false');b.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij)});
d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij()});

/* aktywna pozycja menu */
var linki=[].slice.call(m.querySelectorAll('a[href^="#"]'));
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(w){w.forEach(function(x){if(x.isIntersecting){linki.forEach(function(a){a.setAttribute('aria-current',a.getAttribute('href')==='#'+x.target.id?'true':'false')})}})},{rootMargin:'-45% 0px -50% 0px'});
 linki.forEach(function(a){var s=d.querySelector(a.getAttribute('href'));if(s)io.observe(s)});
 /* dolny pasek po przewinieciu za przycisk */
 var mob=d.getElementById('mob'),cta=d.getElementById('cta');
 new IntersectionObserver(function(w){var widac=!w[0].isIntersecting&&w[0].boundingClientRect.top<0;mob.classList.toggle('widac',widac);d.body.classList.toggle('ma-mob',true)}).observe(cta);
}

/* przewijanie rzedow mysza + strzalki */
d.querySelectorAll('.rzad').forEach(function(r){
 var x0,s0,ruch=false,wcis=false;
 r.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;wcis=true;ruch=false;x0=e.clientX;s0=r.scrollLeft});
 r.addEventListener('pointermove',function(e){if(!wcis)return;var dx=e.clientX-x0;if(Math.abs(dx)>5){ruch=true;r.classList.add('ciag')}if(ruch){r.scrollLeft=s0-dx}});
 function koniec(){wcis=false;setTimeout(function(){r.classList.remove('ciag')},0)}
 r.addEventListener('pointerup',koniec);r.addEventListener('pointerleave',koniec);
 r.addEventListener('click',function(e){if(ruch){e.preventDefault();ruch=false}},true);
});
d.querySelectorAll('.przes').forEach(function(p){
 var r=d.getElementById(p.dataset.rzad),w=p.querySelector('.wst'),n=p.querySelector('.dal');
 function krok(){var c=r.firstElementChild;return c?c.getBoundingClientRect().width+16:300}
 w.addEventListener('click',function(){r.scrollBy({left:-krok()*2,behavior:'smooth'})});
 n.addEventListener('click',function(){r.scrollBy({left:krok()*2,behavior:'smooth'})});
 function stan(){w.disabled=r.scrollLeft<4;n.disabled=r.scrollLeft+r.clientWidth>=r.scrollWidth-4}
 r.addEventListener('scroll',stan,{passive:true});window.addEventListener('resize',stan);stan();
});

/* lightbox */
var lb=d.getElementById('lb'),li=lb.querySelector('img'),lp=lb.querySelector('p'),zd=[].slice.call(d.querySelectorAll('#gal button')),ix=0,ost;
function pokaz(i){ix=(i+zd.length)%zd.length;var z=zd[ix];li.src=z.dataset.duze;li.alt=z.dataset.opis;lp.innerHTML='';lp.appendChild(d.createTextNode(z.dataset.opis));var s=d.createElement('span');s.textContent=(ix+1)+' / '+zd.length;lp.appendChild(s)}
zd.forEach(function(z,i){z.addEventListener('click',function(){ost=z;pokaz(i);lb.classList.add('otw');lb.querySelector('.zam').focus()})});
function zam(){lb.classList.remove('otw');if(ost)ost.focus()}
lb.querySelector('.zam').addEventListener('click',zam);
lb.querySelector('.pop').addEventListener('click',function(){pokaz(ix-1)});
lb.querySelector('.nas').addEventListener('click',function(){pokaz(ix+1)});
lb.addEventListener('click',function(e){if(e.target===lb)zam()});
d.addEventListener('keydown',function(e){if(!lb.classList.contains('otw'))return;if(e.key==='Escape')zam();if(e.key==='ArrowLeft')pokaz(ix-1);if(e.key==='ArrowRight')pokaz(ix+1)});
var tx=null;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40)pokaz(ix+(dx<0?1:-1));tx=null});

/* filmy: odtwarzacz dopiero po kliknieciu */
d.querySelectorAll('[data-film]').forEach(function(btn){btn.addEventListener('click',function(){
 var v=d.createElement('video');v.src=btn.dataset.film;v.controls=true;v.autoplay=true;v.playsInline=true;v.setAttribute('preload','auto');
 btn.parentNode.replaceChild(v,btn);var p=v.play();if(p&&p.catch)p.catch(function(){});
})});

/* formularz pokazowy */
var f=d.getElementById('form');f.addEventListener('submit',function(e){e.preventDefault();d.getElementById('form-ok').style.display='block'});

/* zgoda + mapa */
var zg=d.getElementById('zgoda'),mapa=d.getElementById('mapa'),mb=d.getElementById('mapa-btn');
function zapisz(v){try{localStorage.setItem('ex-zgoda',v)}catch(e){}zg.hidden=true}
function wstawMape(){if(mapa.querySelector('iframe'))return;var i=d.createElement('iframe');i.title='Mapa: Al. Kościuszki 17, Łódź';i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';i.src='https://www.google.com/maps?q=Aleja+Tadeusza+Ko%C5%9Bciuszki+17,+90-418+%C5%81%C3%B3d%C5%BA&z=16&output=embed';mapa.appendChild(i);mapa.classList.add('jest')}
function zgoda(){try{return localStorage.getItem('ex-zgoda')==='tak'}catch(e){return false}}
d.getElementById('zg-tak').addEventListener('click',function(){zapisz('tak');if(mapaWidac)wstawMape()});
d.getElementById('zg-nie').addEventListener('click',function(){zapisz('nie')});
mb.addEventListener('click',function(){zapisz('tak');wstawMape()});
var mapaWidac=false;
if('IntersectionObserver' in window){new IntersectionObserver(function(w){if(w[0].isIntersecting){mapaWidac=true;if(zgoda())wstawMape()}},{rootMargin:'300px'}).observe(mapa)}
})();
