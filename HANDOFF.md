# HANDOFF — B-58 모달 z-index 버그 수정 (2026-07-13)

## 1. 목표
`BACKLOG.md`의 B-58 처리. 프로필·자산 임포트·수집함 편집·가져오기 등
`.modal` 클래스를 쓰는 모든 공용 모달이 sticky 탭바(`.apptabs`)에 제목이
가려지던 버그 수정.

## 2. 완료
**커밋 완료, push까지 완료.**

```
e9d3531 fix: B-58 모달 z-index를 탭바 위로(1000→1100)
```

- **수정 파일**: `style.css` 단 1개, 834번 줄 `z-index` 값만 `1000`→`1100`
  (다른 속성 무변경). JS·스키마 무접촉.
- **근인**: `.apptabs`(`position:sticky`, `z-index:1001`) > `.modal`
  (`position:fixed`, `z-index:1000`)이라 모달이 탭바 뒤에 깔림. 모바일
  `#complexDetailModal`은 이미 `1100`으로 개별 우회해뒀었지만 base
  `.modal`은 방치돼 있었던 것.
- **검증**(Playwright, 로컬 정적 서버+게스트모드):
  - computed z-index: `.modal`=1100, `.apptabs`=1001 확인.
  - 프로필 모달 열어 `elementFromPoint`로 상단 지점이 모달 내부임을
    확인 + 스크린샷으로 "프로필 & 일정 설정" 제목이 탭바 위로 온전히
    보임을 육안 확인(데스크톱 1400px + 모바일 390px 둘 다).
  - `assetAiModal`·`scEditModal`·`importModal` 3개 모두 동일하게
    최상단 렌더 확인.
  - `.status-picker`(2000)·`.login-overlay`(2000)는 여전히 모달보다
    위임을 CSS 소스·computed 값으로 확인 — 무회귀.
  - CSS 중괄호 균형·`git diff --check` 통과.
  - 임시 설치한 `playwright`(`npm install --no-save`)와 검증용 임시
    파일·서버는 세션 종료 전 전부 삭제. `package.json` 변경 없음.

## 3. 미완 / 다음 단계
- 없음 — B-58 자체는 완결.
- BACKLOG.md 기준 "매물 영역 외 전면 파킹, B-58만 유일 예외"였던 상태 —
  B-58 완료로 이 파킹 예외도 소진됨. 다음 비-매물 작업은 커맨드센터의
  새 지시 필요(매물 영역 항목은 계속 착수 가능).

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- `js/nav.js` 무접촉 원칙은 B-56에서의 일회성 예외 이후 다시 기본으로
  복귀 — 이번 B-58도 `style.css`만 건드림, nav.js 무관.

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → B-12 관련 다수 작업 → ... →
  B-28 → B-18 → B-38 → B-39(`d943fd5`) → B-30(`4ee58cd`) →
  B-56(`21cb4b9`) → B-57(`2b79d16`) → **이번 세션(B-58, `e9d3531`,
  push 완료)**.
