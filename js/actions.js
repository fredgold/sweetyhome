/* ============ 액션 (전체) ============ */
let actSearchQuery='';
function renderActions(){
  const aq=(document.getElementById('act_search')?.value||'').trim().toLowerCase();
  const sorted=[...state.actions].sort((a,b)=>(a.done-b.done)||(a.priority-b.priority));
  let live=sorted.filter(a=>!a.done);
  let done=sorted.filter(a=>a.done);
  if(aq){ live=live.filter(a=>(a.text||'').toLowerCase().includes(aq)); done=done.filter(a=>(a.text||'').toLowerCase().includes(aq)); }
  const el=document.getElementById('act_list');
  if(!state.actions.length){
    el.innerHTML='<div class="empty"><div class="big">아직 액션이 없어요</div>아래에 할 일을 적어보세요.</div>';
    return;
  }
  let html='<div class="actfull">';
  if(live.length){
    html+=live.map((a,i)=>`
      <div class="actrow" data-done="0" data-id="${a.id}">
        <span class="rank tnum">${i+1}</span>
        <span class="box" data-actf-done="${a.id}">${CHECK}</span>
        <span class="atx">${esc(a.text)}</span>
        <button class="star ${a.priority<=Math.min(...live.map(x=>x.priority))?'on':''}" data-actf-top="${a.id}" title="맨 위로">★</button>
        <button class="xx" data-actf-del="${a.id}">✕</button>
      </div>`).join('');
  } else {
    html+='<div class="empty"><div class="big">모든 액션 완료!</div>새 할 일을 추가하거나 AI 제안을 받아보세요.</div>';
  }
  if(done.length){
    html+=`<div class="done-section"><div class="done-head" id="act_doneToggle"><span class="arw">▾</span> 완료 ${done.length}개</div><div class="done-body">`;
    html+=done.map(a=>`
      <div class="actrow" data-done="1" data-id="${a.id}">
        <span class="rank tnum"></span>
        <span class="box" data-actf-done="${a.id}">${CHECK}</span>
        <span class="atx">${esc(a.text)}</span>
        <button class="xx" data-actf-del="${a.id}">✕</button>
      </div>`).join('');
    html+='</div></div>';
  }
  html+='</div>';
  el.innerHTML=html;
  el.querySelectorAll('[data-actf-done]').forEach(b=>b.onclick=()=>{
    const a=state.actions.find(x=>x.id===b.dataset.actfDone);
    if(a){a.done=!a.done;save();renderActions();renderTop3();}
  });
  el.querySelectorAll('[data-actf-top]').forEach(b=>b.onclick=()=>{
    const a=state.actions.find(x=>x.id===b.dataset.actfTop);
    if(a){const min=Math.min(...state.actions.map(x=>x.priority));a.priority=min-1;a.done=false;save();renderActions();renderTop3();}
  });
  el.querySelectorAll('[data-actf-del]').forEach(b=>b.onclick=()=>{
    if(!confirm('이 액션을 삭제할까요?'))return;
    state.actions=state.actions.filter(x=>x.id!==b.dataset.actfDel);save();renderActions();renderTop3();
  });
  const dt=document.getElementById('act_doneToggle');
  if(dt) dt.onclick=()=>dt.parentElement.classList.toggle('collapsed');
}
function addActionFull(){
  const inp=document.getElementById('act_input'); const t=inp.value.trim(); if(!t){inp.focus();return;}
  const max=state.actions.length?Math.max(...state.actions.map(x=>x.priority)):0;
  state.actions.push({id:'a'+Date.now(),text:t,priority:max+1,done:false});
  inp.value=''; save(); renderActions(); renderTop3();
}
document.getElementById('act_addBtn').onclick=addActionFull;
document.getElementById('act_search').addEventListener('input',e=>{actSearchQuery=e.target.value.trim();renderActions();});
document.getElementById('act_input').addEventListener('keydown',e=>{if(e.key==='Enter')addActionFull();});

document.getElementById('act_suggestBtn').onclick=async()=>{
  const btn=document.getElementById('act_suggestBtn');
  const box=document.getElementById('act_suggestions');
  btn.disabled=true; const old=btn.textContent; btn.textContent='생각 중…';
  box.innerHTML='';
  try{
    const out=await claudeAPI([{role:'user',content:
      `우리 현재 상황을 보고, 지금 해야 할 다음 액션 2~3개를 제안해줘. 설명·마크다운 금지, JSON 배열만.\n`+
      `형식: [{"text":"액션 내용(구체적으로, 20자 이내)"}]\n`+
      `이미 있는 액션과 겹치지 않게. 실용적이고 바로 실행 가능한 것 위주.\n\n`+
      `[현재 데이터]\n${stateSnapshot()}`}],
      [{type:'web_search_20250305',name:'web_search'}],
      `당신은 ${profileLine()} 내집마련 코치. 한국어. 최신 정보는 web_search로 확인.`);
    const arr=parseJSON(out);
    if(Array.isArray(arr)&&arr.length){
      box.innerHTML=arr.map(s=>`
        <div class="act-suggest-card">
          <span class="stx">💡 ${esc(s.text)}</span>
          <button class="btn-adopt" data-suggest="${esc(s.text)}">＋ 채택</button>
        </div>`).join('');
      box.querySelectorAll('[data-suggest]').forEach(b=>b.onclick=()=>{
        const max=state.actions.length?Math.max(...state.actions.map(x=>x.priority)):0;
        state.actions.push({id:'a'+Date.now(),text:b.dataset.suggest,priority:max+1,done:false});
        b.closest('.act-suggest-card').remove();
        save(); renderActions(); renderTop3();
      });
      btn.textContent='✓ 제안 완료';
    } else { btn.textContent='제안을 파싱하지 못했어요'; }
  }catch(e){ btn.textContent=e.message==='AI_UNAVAILABLE'?aiUnavailableMsg():'AI 응답 실패'; }
  setTimeout(()=>{btn.disabled=false;btn.textContent=old;},2000);
};
