# Requirements Quality Checklist: 견적서 생성 및 저장 (requirements.md)

**Purpose**: "Unit Tests for Requirements" - 명세 및 설계 문서의 품질을 검증하여 개발 중 재작업 리스크를 최소화함.
**Created**: 2026-03-18
**Author**: Antigravity

## 1. Requirement Completeness (요건 완전성)
- [x] CHK001 - 견적서 소유자(`ownerId`)가 할당되는 시점(최초 저장 시점)이 명시되어 있는가? [Resolved, Spec §Entities]
- [x] CHK002 - `SENT` 상태에서 수정을 시도할 때의 구체적인 에러 메시지나 UI 피드백 요건이 정의되어 있는가? [Resolved, Action Logic]
- [x] CHK003 - Soft Delete된 견적서를 사용자가 직접 복구하거나 영구 삭제할 수 있는 요건이 포함되어 있는가? [Resolved, Spec §FR-008: MVP 제외 확정]
- [x] CHK004 - 부가세(VAT) 토글 시, 각 블록별 설정이 견적서 전체 합계에 어떻게 합산되는지에 대한 규칙이 정의되어 있는가? [Resolved, Spec §FR-003]

## 2. Requirement Clarity (요건 명확성)
- [x] CHK005 - "정수형 처리" 시 소수점 이하 발생 금액에 대한 처리(버림) 기준이 명확히 정의되어 있는가? [Resolved, Spec §FR-003 & lib/calculations]
- [x] CHK006 - `SENT` 상태에서 "잠금 처리"가 에디터의 `readOnly` 전환 외에 제목 수정이나 블록 추가 버튼 비활성화를 모두 포함하는지 명시되어 있는가? [Resolved, Spec §FR-006]
- [x] CHK007 - 부가세 포함/별도 선택 시 UI에 표시되는 텍스트(예: "공급가액", "부가세")의 정확한 용어가 정의되어 있는가? [Resolved, UI Implemented]

## 3. Requirement Consistency (요건 일관성)
- [x] CHK008 - 클라이언트의 실시간 계산 로직과 서버의 재검증 로직이 동일한 수식(Math.floor 등)을 사용하는지 일관성이 보장되는가? [Resolved, lib/calculations 공유]
- [x] CHK009 - `totalAmount`가 DB에는 `Int`로 저장되지만, UI에서 화폐 형식(₩)으로 표시될 때의 일관된 포맷팅 규칙이 있는가? [Resolved, utils/formatCurrency]

## 4. Acceptance Criteria Quality (인수 조건 품질)
- [x] CHK010 - "성능 저하 없이" 로드되어야 한다는 기준이 구체적인 시간(1초 이내)으로 측정 가능하게 정의되어 있는가? [Resolved, Spec §SC-005]
- [x] CHK011 - "네트워크 오류" 시 로컬 스토리지에 저장되는 데이터의 유효 기간이나 동기화 시점이 정의되어 있는가? [Resolved, Spec §Edge Cases]

## 5. Scenario & Edge Case Coverage (시나리오 및 엣지 케이스)
- [x] CHK012 - 견적서의 제목이 매우 길거나 블록 내 숫자가 `Int` 범위를 초과할 경우에 대한 예외 처리 요건이 있는가? [Resolved, Spec §FR-003 implicit]
- [x] CHK013 - 상태가 `SENT` -> `ACCEPTED`로 변경될 때, 다시 `DRAFT`로 되돌릴 수 있는지(불가)에 대한 규칙이 정의되어 있는가? [Resolved, Spec §FR-006]
- [x] CHK014 - Soft Delete 처리된 견적서가 서버 API의 전체 목록 조회 시 자동으로 필터링되어야 한다는 백엔드 요건이 명시되어 있는가? [Resolved, Spec §FR-008]

## 6. Non-Functional Requirements (비기능 요건)
- [x] CHK015 - RLS 정책 적용 시, 비로그인 사용자가 공유된 링크를 통해 접근할 때의 보안 요구사항이 명확한가? [Resolved, Spec §Assumptions]
- [x] CHK016 - `JSONB` 형식의 블록 데이터 크기 제한이나 최적화 요건이 정의되어 있는가? [Resolved, Plan §6]
