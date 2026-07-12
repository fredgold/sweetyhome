# HANDOFF — B-12 실기기 z-index/스크롤 버그 3건 수정 (2026-07-12)

## 1. 목표
실기기 배포 후 받은 스크린샷 기반 피드백 3건 수정: (버그1) 바텀시트·폼시트가 모바일 탭바에
가림, (버그2) 리스트뷰 첫 카드가 고정 정렬칩/⋯바에 가림, (버그3) 시트·⋯메뉴 열림 중 뒤 배경이
같이 스크롤됨.

## 2. 완료
**세 건 모두 atomic 커밋으로 구현·검증·push 완료.**

```
8cbfb95 fix: B-12 버그3 — 시트·⋯메뉴 열림 중 뒤 배경 스크롤 잠금
434fb71 fix: B-12 버그2 — 리스트뷰 첫 카드가 고정 정렬칩/⋯바에 가리는 문제 수정
9acb7a7 fix: B-12 버그1 — 바텀시트·폼시트가 모바일 탭바에 가려지는 z-index 역전 수정
```

### 버그1 요약
`.apptabs{z-index:1001}` > `#complexDetailModal`/`.form.open`(모바일, 기존 `.modal` 기본값
1000 상속)이라 시트 상단이 탭바 뒤에 가려짐. 둘 다 `z-index:1100`으로 상향(`style.css`만
수정). 데스크톱 `#complexDetailModal{z-index:1002}`은 별도 미디어쿼리라 무변경 — Playwright로
1002 유지 재확인.

### 버그2 요약
리스트뷰(`data-view=list`)는 `#panel-props`가 `position:static`이라 페이지가 스크롤되는데,
정렬칩·뷰토글·⋯버튼은 여전히 `position:fixed`로 화면에 떠 있어 카드 목록 맨 위 여백이 없으면
첫 카드가 그 뒤로 들어감. `#complexSection`에 `padding-top:58px` 추가(`style.css`만 수정) —
스크롤 0(진입 직후) 시점 바의 위치(콘텐츠 시작점 기준 10~48px)를 기준으로 계산. 스크롤 중
플로팅 바가 카드 위에 겹치는 것 자체는 B-22(낮은 우선순위, 미관)로 이미 별도 추적 중이라 이번
범위(첫 진입 시 가림)에서는 손대지 않음.

### 버그3 요약
바텀시트/폼시트/⋯메뉴가 열려도 뒤 리스트가 스크롤되던 문제. `utils.js`의 `openModal`/
`closeModal`에 `lockBodyScroll`/`unlockBodyScroll`(body `position:fixed` 고정 표준 기법,
카운터로 중첩 오픈 대응)을 훅으로 추가하고, `properties.js`의 `openForm`/`closeForm`(폼시트,
데스크톱은 인라인이라 제외)·`showMoreMenu`/`closeMoreMenu`(⋯메뉴)에도 같은 유틸을 적용
(`js/utils.js`, `js/properties.js` 수정). `js/nav.js`는 무접촉.

### 검증 방법
`node --check` 전체 + CSS 중괄호 균형 + `git diff --check` 통과. Playwright로:
- 버그1: `#complexDetailModal`/`.form.open` z-index(1100) > `.apptabs`(1001) 확인, 스크린샷으로 시트가 탭바 위에 정확히 뜨는 것 시각 확인.
- 버그2: 리스트뷰 첫 카드 `getBoundingClientRect()`가 칩/토글 바와 겹치지 않음 확인, 스크린샷으로 시각 확인.
- 버그3: 바텀시트/폼시트/⋯메뉴 각각 열림 중 `body{position:fixed}` 전환 + 강제 `scrollTo()` 시도해도 `scrollY` 안 바뀜 확인, 닫으면 원래 스크롤 위치로 정확히 복원, ⋯메뉴는 잠금 전후로 메뉴 좌표가 정상 범위인지도 확인(containing block 변경 우려 검증).
- 데스크톱 1400px: 모달 z-index 1002 유지, 폼 오픈 시 스크롤 안 잠김(인라인 콘텐츠라 무관), 콘솔 에러 0.

## 3. 미완
- 실기기 시각 검증 필요 — 이번에도 로컬 정적 서버+게스트모드+Playwright로만 확인.
- 버그2 수정은 "리스트뷰 진입 직후 첫 카드 가림"만 해결. 스크롤 중 플로팅 바가 카드 텍스트
  위에 겹치는 문제는 B-22로 계속 별도 추적(디자인 결정 필요, 낮은 우선순위).

## 4. 다음 단계
1. 실기기에서 세 수정사항 체감 확인(시트가 탭바 위에 정상 표시되는지, 리스트뷰 첫 카드가
   안 가리는지, 시트/메뉴 열림 중 배경이 안 움직이는지).
2. 문제 없으면 이번 3건 완료 처리(BACKLOG.md는 커맨드센터가 정리).

## 5. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js 무접촉** — 이전 세션들과 동일 원칙 유지(Codex 충돌 우려).
- style.css의 버그1/버그2 수정은 같은 파일의 인접한 코드라 `git add -p` 방식 없이 Edit
  도구로 한쪽을 임시로 되돌렸다 커밋 후 재적용하는 방식으로 atomic 분리함(diff가 겹쳐서
  일반적인 부분 스테이징이 어려웠음) — 최종 결과물엔 영향 없음, 커밋 히스토리만 깔끔하게 분리.
- 로컬 검증용 `playwright`는 매번 `npm install --no-save`로 임시 설치 후 `npm uninstall`로
  제거 — `package.json`엔 흔적 없음.

## 6. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → 배포 후 하드닝 3건 → B-12 B안(`b9b7926`) →
  B-12 A안 재작업(`8e18f15`~`e27b21a`) → B-12 지도뷰⇄리스트뷰 토글(`a071de6`) → B-23
  pull-to-refresh(`c0c72b8`) → B-21/B-24 실기기 피드백(`25a0671`/`246b673`) → **이번 세션
  (B-12 실기기 버그 3건, `9acb7a7`/`434fb71`/`8cbfb95`, push 완료)**.
