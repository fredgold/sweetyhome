/* ============ tab switching ============ */
let propsPanelHeightRaf=null;
function syncPropsPanelHeight(){
  const panel=document.getElementById('panel-props');
  if(!panel?.classList.contains('on')||window.innerWidth<900) return;
  const top=panel.getBoundingClientRect().top+window.scrollY;
  document.documentElement.style.setProperty('--props-panel-top',top+'px');
}
function schedulePropsPanelHeight(){
  if(propsPanelHeightRaf) cancelAnimationFrame(propsPanelHeightRaf);
  propsPanelHeightRaf=requestAnimationFrame(()=>{
    propsPanelHeightRaf=null;
    syncPropsPanelHeight();
  });
}
document.getElementById('panel-props').addEventListener('animationend',e=>{
  if(e.target===e.currentTarget) schedulePropsPanelHeight();
});
function switchPanel(name){
  activePanel=name;
  if(name!=='props' && typeof exitRouteMode==='function' && routeMode!=='off') exitRouteMode();
  document.querySelectorAll('.atab[data-panel]').forEach(b=>b.dataset.on=b.dataset.panel===name?'1':'0');
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('on',p.id==='panel-'+name));
  if(name==='dash') renderDash();
  if(name==='assets') renderAssets();
  if(name==='props'){ schedulePropsPanelHeight(); initOverview(); setTimeout(()=>{overview&&overview.refresh(true);autoGeocode();},80); }
  if(name==='actions') renderActions();
  if(name==='scraps') renderScraps();
  window.scrollTo({top:0,behavior:'smooth'});
}
window.addEventListener('resize',schedulePropsPanelHeight);
document.querySelectorAll('.atab[data-panel]').forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));
document.querySelectorAll('[data-goto]').forEach(a=>a.onclick=()=>switchPanel(a.dataset.goto));


/* ============ DASHBOARD ============ */
/* B-56: 'YYYY-MM-DD'를 new Date(t)로 그대로 넘기면 스펙상 UTC 자정으로 해석돼
   KST(UTC+9)에서 하루 밀림(B-30 actions.js의 actDaysUntilDue와 동일 함정·동일 우회) —
   연·월·일을 뽑아 3인자 Date 생성자(로컬 자정 확정 해석)로 조립. 형식이 안 맞으면
   기존 new Date(t) 폴백으로 하위호환 유지 */
function dday(t){
  const n=new Date(); n.setHours(0,0,0,0);
  const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t));
  const target=m?new Date(+m[1],+m[2]-1,+m[3]):new Date(t);
  target.setHours(0,0,0,0);
  const d=Math.ceil((target-n)/86400000);
  return d>=0?'D-'+d:'D+'+(-d);
}
function assetItems(){return (state.assets&&state.assets.items)||[];}
function sumAmount(){return assetItems().reduce((s,it)=>s+(+it.amount||0),0);}
function sumMob(){return assetItems().reduce((s,it)=>s+(+it.mobilizable||0),0);}
function sumMobImmediate(){return assetItems().filter(it=>it.liquidity==='즉시').reduce((s,it)=>s+(+it.mobilizable||0),0);}
function sumByOwner(o){return assetItems().filter(it=>it.owner===o).reduce((s,it)=>s+(+it.amount||0),0);}
function assetTotal(){return sumMobImmediate();} // 실제 동원 가능(즉시) 기준

function renderGates(){
  const p=state.profile;
  document.getElementById('gateList').innerHTML=
    `<div class="gate">${ic('pin')}<div><div class="gt">${esc(p.city)}시 內 <em>필수</em></div><div class="gd">이자지원 자격</div></div></div>`+
    `<div class="gate">${ic('area')}<div><div class="gt">전용 ${p.maxArea}㎡ 이하 <em>필수</em></div><div class="gd">청약 자격 보존</div></div></div>`+
    `<div class="gate">${ic('wallet')}<div><div class="gt">전세 ${esc(p.depositRange)}억 <em>필수</em></div><div class="gd">보증금 예산</div></div></div>`+
    `<div class="gate">${ic('transit')}<div><div class="gt">교통·단지 조건 <em class="pref">선호</em></div><div class="gd">${esc(p.transport)} 우선 + 좋은 단지면 OK</div></div></div>`;
}
function renderJourney(){
  const now=new Date();
  const nowLabel=`${now.getFullYear()}.${now.getMonth()+1}`;
  const steps=[{t:'오늘',d:nowLabel,now:true}];
  (state.profile.milestones||[]).forEach(m=>{
    if(!m.label&&!m.date)return;
    const d=m.date?m.date.replace(/-/g,'.').replace(/\.0/g,'.').replace(/\.(\d+)$/,''):''
    steps.push({t:m.label,d:d,date:m.date});
  });
  const el=document.getElementById('journey');
  const cols=steps.length;
  el.style.gridTemplateColumns=`repeat(${cols},minmax(68px,1fr))`;
  el.innerHTML=steps.map(s=>`
    <div class="jstop ${s.now?'now':''}">
      <div class="dot">${s.now?ic('pin'):'◆'}</div>
      <div class="jt">${esc(s.t)}</div>
      <div class="jd">${esc(s.d)}</div>
      ${s.date?`<div class="jdday tnum">${esc(dday(s.date))}</div>`:''}
    </div>`).join('');
}
function renderDashSummaries(){
  const total=sumMobImmediate();
  const tgt=(+state.settings.targetDeposit||0)*100000000;
  const pct=tgt>0?Math.min(100,Math.round(total/tgt*100)):0;
  document.getElementById('d_assetSummary').innerHTML=`
    <div class="bignum tnum">${won(total)}<small>원</small></div>
    <div class="meter"><i style="width:${pct}%"></i></div>
    <div class="subnum">즉시 동원 기준 · 전세 보증금 목표 <b>${state.settings.targetDeposit||0}억</b> 대비 <b>${pct}%</b> · 만기 포함 전체 <b>${won(sumMob())}</b></div>`;
  const complexes=state.complexes||[], complexIds=new Set(complexes.map(cx=>cx.id));
  const listingCount=(state.listings||[]).filter(l=>complexIds.has(l.complexId)).length;
  const fin=complexes.filter(cx=>cx.complexStatus==='후보').length;
  const vis=complexes.filter(cx=>cx.complexStatus==='임장예정').length;
  document.getElementById('d_propSummary').innerHTML=`
    <div class="bignum tnum">${complexes.length}<small>단지</small></div>
    <div class="statline">
      <span class="statpill">후보 <b>${fin}</b></span>
      <span class="statpill">임장예정 <b>${vis}</b></span>
    </div>
    <div class="subnum">${complexes.length?`등록 매물 <b>${listingCount}건</b> · 매물 탭에서 실사 체크와 지도를 확인하세요.`:'아직 등록된 단지가 없어요. 매물 탭에서 첫 후보를 담아보세요.'}</div>`;
}
function renderTop3(){
  const sorted=[...state.actions].sort((a,b)=>(a.done-b.done)||(a.priority-b.priority));
  const live=sorted.filter(a=>!a.done);
  const show=live.slice(0,3);
  const el=document.getElementById('d_top3');
  if(!state.actions.length){ el.innerHTML=`<div class="empty"><div class="big">아직 액션이 없어요</div>아래에 할 일을 적어보세요.</div>`; document.getElementById('d_actMore').textContent=''; return; }
  el.innerHTML=show.map((a,i)=>`
    <div class="actrow" data-done="${a.done?1:0}" data-id="${a.id}">
      <span class="rank tnum">${i+1}</span>
      <span class="box" data-act-done="${a.id}">${CHECK}</span>
      <span class="atx">${esc(a.text)}</span>
      <button class="star ${a.priority<=1?'on':''}" data-act-top="${a.id}" title="맨 위로" aria-label="맨 위로">${ic('star')}</button>
      <button class="xx" data-act-del="${a.id}" aria-label="삭제">✕</button>
    </div>`).join('') || `<div class="empty"><div class="big">우선순위 액션 완료!</div>새 할 일을 추가하거나 다른 탭을 채워보세요.</div>`;
  const doneCnt=state.actions.filter(a=>a.done).length;
  const moreLive=Math.max(0,live.length-3);
  document.getElementById('d_actMore').textContent=
    (moreLive?`+ 대기 중 액션 ${moreLive}개 더 · `:'')+`완료 ${doneCnt}개`;
}
function renderDash(){ renderJourney(); renderDashSummaries(); renderTop3(); updateDashRegline(); }

document.getElementById('d_top3').addEventListener('click',e=>{
  const done=e.target.closest('[data-act-done]');
  const top=e.target.closest('[data-act-top]');
  const del=e.target.closest('[data-act-del]');
  if(done){const a=state.actions.find(x=>x.id===done.dataset.actDone);if(a){a.done=!a.done;save();renderTop3();}return;}
  if(top){const a=state.actions.find(x=>x.id===top.dataset.actTop);if(a){const min=Math.min(...state.actions.map(x=>x.priority));a.priority=min-1;a.done=false;save();renderTop3();}return;}
  if(del){if(!confirm('이 액션을 삭제할까요?'))return;state.actions=state.actions.filter(x=>x.id!==del.dataset.actDel);save();renderTop3();return;}
});
function addAction(){
  const inp=document.getElementById('d_actInput'); const t=inp.value.trim(); if(!t){inp.focus();return;}
  const max=state.actions.length?Math.max(...state.actions.map(x=>x.priority)):0;
  state.actions.push({id:'a'+Date.now(),text:t,priority:max+1,done:false});
  inp.value=''; save(); renderTop3();
}
document.getElementById('d_actAdd').onclick=addAction;
document.getElementById('d_actInput').addEventListener('keydown',e=>{if(e.key==='Enter')addAction();});
document.getElementById('d_actMore').onclick=()=>switchPanel('actions');
