# HANDOFF — B-23 iOS 웹앱 당겨서 새로고침(pull-to-refresh) (2026-07-12)

## 1. 목표
iOS 홈화면 웹앱(standalone)은 브라우저 UI가 없어 새로고침 수단이 전무한 문제를 해결. 최상단에서
아래로 당기면 커스텀 인디케이터가 뜨고, 놓으면 `location.reload()`. `navigator.standalone`
한정 활성 — 안드로이드/일반 브라우저는 자체 pull-to-refresh를 그대로 쓰도록 전혀 관여 안 함.
매물탭 지도뷰의 카드 가로 스와이프(`#complexSection`)와 충돌하지 않아야 하는 게 핵심 제약.

## 2. 완료
**구현·검증·커밋·push 완료.**

```
c0c72b8 feat: B-23 iOS 웹앱 당겨서 새로고침(pull-to-refresh) 추가
```

### 구현 요약
- **활성 조건**: `window.navigator.standalone===true`일 때만 `js/boot.js` 하단의 IIFE가 리스너를 붙임. 아니면 즉시 `return` — 코드 자체가 실행되지 않아 안드로이드 Chrome/데스크톱 브라우저의 네이티브 pull-to-refresh와 100% 무충돌.
- **제스처 판정**: `touchstart`에서 시작점·"최상단 여부"(`document.scrollingElement.scrollTop<=0`)·모달 열림 여부를 확인해 조건 안 맞으면 아예 관여 안 함. `touchmove`에서 처음 6px 이상 움직였을 때 1회 방향 판정 — 세로 이동이 가로보다 우세하고 아래 방향(`dy>0`)일 때만 pull로 확정, 아니면 즉시 손 뗌(가로 스와이프는 `preventDefault` 호출 없이 그대로 브라우저/캐러셀 기본 동작으로 흘러감).
- **거리·피드백**: `dist=min(110, dy*0.5)`(고무줄 저항), 70px 이상이면 `ptr-ready` 클래스로 색 변경. 인디케이터는 `translateY(dist)`로 손가락을 실시간 추적, 스피너는 `dist/70*360deg` 회전.
- **완료 처리**: `touchend`/`touchcancel`에서 임계 이상이면 `ptr-spin`(연속 회전 애니메이션) 후 250ms 뒤 `location.reload()`. 임계 미만이면 `transition`을 붙여 `translateY(0)`로 스냅백.
- **DOM/CSS**: `index.html`에 정적 인디케이터 엘리먼트(`#ptrIndicator`, 원형 스피너 SVG) 1개 추가. `style.css`에 `.ptr-indicator`류 스타일 + `html.ios-pwa`에서만 적용되는 `overscroll-behavior-y:contain`(네이티브 러버밴드 억제, 인디케이터와 이중으로 안 겹치게). 새 JS 파일 없이 기존 `boot.js`에 로직 추가.
- **모달 가드**: `.modal.open`이 있으면 pull 제스처를 시작하지 않음 — 명시 요구사항은 아니었지만, 폼/바텀시트 내부 스크롤 중 실수로 전체 리로드되는 걸 막는 안전장치로 판단해 추가.

### 검증 방법
`node --check` 전체 JS + CSS 중괄호 균형 + `git diff --check` 통과. Playwright에 `hasTouch:true`
컨텍스트 + `navigator.standalone` getter 모킹(`addInitScript`) + 합성 `TouchEvent`(`document
.dispatchEvent(new TouchEvent(...))`)로 실제 손가락 제스처를 흉내내 확인:
- 임계(70px) 초과 당김 → 릴리즈 → `framenavigated` 이벤트 발생(reload 확인)
- 임계 미만 당김 → 릴리즈 → `translateY(0px)`로 스냅백, reload 없음
- 가로 우세 제스처(dx>dy) → 인디케이터 아예 안 뜸
- `navigator.standalone!==true` → `.ios-pwa` 클래스 자체가 안 붙음, 어떤 pull에도 반응 없음
- 매물탭 지도뷰(`#panel-props{overflow:hidden}`, `scrollTop`이 항상 0)에서 세로 pull → 정상 활성화(요구사항의 "스크롤 없는 화면도 최상단으로 간주" 확인)
- `#complexSection` 카드 위에서 실제 가로 스와이프 → 인디케이터 미표시(카드 스와이프 방해 없음)
- 데스크톱 1400px → 콘솔 에러 0

## 3. 미완
- **iOS standalone 실기기 검증 필요**: 에뮬레이터/합성 이벤트로는 실제 러버밴드 억제 체감,
  당김 저항감, 리로드 타이밍의 자연스러움까지는 확인 불가 — 배포 후 실기기(홈화면에 추가한
  standalone 상태)에서 확인 필요.

## 4. 다음 단계
1. 실기기(iOS 홈화면 앱)에서 당겨서 새로고침 체감 확인.
2. 문제 없으면 B-23 완료 처리(BACKLOG.md는 커맨드센터가 정리).

## 5. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/properties.js·매물탭 레이아웃 CSS 미터치** — B-23 요구사항에 명시된 B-12 파일 비충돌
  제약을 그대로 지킴(`git diff --stat`으로 확인: `index.html`/`style.css`/`js/boot.js` 3개만
  변경).
- 로컬 검증용 `playwright`는 매번 `npm install --no-save`로 임시 설치 후 `npm uninstall`로 제거 —
  `package.json`엔 흔적 없음.

## 6. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → 배포 후 하드닝 3건 → B-12 B안(`b9b7926`) →
  B-12 A안 재작업(`8e18f15`~`e27b21a`) → B-12 지도뷰⇄리스트뷰 토글(`a071de6`) → **이번 세션
  (B-23 pull-to-refresh, `c0c72b8`, push 완료)**.
