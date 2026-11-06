window.onerror=function(msg,url,line){try{var e=document.getElementById('err');if(e){e.style.display='block';e.textContent='ERR: '+msg+' ['+line+']'}}catch(x){}return false};

(function(){
"use strict";

/* STORAGE */
var memStore={};
var Store={get:function(k){try{var v=localStorage.getItem(k);return v===null?(memStore[k]||null):v}catch(e){return memStore[k]||null}},set:function(k,v){memStore[k]=String(v);try{localStorage.setItem(k,String(v))}catch(e){}},remove:function(k){delete memStore[k];try{localStorage.removeItem(k)}catch(e){}}};

var tg=(window.Telegram&&window.Telegram.WebApp)?window.Telegram.WebApp:null;
if(!tg){tg={ready:function(){},expand:function(){},initDataUnsafe:{},CloudStorage:null,HapticFeedback:null}}else{try{tg.ready()}catch(e){}try{tg.expand()}catch(e){}}
var TGU=(tg.initDataUnsafe&&tg.initDataUnsafe.user)||null;
var UID=(TGU&&TGU.id)?String(TGU.id):(Store.get('guest_id')||(function(){var id='g'+Math.random().toString(36).slice(2,10);Store.set('guest_id',id);return id})());
var P='rollup_'+UID+'_';
var ADMIN=['xertex_grace','onyurknees','romasik09','malindak'];
var isAdmin=(function(){var u=TGU&&TGU.username;return u&&ADMIN.indexOf(String(u).toLowerCase())>=0})();

/* HAPTIC/AUDIO */
var vibOn=Store.get('rollup_vib')!=='false';
var sndOn=Store.get('rollup_snd')!=='false';
function haptic(type){try{if(!vibOn||!tg.HapticFeedback)return;if(type==='light')tg.HapticFeedback.impactOccurred('light');else if(type==='medium')tg.HapticFeedback.impactOccurred('medium');else if(type==='heavy')tg.HapticFeedback.impactOccurred('heavy');else if(type==='success')tg.HapticFeedback.notificationOccurred('success');else if(type==='error')tg.HapticFeedback.notificationOccurred('error')}catch(e){}}
var actx=null;
function ia(){if(actx)return;try{actx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function tone(f,d,t,v,dl){try{if(!sndOn||!actx)return;if(actx.state==='suspended')actx.resume();var t0=actx.currentTime+(dl||0);var o=actx.createOscillator();var g=actx.createGain();o.type=t||'sine';o.frequency.setValueAtTime(f||440,t0);g.gain.setValueAtTime(v||.15,t0);g.gain.exponentialRampToValueAtTime(.001,t0+(d||.1));o.connect(g);g.connect(actx.destination);o.start(t0);o.stop(t0+(d||.1))}catch(e){}}
function sClick(){ia();tone(800,.04,'square',.06);haptic('light')}
function sWin(){ia();[523,659,784,1047].forEach(function(f,i){tone(f,.2,'sine',.18,i*.1)});tone(1319,.4,'sine',.15,.4);haptic('success')}
function sLose(){ia();tone(400,.15,'sawtooth',.12,0);tone(300,.15,'sawtooth',.12,.12);tone(200,.35,'sawtooth',.14,.24);haptic('error')}
function sErr(){ia();tone(200,.1,'square',.12,0);tone(150,.2,'square',.12,.1);haptic('error')}
function sTick(){ia();tone(1150+Math.random()*250,.018,'square',.035)}
function sRollWin(){ia();[523,659,784,1047,1319,1568].forEach(function(f,i){tone(f,.2,'sine',.2,i*.09)});haptic('success')}
function sRollBig(){ia();[523,659,784,1047,1319,1568,2093].forEach(function(f,i){tone(f,.3,'sine',.22,i*.11)});haptic('heavy')}
function sBuy(){ia();tone(523,.1,'sine',.15,0);tone(659,.1,'sine',.15,.08);tone(784,.15,'sine',.15,.16)}
function sPromo(){ia();tone(784,.1,'sine',.15,0);tone(1047,.1,'sine',.15,.08);tone(1319,.25,'sine',.15,.16)}
function sExplosion(){if(curScreen!=='rocket')return;ia();tone(80,.6,'sawtooth',.25,0);tone(50,.8,'sawtooth',.22,.05);tone(120,.4,'square',.15,.15);haptic('heavy')}
function sRocketTick(){if(curScreen!=='rocket')return;ia();tone(1400+Math.random()*200,.01,'square',.02)}

/* STATE */
var balance=parseInt(Store.get(P+'balance')||'10000',10);
if(isNaN(balance)||balance<0)balance=10000;
if(isAdmin)balance=20000;
var inventory=[];
try{var inv=JSON.parse(Store.get(P+'inv')||'[]');if(Array.isArray(inv))inventory=inv.filter(function(x){return x&&x.name})}catch(e){}
var used=[];
try{var u=JSON.parse(Store.get(P+'used')||'[]');if(Array.isArray(u))used=u}catch(e){}
var PROMO={'ROMANARMATURA777':10,'CHIHARDEDEP':20};

var FALLBACK=[{name:'Heart Locket',value:15},{name:'Toy Bear',value:15},{name:'Jingle Bells',value:25},{name:'Magic Potion',value:25},{name:'Jelly Bunny',value:25},{name:'Homemade Cake',value:50},{name:'Crystal Ball',value:50},{name:'Top Hat',value:100},{name:'Sakura Flower',value:100},{name:'Clover Pin',value:150},{name:'Bonded Ring',value:180},{name:'Diamond Ring',value:100},{name:"Durov's Cap",value:280},{name:'Cupid Charm',value:350},{name:'Valentine Box',value:420},{name:'Artisan Brick',value:500},{name:'Voodoo Doll',value:600},{name:'Scared Cat',value:700},{name:'Electric Skull',value:850},{name:'Perfume Bottle',value:1000},{name:'Santa Hat',value:1200},{name:'Signet Ring',value:1400},{name:'Swiss Watch',value:1700},{name:'Precious Peach',value:2000},{name:'Plush Pepe',value:2500},{name:'Stellar Rocket',value:3000},{name:'Snoop Dogg',value:3500},{name:'Low Rider',value:4000},{name:'Snoop Cigar',value:4500},{name:'Jolly Chimp',value:5000},{name:'Westside Sign',value:5500},{name:'Kissed Frog',value:6000},{name:'Sharp Tongue',value:6500},{name:'Loot Bag',value:7000},{name:'Trapped Heart',value:8000},{name:'Nail Bracelet',value:9000},{name:'Neko Helmet',value:10000},{name:'Mini Oscar',value:12000},{name:'Gem Signet',value:14000},{name:'Vintage Cigar',value:16000},{name:'Hanging Star',value:18000},{name:'Lunar Snake',value:20000},{name:'Astral Shard',value:24000},{name:'Light Sword',value:28000},{name:'Mighty Arm',value:32000},{name:'Evil Eye',value:38000},{name:'Witch Hat',value:45000},{name:'Liberty Figure',value:55000},{name:"Durov's Glasses",value:65000},{name:'Intelligence Cup',value:80000},{name:'Algorithm Cup',value:95000},{name:"Khabib's Papakha",value:120000},{name:'UFC Strike',value:140000},{name:'Rare Bird',value:170000},{name:'Ion Gem',value:200000},{name:'Hex Pot',value:250000},{name:'Genie Lamp',value:300000},{name:'Tama Gadget',value:400000},{name:'Mirage Lamp',value:600000}];
var CATALOG=FALLBACK.slice();

/* UTILS */
function rarityInfo(v){if(v<100)return{c:'#8a8a95',glow:'rgba(138,138,149,0.5)',bd:'rgba(138,138,149,0.3)'};if(v<500)return{c:'#4b69ff',glow:'rgba(75,105,255,0.6)',bd:'rgba(75,105,255,0.55)'};if(v<2000)return{c:'#8847ff',glow:'rgba(136,71,255,0.7)',bd:'rgba(136,71,255,0.6)'};if(v<10000)return{c:'#d32ce6',glow:'rgba(211,44,230,0.75)',bd:'rgba(211,44,230,0.65)'};if(v<50000)return{c:'#eb4b4b',glow:'rgba(235,75,75,0.85)',bd:'rgba(235,75,75,0.7)'};return{c:'#ffd700',glow:'rgba(255,215,0,0.9)',bd:'rgba(255,215,0,0.8)'}}
function applyRar(el,v){var r=rarityInfo(v);el.style.setProperty('--rar-color',r.c);el.style.setProperty('--rar-glow',r.glow);el.style.setProperty('--rar-bd',r.bd)}
function iconTag(name,size){size=size||64;var n=String(name).replace(/\s+/g,'');var slug=String(name).toLowerCase().replace(/'/g,'').replace(/[^a-z0-9]/g,'');var primary='https://api.changes.tg/original/'+encodeURIComponent(n)+'.png?size='+size;var fb='https://images.weserv.nl/?url='+encodeURIComponent('nft.fragment.com/gift/'+slug+'-1.webp')+'&output=webp&q=85&w='+size+'&h='+size+'&fit=contain';return '<img src="'+primary+'" data-fb="'+fb+'" loading="lazy" onerror="if(!this.dataset.f){this.dataset.f=1;this.src=this.dataset.fb}else{this.style.opacity=0.3}">'}
function fmt(n){n=Math.floor(n||0);if(n>=1e9)return Math.floor(n/1e9)+'B';if(n>=1e6)return Math.floor(n/1e6)+'M';if(n>=1e3)return Math.floor(n/1e3)+'K';return String(n)}
function updBal(){if(isAdmin)balance=20000;var b=document.getElementById('balTxt');if(b)b.textContent=fmt(balance);var sb=document.getElementById('shopBal');if(sb)sb.textContent=fmt(balance)}
function save(){try{Store.set(P+'balance',String(balance));Store.set(P+'inv',JSON.stringify(inventory));Store.set(P+'used',JSON.stringify(used))}catch(e){}try{if(tg.CloudStorage&&!isAdmin){tg.CloudStorage.setItem(P+'balance',String(balance),function(){});tg.CloudStorage.setItem(P+'inv',JSON.stringify(inventory),function(){})}}catch(e){}}
function markUsed(c){if(used.indexOf(c)<0){used.push(c);save()}}
function isUsed(c){return used.indexOf(c)>=0}
function toast(type,text){var t=document.createElement('div');t.className='toast '+type;var ic={success:'✓',error:'✕',info:'i'};t.innerHTML='<span style="font-weight:900;">'+ic[type]+'</span><span>'+text+'</span>';document.body.appendChild(t);requestAnimationFrame(function(){t.classList.add('show')});setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove()},450)},3000)}

/* LOADING PARTICLES */
(function(){var cv=document.getElementById('loadingCanvas');if(!cv)return;var ctx=cv.getContext('2d');var particles=[];var W=0,H=0;function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight}resize();window.addEventListener('resize',resize);for(var i=0;i<40;i++){particles.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,r:1+Math.random()*2,life:Math.random()*Math.PI*2,speed:.01+Math.random()*.02})}var animating=true;function loop(){if(!animating)return;ctx.clearRect(0,0,W,H);particles.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.life+=p.speed;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;var alpha=.3+.5*Math.sin(p.life);ctx.fillStyle='rgba(251,191,36,'+alpha+')';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);g.addColorStop(0,'rgba(251,191,36,'+(alpha*.3)+')');g.addColorStop(1,'rgba(251,191,36,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2);ctx.fill()});requestAnimationFrame(loop)}loop();window.__stopLoadingParticles=function(){animating=false}})();

/* NAV */
var curScreen='menu';
function goScreen(name){curScreen=name;document.querySelectorAll('.scr').forEach(function(s){s.classList.remove('on')});var el=document.getElementById('scr-'+name);if(el)el.classList.add('on');if(name==='rocket'){Rocket.init()}if(name==='roll'){Roll.initCanvas()}}

/* MENU */
function buildMenu(){var g=document.getElementById('menuGrid');if(!g)return;g.innerHTML='';var cards=[{mode:'roll',hero:true,badge:'HOT',title:'ROLL',sub:'Крути и получай звёзды',icon:'Plush Pepe'},{mode:'upgrader',title:'Апгрейдер',desc:'Прокачивай гифты',icon:'Diamond Ring'},{mode:'rocket',title:'Ракетка',desc:'Улетай в космос',icon:'Stellar Rocket'},{mode:'shop',title:'Магазин',desc:'Купить гифты',icon:'Loot Bag'}];cards.forEach(function(c){var b=document.createElement('button');b.type='button';b.className='card glass-panel'+(c.hero?' hero':'');b.setAttribute('data-mode',c.mode);var iconHTML=iconTag(c.icon,128);if(c.hero){b.innerHTML='<div class="card-badge">'+c.badge+'</div><div class="hero-in"><div class="hero-ic">'+iconHTML+'</div><div class="hero-tx"><div class="hero-t">'+c.title+'</div><div class="hero-s">'+c.sub+'</div></div><div class="hero-a">→</div></div>'}else{b.innerHTML='<div class="card-ic">'+iconHTML+'</div><div class="card-t">'+c.title+'</div><div class="card-d">'+c.desc+'</div>'}b.addEventListener('click',function(){sClick();if(c.mode==='upgrader')goScreen('upgrader');else if(c.mode==='rocket')goScreen('rocket');else if(c.mode==='roll'){goScreen('roll');Roll.update()}else if(c.mode==='shop'){goScreen('shop');renderShop()}});g.appendChild(b)})}

/* LIVE DROPS */
function pickWeightedGift(){var r=Math.random();var cat=[];if(r<.72)cat=FALLBACK.filter(function(g){return g.value<200});else if(r<.92)cat=FALLBACK.filter(function(g){return g.value>=200&&g.value<2000});else if(r<.99)cat=FALLBACK.filter(function(g){return g.value>=2000&&g.value<20000});else cat=FALLBACK.filter(function(g){return g.value>=20000});if(!cat.length)cat=FALLBACK;return cat[Math.floor(Math.random()*cat.length)]}
function createDropEl(gift,animate){var el=document.createElement('div');el.className='live-item'+(animate?'':' no-anim');applyRar(el,gift.value);el.innerHTML='<div class="live-icon">'+iconTag(gift.name,48)+'</div><div class="live-info"><div class="live-name">'+gift.name+'</div><div class="live-val">'+fmt(gift.value)+'★</div></div>';return el}
function startDrops(){var track=document.getElementById('dropsTrack');if(!track)return;track.innerHTML='';for(var i=0;i<5;i++)track.appendChild(createDropEl(pickWeightedGift(),false));scheduleNextDrop()}
function scheduleNextDrop(){var d=8000+Math.random()*10000;setTimeout(function(){if(curScreen==='menu'){var track=document.getElementById('dropsTrack');if(track){track.insertBefore(createDropEl(pickWeightedGift(),true),track.firstChild);while(track.children.length>5)track.removeChild(track.lastChild)}}scheduleNextDrop()},d)}

/* UPGRADER */
var selItems=[],targetItem=null,chance=0,multiplier=0,isSpinning=false;
var MULT=[1.2,1.5,2,3,5,10,25,100];
var SPIN_DUR=7500;
var invSearch='',invMin=null,invMax=null,tgtSearch='',tgtMin=null,tgtMax=null;
function sumSel(){return selItems.reduce(function(s,i){return s+(i.value||0)},0)}
function chanceRatio(r){var c=100/r;if(c>99)c=99;if(c<.01)c=.01;return Math.round(c*100)/100}
function chanceLbl(c){if(c>=60)return'высокий';if(c>=30)return'средний';if(c>=10)return'низкий';if(c>=1)return'очень низкий';return'безумие'}
function recompute(){if(!selItems.length||!targetItem){chance=0;multiplier=0;return}var s=sumSel();if(!s){chance=0;multiplier=0;return}var r=targetItem.value/s;chance=chanceRatio(r);multiplier=Math.round(r*100)/100}
function hlMult(){document.querySelectorAll('.mbtn').forEach(function(b){if(!multiplier){b.classList.remove('active');return}b.classList.toggle('active',Math.abs(parseFloat(b.dataset.mult)-multiplier)<.15)})}
function updateArc(){var a=document.getElementById('winArc');if(!a)return;var c=Math.min(99.9,Math.max(.01,chance));var h=c*3.6/2,a0=180-h,a1=180+h;var rad=function(d){return d*Math.PI/180};var lg=(a1-a0)>180?1:0;var ro=49,ri=39;var p=function(r,g){return[50+r*Math.sin(rad(g)),50-r*Math.cos(rad(g))]};var p1=p(ro,a0),p2=p(ro,a1),p3=p(ri,a0),p4=p(ri,a1);a.setAttribute('d','M '+p1[0].toFixed(2)+' '+p1[1].toFixed(2)+' A '+ro+' '+ro+' 0 '+lg+' 1 '+p2[0].toFixed(2)+' '+p2[1].toFixed(2)+' L '+p4[0].toFixed(2)+' '+p4[1].toFixed(2)+' A '+ri+' '+ri+' 0 '+lg+' 0 '+p3[0].toFixed(2)+' '+p3[1].toFixed(2)+' Z')}
function updatePctUI(){if(!selItems.length||!targetItem){var p=document.getElementById('wheelPct');if(p)p.textContent='—';var l=document.getElementById('wheelLbl');if(l)l.textContent='—';var a=document.getElementById('winArc');if(a)a.setAttribute('d','');hlMult();updateUpBtn();return}var p=document.getElementById('wheelPct');if(p)p.textContent=chance.toFixed(2).replace(/\.00$/,'')+'%';var l=document.getElementById('wheelLbl');if(l)l.textContent=chanceLbl(chance);updateArc();hlMult();updateUpBtn()}
function updateUpBtn(){var b=document.getElementById('upBtn');if(b)b.disabled=isSpinning||!selItems.length||!targetItem}
function renderArena(){var fi=document.getElementById('fromIcon'),fn=document.getElementById('fromName'),fv=document.getElementById('fromValue');if(!selItems.length){fi.className='sicon';fi.innerHTML='';fn.textContent='Выбери';fv.textContent='—'}else if(selItems.length===1){var it=selItems[0];fi.className='sicon';fi.innerHTML=iconTag(it.name,128);fn.textContent=it.name;fv.textContent=(it.value||0)+'★';applyRar(fi,it.value||0);applyRar(fv,it.value||0)}else{fi.className='sicon multi';fi.innerHTML=selItems.slice(0,3).map(function(it){return iconTag(it.name,128)}).join('');fn.textContent=selItems.length+' шт';fv.textContent=sumSel()+'★'}var ti=document.getElementById('toIcon'),tn=document.getElementById('toName'),tv=document.getElementById('toValue');if(targetItem){ti.innerHTML=iconTag(targetItem.name,128);tn.textContent=targetItem.name;tv.textContent=(targetItem.value||0)+'★';applyRar(ti,targetItem.value||0);applyRar(tv,targetItem.value||0)}else{ti.innerHTML='';tn.textContent='—';tv.textContent='—'}document.getElementById('fromCard').className='islot glass-panel';document.getElementById('toCard').className='islot glass-panel'}
function renderInv(){var g=document.getElementById('invGrid');if(!g)return;g.innerHTML='';var ic=document.getElementById('invCount');if(ic)ic.textContent='('+inventory.length+')';var list=inventory.filter(function(it){if(invSearch&&it.name.toLowerCase().indexOf(invSearch.toLowerCase())<0)return false;if(invMin!==null&&(it.value||0)<invMin)return false;if(invMax!==null&&(it.value||0)>invMax)return false;return true}).sort(function(a,b){return(a.value||0)-(b.value||0)});if(!list.length){g.innerHTML='<div class="empty">—</div>';return}var frag=document.createDocumentFragment();list.forEach(function(item){var s=document.createElement('div');s.className='slot glass-panel'+(selItems.indexOf(item)>=0?' selected':'');applyRar(s,item.value||0);s.innerHTML='<div class="ssi">'+iconTag(item.name,64)+'</div><div class="sname">'+item.name+'</div><div class="sprice">'+(item.value||0)+'★</div>';s.addEventListener('click',function(){if(isSpinning)return;sClick();var p=selItems.indexOf(item);if(p>=0)selItems.splice(p,1);else selItems.push(item);if(targetItem&&(targetItem.value||0)<=sumSel())targetItem=null;renderInv();renderArena();renderTargets();if(targetItem)recompute();else{chance=0;multiplier=0}updatePctUI()});frag.appendChild(s)});g.appendChild(frag)}
function renderTargets(){var g=document.getElementById('tgtGrid');if(!g)return;g.innerHTML='';if(!selItems.length){g.innerHTML='<div class="empty">—</div>';return}var s=sumSel();var list=CATALOG.filter(function(it){if((it.value||0)<=s)return false;if(tgtSearch&&it.name.toLowerCase().indexOf(tgtSearch.toLowerCase())<0)return false;if(tgtMin!==null&&(it.value||0)<tgtMin)return false;if(tgtMax!==null&&(it.value||0)>tgtMax)return false;return true}).sort(function(a,b){return(a.value||0)-(b.value||0)});if(!list.length){g.innerHTML='<div class="empty">—</div>';return}var frag=document.createDocumentFragment();list.forEach(function(item){var s2=document.createElement('div');s2.className='slot glass-panel'+(targetItem&&targetItem.name===item.name?' selected':'');applyRar(s2,item.value||0);s2.innerHTML='<div class="ssi">'+iconTag(item.name,64)+'</div><div class="sname">'+item.name+'</div><div class="sprice">'+(item.value||0)+'★</div>';s2.addEventListener('click',function(){if(isSpinning)return;sClick();targetItem={name:item.name,value:item.value||0};recompute();updatePctUI();renderTargets();renderArena()});frag.appendChild(s2)});g.appendChild(frag)}
function renderMult(){var g=document.getElementById('multGrid');if(!g)return;g.innerHTML='';MULT.forEach(function(m){var b=document.createElement('button');b.type='button';b.className='mbtn';b.dataset.mult=m;var c=chanceRatio(m);b.innerHTML='×'+m+'<span class="c">'+c.toFixed(c<10?1:0)+'%</span>';b.addEventListener('click',function(){if(isSpinning||!selItems.length)return;sClick();var s=sumSel();var tg=s*m;var cands=CATALOG.filter(function(it){return(it.value||0)>s});if(!cands.length)return;var best=cands.reduce(function(p,c2){return Math.abs((c2.value||0)-tg)<Math.abs((p.value||0)-tg)?c2:p});targetItem={name:best.name,value:best.value||0};recompute();updatePctUI();renderTargets();renderArena()});g.appendChild(b)})}
function confetti(){var colors=['#fff','#10b981','#3b82f6','#a855f7','#fbbf24','#ef4444','#ff6b35'];var cx=window.innerWidth/2,cy=window.innerHeight/2;var count=window.innerWidth<500?40:80;for(var i=0;i<count;i++){(function(){var p=document.createElement('div');p.style.position='fixed';p.style.width='6px';p.style.height='6px';p.style.background=colors[Math.floor(Math.random()*colors.length)];p.style.left=cx+'px';p.style.top=cy+'px';p.style.borderRadius=Math.random()>.5?'50%':'2px';p.style.pointerEvents='none';p.style.zIndex=9999;var a=Math.random()*Math.PI*2;var v=200+Math.random()*400;var dx=Math.cos(a)*v,dy=Math.sin(a)*v-120;p.animate([{transform:'translate(0,0) rotate(0) scale(1)',opacity:1},{transform:'translate('+dx+'px,'+dy+'px) rotate(720deg) scale(0.2)',opacity:0}],{duration:1600,fill:'forwards',easing:'cubic-bezier(.16,1,.3,1)'});document.body.appendChild(p);setTimeout(function(){p.remove()},1800)})()}}
var tickTO=null;
function startSpinAnim(){document.getElementById('wheelWrap').classList.add('spinning');var T0=150,T1=35,E=SPIN_DUR-500,e=0;var loop=function(){sTick();var p=Math.min(1,e/E);var d=T0-(T0-T1)*p;e+=d;if(e<E)tickTO=setTimeout(loop,d)};loop()}
function endSpinAnim(win){clearTimeout(tickTO);document.getElementById('wheelWrap').classList.remove('spinning');if(win)sWin();else sLose()}
function spinWheel(ch,preWin){return new Promise(function(resolve){var p=document.getElementById('wheelPtr');var h=Math.min(179.9,ch*3.6/2);var s0=180-h,s1=180+h;var a;if(preWin){var sp=Math.max(.1,s1-s0-.2);a=s0+.1+Math.random()*sp}else{var o=Math.max(.1,360-(s1-s0)-.2);a=s1+.1+Math.random()*o;if(a>360)a-=360}var t=8+Math.floor(Math.random()*4);var tot=t*360+a;p.style.transition='none';p.style.transform='rotate(0deg)';void p.offsetWidth;p.style.transition='transform '+SPIN_DUR+'ms cubic-bezier(0.15,0.7,0.15,1)';p.style.transform='rotate('+tot+'deg)';var fn=((tot%360)+360)%360;setTimeout(function(){resolve(fn>=s0&&fn<=s1)},SPIN_DUR+100)})}
async function doUpgrade(){if(isSpinning||!selItems.length||!targetItem)return;isSpinning=true;document.getElementById('upBtn').disabled=true;document.getElementById('fromCard').className='islot glass-panel';document.getElementById('toCard').className='islot glass-panel';var s=sumSel();var realChance=Math.min(95,chance*1.07);var win=Math.random()*100<realChance;var cp=selItems.slice();if(win){cp.forEach(function(it){var i=inventory.indexOf(it);if(i>=0)inventory.splice(i,1)});var ni={name:targetItem.name,value:targetItem.value||0};inventory.push(ni);inventory.sort(function(a,b){return(a.value||0)-(b.value||0)});selItems=[];targetItem=null}else{cp.forEach(function(it){var i=inventory.indexOf(it);if(i>=0)inventory.splice(i,1)});selItems=[];targetItem=null}save();startSpinAnim();var w=await spinWheel(chance,win);endSpinAnim(w);if(w){document.getElementById('toCard').classList.add('win');confetti();haptic('success')}else{document.getElementById('toCard').classList.add('lose')}renderInv();renderArena();renderTargets();updatePctUI();setTimeout(function(){isSpinning=false;updateUpBtn()},500)}
document.querySelectorAll('.tab').forEach(function(t){t.addEventListener('click',function(){sClick();document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});document.querySelectorAll('.pv').forEach(function(x){x.classList.remove('active')});t.classList.add('active');var v=document.getElementById('pv-'+t.dataset.tab);if(v)v.classList.add('active');if(t.dataset.tab==='target')renderTargets()})});
document.getElementById('upBtn').addEventListener('click',doUpgrade);
(function(){var a=document.getElementById('invSearch');if(a)a.addEventListener('input',function(){invSearch=a.value;renderInv()});var b=document.getElementById('invMin');if(b)b.addEventListener('input',function(){var v=parseFloat(b.value);invMin=isNaN(v)?null:v;renderInv()});var c=document.getElementById('invMax');if(c)c.addEventListener('input',function(){var v=parseFloat(c.value);invMax=isNaN(v)?null:v;renderInv()});var d=document.getElementById('tgtSearch');if(d)d.addEventListener('input',function(){tgtSearch=d.value;renderTargets()});var e=document.getElementById('tgtMin');if(e)e.addEventListener('input',function(){var v=parseFloat(e.value);tgtMin=isNaN(v)?null:v;renderTargets()});var f=document.getElementById('tgtMax');if(f)f.addEventListener('input',function(){var v=parseFloat(f.value);tgtMax=isNaN(v)?null:v;renderTargets()})})();

/* ROCKET */
var R_WAIT=10,R_FLY=60,R_RESULT=5;
var rocketPhase='waiting',rocketPhaseStart=Date.now(),rocketPhaseDur=R_WAIT;
var rocketBetGift=null,rocketBetActive=false,rocketCrashAt=0,rocketCurrentMult=1,rocketStartTime=0;
var rocketHistory=[],rocketLastTick=0,rocketCashedOut=false,rocketCashoutMult=0;
var autoWdEnabled=Store.get(P+'rocket_autowd_enabled')==='true';
var autoWdValue=parseFloat(Store.get(P+'rocket_autowd_value')||'0')||0;

function generateCrashPoint(){var r=Math.random();var cp=.97/(1-r);return Math.max(1.01,cp)}
function multAt(e){return Math.pow(1.15,e)}
function findGiftInInventory(gift){if(!gift)return-1;for(var i=0;i<inventory.length;i++){if(inventory[i].name===gift.name&&(inventory[i].value||0)===(gift.value||0))return i}return-1}

var Rocket=(function(){
  var hero,ship,trailPath,milestones,speedlines,giftBadge;
  var trailPts=[];
  var defs=[
    {v:1.5,top:86,lbl:'1.5x'},
    {v:2,top:76,lbl:'2x'},
    {v:3,top:66,lbl:'3x'},
    {v:5,top:55,lbl:'5x'},
    {v:10,top:43,lbl:'10x',mega:true},
    {v:25,top:31,lbl:'25x'},
    {v:50,top:19,lbl:'50x',mega:true},
    {v:100,top:8,lbl:'100x',mega:true}
  ];

  function init(){
    hero=document.getElementById('rocket-hero');
    ship=document.getElementById('rocketShip');
    trailPath=document.getElementById('rocketTrailPath');
    milestones=document.getElementById('rocketMilestones');
    speedlines=document.getElementById('rocketSpeedlines');
    giftBadge=document.getElementById('rocketGiftBadge');
    if(!hero)return;
    if(milestones&&!milestones.children.length){
      defs.forEach(function(m){
        var el=document.createElement('div');
        el.className='rocket-milestone'+(m.mega?' mega':'');
        el.dataset.v=m.v;
        el.style.top=m.top+'%';
        el.innerHTML='<span class="dot"></span>'+m.lbl;
        milestones.appendChild(el);
      });
    }
    if(speedlines&&!speedlines.children.length){
      for(var i=0;i<16;i++){
        var l=document.createElement('div');
        l.className='line';
        l.style.left=(Math.random()*100)+'%';
        l.style.top=(Math.random()*100)+'%';
        l.style.animationDelay=(Math.random()*.7)+'s';
        l.style.animationDuration=(.5+Math.random()*.4)+'s';
        speedlines.appendChild(l);
      }
    }
    if(ship&&!ship.children.length){
      ship.innerHTML=iconTag('Stellar Rocket',128);
    }
    if(rocketPhase!=='flying')reset();
  }

  function reset(){
    trailPts=[];
    if(trailPath)trailPath.setAttribute('d','');
    if(ship){ship.className='rocket-ship idle';ship.style.top='90%';ship.style.left='50%';}
    if(hero)hero.classList.remove('flying');
    if(milestones)Array.prototype.forEach.call(milestones.querySelectorAll('.rocket-milestone'),function(el){el.classList.remove('visible','reached')});
  }

  function setFlying(){if(ship)ship.className='rocket-ship flying';if(hero)hero.classList.add('flying')}

  function updatePosition(mult){
    if(!ship)return;
    var prog=Math.pow(Math.min(1,mult/100),.35);
    var topPct=90-prog*87;
    var leftPct=50+Math.sin(prog*10)*4;
    ship.style.top=topPct+'%';
    ship.style.left=leftPct+'%';
    trailPts.push({x:leftPct,y:topPct});
    if(trailPts.length>50)trailPts.shift();
    if(trailPath&&trailPts.length>1){
      var d='M '+trailPts[0].x.toFixed(2)+' '+trailPts[0].y.toFixed(2);
      for(var i=1;i<trailPts.length;i++)d+=' L '+trailPts[i].x.toFixed(2)+' '+trailPts[i].y.toFixed(2);
      trailPath.setAttribute('d',d);
    }
    if(giftBadge&&!giftBadge.classList.contains('hidden')){
      giftBadge.style.left=leftPct+'%';
      giftBadge.style.top=(topPct-8)+'%';
    }
    if(milestones){
      Array.prototype.forEach.call(milestones.querySelectorAll('.rocket-milestone'),function(el){
        var v=parseFloat(el.dataset.v);
        if(mult>=v)el.classList.add('visible','reached');
        else if(mult>=v*.6)el.classList.add('visible');
      });
    }
  }

  function showGiftBadge(gift){
    if(!giftBadge)return;
    if(gift){giftBadge.innerHTML=iconTag(gift.name,64);giftBadge.classList.remove('hidden')}
    else{giftBadge.classList.add('hidden')}
  }

  function explode(){
    if(!hero||!ship)return;
    var hr=hero.getBoundingClientRect();
    var sr=ship.getBoundingClientRect();
    var x=sr.left-hr.left+sr.width/2;
    var y=sr.top-hr.top+sr.height/2;
    var flash=document.createElement('div');
    flash.className='rocket-explosion-flash';
    hero.appendChild(flash);
    setTimeout(function(){flash.remove()},1000);
    [0,120].forEach(function(delay){
      setTimeout(function(){
        var ring=document.createElement('div');
        ring.className='rocket-shock-ring';
        ring.style.left=x+'px';ring.style.top=y+'px';
        hero.appendChild(ring);
        setTimeout(function(){ring.remove()},1400);
      },delay);
    });
    var fb=document.createElement('div');
    fb.className='rocket-fireball';
    fb.style.left=x+'px';fb.style.top=y+'px';
    hero.appendChild(fb);
    setTimeout(function(){fb.remove()},1600);
    var colors=['#ff6b35','#fbbf24','#ef4444','#fff','#ff8590'];
    for(var i=0;i<18;i++){(function(i){
      var d=document.createElement('div');
      d.className='rocket-debris';
      var size=
