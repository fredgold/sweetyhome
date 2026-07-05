/*
 * ── STATE SCHEMA ──────────────────────────────────────────────
 * state.profile   : { names, birthYear, employment, housing, city,
 *                     maxArea, depositRange, transport,
 *                     milestones: [{label, date}] }
 *
 * state.assets    : { items: [{id, owner, name, amount, type,
 *                               liquidity, mobilizable, memo}],
 *                     notes, reserve (만원), updatedAt }
 *
 * state.settings  : { targetDeposit (억), weights:{commute,budget,
 *                     area,complex,risk} }
 *
 * state.properties: [{id, created, name, loc, deposit (억), area (㎡),
 *                     households, memo, img (base64), status, lat, lng,
 *                     checks:{k1..k9}, aiScore, aiComment}]
 *
 * state.scraps    : [{id, createdAt, title, type (SC_TYPE key),
 *                     raw, img (base64), location, price, area,
 *                     schedule, condition, source, status (SC_STATUS key),
 *                     tags:[], fit, parsed}]
 *
 * state.actions   : [{id, text, priority, done}]
 * state.chatHistory: [{role:'user'|'assistant', text, think?}]
 * state.regNews   : [{id, title, summary, date, source}]
 * state.prep      : [{id, tx, sub, done}]   ← 체크리스트 항목
 * state.steps     : [{id, tx, sub, done}]   ← 계약 단계
 *
 * applyGuards()가 필드 누락을 보정하므로 새 필드 추가 시 여기에 기록.
 * ──────────────────────────────────────────────────────────────
 */

/* ===== 동기화 상태 칩 ===== */
const SYNC_LABELS={ok:'☁ 동기화됨',local:'⚠ 로컬만',offline:'✗ 오프라인'};
const SYNC_MSGS={
  ok:'클라우드에 동기화되었습니다.',
  local:'클라우드 저장 실패 — 이 기기에만 저장됨.\n잠시 후 다시 시도하세요.',
  offline:'네트워크 연결 없음 — 이 기기에만 저장됨.\n연결 후 다시 시도하세요.'
};
function setSyncState(s){
  const chip=document.getElementById('syncChip');
  const msg=document.getElementById('syncMsg');
  const retry=document.getElementById('syncRetry');
  if(!chip) return;
  chip.dataset.sync=s; chip.textContent=SYNC_LABELS[s]||s;
  if(msg){ msg.textContent=SYNC_MSGS[s]||''; msg.style.whiteSpace='pre-line'; }
  if(retry) retry.style.display=(s==='ok')?'none':'block';
}
async function syncToRedis(){
  try{
    const res=await fetch('/api/state',{method:'POST',headers:authHeaders(),body:JSON.stringify({state})});
    const j=await res.json();
    if(j.ok) setSyncState('ok');
    else setSyncState('local');
  }catch(e){ setSyncState('offline'); }
}
document.getElementById('syncChip').addEventListener('click',function(e){
  e.stopPropagation();
  document.getElementById('syncPanel').classList.toggle('open');
});
document.addEventListener('click',function(){
  document.getElementById('syncPanel').classList.remove('open');
});
document.getElementById('syncRetry').addEventListener('click',async function(){
  this.disabled=true; this.textContent='저장 중…';
  await syncToRedis();
  this.disabled=false; this.textContent='↻ 다시 시도';
  if(document.getElementById('syncChip').dataset.sync==='ok')
    document.getElementById('syncPanel').classList.remove('open');
});

const CHECK='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
const SC={관심:'--s-interest',방문예정:'--s-visit',검토중:'--s-review',후보확정:'--s-final',보류:'--s-hold',탈락:'--s-drop'};
const HEX={관심:'#6B7C93',방문예정:'#C7853A',검토중:'#B89233',후보확정:'#4F8A5B',보류:'#8A8F8A',탈락:'#B16A63'};
const ORDER={후보확정:0,검토중:1,방문예정:2,관심:3,보류:4,탈락:5};
const CENTER=[37.512,126.942];
const CHECKLIST=[
  {id:'k1',t:'동·층 / 일조',s:'로얄동·층 vs 저층, 햇빛',vl:'호갱노노',vu:n=>gUrl(n+' 호갱노노 일조량')},
  {id:'k2',t:'학군·초품아',s:'배정 초등학교, 통학거리',vl:'지도',vu:n=>nmapUrl(n+' 초등학교')},
  {id:'k3',t:'생활 인프라',s:'마트·병원 + 지하철역 거리',vl:'주변보기',vu:n=>nmapUrl(n)},
  {id:'k4',t:'세대수(대단지)',s:'500세대+면 관리·보증 유리',vl:'단지정보',vu:n=>landUrl(n)},
  {id:'k5',t:'복도식 / 계단식',s:'채광·보안 차이',vl:'단지정보',vu:n=>landUrl(n)},
  {id:'k6',t:'관리비 · 난방',s:'실제 월 관리비 수준',vl:'관리비조회',vu:n=>gUrl(n+' 공동주택관리정보 관리비')},
  {id:'k7',t:'재건축·정비 리스크',s:'전세 이주 위험! 꼭 확인',vl:'정비사업',vu:n=>gUrl(n+' 재건축 정비구역 지정')},
  {id:'k8',t:'세대당 주차',s:'세대당 몇 대인지',vl:'단지정보',vu:n=>landUrl(n)},
  {id:'k9',t:'입주민 후기',s:'하자·집주인·실거주 평판',vl:'호갱노노',vu:n=>gUrl(n+' 호갱노노 이야기')},
];

let OWNERS=['규범','연정','공동'];
const ATYPES=['현금','적금','예금','주식','펀드','청약통장','기타'];
const LIQUIDITY=['즉시','만기·장기'];

const DEFAULT_PROFILE={
  names:'테디 ♥ 연정',
  birthYear:1995,
  employment:'맞벌이',
  housing:'무주택',
  city:'서울',
  maxArea:85,
  depositRange:'4~5',
  transport:'9호선',
  milestones:[
    {label:'이자지원 오픈',date:'2026-08-01'},
    {label:'결혼',date:'2027-02-01'},
    {label:'매수 목표',date:'2028-01-01'},
  ],
};
const DEFAULT={
  profile:structuredClone(DEFAULT_PROFILE),
  assets:{items:[],notes:'',reserve:1000},
  settings:{targetDeposit:4.5,weights:{commute:3,budget:3,area:3,complex:3,risk:3}},
  chatHistory:[],
  actions:[
    {id:'a1',text:'버팀목 전세대출 자가진단 (연정)',priority:1,done:false},
    {id:'a2',text:'서울시 신혼부부 이자지원 오픈 모니터링 (~8월)',priority:2,done:false},
    {id:'a3',text:'협약은행 대출상담 예약 (KB·하나·신한)',priority:3,done:false},
  ],
  properties:[],
  regNews:[],
  scraps:[],
  prep:[
    {id:'p1',tx:'연정 — 기금e든든 버팀목 사전 자가진단',sub:'전세대출 자격 먼저 확인',done:false},
    {id:'p2',tx:'서울시 신혼부부 이자지원 오픈 모니터링',sub:'8월경 예비신혼부부 접수 시작',done:false},
    {id:'p3',tx:'협약은행 대출상담 예약 (KB·하나·신한)',sub:'한도·금리 사전 확인',done:false},
    {id:'p4',tx:'부모님 지원금 입금 계획 정리',sub:'각자 본인 계좌로 (증여공제)',done:false},
  ],
  steps:[
    {id:'s1',tx:'매물 확정',sub:'조건 통과 + 가계약 전 점검',done:false},
    {id:'s2',tx:'서울시 융자추천 온라인 신청',sub:'',done:false},
    {id:'s3',tx:'협약은행 전세대출 신청',sub:'',done:false},
    {id:'s4',tx:'전세보증보험 가입',sub:'HUG / HF',done:false},
    {id:'s5',tx:'잔금 · 전입신고',sub:'→ 세대분리 자동 완료',done:false},
  ],
};

const GUEST_STATE={
  assets:{items:[
    {id:'g1',owner:'본인',name:'샘플 입출금통장',amount:10000000,type:'현금',liquidity:'즉시',mobilizable:10000000,memo:'데모용 예시'},
    {id:'g2',owner:'본인',name:'샘플 적금',amount:20000000,type:'적금',liquidity:'만기·장기',mobilizable:20000000,memo:'데모용 예시'},
    {id:'g3',owner:'배우자',name:'샘플 예금',amount:30000000,type:'예금',liquidity:'즉시',mobilizable:30000000,memo:'데모용 예시'},
    {id:'g4',owner:'공동',name:'샘플 공동자금',amount:50000000,type:'기타',liquidity:'즉시',mobilizable:50000000,memo:'데모용 예시'},
  ],notes:'이것은 데모 데이터입니다. 실제 데이터가 아닙니다.',reserve:1000},
  settings:{targetDeposit:4.0,weights:{commute:3,budget:3,area:3,complex:3,risk:3}},
  chatHistory:[],
  actions:[
    {id:'ga1',text:'(예시) 전세대출 조건 알아보기',priority:1,done:false},
    {id:'ga2',text:'(예시) 관심 지역 매물 검색하기',priority:2,done:false},
    {id:'ga3',text:'(예시) 은행 상담 예약',priority:3,done:true},
  ],
  properties:[
    {id:'gp1',created:1,name:'(예시) 샘플 아파트 A',loc:'서울 OO구 · 지하철 도보 5분',deposit:4.0,area:59.9,status:'검토중',lat:37.5665,lng:126.978,memo:'데모 매물 · 500세대 · 계단식',checks:{k1:true,k3:true},aiScore:75,aiComment:'데모용 AI 평가입니다'},
    {id:'gp2',created:2,name:'(예시) 샘플 아파트 B',loc:'서울 OO구 · 지하철 도보 10분',deposit:3.5,area:84.5,status:'관심',lat:37.55,lng:126.95,memo:'데모 매물 · 800세대',checks:{},aiScore:null,aiComment:''},
    {id:'gp3',created:3,name:'(예시) 샘플 아파트 C',loc:'서울 OO구 · 역세권',deposit:4.5,area:74.2,status:'후보확정',lat:37.54,lng:126.99,memo:'데모 매물 · 1000세대 대단지',checks:{k1:true,k2:true,k3:true,k4:true},aiScore:85,aiComment:'데모용 AI 평가입니다'},
  ],
  regNews:[{id:'grn1',title:'(예시) 샘플 뉴스 제목',summary:'이것은 데모용 뉴스 요약입니다. 실제 뉴스가 아닙니다.',date:'2026-01',source:''}],
  scraps:[],
  prep:[
    {id:'gpr1',tx:'(예시) 대출 자격 확인',sub:'데모용 항목',done:true},
    {id:'gpr2',tx:'(예시) 지원 프로그램 모니터링',sub:'데모용 항목',done:false},
    {id:'gpr3',tx:'(예시) 은행 상담',sub:'데모용 항목',done:false},
  ],
  steps:[
    {id:'gs1',tx:'(예시) 매물 확정',sub:'데모용 단계',done:false},
    {id:'gs2',tx:'(예시) 대출 신청',sub:'데모용 단계',done:false},
    {id:'gs3',tx:'(예시) 보증보험 가입',sub:'데모용 단계',done:false},
    {id:'gs4',tx:'(예시) 잔금 및 입주',sub:'데모용 단계',done:false},
  ],
};

let state=null, activeTab='전체', activePanel='dash';
let overview=null, ovMarkers=[], formMapObj=null, formMarker=null, tempLatLng=null, tempChecks=null;

/* ---- load with migration ---- */
function applyGuards(raw){
  state=Object.assign(structuredClone(DEFAULT), raw||{});
  state.profile=Object.assign(structuredClone(DEFAULT_PROFILE), state.profile||{});
  if(!Array.isArray(state.profile.milestones)||!state.profile.milestones.length) state.profile.milestones=structuredClone(DEFAULT_PROFILE.milestones);
  state.assets=Object.assign(structuredClone(DEFAULT.assets), state.assets||{});
  if(!Array.isArray(state.assets.items)){
    const old=state.assets, mig=[];
    [['현금·입출금','cash','현금','즉시'],['예금·적금','savings','적금','즉시'],['청약통장','subscription','청약통장','만기·장기'],['부모님 지원 예정','parentGift','기타','만기·장기'],['기타·투자','other','주식','만기·장기']]
      .forEach(([nm,key,ty,lq])=>{ const v=(+old[key]||0)*10000; if(v>0) mig.push({id:'as'+Math.random().toString(36).slice(2,8),owner:'규범',name:nm,amount:v,type:ty,liquidity:lq,mobilizable:v,memo:''}); });
    state.assets.items=mig;
  }
  if(state.assets.reserve==null) state.assets.reserve=1000;
  state.settings=Object.assign(structuredClone(DEFAULT.settings), state.settings||{});
  state.settings.weights=Object.assign(structuredClone(DEFAULT.settings.weights), state.settings.weights||{});
  state.chatHistory=state.chatHistory||[];
  state.actions=state.actions||structuredClone(DEFAULT.actions);
  state.properties=state.properties||[];
  state.regNews=state.regNews||[];
  state.scraps=(state.scraps||[]).map(s=>{
    const p=s.parsed||{};
    return {
      id: s.id||'sc'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),
      createdAt: s.createdAt||Date.now(),
      title: s.title||(p.name||'')||(s.raw||'').slice(0,40)||'(제목 없음)',
      type: s.type||'subscription',
      raw: s.raw||'',
      location: s.location||'',
      price: s.price||(p.price||''),
      area: s.area||(p.area||''),
      schedule: s.schedule||(p.schedule||''),
      condition: s.condition||(p.qualification||''),
      source: s.source||'',
      status: s.status||'new',
      tags: Array.isArray(s.tags)?s.tags:[],
      fit: s.fit||'',
      img: s.img||'',
      parsed: s.parsed||null,
    };
  });
  state.prep=state.prep||structuredClone(DEFAULT.prep);
  state.steps=state.steps||structuredClone(DEFAULT.steps);
  state.properties.forEach(p=>{ if(!p.checks)p.checks={}; });
}
async function load(){
  if(isGuestMode){
    applyGuards(structuredClone(GUEST_STATE));
    renderAll();
    return;
  }
  let raw=null, redisOk=false, networkFail=false;
  try{
    const res=await fetch('/api/state',{headers:authHeaders()});
    const j=await res.json();
    if(j.ok){ redisOk=true; if(j.state) raw=j.state; }
    else if(res.status===401){ forceLogin(); return; }
  }catch(e){ networkFail=true; }
  if(!raw){
    try{ const v=localStorage.getItem('sweetyhome'); if(v) raw=JSON.parse(v); }catch(e){}
  }
  if(!raw){
    try{ const v=localStorage.getItem('homemap'); if(v){ const old=JSON.parse(v); raw={properties:old.properties||[],prep:old.prep,steps:old.steps}; } }catch(e){}
  }
  if(redisOk) setSyncState('ok');
  else if(networkFail) setSyncState('offline');
  else setSyncState('local');
  if(!raw && !redisOk){
    const n=document.getElementById('savedNote');
    if(n){ n.textContent='클라우드·로컬 모두 불러오기 실패. 새로고침하거나 잠시 후 다시 시도하세요.'; n.style.color='var(--s-drop)'; }
  }
  applyGuards(raw);
  renderAll();
}
let syncTimer;
async function save(){
  if(isGuestMode){ const n=document.getElementById('savedNote'); n.textContent='데모 모드 — 저장되지 않아요'; n.style.color='var(--ink-faint)'; return; }
  const n=document.getElementById('savedNote'); n.textContent='저장 중…'; n.style.color='var(--ink-soft)';
  try{ localStorage.setItem('sweetyhome',JSON.stringify(state)); }catch(e){}
  clearTimeout(syncTimer);
  syncTimer=setTimeout(async()=>{
    n.textContent='변경사항은 자동 저장됩니다'; n.style.color='';
    await syncToRedis();
  },800);
}
