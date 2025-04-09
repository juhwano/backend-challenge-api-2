# 아이샵케어 Full Stack Developer (Node.js) 사전 과제

구매 상담 정보를 받아서 저장하고, 내부 Admin에서 검색/필터 조회하는 기능을 제공하는 API 서버 어플리케이션을 구현해주세요.

## 📌 제약 사항

- 🟦 **TypeScript**로 구현해 주세요.
- 🧱 기존 `ishopcare-preview-test` 레포의 코드 베이스를 활용하되, 자유롭게 수정하셔도 괜찮습니다. 단, **NestJS 아키텍처**는 가능하면 적극 활용해 주세요.
- 🤔 위 조건 외에는 **개인 판단**에 따라 효율적인 방식으로 구현해 주세요. **모든 지원자 분들께 동일한 경험을 제공해 드리기 위해, 개별적인 과제 관련 문의 사항은 답변 드리기 어려움을 양해 부탁 드립니다.**

## ⚙️ 과제 템플릿 초기 세팅 방법

- 📦 ~~`pnpm install` 를 통해 의존성 패키지를 설치합니다.~~ -> SQLite3 바인딩 파일 오류 발생되므로 `npm install`로 의존성 설치할 것
- 🔧 본 과제 템플릿은 **Node.js 20** 버전에서 작성되었습니다. `Node 20` 이상 버전을 사용하길 권장드립니다.
- 🧬 `pnpm schema:generate` 실행 시 `sqlite3` 파일이 생성됩니다. `inquiry-entity.ts` 코드를 수정한 경우, 해당 명령어로 스키마를 업데이트해주세요.
- 🚀 `pnpm start:dev` 를 통해 서버 및 배치 작업을 실행시킵니다. http://localhost:8081/api-docs에 접속하면 swagger 문서를 확인할 수 있습니다.

## 📦 과제 템플릿 구조

```txt
📦src
 ┣ 📂api
 ┃ ┣ 📂internal : 내부 Admin 용 API
 ┃ ┃ ┣ 📜internal-api.controller.ts
 ┃ ┃ ┣ 📜internal-api.module.ts
 ┃ ┃ ┗ 📜internal-api.service.ts
 ┃ ┗ 📂public : 구매 상담 정보 입력 페이지용 Public API
 ┃ ┃ ┣ 📜public-api.controller.ts
 ┃ ┃ ┣ 📜public-api.module.ts
 ┃ ┃ ┗ 📜public-api.service.ts
 ┣ 📂mikro-orm : DB 관련 모듈
 ┃ ┣ 📂entities
 ┃ ┃ ┗ 📂inquiry
 ┃ ┃ ┃ ┣ 📜inquiry-entity.ts
 ┃ ┃ ┃ ┣ 📜inquiry-repository.module.ts
 ┃ ┃ ┃ ┗ 📜inquiry-repository.ts
 ┃ ┣ 📂scripts
 ┃ ┃ ┗ 📜schema-generator.ts
 ┃ ┗ 📜const.ts
 ┣ 📜app.module.ts
 ┗ 📜main.ts
```

## 과제 요구사항

- Mission : 구매 상담 정보를 받아서 저장하고, 내부 Admin에서 검색/필터 조회하는 기능을 제공하는 API 서버 어플리케이션을 구현해주세요.

  - 아래 항목 중 "✅ 필수 사항" 부터 구현해주시면 좋습니다. 필수 사항 마무리 후 "🟡 선택 사항" 까지 고려해서 개발해주시면 좋습니다.

- Step 1. 구매 상담 등록 API

  - https://ishopcare.co.kr/event/front01 페이지를 위한 API를 구현해주신다고 생각하시면 됩니다.
  - ✅ `src/api/public` 디렉토리에서 작업을 시작해주시면 됩니다.
  - ✅ 페이지의 입력 값들을 참고해서 `[POST] /public/inquiry` API의 body를 정의해주세요. 입력 값을 저장할 수 있도록 적합한 필드명을 정의해서 `mikro-orm/entities/inquiry` 내부를 구현해주세요.
  - ✅ 제출한 코드에서 API 호출시 DB에 구매 상담 문의가 정상적으로 저장되는지 여부가 가장 중요합니다.
  - 🟡 유효하지 않은 전화번호인 경우 `400 Bad Request` 오류가 뜨도록 해주세요. 유효한 전화번호를 판별하는 로직을 가능한 디테일하게 구현해주세요. (참고 : https://namu.wiki/w/010#s-3)
  - 🟡 전화번호 유효성을 검사하는 로직을 함수로 추출하고 test case를 작성해주세요.

- Step 2. 내부 Admin 구매 상담 조회 API

  - Step 1을 통해 저장한 구매 상담 내역을 내부 Admin에서 조회하기 위한 API를 구현해주신다고 생각하시면 됩니다.
  - ✅ `src/api/internal` 디렉토리에서 작업을 시작해주시면 됩니다.
  - ✅ 전화번호로 검색할 수 있도록 `[GET] /interal/inquiries` API의 query를 정의해주세요. 저장된 내역을 검색해서 조회할 수 있도록 `mikro-orm/entities/inquiry` 내부를 구현해주세요.
  - ✅ 제출한 코드에서 API 호출시 전화번호를 기반으로 적합한 내역만 조회되는지 여부가 가장 중요합니다. (ex: 010-1234-1234 번호만 조회)
  - 🟡 구매 상담 내역이 등록된 일자를 기반으로 필터링 조회할 수 있는 기능을 구현해주세요. (ex: 2025-03-01 ~ 2025-03-31 사이에 등록된 구매 상담 내역만 조회)
  - 🟡 구매 상담 내역이 수만~수십만건으로 수량이 늘어난다고 가정할 때 쿼리를 최적화할 수 있는 다양한 방법을 고민하고 적용해주세요.

## 제출 방법

- node_modules,dist 폴더를 삭제하시고 해당 프로젝트를 압축해 주세요.
- 압축된 파일이름은 다음과 같은 예시대로 작성해 주세요. (지원자명\_제출일자.zip)
  - 홍길동\_20230101.zip
