/* ============ 로그인 ============ */
let isGuestMode=false;
/* B-65: sessionStorage(탭 닫히면 소멸) → localStorage 전환 + 만료시각(sh_token_exp)
   별도 저장. 서버 세션 TTL(api/_auth.js SESSION_TTL=86400초=24h)과 동일한 값 —
   TTL 자체는 시크릿이 아니라 상수로 코드에 둠. 서버 TTL이 바뀌면 이 값도 같이 바꿔야 함 */
const SH_TOKEN_TTL_MS=24*60*60*1000;
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
  return t;
}
function authHeaders(extra){
  const h=Object.assign({'Content-Type':'application/json'},extra||{});
  const t=getToken(); if(t) h['Authorization']='Bearer '+t;
  return h;
}
function unlockApp(isGuest){
  document.getElementById('loginOverlay').classList.add('hidden');
  if(isGuest){
    isGuestMode=true;
    OWNERS=['본인','배우자','공동'];
    document.body.classList.add('guest');
    document.getElementById('guestBadge').textContent='데모';
    document.querySelector('.brand .sub').textContent='예비부부 · 결혼 & 내집마련 준비 보드 (체험판)';
  }
  load();
}
function forceLogin(){
  clearToken();
  document.getElementById('loginOverlay').classList.remove('hidden');
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
      if(r.ok){ document.getElementById('loginOverlay').classList.add('hidden'); return; }
    }catch(e){}
    clearToken();
  }
  document.getElementById('loginBtn').onclick=tryLogin;
  document.getElementById('loginInput').addEventListener('keydown',e=>{
    if(e.key==='Enter') tryLogin();
  });
  document.getElementById('loginGuest').onclick=()=>unlockApp(true);
})();
document.getElementById('goHome').onclick=()=>switchPanel('dash');
document.getElementById('logoutBtn').onclick=()=>{
  clearToken();
  location.reload();
};
