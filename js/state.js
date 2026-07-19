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
 *                    B-41: fieldNote(임장 노트) = {visitedAt(날짜 문자열, 기본 null),
 *                    items:{ [FIELD_NOTE_ITEMS[].key]: {rating(null|1~5 정수, 기본
 *                    null — 미입력과 1점을 엄격히 구분), memo(기본 '')} }, memo(자유
 *                    메모, 마크다운, 기본 '')}. listings[].safety와 동일하게 항목별
 *                    병합(무손실) — 기록·표시 전용, 자동 판정·합산 저장·필터 연동 없음.
 *                    카드 칩(fieldNoteChip)의 평균은 표시용 계산일 뿐 저장 안 됨.
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
/* B-80: localfail(로컬 저장 자체 실패)·expired(토큰 만료)·toolarge(서버 크기
   상한 초과) 3개 상태 추가 — 전부 기존 'local'로 뭉뚱그려지던 것을 원인별로
   구분 표시(자동 복구·삭제는 안 함, 표시만) */
const SYNC_LABELS={ok:'동기화됨',local:'⚠ 로컬만',offline:'✕ 오프라인',localfail:'⚠ 저장 실패',expired:'⚠ 재로그인 필요',toolarge:'⚠ 용량 초과'};
const SYNC_MSGS={
  ok:'클라우드에 동기화되었습니다.',
  local:'클라우드 저장 실패 — 이 기기에만 저장됨.\n잠시 후 다시 시도하세요.',
  offline:'네트워크 연결 없음 — 이 기기에만 저장됨.\n연결 후 다시 시도하세요.',
  localfail:'이 기기 저장(브라우저 로컬)이 실패했어요 — 저장공간이 가득 찼거나 브라우저 제한일 수 있어요.\n중요한 내용은 따로 복사해두세요.',
  expired:'로그인이 만료됐어요. 다시 로그인해주세요.',
  toolarge:'저장할 데이터가 너무 커요(서버 상한 초과) — 사진 등 큰 항목을 정리한 뒤 다시 시도하세요.',
};
const STATE_MAX_BYTES=4*1024*1024, STATE_WARN_RATIO=.8;
let currentStateSizeBytes=0;
function formatStateSize(bytes=currentStateSizeBytes){
  return bytes>=1024*1024?(bytes/1024/1024).toFixed(2)+'MB':(bytes/1024).toFixed(1)+'KB';
}
function stateSizePercent(){ return Math.round(currentStateSizeBytes/STATE_MAX_BYTES*100); }
function isStateSizeWarning(){ return currentStateSizeBytes>STATE_MAX_BYTES*STATE_WARN_RATIO; }
function updateStateSizeIndicators(){
  const chip=document.getElementById('syncChip');
  if(chip) chip.title=`현재 저장 용량 ${formatStateSize()} · 서버 4MB 상한의 ${stateSizePercent()}%`;
  if(typeof renderProfileStateSize==='function') renderProfileStateSize();
}
function recordStateJsonSize(json){
  currentStateSizeBytes=new Blob([json]).size;
  updateStateSizeIndicators();
  return currentStateSizeBytes;
}
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
/* B-84: Redis 동기화 성공/실패를 localStorage 플래그로도 남김 — 탭 UI(syncChip)만
   보고 있지 않아도(예: 다음 로드 시) "마지막 시도가 실패했다"를 알 수 있게. 자동
   정리는 하지 않음(성공 동기화 시에만 해제) */
const SH_UNSYNCED_KEY='sh_unsynced';
function markUnsynced(){ try{ localStorage.setItem(SH_UNSYNCED_KEY,'1'); }catch(e){} }
/* B-80: 플래그를 지울 때 "지난 세션 미동기" 배너도 같이 숨김 — 실제로 동기화가
   확인된 시점에만 안내를 거둬들임(배너 닫기 버튼은 이 플래그 자체는 안 지움,
   아래 배너 wiring 참고) */
function clearUnsyncedFlag(){
  try{ localStorage.removeItem(SH_UNSYNCED_KEY); }catch(e){}
  const banner=document.getElementById('unsyncedBanner');
  if(banner) banner.style.display='none';
}
async function syncToRedis(){
  try{
    const res=await fetch('/api/state',{method:'POST',headers:authHeaders(),body:JSON.stringify({state})});
    /* B-80: 토큰 만료(401)를 기존처럼 'local'로 뭉뚱그리지 않고 재로그인 안내로
       분리 — load()의 401 처리와 동일하게 forceLogin() 재사용(조용히 로컬
       저장으로만 안 빠지게). 서버 크기 상한 초과(413)도 별도 표시 */
    if(res.status===401){ setSyncState('expired'); markUnsynced(); forceLogin(); return; }
    if(res.status===413){ setSyncState('toolarge'); markUnsynced(); return; }
    const j=await res.json();
    if(j.ok){ setSyncState('ok'); clearUnsyncedFlag(); }
    else{ setSyncState('local'); markUnsynced(); }
  }catch(e){ setSyncState('offline'); markUnsynced(); }
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
/* B-80: 닫기는 이번 표시만 숨김(플래그 자체는 안 지움) — 실제 동기화 성공
   전까지는 다음 저장 시도 때도 여전히 미동기 상태이므로, 사람이 닫아도
   데이터가 실제로 안전해진 건 아님. 배너를 다시 보고 싶으면 새로고침 */
document.getElementById('unsyncedBannerClose')?.addEventListener('click',()=>{
  document.getElementById('unsyncedBanner').style.display='none';
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

/* B-41: 임장 노트 6항목 — complexes[].fieldNote.items의 키 목록. SAFETY_ITEMS와
   동일 패턴(판정 없음, 기록만) — 별점(1~5, null=미입력)+항목별 메모 */
const FIELD_NOTE_ITEMS=[
  {key:'parking',label:'주차'},
  {key:'night',label:'밤길'},
  {key:'commerce',label:'상권'},
  {key:'noise',label:'소음'},
  {key:'slope',label:'경사도'},
  {key:'maintenance',label:'관리상태'},
];
function defaultFieldNoteItem(){ return {rating:null,memo:''}; }
function defaultComplexFieldNote(){
  const items={};
  FIELD_NOTE_ITEMS.forEach(({key})=>{ items[key]=defaultFieldNoteItem(); });
  return {visitedAt:null,items,memo:''};
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

/* B-86: 배열이어야 할 필드가 truthy 비배열(문자열·객체 등)로 오염되면 뒤이은
   .map()에서 TypeError가 나 applyGuards() 전체가 중단되고 renderAll()도
   실행 안 돼 화면이 완전히 빈 채로 멈춤(단일 실패점) — 기존 ||[] 는 falsy만
   걸러서 truthy 비배열은 그대로 통과시켰음. Array.isArray로 실제 검사하고
   안전한 기본값으로 대체, 콘솔 warn 1줄로 원인 추적 가능하게(누락은 정상
   케이스라 조용히 기본값 적용, "값은 있는데 타입이 틀린" 경우만 경고) */
function guardArr(val,fallback,label){
  if(Array.isArray(val)) return val;
  if(val!=null) console.warn(`applyGuards: ${label}이(가) 배열이 아니라 기본값으로 대체됨(타입: ${typeof val})`);
  return fallback;
}
/* ---- load with migration ---- */
function applyGuards(raw){
  state=Object.assign(structuredClone(DEFAULT), raw||{});
  state.profile=Object.assign(structuredClone(DEFAULT_PROFILE), state.profile||{});
  if(!Array.isArray(state.profile.milestones)||!state.profile.milestones.length) state.profile.milestones=structuredClone(DEFAULT_PROFILE.milestones);
  /* B-86: milestone.label이 문자열이 아니면(누락·오염) ai.js profileLine()의
     m.label.includes(...)에서 크래시 — ai.js는 안 건드리고 데이터 쪽에서
     보정. 누락(undefined)은 정상 케이스라 조용히, 값이 있는데 타입이 틀린
     경우만 경고 */
  state.profile.milestones=state.profile.milestones.map(m=>{
    const validLabel=typeof (m&&m.label)==='string';
    if(!validLabel&&m&&m.label!=null) console.warn(`applyGuards: milestone.label이 문자열이 아니라 빈 문자열로 대체됨(타입: ${typeof m.label})`);
    return {...m, label:validLabel?m.label:''};
  });
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
  /* B-86: grades.area/households가 배열이 아니면(오염) calcAreaGrade/
     calcHouseholdGrade(utils.js)의 배열 구조분해([g1,g2]=...)에서 크래시 —
     기본값으로 되돌림 */
  state.settings.grades.area=guardArr(state.settings.grades.area,structuredClone(GRADE_DEFAULTS.area),'settings.grades.area');
  state.settings.grades.households=guardArr(state.settings.grades.households,structuredClone(GRADE_DEFAULTS.households),'settings.grades.households');
  /* B-61: 통근 기준지 2인 — 항상 정확히 2개, 항목별 병합(구 데이터가 아예
     없거나 1개뿐이거나 name/dest 일부만 있어도 나머지는 기본값으로 채움) */
  const commutersRaw=Array.isArray(state.settings.commuters)?state.settings.commuters:[];
  state.settings.commuters=DEFAULT.settings.commuters.map((def,i)=>({...def, ...(commutersRaw[i]||{})}));
  state.chatHistory=state.chatHistory||[];
  state.actions=guardArr(state.actions,structuredClone(DEFAULT.actions),'actions');
  /* B-30: assignee(담당)·due(마감) 필드 누락 보정, 기본 '' — 기존 액션
     무손실(미지정/마감없음으로 자연 해석됨) */
  state.actions=state.actions.map(a=>({category:'',assignee:'',due:'',...a}));
  if(!state._prepMigrated){
    const ids=new Set(state.actions.map(a=>a.id));
    /* B-86: priority가 숫자가 아닌 항목이 하나라도 섞이면 Math.max가 NaN을
       반환해(NaN 오염) 이후 ++p로 이관되는 항목이 전부 priority:NaN이 되고
       정렬이 깨짐 — 숫자인 것만 모아 최댓값 계산, 하나도 없으면 0 */
    const numericPriorities=state.actions.map(x=>x.priority).filter(x=>typeof x==='number'&&!isNaN(x));
    let p=numericPriorities.length?Math.max(...numericPriorities):0;
    (state.prep||[]).forEach(t=>{if(!ids.has(t.id))state.actions.push({id:t.id,text:t.tx+(t.sub?` (${t.sub})`:''),priority:++p,done:t.done||false,category:'매물준비'});});
    (state.steps||[]).forEach(t=>{if(!ids.has(t.id))state.actions.push({id:t.id,text:t.tx+(t.sub?` (${t.sub})`:''),priority:++p,done:t.done||false,category:'계약'});});
    state._prepMigrated=true;
  }
  state.properties=guardArr(state.properties,[],'properties').map(p=>{
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
  state.complexes=guardArr(state.complexes,[],'complexes').map(cx=>{
    const commutesRaw=Array.isArray(cx.commutes)?cx.commutes:[];
    const commutes=[0,1].map(i=>({minutes:null,transfers:null,destSnapshot:'', ...(commutesRaw[i]||{})}));
    /* B-41: fieldNote 항목별 병합 — safety(listings[])와 동일 패턴. 일부 항목만
       저장된 기존 데이터도 나머지 항목이 defaultFieldNoteItem()으로 채워지게 함
       (무손실). rating은 Number()로 관대하게 변환(다른 필드의 문자열 숫자 파싱
       관례와 동일, 예: '3'→3) 후 1~5 정수인지만 검증 — 비수치 문자열·소수·
       범위밖·0·음수는 기본값(null)으로 되돌림, 미입력과 1점을 엄격히 구분 */
    const fnRaw=(cx.fieldNote&&typeof cx.fieldNote==='object'&&!Array.isArray(cx.fieldNote))?cx.fieldNote:{};
    const fnItemsRaw=(fnRaw.items&&typeof fnRaw.items==='object'&&!Array.isArray(fnRaw.items))?fnRaw.items:{};
    const fnItems={};
    FIELD_NOTE_ITEMS.forEach(({key})=>{
      const raw=fnItemsRaw[key];
      const validRaw=(raw&&typeof raw==='object'&&!Array.isArray(raw))?raw:null;
      if(raw!=null&&!validRaw) console.warn(`applyGuards: complexes[${cx.id||'?'}].fieldNote.items.${key}가 객체가 아니라 기본값으로 대체됨(타입: ${typeof raw})`);
      let rating=validRaw&&validRaw.rating!=null?Number(validRaw.rating):null;
      if(rating==null||!Number.isInteger(rating)||rating<1||rating>5) rating=null;
      fnItems[key]={rating, memo:(validRaw&&typeof validRaw.memo==='string')?validRaw.memo:''};
    });
    const fieldNote={
      visitedAt: typeof fnRaw.visitedAt==='string'?fnRaw.visitedAt:null,
      items: fnItems,
      memo: typeof fnRaw.memo==='string'?fnRaw.memo:'',
    };
    return {
      parking:null, parkingState:'unknown',
      pros:'', cons:'', verdict:'',
      favorite:false,
      commuteMemo:'',
      ...cx,
      commutes,
      fieldNote,
    };
  });
  /* B-27-lite: safety 필드 누락 보정 — 항목별로 병합해 일부만 저장된 기존
     데이터도 나머지 항목이 defaultSafetyItem()으로 채워지게 함(무손실) */
  state.listings=guardArr(state.listings,[],'listings').map(l=>{
    const safety=defaultListingSafety();
    SAFETY_ITEMS.forEach(({key})=>{
      /* B-86: l.safety[key]가 객체가 아니면(문자열·배열·숫자 등으로 오염) 그대로
         스프레드하면 엉뚱한 모양의 객체가 만들어짐(예: 문자열은 인덱스 키로
         쪼개져 들어감) — 객체일 때만 병합하고, 아니면 기본값 유지 */
      const raw=l.safety&&l.safety[key];
      const validRaw=(raw&&typeof raw==='object'&&!Array.isArray(raw))?raw:null;
      if(raw!=null&&!validRaw) console.warn(`applyGuards: listings[${l.id||'?'}].safety.${key}가 객체가 아니라 기본값으로 대체됨(타입: ${typeof raw})`);
      safety[key]={...safety[key], ...(validRaw||{})};
    });
    return {
      managementFeeState:'unknown',
      ...l,
      managementFeeState: l.managementFeeState || (l.managementFee!=null?'known':'unknown'),
      safety,
    };
  });
  state.scraps=guardArr(state.scraps,[],'scraps').map(s=>{
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
    state.settings.owners=['본인','배우자','공동'];
    syncOwners();
    recordStateJsonSize(JSON.stringify(state));
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
  recordStateJsonSize(JSON.stringify(state));
  renderAll();
  /* B-80: 지난 세션의 flushPendingSync/syncToRedis가 미동기로 끝났으면(플래그
     남아있음) 이번 로드에서 안내 — 자동으로 뭔가 하지 않고 표시만. 성공
     동기화가 확인되면(clearUnsyncedFlag) 자동으로 사라짐 */
  try{
    if(localStorage.getItem(SH_UNSYNCED_KEY)==='1'){
      const banner=document.getElementById('unsyncedBanner');
      if(banner) banner.style.display='';
    }
  }catch(e){}
}
/* B-84: localStorage는 항상 즉시(save() 호출마다), Redis는 800ms 디바운스 —
   단 연타 입력이 계속되면 clearTimeout이 매번 리셋돼 최초 편집 후 Redis
   반영이 무한정 밀릴 수 있어(예: 10초간 타이핑) maxWait 도입. 최초 save() 시점
   기준 5초가 지나면 디바운스를 무시하고 다음 tick에 강제 전송 — 800ms 기본
   디바운스 값 자체는 무변경(일반 편집은 기존과 동일하게 800ms 후 1회 전송) */
const SYNC_DEBOUNCE_MS=800, SYNC_MAX_WAIT_MS=5000;
let syncTimer=null, syncBurstStartedAt=null;
async function save(){
  if(isGuestMode){ const n=document.getElementById('savedNote'); n.textContent='데모 모드 — 저장되지 않아요'; n.style.color='var(--ink-faint)'; return; }
  const n=document.getElementById('savedNote'); n.textContent='저장 중…'; n.style.color='var(--ink-soft)';
  const json=JSON.stringify(state);
  const bytes=recordStateJsonSize(json);
  try{
    localStorage.setItem('sweetyhome',json);
  }catch(e){
    /* B-80: 조용히 삼키지 않고 칩 상태 반영 + 원인 추적용 크기 로그(용량 초과가
       흔한 원인이라 KB를 같이 남김). Redis 동기화는 로컬 저장과 무관하게
       그대로 시도(로컬이 실패했다면 오히려 Redis가 유일한 백업이 됨) */
    const kb=(bytes/1024).toFixed(1);
    console.warn(`save(): localStorage 저장 실패(state 크기 ${kb}KB) — ${e&&e.message}`);
    setSyncState('localfail');
  }
  const now=Date.now();
  if(syncTimer==null) syncBurstStartedAt=now;
  clearTimeout(syncTimer);
  const waited=now-syncBurstStartedAt;
  const delay=waited>=SYNC_MAX_WAIT_MS?0:Math.min(SYNC_DEBOUNCE_MS,SYNC_MAX_WAIT_MS-waited);
  syncTimer=setTimeout(async()=>{
    syncTimer=null; syncBurstStartedAt=null;
    n.textContent='변경사항은 자동 저장됩니다'; n.style.color='';
    await syncToRedis();
  },delay);
}
/* B-84: 페이지 이탈 시 대기 중인 Redis 동기화(디바운스 타이머가 아직 안 울린
   상태)가 있으면 즉시 전송 — 안 그러면 마지막 편집 후 800ms(또는 maxWait
   대기 중) 안에 탭을 닫거나 당겨서 새로고침하면 그 편집이 Redis엔 영영
   반영 안 됨(localStorage엔 이미 있으니 기기 안에서는 안 없어짐).
   Bearer 토큰 헤더가 필요해 sendBeacon은 못 쓰고 fetch keepalive 사용 —
   keepalive 요청은 본문 64KB 제한이 있어 사진 포함 state는 실패할 수 있음.
   응답을 못 받고 페이지가 사라질 가능성이 있어 "성공 확인 전까지는
   미동기로 간주"하는 보수적 순서로 처리(실패를 조용히 삼키지 않음) */
function flushPendingSync(){
  if(isGuestMode||syncTimer==null) return;
  clearTimeout(syncTimer); syncTimer=null; syncBurstStartedAt=null;
  markUnsynced();
  try{
    fetch('/api/state',{method:'POST',headers:authHeaders(),keepalive:true,body:JSON.stringify({state})})
      .then(res=>res.json())
      .then(j=>{ if(j.ok) clearUnsyncedFlag(); })
      .catch(()=>{});
  }catch(e){}
}
window.addEventListener('pagehide',flushPendingSync);
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden') flushPendingSync(); });
