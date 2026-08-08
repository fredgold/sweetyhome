/* 규제·뉴스 렌더 — 원래 이 파일은 수집함 붙여넣기 임포트가 본체였으나
   B-202로 임포트를 제거했고, 여기 남은 규제·뉴스는 임포트와 무관하게
   boot.js renderAll()·nav.js renderDash()가 부르는 살아있는 코드다.
   파일명이 내용과 어긋나므로 다음에 이 영역을 손댈 때 이관을 검토할 것. */
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
