# HANDOFF — B-12 리스트뷰 겹침 + ⋯메뉴 스크롤 재수정 2건 (2026-07-12)

## 1. 목표
직전 세션의 B-12 버그2(리스트뷰 첫 카드 가림)/버그3(스크롤 잠금) 수정이 실기기에서 여전히
부족하다는 재피드백을 받아 근본적으로 재수정. (재수정A) 리스트뷰 스크롤 중 정렬칩/⋯이
카드와 계속 겹침(padding-top 임시값은 첫 진입만 해결했었음), (재수정B) ⋯메뉴 열림 중 뒤
배경이 여전히 스크롤됨(body lock은 걸려 있는데도 메뉴 자체가 뷰포트를 넘쳐 페이지를
늘려버린 게 원인).

## 2. 완료
**두 건 모두 atomic 커밋으로 구현·검증·push 완료.**

```
83ac8ab fix: B-12 재수정B — ⋯메뉴가 뷰포트 넘칠 때 페이지 늘어나 배경 스크롤되는 문제 수정
9a8f7ef fix: B-12 재수정A — 리스트뷰 스크롤 중 정렬칩/⋯이 카드와 겹치는 문제 근본 수정
```

### 재수정A 요약
정렬칩·뷰토글·⋯버튼을 리스트뷰에서만 신규 `#cxListToolbar`(`index.html`)로 실제 DOM
이동시켜(복제 없음, `showMoreMenu()`와 같은 이동-복원 패턴) `position:sticky` + 불투명
배경 툴바로 재구성(`style.css`). 지도뷰 복귀 시 원래 위치(`.grid`/`.panel-head`)로 되돌림
(`properties.js`: `syncListToolbar()` 신설, `applyPropViewMode()`에서 호출). `#complexSection`의
`padding-top`을 매직넘버 58px → 12px로 정리(sticky 툴바가 실제 레이아웃 공간을 차지하므로
더 이상 필요 없음).

**검증 중 발견·수정한 버그**: `.cx-list-toolbar{display:none}` 기본 규칙을 모바일 미디어쿼리
안에만 둬서 데스크톱에서 `<div>` 기본값(`display:block`)이 새던 것을 Playwright로 발견,
무조건 적용 구간으로 위치를 옮겨 수정.

### 재수정B 요약
`showMoreMenu()`(`properties.js`)에서 버튼 아래 남는 세로 공간을 계산해
`menu.style.maxHeight`를 부여 + `.ph-more-menu{overflow-y:auto}`(`style.css`)로 내용이
넘칠 때 메뉴 내부에서만 스크롤되게 함. `lockBodyScroll()`(기존, B-12 버그3에서 추가)은
그대로 유지 — 문제는 body 잠금 자체가 아니라 메뉴가 뷰포트를 넘쳐 페이지 자체를 늘려버린
것이었음.

### 검증 방법
`node --check` 전체 + CSS 중괄호 균형 + `git diff --check` 통과. Playwright로:
- 재수정A: 칩/토글/⋯버튼이 `#cxListToolbar`로 이동해 `position:static`이 되고 툴바 자체가
  `position:sticky`+불투명 배경인지 확인. 스크롤을 0/150/400/700/최하단까지 여러 지점에서
  스크린샷 촬영 — opaque sticky 바가 카드 위에 자연스럽게 얹혀 텍스트 비침이 전혀 없음을
  시각 확인(bounding-box 교차 자체는 sticky의 정상 동작이라 "겹침 있음/없음"이 아니라
  "비침 있음/없음"으로 판단 기준을 정정). 지도뷰로 돌아가면 요소들이 정확히 원래 부모·
  `position:fixed`로 복원되는지 확인. 데스크톱에서 툴바가 `display:none`인지 확인.
- 재수정B: 일반 화면에서 메뉴가 정상 표시되는 경우 + 뷰포트를 인위적으로 짧게(390×500)
  만들어 메뉴 내용이 실제로 넘치는 경우 둘 다 테스트 — 후자에서 `overflow-y:auto`가
  작동해 메뉴 내부 스크롤이 실제로 되고, `documentElement.scrollHeight`가 뷰포트 높이와
  동일하게 유지됨(페이지 자체가 안 늘어남)을 확인.
- 데스크톱 1400px: 두 재수정 모두 무회귀(툴바 숨김 유지, 메뉴 정상 동작 — `#propMoreBtn`은
  ≥480px에서 원래 `display:none`인 기존 설계라 `showMoreMenu()` 직접 호출로 메커니즘만 확인).

## 3. 미완
- 실기기 시각 검증 필요 — 이번에도 로컬 정적 서버+게스트모드+Playwright로만 확인.
- B-22(리스트뷰 겹침, 미관)는 이번 재수정A로 사실상 해결됐다고 판단 — 다음 실기기 검증에서
  문제 없으면 BACKLOG.md에서 B-22 항목도 함께 정리 대상(커맨드센터 판단).

## 4. 다음 단계
1. 실기기에서 리스트뷰 스크롤 시 정렬칩/⋯이 카드와 안 겹치는지, ⋯메뉴가 뷰포트를 넘칠 때
   내부 스크롤이 자연스러운지 체감 확인.
2. 문제 없으면 이번 2건 + B-22 완료 처리(BACKLOG.md는 커맨드센터가 정리).

## 5. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js 무접촉** — 이전 세션들과 동일 원칙 유지(Codex 충돌 우려).
- properties.js/style.css의 재수정A/재수정B는 같은 파일의 서로 다른 위치라 Edit 도구로
  한쪽을 임시로 되돌렸다 커밋 후 재적용하는 방식으로 atomic 분리함(직전 세션과 동일한
  방법) — 최종 결과물엔 영향 없음, 커밋 히스토리만 깔끔하게 분리.
- 로컬 검증용 `playwright`는 매번 `npm install --no-save`로 임시 설치 후 `npm uninstall`로
  제거 — `package.json`엔 흔적 없음.

## 6. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → 배포 후 하드닝 3건 → B-12 B안(`b9b7926`) →
  B-12 A안 재작업(`8e18f15`~`e27b21a`) → B-12 지도뷰⇄리스트뷰 토글(`a071de6`) → B-23
  pull-to-refresh(`c0c72b8`) → B-21/B-24 실기기 피드백(`25a0671`/`246b673`) → B-12 실기기
  버그 3건(`9acb7a7`/`434fb71`/`8cbfb95`) → **이번 세션(B-12 재수정 2건,
  `9a8f7ef`/`83ac8ab`, push 완료)**.
