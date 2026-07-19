/* ============ 액션 (전체) ============ */
let actSearchQuery='', actCategoryFilter='';
const ACT_CATS=['매물준비','계약'];
const ACT_GROUPS=[
  {key:'',label:'일반'},
  ...ACT_CATS.map(category=>({key:category,label:category}))
];
function actGroupKey(a){return ACT_CATS.includes(a.category)?a.category:'';}
function renderCatChips(){
  const el=document.getElementById('act_cat_chips'); if(!el)return;
  const hasCats=state.actions.some(a=>ACT_CATS.includes(a.category));
  if(!hasCats){el.innerHTML='';return;}
  const all=['전체','일반',...ACT_CATS];
  el.innerHTML=all.map(c=>{
    const val=c==='전체'?'':c==='일반'?'__none__':c;
    const on=actCategoryFilter===val;
    return `<button class="sc-chip act-cat-chip${on?' on':''}" data-actcat="${val}">${esc(c)}</button>`;
  }).join('');
  el.querySelectorAll('[data-actcat]').forEach(b=>b.onclick=()=>{actCategoryFilter=b.dataset.actcat;renderCatChips();renderActions();});
}
function actOwnerLabel(owner){return owner&&!OWNERS.includes(owner)?`(이전: ${owner})`:owner;}
function syncActOwnerSelect(){
  const sel=document.getElementById('act_ownerSel'); if(!sel) return;
  const cur=sel.value;
  sel.innerHTML='<option value="">담당 미지정</option>'+OWNERS.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('');
  if([...sel.options].some(o=>o.value===cur)) sel.value=cur;
}
/* B-30: due는 <input type="date">라 보통 빈 값이거나 유효한 ISO 날짜지만,
   혹시 모를 손상된 값(예: 수동 JSON 편집)에 대비해 렌더 전 형식 가드 */
function actDueValid(due){
  if(!due) return false;
  const d=new Date(due);
  return !isNaN(d.getTime());
}
/* B-30: nav.js의 dday()는 "YYYY-MM-DD"를 new Date(t)로 파싱하는데, 이는 스펙상
   UTC 자정으로 해석돼(로컬 자정과 시차만큼 어긋남 — 한국 시간대 KST=UTC+9라
   매일 어긋남) 마감 당일·경계 부근에서 "지남" 판정이 틀릴 수 있음(실측으로
   발견). nav.js는 무접촉 대상이라 고치는 대신, 연·월·일을 분해해 3-인자
   Date 생성자(로컬 자정으로 확정 해석됨)로 직접 조립해 이 함수만 정확하게 함 */
function actDaysUntilDue(due){
  const [y,m,d]=due.split('-').map(Number);
  const dueLocal=new Date(y,m-1,d);
  const today=new Date(); today.setHours(0,0,0,0);
  return Math.round((dueLocal-today)/86400000);
}
function actDueBadge(a){
  if(!actDueValid(a.due)) return '';
  const diff=actDaysUntilDue(a.due);
  const label=diff>=0?'D-'+diff:'D+'+(-diff);
  const overdue=!a.done && diff<0;
  return `<span class="act-due-badge${overdue?' overdue':''}" title="${esc(a.due)}">${esc(label)}</span>`;
}
/* B-114: 별도 order 필드 없이 기존 priority만 재부여한다. 미완료 최솟값은
   ★ 고정 행으로 취급해 직접 이동할 수 없고, 다른 행도 그 위로 갈 수 없다.
   검색·분류 중에는 숨은 행 순서가 모호하므로 순서 변경 UI를 잠근다. */
function actSortedLive(){
  const positions=new Map(state.actions.map((a,i)=>[a.id,i]));
  return state.actions.filter(a=>!a.done).sort((a,b)=>
    (a.priority-b.priority)||(positions.get(a.id)-positions.get(b.id)));
}
function actPinnedId(){return actSortedLive()[0]?.id||'';}
function actReorder(dragId,targetId,place,targetCategory){
  const dragged=state.actions.find(a=>a.id===dragId);
  if(!dragged||dragged.done||dragId===actPinnedId()||dragId===targetId)return false;
  const pinnedId=actPinnedId();
  const oldCategory=dragged.category||'';
  const before=actSortedLive().map(a=>a.id);
  const ordered=actSortedLive().filter(a=>a.id!==dragId);
  dragged.category=ACT_CATS.includes(targetCategory)?targetCategory:'';
  let insertAt=-1;
  if(targetId){
    const targetIndex=ordered.findIndex(a=>a.id===targetId);
    if(targetIndex>=0) insertAt=targetIndex+(place==='after'?1:0);
  }
  if(insertAt<0){
    const lastInGroup=ordered.reduce((last,a,i)=>actGroupKey(a)===dragged.category?i:last,-1);
    insertAt=lastInGroup>=0?lastInGroup+1:ordered.length;
  }
  ordered.splice(insertAt,0,dragged);
  const pinned=ordered.find(a=>a.id===pinnedId);
  const normalized=pinned?[pinned,...ordered.filter(a=>a.id!==pinnedId)]:ordered;
  if(oldCategory===(dragged.category||'')&&before.every((id,i)=>normalized[i]?.id===id))return false;
  normalized.forEach((a,i)=>{a.priority=i+1;});
  save();renderActions();renderTop3();toast(oldCategory===(dragged.category||'')?'순서를 바꿨어요':'분류와 순서를 바꿨어요');
  return true;
}
function actMoveByButton(id,direction){
  const pinnedId=actPinnedId();
  const action=state.actions.find(a=>a.id===id);
  if(!action||action.done||id===pinnedId)return false;
  const group=actSortedLive().filter(a=>actGroupKey(a)===actGroupKey(action));
  const index=group.findIndex(a=>a.id===id);
  const target=group[index+direction];
  if(!target||target.id===pinnedId)return false;
  return actReorder(id,target.id,direction<0?'before':'after',actGroupKey(action));
}
function clearActDragFeedback(el){
  el.querySelector('.act-live-groups')?.classList.remove('is-dragging');
  el.querySelectorAll('.actrow.dragging,.actrow.drop-before,.actrow.drop-after').forEach(row=>
    row.classList.remove('dragging','drop-before','drop-after'));
  el.querySelectorAll('.act-group-body.is-drop-target').forEach(body=>body.classList.remove('is-drop-target'));
}
function bindActDrag(el,orderLocked){
  const groups=el.querySelector('.act-live-groups'); if(!groups||orderLocked)return;
  let dragId='';
  el.querySelectorAll('[data-actf-drag][draggable="true"]').forEach(handle=>{
    handle.addEventListener('keydown',e=>{
      if(e.key!=='ArrowUp'&&e.key!=='ArrowDown')return;
      e.preventDefault();
      actMoveByButton(handle.dataset.actfDrag,e.key==='ArrowUp'?-1:1);
    });
    handle.addEventListener('dragstart',e=>{
      dragId=handle.dataset.actfDrag;
      e.dataTransfer.effectAllowed='move';
      e.dataTransfer.setData('text/plain',dragId);
      groups.classList.add('is-dragging');
      requestAnimationFrame(()=>handle.closest('.actrow')?.classList.add('dragging'));
    });
    handle.addEventListener('dragend',()=>{dragId='';clearActDragFeedback(el);});
  });
  el.querySelectorAll('.act-group-body').forEach(body=>{
    /* B-124: 빈 칼럼은 평소엔 숨겨져 있다가 드래그 시작 시에만
       .is-dragging로 드러난다(줄 바로 아래 `.act-group.is-empty`
       CSS) — 드래그 시작 순간 그 자리에 새 칼럼이 나타나며 레이아웃이
       밀린다. 자기 칼럼 맨 아래에서 살짝만 오버슈트해도(마우스는 전혀
       "다른 칼럼처럼 보이는 곳"으로 옮기지 않았는데) 방금 나타난 빈
       칼럼의 본문에 얹혀 분류가 바뀌는 사고 재현 확인(Playwright 실측).
       빈 칼럼은 행이 하나도 없어 "행 위에 드롭"이 애초에 불가능하므로
       기존 헤드(리스너 없음)와 동일하게 무시 — 분류 변경은 이미 항목이
       있던 칼럼 간에만 허용(기존 동작 그대로), 완전히 빈 칼럼으로
       옮기려면 수정 모달의 분류 드롭다운 사용 */
    const groupIsEmpty=()=>body.closest('.act-group')?.classList.contains('is-empty');
    body.addEventListener('dragover',e=>{
      if(!dragId)return;
      e.preventDefault();
      e.dataTransfer.dropEffect='move';
      el.querySelectorAll('.actrow.drop-before,.actrow.drop-after').forEach(row=>row.classList.remove('drop-before','drop-after'));
      el.querySelectorAll('.act-group-body.is-drop-target').forEach(target=>target.classList.remove('is-drop-target'));
      if(groupIsEmpty())return;
      body.classList.add('is-drop-target');
      const row=e.target.closest('.actrow');
      if(row&&row.dataset.id!==dragId){
        const rect=row.getBoundingClientRect();
        row.classList.add(e.clientY<rect.top+rect.height/2?'drop-before':'drop-after');
      }
      const panel=document.getElementById('panel-actions');
      const panelRect=panel.getBoundingClientRect();
      if(e.clientY<panelRect.top+48)panel.scrollTop-=14;
      else if(e.clientY>panelRect.bottom-48)panel.scrollTop+=14;
    });
    body.addEventListener('drop',e=>{
      if(!dragId)return;
      e.preventDefault();
      if(groupIsEmpty()){clearActDragFeedback(el);dragId='';return;}
      const row=e.target.closest('.actrow');
      if(row?.dataset.id===dragId){clearActDragFeedback(el);dragId='';return;}
      const rect=row?.getBoundingClientRect();
      const place=row&&e.clientY>=rect.top+rect.height/2?'after':'before';
      const targetId=row?.dataset.id||'';
      const category=body.dataset.actCategory||'';
      const movedId=dragId;
      dragId='';
      clearActDragFeedback(el);
      actReorder(movedId,targetId,place,category);
    });
  });
}
function renderActions(){
  syncActOwnerSelect();
  const aq=(document.getElementById('act_search')?.value||'').trim().toLowerCase();
  const sorted=[...state.actions].sort((a,b)=>(a.done-b.done)||(a.priority-b.priority));
  const allLive=sorted.filter(a=>!a.done);
  let live=[...allLive];
  let done=sorted.filter(a=>a.done);
  if(actCategoryFilter==='__none__'){
    live=live.filter(a=>actGroupKey(a)==='');
    done=done.filter(a=>actGroupKey(a)==='');
  } else if(actCategoryFilter){
    live=live.filter(a=>a.category===actCategoryFilter);
    done=done.filter(a=>a.category===actCategoryFilter);
  }
  if(aq){ live=live.filter(a=>(a.text||'').toLowerCase().includes(aq)); done=done.filter(a=>(a.text||'').toLowerCase().includes(aq)); }
  const el=document.getElementById('act_list');
  const pinnedId=allLive[0]?.id||'';
  const orderLocked=Boolean(aq||actCategoryFilter);
  const groupOrders=new Map(ACT_GROUPS.map(group=>[
    group.key,
    allLive.filter(a=>actGroupKey(a)===group.key)
  ]));
  const liveRanks=new Map(live.map((a,i)=>[a.id,i+1]));
  const actionRow=(a,doneRow=false)=>{
    const categoryLabel=a.category||'일반';
    const pinned=!doneRow&&a.id===pinnedId;
    const group=groupOrders.get(actGroupKey(a))||[];
    const groupIndex=group.findIndex(item=>item.id===a.id);
    const canMoveUp=!orderLocked&&!pinned&&groupIndex>0&&group[groupIndex-1]?.id!==pinnedId;
    const canMoveDown=!orderLocked&&!pinned&&groupIndex>=0&&groupIndex<group.length-1;
    const dragEnabled=!doneRow&&!orderLocked&&!pinned;
    const orderTitle=orderLocked?'검색·분류 필터 해제 후 순서 변경':pinned?'★ 고정 행은 다른 항목의 ★를 누른 뒤 이동':'끌어서 순서·분류 변경';
    return `
      <div class="actrow${doneRow?'':' is-sortable'}${pinned?' is-pinned':''}" data-done="${doneRow?'1':'0'}" data-id="${a.id}">
        ${doneRow?'':`<span class="act-order-tools">
          <button type="button" class="act-drag-handle${dragEnabled?'':' is-disabled'}" data-actf-drag="${a.id}" draggable="${dragEnabled?'true':'false'}" aria-label="${esc(orderTitle)}" title="${esc(orderTitle)}"${dragEnabled?'':' disabled'}><span aria-hidden="true">⋮⋮</span></button>
          <button type="button" class="act-move-btn" data-actf-move="${a.id}" data-direction="-1" aria-label="위로 이동"${canMoveUp?'':' disabled'}>▲</button>
          <button type="button" class="act-move-btn" data-actf-move="${a.id}" data-direction="1" aria-label="아래로 이동"${canMoveDown?'':' disabled'}>▼</button>
        </span>`}
        <span class="rank tnum">${doneRow?'':liveRanks.get(a.id)}</span>
        <span class="box" data-actf-done="${a.id}">${CHECK}</span>
        <span class="atx">
          <span class="act-text">${esc(a.text)}</span>
          <span class="act-row-meta">
            <span class="act-cat-badge">${esc(categoryLabel)}</span>
            ${a.assignee?`<span class="act-cat-badge">${esc(actOwnerLabel(a.assignee))}</span>`:''}
            ${actDueBadge(a)}
          </span>
        </span>
        <span class="act-row-actions">
          <button class="act-edit" data-actf-edit="${a.id}" title="수정" aria-label="수정">${ic('edit')}</button>
          ${doneRow?'':`<button class="star ${pinned?'on':''}" data-actf-top="${a.id}" title="${pinned?'맨 위 고정됨':'맨 위로'}" aria-label="${pinned?'맨 위 고정됨':'맨 위로'}">${ic('star')}</button>`}
          <button class="xx" data-actf-del="${a.id}" aria-label="삭제">✕</button>
        </span>
      </div>`;
  };
  let html='<div class="actfull">';
  html+='<div class="act-live-groups">';
  html+=ACT_GROUPS.map(group=>{
    const items=live.filter(a=>actGroupKey(a)===group.key);
    return `<section class="act-group${items.length?'':' is-empty'}" data-act-group="${group.key||'general'}">
      <div class="act-group-head">
        <span>${esc(group.label)}</span>
        <span class="act-group-count tnum">${items.length}</span>
      </div>
      <div class="act-group-body" data-act-category="${esc(group.key)}">${items.map(a=>actionRow(a)).join('')}</div>
    </section>`;
  }).join('');
  html+='</div>';
  if(!live.length){
    html+=state.actions.length
      ?'<div class="empty"><div class="big">모든 액션 완료!</div>새 할 일을 추가하거나 AI 제안을 받아보세요.</div>'
      :'<div class="empty"><div class="big">아직 액션이 없어요</div>아래에 할 일을 적어보세요.</div>';
  }
  if(done.length){
    html+=`<div class="done-section"><div class="done-head" id="act_doneToggle"><span class="arw">▾</span> 완료 ${done.length}개</div><div class="done-body">`;
    html+=done.map(a=>actionRow(a,true)).join('');
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
  el.querySelectorAll('[data-actf-move]').forEach(b=>b.onclick=()=>{
    actMoveByButton(b.dataset.actfMove,Number(b.dataset.direction));
  });
  el.querySelectorAll('[data-actf-del]').forEach(b=>b.onclick=()=>{
    if(!confirm('이 액션을 삭제할까요?'))return;
    state.actions=state.actions.filter(x=>x.id!==b.dataset.actfDel);save();renderActions();renderTop3();
  });
  el.querySelectorAll('[data-actf-edit]').forEach(b=>b.onclick=()=>{
    const a=state.actions.find(x=>x.id===b.dataset.actfEdit); if(!a)return;
    const row=b.closest('.actrow');
    const cats=ACT_CATS.map(c=>`<option value="${esc(c)}"${a.category===c?' selected':''}>${esc(c)}</option>`).join('');
    const legacyOwner=a.assignee&&!OWNERS.includes(a.assignee)?`<option value="${esc(a.assignee)}" selected>${esc(actOwnerLabel(a.assignee))}</option>`:'';
    const owners=legacyOwner+OWNERS.map(o=>`<option value="${esc(o)}"${a.assignee===o?' selected':''}>${esc(o)}</option>`).join('');
    row.innerHTML=`
      <input class="act-edit-inp" value="${esc(a.text)}" style="flex:1;min-width:0;padding:4px 8px;border:1px solid var(--hairline);border-radius:6px;font-size:14px;">
      <select class="act-edit-cat" style="padding:4px 6px;border:1px solid var(--hairline);border-radius:6px;font-size:12px;">
        <option value=""${!a.category?' selected':''}>일반</option>${cats}
      </select>
      <select class="act-edit-owner" style="padding:4px 6px;border:1px solid var(--hairline);border-radius:6px;font-size:12px;">
        <option value=""${!a.assignee?' selected':''}>담당 미지정</option>${owners}
      </select>
      <input type="date" class="act-edit-due" value="${actDueValid(a.due)?esc(a.due):''}" style="padding:4px 6px;border:1px solid var(--hairline);border-radius:6px;font-size:12px;">
      <button class="act-edit-ok" style="padding:4px 10px;background:var(--money);color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;">저장</button>
      <button class="act-edit-cancel" style="padding:4px 8px;background:none;border:1px solid var(--hairline);border-radius:6px;font-size:13px;cursor:pointer;">취소</button>`;
    const inp=row.querySelector('.act-edit-inp');
    const cat=row.querySelector('.act-edit-cat');
    const owner=row.querySelector('.act-edit-owner');
    const due=row.querySelector('.act-edit-due');
    inp.focus(); inp.select();
    const save_=()=>{
      const t=inp.value.trim(); if(!t){inp.focus();return;}
      a.text=t; a.category=cat.value; a.assignee=owner.value; a.due=due.value;
      save(); renderActions(); renderTop3();
    };
    row.querySelector('.act-edit-ok').onclick=save_;
    row.querySelector('.act-edit-cancel').onclick=()=>{renderActions();};
    inp.addEventListener('keydown',e=>{ if(e.key==='Enter')save_(); if(e.key==='Escape'){renderActions();} });
  });
  bindActDrag(el,orderLocked);
  const dt=document.getElementById('act_doneToggle');
  if(dt) dt.onclick=()=>dt.parentElement.classList.toggle('collapsed');
  renderCatChips();
}
function addActionFull(){
  const inp=document.getElementById('act_input'); const t=inp.value.trim(); if(!t){inp.focus();return;}
  const cat=document.getElementById('act_catSel')?.value||'';
  const owner=document.getElementById('act_ownerSel')?.value||'';
  const due=document.getElementById('act_dueInp')?.value||'';
  const max=state.actions.length?Math.max(...state.actions.map(x=>x.priority)):0;
  state.actions.push({id:'a'+Date.now(),text:t,priority:max+1,done:false,category:cat,assignee:owner,due:actDueValid(due)?due:''});
  inp.value=''; save(); renderActions(); renderTop3();
  toast('추가했어요');
}
document.getElementById('act_addBtn').onclick=addActionFull;
document.getElementById('act_search').addEventListener('input',e=>{actSearchQuery=e.target.value.trim();renderActions();});
document.getElementById('act_input').addEventListener('keydown',e=>{if(e.key==='Enter')addActionFull();});

document.getElementById('act_suggestBtn').onclick=async()=>{
  const btn=document.getElementById('act_suggestBtn');
  const box=document.getElementById('act_suggestions');
  btn.disabled=true; const old=btn.innerHTML; btn.textContent='생각 중…';
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
        const cat=document.getElementById('act_catSel')?.value||'';
        state.actions.push({id:'a'+Date.now(),text:b.dataset.suggest,priority:max+1,done:false,category:cat,assignee:'',due:''});
        b.closest('.act-suggest-card').remove();
        save(); renderActions(); renderTop3();
      });
      btn.textContent='✓ 제안 완료';
    } else { btn.textContent='제안을 파싱하지 못했어요'; }
  }catch(e){ btn.textContent=e.message==='AI_UNAVAILABLE'?aiUnavailableMsg():'AI 응답 실패'; }
  setTimeout(()=>{btn.disabled=false;btn.innerHTML=old;},2000);
};
