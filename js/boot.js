/* ============ boot ============ */
function renderAll(){
  if(!isGuestMode) document.getElementById('brandSub').textContent=state.profile.names+' · 결혼 & 내집마련 준비 보드';
  renderGates();
  renderDash();
  renderAssets();
  renderProps();
  renderActions();
  renderScraps();
  renderRegNews();
  if(activePanel==='props'){ initOverview(); }
}

/* B-24: 새로고침 후 보던 화면 유지. nav.js(switchPanel 정의)는 Codex 충돌 우려로
   미접촉 — 여기선 이미 정의된 switchPanel을 "호출"만 한다. sessionStorage는 탭이
   살아있는 동안만 유지되므로(reload에도 보존, 새 탭/완전종료엔 초기화) "이 세션에서
   마지막으로 보던 화면"이라는 의도에 정확히 맞음 */
const SH_VIEW_KEY='sh_lastView';
function saveViewState(){
  try{
    sessionStorage.setItem(SH_VIEW_KEY,JSON.stringify({
      panel:activePanel,
      propViewMode:(typeof propViewMode!=='undefined'?propViewMode:'map'),
    }));
  }catch(e){}
}
function restoreLastView(){
  try{
    const raw=sessionStorage.getItem(SH_VIEW_KEY);
    if(!raw) return;
    const v=JSON.parse(raw);
    const panels=['dash','assets','props','actions','scraps'];
    if(v.panel&&panels.includes(v.panel)&&typeof switchPanel==='function') switchPanel(v.panel);
    if(v.panel==='props'&&(v.propViewMode==='map'||v.propViewMode==='list')&&typeof applyPropViewMode==='function'){
      propViewMode=v.propViewMode; applyPropViewMode();
    }
  }catch(e){}
}
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden') saveViewState(); });
window.addEventListener('pagehide',saveViewState);

load().then(restoreLastView);

(async()=>{
  try{
    const res=await fetch('/api/health',{headers:authHeaders()});
    const j=await res.json();
    aiAvailable=j.ok;
    updateAiButtons();
    const el=document.getElementById('chatApiStatus');
    if(!j.ok){
      el.className='ai-status warn';
      el.textContent='⚠️ AI 기능은 크레딧 충전이 필요해요. → console.anthropic.com';
    } else {
      el.className='ai-status ok';
      el.textContent='✓ AI 연결됨';
      setTimeout(()=>el.style.display='none',3000);
    }
  }catch(e){}
})();

/* B-23: iOS 홈화면 웹앱(standalone) 전용 당겨서 새로고침. navigator.standalone이 true인
   경우에만 리스너를 붙임 — 안드로이드 Chrome·일반 브라우저 탭은 자체 pull-to-refresh를
   그대로 쓰도록 아예 관여하지 않음(충돌 방지). 세로 이동이 가로보다 우세할 때만 pull
   제스처로 판정해 매물탭 지도뷰의 #complexSection 가로 스와이프와 겹치지 않게 함 */
(()=>{
  if(window.navigator.standalone!==true) return;
  document.documentElement.classList.add('ios-pwa');

  const THRESHOLD=70, MAX_PULL=110, DAMP=0.5;
  const el=document.getElementById('ptrIndicator');
  const spinner=el&&el.querySelector('.ptr-spinner');
  if(!el) return;

  let startX=0,startY=0,active=false,dragging=false,ready=false;

  function atTop(){ return (document.scrollingElement||document.documentElement).scrollTop<=0; }
  function anyModalOpen(){ return !!document.querySelector('.modal.open'); }

  function setIndicator(dist,isReady){
    el.style.transform='translateY('+dist+'px)';
    if(spinner) spinner.style.transform='rotate('+Math.round((dist/THRESHOLD)*360)+'deg)';
    el.classList.toggle('ptr-ready',isReady);
  }
  function resetIndicator(){
    el.style.transition='transform .2s ease';
    setIndicator(0,false);
    setTimeout(()=>{ el.classList.remove('ptr-show','ptr-spin'); el.style.transition=''; },200);
  }

  /* B-52: 매물탭 지도(#overviewMap/.mapcard) 위에서 시작한 터치는 PTR 후보에서
     제외 — 지도를 아래로 드래그(패닝)하는 제스처도 "세로 우세"라 손대지 않으면
     PTR로 오판돼 지도를 못 움직이고 새로고침이 발동됨. 시작점만 판정하고 지도
     밖(리스트뷰 최상단 등)은 그대로 정상 PTR 동작 */
  document.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||anyModalOpen()||!atTop()||e.target.closest('#overviewMap, .mapcard')){ active=false; return; }
    startX=e.touches[0].clientX; startY=e.touches[0].clientY;
    active=true; dragging=false; ready=false;
  },{passive:true});

  document.addEventListener('touchmove',e=>{
    if(!active) return;
    const dx=e.touches[0].clientX-startX, dy=e.touches[0].clientY-startY;
    if(!dragging){
      if(Math.abs(dx)<6&&Math.abs(dy)<6) return;
      if(dy<=0||Math.abs(dy)<=Math.abs(dx)){ active=false; return; } // 위로 스와이프·가로 우세 → pull 아님
      dragging=true;
      el.style.transition='none';
      el.classList.add('ptr-show');
    }
    if(!atTop()){ active=false; dragging=false; resetIndicator(); return; }
    const dist=Math.min(MAX_PULL,dy*DAMP);
    ready=dist>=THRESHOLD;
    setIndicator(dist,ready);
    e.preventDefault();
  },{passive:false});

  function finish(){
    if(!dragging){ active=false; return; }
    if(ready){
      el.classList.add('ptr-spin');
      el.style.transition='transform .15s ease';
      setIndicator(THRESHOLD*0.6,true);
      setTimeout(()=>{ saveViewState(); location.reload(); },250);
    } else {
      resetIndicator();
    }
    active=false; dragging=false; ready=false;
  }
  document.addEventListener('touchend',finish);
  document.addEventListener('touchcancel',finish);
})();
