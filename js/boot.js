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
load();

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

  document.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||anyModalOpen()||!atTop()){ active=false; return; }
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
      setTimeout(()=>location.reload(),250);
    } else {
      resetIndicator();
    }
    active=false; dragging=false; ready=false;
  }
  document.addEventListener('touchend',finish);
  document.addEventListener('touchcancel',finish);
})();
