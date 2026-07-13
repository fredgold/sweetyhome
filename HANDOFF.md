# HANDOFF — B-49 데스크톱 매물탭 지도 하단 여백 제거 (2026-07-13)

## 1. 목표
`BACKLOG.md`의 B-49 처리. 데스크톱 매물탭 우측 지도/좌측 컬럼 높이가 `calc(100vh -
nav - 24)` 고정값이라 기준바(`.gates`) 높이를 반영하지 못해, 지도가 뷰포트 하단까지
안 닿고 여백이 남던 문제 — 매물탭을 뷰포트 고정 flex 컬럼으로 바꿔 기준바 접힘/펼침
상태와 무관하게 항상 하단까지 닿게 하는 것이 목표.

## 2. 완료
**커밋·push 완료.**

```
3a2be9a fix: B-49 데스크톱 매물탭 지도 하단 여백 제거
```

`style.css`의 `@media (min-width:900px)`에서 매물탭(`#panel-props.on`)을 뷰포트
고정 flex 컬럼으로 재구성: `.gates`(flex-shrink:0, 고정) → `.grid`(flex:1;
min-height:0, 남는 높이 전부 차지) → 그 안 `.grid>section`/`.mapcard`는 고정
`max-height`/`height` calc 대신 `height:100%`로 `.grid` 높이를 꽉 채움. `.mapcard`는
`display:flex` column화(`.mh` 고정 + `#overviewMap` flex:1). `position:sticky`는
불필요해져 제거.

### 조사 중 발견한 두 가지 숨은 문제(둘 다 고쳐야 최종 결과가 정확해짐)
1. **높이 기준 변수가 틀렸음**: 원래 `--nav-h`(sticky 탭바 자체 높이만)를 썼는데,
   이건 헤더 높이를 포함 안 해 `properties.js`의 `updateNavHeightVar()` 주석에 이미
   "헤더와 겹침"이라고 경고돼 있던 함정이었음. `--topbar-h`(헤더+탭바 포함)로
   바꾸고, 거기에 `.apptabs{margin-bottom:20px}`(`getBoundingClientRect()`엔 안
   잡히는 레이아웃 여백)를 추가로 빼야 실측(Playwright `getBoundingClientRect()`)과
   정확히 일치함을 확인.
2. **CSS Grid 함정**: `height:100%`만 주면 `.grid`가 베이스 규칙에서 물려받은
   `align-items:start` 때문에 단일 grid 행이 컨텐츠 크기(2000px+)로 새어버려 지도가
   뷰포트를 완전히 벗어나는 회귀가 발생 — `grid-template-rows:minmax(0,1fr)` +
   `align-items:stretch`를 명시해서 해결. 이건 초기 구현에서 놓쳤다가 Playwright로
   `mapcardBottom` 값을 실측하다 발견함.

### 검증 방법
`node --check`(JS 변경 없음)/CSS 중괄호 균형/`git diff --check` 통과. Playwright로
데스크톱(1400×900)에 가짜 단지 15건 주입 후:
- 기준바 접힘/펼침 두 상태 모두 `mapcardBottom`=`gridBottom`=`panelBottom`=
  `viewportHeight`(900) 정확히 일치(여백 0) 확인.
- `#complexSection.clientHeight`가 기준바 상태에 따라 정확히 조정됨(447↔402, 차이가
  기준바 높이 증가분과 일치) — B-36 내부 스크롤 정합성 확인.
- 리스트 내부 스크롤 시 `window.scrollY`=0 유지, `.mapcard` 위치 불변 확인.
- 모바일은 `#panel-props`의 computed `position:fixed`·`display:block`이 그대로임을
  확인(데스크톱 전용 규칙 누출 없음), 지도뷰/리스트뷰 스크린샷으로 무회귀 확인.
- 임시 설치한 `playwright`는 `npm install --no-save` → `npm uninstall`로 제거, 테스트
  스크립트·임시 서버·스크린샷은 세션 종료 전 삭제.

## 3. 미완 / 다음 단계
- 실기기 시각 검증 필요(로컬 정적 서버+게스트모드+Playwright 합성 데이터로만 확인,
  실제 네이버 지도 렌더링은 로컬 도메인이 API 키 허용 도메인이 아니라 미검증).
- 이번 수정 후에도 `document.documentElement.scrollHeight`가 뷰포트보다 ~98px 더 큰
  잔여 페이지 스크롤이 남아있음(B-36 시점엔 ~336px였던 것에서 크게 줄었지만 완전히
  0은 아님) — B-49 범위(지도 하단 여백=0)는 완전히 충족했고, 이 잔여분은 `.gates`/
  `.wcard` 밖의 다른 페이지 chrome 요소로 추정되나 원인은 특정하지 않음. 필요하면
  별도 항목으로 검토.

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js 무접촉** — 이번 수정은 `style.css` 단일 파일, JS 변경 없음.
- `--topbar-h`+`20px` 조합은 `.apptabs{margin-bottom:20px}` 값과 결합된 매직넘버라,
  향후 `.apptabs`의 margin-bottom을 바꾸면 이 calc도 함께 갱신해야 함(주석으로 근거
  명시해둠).

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → 배포 후 하드닝 3건 → B-12 관련 다수 작업 →
  B-26+B-35 → B-36(좌측 리스트 자체 스크롤) → B-47(상단 슬림화) → B-48(레거시 UI 은퇴) →
  B-44①(단지 카드 확인 버튼 제거, `dd0df50`) → **이번 세션(B-49, `3a2be9a`, push 완료)**.
