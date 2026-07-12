# HANDOFF — B-12/B-23 실기기 피드백 반영 2건 (2026-07-12)

## 1. 목표
실기기 배포 후 받은 피드백 2건을 수정: (B-21) 바텀시트(단지 상세) 닫기가 상단 버튼뿐이라
불편, (B-24) pull-to-refresh로 새로고침하면 대시보드로 초기화되어 보던 화면을 잃음.

## 2. 완료
**두 건 모두 구현·검증·커밋·push 완료.**

```
246b673 feat: B-24 pull-to-refresh 새로고침 후 화면 위치 유지
25a0671 feat: B-21 바텀시트(단지 상세) 드래그다운 닫기 추가
```

### B-21 요약
- `js/properties.js`에 IIFE 추가(`#cxDetailMemo` blur 핸들러 뒤, 사이드바 리사이즈 섹션 앞).
- 배경 딤 탭 닫기는 **이미 구현돼 있었음**(모든 `.modal`에 적용되는 범용 클릭-바깥 핸들러,
  `document.querySelectorAll('.modal').forEach(...)` — 1231번째 줄쯤) — 새로 만들지 않고
  Playwright로 동작만 재확인.
- 새로 추가한 건 드래그다운: `.box` 상단 ~60px(핸들 바+헤더) 안에서 시작 + 세로 우세 +
  아래 방향인 터치만 인식. 헤더가 sticky가 아니라 스크롤되면 화면 밖으로 밀려나므로
  "상단 존에서 시작" 조건 하나로 "시트 최상단일 때만"이 자동 보장됨(본문 스크롤 무충돌).
  90px 이상 끌면 `closeModal('complexDetailModal')`, 미만이면 스냅백.
- CSS 변경 없음(기존 `.box::before` 핸들 바 스타일로 충분하다고 판단).

### B-24 요약
- `js/boot.js`에 `saveViewState()`/`restoreLastView()` 추가. `activePanel`(state.js 전역)과
  `propViewMode`(properties.js 전역, B-12에서 도입)를 `sessionStorage`(`sh_lastView` 키)에
  JSON으로 저장.
- 저장 트리거 3곳: B-23 PTR의 `location.reload()` 직전 / `visibilitychange`(hidden 전환) /
  `pagehide`(안전망).
- 복원은 `load().then(restoreLastView)` — `state.js`의 `load()` 정의는 그대로 두고 `boot.js`의
  **호출부만** `.then()` 체이닝으로 바꿔서 `state.js` 무변경 달성.
- `js/nav.js`는 전혀 건드리지 않음 — `switchPanel()`은 이미 정의된 함수를 호출만 함(패널
  이름을 화이트리스트로 검증한 뒤 호출, 잘못된 값이 들어와도 빈 화면 안 뜨게 방어).

### 검증 방법
`node --check` 전체 + `git diff --check` 통과. Playwright(`hasTouch` 컨텍스트 + 합성
`TouchEvent`)로:
- B-21: 임계(90px) 초과 드래그→릴리즈→닫힘 / 임계 미만→스냅백(열린 채 유지) / 핸들존
  밖(본문 200px 지점)에서 시작한 드래그→무동작 / 배경 딤 탭→닫힘(기존 핸들러 재확인) /
  데스크톱 1400px에서 모달 정상 오픈, 콘솔 에러 0.
- B-24: `saveViewState()` 호출 시 sessionStorage 내용 정확 / `visibilitychange`(hidden)
  발생 시 자동 저장 / 사전에 `sh_lastView`를 시딩한 뒤 페이지 로드→props+리스트뷰로 정확히
  복원 / 다른 패널(assets) 복원도 확인 / 저장값 없으면 기본 대시보드로 정상 부팅 / 깨진
  JSON 문자열을 넣어도 크래시 없음(try/catch) / 존재하지 않는 패널명을 넣어도 화이트리스트가
  걸러내 빈 화면 안 뜸 / 데스크톱 1400px 콘솔 에러 0.

## 3. 미완
- 둘 다 로컬 정적 서버+게스트모드+Playwright 합성 터치 이벤트로만 확인. **실기기 검증
  필요**: B-21은 실제 손가락 드래그 저항감·스냅백 애니메이션 체감, B-24는 실제 iOS
  standalone에서 pull-to-refresh 후 화면이 정확히 복원되는지(특히 지도가 다시 정상
  로드되는 타이밍) 확인 필요.
- B-24는 게스트 모드의 로그인 상태 자체는 복원하지 않음(요구사항 범위 밖 — `isGuestMode`는
  세션 저장이 없는 기존 동작 그대로, PIN 인증 사용자는 `sh_token`이 이미 sessionStorage에
  있어 자동 재로그인됨).

## 4. 다음 단계
1. 실기기에서 두 기능 체감 확인(드래그다운 저항감, PTR 후 복원 타이밍).
2. 문제 없으면 B-21/B-24 완료 처리(BACKLOG.md는 커맨드센터가 정리).

## 5. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js 무접촉** — Codex 충돌 우려로 정의는 그대로 두고 호출만 함(이전 세션들과 동일
  원칙 유지).
- 로컬 검증용 `playwright`는 매번 `npm install --no-save`로 임시 설치 후 `npm uninstall`로
  제거 — `package.json`엔 흔적 없음.

## 6. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → 배포 후 하드닝 3건 → B-12 B안(`b9b7926`) →
  B-12 A안 재작업(`8e18f15`~`e27b21a`) → B-12 지도뷰⇄리스트뷰 토글(`a071de6`) → B-23
  pull-to-refresh(`c0c72b8`) → **이번 세션(B-21/B-24 실기기 피드백, `25a0671`/`246b673`,
  push 완료)**.
