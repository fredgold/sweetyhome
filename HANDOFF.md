# HANDOFF — QA 여백 수정 + 로고 통일 + 지도 API 전면 교체 (2026-07-11)

## 1. 목표
- `QA_2026-07-11.md` 기반 PC 반응형 여백 수정 3건
- 로그인/헤더 로고 배경 통일
- 지도 SDK를 Leaflet+OSM에서 네이버 지도로, 지오코딩을 카카오에서 네이버 Geocoding으로 전면 교체

## 2. 완료
**전 범위 완료 + 커밋 8개 + push까지 끝남. 미완 구현 없음.**

`origin/master`에 fast-forward push 완료 (HEAD: `f1bdfbb`):
```
bf041e9 style: .wrap 최대폭 상향으로 넓은 화면 여백 축소
6796a28 fix: 매물 검색 placeholder 잘림 — 문구 축약
4d59dc6 fix: 대시보드 여정 노드 트랙 전체 균등 분산
7072690 fix: 로그인 로고 배경을 헤더 로고와 통일
d019004 feat: 지도 SDK를 Leaflet에서 네이버 지도로 교체
68bafa4 feat: 지오코딩을 카카오에서 네이버 Geocoding으로 교체
490d671 docs: 지도 스택 문서를 네이버 기준으로 갱신
f1bdfbb fix: 네이버 지도 Client ID를 실제 Maps 애플리케이션 값으로 교체
```

파일별 실제 변경 내용:
- **style.css**: `.wrap` max-width 980→1160px. `.leaflet-popup-content`→`.route-popup`(커스텀 스타일 — InfoWindow 기본 chrome 끄고 배경·보더·그림자 직접 지정해 대체). `.prop-marker`/`.route-pin`은 앵커 좌표를 Leaflet과 동일하게 맞춰서 CSS 자체는 변경 없음. `.login-mark`에 헤더 배지와 동일한 크림 배경(`--line9-wash`) 추가.
- **index.html**: 매물 통합검색 placeholder 축약. 로그인 로고 SVG 하이라이트 색 헤더와 통일(`#F4ECD8`→`#FFFFFF`). Leaflet CDN `<link>`/`<script>` 제거 → 네이버 지도 스크립트 태그(`ncpKeyId=pmy9a5h2ma`)로 교체.
- **js/nav.js**: 여정 타임라인 `cols=Math.max(4,steps.length)` → `cols=steps.length` — 강제 최소 4트랙 제거, 실제 노드 수만큼만 트랙 생성해 트랙 전체에 균등 분산.
- **js/properties.js**: `waitLeaflet`→`waitNaverMaps`로 개명. 지도 3개 인스턴스(`overview`/`formMapObj`/`editMapObj`) 전부 `naver.maps.*` API로 전환(마커·폴리라인·InfoWindow·임장 루트 전체 재작성). `geocode()`의 Nominatim(OSM) 폴백 제거.
- **api/geocode.js**: 카카오 로컬 검색 → 네이버 Geocoding API(`map-geocode/v2/geocode`)로 전면 재작성. env var `KAKAO_REST_KEY`→`NAVER_MAPS_CLIENT_ID`+`NAVER_MAPS_CLIENT_SECRET`.
- **CLAUDE.md**: 지도 스택 문서 1줄 갱신(SSOT 최신화).
- **HISTORY.md**: `2026-07-11` 날짜 섹션 추가 + "현재 기술 스택"/"환경변수 목록" 표의 지도 관련 행 갱신.

검증: `node --check` 전체 통과, `git diff --check` 통과. 배포 후 `/v3/auth` 실제 호출 200 OK(NCP 도메인 인증 통과, `apiKeyInfo:"apiKey:map/webApiGroup"` 확인) + 사용자 실브라우저에서 매물탭 지도 렌더링·정상 동작 확인 완료.

### 배포 중 발견·해결한 이슈
사용자가 처음 준 네이버 Client ID(`dimlur4m3t`)는 NCP **"AI·NAVER API"의 Search Trend**용으로 발급된 것이라 Maps 도메인 인증이 401 남. **Maps 전용 Application을 새로 만들어야 했고**, 그 안에서도 Dynamic Map과 Geocoding을 각각 별도 상품으로 신청해야 함(하나만 체크하면 `/v3/auth`가 500 — 에러 메시지가 권한 문제라고 명확히 알려주지 않아 헷갈리기 쉬움). 최종 정상 Client ID: `pmy9a5h2ma` (Vercel env var `NAVER_MAPS_CLIENT_ID`와 `index.html` 스크립트 태그 양쪽에 반영됨, Secret은 Vercel에만 존재).

## 3. 미완
구현 자체는 없음. 실사용 중 확인이 필요한 항목만 남음:
- 네이버 Geocoding은 정식 주소 변환 방식이라 카카오 로컬 검색과 달리 **단지명만 입력하면 "위치 자동 찾기"가 결과 안 나올 수 있음** — 실사용하면서 관찰 필요, 문제되면 카카오 폴백 재도입 여부 논의
- `QA_2026-07-11.md`의 보류 항목(매물 카드 리스트 `max-height` 뷰포트 높이 의존, 심각도 낮음)은 이번 범위에서 제외 — 그대로 남아있음

## 4. 다음 단계
1. 실사용하면서 단지명 검색 지오코딩 실패 케이스가 실제로 나오는지 관찰
2. 필요하면 `QA_2026-07-11.md` 보류 항목 별도로 처리

## 5. 주의점
- PIN·API 키·실제 금액 데이터는 이 문서 어디에도 기록 안 함(보안 제약 준수) — 네이버 Client Secret도 기록 안 함, Vercel 환경변수로만 존재
- `js/properties.js`의 지도 관련 코드는 이제 전량 `naver.maps.*` 기반. Leaflet 문법(`L.*`) 흔적 없음 — 과거 커밋(P-01 등) 참고 시 그때는 Leaflet이었다는 점 헷갈리지 말 것
- `naver.maps.LatLng`의 `lat()`/`lng()`는 **메서드**(함수 호출 필요), 프로퍼티 아님 — 관련 코드 수정 시 이 부분에서 실수하기 쉬움
- **매 작업(커밋 단위) 완료 후 이 문서를 그 세션 기준으로 갱신하는 것이 이제부터 항상 지켜야 할 규칙**(사용자 명시적 요청, 2026-07-11)

## 6. 컨텍스트
- 이 레포는 "머리(커맨드 센터, 코드 미수정) — 손 A(Claude Code, 나) — 손 B(Codex)" 3자 협업 구조. SSOT는 `CLAUDE.md`, 실행 규칙은 `AGENTS.md`, 이력은 `HISTORY.md`.
- P-01(매물탭 리디자인) 세션은 이전에 완료·검증까지 끝난 상태였고, 이번 세션은 그 위에 QA 여백 수정 + 지도 API 전면 교체를 이어서 진행함.
- 지도 마이그레이션 배경지식은 Claude 개인 auto-memory `project_naver_maps_migration.md`에도 기록돼 있음(세션 간 Claude 자신의 기억용, 이 문서와는 별개).
