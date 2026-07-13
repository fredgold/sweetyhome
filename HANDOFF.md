# HANDOFF — B-28 숫자 3상태(주차·관리비) 값/미확인/해당없음 구분 (2026-07-13)

## 1. 목표
`BACKLOG.md`의 B-28 처리(지시서 기반, 커맨드센터가 범위 확정: 주차+관리비만).
부정확한 `0`이 평가·안전Gate(B-27 선행 작업)를 오염시키지 않도록,
`complexes[].parking`(신규)·`listings[].managementFee`(기존)에 "값 있음/미확인/
해당없음" 3상태를 도입하는 것이 목표. `households`/`yearBuilt`/`deposit`/`area`는
명시적으로 범위 밖(0이 자연발생하지 않아 `null`=미확인으로 충분).

## 2. 완료
**커밋 완료. push는 지시서에 명시가 없어 보류 — 필요 시 알려주면 push.**

```
bb3eccc feat: B-28 숫자 3상태(주차·관리비) 값/미확인/해당없음 구분
```

- **스키마**(`js/state.js`): `complexes[].parking`+`parkingState`,
  `listings[].managementFeeState` 신규(기존 `managementFee` 필드명·단위 무변경).
  `applyGuards()`에 `complexes`/`listings` 전용 정규화 추가 — 기존엔 배열
  존재 여부만 보정하고 개별 필드는 전혀 정규화하지 않던 갭을 함께 발견·수정.
  단지·매물 생성부 3곳씩(붙여넣기/시트 임포트/레거시 마이그레이션) 전부 새
  필드 동반 추가.
- **파싱**(`js/properties.js` `parseNaver()`): 기존 "세대당 X대"/"관리비 N만원"
  정규식 매치를 memo 텍스트 생성 용도에 더해 `r.parking`/`r.managementFee`로도
  구조화 캡처. `tempParking`/`tempManagementFee`(`tempChecks`와 동일 패턴)로
  저장 시점까지 전달.
- **UI**: 재사용 가능한 3상태 세그먼트 컨트롤(`triStateHTML()`)을 신설해 단지
  상세의 주차와 매물 행의 관리비 양쪽에서 공유. `#complexDetailModal`에 위임
  리스너 하나씩만 추가(`data-tri`/`data-lid`로 대상 판정). 관리비 0원은 "0만원
  (포함)"으로 미확인과 시각 구분. 새 CSS 파일 없이 기존 토큰만 재사용.

### 검증 방법
`node --check`(state.js/properties.js)/CSS 중괄호 균형/`index.html` div 개폐
균형/`git diff --check` 통과. Playwright로:
- **applyGuards 라운드트립**: `managementFee`만 있고 상태 필드 없는 listing →
  `'known'` 자동 승격. `parking` 필드 자체가 없는 레거시 complex →
  `null`/`'unknown'` 보정. 기존 필드명·값 무변경 확인.
- **parseNaver**: 주차·관리비 포함 샘플 → 구조화 값 캡처 + 기존 memo bits
  텍스트도 그대로 생성(회귀 없음). 매치 없는 샘플 → `undefined`(unknown 유지).
- **3상태 UI**(주차·관리비 둘 다): [값] 클릭 시 0으로 시작+캡션 갱신, 숫자
  입력 시 값 반영, [미확인]/[해당없음] 클릭 시 값 `null`+입력 비활성화, 캡션이
  세 상태 모두 명확히 구분되는 문구로 표시됨을 확인. **값=0과 미확인이
  렌더·저장 양쪽에서 구분됨을 실제로 확인**(이번 작업의 핵심 목표).
- **보안 가드**: 관리비 입력에 음수(-5)를 넣으면 `parseFloat+isNaN||v<0` 가드가
  거부해 이전 값이 유지됨을 실제로 확인.
- 스크린샷으로 두 세그먼트 컨트롤이 기존 UI와 시각적으로 자연스럽게 통합됨을
  확인(레이아웃 깨짐 없음, 골드 활성 세그먼트).
- 임시 설치한 `playwright`는 `npm install --no-save` → `npm uninstall`로 제거,
  테스트 스크립트·임시 서버·스크린샷은 세션 종료 전 삭제.

## 3. 미완 / 다음 단계
- **push 안 함** — 지시서에 push 지시가 없어 커밋까지만 완료. 필요하면 요청해
  주세요.
- B-27(안전Gate)이 이번 B-28의 후속 작업으로 대기 중 — `parking`/`managementFee`
  의 `known`/`unknown`/`na` 상태를 실제 Gate 판정 로직에서 어떻게 소비할지는
  B-27에서 설계.
- 주차·관리비 값은 현재 단지 상세 모달/매물 행에서만 편집 가능 — 단지 카드
  요약(`#complexSection`의 카드)이나 지도 마커 팝업에는 노출하지 않음(지시서
  범위 밖으로 판단, 필요하면 별도 검토).
- 실기기 시각 검증 필요(로컬 정적 서버+게스트모드+Playwright 합성 데이터로만
  확인).

## 4. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함.
- **BACKLOG.md는 커맨드센터 소유(읽기 전용)** — 이번 세션에서도 전혀 수정·커밋 안 함.
- **js/nav.js 무접촉** — 지시서대로 `state.js`/`properties.js`/`index.html`/
  `style.css` 4개 파일만 수정.
- `households`/`yearBuilt`/`deposit`/`area`는 의도적으로 손대지 않음(지시서
  명시 범위 제외) — 이후 세션에서 실수로 건드리지 않도록 주의.

## 5. 컨텍스트
- 이 레포는 "머리(커맨드센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업
  구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`, 백로그는
  `BACKLOG.md`(커맨드센터 전용).
- B-28은 "CRM + 안전Gate 핵심(P0)" 그룹의 첫 단계(B-28 → B-27+B-40 → B-37 → B-39
  → B-38)로, BACKLOG.md에 "지시서 발행(2026-07-13)"으로 명시된 손 A 전용 작업.
- 직전 세션들: v5 단지·매물 2계층 전환(E-01) → B-12 관련 다수 작업 → B-26+B-35 →
  B-36 → B-47 → B-48 → B-44①/② → B-49 → B-46 → B-52 → B-50 → B-51(`093a67e`) →
  **이번 세션(B-28, `bb3eccc`, 커밋 완료·push 보류)**.
