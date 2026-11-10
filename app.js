window.onerror=function(msg,url,line){try{var e=document.getElementById('err');if(e){e.style.display='block';e.textContent='ERR: '+msg+' ['+line+']'}}catch(x){}return false};
(function(){"use strict";var memStore={};var Store={get:function(k){try{var v=localStorage.getItem(k);return v===null?(memStore[k]||null):v}catch(e){return memStore[k]||null}},set:function(k,v){memStore[k]=String(v);try{localStorage.setItem(k,String(v))}catch(e){}},remove:function(k){delete memStore[k];try{localStorage.removeItem(k)}catch(e){}}};
var tg=(window.Telegram&&window.Telegram.WebApp)?window.Telegram.WebApp:null;if(!tg){tg={ready:function(){},expand:function(){},initDataUnsafe:{},CloudStorage:null,HapticFeedback:null}}else{try{tg.ready()}catch(e){}try{tg.expand()}catch(e){}}
var TGU=(tg.initDataUnsafe&&tg.initDataUnsafe.user)||null;var UID=(TGU&&TGU.id)?String(TGU.id):(Store.get('guest_id')||(function(){var id='g'+Math.random().toString(36).slice(2,10);Store.set('guest_id',id);return id})());var P='rollspin_'+UID+'_';
var ADMIN=['xertex_grace','onyurknees','romasik09','malindak'];var isAdmin=(function(){var u=TGU&&TGU.username;return u&&ADMIN.indexOf(String(u).toLowerCase())>=0})();
var vibOn=Store.get('rollspin_vib')!=='false';var sndOn=Store.get('rollspin_snd')!=='false';
function haptic(type){try{if(!vibOn||!tg.HapticFeedback)return;if(type==='light')tg.HapticFeedback.impactOccurred('light');else if(type==='medium')tg.HapticFeedback.impactOccurred('medium');else if(type==='heavy')tg.HapticFeedback.impactOccurred('heavy');else if(type==='success')tg.HapticFeedback.notificationOccurred('success');else if(type==='error')tg.HapticFeedback.notificationOccurred('error')}catch(e){}}
var actx=null;function ia(){if(actx)return;try{actx=new (window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume();}catch(e){}}
function tone(f,d,t,v,dl){try{if(!sndOn||!actx)return;if(actx.state==='suspended')actx.resume();var t0=actx.currentTime+(dl||0);var o=actx.createOscillator();var g=actx.createGain();o.type=t||'sine';o.frequency.setValueAtTime(f||440,t0);g.gain.setValueAtTime(v||.15,t0);g.gain.exponentialRampToValueAtTime(.001,t0+(d||.1));o.connect(g);g.connect(actx.destination);o.start(t0);o.stop(t0+(d||.1))}catch(e){}}
function sClick(){ia();tone(800,.04,'square',.06);haptic('light')}
function sWin(){ia();[523,659,784,1047].forEach(function(f,i){tone(f,.2,'sine',.18,i*.1)});tone(1319,.4,'sine',.15,.4);haptic('success')}
function sLose(){ia();tone(400,.15,'sawtooth',.12,0);tone(300,.15,'sawtooth',.12,.12);tone(200,.35,'sawtooth',.14,.24);haptic('error')}
function sErr(){ia();tone(200,.1,'square',.12,0);tone(150,.2,'square',.12,.1);haptic('error')}
function sTick(){ia();tone(1150+Math.random()*250,.018,'square',.035)}
function sRollBig(){ia();[523,659,784,1047,1319,1568,2093].forEach(function(f,i){tone(f,.3,'sine',.22,i*.11)});haptic('heavy')}
function sBuy(){ia();tone(523,.1,'sine',.15,0);tone(659,.1,'sine',.15,.08);tone(784,.15,'sine',.15,.16)}
function sPromo(){ia();tone(784,.1,'sine',.15,0);tone(1047,.1,'sine',.15,.08);tone(1319,.25,'sine',.15,.16)}
function sExplosion(){if(curScreen!=='rocket')return;ia();tone(80,.6,'sawtooth',.25,0);tone(50,.8,'sawtooth',.22,.05);tone(120,.4,'square',.15,.15);haptic('heavy')}
function sRocketTick(){if(curScreen!=='rocket')return;ia();tone(1400+Math.random()*200,.01,'square',.02)}
function sOpenCase(){ia();tone(200,.3,'sawtooth',.15,0);tone(400,.2,'square',.1,.1);haptic('heavy')}

var balance=parseInt(Store.get(P+'balance')||'20000',10);if(isNaN(balance))balance=20000;
var inventory=[];try{var inv=JSON.parse(Store.get(P+'inv')||'[]');if(Array.isArray(inv))inventory=inv.filter(function(x){return x&&x.name})}catch(e){}
var used=[];try{var u=JSON.parse(Store.get(P+'used')||'[]');if(Array.isArray(u))used=u}catch(e){}
var PROMO={'ROMANARMATURA777':10,'CHIHARDEDEP':20};
var FALLBACK=[
{name:'Heart Locket',value:15},{name:'Toy Bear',value:15},{name:'Jingle Bells',value:25},{name:'Magic Potion',value:25},{name:'Jelly Bunny',value:25},{name:'Homemade Cake',value:50},{name:'Crystal Ball',value:50},{name:'Top Hat',value:100},{name:'Sakura Flower',value:100},{name:'Clover Pin',value:150},{name:'Bonded Ring',value:180},{name:'Diamond Ring',value:100},{name:"Durov's Cap",value:280},{name:'Cupid Charm',value:350},{name:'Valentine Box',value:420},{name:'Artisan Brick',value:500},{name:'Voodoo Doll',value:600},{name:'Scared Cat',value:700},{name:'Electric Skull',value:850},{name:'Perfume Bottle',value:1000},{name:'Santa Hat',value:1200},{name:'Signet Ring',value:1400},{name:'Swiss Watch',value:1700},{name:'Precious Peach',value:2000},{name:'Plush Pepe',value:2500},{name:'Stellar Rocket',value:3000},{name:'Snoop Dogg',value:3500},{name:'Low Rider',value:4000},{name:'Snoop Cigar',value:4500},{name:'Jolly Chimp',value:5000},{name:'Westside Sign',value:5500},{name:'Kissed Frog',value:6000},{name:'Sharp Tongue',value:6500},{name:'Loot Bag',value:7000},{name:'Trapped Heart',value:8000},{name:'Nail Bracelet',value:9000},{name:'Neko Helmet',value:10000},{name:'Mini Oscar',value:12000},{name:'Gem Signet',value:14000},{name:'Vintage Cigar',value:16000},{name:'Hanging Star',value:18000},{name:'Lunar Snake',value:20000},{name:'Astral Shard',value:24000},{name:'Light Sword',value:28000},{name:'Mighty Arm',value:32000},{name:'Evil Eye',value:38000},{name:'Witch Hat',value:45000},{name:'Liberty Figure',value:55000},{name:"Durov's Glasses",value:65000},{name:'Intelligence Cup',value:80000},{name:'Algorithm Cup',value:95000},{name:"Khabib's Papakha",value:120000},{name:'UFC Strike',value:140000},{name:'Rare Bird',value:170000},{name:'Ion Gem',value:200000},{name:'Hex Pot',value:250000},{name:'Genie Lamp',value:300000},{name:'Tama Gadget',value:400000},{name:'Mirage Lamp',value:600000}
];
var CATALOG=FALLBACK.slice();
function rarityInfo(v){if(v<100)return{c:'#8a8a95',glow:'rgba(138,138,149,0.5)',bd:'rgba(138,138,149,0.3)'};if(v<500)return{c:'#4b69ff',glow:'rgba(75,105,255,0.6)',bd:'rgba(75,105,255,0.55)'};if(v<2000)return{c:'#8847ff',glow:'rgba(136,71,255,0.7)',bd:'rgba(136,71,255,0.6)'};if(v<10000)return{c:'#d32ce6',glow:'rgba(211,44,230,0.75)',bd:'rgba(211,44,230,0.65)'};if(v<50000)return{c:'#eb4b4b',glow:'rgba(235,75,75,0.85)',bd:'rgba(235,75,75,0.7)'};return{c:'#ffd700',glow:'rgba(255,215,0,0.9)',bd:'rgba(255,215,0,0.8)'}}
function applyRar(el,v){var r=rarityInfo(v);el.style.setProperty('--rar-color',r.c);el.style.setProperty('--rar-glow',r.glow);el.style.setProperty('--rar-bd',r.bd)}
function getIconUrl(name){var n=String(name).replace(/\s+/g,'');return 'https://api.changes.tg/original/'+encodeURIComponent(n)+'.png?size=128';}
function iconTag(name,size){size=size||64;var n=String(name).replace(/\s+/g,'');var slug=String(name).toLowerCase().replace(/'/g,'').replace(/[^a-z0-9]/g,'');var primary='https://api.changes.tg/original/'+encodeURIComponent(n)+'.png?size='+size;var fb='https://images.weserv.nl/?url='+encodeURIComponent('nft.fragment.com/gift/'+slug+'-1.webp')+'&output=webp&q=85&w='+size+'&h='+size+'&fit=contain';return '<img src="'+primary+'" data-fb="'+fb+'" loading="lazy" onerror="if(!this.dataset.f){this.dataset.f=1;this.src=this.dataset.fb}else{this.style.opacity=0.3}">'}
function fmt(n){n=Math.floor(n||0);if(n>=1e9)return Math.floor(n/1e9)+'B';if(n>=1e6)return Math.floor(n/1e6)+'M';if(n>=1e3)return Math.floor(n/1e3)+'K';return String(n)}
function updBal(){var b=document.getElementById('balTxt');if(b)b.textContent=fmt(balance);var sb=document.getElementById('shopBal');if(sb)sb.textContent=fmt(balance)}
function save(){try{Store.set(P+'balance',String(balance));Store.set(P+'inv',JSON.stringify(inventory));Store.set(P+'used',JSON.stringify(used))}catch(e){}try{if(tg.CloudStorage&&!isAdmin){tg.CloudStorage.setItem(P+'balance',String(balance),function(){});tg.CloudStorage.setItem(P+'inv',JSON.stringify(inventory),function(){})}}catch(e){}}
function markUsed(c){if(used.indexOf(c)<0){used.push(c);save()}}
function isUsed(c){return used.indexOf(c)>=0}
function toast(type,text){var t=document.createElement('div');t.className='toast '+type;var ic={success:'✓',error:'✕',info:'i'};t.innerHTML='<span style="font-weight:900;">'+ic[type]+'</span><span>'+text+'</span>';document.body.appendChild(t);requestAnimationFrame(function(){t.classList.add('show')});setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.remove()},450)},3000)}
(function(){var cv=document.getElementById('loadingCanvas');if(!cv)return;var ctx=cv.getContext('2d');var particles=[];var W=0,H=0;function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight}resize();window.addEventListener('resize',resize);for(var i=0;i<40;i++){particles.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,r:1+Math.random()*2,life:Math.random()*Math.PI*2,speed:.01+Math.random()*.02})}var animating=true;function loop(){if(!animating)return;ctx.clearRect(0,0,W,H);particles.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.life+=p.speed;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;var alpha=.3+.5*Math.sin(p.life);ctx.fillStyle='rgba(255,215,0,'+alpha+')';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);g.addColorStop(0,'rgba(255,215,0,'+(alpha*.3)+')');g.addColorStop(1,'rgba(255,215,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2);ctx.fill()});requestAnimationFrame(loop)}loop();window.__stopLoadingParticles=function(){animating=false}})();
function spawnClickParticles(x, y) {
    var colors = ['#FFD700', '#FF2A55', '#00F0FF', '#ffffff'];
    for (var i = 0; i < 12; i++) {
        var p = document.createElement('div');p.className = 'click-particle';p.style.left = x + 'px';p.style.top = y + 'px';p.style.background = colors[Math.floor(Math.random() * colors.length)];p.style.boxShadow = '0 0 10px ' + p.style.background;
        var angle = Math.random() * Math.PI * 2;var dist = 40 + Math.random() * 60;p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        document.body.appendChild(p);setTimeout(function(el) { el.remove(); }, 600, p);
    }
}
document.addEventListener('pointerdown', function(e) { spawnClickParticles(e.clientX, e.clientY); });

// ============================================================
// ВАШИ ОТПИСКИ НА СТАРТ
// ============================================================
function initializeFirstWin() {
  var r = 0.1;
  var mults = [10, 25, 50, 100, 200];
  var winMult = 1;
  for (var i = 0; i < mults.length; i++) {
    if (r < (i === 0 ? 0.1 : 0.12)) {
      winMult = mults[i];
      break;
    }
  }
  var items = inventory.slice();
  if (items.length === 0) {
    var fallback = [{name: 'Heart Locket', value: 15}, {name: 'Toy Bear', value: 15}];
    items = fallback;
  }
  var winItem = items[Math.floor(Math.random() * items.length)];
  var reward = Math.floor(winItem.value * winMult);
  inventory.push({name: winItem.name, value: winItem.value});
  updBal(); save();
  setTimeout(() => {
    toast('success', 'Стартовый выигрыш! +' + fmt(reward) + ' ★');
    var el = document.createElement('div');
    el.className = 'click-particle';
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.marginLeft = '-4px';
    el.style.marginTop = '-4px';
    el.style.background = 'rgba(255,215,0,0.8)';
    el.style.boxShadow = '0 0 20px rgba(255,215,0,0.9)';
    el.style.width = '8px';
    el.style.height = '8px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }, 500);
}
initializeFirstWin();

var curScreen='menu';
function goScreen(name) {
  if (curScreen === name) return;
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.classList.add('active');
    setTimeout(() => {
      document.querySelectorAll('.scr').forEach(s => s.classList.remove('on'));
      const el = document.getElementById('scr-' + name);
      if (el) el.classList.add('on');
      curScreen = name;
      if (name === 'rocket') Rocket.init();
      if (name === 'roll') Roll.initCanvas();
      if (name === 'cases') renderCases();
      setTimeout(() => { loader.classList.remove('active'); }, 100);
    }, 400);
  } else {
    curScreen = name;
    document.querySelectorAll('.scr').forEach(s => s.classList.remove('on'));
    const el = document.getElementById('scr-' + name);
    if (el) el.classList.add('on');
    if (name === 'rocket') Rocket.init();
    if (name === 'roll') Roll.initCanvas();
    if (name === 'cases') renderCases();
  }
}

function buildMenu(){var g=document.getElementById('menuGrid');if(!g)return;g.innerHTML='';var cards=[{mode:'roll',hero:true,badge:'HOT',title:'ROLL',sub:'Крути и получай звёзды',icon:'Plush Pepe'},{mode:'cases',title:'Кейсы',desc:'Открывай за звёзды',icon:'Red Gift'},{mode:'upgrader',title:'Апгрейдер',desc:'Прокачивай гифты',icon:'Diamond Ring'},{mode:'rocket',title:'Ракетка',desc:'Улетай в космос',icon:'Stellar Rocket'},{mode:'shop',title:'Магазин',desc:'Купить гифты',icon:'Loot Bag'}];cards.forEach(function(c){var b=document.createElement('button');b.type='button';b.className='card glass-panel'+(c.hero?' hero':'');b.setAttribute('data-mode',c.mode);var iconHTML=iconTag(c.icon,128);if(c.hero){b.innerHTML='<div class="card-badge">'+c.badge+'</div><div class="hero-in"><div class="hero-ic">'+iconHTML+'</div><div class="hero-tx"><div class="hero-t">'+c.title+'</div><div class="hero-s">'+c.sub+'</div></div><div class="hero-a">→</div></div>'}else{b.innerHTML='<div class="card-ic">'+iconHTML+'</div><div class="card-t">'+c.title+'</div><div class="card-d">'+c.desc+'</div>'}b.addEventListener('click',function(){sClick();if(c.mode==='upgrader')goScreen('upgrader');else if(c.mode==='rocket')goScreen('rocket');else if(c.mode==='roll'){goScreen('roll');Roll.update()}else if(c.mode==='shop'){goScreen('shop');renderShop()}else if(c.mode==='cases')goScreen('cases')});g.appendChild(b)})}

// ============================================================
// КЕЙСЫ
// ============================================================
var CASES_DATA = [
    { id: 'c1', name: 'Стартовый', price: 500, rarity: 1, pool: FALLBACK.filter(f => f.value <= 200) },
    { id: 'c2', name: 'Редкий', price: 2500, rarity: 2, pool: FALLBACK.filter(f => f.value >= 150 && f.value <= 2000) },
    { id: 'c3', name: 'Эпический', price: 10000, rarity: 3, pool: FALLBACK.filter(f => f.value >= 1000 && f.value <= 10000) },
    { id: 'c4', name: 'Легендарный', price: 50000, rarity: 4, pool: FALLBACK.filter(f => f.value >= 3000) },
    { id: 'c5', name: 'Мифический', price: 200000, rarity: 5, pool: FALLBACK.filter(f => f.value >= 20000) }
];

// ============================================================
// БЕСПЛАТНЫЙ КЕЙС (1 КАНАЛ + ПРОВЕРКА)
// ============================================================
var FREE_CASE = {
    channel: { name: 'Roll&Spin', url: 'https://t.me/RollSpin1', key: 'rollspin' },
    minDeposit: 100,
    minFriends: 5,
    rewardMin: 400,
    rewardMax: 700
};

var freeCaseState = { isSubscribed: false, deposited: 0, friendsInvited: 0, claimed: false };
try {
    var fcs = JSON.parse(Store.get(P + 'freecase') || 'null');
    if (fcs && typeof fcs === 'object') {
        freeCaseState.isSubscribed = !!fcs.isSubscribed;
        freeCaseState.deposited = Number(fcs.deposited) || 0;
        freeCaseState.friendsInvited = Number(fcs.friendsInvited) || 0;
        freeCaseState.claimed = !!fcs.claimed;
    }
} catch(e) {}

function saveFreeCase(){ try{ Store.set(P + 'freecase', JSON.stringify(freeCaseState)); }catch(e){} }
function freeCaseProgress(){
    var depDone = freeCaseState.deposited >= FREE_CASE.minDeposit;
    var friendsDone = freeCaseState.friendsInvited >= FREE_CASE.minFriends;
    return {
        subDone: freeCaseState.isSubscribed,
        depDone: depDone, depAmount: freeCaseState.deposited, depNeeded: FREE_CASE.minDeposit,
        friendsDone: friendsDone, friendsAmount: freeCaseState.friendsInvited, friendsNeeded: FREE_CASE.minFriends,
        allDone: freeCaseState.isSubscribed && depDone && friendsDone, claimed: freeCaseState.claimed
    };
}
function openTgLink(url){ try { if (tg && tg.openLink) { tg.openLink(url); return; } } catch(e){} window.open(url, '_blank'); }
function shareTg(text, url){
    var shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
    try { if (tg && tg.openTelegramLink) { tg.openTelegramLink(shareUrl); return; } } catch(e){}
    window.open(shareUrl, '_blank');
}

var svgBell = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>';
var svgDiamond = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 3h12l4 6-10 13L2 9z"></path></svg>';
var svgUsers = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
var svgCheck = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>';

function createFreeCaseCard(){
    var el = document.createElement('div'); el.className = 'case-menu-card free-case-card'; el.setAttribute('data-rarity', '5');
    var prog = freeCaseProgress();
    var statusLabel = prog.claimed ? 'Получено' : (prog.allDone ? 'ГОТОВО!' : 'ЗАДАНИЯ');
    el.innerHTML = `
        <div class="free-case-badge">FREE</div>
        <div class="free-case-inner">
            <div class="free-case-left"><div class="free-case-icon">${iconTag('Red Gift', 128)}</div></div>
            <div class="free-case-right">
                <div class="free-case-title">Бесплатный кейс</div>
                <div class="free-case-sub">Гифт до ${FREE_CASE.rewardMax}★ за задания</div>
                <div class="free-case-progress">
                    <span class="fcp-item ${prog.subDone?'done':''}">Подписка: ${prog.subDone?'Да':'Нет'}</span>
                    <span class="fcp-item ${prog.depDone?'done':''}">Депозит: ${Math.min(prog.depAmount,prog.depNeeded)}/${prog.depNeeded}</span>
                    <span class="fcp-item ${prog.friendsDone?'done':''}">Друзья: ${Math.min(prog.friendsAmount,prog.friendsNeeded)}/${prog.friendsNeeded}</span>
                </div>
            </div>
        </div>
        <div class="free-case-status ${prog.allDone?'ready':''} ${prog.claimed?'claimed':''}">${statusLabel}</div>
    `;
    el.addEventListener('click', function(){ sClick(); if (prog.claimed) { toast('info','Кейс уже получен'); return; } openFreeCaseModal(); });
    return el;
}

function openFreeCaseModal(){ var modal = document.getElementById('freeCaseModal'); if (!modal) return; renderFreeCaseModal(); modal.classList.add('on'); }

function renderFreeCaseModal(){
    var prog = freeCaseProgress();

    var ch = document.getElementById('fcChannelBox');
    if (ch) {
        ch.className = 'fc-req' + (prog.subDone ? ' done' : '');
        ch.innerHTML = `<div class="fc-req-icon">${prog.subDone ? svgCheck : svgBell}</div><div class="fc-req-info"><div class="fc-req-title">Подписка на ${FREE_CASE.channel.name}</div><div class="fc-req-desc">${prog.subDone?'Подписка подтверждена':'Подписаться на канал'}</div></div><button class="fc-req-btn ${prog.subDone?'done':''}" id="fcSubBtn">${prog.subDone?'Проверить':'Открыть'}</button>`;

        var btn = document.getElementById('fcSubBtn');
        if (btn) btn.addEventListener('click', function(e){
            e.stopPropagation();
            if (prog.subDone) {
                btn.textContent = 'Проверка...';
                btn.disabled = true;
                setTimeout(function() {
                    var stillSubscribed = true;
                    if (stillSubscribed) {
                        toast('success', 'Вы подписаны!');
                    } else {
                        freeCaseState.isSubscribed = false; saveFreeCase(); toast('error', 'Вы отписались!');
                    }
                    renderFreeCaseModal(); renderCases();
                }, 1500);
            } else {
                openTgLink(FREE_CASE.channel.url);
                btn.textContent = 'Проверка...';
                btn.disabled = true;
                setTimeout(function() {
                    freeCaseState.isSubscribed = true;
                    saveFreeCase(); sClick(); toast('success','Подписка подтверждена');
                    renderFreeCaseModal(); renderCases();
                }, 2500);
            }
        });
    }

    var dep = document.getElementById('fcDeposit');
    if (dep) {
        dep.className = 'fc-req' + (prog.depDone ? ' done' : '');
        dep.innerHTML = `<div class="fc-req-icon">${prog.depDone ? svgCheck : svgDiamond}</div><div class="fc-req-info"><div class="fc-req-title">Пополнить на ${FREE_CASE.minDeposit}★</div><div class="fc-req-desc">${prog.depDone?'Выполнено':'Внесено: '+prog.depAmount+'/'+prog.depNeeded+'★'}</div></div><button class="fc-req-btn ${prog.depDone?'done':''}" id="fcDepositBtn" ${prog.depDone?'disabled':''}>${prog.depDone?'Готово':'Пополнить'}</button>`;
        var depBtn = document.getElementById('fcDepositBtn');
        if (depBtn) depBtn.addEventListener('click', function(e){ e.stopPropagation(); sClick(); document.getElementById('freeCaseModal').classList.remove('on'); document.getElementById('starsAmt').value = ''; document.getElementById('starsModal').classList.add('on'); });
    }

    var fr = document.getElementById('fcFriends');
    if (fr) {
        fr.className = 'fc-req' + (prog.friendsDone ? ' done' : '');
        fr.innerHTML = `<div class="fc-req-icon">${prog.friendsDone ? svgCheck : svgUsers}</div><div class="fc-req-info"><div class="fc-req-title">Пригласить ${FREE_CASE.minFriends} друзей</div><div class="fc-req-desc">${prog.friendsDone?'Выполнено':'Приглашено: '+prog.friendsAmount+'/'+prog.friendsNeeded}</div></div><button class="fc-req-btn ${prog.friendsDone?'done':''}" id="fcFriendsBtn" ${prog.friendsDone?'disabled':''}>${prog.friendsDone?'Готово':'Пригласить'}</button>`;
        var frBtn = document.getElementById('fcFriendsBtn');
        if (frBtn) frBtn.addEventListener('click', function(e){
            e.stopPropagation(); sClick();
            shareTg('Залетай в Roll&Spin — крутой казик с гифтами!', 'https://t.me/RollSpinApp_bot?start=ref_' + UID);
            if (freeCaseState.friendsInvited < FREE_CASE.minFriends) {
                frBtn.textContent = 'Проверка...'; frBtn.disabled = true;
                setTimeout(function(){
                    freeCaseState.friendsInvited++; saveFreeCase(); toast('info','Приглашено: ' + freeCaseState.friendsInvited + '/' + FREE_CASE.minFriends);
                    renderFreeCaseModal(); renderCases();
                }, 2500);
            }
        });
    }

    var openBtn = document.getElementById('fcOpenBtn');
    if (openBtn) {
        openBtn.disabled = !prog.allDone; openBtn.textContent = prog.allDone ? 'Открыть бесплатный кейс' : 'Выполни все задания'; openBtn.className = 'btn ' + (prog.allDone ? 'pri' : 'sec');
        openBtn.onclick = function(){
            var p = freeCaseProgress(); if (!p.allDone) { sErr(); return; } if (freeCaseState.claimed) { toast('info','Кейс уже получен'); return; } openFreeCaseReward();
        };
    }
}

function openFreeCaseReward(){
    sOpenCase(); document.getElementById('freeCaseModal').classList.remove('on');
    var pool = CATALOG.filter(function(it){ return (it.value||0) >= FREE_CASE.rewardMin && (it.value||0) <= FREE_CASE.rewardMax; });
    if (!pool.length) pool = CATALOG.slice();
    var winItem = pool[Math.floor(Math.random() * pool.length)];
    inventory.push({name: winItem.name, value: winItem.value||0}); inventory.sort(function(a,b){ return (a.value||0) - (b.value||0); });
    freeCaseState.claimed = true; saveFreeCase(); save();
    setTimeout(function(){ openGiftModal(winItem); sWin(); confetti(); haptic('success'); try { renderInv(); renderArena(); renderTargets(); } catch(e){} renderCases(); }, 400);
}

var isCaseSpinning = false;
var currentCaseData = null;
var menuOffset = 0;
var menuRaf = null;

function renderCases() {
    var g = document.getElementById('caseGrid');
    if (!g) return;
    g.innerHTML = '';
    g.appendChild(createFreeCaseCard());

    CASES_DATA.forEach(function(c) {
        var el = document.createElement('div'); el.className = 'case-menu-card'; el.setAttribute('data-rarity', c.rarity);
        var trackHTML = '<div class="case-menu-track-wrap"><div class="case-menu-track">';
        var safePool = (c.pool && c.pool.length) ? c.pool : FALLBACK;
        for (var i = 0; i < 15; i++) {
            var item = safePool[Math.floor(Math.random() * safePool.length)];
            trackHTML += `<div class="cm-item" style="border-color:${rarityInfo(item.value).c}">${iconTag(item.name, 64)}</div>`;
        }
        for (var i = 0; i < 15; i++) {
            var item = safePool[Math.floor(Math.random() * safePool.length)];
            trackHTML += `<div class="cm-item" style="border-color:${rarityInfo(item.value).c}">${iconTag(item.name, 64)}</div>`;
        }
        trackHTML += '</div></div>';
        el.innerHTML = `${trackHTML}<div class="case-menu-bottom"><div class="cc-name">${c.name}</div><div class="cc-price">${fmt(c.price)} ★</div></div>`;
        el.addEventListener('click', function() { openCaseModal(c); }); g.appendChild(el);
    });
    startMenuLoop();
}

function startMenuLoop() {
    if (menuRaf) cancelAnimationFrame(menuRaf);
    var lastTime = performance.now();
    function animate() {
        if (curScreen !== 'cases' || isCaseSpinning) { lastTime = performance.now(); menuRaf = requestAnimationFrame(animate); return; }
        var now = performance.now(); var dt = now - lastTime; lastTime = now;
        menuOffset -= 0.05 * dt;
        if (Math.abs(menuOffset) >= 15 * 65) { menuOffset = 0; }
        document.querySelectorAll('.case-menu-track').forEach(track => { track.style.transform = `translateX(${menuOffset}px)`; });
        menuRaf = requestAnimationFrame(animate);
    }
    animate();
}

function openCaseModal(c) {
    currentCaseData = c; sClick();
    document.getElementById('caseModalTitle').textContent = c.name;
    document.getElementById('casePriceBtn').textContent = fmt(c.price);
    var poolGrid = document.getElementById('casePoolGrid'); poolGrid.innerHTML = '';
    var safePool = (c.pool && c.pool.length) ? c.pool : FALLBACK;
    var sortedPool = safePool.slice().sort((a,b) => a.value - b.value);
    sortedPool.forEach(function(item) {
        var d = document.createElement('div'); d.className = 'cp-item'; applyRar(d, item.value);
        d.innerHTML = iconTag(item.name, 64) + `<div class="cp-name">${item.name}</div>`; d.onclick = function() { openGiftModal(item); }; poolGrid.appendChild(d);
    });
    var track = document.getElementById('caseTrack'); track.style.transition = 'none'; track.style.transform = 'translateX(0)'; track.innerHTML = '';
    for (var i = 0; i < 50; i++) {
        var it = safePool[Math.floor(Math.random() * safePool.length)];
        var d = document.createElement('div'); d.className = 'case-item'; applyRar(d, it.value); d.innerHTML = iconTag(it.name, 128); track.appendChild(d);
    }
    document.getElementById('openCaseBtn').disabled = false;
    document.getElementById('openCaseBtn').textContent = 'Открыть за ' + fmt(c.price) + ' ★';
    document.getElementById('caseModal').classList.add('on');
}

function openGiftModal(item) {
    sClick(); var modal = document.getElementById('giftModal'); var icon = document.getElementById('viewGiftIcon'); var name = document.getElementById('viewGiftName'); var price = document.getElementById('viewGiftPrice');
    icon.innerHTML = iconTag(item.name, 128); applyRar(icon, item.value); name.textContent = item.name; price.textContent = (item.value || 0) + ' ★'; modal.classList.add('on');
}

var closeGift = document.getElementById('closeGiftModal'); if (closeGift) closeGift.addEventListener('click', function() { sClick(); document.getElementById('giftModal').classList.remove('on'); });
var closeGiftBtn = document.getElementById('closeGiftBtn'); if (closeGiftBtn) closeGiftBtn.addEventListener('click', function() { sClick(); document.getElementById('giftModal').classList.remove('on'); });
var closeCase = document.getElementById('closeCaseModal'); if (closeCase) closeCase.addEventListener('click', function() { if (isCaseSpinning) return; sClick(); document.getElementById('caseModal').classList.remove('on'); });
var closeFreeCase = document.getElementById('closeFreeCaseModal'); if (closeFreeCase) closeFreeCase.addEventListener('click', function() { sClick(); document.getElementById('freeCaseModal').classList.remove('on'); });

var openCaseBtn = document.getElementById('openCaseBtn');
if (openCaseBtn) openCaseBtn.addEventListener('click', function() {
    if (isCaseSpinning) return;
    var c = currentCaseData;
    if (balance < c.price) { sErr(); toast('error', 'Не хватает звёзд'); return; }
    isCaseSpinning = true; balance -= c.price; updBal(); save(); sOpenCase();
    document.getElementById('openCaseBtn').textContent = 'Открывается...'; document.getElementById('openCaseBtn').disabled = true;
    var track = document.getElementById('caseTrack'); track.style.transition = 'none'; track.style.transform = 'translateX(0)'; track.innerHTML = '';
    var safePool = (c.pool && c.pool.length) ? c.pool : FALLBACK;
    var pool = safePool.slice().sort(function(a,b){return a.value - b.value;});
    var r = Math.random(); var winIdx = 0;
    if (r < 0.6) winIdx = Math.floor(Math.random() * Math.floor(pool.length * 0.6));
    else if (r < 0.9) winIdx = Math.floor(pool.length * 0.6 + Math.random() * (pool.length * 0.3));
    else winIdx = Math.floor(pool.length * 0.9 + Math.random() * (pool.length * 0.1));
    if (winIdx >= pool.length) winIdx = pool.length - 1;
    var winItem = pool[winIdx];
    for (var i = 0; i < 50; i++) {
        var it = (i === 45) ? winItem : pool[Math.floor(Math.random() * pool.length)];
        var d = document.createElement('div'); d.className = 'case-item'; applyRar(d, it.value); d.innerHTML = iconTag(it.name, 128); track.appendChild(d);
    }
    var itemWidth = 84 + 8; var wrapWidth = document.querySelector('.case-track-wrap').offsetWidth; var offset = (45 * itemWidth) - (wrapWidth / 2) + (itemWidth / 2);
    setTimeout(function() {
        track.style.transition = 'transform 6s cubic-bezier(0.15, 0.85, 0.3, 1)'; track.style.transform = `translateX(-${offset}px)`;
        var tickInt = setInterval(function(){ sTick(); }, 150);
        setTimeout(function() {
            clearInterval(tickInt); isCaseSpinning = false; inventory.push(winItem); inventory.sort(function(a,b){return(a.value||0)-(b.value||0)}); save();
            var trackItems = track.querySelectorAll('.case-item'); if(trackItems[45]) trackItems[45].classList.add('win-flash');
            document.getElementById('openCaseBtn').textContent = 'Открыть за ' + fmt(c.price) + ' ★'; document.getElementById('openCaseBtn').disabled = false;
            openGiftModal(winItem);
            if (winItem.value > c.price * 1.5) { sWin(); confetti(); document.body.style.animation = 'screenFlashGreen 0.5s'; setTimeout(() => { document.body.style.animation = ''; }, 500); } else { sBuy(); }
        }, 6100);
    }, 100);
});

// ============================================================
// UPGRADER, ROCKET, ROLL, SHOP, PROFILE
// ============================================================
var selItems=[],targetItem=null,chance=0,multiplier=0,isSpinning=false;var MULT=[1.2,1.5,2,3,5,10,25,100];var SPIN_DUR=7500;var invSearch='',invMin=null,invMax=null,tgtSearch='',tgtMin=null,tgtMax=null;
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
var tickTO=null;function startSpinAnim(){document.getElementById('wheelWrap').classList.add('spinning');var T0=150,T1=35,E=SPIN_DUR-500,e=0;var loop=function(){sTick();var p=Math.min(1,e/E);var d=T0-(T0-T1)*p;e+=d;if(e<E)tickTO=setTimeout(loop,d)};loop()}
function endSpinAnim(win){clearTimeout(tickTO);document.getElementById('wheelWrap').classList.remove('spinning');if(win)sWin();else sLose()}
function spinWheel(ch,preWin){return new Promise(function(resolve){var p=document.getElementById('wheelPtr');var h=Math.min(179.9,ch*3.6/2);var s0=180-h,s1=180+h;var a;if(preWin){var sp=Math.max(.1,s1-s0-.2);a=s0+.1+Math.random()*sp}else{var o=Math.max(.1,360-(s1-s0)-.2);a=s1+.1+Math.random()*o;if(a>360)a-=360}var t=8+Math.floor(Math.random()*4);var tot=t*360+a;p.style.transition='none';p.style.transform='rotate(0deg)';void p.offsetWidth;p.style.transition='transform '+SPIN_DUR+'ms cubic-bezier(0.15,0.7,0.15,1)';p.style.transform='rotate('+tot+'deg)';var fn=((tot%360)+360)%360;setTimeout(function(){resolve(fn>=s0&&fn<=s1)},SPIN_DUR+100)})}
async function doUpgrade(){if(isSpinning||!selItems.length||!targetItem)return;isSpinning=true;document.getElementById('upBtn').disabled=true;document.getElementById('fromCard').className='islot glass-panel';document.getElementById('toCard').className='islot glass-panel';var s=sumSel();var realChance=Math.min(95,chance*0.85);var win=Math.random()*100<realChance;var cp=selItems.slice();if(win){cp.forEach(function(it){var i=inventory.indexOf(it);if(i>=0)inventory.splice(i,1)});var ni={name:targetItem.name,value:targetItem.value||0};inventory.push(ni);inventory.sort(function(a,b){return(a.value||0)-(b.value||0)});selItems=[];targetItem=null}else{cp.forEach(function(it){var i=inventory.indexOf(it);if(i>=0)inventory.splice(i,1)});selItems=[];targetItem=null}save();startSpinAnim();var w=await spinWheel(chance,win);endSpinAnim(w);if(w){document.getElementById('toCard').classList.add('win');confetti();haptic('success')}else{document.getElementById('toCard').classList.add('lose')}renderInv();renderArena();renderTargets();updatePctUI();setTimeout(function(){isSpinning=false;updateUpBtn()},500)}

// ROCKET
var R_WAIT=10,R_FLY=60,R_RESULT=5;var rocketPhase='waiting',rocketPhaseStart=Date.now(),rocketPhaseDur=R_WAIT;var rocketBetGift=null,rocketBetActive=false,rocketCrashAt=0,rocketCurrentMult=1,rocketStartTime=0;var rocketHistory=[],rocketLastTick=0,rocketCashedOut=false,rocketCashoutMult=0;var autoWdEnabled=Store.get(P+'rocket_autowd_enabled')==='true';var autoWdValue=parseFloat(Store.get(P+'rocket_autowd_value')||'0')||0;
function generateCrashPoint(){var r=Math.random();var cp=(.97/(1-r))*0.75;return Math.max(1.01,cp)}
function multAt(e){return Math.pow(1.15,e)}
function findGiftInInventory(gift){if(!gift)return-1;for(var i=0;i<inventory.length;i++){if(inventory[i].name===gift.name&&(inventory[i].value||0)===(gift.value||0))return i}return -1}
var Rocket=(function(){var hero,ship,trailPath,milestones,speedlines,giftBadge;var trailPts=[];var defs=[{v:1.5,top:86,lbl:'1.5x'},{v:2,top:76,lbl:'2x'},{v:3,top:66,lbl:'3x'},{v:5,top:55,lbl:'5x'},{v:10,top:43,lbl:'10x',mega:true},{v:25,top:31,lbl:'25x'},{v:50,top:19,lbl:'50x',mega:true},{v:100,top:8,lbl:'100x',mega:true}];
function init(){hero=document.getElementById('rocket-hero');ship=document.getElementById('rocketShip');trailPath=document.getElementById('rocketTrailPath');milestones=document.getElementById('rocketMilestones');speedlines=document.getElementById('rocketSpeedlines');giftBadge=document.getElementById('rocketGiftBadge');if(!hero)return;if(milestones&&!milestones.children.length){defs.forEach(function(m){var el=document.createElement('div');el.className='rocket-milestone'+(m.mega?' mega':'');el.dataset.v=m.v;el.style.top=m.top+'%';el.innerHTML='<span class="dot"></span>'+m.lbl;milestones.appendChild(el)})}if(speedlines&&!speedlines.children.length){for(var i=0;i<16;i++){var l=document.createElement('div');l.className='line';l.style.left=(Math.random()*100)+'%';l.style.top=(Math.random()*100)+'%';l.style.animationDelay=(Math.random()*.7)+'s';l.style.animationDuration=(.5+Math.random()*.4)+'s';speedlines.appendChild(l)}}if(ship&&!ship.children.length){ship.innerHTML=iconTag('Stellar Rocket',128)}if(rocketPhase!=='flying')reset()}
function reset(){trailPts=[];if(trailPath)trailPath.setAttribute('d','');if(ship){ship.className='rocket-ship idle';ship.style.top='90%';ship.style.left='50%'; ship.style.opacity='1';}if(hero)hero.classList.remove('flying');if(milestones)Array.prototype.forEach.call(milestones.querySelectorAll('.rocket-milestone'),function(el){el.classList.remove('visible','reached')})}
function setFlying(){if(ship)ship.className='rocket-ship flying';if(hero)hero.classList.add('flying')}
function updatePosition(mult){if(!ship)return;var prog=Math.pow(Math.min(1,mult/100),.35);var topPct=90-prog*87;var leftPct=50+Math.sin(prog*10)*4;ship.style.top=topPct+'%';ship.style.left=leftPct+'%';trailPts.push({x:leftPct,y:topPct});if(trailPts.length>50)trailPts.shift();if(trailPath&&trailPts.length>1){var d='M '+trailPts[0].x.toFixed(2)+' '+trailPts[0].y.toFixed(2);for(var i=1;i<trailPts.length;i++)d+=' L '+trailPts[i].x.toFixed(2)+' '+trailPts[i].y.toFixed(2);trailPath.setAttribute('d',d)}if(giftBadge&&!giftBadge.classList.contains('hidden')){giftBadge.style.left=leftPct+'%';giftBadge.style.top=(topPct-8)+'%'}if(milestones){Array.prototype.forEach.call(milestones.querySelectorAll('.rocket-milestone'),function(el){var v=parseFloat(el.dataset.v);if(mult>=v)el.classList.add('visible','reached');else if(mult>=v*.6)el.classList.add('visible')})}}
function showGiftBadge(gift){if(!giftBadge)return;if(gift){giftBadge.innerHTML=iconTag(gift.name,64);giftBadge.classList.remove('hidden')}else{giftBadge.classList.add('hidden')}}
function explode(){
  if(!hero||!ship)return; if(ship) { ship.style.opacity = '0'; ship.className = 'rocket-ship'; } if(trailPath) trailPath.setAttribute('d','');
  var hr=hero.getBoundingClientRect();var sr=ship.getBoundingClientRect();var x=sr.left-hr.left+sr.width/2;var y=sr.top-hr.top+sr.height/2;var flash=document.createElement('div');flash.className='rocket-explosion-flash';hero.appendChild(flash);setTimeout(function(){flash.remove()},1000);[0,120].forEach(function(delay){setTimeout(function(){var ring=document.createElement('div');ring.className='rocket-shock-ring';ring.style.left=x+'px';ring.style.top=y+'px';hero.appendChild(ring);setTimeout(function(){ring.remove()},1400)},delay)});var fb=document.createElement('div');fb.className='rocket-fireball';fb.style.left=x+'px';fb.style.top=y+'px';hero.appendChild(fb);setTimeout(function(){fb.remove()},1600);var colors=['#ff6b35','#fbbf24','#ef4444','#fff','#ff8590'];for(var i=0;i<18;i++){(function(i){var d=document.createElement('div');d.className='rocket-debris';var size=4+Math.random()*8;var ang=Math.random()*Math.PI*2;var dist=60+Math.random()*200;d.style.cssText='left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;background:'+colors[i%colors.length]+';--dx:'+(Math.cos(ang)*dist).toFixed(1)+'px;--dy:'+(Math.sin(ang)*dist).toFixed(1)+'px;animation-delay:'+(Math.random()*.08)+'s';hero.appendChild(d);setTimeout(function(){d.remove()},2000)})(i)}for(var i=0;i<24;i++){(function(i){var s=document.createElement('div');s.className='rocket-spark';var ang=Math.random()*Math.PI*2;var dist=100+Math.random()*300;var sz=2+Math.random()*3;s.style.cssText='left:'+x+'px;top:'+y+'px;width:'+sz+'px;height:'+sz+'px;background:#fff;border-radius:50%;box-shadow:0 0 8px #ffd93d;--dx:'+(Math.cos(ang)*dist).toFixed(1)+'px;--dy:'+(Math.sin(ang)*dist).toFixed(1)+'px;animation-delay:'+(Math.random()*.1)+'s';hero.appendChild(s);setTimeout(function(){s.remove()},2200)})(i)}hero.classList.remove('shaking');void hero.offsetWidth;hero.classList.add('shaking');setTimeout(function(){hero.classList.remove('shaking')},700)}
return {init:init,reset:reset,setFlying:setFlying,updatePosition:updatePosition,showGiftBadge:showGiftBadge,explode:explode};})();
function renderRocketHistory(){var el=document.getElementById('rocket-history');if(!el)return;el.innerHTML=rocketHistory.slice(0,15).map(function(h){var c;if(h<1.5)c='low';else if(h<10)c='mid';else c='high';return '<div class="rh-item '+c+'">'+h.toFixed(2)+'x</div>'}).join('')}
function setRocketTimer(sec){var el=document.getElementById('rocket-timer');if(!el)return;var s=Math.max(0,Math.ceil(sec));if(el.textContent!==String(s))el.textContent=s}
function updateRocketBtn(){var btn=document.getElementById('rocket-btn');if(!btn)return;var row=document.getElementById('rocket-bet-row');if(!row)return;var phase=document.getElementById('rocket-phase');var phaseTxt=document.getElementById('rocket-phase-text');if(rocketPhase==='waiting'){if(phase)phase.className='rph waiting';if(phaseTxt)phaseTxt.textContent='Приём ставок';if(rocketBetActive){btn.textContent='Ставка принята';btn.disabled=true;btn.classList.remove('cashout','cashed')}else if(rocketBetGift){btn.textContent='Поставить';btn.disabled=false;btn.classList.remove('cashout','cashed')}else{btn.textContent='Выбери гифт';btn.disabled=true;btn.classList.remove('cashout','cashed')}}else if(rocketPhase==='flying'){if(phase)phase.className='rph flying';if(phaseTxt)phaseTxt.textContent=rocketCashedOut?'Летит дальше':'Взлёт';if(rocketBetActive&&!rocketCashedOut){btn.textContent='Забрать '+rocketCurrentMult.toFixed(2)+'x';btn.classList.add('cashout');btn.disabled=false;btn.classList.remove('cashed')}else if(rocketCashedOut){btn.textContent='Забрано на '+rocketCashoutMult.toFixed(2)+'x';btn.classList.remove('cashout');btn.classList.add('cashed');btn.disabled=true}else{btn.textContent='Не участвую';btn.disabled=true;btn.classList.remove('cashout','cashed')}}else{if(phase)phase.className='rph result';if(phaseTxt)phaseTxt.textContent='Результат';btn.textContent='Ждите раунд';btn.disabled=true;btn.classList.remove('cashout','cashed')}if(rocketBetGift){row.className='bet-gift-row glass-panel';applyRar(row,rocketBetGift.value||0);var showEdit=rocketPhase==='waiting'&&!rocketBetActive;row.innerHTML='<div class="bet-gift-icon">'+iconTag(rocketBetGift.name,64)+'</div><div class="bet-gift-info"><div class="bet-gift-name">'+rocketBetGift.name+'</div><div class="bet-gift-value">'+(rocketBetGift.value||0)+'★'+(rocketBetActive?' · принята':'')+'</div></div>'+(showEdit?'<div class="bet-gift-edit">Изм.</div>':'')}else{row.className='bet-gift-row glass-panel empty-bet';row.innerHTML='<div class="bg-label">Нажми чтобы выбрать гифт</div>'}var awdRow=document.getElementById('rocket-autowd-row');if(awdRow)awdRow.classList.toggle('disabled',rocketPhase!=='waiting');if(rocketPhase==='waiting'||rocketPhase==='flying')Rocket.showGiftBadge(rocketBetGift);else Rocket.showGiftBadge(null)}
function rocketTick(){try{var elapsed=(Date.now()-rocketPhaseStart)/1000;var remaining=Math.max(0,rocketPhaseDur-elapsed);if(curScreen==='rocket')setRocketTimer(remaining);if(rocketPhase==='waiting'){if(remaining<=0){rocketPhase='flying';rocketPhaseStart=Date.now();rocketPhaseDur=R_FLY;rocketCrashAt=generateCrashPoint();rocketCurrentMult=1;rocketStartTime=Date.now();rocketLastTick=0;rocketCashedOut=false;rocketCashoutMult=0;Rocket.reset();Rocket.setFlying();var mult=document.getElementById('rocket-mult');if(mult){mult.className='rocket-mult-hero growing';mult.textContent='1.00x'}updateRocketBtn();return}}else if(rocketPhase==='flying'){var elapsedFly=(Date.now()-rocketStartTime)/1000;var m=multAt(elapsedFly);rocketCurrentMult=m;if(elapsedFly-rocketLastTick>.1){rocketLastTick=elapsedFly;if(rocketBetActive&&!rocketCashedOut&&curScreen==='rocket')sRocketTick()}if(autoWdEnabled&&rocketBetActive&&!rocketCashedOut&&autoWdValue>=1.01&&m>=autoWdValue){cashOutRocket(true)}var multEl=document.getElementById('rocket-mult');if(multEl){multEl.textContent=m.toFixed(2)+'x';if(m>=3)multEl.classList.add('hot')}var pf=document.getElementById('rocket-progress-fill');if(pf)pf.style.width=Math.min(100,Math.pow(m/100,.35)*100)+'%';if(curScreen==='rocket')Rocket.updatePosition(m);if(m>=rocketCrashAt||remaining<=0){rocketCurrentMult=Math.min(rocketCrashAt,m);endRocketFlight()}else if(rocketBetActive&&!rocketCashedOut)updateRocketBtn()}else if(rocketPhase==='result'){if(remaining<=0){rocketPhase='waiting';rocketPhaseStart=Date.now();rocketPhaseDur=R_WAIT;rocketBetActive=false;rocketCurrentMult=1;rocketCashedOut=false;Rocket.reset();var mult2=document.getElementById('rocket-mult');if(mult2){mult2.className='rocket-mult-hero';mult2.textContent='1.00x'}updateRocketBtn()}}}catch(e){}}
function endRocketFlight(){if(rocketPhase!=='flying')return;rocketPhase='result';rocketPhaseStart=Date.now();rocketPhaseDur=R_RESULT;Rocket.explode();sExplosion();var mult=document.getElementById('rocket-mult');if(mult){mult.className='rocket-mult-hero crashed';mult.textContent=rocketCurrentMult.toFixed(2)+'x'}rocketHistory.unshift(rocketCurrentMult);rocketHistory=rocketHistory.slice(0,20);renderRocketHistory();rocketBetActive=false;updateRocketBtn();}
function placeRocketBet(){if(rocketPhase!=='waiting')return;if(rocketBetActive)return;if(!rocketBetGift){sErr();toast('error','Выбери гифт');return}var i=findGiftInInventory(rocketBetGift);if(i<0){rocketBetGift=null;updateRocketBtn();sErr();return}var removed=inventory[i];inventory.splice(i,1);var si=selItems.indexOf(removed);if(si>=0)selItems.splice(si,1);rocketBetActive=true;save();renderInv();renderArena();renderTargets();updatePctUI();updateRocketBtn();sBuy()}
function cashOutRocket(isAuto){if(rocketPhase!=='flying')return;if(!rocketBetActive||rocketCashedOut)return;var bv=rocketBetGift?(rocketBetGift.value||0):0;var win=Math.floor(bv*rocketCurrentMult);balance+=win;updBal();rocketCashedOut=true;rocketCashoutMult=rocketCurrentMult;save();var mult=document.getElementById('rocket-mult');if(mult)mult.className='rocket-mult-hero cashed';var toastEl=document.getElementById('rocket-cashout-toast');if(toastEl&&curScreen==='rocket'){toastEl.textContent=(isAuto?'Авто · ':'')+'+'+fmt(win)+'★';toastEl.classList.add('show');setTimeout(function(){toastEl.classList.remove('show')},2200)}if(curScreen==='rocket')confetti();haptic('success');updateRocketBtn()}

document.getElementById('rocket-btn').addEventListener('click',function(){sClick();if(rocketPhase==='waiting'&&!rocketBetActive)placeRocketBet();else if(rocketPhase==='flying'&&rocketBetActive&&!rocketCashedOut)cashOutRocket(false)});

document.getElementById('rocket-bet-row').addEventListener('click',function(){if(rocketPhase!=='waiting')return;if(rocketBetActive)return;if(!inventory.length){sErr();toast('error','Нет гифтов');return}sClick();openPicker('rocket')});
(function(){var inp=document.getElementById('rocket-autowd-input');var on=document.getElementById('autowd-on');var off=document.getElementById('autowd-off');if(inp)inp.value=autoWdValue>0?autoWdValue:'';if(autoWdEnabled&&on&&off){on.classList.add('active');off.classList.remove('active')}else if(on&&off){off.classList.add('active');on.classList.remove('active')}if(inp)inp.addEventListener('input',function(){var v=parseFloat(inp.value);autoWdValue=isNaN(v)?0:v;Store.set(P+'rocket_autowd_value',String(autoWdValue))});if(on)on.addEventListener('click',function(){autoWdEnabled=true;Store.set(P+'rocket_autowd_enabled','true');on.classList.add('active');off.classList.remove('active');sClick()});if(off)off.addEventListener('click',function(){autoWdEnabled=false;Store.set(P+'rocket_autowd_enabled','false');off.classList.add('active');on.classList.remove('active');sClick()})})();

// ROLL
var ROLL_COST=100;var SEG_ANGLE=30;var ROLL_SEG=[{amount:500,realW:.8,c1:'#fbbf24',c2:'#d97706'},{amount:200,realW:.8,c1:'#a855f7',c2:'#7c3aed'},{amount:200,realW:.8,c1:'#a855f7',c2:'#7c3aed'},{amount:100,realW:.8,c1:'#06b6d4',c2:'#0891b2'},{amount:100,realW:.8,c1:'#06b6d4',c2:'#0891b2'},{amount:100,realW:.8,c1:'#06b6d4',c2:'#0891b2'},{amount:0,realW:5.0,c1:'#3a3a4a',c2:'#1a1a26'},{amount:10,realW:1.2,c1:'#1a3050',c2:'#0a1525'},{amount:10,realW:1.2,c1:'#1a3050',c2:'#0a1525'}, {amount:25,realW:1.2,c1:'#3a2050',c2:'#180d28'}, {amount:25,realW:1.2,c1:'#3a2050',c2:'#180d28'}, {amount:50,realW:1.2,c1:'#1a4030',c2:'#0a1e18'}];var rollLast=0,rollBest=0,rollRot=0,rollSpinning=false;
var Roll=(function(){var cv,ctx,anim,lastT=0;var particles=[];function initCanvas(){cv=document.getElementById('rollCanvas');if(!cv)return;var board=document.getElementById('rBoard');if(!board)return;cv.width=board.clientWidth||340;cv.height=board.clientHeight||440;ctx=cv.getContext('2d');if(!anim)loop()}function loop(){anim=requestAnimationFrame(loop);if(!ctx)return;var now=performance.now();var dt=Math.min(50,now-lastT)/1000||.016;lastT=now;var W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);for(var i=particles.length-1;i>=0;i--){var p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.15;p.life-=dt*1.2;if(p.life<=0){particles.splice(i,1);continue}ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1}function burst(count){var W=cv.width,H=cv.height;var colors=['#fbbf24','#ff6b35','#a855f7','#06b6d4','#10b981'];for(var i=0;i<count;i++){var ang=Math.random()*Math.PI*2;var spd=2+Math.random()*8;particles.push({x:W*.5,y:H*.5,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd-2,life:1,size:3+Math.random()*5,color:colors[Math.floor(Math.random()*colors.length)]})}}function starPts(cx,cy,o,i,p){var a=[];for(var k=0;k<p*2;k++){var r=k%2===0?o:i;var an=(k*Math.PI/p)-Math.PI/2;a.push((cx+r*Math.cos(an)).toFixed(1)+','+(cy+r*Math.sin(an)).toFixed(1))}return a.join(' ')}
function buildWheel(){var svg=document.getElementById('rollSvg');if(!svg)return;var N=ROLL_SEG.length;var sA=360/N;var cx=100,cy=100;var ro=92,ri=48,rI=72,sO=15,sI=6;var h='<defs>';h+='<linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff8c0"/><stop offset="25%" stop-color="#ffd93d"/><stop offset="50%" stop-color="#c88000"/><stop offset="75%" stop-color="#ffd93d"/><stop offset="100%" stop-color="#fff8c0"/></linearGradient>';ROLL_SEG.forEach(function(seg,i){h+='<linearGradient id="sg'+i+'" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="'+seg.c1+'"/><stop offset="100%" stop-color="'+seg.c2+'"/></linearGradient>'});h+='</defs>';h+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(ro+22)+'" fill="#000"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(ro+14)+'" fill="none" stroke="url(#gold)" stroke-width="7"/>';for(var i=0;i<N;i++){var sC=i*sA-sA/2,eC=i*sA+sA/2;var sM=(sC-90)*Math.PI/180,eM=(eC-90)*Math.PI/180;var p0x=(cx+ro*Math.cos(sM)).toFixed(1),p0y=(cy+ro*Math.sin(sM)).toFixed(1);var p1x=(cx+ro*Math.cos(eM)).toFixed(1),p1y=(cy+ro*Math.sin(eM)).toFixed(1);var p2x=(cx+ri*Math.cos(eM)).toFixed(1),p2y=(cy+ri*Math.sin(eM)).toFixed(1);var p3x=(cx+ri*Math.cos(sM)).toFixed(1),p3y=(cy+ri*Math.sin(sM)).toFixed(1);h+='<path d="M '+p0x+' '+p0y+' A '+ro+' '+ro+' 0 0 1 '+p1x+' '+p1y+' L '+p2x+' '+p2y+' A '+ri+' '+ri+' 0 0 0 '+p3x+' '+p3y+' Z" fill="url(#sg'+i+')" stroke="rgba(255,217,61,0.85)" stroke-width="1.2"/>'}for(var i=0;i<N;i++){var seg=ROLL_SEG[i];h+='<g transform="rotate('+(i*sA)+' '+cx+' '+cy+')"><polygon points="'+starPts(cx,cy-rI,sO,sI,5)+'" fill="url(#gold)" stroke="'+(seg.amount>=100?'#ffd93d':'#fff')+'" stroke-width="0.9"/><text x="'+cx+'" y="'+(cy-rI+20)+'" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="9.5" fill="'+(seg.amount>=100?'#ffd93d':'#fff')+'" style="paint-order:stroke;stroke:rgba(0,0,0,1);stroke-width:4px;">'+seg.amount+'</text></g>'}h+='<circle cx="'+cx+'" cy="'+cy+'" r="'+ri+'" fill="none" stroke="url(#gold)" stroke-width="3"/>';svg.innerHTML=h}
function update(){var btn=document.getElementById('rollSpinBtn');if(btn){btn.textContent='Крутить за '+ROLL_COST+' ★';btn.disabled=rollSpinning||balance<ROLL_COST}}
function pickByRealW(){var total=ROLL_SEG.reduce(function(s,x){return s+x.realW},0);var r=Math.random()*total;for(var i=0;i<ROLL_SEG.length;i++){r-=ROLL_SEG[i].realW;if(r<=0)return i}return ROLL_SEG.length-1}
function getTargetAngle(idx){var base=idx*SEG_ANGLE;if(ROLL_SEG[idx].amount<100&&Math.random()<.25){for(var d=1;d<=2;d++){if(idx-d>=0&&ROLL_SEG[idx-d].amount>=100)return base-12+(Math.random()-.5)*3;if(idx+d<ROLL_SEG.length&&ROLL_SEG[idx+d].amount>=100)return base+12+(Math.random()-.5)*3}}return base+(Math.random()-.5)*8}
function spin(){if(rollSpinning)return;if(balance<ROLL_COST){sErr();toast('error','Нужно '+ROLL_COST+' ★');return}rollSpinning=true;balance-=ROLL_COST;updBal();save();var wrap=document.getElementById('rWW');if(wrap)wrap.classList.add('spinning');var idx=pickByRealW();var targetAngle=getTargetAngle(idx);var finalRot=(360-targetAngle)%360;if(finalRot<0)finalRot+=360;rollRot=rollRot+360*6+((finalRot-(rollRot%360))+360)%360;var w=document.getElementById('rollWheel');if(w){w.style.transition='transform 5s cubic-bezier(.15,.7,.15,1)';w.style.transform='rotate('+rollRot+'deg)'}var tickCount=60;var tickIdx=0;var tickInt=setInterval(function(){sTick();tickIdx++;if(tickIdx>=tickCount)clearInterval(tickInt)},80);setTimeout(function(){clearInterval(tickInt);rollSpinning=false;if(wrap)wrap.classList.remove('spinning');if(w){rollRot=((rollRot%360)+360)%360;w.style.transform='rotate('+rollRot+'deg)'}var seg=ROLL_SEG[idx];var cv2=document.getElementById('rollCenter');if(seg.amount>0){balance+=seg.amount}rollLast=seg.amount;if(seg.amount>rollBest)rollBest=seg.amount;if(cv2){if(seg.amount===0){cv2.innerHTML='<span class="cvm" style="color:#ff6b7a;">0★</span>';sLose();}else if(seg.amount>=100){cv2.innerHTML='<span class="cvm">'+seg.amount+'★</span>';sRollBig();burst(60);confetti();haptic('success');}else{cv2.innerHTML='<span class="cvm" style="color:var(--dim);">'+seg.amount+'★</span>';sLose();}}updBal();save();update()},5200)}
return {initCanvas:initCanvas,buildWheel:buildWheel,update:update,spin:spin};})();

document.getElementById('rollSpinBtn').addEventListener('click',function(){sClick();Roll.spin()});

// SHOP, PROFILE, MODALS
function renderShop(){var g=document.getElementById('shopGrid');if(!g)return;g.innerHTML='';var sS=document.getElementById('shopSearch'),sMin=document.getElementById('shopMin'),sMax=document.getElementById('shopMax');var q=sS?sS.value.toLowerCase():'';var mi=sMin&&sMin.value?parseFloat(sMin.value):null;var ma=sMax&&sMax.value?parseFloat(sMax.value):null;var list=CATALOG.filter(function(it){if(q&&it.name.toLowerCase().indexOf(q)<0)return false;if(mi!==null&&!isNaN(mi)&&(it.value||0)<mi)return false;if(ma!==null&&!isNaN(ma)&&(it.value||0)>ma)return false;return true}).sort(function(a,b){return(a.value||0)-(b.value||0)});if(!list.length){g.innerHTML='<div class="empty">—</div>';return}var frag=document.createDocumentFragment();list.forEach(function(item){var s=document.createElement('div');s.className='slot glass-panel'+((item.value||0)>balance?' disabled':'');applyRar(s,item.value||0);s.innerHTML='<div class="ssi">'+iconTag(item.name,64)+'</div><div class="sname">'+item.name+'</div><div class="sprice">'+(item.value||0)+'★</div>';s.addEventListener('click',function(){sClick();openBuy(item)});frag.appendChild(s)});g.appendChild(frag)}
var buyItem=null;function openBuy(item){buyItem=item;var bi=document.getElementById('buyIcon');bi.innerHTML=iconTag(item.name,128);applyRar(bi,item.value||0);document.getElementById('buyName').textContent=item.name;document.getElementById('buyPrice').textContent=(item.value||0)+' ★';document.getElementById('buyConfirm').disabled=(item.value||0)>balance;document.getElementById('buyModal').classList.add('on')}

document.getElementById('buyCancel').addEventListener('click',function(){sClick();document.getElementById('buyModal').classList.remove('on')});

document.getElementById('buyConfirm').addEventListener('click',function(){if(!buyItem)return;if((buyItem.value||0)>balance)return;balance-=(buyItem.value||0);updBal();inventory.push({name:buyItem.name,value:buyItem.value||0});inventory.sort(function(a,b){return(a.value||0)-(b.value||0)});save();sBuy();document.getElementById('buyModal').classList.remove('on');renderInv();renderArena();renderTargets();renderShop()});
(function(){var s=document.getElementById('shopSearch');if(s)s.addEventListener('input',renderShop);var mn=document.getElementById('shopMin');if(mn)mn.addEventListener('input',renderShop);var mx=document.getElementById('shopMax');if(mx)mx.addEventListener('input',renderShop)})();
var pickMode=null;function openPicker(mode){if(!inventory.length){sErr();return}pickMode=mode;var g=document.getElementById('pickGrid');if(!g)return;g.innerHTML='';var sorted=inventory.slice().sort(function(a,b){return(a.value||0)-(b.value||0)});sorted.forEach(function(it){var d=document.createElement('div');d.className='slot glass-panel';applyRar(d,it.value||0);d.innerHTML='<div class="ssi">'+iconTag(it.name,64)+'</div><div class="sname">'+it.name+'</div><div class="sprice">'+(it.value||0)+'★</div>';d.addEventListener('click',function(){sClick();if(pickMode==='rocket'){rocketBetGift={name:it.name,value:it.value||0};updateRocketBtn()}document.getElementById('pickModal').classList.remove('on')});g.appendChild(d)});document.getElementById('pickModal').classList.add('on')}

document.getElementById('pickClose').addEventListener('click',function(){sClick();document.getElementById('pickModal').classList.remove('on')});

document.getElementById('plusBtn').addEventListener('click',function(){sClick();document.getElementById('starsAmt').value='';document.getElementById('starsModal').classList.add('on')});

document.getElementById('starsClose').addEventListener('click',function(){sClick();document.getElementById('starsModal').classList.remove('on')});

document.getElementById('starsOk').addEventListener('click',function(){
    var amt = parseInt(document.getElementById('starsAmt').value,10);
    if(!amt || amt <= 0) { sErr(); return; }
    balance += amt; updBal(); save(); sClick(); toast('success','+'+fmt(amt)+' ★');
    freeCaseState.deposited += amt; saveFreeCase();
    setTimeout(function(){
        document.getElementById('starsModal').classList.remove('on');
        var fcModal = document.getElementById('freeCaseModal');
        if (fcModal && fcModal.classList.contains('on')) renderFreeCaseModal();
        if (curScreen === 'cases') renderCases();
    }, 500);
});

document.getElementById('promoBtn').addEventListener('click',function(){sClick();document.getElementById('promoMsg').textContent='';document.getElementById('promoInput').value='';document.getElementById('promoModal').classList.add('on')});

document.getElementById('promoClose').addEventListener('click',function(){sClick();document.getElementById('promoModal').classList.remove('on')});

document.getElementById('promoOk').addEventListener('click',function(){var code=document.getElementById('promoInput').value.trim().toUpperCase();var m=document.getElementById('promoMsg');if(!code){m.style.color='#ef4444';m.textContent='Введи код';sErr();return}if(!PROMO[code]){m.style.color='#ef4444';m.textContent='Неверный';sErr();return}if(isUsed(code)){m.style.color='#ef4444';m.textContent='Использован';sErr();return}var r=PROMO[code];balance+=r;updBal();markUsed(code);save();m.style.color='#10b981';m.textContent='+'+r+' ★';sPromo();haptic('success');setTimeout(function(){document.getElementById('promoModal').classList.remove('on')},1200)});

document.getElementById('settingsBtn').addEventListener('click',function(){sClick();document.getElementById('vibToggle').checked=vibOn;document.getElementById('sndToggle').checked=sndOn;document.getElementById('settingsModal').classList.add('on')});

document.getElementById('settingsClose').addEventListener('click',function(){sClick();document.getElementById('settingsModal').classList.remove('on')});

document.getElementById('vibToggle').addEventListener('change',function(e){vibOn=e.target.checked;Store.set('rollspin_vib',vibOn?'true':'false')});

document.getElementById('sndToggle').addEventListener('change',function(e){sndOn=e.target.checked;Store.set('rollspin_snd',sndOn?'true':'false')});


document.getElementById('profileBtn').addEventListener('click',function(){sClick();renderProfile();document.getElementById('profileModal').classList.add('on')});

document.getElementById('profileClose').addEventListener('click',function(){sClick();document.getElementById('profileModal').classList.remove('on')});
function renderProfile(){
  var u=TGU||{};
  var name=u.first_name?((u.first_name||'')+(u.last_name?' '+u.last_name:'')):('Игрок'+(u.id?' #'+u.id:''));
  var av=document.getElementById('pAva');
  if(av){if(u.photo_url)av.innerHTML='<img src="'+u.photo_url+'" alt="">';else av.textContent=(u.first_name||'И').charAt(0).toUpperCase()}
  document.getElementById('pName').textContent=name;
  document.getElementById('pInvCount').textContent=inventory.length;
  document.getElementById('pAdmin').style.display=isAdmin?'inline-flex':'none';
  var admCard = document.getElementById('adminCard');
  if(admCard) admCard.style.display = isAdmin ? 'block' : 'none';

  var il=document.getElementById('pInvList');
  if(il){
    il.innerHTML='';
    if(!inventory.length){il.innerHTML='<div class="empty" style="grid-column:1/-1;text-align:center;color:var(--dim);font-size:11px;padding:24px 8px;">Пусто</div>'}
    else{
      var srt=inventory.slice().sort(function(a,b){return(b.value||0)-(a.value||0)});
      srt.forEach(function(it, index){
        var c=document.createElement('div');
        c.className='invc';
        applyRar(c,it.value||0);
        c.innerHTML=`
            <img src="${getIconUrl(it.name)}" onclick="event.stopPropagation(); window.openGiftFromProfile(${index})">
            <div class="iname">${it.name}</div>
            <div class="iprice">${(it.value||0)} ★</div>
            <button class="sell-btn" onclick="event.stopPropagation(); window.sellItem(${index})">Продать</button>
        `;
        il.appendChild(c);
      });
    }
  }
}

window.sellItem = function(index) {
    var srt=inventory.slice().sort(function(a,b){return(b.value||0)-(a.value||0)});
    var item = srt[index];
    if(!item) return;
    balance += item.value; updBal(); inventory.splice(inventory.indexOf(item), 1); save(); sBuy(); renderProfile(); renderInv(); renderArena(); renderTargets();
    toast('success', 'Продано за +' + fmt(item.value) + ' ★');
}

window.openGiftFromProfile = function(index) {
    var srt=inventory.slice().sort(function(a,b){return(b.value||0)-(a.value||0)});
    var item = srt[index];
    if(item) openGiftModal(item);
}

var withdrawBtn = document.getElementById('withdrawBtn');
if(withdrawBtn) {
    withdrawBtn.addEventListener('click', function() { sClick(); toast('info', 'Вывод доступен с 2.1.0 (в разработке)'); });
}

var admClear = document.getElementById('admClearInv');
if (admClear) admClear.addEventListener('click',function(){if(!isAdmin)return;inventory=[];selItems=[];targetItem=null;save();renderInv();renderArena();renderTargets();updatePctUI();toast('success','Очищено')});
var admWipeBtn = document.getElementById('admWipe');
if (admWipeBtn) admWipeBtn.addEventListener('click',function(){if(!isAdmin)return;try{localStorage.clear()}catch(e){}toast('success','Вайп');setTimeout(function(){location.reload()},600)});


document.getElementById('newsBtn').addEventListener('click',function(){sClick();document.getElementById('newsModal').classList.add('on')});

document.getElementById('newsClose').addEventListener('click',function(){sClick();document.getElementById('newsModal').classList.remove('on')});

document.getElementById('logoBtn').addEventListener('click',function(){if(curScreen==='menu')return;sClick();goScreen('menu')});

function setLoad(p,text){var bar=document.getElementById('loadingBar');var txt=document.getElementById('loadingText');if(bar)bar.style.width=p+'%';if(txt&&text!==undefined)txt.textContent=text}
function runLoad(dur,done){var start=performance.now();var stages=[{t:0,s:'Инициализация...'},{t:.12,s:'Интерфейс...'},{t:.28,s:'Режимы...'},{t:.45,s:'Инвентарь...'},{t:.62,s:'Каталог...'}, {t:.80,s:'Финал...'},{t:.94,s:'Почти...'},{t:1,s:'Готово!'}];var last=-1;function tick(now){var p=Math.min(1,(now-start)/dur);setLoad(p*100);for(var i=stages.length-1;i>=0;i--){if(p>=stages[i].t){if(i>last){last=i;setLoad(p*100,stages[i].s)}break}}if(p<1)requestAnimationFrame(tick);else setTimeout(done,350)}requestAnimationFrame(tick)}

function loadCatalog(cb){
    var done=false; function fin(){if(done)return;done=true;if(cb)cb()}
    setTimeout(fin,3000);
    fetch('https://api.changes.tg/original/list?size=200').then(function(r){return r.json()}).then(function(data){
        var items=[]; if(Array.isArray(data))items=data; else if(data&&Array.isArray(data.gifts))items=data.gifts; else if(data&&Array.isArray(data.items))items=data.items; else if(data&&Array.isArray(data.result))items=data.result;
        if(!items.length){CATALOG=FALLBACK.slice();fin();return}
        var map=new Map(); FALLBACK.forEach(function(f){ map.set(f.name, {name:f.name, value:f.value}); });
        items.forEach(function(it){ var name=it.name||it.title||it.slug; if(!name)return; if(map.has(name)) return; var val=Number(it.value||it.price||0)||0; map.set(name, {name:String(name), value:val||10}); });
        CATALOG=Array.from(map.values()).sort(function(a,b){return(a.value||0)-(b.value||0)}); fin()
    }).catch(function(){CATALOG=FALLBACK.slice();fin()})
}

function boot(){
  document.addEventListener('touchstart', ia, {once:true}); document.addEventListener('click', ia, {once:true});
  document.body.classList.add('loading-active');
  try{updBal()}catch(e){} try{buildMenu()}catch(e){} try{renderMult();renderInv();renderArena();renderTargets();updatePctUI()}catch(e){} try{Roll.buildWheel();Roll.update();renderRocketHistory();renderShop()}catch(e){} try{Rocket.init()}catch(e){}
  setInterval(function() { const el = document.getElementById('onlineCount'); if(el) el.textContent = Math.floor(Math.random() * 3) + 1; }, 5000);
  loadCatalog(function(){try{renderInv();renderArena();renderTargets();renderShop()}catch(e){}});
  runLoad(2600,function(){ var loading=document.getElementById('loading');if(loading)loading.classList.add('hide'); if(window.__stopLoadingParticles)window.__stopLoadingParticles(); setTimeout(function(){document.body.classList.remove('loading-active');document.body.style.overflow='';document.body.style.position=''},100); try{Rocket.init();rocketPhase='waiting';rocketPhaseStart=Date.now();rocketPhaseDur=R_WAIT;updateRocketBtn()}catch(e){} })
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

setInterval(rocketTick,50);
})();
