/* ============ 스크랩 임포트 ============ */
const SC_FIELD_MAP={
  '제목':'title','타이틀':'title','단지명':'title','물건':'title','title':'title',
  '유형':'type','분류':'type','종류':'type','type':'type',
  '위치':'location','동네':'location','지역':'location','주소':'location','소재지':'location','location':'location',
  '가격':'price','전세가':'price','분양가':'price','보증금':'price','매매가':'price','호가':'price','실거래가':'price','price':'price',
  '면적':'area','평형':'area','크기':'area','전용면적':'area','전용':'area','area':'area',
  '일정':'schedule','청약일':'schedule','입주':'schedule','입주예정':'schedule','모집공고일':'schedule','청약일정':'schedule','schedule':'schedule',
  '조건':'condition','자격':'condition','자격요건':'condition','조건자격':'condition','신청자격':'condition','청약자격':'condition','condition':'condition',
  '출처':'source','링크':'source','url':'source','참고':'source','source':'source',
  '태그':'tags','키워드':'tags','tags':'tags',
  '메모':'raw','원문':'raw','내용':'raw','본문':'raw',
  '적합도':'fit','판단':'fit','fit':'fit',
};
const SC_TYPE_MAP={
  '청약공고':'subscription','청약':'subscription',
  '전세':'jeonse',
  '매매':'sale',
  '동네·시세':'area','동네':'area','시세':'area',
  '정책·뉴스':'policy','정책':'policy','뉴스':'policy',
  '임장후기':'review','임장':'review',
  '메모':'note','note':'note',
  'AI기록':'ai_log','ai기록':'ai_log','ai_log':'ai_log',
};
const SC_FIT_MAP={
  '높음':'high','고':'high','가능':'high','적합':'high','high':'high',
  '중간':'mid','보통':'mid','중':'mid','mid':'mid',
  '낮음':'low','저':'low','불가':'low','부적합':'low','low':'low',
};

function scMapField(h){
  const k=h.trim();
  return SC_FIELD_MAP[k]||SC_FIELD_MAP[k.toLowerCase()]||null;
}
function scMapType(v){ return SC_TYPE_MAP[v.trim()]||null; }
function scMapFit(v){ return SC_FIT_MAP[v.trim()]||SC_FIT_MAP[v.trim().toLowerCase()]||null; }

/* ── 프론트매터 파서 ---\nkey: val\n---\nbody ── */
function scParseFrontmatter(text){
  const m=text.match(/^---[ \t]*\r?\n([\s\S]*?)\n---[ \t]*(\r?\n|$)([\s\S]*)/);
  if(!m) return null;
  const fmBlock=m[1], body=(m[3]||'').trim();
  const item={};
  for(const line of fmBlock.split('\n')){
    const ci=line.indexOf(':');
    if(ci<=0) continue;
    const key=line.slice(0,ci).trim();
    const val=line.slice(ci+1).trim();
    if(!val) continue;
    const field=scMapField(key);
    if(!field) continue;
    if(field==='type'){ const t=scMapType(val); if(t) item.type=t; }
    else if(field==='fit'){ const f=scMapFit(val); if(f) item.fit=f; }
    else if(field==='tags') item.tags=val.split(/[,、·]+/).map(t=>t.trim()).filter(Boolean);
    else item[field]=val;
  }
  if(body) item.raw=(item.raw?item.raw+'\n':'')+body;
  return (item.title||item.raw)?[item]:null;
}

/* ── 마크다운 표 파서 ── */
function scParseMdTable(text){
  const lines=text.split('\n').map(l=>l.trim()).filter(l=>l.startsWith('|'));
  if(lines.length<2) return null;
  const headers=lines[0].split('|').slice(1,-1).map(h=>h.trim());
  const fieldKeys=headers.map(scMapField);
  const dataLines=lines.slice(1).filter(l=>!/^\|[\s\-:|]+\|/.test(l));
  if(!dataLines.length) return null;
  const items=[];
  for(const line of dataLines){
    const cells=line.split('|').slice(1,-1).map(c=>c.trim());
    const item={extra:[]};
    fieldKeys.forEach((field,i)=>{
      const val=cells[i]||''; if(!val) return;
      if(field==='type'){ const t=scMapType(val); if(t) item.type=t; }
      else if(field==='fit'){ const f=scMapFit(val); if(f) item.fit=f; }
      else if(field==='tags') item.tags=val.split(/[,、·]+/).map(t=>t.trim()).filter(Boolean);
      else if(field) item[field]=val;
      else item.extra.push(headers[i]+': '+val);
    });
    if(item.extra.length) item.raw=(item.raw?item.raw+'\n':'')+item.extra.join('\n');
    delete item.extra;
    if(item.title||item.raw) items.push(item);
  }
  return items.length?items:null;
}

/* ── key: val 블록 파서 (빈 줄로 구분) ── */
function scParseBlocks(text){
  const blocks=text.trim().split(/\n[ \t]*\n/);
  const items=[];
  for(const block of blocks){
    if(!block.trim()) continue;
    const lines=block.trim().split('\n');
    const item={extra:[]};
    for(const line of lines){
      const ci=line.indexOf(':');
      if(ci>0){
        const key=line.slice(0,ci).trim(), val=line.slice(ci+1).trim();
        const field=scMapField(key);
        if(field==='type'){ const t=scMapType(val); if(t) item.type=t; }
        else if(field==='fit'){ const f=scMapFit(val); if(f) item.fit=f; }
        else if(field==='tags') item.tags=val.split(/[,、·]+/).map(t=>t.trim()).filter(Boolean);
        else if(field) item[field]=val;
        else item.extra.push(line);
      } else { item.extra.push(line); }
    }
    if(item.extra.length) item.raw=(item.raw?item.raw+'\n':'')+item.extra.join('\n');
    delete item.extra;
    if(item.title||item.raw) items.push(item);
  }
  return items.length?items:null;
}

/* ── 자유 텍스트 폴백 — 첫 제목줄 추출, 전체를 raw ── */
function scFreeText(text){
  const t=text.trim(); if(!t) return null;
  const headingM=t.match(/^#{1,3}\s+(.+)/m);
  const firstLine=t.split('\n').find(l=>l.trim());
  const title=headingM?headingM[1].trim():(firstLine||'').replace(/^[#\-*>\s]+/,'').slice(0,60).trim();
  return [{ title, raw: t }];
}

/* ── 자동 감지 ── */
function scAutoDetect(text){
  const fm=scParseFrontmatter(text); if(fm) return fm;
  if(/^\|.+\|/m.test(text)) return scParseMdTable(text);
  if(/^[가-힣a-zA-Z\w·\s]{1,15}:/m.test(text)) return scParseBlocks(text);
  return scFreeText(text);
}

let scImportItems=[];

function scShowImportPreview(items){
  scImportItems=items;
  const rows=items.map((it,i)=>`<tr>
    <td><input type="checkbox" class="sc-imp-chk" data-idx="${i}" checked></td>
    <td class="sc-it">${esc(it.title||'(제목 없음)')}</td>
    <td>${it.type?`<span class="sc-badge type-${it.type}" style="font-size:10px;">${SC_TYPE[it.type]||it.type}</span>`:'-'}</td>
    <td class="sc-im">${[it.location,it.price].filter(Boolean).map(esc).join(' / ')||'-'}</td>
    <td class="sc-im">${esc(it.schedule||'-')}</td>
  </tr>`).join('');
  document.getElementById('sc_importPreviewContent').innerHTML=`
    <div style="font-size:12px;font-weight:700;color:var(--money-deep);margin:8px 0 6px;">${items.length}개 파싱됨 — 등록할 항목을 선택하세요.</div>
    <div style="overflow-x:auto;">
    <table class="sc-import-tbl">
      <thead><tr>
        <th><input type="checkbox" id="sc_checkAll" checked></th>
        <th>제목</th><th>유형</th><th>위치/가격</th><th>일정</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  document.getElementById('sc_importTextArea').style.display='none';
  document.getElementById('sc_importParseRow').style.display='none';
  document.getElementById('sc_importPreview').style.display='';
  document.getElementById('sc_importErr').textContent='';
  const allChk=document.getElementById('sc_checkAll');
  allChk.onchange=()=>document.querySelectorAll('.sc-imp-chk').forEach(c=>c.checked=allChk.checked);
  document.querySelectorAll('.sc-imp-chk').forEach(c=>c.onchange=scUpdateConfirmBtn);
  scUpdateConfirmBtn();
}

function scUpdateConfirmBtn(){
  const n=document.querySelectorAll('.sc-imp-chk:checked').length;
  const btn=document.getElementById('sc_importConfirm');
  btn.textContent=`${n}개 등록`;
  btn.disabled=n===0;
}

document.getElementById('sc_importTrigger').onclick=()=>{
  openModal('scImportModal');
  document.getElementById('sc_importTextArea').style.display='';
  document.getElementById('sc_importParseRow').style.display='';
  document.getElementById('sc_importPreview').style.display='none';
  document.getElementById('sc_importInput').value='';
  document.getElementById('sc_importErr').textContent='';
};

document.getElementById('sc_importParseBtn').onclick=()=>{
  const text=document.getElementById('sc_importInput').value.trim();
  const err=document.getElementById('sc_importErr');
  if(!text){err.textContent='텍스트를 붙여넣어 주세요.';return;}
  const items=scAutoDetect(text);
  if(!items||!items.length){
    err.textContent="텍스트를 인식하지 못했어요. GPT 응답이나 자유 텍스트도 괜찮아요.";
    return;
  }
  scShowImportPreview(items);
};

document.getElementById('sc_importBack').onclick=()=>{
  document.getElementById('sc_importTextArea').style.display='';
  document.getElementById('sc_importParseRow').style.display='';
  document.getElementById('sc_importPreview').style.display='none';
};

document.getElementById('sc_importConfirm').onclick=()=>{
  const checkedIdxs=Array.from(document.querySelectorAll('.sc-imp-chk:checked')).map(c=>+c.dataset.idx);
  const now=Date.now();
  checkedIdxs.slice().reverse().forEach(i=>{
    const it=scImportItems[i];
    state.scraps.unshift({
      id:'sc'+now.toString(36)+Math.random().toString(36).slice(2,5),
      createdAt:now,status:'new',parsed:null,
      title:it.title||'',type:it.type||'area',
      raw:it.raw||'',location:it.location||'',
      price:it.price||'',area:it.area||'',
      schedule:it.schedule||'',condition:it.condition||'',
      source:it.source||'',fit:it.fit||'',
      tags:it.tags||[],
    });
  });
  save();renderScraps();
  closeModal('scImportModal');
};

/* ============ 규제·뉴스 ============ */
function renderRegNews(){
  const cards=document.getElementById('rn_cards');
  if(!state.regNews.length){
    cards.innerHTML='<div class="rn-empty">아직 수집된 뉴스가 없어요.<br><b>🔍 최신 규제 확인</b> 버튼을 눌러보세요.</div>';
    return;
  }
  cards.innerHTML='<div class="rn-list">'+state.regNews.map(n=>`
    <div class="rn-card" data-rnid="${esc(n.id)}">
      <div class="rn-title">${esc(n.title||'')}</div>
      <div class="rn-summary">${esc(n.summary||'')}</div>
      <div class="rn-meta">
        ${n.date?`<span class="rn-date">${esc(n.date)}</span>`:''}
        ${n.source?`<span class="rn-src">🔗 출처 보기</span>`:''}
      </div>
    </div>`).join('')+'</div>';
  cards.querySelectorAll('.rn-card[data-rnid]').forEach(el=>{
    const n=state.regNews.find(x=>x.id===el.dataset.rnid);
    if(n&&n.source) el.onclick=()=>{const u=safeUrl(n.source);if(u)window.open(u,'_blank','noopener');};
  });
}
function updateDashRegline(){}
document.getElementById('rn_fetchBtn').onclick=async()=>{
  const btn=document.getElementById('rn_fetchBtn');
  btn.disabled=true; const old=btn.textContent; btn.textContent='검색 중…';
  try{
    const queries=[
      '서울 신혼부부 전세자금대출 버팀목 금리 변경 2026',
      '서울시 신혼부부 특별공급 자격기준 2026',
      '신혼부부 전세보증금 이자지원 2026',
      '전세사기 보증보험 HUG 변경사항 2026'
    ];
    const out=await claudeAPI([{role:'user',content:
      `우리는 ${profileLine()}\n`+
      `다음 키워드로 최신 규제·정책·금리 뉴스를 웹에서 찾아 JSON 배열로 정리해. 설명·마크다운 금지, JSON 배열만 출력.\n`+
      `키워드: ${queries.join(' / ')}\n`+
      `형식: [{"title":"제목","summary":"1~2문장 요약","date":"YYYY-MM-DD 또는 YYYY-MM","source":"출처URL"}]\n`+
      `최신순 정렬, 최대 6건. 날짜를 모르면 빈 문자열. 출처URL을 모르면 빈 문자열.`}],
      [{type:'web_search_20250305',name:'web_search'}]);
    const arr=parseJSON(out);
    if(Array.isArray(arr)&&arr.length){
      state.regNews=arr.map(n=>({id:'rn'+Date.now()+Math.random().toString(36).slice(2,6),title:n.title||'',summary:n.summary||'',date:n.date||'',source:n.source||''}));
      save(); renderRegNews(); updateDashRegline();
      btn.textContent='✓ 업데이트 완료';
    } else {
      btn.textContent='결과를 파싱하지 못했어요';
    }
  }catch(e){
    btn.textContent=aiAvailable===false?aiUnavailableMsg():'AI 응답 실패';
  }
  setTimeout(()=>{btn.disabled=false;btn.textContent=old;},2000);
};
