# HANDOFF — B-27-lite 전체 완료(①스키마+입력 UI, ②카드 요약 배지) (2026-07-14)

## 1. 목표
`BACKLOG.md` ⭐ 섹션 B-27-lite. `listings[]`에 전세 안전 항목 9종의 기록
필드를 추가하고(커밋①), 매물 상세에서 입력·편집 가능하게 한 뒤, 매물
행에 "미확인 N · 주의 N" 요약 배지 + 마지막 확인일을 표시(커밋②). 판정·
차단·자동평가 없음 — 기록·표시만.

## 2. 완료
**커밋 2개 모두 완료, push는 보류.**

```
6d4c01c feat: 매물 전세 안전 체크 기록 필드 추가 (B-27-lite ①)
e9563c2 feat: 매물 카드 안전 체크 요약 배지 (B-27-lite ②)
```

**커밋①** — 스키마(`js/state.js`): `listings[].safety = { [9개 key]:
{status('unchecked'|'ok'|'warning', 기본 'unchecked'), memo, source,
checkedAt} }`. 9개 항목 = 전입신고·확정일자·반환보증·전세대출·서울시
이자지원·근저당선순위·신탁압류·임대인대리인확인·특약협의.
`SAFETY_ITEMS`·`SAFETY_STATUS_LABEL`·`SAFETY_SOURCES` 상수(`CHECKLIST`
근처)로 정의, state.js·properties.js 공유. `applyGuards()`가 항목별
병합이라 구 데이터도 무손실 보정. 신규 리스팅 생성 경로 3곳(수동 추가·
시트 임포트·마이그레이션 프리뷰) 전부 `defaultListingSafety()`로 초기화.
UI는 단지 상세 매물 행 안에 접이식 섹션(`safetySectionHTML()`, 기본
접힘, `.gates-toggle` 패턴 재사용) — 9항목별 상태 select·메모(esc()
이스케이프)·출처 select·확인일 date input.

**커밋②** — `safetyBadgeChip(l)`(`js/properties.js`) 신규: `SAFETY_ITEMS`
순회해 unchecked/warning 개수 집계 + `checkedAt` 최신값 계산. 9개 전부
`ok`면 "안전 체크 완료 · 마지막 확인 YYYY.MM.DD", 그 외엔 "미확인 N ·
주의 N"(+ 있으면 마지막 확인일). 주의 1개 이상이면 기존 `.chip.warn`
토큰(경고색 1가지, 새 CSS 없음) 적용. `cx-listing-top`(단지상태·대표매물
칩 옆)에 배지 삽입. 안전 체크 섹션 `change` 핸들러에 `renderCxListings()`
호출 추가해 상태 변경 시 배지가 즉시 갱신되도록 함. **스키마·CSS 변경
없음**, 상수 재사용만.

- **검증**(Playwright, 로컬 정적 서버+게스트모드 — python http.server
  기본 charset이 UTF-8이 아니라 한글 리터럴이 깨지는 문제가 있어 매
  세션 `guess_type` override한 임시 서버 사용):
  - (①) 토글 기본 접힘→펼침, 9항목 중 1개 편집 시 그 항목에만 반영,
    나머지 기본값 유지, XSS(`<script>`) 메모 입력 시 미실행+이스케이프
    확인. `applyGuards()` 마이그레이션 2케이스(safety 없음/일부만 있음)
    무손실 보정 확인.
  - (②) 배지 조합 3종(전부 미확인/혼합·주의포함/전부 문제없음) 문구·
    클래스 정확성, 안전 체크 섹션에서 상태 변경 시 배지 즉시 갱신(1개
    unchecked→warning, 이후 9개 전부 ok로 전환하는 두 시나리오 모두),
    구 데이터(safety 필드 자체가 없는 리스팅)도 `applyGuards()` 이후
    크래시 없이 "미확인 9 · 주의 0" 정상 렌더 확인.
  - 모바일 390px 양쪽 커밋 모두 확인(토글 동작·배지 노출), B-59 sticky
    헤더 무회귀(mbody 강제 스크롤 전후 mhead 위치 완전 동일) 확인.
  - `node --check js/state.js`·`node --check js/properties.js`·CSS
    중괄호 균형 전부 통과.
  - 임시 python 테스트 서버·Playwright 스크립트는 두 커밋 모두 세션
    종료 전 전부 삭제. `package.json` 변경 없음, repo에 테스트 파일
    남기지 않음.

## 3. 미완 / 다음 단계
- **B-27-lite 전체 완료** — BACKLOG.md ⭐ 섹션에서 커맨드센터가 삭제
  처리할 차례.
- **다음 지시 예정: B-61(출퇴근 2인)** — `profile.js`+`properties.js`
  +스키마. settings에 통근 기준지 2개(기본 강남역/신사역, 프로필
  모달에서 편집), `complexes[]`에 인별 소요시간·환승횟수·스냅샷. "기준지
  변경됨·재확인 필요" 표시 로직 필요.
- localStorage 실제 저장은 게스트/데모 모드 특성상 이번에도 직접
  확인 못 함(데모 모드는 `save()`가 조기 반환하는 기존 설계 — 버그
  아님, 기존 필드들과 동일 경로). 실사용 환경에서 저장→새로고침 유지는
  테디가 실제 사용 중 확인 요망.

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀
  수정·커밋 안 함.
- `js/nav.js` 무접촉 원칙 유지 — 이번 두 커밋 모두 `state.js`+
  `properties.js`(+커밋①만 `style.css`)만 건드림, nav.js 무관.
- 커밋①은 스키마 변경(`listings[].safety` 신규 필드)이라 `applyGuards()`
  기본값 보정 + JSDoc 동시 갱신 완료. 커밋②는 스키마 변경 없음(읽기
  전용 집계).
- 기존 필드명·단위 변경 없음, 기존 데이터 손실 없음(양쪽 다 마이그레이션
  검증 완료).
- 착수 전 `git status`로 Codex와의 미커밋 충돌 여부 확인함(매번 관련
  없는 untracked 문서 3개만 있었고 clean, 충돌 없었음).

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) —
  손 B(Codex)" 3자 협업 구조. SSOT는 `CLAUDE.md`, 실행 규칙은
  `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는 `BACKLOG.md`(커맨드센터
  전용).
- 직전 세션들: ... → B-58(`e9d3531`) → B-59(`44b9850`~`a4fe1c6` 4단계)
  → B-27-lite①(`6d4c01c`) → **이번 세션(B-27-lite②, `e9563c2`, push
  보류) — B-27-lite 전체 완료**.
