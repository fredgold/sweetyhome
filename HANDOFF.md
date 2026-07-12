# HANDOFF — B-12 모바일 매물탭 지도뷰⇄리스트뷰 토글 (2026-07-12)

## 1. 목표
직전 세션에서 완료·push한 B-12 A안(풀스크린 지도뷰) 위에, 지도뷰⇄리스트뷰를 전환하는 토글을
추가. 지도뷰(기본)는 A안 그대로, 리스트뷰는 지도를 숨기고 단지 카드를 세로 목록으로 훑는 화면
(페이지 스크롤 허용). 마커연동·정렬·현위치·바텀시트 로직은 그대로 재사용. 데스크톱(≥900px)은
절대 무변경.

## 2. 완료
**구현·검증·커밋·push 완료.**

```
a071de6 feat: B-12 모바일 매물탭 지도뷰⇄리스트뷰 토글 추가
63ae5bc docs: B-12 A안 재작업 HISTORY/HANDOFF 갱신   ← 직전 세션에 이미 push됨
```

### 구현 요약
- **상태**: `propViewMode='map'|'list'`(`js/properties.js`, 기본 `'map'`, 새로고침 시 초기화 — localStorage 저장 안 함, 기존 `cxSort`/`legacyExpanded` 같은 UI 상태 관례를 그대로 따름).
- **토글**: `#propViewToggleBtn`(신규, 지도 우상단 "⋯" 왼쪽 원형 버튼) 클릭 → `propViewMode` 전환 → `applyPropViewMode()`가 `#panel-props`에 `data-view="map"|"list"` 반영 + 버튼 텍스트("목록"/"지도") 갱신 + 지도뷰 복귀 시 `overview.refresh(true)`.
- **리스트뷰 CSS**(`#panel-props[data-view="list"]` 스코프, `@media(max-width:899.98px)` 안): `position:fixed`/`overflow:hidden` 해제(세로 스크롤 복원) · `.mapcard{display:none}` · `#complexSection`을 가로 스냅 스트립(`flex`)에서 세로 목록(`block`, full width, 스냅 해제)으로.
- **HTML 구조 변경**: `.cx-sort-chips`/`#myLocBtn`을 `.mapcard` 내부에서 `.grid` 형제로 이동(+ 신규 `#propViewToggleBtn`도 같은 자리). 이유: 이 요소들은 `position:fixed` 오버레이라 어디 있든 화면에 보이지만, `.mapcard` **안에** 있으면 리스트뷰에서 `.mapcard{display:none}`이 될 때 자식인 이 요소들도 함께 사라짐(display:none 조상은 자식의 position으로 되살릴 수 없음) — 데스크톱은 두 요소 모두 base `display:none`이라 이동해도 무영향(Playwright로 확인).
- **마커↔카드 연동**: `focusCxCard`/`highlightCxCard`/`reselectCxMarker` 등은 리스트뷰에서 별도 가드 없이 안전 — 마커 클릭이 발생하려면 지도가 보여야 하는데 리스트뷰는 지도가 `display:none`이라 그 호출 경로 자체가 없음(에러도 안 남, `ovMarkers`가 항상 `[]` 초기화돼 있어 forEach도 안전).

### 검증 중 발견·수정한 버그 1건
**`--overlay-top` 신설** (Playwright 스크린샷으로 직접 발견): 지도뷰는 `#panel-props{overflow:hidden}`이라 페이지가 항상 `scrollY=0` → `--topbar-h`(헤더+탭바 높이) 고정값이 항상 맞았음. 그런데 리스트뷰는 실제로 스크롤되고, `header`는 sticky가 아니라 스크롤에 딸려 올라가는 반면 `.apptabs`만 `top:0`에 들러붙어 남음 — 정렬칩/뷰토글/⋯버튼이 `--topbar-h`에 고정된 채라 스크롤 후 남은 좁은 탭바 공간을 넘어 카드 위에 얹히는 게 스크린샷에서 실제로 보임. `updateNavHeightVar()`에 `updateOverlayTopVar()`를 추가해 `--overlay-top = Math.max(--nav-h, --topbar-h - scrollY)`를 스크롤마다(RAF 스로틀) 갱신하도록 하고, 오버레이 3종의 `top` 기준을 `--topbar-h`→`--overlay-top`으로 교체. 지도뷰는 scrollY가 항상 0이라 이 값이 기존 `--topbar-h`와 동일해 회귀 없음.

### 사용자가 지정한 "겸사겸사" 점검 2건
1. **z-index 주석-실제 불일치**: 주석이 "팝업(`.status-picker`) < 바텀시트(`.modal`)"라고 적혀 있었는데 실제 값은 `.status-picker{z-index:2000}` > `.modal{z-index:1000}`으로 반대. 동시에 둘 다 열리는 흐름이 없어(더보기 메뉴 열림 → 바깥 클릭 시 닫힘, 바텀시트 열기와 메뉴 열기는 상호 배타적) 실질적 버그는 아니라고 판단 — 값을 바꾸면 앱 전역에서 공유하는 `.status-picker`/`.modal` 인프라를 건드리는 더 위험한 변경이라 **주석만 실측값 기준으로 정정**(값은 무변경).
2. **`--topbar-h` 초기 측정 플리커**: Playwright로 `switchPanel('props')` 호출 직후~100ms까지 프레임별로 `--topbar-h`/`#panel-props` 실제 위치를 샘플링해 확인. `switchPanel()`이 `initOverview()`→`updateNavHeightVar()`를 **동기** 호출하기 때문에 브라우저가 페인트하기 전에 이미 올바른 값(164.5px)으로 갱신됨 — 플리커 없음. 관찰된 유일한 시각적 "정착"은 기존 `.panel{animation:fade}`(opacity+translateY 220ms 페이드인)이며 이번 작업과 무관.

### 검증 방법
`node --check` 전체 JS + CSS 중괄호 균형 + `git diff --check` 통과. Playwright(임시 설치 후 제거)
390px: 기본 지도뷰 → 리스트뷰 토글(세로 스크롤 복원 확인) → 스크롤 후 오버레이 위치 확인(겹침
없음) → 리스트뷰에서 카드 탭→바텀시트 → 지도뷰 복귀(스냅 스트립 원복) → ⋯메뉴 리스트뷰에서도
동작 확인. 1400px: 토글 버튼/칩/현위치 전부 `display:none`, 그리드·sticky 지도·카드 목록 무회귀.

## 3. 미완
- **실기기 모바일 배포 검증 대기** — 이번에도 로컬 PIN·네이버 지도 도메인 제약으로 정적 서버+
  게스트모드+Playwright로만 확인.
- **알려진 특성(버그 아님, 후속 논의 대상)**: 리스트뷰에서 플로팅 오버레이(정렬칩 등)가
  `position:fixed`라 스크롤 중 카드 텍스트 위에 그대로 겹쳐 보일 수 있음(위치 자체는 정확하나
  "떠 있는 칩" 미관). 완전히 없애려면 리스트 상단 여백 예약이나 툴바 배경 불투명화 등 추가
  디자인 결정이 필요해 이번 범위(명시된 요구사항)에서는 손대지 않음 — 필요 시 별도 지시로 진행.

## 4. 다음 단계
1. 실기기에서 지도뷰⇄리스트뷰 토글 + 리스트뷰 스크롤/오버레이 체감 확인.
2. 리스트뷰 플로팅 오버레이 겹침 미관이 실사용상 거슬리면 후속 작업으로 배경 불투명화 등 논의.
3. 문제 없으면 B-12는 완료 처리(BACKLOG.md는 커맨드센터가 정리).

## 5. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js는 건드리지 않음** — 이전 세션과 동일한 이유(Codex/손B와의 파일 충돌 리스크 회피).
- 로컬 검증용 `playwright`는 매번 `npm install --no-save`로 임시 설치 후 `npm uninstall`로 제거 —
  `package.json`엔 흔적 없음.

## 6. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → 배포 후 하드닝 3건 → B-12 B안(4단계, `b9b7926`)
  → B-12 A안 재작업(4단계, `8e18f15`~`e27b21a`, push 완료) → **이번 세션(지도뷰⇄리스트뷰 토글,
  `a071de6`, push 완료)**.
