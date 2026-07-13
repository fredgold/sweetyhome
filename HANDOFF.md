# HANDOFF — B-47 데스크톱 매물탭 상단 슬림화 (2026-07-13)

## 1. 목표
`BACKLOG.md`의 B-47 처리. B-36으로 좌측 카드 리스트가 컬럼 내부 스크롤이 됐지만, 그 위
고정 영역(기준바 `.gates` + `panel-head` 보조 버튼 여러 줄 + 필터칩)이 커서 카드가
2~3개만 노출되던 문제 — 기준바를 접이식으로, 보조 버튼을 데스크톱도 ⋯더보기로 묶어
상단을 슬림화하는 것이 목표.

## 2. 완료
**커밋·push 완료.**

```
da38aad feat: B-47 데스크톱 매물탭 상단 슬림화(카드 표시 공간 확보)
```

1. **기준바 접이식**: `.gates`(id=`gatesBox`)에 토글 버튼(`#gatesToggleBtn`) 추가, 기본
   접힘(제목 1줄만) + 클릭 시 펼침. `properties.js`에 `initGatesToggle()` IIFE 신설 —
   렌더 로직(`renderGates()`)은 `nav.js` 소유라 손대지 않고 클래스 토글+localStorage
   저장만 별도 함수로 분리(nav.js 무접촉 원칙 유지). 펼침 상태는 `localStorage`
   (`sh_gatesExpanded`)로 기억.
2. **⋯더보기 데스크톱 이식**: 모바일 480px 이하에서 이미 쓰던 패턴(`.ph-more-btn` 노출 +
   보조 버튼 4개 인라인 숨김)을 `@media (min-width:900px)`에도 추가. `showMoreMenu()`의
   desktop `ids` 배열에 `migStartBtn`("기존 매물을 단지로 정리")을 추가 — 기존엔
   desktop/mobile 배열 둘 다 이 버튼이 빠져 있어(사전 조사로 발견) 모바일에서도 접근
   불가였던 기존 갭을 함께 바로잡아 "모바일과 통일" 요구사항을 완전히 충족.

### 검증 방법
`node --check`/CSS 중괄호 균형/`div` 개폐 개수/`git diff --check` 통과. Playwright로
데스크톱(1400×900)에 가짜 단지 12건을 `state.complexes`에 직접 주입해 확인:
- 기준바 기본 접힘 → 토글 클릭 시 펼침 → 새로고침해도 펼침 상태 유지(localStorage).
- `#propMoreBtn`만 인라인 노출, 나머지 4개 보조 버튼은 인라인에서 사라지고 ⋯ 클릭 시
  `.ph-more-menu` 안으로 실제 이동, 바깥 클릭으로 닫으면 원래 `.ph-actions` 부모로
  정확히 복원.
- **정량 효과 측정**: 수정 전/후 동일 합성 데이터로 `#complexSection`의
  `getBoundingClientRect().top` 비교 — 574.75px → 453.25px(-121.5px), 뷰포트(900px)에
  보이는 카드 수 3개→4개 증가 확인(B-36 커밋을 임시 `git stash`로 되돌려 baseline
  측정 후 복원하는 방식으로 비교).
- 모바일은 `.gates`가 이미 `display:none`이라 무관, ⋯메뉴에 `migStartBtn`이 새로
  포함된 것과 지도뷰/리스트뷰 스크린샷으로 무회귀 확인.
- 임시 설치한 `playwright`는 `npm install --no-save` → `npm uninstall`로 제거, 테스트
  스크립트·임시 서버·스크린샷은 세션 종료 전 삭제.

## 3. 미완 / 다음 단계
- 실기기 시각 검증 필요(로컬 정적 서버+게스트모드+Playwright 합성 데이터로만 확인).
- B-36에서 발견한 `.gates`/`.wcard` 등 그리드 위쪽 요소로 인한 baseline 페이지 스크롤
  자체는 이번에도 손대지 않음(`.gates` 접힘으로 상당 부분 완화됐지만 `.wcard`는
  `display:none`으로 이미 숨겨진 상태라 영향 없음) — 필요하면 커맨드센터 판단에 따라
  별도 항목으로 검토.

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js 무접촉** — `renderGates()`는 그대로 두고 별도 토글 함수로 분리해 원칙 유지.
- `index.html`/`js/properties.js`/`style.css` 3개 파일이 기준바 토글·⋯메뉴 이식 두
  기능에 걸쳐 얽혀 있어 커밋 1건으로 처리(지시문의 "규모 크면 분할 재량" 조항은 이번엔
  적용하지 않음 — 변경량이 작고 두 기능이 서로 얽혀 있어 분할 시 이점이 없음).

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → 배포 후 하드닝 3건 → B-12 관련 다수 작업 →
  B-26+B-35(저장 안내 정합성 + 매물탭 필터 그룹 칩 바) → B-36(데스크톱 좌측 리스트 자체
  스크롤, `4ff752a`) → **이번 세션(B-47, `da38aad`, push 완료)**.
