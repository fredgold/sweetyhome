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
