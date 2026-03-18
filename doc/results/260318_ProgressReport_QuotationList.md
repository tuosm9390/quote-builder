Date: 2026-03-18 11:00:00
Author: Antigravity

# 진행 보고서: 견적서 목록 및 조회 최적화 완료

## 1. 작업 개요
사용자가 발행한 견적서 정보를 효과적으로 관리하고 확인할 수 있도록 시스템 구조를 개선하고 대시보드 및 상세 조회 모드를 구현하였습니다.

## 2. 완료된 작업 항목

### 2.1. 대시보드(목록) 페이지 구현
- **경로**: `/` (기존 편집기에서 대시보드로 전환)
- **기능**:
  - 견적서 상태별(DRAFT, SENT, ACCEPTED) 요약 통계 제공.
  - 견적서 목록 카드 UI (제목, 상태, 총액, 작성일 표시).
  - '새 견적서 작성' 버튼을 통한 워크플로우 분리.

### 2.2. 견적서 편집/조회 모드 통합 및 최적화
- **공통 컴포넌트 추출**: `QuotationEditorContainer`를 통해 신규 작성 및 기존 수정/조회 로직 통합.
- **조회 모드(Read-only) 강화**: 
  - `status !== 'DRAFT'`인 경우 사이드바 제거 및 중앙 정렬 레이아웃 적용.
  - 상단 안내 배너 추가 ("발행 완료된 견적서는 수정할 수 없습니다").
  - `status`에 따른 상단 툴바 버튼(저장/삭제 vs 수락 완료) 동적 렌더링.

### 2.3. 시스템 기반 강화
- **Server Actions**: `getQuotations` 추가로 데이터 조회 로직 보완.
- **Global UI**: `RootLayout`에 `Toaster`를 배치하여 전역 알림 시스템 구축.
- **날짜 포맷팅**: `Intl.DateTimeFormat`을 사용하여 외부 라이브러리 의존성 없이 표준 날짜 형식 적용.

## 3. 변경된 파일 목록
- `src/app/actions/quotation.ts`: `getQuotations` 추가.
- `src/app/layout.tsx`: 전역 `Toaster` 및 메타데이터 추가.
- `src/app/page.tsx`: 대시보드 페이지로 전면 개편.
- `src/app/quotation/new/page.tsx`: 신규 작성 페이지 신설.
- `src/app/quotation/[id]/QuotationEditorWrapper.tsx`: 공통 컨테이너 사용하도록 수정.
- `src/components/editor/QuotationEditorContainer.tsx`: 편집/조회 통합 로직 추출.

## 4. 향후 권장 사항
- **검색 및 필터**: 대시보드 상단의 검색 바에 실제 검색 로직(Server Action) 연결.
- **상태 관리**: `REJECTED` 상태에 대한 처리 및 대시보드 표시 추가.
- **공유 기능**: 외부 고객용 공유 링크(Public URL) 생성 기능 검토.
