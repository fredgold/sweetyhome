# HANDOFF — B-66 모바일 에디터/입력 UI 공통 깨짐 진단·수정 완료 (2026-07-17)

## 1. 목표
`BACKLOG.md` ⭐ 섹션 B-66. 사용자 보고: "모바일에서 에디터/입력 양식
깨짐 — 4영역 공통: ①매물 메모(`em_memo`) ②자산 노트(`a_notes`·
`an_mdPreview`) ③수집함 편집 모달(`scEditModal`·`sem_text`) ④수집함
입력폼(`sc_form`·`sc_mdSplit`)". `style.css`만 수정(JS/HTML 구조
원인은 수정 금지, 보고만). 손 A가 B-64로 `scraps-*.js`·`properties.js`·
`utils.js` 작업 중이라 JS 무접촉 절대 준수.

## 2. 완료
**커밋 1개, push는 보류.**

```
fix: 모바일 에디터/입력 UI 공통 깨짐 (B-66)
```

`style.css` 1파일만 수정(+4/-2줄). `js/`·`index.html` 전혀 건드리지
않음.

**진단 결과**: Playwright 390px+1280px로 4영역 전부 캡처·측정 —
시각적 overflow·줄바꿈 깨짐·버튼 잘림·분할뷰 붕괴는 4곳 어디서도
발견 안 됨(`sc_mdSplit`은 이름과 달리 실제 분할뷰가 아니라 단순
포지셔닝 컨테이너). 대신 **컴퓨티드 스타일 실측으로 공통 원인 특정**:
`style.css:1140-1142`의 iOS 자동확대 방지 규칙(`input,select,
textarea{font-size:16px!important}`)이 `<textarea>`/`<input>`만
대상으로 해서, `<textarea>`가 아니라 `contenteditable div`인
③④(`sem_text`·`sc_text`, `.sc-md-editor`)는 대상에서 빠져 있었음
— 수정 전 mobile 390px 기준 `em_memo`/`a_notes`는 16px(안전)인데
`sem_text`는 13px, `sc_text`는 14px(전부 iOS 자동확대 임계값 미만).
①②(진짜 textarea)는 이미 안전했고 ③④(contenteditable 2개)만
문제였다는 게 "4영역 중 2곳만 겹치는" 사용자 체감과 정확히 일치.

**수정**: `style.css:1142` 셀렉터에 `.sc-md-editor` 추가 —
`input,select,textarea,.sc-md-editor{font-size:16px !important;}`.
`!important`라 `#sc_text{font-size:14px}`(760px 미디어쿼리, ID
셀렉터) 같은 더 높은 특이도 규칙보다도 확실히 우선.

- **검증**(Playwright, 390px+1280px, before/after 비교):
  - 수정 후 `sem_text`·`sc_text` computed font-size 390px에서
    `16px` 확인(수정 전 13px/14px).
  - `em_memo`·`a_notes`는 수정 전후 무변화(계속 16px).
  - **데스크톱 1280px 4영역 전부 완전 무회귀**(480px 이하에서만
    적용되는 미디어쿼리라 데스크톱은 규칙 자체가 안 걸림, 스크린샷도
    픽셀 단위 무차이).
  - 390px 스크린샷 재비교 — overflow·줄바꿈·버튼 잘림 없음, 폰트만
    약간 커짐.
  - CSS 중괄호 균형 통과.

## 3. 미완 / 다음 단계
- **B-66 완료** — BACKLOG.md ⭐ 섹션에서 커맨드센터가 삭제 처리할 차례.
- **JS 원인 잔여분: 없음** — 유일한 공통 원인이 CSS 한 줄로 완전히
  해결돼 후속 JS 수정이 필요한 항목이 남지 않음. 참고용으로 확인만
  한 것: `.sc-md-split` 네이밍이 실제 동작(포지셔닝 컨테이너)과
  안 맞지만 기능 문제는 아니고, 리네이밍은 JS 참조 다수 변경이 필요해
  이번 범위 밖(HISTORY.md에 기록).
- **B-60(모바일 키보드 충돌)과 겹치는지 판별**: 서로 다른 메커니즘
  (B-60=키보드 등장 시 뷰포트 높이 변화로 인한 sticky/스크롤 튐,
  이번 건=포커스 즉시 화면 확대)이지만 사용자 체감은 비슷할 수 있음.
  **이번 패치 배포 후 B-60 실기기 재확인 권장** — 확대 버그가 원인
  이었던 체감 "튐"이 해소됐을 가능성 있어 B-60 착수 여부 재판단 시
  오탐 감소 기대.

## 4. 주의점
- PIN·API 키·실제 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀
  수정·커밋 안 함.
- **`style.css`만 수정, JS/HTML 무접촉 절대 준수** — 손 A가 B-64로
  `scraps-*.js`·`properties.js`·`utils.js` 작업 중인 것과 파일 무충돌
  확인(착수 전 `git status` 확인, 관련 없는 untracked 문서 3개만
  있었고 clean).
- 기존 미디어쿼리 분기(`@media (max-width:480px)`)·기존 디자인
  토큰만 재사용, 새 브레이크포인트·새 CSS 변수 추가 없음.

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code) — 손
  B(Codex)" 3자 협업 구조. 지시서상 B-66은 손 B(Codex) 담당으로
  표기돼 있으나 이번엔 Claude Code 세션에서 그대로 실행함(B-64
  직후 같은 세션). SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`,
  이력은 `HISTORY.md`, 백로그는 `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: ... → B-65(로그인 유지) → B-64 ①(렌더링 깨짐 진단,
  XSS 2건 발견) → **이번 세션(B-66, push 보류) — 모바일 에디터 공통
  깨짐 원인 특정·수정**. B-64와 파일 무충돌 병렬 진행(`style.css` vs
  `scraps-*.js`/`properties.js`/`utils.js`).
