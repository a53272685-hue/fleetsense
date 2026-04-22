# FleetSense 작업 진행 상황

## 개요

`/Users/leeminju/fleetsense` — Next.js 14 + TypeScript strict + Tailwind v4 (@theme) 기반 플릿 매니지먼트 대시보드 포트폴리오. 목표는 **99% 픽셀 정확도 Figma-to-code fidelity**.

**Figma 파일**
- Product mock: `iYJr2l7vrwzAa5VcRjbucS` (FS_Product)
- Design system: `VeKcCTBokX7wng9f8JMIBd` (FS_DesignSystem)

---

## ✅ 완료된 작업

### 프로젝트 기반
- [x] Next.js 14 + TypeScript strict + Tailwind v4 @theme 셋업
- [x] 프로젝트 폴더 구조 (`src/app/(dashboard)/`, `src/components/`, `src/lib/`)
- [x] `.claude/config.json`, `.claude/launch.json`
- [x] `CLAUDE.md` 규칙 문서화 (Figma 기반, 토큰 전용, 외부 라이브러리 금지)

### 디자인 토큰 (`globals.css`)
- [x] 컬러 토큰 (text/bg/border/fg/utility) 전체 @theme 레이어화
- [x] Typography (display/text-xs~xl, line-height 오버라이드)
- [x] Spacing (xxs/xs/sm/md/lg/xl/2xl/3xl/4xl/5xl/6xl)
- [x] Radius (xs/sm/md/lg/xl/2xl + rounded-full)
- [x] Shadows (xs ~ 3xl)
- [x] **Motion tokens**: `--ease-out-fast`, `--ease-out-standard`, `--ease-in-out`, `--duration-instant/fast/base/slow/slower`
- [x] Keyframes: `fs-fade-slide-up`, `fs-scale-pop`
- [x] Utility classes: `.fs-animate-enter`, `.fs-animate-pop`
- [x] Global `@media (prefers-reduced-motion: reduce)` 블록

### 아이콘 (54개)
- [x] Figma DesignSystem에서 SVG 전수 추출 → `src/components/icons/*.svg`
- [x] `currentColor`로 변환, `width/height` 제거
- [x] `scripts/build-icons.mjs` — kebab→Pascal + "Icon" suffix 자동 생성 (`index.tsx`)
- [x] `scripts/strip-kpi-bg.mjs` — kpi-sm/md/neutral 아이콘의 내장 `<rect>` 배경 제거

### 컴포넌트 (src/components/)

**UI 원시** (`src/components/ui/`):
- [x] `Badge`, `FilterChip`, `KpiIconBadge`, `MetricsCard`, `AlertBanner`, `PageHeader`, `CardPanel`, `ChartLegend`, `MetricCallout`, `TabBar`, `MiniMetric`, `Avatar`, `ProgressBar`, `StatusPill`, `NumberBadge`, `TableSectionHeader`, `Pagination`
- [x] **`DotsMenu`** — Figma "Chart dropdown" 스펙 기반 드롭다운 (open/close, 외부 클릭/ESC, scale-pop 애니메이션)

**차트** (`src/components/charts/`):
- [x] `UtilizationColumnChart` (Asset Density by Score)
- [x] `FleetCompositionDonut` (Fleet Composition Status)
- [x] `DailyUtilizationStackedBar` (Daily Utilization Status)
- [x] `chartTooltipStyle.ts` — 공통 툴팁 스타일 (Figma 다크 테마)

**테이블** (`src/components/tables/`):
- [x] `TableHeader`, `TableCell`, `TableRow` (group-hover 패턴), `DataTable`, `FleetVehiclesTable`

**레이아웃** (`src/components/layout/`):
- [x] `MainNav` — Top bar (브랜드 + 5 nav items + 검색 + Leave), `usePathname` 기반 active 감지
- [x] `SubNav` — 탭 bar (Overview/Activity/Vehicle Deep Dive/Group Compare/Insights), brand underline 전환

### utilization/overview 페이지 (273:6077) — 완전 구현

- [x] **PageHeader + FilterChip group** (Last 7 days / Jan 1-7 / Filters)
- [x] **AlertBanner** (52 vehicles below 50%...)
- [x] **KPI row (3 카드)** — Fleet Utilization / Active Assets / Avg Daily Runtime
- [x] **Asset Usage Analysis**
  - Asset Density by Score (column chart, 11 bars, radius 4px top, 50% average line **뒤에**)
  - Fleet Composition Status (donut 520 total)
- [x] **Asset Utilization Trends**
  - Daily Utilization Status (stacked bar, segment radius 2px, 세그먼트 간 갭, 커스텀 다크 툴팁)
  - 3 MiniMetric stack (`justify-between`으로 Daily Util 카드와 높이 정렬)
- [x] **Fleet Vehicles 테이블** (10 vehicles, 11 columns, 가로 스크롤 제거, 헤더 좌/우 border 없음)
- [x] **Pagination** (`Rows per page` + 페이지 번호 + Previous/Next)

### utilization/overview 인터랙션 — 완전 구현

- [x] **KPI 카드 hover** — `translateY(-1px)` + `shadow-lg`, 150ms ease-out-fast
- [x] **KPI dots 드롭다운** — 클릭 시 3개 메뉴 (Download CSV / Export PDF / Share Link), scale-pop 200ms
- [x] **차트 mount 애니메이션** — bars가 baseline에서 자람 (600ms, ease-out), donut은 제외 (Recharts v3 버그 회피)
- [x] **차트 hover 툴팁** — Figma 다크 스펙 (black 80% + white text + radius-xs + shadow-xs + custom content for Daily Util)
- [x] **차트 cursor 하이라이트** — Daily Util에 brand 파란 세로 밴드
- [x] **테이블 행 hover bg** — `group-hover:bg-bg-primary-hover` 패턴 (셀 단위로 전환)
- [x] **테이블 행 클릭 → router.push** `/utilization/vehicle-deep-dive/[id]` + `active:scale-[0.99]`
- [x] **키보드 접근성** — 행에 `role="button"`, `tabIndex=0`, `Enter/Space` 활성화, `focus-visible:ring`
- [x] **FilterChip 인터랙션** — `hover:bg-bg-primary-hover` + `active:scale-[0.98]` + focus ring
- [x] **페이지 진입 애니메이션** — 6 섹션이 fade+slide-up (400ms) with 60ms stagger

### 네비게이션 인터랙션

- [x] **MainNav active state** — 현재 섹션이 brand blue (아이콘 + 텍스트)
- [x] **MainNav hover** — 회색 → 진한 회색 전환
- [x] **SubNav active state** — brand blue 텍스트 + **2px brand underline** 하단
- [x] **SubNav hover** — 부드러운 색 전환
- [x] **Tab 라벨 Figma 스펙 교정** — "Vehicle Deep Dive", "Group Compare", "Insights" 추가

### 커밋 & 문서
- [x] `f9a534b feat: utilization/overview page with interactions` (116 files, +5188 / −773)

---

## 🧭 다음 작업: utilization/activity 페이지 (273:6512)

### Figma 분석 (캡처 확인 완료)

**전체 구조** (동일한 shell 사용):
1. MainNav + SubNav (Activity active) ← **재사용**
2. PageHeader: "Utilization Activity" + 우측 필터 그룹 ← **재사용**
3. KPI Row: **4 cards** (overview는 3개였음)
   - Engine Hours (3.90h, +4.3%)
   - Total Fleet Miles (110.36, -2.7%)
   - Total Fleet Trips (51.34, +6.1%)
   - Total Idle Time (1.1h, +3.9%)
4. **Asset Activity Trends**: 2개 Area Line Chart side-by-side
   - Daily Fleet Miles (Jan 1-14)
   - Daily Fleet Trips (Jan 1-14)
5. **Activity breakdown**: 
   - Zone Activity Distribution (좌, ProgressBar 리스트 4개)
   - Zone Activity Metrics (우, 테이블) — Customer Sites/Distribution Centers/Maintenance Facilities/Job Sites
6. **Activity Heatmap**: 7×24 그리드 (요일 × 시간), 파란 농도 스케일, 범례 (Density Low ~ High)

### 재사용 가능한 컴포넌트 (overview에서 그대로)

| 컴포넌트 | 사용처 |
|---------|--------|
| `MainNav` / `SubNav` | 상단 nav (layout 자동 적용) |
| `PageHeader` + `FilterChip` | 제목 + 날짜 필터 |
| `MetricsCard` + `KpiIconBadge` + `Badge` | 4개 KPI 카드 |
| `CardPanel` | 모든 섹션 컨테이너 |
| `DotsMenu` | 각 카드 상단 `⋮` |
| `ProgressBar` | Zone Activity Distribution |
| `TableHeader` / `TableCell` / `TableRow` / `DataTable` | Zone Activity Metrics |
| Motion 토큰 + `fs-animate-enter` | 페이지 entry stagger |

### 신규로 만들 요소

| 요소 | 구현 전략 |
|------|-----------|
| **AreaLineChart** (Daily Fleet Miles/Trips) | Recharts `AreaChart` + `Area` (linearGradient fill) |
| **ZoneActivityList** | `CardPanel` 내부에 label + ProgressBar + % 한 줄씩 반복 (기존 ProgressBar 조합) |
| **ZoneMetricsTable** | 기존 `DataTable` 구조 재사용, 컬럼 정의만 신규 (Zone / Visits / Duration / Avg Stay) |
| **ActivityHeatmap** | CSS grid 7행 × 24열, 각 셀은 `bg-utility-brand-{50~700}` 토큰 농도, 범례는 별도 컴포넌트 |
| 데이터 색상 강조 (빨간 "2.4h" 등) | 기존 `text-text-error-primary` 토큰 활용 |

### KPI 아이콘 매칭 (기존 54개 중 재사용 가능)

| KPI | Figma 아이콘 이름 | 기존 파일 |
|-----|------------------|-----------|
| Engine Hours | truck | `kpi-sm-truck.svg` ✓ |
| Total Fleet Miles | route/exchange | `kpi-exchange.svg` ✓ (또는 신규 추출 필요) |
| Total Fleet Trips | flag/trip | `kpi-sm-trip.svg` ✓ |
| Total Idle Time | clock | `kpi-sm-time.svg` ✓ |

### 작업 순서 제안

1. Figma `get_design_context`로 273:6512 전체 스펙 수집 (각 섹션 실측)
2. **AreaLineChart 컴포넌트 신설** (두 개 미리 제작)
3. **ActivityHeatmap 컴포넌트 신설** (CSS grid 기반)
4. **page.tsx 조립** — KPI 4개 → 차트 2개 → 분배+테이블 → 히트맵
5. Mock 데이터 (Jan 1-14 시계열 + 4 zone + 7×24 heatmap density)
6. 섹션별 Preview 검증
7. 페이지 entry stagger 적용
8. Figma 비교 차이점 리포트 → 수정

### ⚠️ 미해결 사항 (spawn된 task)

- **Extract 3 dropdown icons from Figma** — `download-01` / `file-06` / `share-04` 아이콘 추출 후 `DotsMenu` 메뉴에 아이콘 추가
- **Settings / Bell 아이콘** — MainNav 우측에 추가하려면 Figma에서 추출 필요

### 이후 페이지들

- `utilization/vehicle-deep-dive` (현재 placeholder 라우팅만 있음)
- `utilization/group-comparison` (placeholder)
- `utilization/insights` (라우팅 정의됨, placeholder 필요)
