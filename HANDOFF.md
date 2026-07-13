# HANDOFF — B-52 iOS PTR이 지도 패닝을 새로고침으로 오판하는 버그 수정 (2026-07-13)

## 1. 목표
`BACKLOG.md`의 B-52(🔴 0.5순위, P0 버그) 처리. B-23(iOS standalone pull-to-refresh)이
"세로 우세" 제스처를 PTR로 판정하는데, 매물탭 지도를 아래로 드래그(패닝)하는 것도
세로 우세라 지도를 못 움직이고 새로고침이 발동되던 버그를 고치는 것이 목표.

## 2. 완료
**커밋·push 완료.**

```
e9ace9d fix: B-52 iOS PTR이 지도 패닝을 새로고침으로 오판하는 버그 수정
```

`js/boot.js`의 PTR `touchstart` 핸들러에 `e.target.closest('#overviewMap,
.mapcard')` 가드를 추가 — 터치 시작점이 지도 영역이면 PTR을 아예 시작하지 않아
`touchmove`의 `e.preventDefault()`가 호출되지 않고, 네이버 지도가 자체 패닝을
그대로 처리함. 기존 조건(`navigator.standalone` 한정, 세로/가로 우세 판정, 모달
가드)은 전부 유지. 판정이 시작점 기준이라 지도가 `display:none`인 리스트뷰에서는
매칭 자체가 불가능해 정상 PTR이 코드 변경 없이 그대로 동작.

### 검증 방법
`node --check`/`git diff --check` 통과. 실기기 대신 Playwright로 `hasTouch:true`
+ `navigator.standalone=true`(`addInitScript()`로 모듈 로드 전 주입) + 합성
`Touch`/`TouchEvent`로 모킹:
- `#overviewMap`에서 시작한 강한 아래 드래그 → `#ptrIndicator`가 `ptr-show`/
  `ptr-ready`를 전혀 얻지 않음(PTR 미발동, 지도 패닝만 남음).
- 지도 밖(`#panel-props`) 최상단에서 같은 드래그 → `ptr-show`+`ptr-ready` 정상
  발동(PTR 정상 동작 무회귀).
- 단지 카드에서 수평 우세 스와이프 → 여전히 PTR 미발동(기존 로직 무회귀).
- 임시 설치한 `playwright`는 `npm install --no-save` → `npm uninstall`로 제거,
  테스트 스크립트·임시 서버는 세션 종료 전 삭제.

## 3. 미완 / 다음 단계
- **실제 지도 패닝의 체감(스무스함·반응성)은 실기기 확인 필요** — Naver Maps SDK
  내부 제스처 처리라 합성 터치 시뮬레이션으로는 "지도가 부드럽게 움직이는지"까지는
  검증 불가. 로직상으로는 PTR이 아예 개입하지 않게 됐으니 SDK 기본 동작대로
  패닝될 것으로 예상하나, 실기기 확인 전까지는 최종 확인 미완으로 남김.

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js 무접촉** — 이번 수정은 `boot.js` 단일 파일, 5줄 추가.
- 안드로이드/일반 브라우저는 `navigator.standalone!==true`라 이 리스너 자체가
  안 붙으므로 이번 변경과 무관(기존과 동일).

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- B-52는 B-23(PTR 최초 구현, `c0c72b8`)이 B-12 완료 시점에 흡수·삭제됐다가, 매물탭
  UX가 이후 크게 바뀌면서(v5 단지·매물 2계층, B-36~B-49 레이아웃 정리) 지도 패닝과의
  충돌이 재발견돼 별도 항목으로 재등록된 케이스.
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → B-12 관련 다수 작업 → B-26+B-35 →
  B-36 → B-47 → B-48 → B-44①/② → B-49 → B-46 → **이번 세션(B-52, `e9ace9d`,
  push 완료)**.
