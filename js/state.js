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
 * state.settings  : { targetDeposit (억), owners:['규범','연정','공동'],
 *                     weights:{commute,budget,
 *                     area,complex,risk},
 *                     grades:{area:[85,60], households:[1000,500,300,150],
 *                             bigComplex:500},
 *                     commuters: [{name, dest}, {name, dest}] (통근 기준지
 *                       2인, 기본 [{name:'테디',dest:'강남역'},
 *                       {name:'연정',dest:'신사역'}], 프로필 모달에서 편집) }
 *                    B-18: 등급 컷 단일 소스(utils.js GRADE_DEFAULTS와 동일 값).
 *                    calcAreaGrade()/calcHouseholdGrade()(utils.js)가 이 값을
 *                    읽어 면적·세대수 등급을 계산 — 값 변경 시 등급 판정도 함께
 *                    바뀜(현재는 기본값 그대로라 동작 변화 없음).
 *                    B-69: owners는 프로필 모달에서 추가·이름변경·삭제.
 *                    기존 actions[].assignee/assets.items[].owner 문자열은
 *                    자동 치환하지 않고 그대로 보존.
 *                    B-61: commuters는 정확히 2개 고정(추가·삭제 UI 없음),
 *                    index로 complexes[].commutes와 매칭. 이름 변경은 표시만
 *                    바꿀 뿐 기록과 무관(매칭은 이름이 아니라 index).
 *
 * state.properties: [{id, created, name, loc, station, line, deposit (억),
 *                     depositNum (억), area (㎡), households, householdGrade,
 *                     jeonseReal, saleReal, jeonseRatio, commuteGangnam,
 *                     commuteSinsa, url, memo, img (base64), status, lat, lng,
 *                     geocodePending, checks:{k1..k9}, aiScore, aiComment}]
 *
 * state.complexes : [{id, complexName, loc, geocodeQuery, groupCode, regionGroup,
 *                     station, line, yearBuilt, households, householdGrade,
 *                     commuteGangnam, commuteSinsa, complexStatus('관심' 기본),
 *                     lat, lng, memo, createdAt, updatedAt,
 *                     parking (세대당 대수, 소수 허용, null=값 없음),
 *                     parkingState ('known'|'unknown'|'na', 기본 'unknown'),
 *                     pros (장점, 멀티라인 텍스트, 기본 ''),
 *                     cons (단점, 멀티라인 텍스트, 기본 ''),
 *                     verdict (한줄 판단/우리 결론, 기본 ''),
 *                     favorite (즐겨찾기, boolean, 기본 false),
 *                     commutes: [{minutes, transfers, destSnapshot}, {...}]
 *                       (index 0/1 = settings.commuters[0/1], 기본 각각
 *                       {minutes:null, transfers:null, destSnapshot:''}),
 *                     commuteMemo (출퇴근 메모, 기본 '')}]
 *                    v5(단지·매물 2계층) 스키마. E-01로 마이그레이션·라이브 전환 완료.
 *                    B-28: parking은 0이 실제 값일 수 있어 parkingState로 값/미확인/
 *                    해당없음을 명시적으로 구분(0 자연발생 안 하는 households 등과 다름).
 *                    B-38: pros/cons/verdict는 "단지 스펙"이 아니라 "우리 판단"을
 *                    구조화 기록하는 필드 — 순위·등급·점수 아님(자동 평가 없음, 순수
 *                    기록). 기존 자유 memo와 병존(대체 아님).
 *                    B-39: favorite은 별점·순위·등급이 아니라 boolean 하나뿐인
 *                    "지금 집중해서 보는 것" 표시 — complexStatus가 이미 우선순위를
 *                    거치므로 별도 등급축 없음. 목록 정렬 1차 키 + 필터로만 사용.
 *                    B-61: commutes는 기존 commuteGangnam/commuteSinsa(레거시,
 *                    유지)와 별개인 신규 2인 기록 필드 — 자동 경로계산·판정 없음,
 *                    사용자가 직접 입력한 소요시간·환승만 기록. destSnapshot은
 *                    입력 시점의 settings.commuters[i].dest를 그대로 복사해두는
 *                    값 — 이후 기준지가 바뀌어도 과거 기록은 손대지 않고, 표시
 *                    시점에 스냅샷≠현재값이면 "기준지 변경됨" 안내만 덧붙임.
 * state.listings  : [{id, complexId, source, url, capturedAt, lastCheckedAt,
 *                     dongHo, areaM2, areaText, areaGrade, deposit,
 *                     managementFee (만원 단위, null=값 없음),
 *                     managementFeeState ('known'|'unknown'|'na', 기본 'unknown'),
 *                     listingStatus('게시중' 기본), isRepresentative(false), memo,
 *                     safety: { [SAFETY_ITEMS[].key]: {status('unchecked'|'ok'|
 *                       'warning', 기본 'unchecked'), memo, source, checkedAt} }}]
 *                    complexes와 같은 v5 스키마, 라이브 전환 완료.
 *                    B-27-lite: safety는 전세 안전 체크 9항목(SAFETY_ITEMS, 이
 *                    파일 상단 상수) 기록 전용 — 자동 판정·차단 없음, 사용자가
 *                    직접 입력한 값을 그대로 보여줄 뿐.
 *
 * state.scraps    : [{id, createdAt, title, type (SC_TYPE key),
 *                     raw, img (base64, 레거시 1장 — B-67 이후 imgs[0]과
 *                       항상 동기화되는 대표사진 미러, 삭제·개명 금지),
 *                     imgs (base64[], 최대 SC_MAX_IMGS장 — B-67 신규,
 *                       렌더는 이 필드 기준 · 첫 장이 대표), location, price,
 *                     area, schedule, condition, source, status (SC_STATUS key),
 *                     tags:[], fit, parsed}]
 *
 * state.actions   : [{id, text, priority, done, category, assignee, due}]
 *                    category: ''|'매물준비'|'계약', assignee: ''|OWNERS 값(하드코딩
 *                    금지, 전역 OWNERS 재사용), due: ''|'YYYY-MM-DD'(마감 — B-30:
 *                    표시 전용, 정렬 기준 아님. 기존 done→priority 정렬 그대로 유지)
 * state.chatHistory: [{role:'user'|'assistant', text, think?}]
 * state.regNews   : [{id, title, summary, date, source}]
 * state.savedRoutes: [{id, name, propertyIds:[], createdAt}]  임장 루트(방문 순서) 저장 목록
 * state.prep      : (deprecated — migrated to actions with category:'매물준비')
 * state.steps     : (deprecated — migrated to actions with category:'계약')
 *
 * applyGuards()가 필드 누락을 보정하므로 새 필드 추가 시 여기에 기록.
 * ──────────────────────────────────────────────────────────────
 */

/* ===== 동기화 상태 칩 ===== */
/* setSyncState는 UI 갱신이지만 state.js 자체의 save/sync 흐름에서만 호출되므로
   (다른 파일에서 호출 없음) 정의부·호출부를 붙여두기 위해 의도적으로 여기 둠 */
const SYNC_LABELS={ok:'동기화됨',local:'⚠ 로컬만',offline:'✕ 오프라인'};
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
  chip.dataset.sync=s;
  chip.innerHTML=(s==='ok'?ic('sync')+' ':'')+(SYNC_LABELS[s]||s);
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
const SC={관심:'--s-interest',방문예정:'--s-visit',검토중:'--s-review',후보:'--s-final',문의예정:'--s-inquiry',보류:'--s-hold',탈락:'--s-drop'};
const HEX={관심:'#6B7C93',방문예정:'#C7853A',검토중:'#B89233',후보:'#4F8A5B',문의예정:'#4B88CC',보류:'#8A8F8A',탈락:'#B16A63'};
const ORDER={후보:0,검토중:1,문의예정:2,방문예정:3,관심:4,보류:5,탈락:6};
const CENTER=[37.512,126.942];
const CHECKLIST=[
  {id:'k1',t:'동·층 / 일조',s:'로얄동·층 vs 저층, 햇빛'},
  {id:'k2',t:'학군·초품아',s:'배정 초등학교, 통학거리',vl:'지도',vu:n=>nmapUrl(n+' 초등학교')},
  {id:'k3',t:'생활 인프라',s:'마트·병원 + 지하철역 거리',vl:'주변보기',vu:n=>nmapUrl(n)},
  {id:'k4',t:'세대수(대단지)',s:GRADE_DEFAULTS.bigComplex+'세대+면 관리·보증 유리',vl:'단지정보',vu:n=>landUrl(n)}, // B-18: 하드 문자열 대신 GRADE_DEFAULTS(utils.js) 참조
  {id:'k5',t:'복도식 / 계단식',s:'채광·보안 차이',vl:'단지정보',vu:n=>landUrl(n)},
  {id:'k6',t:'관리비 · 난방',s:'실제 월 관리비 수준'},
  {id:'k7',t:'재건축·정비 리스크',s:'전세 이주 위험! 꼭 확인'},
  {id:'k8',t:'세대당 주차',s:'세대당 몇 대인지',vl:'단지정보',vu:n=>landUrl(n)},
  {id:'k9',t:'입주민 후기',s:'하자·집주인·실거주 평판'},
];

/* B-27-lite: 전세 안전 체크 9항목 — listings[].safety의 키 목록. 판정 없음,
   기록만(상태·메모·출처·확인일). state.js·properties.js 양쪽에서 공유. */
const SAFETY_ITEMS=[
  {key:'moveInReport',label:'전입신고'},
  {key:'fixedDate',label:'확정일자'},
  {key:'depositInsurance',label:'반환보증'},
  {key:'jeonseLoan',label:'전세대출'},
  {key:'interestSupport',label:'서울시 이자지원'},
  {key:'seniorLiens',label:'근저당·선순위'},
  {key:'trustSeizure',label:'신탁·압류 등 권리관계'},
  {key:'lessorIdentity',label:'임대인·대리인 확인'},
  {key:'specialTerms',label:'계약 특약 협의'},
];
const SAFETY_STATUS_LABEL={unchecked:'미확인',ok:'문제없음',warning:'주의'};
const SAFETY_SOURCES=['매물광고','중개사','임대인','현장','등기부','건축물대장','은행','보증기관','기타'];
function defaultSafetyItem(){ return {status:'unchecked',memo:'',source:'',checkedAt:''}; }
function defaultListingSafety(){
  const safety={};
  SAFETY_ITEMS.forEach(({key})=>{ safety[key]=defaultSafetyItem(); });
  return safety;
}
/* B-61: 통근 기준지 2인 — complexes[].commutes 기본값(신규 단지 생성 시) */
function defaultComplexCommutes(){
  return [0,1].map(()=>({minutes:null,transfers:null,destSnapshot:''}));
}

const DEFAULT_OWNERS=['규범','연정','공동'];
let OWNERS=[...DEFAULT_OWNERS];
function syncOwners(){ OWNERS=state.settings.owners; }
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
  settings:{targetDeposit:4.5,owners:[...DEFAULT_OWNERS],weights:{commute:3,budget:3,area:3,complex:3,risk:3},grades:structuredClone(GRADE_DEFAULTS),commuters:[{name:'테디',dest:'강남역'},{name:'연정',dest:'신사역'}]},
  chatHistory:[],
  actions:[
    {id:'a1',text:'버팀목 전세대출 자가진단 (연정)',priority:1,done:false},
    {id:'a2',text:'서울시 신혼부부 이자지원 오픈 모니터링 (~8월)',priority:2,done:false},
    {id:'a3',text:'협약은행 대출상담 예약 (KB·하나·신한)',priority:3,done:false},
  ],
  properties:[],
  complexes:[],
  listings:[],
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
  profile:{
    names:'(예시) OO ♥ XX',
    birthYear:1994,
    employment:'(예시) 맞벌이',
    housing:'(예시) 무주택',
    city:'(예시) 서울 OO구',
    maxArea:85,
    depositRange:'4~5',
    transport:'(예시) OO호선',
    milestones:[
      {label:'(예시) 결혼',date:'2027-01-01'},
      {label:'(예시) 매수 목표',date:'2028-01-01'},
    ],
  },
  settings:{targetDeposit:4.0,owners:['본인','배우자','공동'],weights:{commute:3,budget:3,area:3,complex:3,risk:3},grades:structuredClone(GRADE_DEFAULTS)},
  chatHistory:[],
  actions:[
    {id:'ga1',text:'(예시) 전세대출 조건 알아보기',priority:1,done:false},
    {id:'ga2',text:'(예시) 관심 지역 매물 검색하기',priority:2,done:false},
    {id:'ga3',text:'(예시) 은행 상담 예약',priority:3,done:true},
  ],
  properties:[
    {id:'gp1',created:1,name:'(예시) 샘플 아파트 A',loc:'서울 OO구 · 지하철 도보 5분',deposit:4.0,area:59.9,status:'검토중',lat:37.5665,lng:126.978,memo:'데모 매물 · 500세대 · 계단식',checks:{k1:true,k3:true},aiScore:75,aiComment:'데모용 AI 평가입니다'},
    {id:'gp2',created:2,name:'(예시) 샘플 아파트 B',loc:'서울 OO구 · 지하철 도보 10분',deposit:3.5,area:84.5,status:'관심',lat:37.55,lng:126.95,memo:'데모 매물 · 800세대',checks:{},aiScore:null,aiComment:''},
    {id:'gp3',created:3,name:'(예시) 샘플 아파트 C',loc:'서울 OO구 · 역세권',deposit:4.5,area:74.2,status:'후보',lat:37.54,lng:126.99,memo:'데모 매물 · 1000세대 대단지',checks:{k1:true,k2:true,k3:true,k4:true},aiScore:85,aiComment:'데모용 AI 평가입니다'},
  ],
  regNews:[{id:'grn1',title:'(예시) 샘플 뉴스 제목',summary:'이것은 데모용 뉴스 요약입니다. 실제 뉴스가 아닙니다.',date:'2026-01',source:''}],
  savedRoutes:[{id:'groute1',name:'(예시) 주말 임장 루트',propertyIds:['gp1','gp2','gp3'],createdAt:Date.now()}],
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
/* B-28: 붙여넣기 파싱이 주차·관리비 값을 성공적으로 읽었을 때만 잠깐 담아뒀다가
   저장 시점(saveAsComplexListing)에 반영 — tempChecks와 동일한 패턴 */
let tempParking=null, tempManagementFee=null;

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
  const ownersRaw=Array.isArray(state.settings.owners)?state.settings.owners:[];
  state.settings.owners=[...new Set(ownersRaw.filter(o=>typeof o==='string').map(o=>o.trim()).filter(Boolean))];
  if(!state.settings.owners.length) state.settings.owners=[...DEFAULT_OWNERS];
  syncOwners();
  state.settings.weights=Object.assign(structuredClone(DEFAULT.settings.weights), state.settings.weights||{});
  /* B-18: settings.grades 없거나(구버전 데이터) 일부 키만 있어도 기본값(과거
     리터럴과 동일)으로 보정 — 등급 판정 결과가 절대 바뀌지 않게 함 */
  state.settings.grades=Object.assign(structuredClone(GRADE_DEFAULTS), state.settings.grades||{});
  /* B-61: 통근 기준지 2인 — 항상 정확히 2개, 항목별 병합(구 데이터가 아예
     없거나 1개뿐이거나 name/dest 일부만 있어도 나머지는 기본값으로 채움) */
  const commutersRaw=Array.isArray(state.settings.commuters)?state.settings.commuters:[];
  state.settings.commuters=DEFAULT.settings.commuters.map((def,i)=>({...def, ...(commutersRaw[i]||{})}));
  state.chatHistory=state.chatHistory||[];
  state.actions=state.actions||structuredClone(DEFAULT.actions);
  /* B-30: assignee(담당)·due(마감) 필드 누락 보정, 기본 '' — 기존 액션
     무손실(미지정/마감없음으로 자연 해석됨) */
  state.actions=state.actions.map(a=>({category:'',assignee:'',due:'',...a}));
  if(!state._prepMigrated){
    const ids=new Set(state.actions.map(a=>a.id));
    let p=state.actions.length?Math.max(...state.actions.map(x=>x.priority)):0;
    (state.prep||[]).forEach(t=>{if(!ids.has(t.id))state.actions.push({id:t.id,text:t.tx+(t.sub?` (${t.sub})`:''),priority:++p,done:t.done||false,category:'매물준비'});});
    (state.steps||[]).forEach(t=>{if(!ids.has(t.id))state.actions.push({id:t.id,text:t.tx+(t.sub?` (${t.sub})`:''),priority:++p,done:t.done||false,category:'계약'});});
    state._prepMigrated=true;
  }
  state.properties=(state.properties||[]).map(p=>{
    // C) deposit 타입 보호: 계산용 depositNum 보정
    const dn=p.depositNum!=null?p.depositNum:(typeof p.deposit==='number'?p.deposit:(typeof p.deposit==='string'&&p.deposit?parseEok(p.deposit):null));
    const hh=p.households!=null?(parseInt(p.households)||null):null;
    // B-18: householdGrade 계산은 calcHouseholdGrade(utils.js)로 단일화 —
    // 기존 인라인 calcG는 properties.js의 동일 로직과 중복이었음
    const hg=p.householdGrade||(hh!=null?calcHouseholdGrade(hh,state.settings.grades):'');
    const jr=p.jeonseRatio!=null?p.jeonseRatio:(p.saleReal&&(p.jeonseReal!=null||dn!=null)?Math.round((p.jeonseReal!=null?p.jeonseReal:dn)/p.saleReal*100):null);
    const VALID_ST=['관심','검토중','후보','문의예정','방문예정','보류','탈락'];
    const rawSt=p.status==='후보확정'?'후보':(p.status||'관심');
    const st=VALID_ST.includes(rawSt)?rawSt:'관심';
    return {
      station:'',line:'',yearBuilt:null,
      householdGrade:'',jeonseReal:null,saleReal:null,jeonseRatio:null,
      commuteGangnam:null,commuteSinsa:null,url:'',
      depositNum:null,geocodePending:false,
      importSource:'',importedAt:'',importBatchId:'',
      ...p,
      status:st,
      checks:p.checks||{},
      households:hh,
      depositNum:dn,
      householdGrade:hg,
      jeonseRatio:jr,
    };
  });
  state.regNews=state.regNews||[];
  state.savedRoutes=state.savedRoutes||[];
  /* B-28: parking(단지)·managementFeeState(매물) 필드 누락 보정 — 기존 데이터
     무손실. managementFeeState는 없으면 기존 managementFee 입력값으로 상태를
     역산 승격(값이 있었으면 'known', 없었으면 'unknown').
     B-38: pros/cons/verdict(판단메모) 필드 누락 보정, 기본 '' — 기존 memo는
     이 map에서 손대지 않아(스프레드로 그대로 통과) 무손실.
     B-39: favorite 필드 누락 보정, 기본 false
     B-61: commutes(2인 소요시간·환승·기준지 스냅샷)·commuteMemo 필드 누락
     보정 — commutes는 항목별 병합이라 구 데이터 무손실(safety와 동일 패턴) */
  state.complexes=(state.complexes||[]).map(cx=>{
    const commutesRaw=Array.isArray(cx.commutes)?cx.commutes:[];
    const commutes=[0,1].map(i=>({minutes:null,transfers:null,destSnapshot:'', ...(commutesRaw[i]||{})}));
    return {
      parking:null, parkingState:'unknown',
      pros:'', cons:'', verdict:'',
      favorite:false,
      commuteMemo:'',
      ...cx,
      commutes,
    };
  });
  /* B-27-lite: safety 필드 누락 보정 — 항목별로 병합해 일부만 저장된 기존
     데이터도 나머지 항목이 defaultSafetyItem()으로 채워지게 함(무손실) */
  state.listings=(state.listings||[]).map(l=>{
    const safety=defaultListingSafety();
    SAFETY_ITEMS.forEach(({key})=>{
      safety[key]={...safety[key], ...(l.safety&&l.safety[key])};
    });
    return {
      managementFeeState:'unknown',
      ...l,
      managementFeeState: l.managementFeeState || (l.managementFee!=null?'known':'unknown'),
      safety,
    };
  });
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
      /* B-67: img(1장)→imgs[](배열) 확장. img만 있던 구 데이터는 imgs=[img]로
         무손실 이관(원본 img 필드도 그대로 보존 — 하위호환). 이미 imgs가 있으면
         그대로 사용 */
      imgs: Array.isArray(s.imgs)?s.imgs:(s.img?[s.img]:[]),
      parsed: s.parsed||null,
    };
  });
  state.prep=state.prep||structuredClone(DEFAULT.prep);
  state.steps=state.steps||structuredClone(DEFAULT.steps);
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
