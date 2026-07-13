# HANDOFF — B-36 데스크톱 매물탭 좌측 리스트 자체 스크롤 (2026-07-13)

## 1. 목표
`BACKLOG.md`의 B-36 처리. 데스크톱 매물탭 좌측 컬럼(`.grid>section`)에 카드가 많으면
페이지 전체가 세로로 늘어나 스크롤이 과했던 문제 — `#complexSection`(v5 단지 카드 목록)에
데스크톱 overflow 설정이 없어서였고, 카드 목록만 컬럼 내부에서 스크롤되게 고쳐 지도가
항상 화면에 고정돼 보이게 하는 것이 목표.

## 2. 완료
**커밋·push 완료.**

```
4ff752a fix: B-36 데스크톱 매물탭 좌측 리스트 자체 스크롤
```

`style.css`의 `@media (min-width:900px)` 블록에서 `#complexSection`에 레거시 `.rail`과
동일한 `flex:1;min-height:0;overflow-y:auto;padding-right:4px`를 부여. 검색창·통계·폼·
`#legacyToggleWrap`엔 `flex-shrink:0`을 명시해 위쪽 고정 영역이 눌리지 않게 함. 모바일
`#complexSection{position:absolute}` 블록(지도 위 가로 스트립)은 별개 미디어쿼리라
전혀 손대지 않음 — 지시대로 `@media (min-width:900px)` 블록만 수정.

### 검증 방법
`node --check`/CSS 중괄호 균형/`git diff --check` 통과. Playwright로 데스크톱(1400px)에
가짜 단지 데이터(2/30/80건)를 `state.complexes`에 직접 주입해 확인:
- 카드 수가 2→80으로 늘어도 `document.documentElement.scrollHeight`는 1236px로 불변
  (남은 1236px는 `.gates`/`.wcard` 등 그리드 위쪽 요소 때문인 베이스라인이지 리스트
  때문이 아님 — 카드 수와 무관하게 고정임을 확인해 검증).
- `#complexSection.scrollTop`을 내부적으로 바꿔도 `window.scrollY`는 0 유지, `.mapcard`의
  `getBoundingClientRect()`가 스크롤 전후 완전히 동일(지도가 전혀 안 움직임).
- 레거시 목록(`legacyToggleBtn`) 펼침 상태에서도 페이지 높이 불변.
- 모바일 지도뷰/리스트뷰 스크린샷으로 `#complexSection`의 `position`/`display`가 기존과
  동일함(무회귀) 확인.
- 임시 설치한 `playwright`는 `npm install --no-save` → `npm uninstall`로 제거, 테스트
  스크립트·임시 서버·스크린샷은 세션 종료 전 삭제.

## 3. 미완 / 다음 단계
- 실기기 시각 검증 필요(로컬 정적 서버+게스트모드+Playwright 합성 데이터로만 확인).
- 이번 작업으로 base line 1236px 페이지 스크롤(`.gates`/`.wcard` 등)이 남아있음을
  발견했지만 이번 지시 범위(B-36) 밖이라 손대지 않음 — 필요하면 커맨드센터 판단에 따라
  별도 항목으로 검토.

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js 무접촉** — 이전 세션들과 동일 원칙 유지(Codex 충돌 우려).
- 이번 수정은 `style.css` 단일 파일, 6줄 추가로 끝나는 작은 변경이라 커밋 1건으로 처리.

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → 배포 후 하드닝 3건 → B-12 관련 다수 작업 →
  B-26(저장 안내 정합성) + B-35(매물탭 필터 그룹 칩 바 재구성, `c4f4952`/`913d7ec`) →
  **이번 세션(B-36, `4ff752a`, push 완료)**.
