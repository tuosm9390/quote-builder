# Task List: 견적서 생성 및 저장 기능 (Create and save quotation)

## 1. 데이터베이스 및 스키마 작업
- [x] **DB-001**: `prisma/schema.prisma` 파일 수정 (ownerId, deletedAt, totalAmount(Int) 추가)
- [ ] **DB-002**: Prisma 마이그레이션 실행 (`pnpm prisma migrate dev`) - 환경 확인 필요
- [x] **DB-003**: Prisma Client 재생성 (`pnpm prisma generate`)

## 2. 서버 액션 고도화
- [x] **SA-001**: `src/lib/calculations.ts` 생성 및 서버 측 총액 검증 로직 구현
- [x] **SA-002**: `src/app/actions/quotation.ts` 수정 (saveQuotation에 서버 측 검증 로직 추가)
- [x] **SA-003**: `updateStatus` 및 `softDeleteQuotation` 서버 액션 구현

## 3. 프론트엔드 상태 관리 및 UI 수정
- [x] **FE-001**: `src/store/useQuotationStore.ts` 확장 (status, vatIncluded, deletedAt 상태 추가)
- [x] **FE-002**: `src/components/editor/PricingTableBlock.tsx` 수정 (부가세 토글 UI 및 정수 기반 계산 로직 반영)
- [x] **FE-003**: `src/app/page.tsx` 헤더 및 에디터 래퍼 수정 (상태 변경 버튼 추가 및 편집 잠금 로직 적용)

## 4. 검증 및 테스트
- [ ] **VT-001**: 신규 견적서 생성 및 저장 테스트 (Acceptance Scenario 1)
- [ ] **VT-002**: 부가세 토글 및 가격표 실시간 재계산 테스트 (Acceptance Scenario 2)
- [ ] **VT-003**: 상태 변경(`SENT`) 후 편집 잠금 기능 확인 (FR-006)
- [ ] **VT-004**: 견적서 삭제(Soft Delete) 시 목록에서 제외되는지 확인 (FR-008)
