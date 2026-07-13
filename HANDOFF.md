# HANDOFF — B-48 레거시 "기존(미정리) 매물" UI 은퇴 (2026-07-13)

## 1. 목표
`BACKLOG.md`의 B-48 처리. 단지 이관 완료(E-01) 후에도 매물탭 좌측 단지 카드 아래에
"기존(미정리) 매물 N" 토글 + 상태 탭칩 + 레거시 목록이 그대로 남아 공간을 잠식하던
문제 — 단지가 하나라도 있으면 레거시 UI 일체를 숨기되, 단지 0(미마이그레이션) 경로의
"기존 매물을 단지로 정리" 유도는 그대로 유지하는 것이 목표.

## 2. 완료
**커밋·push 완료.**

```
886d490 fix: B-48 단지 이관 완료 후 레거시 "기존(미정리) 매물" UI 은퇴
```

`renderComplexes()`(`js/properties.js`)의 `state.complexes.length>0` 분기에서, 기존엔
토글 버튼(`legacyToggleWrap`)은 항상 노출하고 목록(`legacyWrap`)만 `legacyExpanded`
상태에 따라 보이던 것을, `legacyExpanded` 값과 무관하게 **둘 다 무조건 `display:none`**
으로 변경. `state.complexes.length===0`(미마이그레이션) 분기는 손대지 않아 `legacyWrap`
이 "기존 매물을 단지로 정리" CTA와 함께 유일한 진입점으로 계속 동작. `properties[]`/
`renderList()`/`renderTabs()` 로직과 ⋯메뉴의 "레거시 내보내기"(백업 수단)는 전혀 삭제
안 함 — 완전 삭제는 B-05에서 별도 진행.

### 검증 방법
`node --check`/`git diff --check` 통과. Playwright로 데스크톱(1400×900)에서:
- `state.complexes=[]`(GUEST_STATE 기본 레거시 3건) 상태: 토글은 숨김, `legacyWrap`은
  마이그레이션 CTA+상태 탭칩+목록과 함께 정상 노출 — 미마이그레이션 경로 무회귀.
- 가짜 단지 10건 주입(이관 완료 시뮬레이션): 토글·목록 둘 다 `display:none`.
- `renderTabs`/`renderList` 함수와 `#tabs`/`#list` DOM이 여전히 존재 — 로직 삭제 없음.
- 미마이그레이션 상태에서 `legacyExpanded`를 수동으로 펼친 뒤 단지를 추가해도 여전히
  둘 다 숨겨짐(무조건 숨김 로직이 상태와 무관하게 동작함) 확인.
- 모바일은 기존에 이미 `@media(max-width:899.98px){#legacyToggleWrap,#legacyWrap{
  display:none}}`로 완전히 숨겨져 있었음을 재확인(이번 변경과 무관), 스크린샷으로
  지도뷰/리스트뷰 무회귀 확인.
- 임시 설치한 `playwright`는 `npm install --no-save` → `npm uninstall`로 제거, 테스트
  스크립트·임시 서버·스크린샷은 세션 종료 전 삭제.

## 3. 미완 / 다음 단계
- 실기기 시각 검증 필요(로컬 정적 서버+게스트모드+Playwright 합성 데이터로만 확인).
- **B-05(레거시 `properties[]` 데이터 + 죽은코드 완전 삭제)는 이번 B-48(UI 은퇴)의
  후속 조건이 충족됐으므로 착수 가능** — BACKLOG.md에 "B-48 선행"으로 명시돼 있었음.
  단, `properties[]`=이관 원본 유일 백업이라는 경고가 있으니 레거시 내보내기로 실제
  백업 확인 후 진행 권장(커맨드센터 판단).

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js 무접촉** — 이번 수정은 `properties.js` 단일 파일.
- 데이터·죽은코드는 지시대로 전혀 삭제하지 않음(`renderList`/`renderTabs`/`properties[]`/
  레거시 내보내기 모두 보존) — 화면 노출(`display`)만 조건부로 바꿈.

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → 배포 후 하드닝 3건 → B-12 관련 다수 작업 →
  B-26+B-35(저장 안내 정합성 + 매물탭 필터 그룹 칩 바) → B-36(좌측 리스트 자체 스크롤,
  `4ff752a`) → B-47(상단 슬림화, `da38aad`) → **이번 세션(B-48, `886d490`, push 완료)**.
