# FleetSense 17 페이지 감사 리포트

**감사 기준**: Figma 원본 스크린샷 vs 현재 preview + 코드. 각 페이지는 구조/데이터/시각 요소를 Figma와 대조.

**공통 전제**: headless preview의 rAF throttling으로 차트 mount 애니메이션이 스크린샷에서 정지 상태로 보이는 현상은 실제 Chrome에서는 정상 작동하므로 **버그로 계산하지 않음**.

---

## `/utilization/overview`
- Figma node: `273:6077`
- 상태: ⚠️ 경미
- 차이점:
  - MainNav 우측에 **Settings(톱니)/Bell(알림) 아이콘 누락** (Search + Leave만 있음) — Figma 아이콘 추출 필요
  - Fleet Composition Donut: Figma 대비 slice 순서는 맞음, 색상도 맞음 ✅
  - Pagination "1 2 … 10"로 축약, Figma는 "1 2 3 … 8 9 10" — `buildPageList` 로직이 current=1일 때 이른 ellipsis
- 예상 수정 시간: 30분 (아이콘 추출 제외)

## `/utilization/activity`
- Figma node: `273:6512`
- 상태: ⚠️ 경미
- 차이점:
  - Area 차트는 DOM 상 정상이지만 **실제 Chrome에서만 600ms 후 보임** (preview 스크린샷 빈 차트 — rAF throttling 이슈)
  - Zone Activity Metrics 테이블의 "Avg Stay" 회색 main 값만 표시 — Figma는 추가 컬럼(추정: Avg Wait)에 빨간 delta 값이 있음 → 4→5 컬럼 추가 고려
  - Heatmap 셀 간격/크기 Figma 대비 미세하게 다를 수 있음 (1198px → `fr` 단위 균등 분배로 실제는 가변)
- 예상 수정 시간: 25분

## `/utilization/vehicle-deep-dive/[id]`
- Figma node: `273:7025`
- 상태: ⚠️ 경미
- 차이점:
  - **Time Breakdown 도넛 색상 Figma와 다름** — Figma: "Driving" brand blue 지배 / 현재: green 지배 (FleetCompositionDonut의 SLICE_COLOR 라벨 매핑 탓). 전용 palette variant 분리 필요
  - VehicleInfoCard 제목 "Demo - 01" 하단 구분선 위치 OK, 다만 Figma는 divider가 더 연한 색일 수 있음 (border-secondary로 통일됨)
  - Dual Area 차트의 series 색상은 맞지만 **첫 포인트가 left-margin에 잘려서 렌더**되는 Recharts 미니 버그 — 실제 Chrome에서도 영향
  - MetricCallout 컴포넌트 미사용 (기존 overview에서만 쓰임 — dead import 없음 ✓)
- 예상 수정 시간: 40분 (도넛 palette 분리 포함)

## `/utilization/group-comparison`
- Figma node: `273:7566`
- 상태: ✅ 일치
- 차이점:
  - Groups Performance Trends 아래 2 heatmap 색 (Central brand / South purple) 완벽 일치
  - GapKpiCard bar 색상 매핑 OK
  - 경미: Heatmap 범례가 brand palette만 표시 (purple도 보여주려면 범례 2개 추가 고려)
- 예상 수정 시간: 15분

---

## `/efficiency/overview`
- Figma node: `2119:11011`
- 상태: ⚠️ 경미
- 차이점:
  - **Efficiency Distribution Status 차트**: Figma는 11 bucket (0-9..91-100), 현재는 10 bucket (0-9~90-100 — 90-100 구간만)
  - Mini metrics 4개 vs Figma 4개 ✓
  - Drivers Performance 테이블 컬럼 비율 OK
  - Score 진행바 색 (Optimal/Moderate/Low status) 매핑 OK
  - Pagination 동일 이슈 (축약 형태)
- 예상 수정 시간: 20분

## `/efficiency/activity`
- Figma node: `286:17419`
- 상태: ✅ 일치
- 차이점:
  - 4 KPI / 2 column charts (Daily Avg Score + Daily Exception Duration) / Exception Heatmap 구조 맞음
  - Daily Exception Trends 우측 4 MiniMetrics 높이 분산 (flex col justify-between) — Figma와 매칭
- 예상 수정 시간: 10분 (미세 조정)

## `/efficiency/driver-deep-dive/[id]`
- Figma node: `303:17605`
- 상태: ⚠️ 경미
- 차이점:
  - Time Breakdown 도넛: vehicle-deep-dive와 같은 color palette 이슈 (🔴 Driving green vs Figma blue)
  - "Selected Driver" dropdown trigger width 320px 적용 OK
  - Loss Segments list — InfoIcon 5×5로 괜찮음, Figma는 좀 더 subtle
  - DriverInfoCard 내부 "Truck 006/Van 006" tags 스타일 OK
- 예상 수정 시간: 30분 (도넛 공통 이슈)

## `/efficiency/group-comparison`
- Figma node: `286:17856`
- 상태: ⚠️ 경미
- 차이점:
  - **Score Distribution Comparison**: Figma는 grouped bar (blue + purple 각 bucket에 2개), 현재는 UtilizationColumnChart의 single-series (category별 하나의 막대) → GroupedColumnChart로 교체 필요
  - Daily Avg Score area chart 2 series 색상 mapping 순서 개선 필요 (현재 south purple 배경 + central blue 위에)
  - Legend 라벨 "Efficiency/Idle/RPM/Cruise" 4개 있지만 실제 series는 2개 → 오해 유발
- 예상 수정 시간: 35분

---

## `/compliance/overview`
- Figma node: `359:15946`
- 상태: ⚠️ 경미
- 차이점:
  - **"Unassigned (x10)" 라인 오버레이 누락** — Figma는 grouped bar 위에 회색 라인 overlay (line chart)가 같이 그려짐, 현재는 bar만
  - ComplianceStatusCard의 "View →" 링크가 Figma와 동일 ✓
  - Priority Actions Panel의 카드 색상 (red/orange) Figma 일치
  - At-Risk table의 "Investigate" 버튼 Figma의 outline small button과 매칭
- 예상 수정 시간: 40분 (line overlay 구현)

## `/compliance/csa`
- Figma node: `370:7923`
- 상태: 🔴 심각
- 차이점:
  - **US Map placeholder** — Figma는 실제 US 지도 + hotspot markers / 현재는 회색 박스 + 텍스트 placeholder. 지도 라이브러리 필요 (Mapbox/Leaflet) 혹은 SVG map export
  - Inspection Results / Violation Analysis 2 차트 모두 dummy data로 **같은 shape** 으로 렌더 — 서로 다른 패턴이어야 함
  - Detailed Records 좌측 필터 탭 스타일 OK, 활성 상태는 회색 bg
  - violation type pills (Crash/HOS/Vehicle/Driver/Hazmat) 색 매핑은 tones로 처리 ✓
  - Left-side record filter 카운트는 Figma의 `6/2/6/6` 일치
- 예상 수정 시간: 90분 (맵 통합 제외) / 맵 포함 시 4시간+

## `/compliance/maintenance`
- Figma node: `377:12674`
- 상태: ⚠️ 경미
- 차이점:
  - Reported Defects 스택바가 `DailyUtilizationStackedBar` 재활용 (optimal/under/inactive/over 키 사용) — Figma는 Critical/Major/Minor 3-stack, 현재는 4-stack으로 over 공간에 빈 카테고리
  - DVIR Quality Trend grouped bars (blue Pre + purple Post) Figma 완벽 매칭 ✅
  - Inspection & Defect Detail 테이블 10-row OK
- 예상 수정 시간: 20분 (스택바 3-category 전용 variant 혹은 데이터 정리)

## `/compliance/hos`
- Figma node: `377:11554`
- 상태: ✅ 일치
- 차이점:
  - Sub-nav 라벨 "House of Service" Figma와 일치 ✓
  - "380 Pending" 빨간 뱃지 우측 제목 옆 위치 OK
  - Table의 Date cell이 avatar + 이름 + "ID - XXX" 2줄 표시 — Figma 일치
  - Last Update 빨간 timestamp OK
  - Violations 컬럼 count pill (숫자 + red 배경) OK
- 예상 수정 시간: 5분 (미세 margin)

---

## `/forms/submissions`
- Figma node: `331:14463`
- 상태: ✅ 일치
- 차이점:
  - AlertBanner + 3 KPI + 복잡한 필터 row + 10-row 테이블 구조 맞음
  - Form Type 컬러 pill (Fuel red / Inspection blue / Trip gray / Safety red / Maintenance orange) 매핑 확인
  - Status pill (Pending orange / In Review blue / Approved green) OK
  - "+ Create" 버튼 blue CTA OK
  - 10행 중 Figma 동일 데이터 반영 (John Martinez, Priya Sandhu, ...)
- 예상 수정 시간: 10분 (폰트 weight 미세 조정)

## `/forms/templates`
- Figma node: `349:15724`
- 상태: ⚠️ 경미
- 차이점:
  - Quick Access 4개 카드 (Accident/Fuel/Maintenance/Safety) 제목/설명 Figma와 일치
  - **"Used X ago" 위치**: Figma는 description 바로 아래 (더 붙어있음), 현재는 `mt-auto pt-lg`로 바닥 정렬 → 카드 높이 균일해져 시각적 OK지만 Figma는 약간 다름
  - All Templates 테이블 Linked Rules 컬럼이 파란 underlined 숫자 링크로 표시 ✓
  - Actions 컬럼: Figma는 Request + trash + edit 3-icon 세트 / 현재는 Request 버튼만 (trash + edit 아이콘 미추출)
- 예상 수정 시간: 30분 (아이콘 추출 포함)

## `/forms/requests`
- Figma node: `335:18481`
- 상태: ⚠️ 경미
- 차이점:
  - 3 KPI / Requested Forms (4) 테이블 구조 맞음
  - **"Time To Due" pill**: Figma는 "3days"/"5days" 빨간 배경 pill / 현재 동일 tone 적용 ✓
  - Due Date 빨간 timestamp OK
  - Source pill이 Figma에는 "In Review" / "Pending" / "Flagged" 로 되어 있는데 실제로는 Status와 중복된 것 같음 → Figma mock 자체의 불명확성
  - Assigned To 컬럼 Avatar + 이름 OK
- 예상 수정 시간: 15분

---

## `/deep-dive/drivers`
- Figma node: `406:11391`
- 상태: ⚠️ 경미
- 차이점:
  - **Podium3Card**: 1위 Carlos R. 블루 그라데이션 pedestal 적용 / 2위 silver / 3위 bronze (pink/red 50 tint) — Figma와 톤 차이 있음. 실측으로는 2위 gray-100, 3위 error-50 → OK
  - Podium 아래 "2,890 PTS · $87" 반투명 pill Figma와 비슷
  - Most Improved Driver 카드: Jordan Lee avatar center, Badge 18% green — 매칭
  - Attention Required Drivers "9" 빨강 아이콘 옆 숫자 OK
  - Leaderboard 테이블의 rank delta 화살표 (up 초록 / down 빨강) Figma 일치 ✅
  - Attention Required 테이블의 빨간 progress bar 적용 ✓
  - Safety Score pill: Figma는 Improvement 옆에 별도 pill이지만 "95%"/"91%"처럼 high 수치도 risk-high (red) tone — 색 논리 부정확할 수 있음
- 예상 수정 시간: 25분

## `/deep-dive/lytx-safety`
- Figma node: `395:11824`
- 상태: ⚠️ 경미
- 차이점:
  - Side filter (New 6 / In Review 2 / Coaching 6 / Resolved 6) 좌측 컬럼 + 10행 테이블 구조 맞음
  - Trigger pill 다양한 tones (Hard Brake red / Distraction purple / Speeding orange / FLEX Smart Trigger blue / Collision red / Rolling Stop orange / Drowsiness purple / Following Distance orange) 색상 맵핑 OK
  - Match code (VIN-like) pill 회색 moderate tone 사용 ✓
  - **"▶ Play" 버튼**: 유니코드 ▶ 문자로 대체 (Figma는 play 아이콘) → 실제 Figma icon export 필요
  - Status dot 색 (new blue / in-review blue / coaching purple / resolved gray) side filter 인라인 로직에서 하드코딩
- 예상 수정 시간: 20분 (아이콘 추출 포함)
