Date: 2026-03-18 15:40:00
Author: Antigravity

# Implementation Plan: 견적서 생성 및 저장 기능 (Create and save quotation)

## 1. 개요
견적서의 제목, 블록 데이터, 총액 및 상태를 관리하고 영구 저장하기 위한 기술적 설계를 정의함. (구현 완료 단계)

## 2. 데이터베이스 설계 (Prisma) - [완료]
`Quotation` 모델 확장을 통해 소유권, 상태, 버전 관리를 지원함.

```prisma
model Quotation {
  id          String    @id @default(uuid())
  title       String
  blocks      Json      @default("[]") 
  totalAmount Int       @default(0)    // FR-003: 정수형 처리
  status      String    @default("DRAFT")
  version     Int       @default(1)    // FR-009: 낙관적 잠금 (진행 중)
  ownerId     String?                 // FR-007: 소유자 기반 권한
  deletedAt   DateTime?               // FR-008: Soft Delete
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## 3. API 및 서버 액션 (Next.js Server Actions) - [완료/고도화 중]
- `saveQuotation`: 견적서 생성/업데이트 및 서버 측 총액 검증 (`calculations.ts` 활용).
- `updateStatus`: 수동 상태 전이 (`DRAFT` -> `SENT` -> `ACCEPTED`). [완료]
- `softDeleteQuotation`: `deletedAt` 필드 업데이트를 통한 삭제 처리. [완료]
- **TBD**: `version` 필드를 활용한 낙관적 잠금 충돌 처리 로직 추가.

## 4. 프론트엔드 구현 전략 (React & BlockNote) - [완료]
- **상태 관리**: `useQuotationStore` (Zustand)를 통한 상태 전역 관리 및 `isEditable` 헬퍼 구현.
- **가격표 블록 (PricingTableBlock)**:
  - 부가세 토글 버튼 및 상세 내역(공급가액, VAT) 표시.
  - 정수 기반 계산 로직 적용.
- **에디터 락(Lock)**: `status`가 `SENT` 이상일 때 에디터 및 사이드바 편집 권한 차단.

## 5. 단계별 실행 계획
1.  **DB 스키마 업데이트**: [완료]
2.  **서버 로직 강화**: [완료] (낙관적 잠금 고도화 남음)
3.  **UI 컴포넌트 고도화**: [완료]
4.  **상태 관리 로직 구현**: [완료]
5.  **낙관적 잠금 적용**: [진행 중] 명세 세션에서 추가된 버전 관리 로직 구현.

## 6. 위험 요소 및 대책
- **데이터 불일치**: `lib/calculations.ts`를 공유하여 클라이언트/서버 계산 일치시킴. [해결]
- **성능**: 100개 블록 기준 1초 이내 로딩 목표 설정. [모니터링 중]
