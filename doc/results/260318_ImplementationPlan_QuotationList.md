Date: 2026-03-18 10:10:00
Author: Antigravity

# 구현 계획서: 견적서 목록 대시보드 및 조회 모드 최적화

## 1. 목표
사용자가 발행한 모든 견적서를 한눈에 확인할 수 있는 대시보드를 구축하고, 발행 완료된 견적서의 조회 화면을 공식 문서 형태로 최적화하여 사용자 경험을 개선합니다.

## 2. 주요 변경 사항

### 2.1. 데이터 레이어 (Server Actions)
- `src/app/actions/quotation.ts` 내 `getQuotations` 함수 추가
  - `deletedAt: null`인 견적서 목록을 `createdAt` 역순으로 조회
  - `where: { deletedAt: null }` 필터 적용

### 2.2. 파일 구조 재설계
- **기존**: `/` (편집기), `/quotation/[id]` (편집기)
- **변경**:
  - `/` (대시보드/목록)
  - `/quotation/new/page.tsx` (신규 작성 - 기존 `/` 로직 이동)
  - `/quotation/[id]/page.tsx` (기존 유지, 조회 모드 강화)
  - `src/components/editor/QuotationEditorContainer.tsx` 추출: 기존 `Home` 컴포넌트의 로직을 공통 컴포넌트로 분리하여 신규/수정 페이지에서 재사용

### 2.3. 상세 페이지 (`QuotationEditorContainer`) UI 최적화
- `isEditable()`이 `false`인 경우 (상태가 `DRAFT`가 아님):
  - 좌측 '블록 추가' 사이드바 숨김
  - 에디터 캔버스를 화면 중앙으로 정렬 (`mx-auto` 적용 및 최대 너비 조정)
  - 상단 툴바에서 '저장', '삭제' 등의 버튼을 상태에 맞게 노출/비노출 처리

### 2.4. 대시보드 페이지 구현 (`src/app/page.tsx`)
- 전체 견적서 개수 및 상태별 요약 정보 표시
- 견적서 목록 테이블/그리드
  - 컬럼: 제목, 상태(Badge), 총액, 작성일, 관리 버튼(보기/수정)
- '신규 견적서 작성' 버튼 (Link to `/quotation/new`)

## 3. 상세 구현 단계

### Step 1: Server Action 추가
- `getQuotations` 함수 구현 및 익스포트

### Step 2: 컴포넌트 추출 및 경로 이동
- `src/app/page.tsx` 내용을 `src/components/editor/QuotationEditorContainer.tsx`로 이동
- `src/app/quotation/new/page.tsx` 생성 및 `QuotationEditorContainer` 연결
- `src/app/quotation/[id]/QuotationEditorWrapper.tsx` 수정 (Container 사용)

### Step 3: 대시보드 페이지 작성
- `src/app/page.tsx`에 견적서 목록 UI 구현
- Lucide 아이콘 및 Shadcn UI (Card, Badge, Button, Table) 활용

### Step 4: 조회 모드 스타일링
- `QuotationEditorContainer` 내에서 `editable` 상태에 따른 레이아웃 분기 처리
- '발행 완료' 견적서에 대한 시각적 잠금 표시

## 4. 검증 계획
1. **목록 조회**: 메인 페이지 접속 시 저장된 견적서 목록이 정상적으로 출력되는지 확인.
2. **신규 작성**: '신규 작성' 버튼 클릭 시 빈 편집기 화면으로 이동하고 저장 후 목록에 반영되는지 확인.
3. **조회 모드**: `SENT` 상태인 견적서 접속 시 사이드바가 사라지고 편집이 불가능한지 확인.
4. **상태 전환**: 대시보드에서 각 견적서의 상태(DRAFT, SENT, ACCEPTED)가 정확히 표시되는지 확인.

## 5. 기대 효과
- 사용자가 본인의 작업 내역을 체계적으로 관리 가능.
- 발행된 견적서에 대한 가독성 및 전문성 향상.
- 서비스의 전체적인 네비게이션 구조 확립.
