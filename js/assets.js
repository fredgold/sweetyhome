/* ============ ASSETS ============ */
function ownerSel(v){return OWNERS.map(o=>`<option ${o===v?'selected':''}>${o}</option>`).join('');}
function typeSel(v){return ATYPES.map(o=>`<option ${o===v?'selected':''}>${o}</option>`).join('');}
function liqSel(v){return LIQUIDITY.map(o=>`<option ${o===v?'selected':''}>${o}</option>`).join('');}
function renderAssets(){
  const ownerFilterSel=document.getElementById('asset_ownerFilter');
  if(ownerFilterSel && ownerFilterSel.dataset.owners!==OWNERS.join(',')){
    const prev=ownerFilterSel.value;
    ownerFilterSel.innerHTML='<option value="">전체 소유자</option>'+OWNERS.map(o=>`<option>${o}</option>`).join('');
    ownerFilterSel.dataset.owners=OWNERS.join(',');
    if(OWNERS.includes(prev)) ownerFilterSel.value=prev;
  }
  const ownerF=(document.getElementById('asset_ownerFilter')?.value)||'';
  const assetQ=(document.getElementById('asset_search')?.value||'').trim().toLowerCase();
  let items=assetItems();
  if(ownerF) items=items.filter(it=>it.owner===ownerF);
  if(assetQ) items=items.filter(it=>(it.name||'').toLowerCase().includes(assetQ));
  const box=document.getElementById('a_rows');
  if(!items.length){
    box.innerHTML=`<div class="regempty">아직 자산 항목이 없어요.<br><b>＋ 항목 추가</b>로 한 줄씩 넣거나, <b>${ic('paste')} 시트 붙여넣기</b>로 한 번에 가져오세요.</div>`;
  } else {
    box.innerHTML=items.map(it=>`
      <div class="regrow ${it.liquidity==='즉시'?'imm':'lng'}" data-id="${it.id}">
        <div class="rcell"><span class="regcardlab">소유자</span><select data-f="owner">${ownerSel(it.owner)}</select></div>
        <div class="rcell rc-name"><span class="regcardlab">자산 항목</span><input data-f="name" value="${esc(it.name||'')}" placeholder="예: 국민은행 월급통장"></div>
        <div class="rcell"><span class="regcardlab">현재 금액(원)</span><input class="num" data-f="amount" inputmode="numeric" value="${it.amount?comma(it.amount):''}" placeholder="0"></div>
        <div class="rcell"><span class="regcardlab">형태</span><select data-f="type">${typeSel(it.type)}</select></div>
        <div class="rcell"><span class="regcardlab">유동성</span><select data-f="liquidity">${liqSel(it.liquidity)}</select></div>
        <div class="rcell"><span class="regcardlab">동원 가능액(원)</span><input class="num" data-f="mobilizable" inputmode="numeric" value="${it.mobilizable?comma(it.mobilizable):''}" placeholder="0"></div>
        <div class="rcell rc-memo"><span class="regcardlab">메모</span><input data-f="memo" value="${esc(it.memo||'')}" placeholder="메모"></div>
        <div class="del" data-del-asset="${it.id}" title="삭제">✕</div>
      </div>`).join('');
  }
  bindAssetRows();
  renderAssetSummary();
  document.getElementById('a_target').value=state.settings.targetDeposit||'';
  document.getElementById('a_reserve').value=state.assets.reserve||'';
  document.getElementById('a_notes').value=state.assets.notes||'';
  autoResizeTa(document.getElementById('a_notes'));
  const updEl=document.getElementById('a_updated');
  if(updEl&&state.assets.updatedAt) updEl.textContent='마지막 수정: '+new Date(state.assets.updatedAt).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});
  updateTargetMsg();
}
function bindAssetRows(){
  document.querySelectorAll('#a_rows .regrow').forEach(row=>{
    const it=assetItems().find(x=>x.id===row.dataset.id); if(!it)return;
    row.querySelectorAll('[data-f]').forEach(el=>{
      const f=el.dataset.f;
      const handler=()=>{
        if(f==='amount'||f==='mobilizable'){
          const n=parseInt((el.value||'').replace(/[^\d-]/g,''),10)||0;
          const prevAmt=it.amount;
          it[f]=n;
          if(f==='amount' && (it.mobilizable==null || it.mobilizable===prevAmt || !it.mobilizable)){ it.mobilizable=n; }
        } else { it[f]=el.value; if(f==='liquidity') row.className='regrow '+(el.value==='즉시'?'imm':'lng'); }
        state.assets.updatedAt=Date.now(); renderAssetSummary(); updateTargetMsg(); save();
      };
      el.addEventListener(el.tagName==='SELECT'?'change':'input',handler);
      if((f==='amount'||f==='mobilizable')) el.addEventListener('blur',()=>{ el.value=it[f]?comma(it[f]):''; });
    });
  });
  document.querySelectorAll('#a_rows [data-del-asset]').forEach(b=>b.onclick=()=>{
    state.assets.items=assetItems().filter(x=>x.id!==b.dataset.delAsset); save(); renderAssets();
  });
}
function renderAssetSummary(){
  const mob=sumMob(), total=sumAmount(), imm=sumMobImmediate();
  const reserve=(+state.assets.reserve||0)*10000;
  document.getElementById('s_imm').textContent=won(imm)+'원';
  document.getElementById('s_imm_won').textContent='₩'+comma(imm);
  const left=imm-reserve;
  document.getElementById('s_imm_reserve').innerHTML=reserve>0?`예비비 빼면 실투입 <b class="tnum">${won(left)}</b>`:'&nbsp;';
  document.getElementById('s_total').textContent=won(total)+'원';
  document.getElementById('s_total_won').textContent='₩'+comma(total);
  document.getElementById('s_mob').textContent=won(mob);
  document.getElementById('s_owners').innerHTML=OWNERS.map(o=>{const v=sumByOwner(o);return v>0?`<span class="ownerpill">${o} <b>${won(v)}</b></span>`:'';}).join('')||'<span class="ownerpill" style="color:var(--ink-faint)">소유자별 합계가 여기 표시돼요</span>';
}
function addAssetRow(prefill){
  state.assets.items=assetItems();
  state.assets.items.push(Object.assign({id:'as'+Date.now()+Math.random().toString(36).slice(2,5),owner:'규범',name:'',amount:0,type:'현금',liquidity:'즉시',mobilizable:0,memo:''},prefill||{}));
  save(); renderAssets();
}
document.getElementById('addAssetRow').onclick=()=>{ addAssetRow(); const rows=document.querySelectorAll('#a_rows .regrow'); const last=rows[rows.length-1]; if(last){const nm=last.querySelector('[data-f="name"]'); if(nm)nm.focus();} };

function updateTargetMsg(){
  const total=sumMobImmediate(), tgt=(+state.settings.targetDeposit||0)*100000000;
  const msg=document.getElementById('a_targetMsg');
  if(msg){
    if(tgt<=0) msg.textContent='';
    else { const pct=Math.round(total/tgt*100); msg.innerHTML=`→ 즉시 동원액으로 보증금의 <b style="color:var(--money-deep)">${pct}%</b> 충당`; }
  }
  const rmsg=document.getElementById('a_reserveMsg');
  if(rmsg){
    const reserve=(+state.assets.reserve||0)*10000;
    const left=sumMobImmediate()-reserve;
    rmsg.innerHTML=reserve>0?`→ 예비비 빼면 즉시 실투입 <b style="color:var(--line9-deep)">${won(left)}</b>`:'';
  }
}
document.getElementById('a_target').addEventListener('input',e=>{state.settings.targetDeposit=+e.target.value||0;updateTargetMsg();renderDashSummaries();save();});
document.getElementById('a_reserve').addEventListener('input',e=>{state.assets.reserve=+e.target.value||0;updateTargetMsg();save();});
document.getElementById('asset_ownerFilter').addEventListener('change',()=>renderAssets());
document.getElementById('asset_search').addEventListener('input',()=>renderAssets());

document.getElementById('a_notes').addEventListener('input',e=>{
  autoResizeTa(e.target);
});
document.getElementById('an_saveBtn').onclick=function(){
  state.assets.notes=document.getElementById('a_notes').value;
  state.assets.updatedAt=Date.now();
  save();
  const btn=this; const old=btn.textContent;
  btn.textContent='저장됨'; btn.disabled=true;
  setTimeout(()=>{btn.textContent=old; btn.disabled=false;},1200);
};

/* ── 자산 메모 마크다운 툴바 ── */
document.getElementById('an_mdToolbar').onclick=e=>{
  const btn=e.target.closest('[data-antgt]');if(!btn)return;
  const ta=document.getElementById('a_notes');
  if(btn.dataset.antgt==='wrap'){mdWrap(ta,btn.dataset.open,btn.dataset.close);}
  else if(btn.dataset.antgt==='line'){mdLine(ta,btn.dataset.prefix);}
};
document.getElementById('a_notes').addEventListener('keydown',e=>{
  const ta=e.target, mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key==='b'){e.preventDefault();mdWrap(ta,'**','**');}
  if(mod&&e.key==='i'){e.preventDefault();mdWrap(ta,'*','*');}
});
document.getElementById('an_previewToggle').onclick=function(){
  const ta=document.getElementById('a_notes');
  const prev=document.getElementById('an_mdPreview');
  const on=prev.style.display==='none';
  prev.style.display=on?'':'none';
  ta.style.display=on?'none':'';
  document.getElementById('an_mdToolbar').style.display=on?'none':'';
  this.classList.toggle('on',on);
  this.innerHTML=on?ic('edit')+' 편집':ic('eye')+' 미리보기';
  if(on) prev.innerHTML=renderMd(ta.value)||'<span style="color:var(--ink-faint);font-size:12px;">내용을 입력하면 미리보기가 표시됩니다.</span>';
};

/* 시트 붙여넣기 파서 — 탭(Tab) 구분 우선, 콤마는 천단위라 분리 금지 */
function parseAssetPaste(text){
  const lines=text.split(/\r?\n/).map(l=>l.replace(/\s+$/,'')).filter(l=>l.trim()!=='');
  const toNum=s=>{ const n=(s||'').replace(/[^\d-]/g,''); return n?parseInt(n,10):0; };
  const out=[];
  for(const line of lines){
    if(/소유자|자산\s*항목|현재\s*금액|가능액|합계|요약|동원/.test(line)) continue; // 헤더·요약행 건너뜀
    let cells = line.includes('\t') ? line.split('\t') : line.split(/\s{2,}/);
    cells = cells.map(c=>c.trim());
    while(cells.length && cells[0]==='') cells.shift();
    while(cells.length && cells[cells.length-1]==='') cells.pop();
    if(cells.length<2) continue;

    let owner='규범',name='',amount=0,type='현금',liquidity='즉시',mob=null,memo='';

    if(cells.length>=5){ // 위치 기반 매핑 (시트 열 순서: 소유자·항목·금액·형태·유동성·동원가능액·메모)
      let k=0;
      if(OWNERS.includes(cells[0])){ owner=cells[0]; k=1; }
      name=cells[k]||'';
      amount=toNum(cells[k+1]);
      const t=cells[k+2]; if(ATYPES.includes(t)) type=t;
      const lq=cells[k+3]; if(lq) liquidity=/만기|장기/.test(lq)?'만기·장기':'즉시';
      mob=toNum(cells[k+4]);
      memo=cells.slice(k+5).join(' ').trim();
    } else { // 느슨한 분류 (열이 적게 들어온 경우)
      cells.forEach(c=>{
        if(OWNERS.includes(c)) owner=c;
        else if(ATYPES.includes(c)) type=c;
        else if(/만기|장기|즉시/.test(c)) liquidity=/만기|장기/.test(c)?'만기·장기':'즉시';
        else if(/\d{3,}/.test(c.replace(/[,\s₩원]/g,''))){ const n=toNum(c); if(!amount)amount=n; else if(mob==null)mob=n; }
        else if(!name) name=c; else memo=(memo?memo+' ':'')+c;
      });
    }
    if(mob==null || !mob) mob=amount;
    if(!name && !amount) continue;
    out.push({id:'as'+Date.now()+Math.random().toString(36).slice(2,6),owner,name:name||'(이름)',amount,type,liquidity,mobilizable:mob,memo});
  }
  return out;
}
document.getElementById('a_aiBtn').onclick=()=>{ document.getElementById('assetAiText').value=''; document.getElementById('assetAiOk').textContent=''; openModal('assetAiModal'); };
document.getElementById('pasteAssetBtn').onclick=()=>{ document.getElementById('assetAiText').value=''; document.getElementById('assetAiOk').textContent=''; openModal('assetAiModal'); document.getElementById('assetAiText').focus(); };
document.getElementById('assetAiRun').onclick=async()=>{
  const txt=document.getElementById('assetAiText').value.trim();
  const ok=document.getElementById('assetAiOk'); const btn=document.getElementById('assetAiRun');
  if(!txt){document.getElementById('assetAiText').focus();return;}
  const looksTabular=/\t/.test(txt) || txt.split(/\r?\n/).filter(l=>/\d{3,}/.test(l)).length>=2;
  if(looksTabular){
    const rows=parseAssetPaste(txt);
    if(rows.length){
      const replace=assetItems().length ? confirm(`${rows.length}개 항목을 인식했어요.\n확인=기존 목록 교체 / 취소=뒤에 추가`) : true;
      state.assets.items = replace ? rows : assetItems().concat(rows);
      save(); renderAssets();
      ok.style.color='var(--s-final)'; ok.textContent=`✓ ${rows.length}개 항목을 ${replace?'불러왔어요':'추가했어요'}.`;
      setTimeout(()=>closeModal('assetAiModal'),1100); return;
    }
    ok.style.color='var(--s-drop)'; ok.textContent='행을 인식하지 못했어요. AI로 정리해볼게요…';
  }
  btn.disabled=true; const old=btn.textContent; btn.textContent='정리 중…'; ok.style.color='';
  try{
    const out=await claudeAPI([{role:"user",content:txt}],null,
      `사용자가 적은 자산 정보를 JSON 배열로 정리해. 설명·마크다운 금지, JSON 배열만 출력.\n`+
      `각 원소:{"owner":"규범|연정|공동","name":"항목명","amount":원숫자,"type":"현금|적금|예금|주식|펀드|청약통장|기타","liquidity":"즉시|만기·장기","mobilizable":원숫자,"memo":"한줄"}\n`+
      `금액은 원 단위 숫자(콤마 없이). 예:'1485만'→14850000, '5억'→500000000. mobilizable 모르면 amount와 동일. 소유자 모르면 "규범".`);
    const arr=parseJSON(out);
    if(Array.isArray(arr)&&arr.length){
      const rows=arr.map(o=>({id:'as'+Date.now()+Math.random().toString(36).slice(2,6),owner:OWNERS.includes(o.owner)?o.owner:'규범',name:o.name||'(이름)',amount:+o.amount||0,type:ATYPES.includes(o.type)?o.type:'기타',liquidity:o.liquidity==='만기·장기'?'만기·장기':'즉시',mobilizable:o.mobilizable!=null?+o.mobilizable:(+o.amount||0),memo:o.memo||''}));
      const replace=assetItems().length ? confirm(`${rows.length}개 항목으로 정리했어요.\n확인=교체 / 취소=추가`) : true;
      state.assets.items = replace ? rows : assetItems().concat(rows);
      save(); renderAssets();
      ok.style.color='var(--s-final)'; ok.textContent=`✓ ${rows.length}개 항목 ${replace?'반영':'추가'} 완료.`;
      setTimeout(()=>closeModal('assetAiModal'),1100);
    } else { ok.style.color='var(--s-drop)'; ok.textContent='정리하지 못했어요. 시트 행을 그대로 붙여넣어 보세요.'; }
  }catch(e){ ok.style.color='var(--s-drop)'; ok.textContent=e.message==='AI_UNAVAILABLE'?aiUnavailableMsg():'AI 응답을 받지 못했어요. (시트 붙여넣기는 AI 없이도 동작해요)'; }
  btn.disabled=false; btn.textContent=old;
};
