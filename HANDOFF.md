# HANDOFF — B-27-lite① 전세 안전 체크 기록 스키마+입력 UI (2026-07-14)

## 1. 목표
`BACKLOG.md` ⭐ 섹션 B-27-lite 커밋①. `listings[]`에 전세 안전 항목 9종의
기록 필드(상태·메모·출처·확인일)를 추가하고, 매물 상세에서 입력·편집
가능하게 한다. 판정·차단·점수 없음 — 기록·표시만. 카드 배지(미확인 N·
주의 N)는 다음 커밋(②).

## 2. 완료
**커밋 완료, push는 보류.**

```
6d4c01c feat: 매물 전세 안전 체크 기록 필드 추가 (B-27-lite ①)
```

- **스키마**(`js/state.js`): `listings[].safety = { [9개 key]:
  {status('unchecked'|'ok'|'warning', 기본 'unchecked'), memo, source,
  checkedAt} }`. 9개 항목 = 전입신고·확정일자·반환보증·전세대출·서울시
  이자지원·근저당선순위·신탁압류·임대인대리인확인·특약협의. 키/라벨/상태
  라벨/출처 옵션을 `SAFETY_ITEMS`·`SAFETY_STATUS_LABEL`·`SAFETY_SOURCES`
  상수로 정의(`CHECKLIST` 근처, state.js·properties.js 양쪽에서 공유).
- **applyGuards() 마이그레이션**: 항목별 병합이라 safety 필드가 아예
  없던 구 데이터도, 9개 중 일부만 저장된 데이터도 나머지가
  `defaultSafetyItem()`으로 채워지며 기존 값은 무손실 보존.
- **신규 리스팅 생성 경로 3곳** 전부 `safety:defaultListingSafety()`로
  초기화: 수동 추가(`js/properties.js:1047` 근처)·시트 임포트
  (`:1502` 근처)·마이그레이션 프리뷰(`:1683` 근처).
- **UI**(`js/properties.js`): 단지 상세(`complexDetailModal`) 매물 행
  안에 "전세 안전 체크" 접이식 섹션(`safetySectionHTML()`) 추가. 기본
  접힘, 기존 `.gates-toggle`/`.gates-toggle-caret` 토글 패턴 재사용(새
  토글 CSS 만들지 않음). 펼치면 9항목별 상태 select·메모 텍스트(esc()
  이스케이프)·출처 select·확인일 date input. 이벤트는 `#cxDetailListings`
  위임(click for 토글, change for 값 저장) — 기존 tri-state 위임 핸들러
  패턴과 동일 구조.
- **CSS**(`style.css`): `.safety-wrap`·`.safety-list`·`.safety-item*`
  신규 최소 규칙, 기존 토큰(`--hairline`, `--ink`, `--ink-soft`,
  `--radius-sm`, `--surface`)만 재사용.
- **검증**(Playwright, 로컬 정적 서버+게스트모드 — python http.server
  기본 charset이 UTF-8이 아니라 한글 리터럴이 깨지는 문제가 있어 임시로
  `guess_type` override한 서버 사용):
  - 토글 기본 접힘→클릭 시 펼침 정상.
  - 9항목 중 1개(전입신고) 상태/메모/출처/확인일을 각각 편집 → 해당
    항목에만 정확히 반영, 나머지 8항목은 기본값(`unchecked`/빈값) 유지
    확인.
  - 메모에 `<script>window.__xss=1</script>` 입력 → 실행 안 됨
    (`window.__xss` 미설정 확인), DOM에 `<script>` 태그 원문 없음, input
    value로 텍스트 그대로 보존 확인(esc() 정상 동작).
  - `applyGuards()` 마이그레이션 케이스 2종 직접 호출 검증: (a) safety
    필드 자체가 없는 구 리스팅 → 9개 키 전부 기본값 생성, 기존 memo
    등 다른 필드 무손실. (b) 9개 중 moveInReport 1개만 저장된 리스팅 →
    그 값 그대로 보존 + 나머지(fixedDate 등) 기본값 채움.
  - 모바일 390px: 매물 상세 풀높이 시트에서 토글 탭 동작 정상, B-59
    sticky 헤더 무회귀(mbody 강제 스크롤 전후 mhead 위치 완전 동일)
    확인.
  - `node --check js/state.js`·`node --check js/properties.js`·CSS
    중괄호 균형 전부 통과.
  - 임시 설치·사용한 python 테스트 서버·Playwright 스크립트는 세션
    종료 전 전부 삭제. `package.json` 변경 없음, repo에 테스트 파일
    남기지 않음.

## 3. 미완 / 다음 단계
- **B-27-lite 커밋②(다음 세션)**: 매물 카드에 "미확인 N · 주의 N" 배지
  + 마지막 확인일 표시. 이번 커밋의 `safety` 데이터를 그대로 읽기만
  하면 됨(스키마 변경 없음). 카드 렌더 위치는 `js/properties.js`
  `renderCxListings()`의 `cx-listing-top`/`cx-listing-meta` 부근 참고.
- **B-61(출퇴근 2인)**: 이 커밋과 독립적이지만 같은 ⭐ 섹션 다음 순서.
  `profile.js`+`properties.js`+스키마.
- localStorage 저장 자체는 게스트/데모 모드라 이번 세션에서 직접 확인
  못 함(데모 모드는 `save()`가 `데모 모드 — 저장되지 않아요`로 조기
  반환하는 기존 설계 — 버그 아님). 기존 `managementFee` 등과 동일한
  `save()` 경로를 그대로 타므로 별도 리스크로 보지 않음. 실사용(PIN
  로그인) 환경에서 저장→새로고침 유지는 테디가 실제 사용 중 확인 요망.

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀
  수정·커밋 안 함.
- `js/nav.js` 무접촉 원칙 유지 — 이번 작업은 `state.js`+`properties.js`
  +`style.css`만 건드림, nav.js 무관.
- 스키마 변경(`listings[].safety` 신규 필드)이라 `applyGuards()` 기본값
  보정 + `state.js` 상단 JSDoc 동시 갱신 완료(지시서 필수 요구사항).
- 기존 필드명·단위 변경 없음, 기존 데이터 손실 없음(마이그레이션 검증
  완료).
- 착수 전 `git status`로 Codex와의 미커밋 충돌 여부 확인함(당시 관련
  없는 untracked 문서 3개만 있었고 clean, 충돌 없었음).

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) —
  손 B(Codex)" 3자 협업 구조. SSOT는 `CLAUDE.md`, 실행 규칙은
  `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는 `BACKLOG.md`(커맨드센터
  전용).
- 직전 세션들: ... → B-56(`21cb4b9`) → B-57(`2b79d16`) →
  B-58(`e9d3531`) → B-59(`44b9850`~`a4fe1c6` 4단계) →
  **이번 세션(B-27-lite①, `6d4c01c`, push 보류)**.
