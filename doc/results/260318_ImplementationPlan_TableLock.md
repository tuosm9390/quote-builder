Date: 2026-03-18 12:00:00
Author: Antigravity

# 구현 계획서: 발행된 견적서의 테이블 수정 잠금 강화

## 1. 문제 분석
발행된 견적서(`SENT`, `ACCEPTED`) 조회 시 전체 페이지는 읽기 전용으로 보이지만, 테이블 블록(PricingTable) 내부의 입력 필드와 버튼들이 여전히 활성화되어 있어 수정이 가능한 상태임. 이는 에디터 인스턴스의 `isEditable` 속성이 UI 상태와 동기화되지 않았기 때문임.

## 2. 해결 방안

### 2.1. 에디터 인스턴스 속성 동기화 (`Editor.tsx`)
- `editable` 프롭이 변경될 때 `editor.isEditable` 값을 수동으로 업데이트하는 `useEffect` 추가.

### 2.2. 테이블 블록 상호작용 차단 (`PricingTableBlock.tsx`)
- 모든 버튼(`Button`, `ActionIcon`, `Switch`)에 `disabled={!editor.isEditable}` 속성 적용.
- 읽기 전용 모드(`!editor.isEditable`)일 때 '열 추가', '행 추가', '삭제' 버튼 등이 아예 보이지 않도록 조건부 렌더링 또는 스타일 수정.
- `TextInput`의 `readOnly` 속성이 `editor.isEditable` 변화에 즉각 반응하도록 보장.

## 3. 상세 작업 단계

### Step 1: `Editor.tsx` 수정
- `useEffect`를 사용하여 `editor.isEditable = editable` 코드 삽입.

### Step 2: `PricingTableBlock.tsx` 수정
- 상단 '부가세 포함' 스위치 및 '열 추가' 버튼에 `disabled` 및 숨김 처리.
- 테이블 헤더의 '열 삭제' 아이콘 숨김 처리.
- 각 행의 '삭제' 버튼 숨김 처리.
- 하단 '행 추가하기' 버튼 숨김 처리.

## 4. 검증 계획
1. **DRAFT 상태 확인**: 견적서 작성 시에는 모든 테이블 조작 기능이 정상 작동하는지 확인.
2. **SENT/ACCEPTED 상태 확인**: 대시보드에서 발행된 견적서 진입 시, 테이블 내부의 어떤 요소도 클릭하거나 수정할 수 없는지 확인 (버튼 소멸 및 입력창 잠금).
