Date: 2026-03-18 14:05:00
Author: Antigravity

# 260318 PDF 내보내기 최적화 구현 계획서

## 1. 개요

PDF 저장 시 편집 UI를 배제하고 본문 내용만 포함되도록 시스템을 개선함.

## 2. 세부 구현 단계

### 단계 1: 글로벌 스타일 추가 (src/app/globals.css)

- PDF 저장 시 일시적으로 적용될 클래스 정의.
- `.pdf-export-mode` 가 부모 요소에 있을 때 특정 요소들을 숨기는 스타일 추가.
  ```css
  .pdf-export-mode .pdf-hidden {
    display: none !important;
  }
  ```

### 단계 2: PricingTableBlock 컴포넌트 수정 (src/components/editor/PricingTableBlock.tsx)

- `editor.isEditable` 값을 확인하여 다음과 같이 조건부 렌더링 적용:
  - `isEditable`이 `false`일 때:
    - '열 추가', '행 추가' 버튼 숨김 (`.pdf-hidden` 클래스 적용 또는 조건부 제거).
    - `Trash2` 아이콘 제거.
    - `TextInput` 대신 일반 텍스트 표시 또는 `variant="unstyled"` 고정 및 `readOnly` 적용.
    - 테이블 합계 섹션의 스타일을 문서용으로 조정 (배경색 제거 등).

### 단계 3: PDF 내보내기 로직 개선 (src/lib/export-pdf.ts)

- `html2canvas`의 `onclone` 옵션 내에서 다음과 같은 작업 수행:
  - 타겟 엘리먼트에 `.pdf-export-mode` 클래스 강제 주입.
  - 편집용 플레이스홀더(`placeholder`) 텍스트가 노출되지 않도록 처리.
  - 불필요한 테두리 및 섀도우 제거.

### 단계 4: 에디터 래퍼 컴포넌트 수정 (src/app/quotation/[id]/QuotationEditorWrapper.tsx)

- PDF 내보내기 시작 시 `editable` 상태를 강제로 `false`로 변경했다가 완료 후 복구하는 로직 추가 (필요 시).

## 3. 검증 계획

- **정상 작동**: PDF 저장 버튼 클릭 시 PDF가 생성됨.
- **UI 제거**: 생성된 PDF 파일에 '행 추가', '열 추가', '삭제 아이콘'이 보이지 않음.
- **데이터 보존**: 입력된 모든 텍스트와 가격 데이터가 정확하게 PDF에 표시됨.
- **회귀 테스트**: PDF 생성 후 다시 에디터로 돌아왔을 때 정상적으로 편집이 가능함.
