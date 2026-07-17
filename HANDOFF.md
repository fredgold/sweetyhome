# HANDOFF — B-64 ① 렌더링 깨짐 진단 완료, 보안 이슈 발견 (2026-07-17)

## ⚠️ 최우선 확인 필요
이번 진단 중 **실제 실행 가능한 XSS 2건을 발견**했습니다(신고된 3곳과는
무관한 별도 위치 — 프로필 마일스톤 라벨 필드). 상세는 아래 2번 참고.
**빠른 후속 보안 패치 지시를 권장합니다** — 수정 자체는 2줄짜리 초소형
패치입니다.

## 1. 목표
`BACKLOG.md` ⭐ 섹션 B-64 ①(진단 전용, 코드 무변경). 사용자 보고:
"HTML 양식이 3곳에서 깨짐 — ①붙여넣기 임포트 ②수집함 카드 표시
③매물 상세 표시". `scraps-import.js`·`scraps-render.js`·
`properties.js`·`utils.js`의 렌더 경로 전수 확인 + XSS 실행 가능
여부 실측. 손 B가 `style.css`로 B-66 작업 중이라 이번 커밋은 CSS·JS
무변경(진단만).

## 2. 완료
**커밋 1개(문서만), push는 보류.**

```
docs: B-64 렌더링 깨짐 진단 (HISTORY 기록)
```

`HISTORY.md`·`HANDOFF.md`만 수정. `js/`·`css/` 전혀 건드리지 않음
(진단 전용 지시 준수, `node --check` 대상 코드 변경 없음).

**핵심 발견**:

1. **신고된 3곳 자체에서는 XSS 실행 지점 없음.** ①은 파싱 휴리스틱
   문제(구조화 안 된 실제 웹 카피 텍스트가 frontmatter/표/key:val
   어디에도 안 맞아 freeText 폴백 → 첫 줄 제목 추측 실패), ②는
   marked.js가 스트레이 `#`/`-`/`>` 등을 서식으로 오인식하는 시각적
   깨짐(렌더는 `renderMd()`로 DOMPurify 정화됨, 안전), ③은
   `em_memo`(매물 수정 모달)에 마크다운 서식 툴바가 있는데 카드 표시
   (`properties.js:774`)는 `esc(p.memo)`만 쓰고 `renderMd()`를 안 불러
   서식이 절대 렌더 안 되는 WYSIWYG 불일치(보안 문제 아님, 오히려
   안전한 쪽으로 깨짐).

2. **별도 위치에서 실행 가능한 XSS 2건 발견** — `state.profile.milestones[].label`
   (프로필 모달 자유 텍스트)이 두 read-only 표시 경로에서 `esc()` 없이
   `innerHTML`에 삽입됨:
   - `js/nav.js:61`(`renderJourney()`, 대시보드 타임라인) — `renderDash()`가
     모든 렌더 사이클마다 호출돼 **로그인 시 기본 탭에서 매번 자동 실행**.
   - `js/ai.js:26`(`renderChat()`, AI 채팅 빠른질문 칩) — AI 탭 열 때 실행.
   - 같은 필드가 편집 UI 자체(`js/profile.js:5`)에서는 `esc()` 처리돼
     안전 — 딱 이 표시 경로 2곳만 빠짐.
   - Playwright로 `<img src=x onerror="window.__xss=1">`를 마일스톤
     라벨에 넣고 `renderDash()`/`renderChat()` 실행 → **양쪽 다 실제
     실행 확인**(`window.__xss` 플래그 true).
   - 수정은 `esc(s.t)`(`nav.js`)·`esc(c)`(`ai.js`) 각 1줄 — 스키마·구조
     변경 없는 초소형 패치.

- **검증**(Playwright, 로컬 정적 서버+게스트모드, 코드는 일절 수정하지
  않고 브라우저 동작만 관찰):
  - `renderMd()`(marked.js+DOMPurify, `index.html:14`에 로드 확인)에
    `<script>`·`<img onerror>`·`<svg onload>`·`<a href=javascript:>`·
    `<iframe>`·`<details ontoggle>` 등 7종 payload를 실제 DOM에 삽입
    → **전부 무력화 확인**(태그 전체 제거 또는 위험 속성만 제거).
  - 스크랩 카드 렌더 경로(title/raw/tags) 전수 payload 주입 → 전부
    안전 확인.
  - 마일스톤 라벨 XSS는 `renderDash()`·`renderChat()` 양쪽 경로 모두
    재현.
  - 로컬 python 테스트 서버·Playwright 스크립트는 레포 바깥
    scratchpad에서만 실행, 세션 종료 전 전부 삭제(레포에 흔적 없음).

## 3. 미완 / 다음 단계
- **보안 패치(A) 최우선 권장** — `js/nav.js` 1줄 + `js/ai.js` 1줄.
  별도의 작은 보안 패치 지시로 즉시 처리 권장(진단 커밋 범위 밖이라
  이번엔 미적용).
- **B-64 ② 수정 단계 후보**(B/C/D, HISTORY.md "4. 수정 방안 제안" 참고):
  - B(작음): `properties.js:774` `esc(p.memo)`→`renderMd(p.memo)` 1줄.
  - C(중간, 제품 판단 필요): 수집함 카드 마크다운 오인식 — 실제 네이버
    매물 붙여넣기 샘플로 테디 확인 후 방향 결정 권장.
  - D(가장 큼, 제품 판단 필요): 붙여넣기 임포트 파싱 휴리스틱 개선 —
    스코프 논의 필요.
- BACKLOG.md ⭐ 섹션의 B-64는 진단만 완료 상태 — 수정 지시 대기.

## 4. 주의점
- PIN·API 키·실제 데이터는 이 문서 어디에도 기록 안 함. 테스트는
  `window.__xss` 같은 무해한 플래그만 사용, 실제 공격 페이로드를
  외부로 전송하는 테스트는 하지 않음(로컬 DOM 실행 여부만 확인).
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀
  수정·커밋 안 함.
- **이번 커밋은 진단 전용 — `js/`·`css/` 코드 무변경** 원칙 준수.
  발견한 XSS 2건도 이번 커밋에서 고치지 않고 보고만 함(지시 범위
  엄수). 다음 세션에서 사람 확인 후 별도 보안 패치 지시 필요.
- `style.css`는 손 B가 B-66(모바일 에디터/입력 UI 공통 깨짐 진단)
  작업 중이라 무접촉 — 이번 진단도 CSS 쪽은 코드 확인만 하고 손대지
  않음.

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code) — 손
  B(Codex)" 3자 협업 구조. SSOT는 `CLAUDE.md`, 실행 규칙은
  `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는 `BACKLOG.md`(커맨드센터
  전용).
- 직전 세션들: ... → B-63(매물 필드 편집) → B-65(로그인 유지) →
  **이번 세션(B-64 ① 진단, push 보류) — XSS 2건 발견, 렌더링 깨짐
  3곳 원인 특정**. 다음: 보안 패치 별도 지시 또는 B-64 ② 수정 단계.
