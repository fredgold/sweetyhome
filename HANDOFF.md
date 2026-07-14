# HANDOFF — B-61 출퇴근 2인 설정 + 기록 완료 (2026-07-14)

## 1. 목표
`BACKLOG.md` ⭐ 섹션 B-61. R-07(통근 기준지) 구조 해소. settings에 통근
기준지 2인(이름·목적지)을 프로필에서 설정하고(커밋①), 단지 상세에서
인별 소요시간·환승 횟수를 기록·표시(커밋②). B-27-lite와 동일 원칙 —
자동 경로계산·판정 없음, 기록·표시만. `js/nav.js` 무접촉.

## 2. 완료
**커밋 2개 모두 완료, push는 보류.**

```
43640e1 feat: 통근 기준지 2인 설정 추가 (B-61 ①)
dee9064 feat: 단지 출퇴근 2인 기록·기준지 스냅샷 (B-61 ②)
```

**커밋①** — `state.settings.commuters = [{name, dest}, {name, dest}]`
고정 2개(기본 테디→강남역/연정→신사역), `DEFAULT.settings.commuters`로만
존재(하드코딩 참조 없음). `applyGuards()`가 항목별 병합이라 구 데이터
(필드 없음/1개뿐/일부 필드만)도 항상 정확히 2개로 보정. 프로필 모달에
"통근 기준지" 섹션(`pf_commuter0_name`·`pf_commuter0_dest`·
`pf_commuter1_name`·`pf_commuter1_dest`) — 다른 프로필 필드와 동일하게
빈 입력은 기존값 유지.

**커밋②** — `complexes[].commutes = [{minutes, transfers,
destSnapshot}, {...}]`(index 0/1 = `settings.commuters[0/1]`) +
`complexes[].commuteMemo`. 단지 상세에 인별 소요시간(분)·환승 입력
(`commutesInputHTML()`), 저장 시 `destSnapshot`에 그 시점 목적지 자동
스냅샷. 표시(`commuteSummaryHTML()`)는 계산만: "테디 37분 · 연정 34분
(차이 3분)", `destSnapshot`≠현재 `dest`면 그 사람 옆에만 "기준지
변경됨 · 재확인 필요"(기존 `.chip.warn`). `minutes` null=미확인,
0=0분 엄격 구분. **기존 `commuteGangnam`/`commuteSinsa`(레거시 강남역/
신사역 전용 필드)는 전혀 건드리지 않음** — 완전히 별개의 신규 필드,
`cxDetailCommute` 표시도 그대로 둠. 신규 단지 생성 경로 3곳 모두
`defaultComplexCommutes()`로 초기화.

- **검증**(Playwright, 로컬 정적 서버+게스트모드 — 매 세션 python
  http.server의 `guess_type` override 임시 서버로 한글 charset 문제
  회피, 모바일 390px 포함):
  - (①) 기본값 노출, 이름/목적지 수정 후 저장 → `state.settings.commuters`
    정확 반영. `applyGuards()` 마이그레이션 2케이스(필드 없음/malformed)
    모두 2개로 정확히 보정.
  - (②) 소요시간 입력 시 요약 실시간 갱신(차이 계산 포함). 저장 시점의
    목적지가 `destSnapshot`에 정확히 기록. 프로필에서 목적지만 변경 →
    기존 기록 유지 + 변경된 사람에게만 "기준지 변경됨" 배지, 다른 사람은
    무영향. 이름만 변경(테디→규범) → 표시만 바뀌고 기록은 index 매칭
    이라 완전 무손실. `minutes` 0 vs null 정확히 구분(엄격 비교).
    `applyGuards()`로 보정되는 구 단지(commutes 필드 자체 없음)도
    무손실·무크래시. 모바일 390px 정상, 가로 스크롤 없음, B-59 sticky
    헤더 무회귀.
  - `node --check` 3개 파일(state.js·properties.js·profile.js)·CSS
    중괄호 균형·`index.html` div 개폐 균형 전부 통과.
  - 임시 python 테스트 서버·Playwright 스크립트는 두 커밋 모두 세션
    종료 전 전부 삭제. `package.json` 변경 없음.

**작업 방식 메모**: 두 커밋의 스키마 변경이 서로 다른 최상위 키
(`settings.commuters` vs `complexes[].commutes`)라, 전체를 먼저
구현·검증한 뒤 `git checkout`으로 `state.js`를 되돌려 커밋①분만
재적용→커밋, 이어서 커밋②분(복잡한 부분 그대로 재적용)을 다시
적용→커밋하는 방식으로 두 커밋의 diff를 파일 단위로 깨끗하게 분리함.
커밋 시점엔 항상 `node --check` 통과 상태만 커밋(중간에 정의되지 않은
함수를 참조하는 상태가 잠깐 있었지만 스테이징 전에 정리).

## 3. 미완 / 다음 단계
- **B-61 완료** — BACKLOG.md ⭐ 섹션에서 커맨드센터가 삭제 처리할 차례.
  R-07도 이 커밋으로 해소.
- 다음 지시 대기. BACKLOG.md 실행순서 5번(B-41·B-43·B-42 — 임장노트·
  매물 스냅샷·가격 타임라인, B-41은 B-27-lite와 입력 UI 중복 여지로
  착수 시 통합 검토 필요)이 다음 후보.
- localStorage 실제 저장은 게스트/데모 모드 특성상 이번에도 직접
  확인 못 함(데모 모드는 `save()`가 조기 반환하는 기존 설계 — 버그
  아님). 실사용 환경에서 저장→새로고침 유지는 테디가 실제 사용 중
  확인 요망.

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀
  수정·커밋 안 함.
- `js/nav.js` 무접촉 원칙 유지 — 이번 두 커밋 모두 `state.js`+
  `profile.js`+`properties.js`+`style.css`+`index.html`만 건드림,
  nav.js 무관.
- 스키마 변경 2건(`settings.commuters`, `complexes[].commutes`+
  `commuteMemo`) 모두 `applyGuards()` 기본값 보정 + `state.js` JSDoc
  동시 갱신 완료.
- 기존 필드명·단위 변경 없음. 특히 레거시 `commuteGangnam`/
  `commuteSinsa`(단지의 강남역/신사역 전용 소요시간 필드, `cxDetailCommute`
  표시)는 이번 B-61과 완전히 별개로 그대로 유지 — 혼동 주의, 통합/제거는
  이번 지시 범위 밖.
- 착수 전 `git status`로 Codex와의 미커밋 충돌 여부 확인함(매번 관련
  없는 untracked 문서 3개만 있었고 clean, 충돌 없었음).

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) —
  손 B(Codex)" 3자 협업 구조. SSOT는 `CLAUDE.md`, 실행 규칙은
  `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는 `BACKLOG.md`(커맨드센터
  전용).
- 직전 세션들: ... → B-59(`44b9850`~`a4fe1c6` 4단계) → B-27-lite①
  (`6d4c01c`) → B-27-lite②(`e9563c2`) → **이번 세션(B-61①`43640e1`+
  B-61②`dee9064`, push 보류) — B-61 완료, R-07 해소**.
