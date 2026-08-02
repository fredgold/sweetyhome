/* ============ 로그인 ============ */
let isGuestMode=false;
/* B-65: sessionStorage(탭 닫히면 소멸) → localStorage 전환 + 만료시각(sh_token_exp)
   별도 저장. 서버 세션 TTL(api/_auth.js SESSION_TTL=30일)과 동일한 값 —
   TTL 자체는 시크릿이 아니라 상수로 코드에 둠. 서버 TTL이 바뀌면 이 값도 같이 바꿔야 함.
   B-113: 24h→30일 + 슬라이딩 갱신. 서버가 verifySession 성공마다 Redis TTL을
   재설정하므로, 클라도 토큰을 실제 사용할 때마다(getToken) sh_token_exp를 같이
   미뤄야 서버는 살아있는데 클라가 먼저 로컬 만료로 재로그인을 강제하는 불일치가
   안 생김 */
const SH_TOKEN_TTL_MS=30*24*60*60*1000;
function setToken(token){
  localStorage.setItem('sh_token',token);
  localStorage.setItem('sh_token_exp',String(Date.now()+SH_TOKEN_TTL_MS));
}
function clearToken(){
  localStorage.removeItem('sh_token');
  localStorage.removeItem('sh_token_exp');
}
function getToken(){
  const t=localStorage.getItem('sh_token');
  if(!t) return null;
  const exp=+localStorage.getItem('sh_token_exp');
  if(!exp||Date.now()>exp){ clearToken(); return null; }
  localStorage.setItem('sh_token_exp',String(Date.now()+SH_TOKEN_TTL_MS));
  return t;
}
function authHeaders(extra){
  const h=Object.assign({'Content-Type':'application/json'},extra||{});
  const t=getToken(); if(t) h['Authorization']='Bearer '+t;
  return h;
}
/* B-182②: 로그인 오버레이 — 모달과 동일한 이유(UX-02, 배경 앱 tabbable
   요소가 그대로 남아있음)로 보이는 동안 .wrap을 inert. utils.js의
   _activeTrapContainer가 이 오버레이도 확인하도록 확장해 Tab 트랩도
   공유(모달과 같은 이중 방어 — inert 지원 브라우저는 중복 방어,
   미지원은 이게 유일한 방어선) */
function _syncLoginOverlayA11y(){
  const overlay=document.getElementById('loginOverlay');
  const wrap=document.querySelector('.wrap');
  if(!overlay||!wrap)return;
  if(overlay.classList.contains('hidden')){
    wrap.removeAttribute('inert');
  }else{
    wrap.setAttribute('inert','');
    const input=document.getElementById('loginInput');
    if(input&&!overlay.contains(document.activeElement)) input.focus();
  }
}
function unlockApp(isGuest){
  document.getElementById('loginOverlay').classList.add('hidden');
  _syncLoginOverlayA11y();
  if(isGuest){
    isGuestMode=true;
    document.body.classList.add('guest');
    document.getElementById('guestBadge').textContent='데모';
    document.querySelector('.brand .sub').textContent='예비부부 · 결혼 & 내집마련 준비 보드 (체험판)';
  }
  load();
}
function forceLogin(){
  clearToken();
  document.getElementById('loginOverlay').classList.remove('hidden');
  _syncLoginOverlayA11y();
}
async function tryLogin(){
  const btn=document.getElementById('loginBtn');
  const errEl=document.getElementById('loginErr');
  const input=document.getElementById('loginInput');
  const v=input.value.trim();
  if(!v){ errEl.textContent='비밀번호를 입력해주세요.'; return; }
  btn.disabled=true; btn.textContent='확인 중…';
  try{
    const r=await fetch('/api/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({pin:v})
    });
    const d=await r.json();
    if(d.ok&&d.token){ setToken(d.token); unlockApp(false); return; }
    errEl.textContent=d.error||'비밀번호가 틀렸어요.';
    if(d.locked){
      input.disabled=true; btn.disabled=true;
      btn.textContent='잠금됨';
      const sec=d.remainSeconds||300;
      setTimeout(()=>{ input.disabled=false; btn.disabled=false; btn.textContent='입장하기'; errEl.textContent=''; },sec*1000);
    }
  }catch(e){ errEl.textContent='서버 연결 실패'; }
  finally{ if(!btn.textContent.includes('잠금')){ btn.disabled=false; btn.textContent='입장하기'; } }
}
(async function(){
  const token=getToken();
  if(token){
    try{
      const r=await fetch('/api/state',{headers:{'Authorization':'Bearer '+token}});
      if(r.ok){ document.getElementById('loginOverlay').classList.add('hidden'); _syncLoginOverlayA11y(); return; }
    }catch(e){}
    clearToken();
  }
  document.getElementById('loginBtn').onclick=tryLogin;
  document.getElementById('loginInput').addEventListener('keydown',e=>{
    if(e.key==='Enter') tryLogin();
  });
  document.getElementById('loginGuest').onclick=()=>unlockApp(true);
  _syncLoginOverlayA11y();
})();
document.getElementById('goHome').onclick=()=>switchPanel('dash');
document.getElementById('logoutBtn').onclick=()=>{
  clearToken();
  location.reload();
};
