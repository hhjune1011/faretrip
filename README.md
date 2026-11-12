# faretrip. — 항공권에서 시작하는 여행 일정

항공권의 **현지 도착 시각 / 현지 귀국편 출발 시각**을 바탕으로 추천 관광지를 날짜별로 배치하는 여행 일정 웹앱입니다. HTML, CSS, Vanilla JavaScript, Node.js(Serverless)로 작성했습니다.

## 할 수 있는 일

- 내가 찾은 특가 항공권의 시각과 가격을 직접 입력해 여행 일정을 생성합니다. **API 키 없이 바로 동작합니다.**
- 여행 스타일(관광, 음식, 쇼핑, 휴식, 균형)과 하루 일정 밀도를 선택합니다.
- 첫날 입국·공항 이동·숙소 정리, 마지막 날 출국 최소 3시간 전 공항 도착 목표를 일정에 반영합니다.
- 일정 텍스트 복사, 브라우저 로컬 저장, 인쇄 및 브라우저의 PDF 저장, 관광지별 지도 검색을 지원합니다.
- 선택 기능: Amadeus Flight Offers Search API로 왕복 항공편 검색. 키가 없는 경우 오류 대신 직접 입력을 이용할 수 있습니다.

## GitHub에 올리는 방법

1. 이 ZIP을 압축 해제합니다.
2. **압축 해제된 폴더 안의 파일과 `api`, `lib`, `tests` 디렉터리**를 GitHub 저장소 최상위에 그대로 업로드합니다. `faretrip-web` 폴더 하나만 통째로 올려 경로가 중첩되지 않게 주의하세요.
3. 아래와 같은 구조인지 확인합니다.

```
index.html
style.css
script.js
lib/trip.js
api/flights.js
package.json
vercel.json
.env.example
.gitignore
README.md
tests/trip.test.js
```

4. `index.html`을 직접 열면 **수동 입력 기능**을 사용할 수 있습니다. API 검색은 Vercel 배포에서 작동합니다.

## Vercel 배포

1. Vercel → Add New → Project → GitHub 저장소를 선택합니다.
2. Framework Preset: **Other**, Root Directory: **./** 로 설정합니다.
3. Build Command 및 Output Directory를 **따로 지정하지 않습니다.**
4. Deploy하면 됩니다. **직접 입력 기능만 쓸 경우 환경변수는 필요하지 않습니다.**
5. Amadeus 항공편 검색을 추가하려면 Vercel의 Settings → Environment Variables에 아래 키를 넣고 다시 배포합니다.

| Name | Value |
|---|---|
| `AMADEUS_CLIENT_ID` | Amadeus 개발자 앱의 API Key |
| `AMADEUS_CLIENT_SECRET` | Amadeus 개발자 앱의 API Secret |
| `AMADEUS_ENV` | `test`(기본) 또는 `production` |

보안을 위해 API 키/Secret은 **Vercel 서버 함수 `api/flights.js`에서만** 사용합니다. GitHub 저장소, 브라우저 JS, 스크린샷에 넣지 마세요. `.env.example`만 공개할 수 있습니다.

## API 요금/제약 및 사실성

- **Skyscanner Travel API**는 파트너 계약을 요구하며 학생 개인 비상업 프로젝트는 일반적으로 승인 대상이 아닙니다.
- **Amadeus Flight Offers Search API**는 인증키가 있어야 합니다. `AMADEUS_ENV=test`는 시험용 응답이므로 실시간 판매 가능한 특가 항공권이 아닙니다.
- Amadeus 생산 환경의 가격도 공급사 커버리지에 한계가 있고, 항공사 사이트의 실제 최저가나 할인율을 보장하지 않습니다.
- 이 서비스는 예약·결제·자동 항공권 구매 기능을 제공하지 않습니다.
- 항공권 검색 결과 중 가격순으로 정렬하지만 '특가'로 단정하지 않습니다. 직접 찾은 특가 항공권을 입력해 여행 일정을 만드는 것이 기본 사용 방식입니다.
- 8개 도시(도쿄, 오사카, 후쿠오카, 타이베이, 방콕, 홍콩, 싱가포르, 다낭)의 장소 목록은 프로젝트에 포함된 **편집된 정적 데이터**입니다. 실시간 영업시간이나 리뷰, 예약 상태를 확인하지 않습니다.
- 각 여행지의 이동 및 공항 소요시간은 대략적인 계획 수치입니다. 실시간 교통이나 방문지 운영시간, 호텔 위치에 따른 차이는 이용자가 확인해야 합니다.
- 예시 항공편 버튼은 **가상 항공사와 예시 가격**을 채웁니다. 실제 판매 가격으로 오해하지 마세요.

## 개발 / 테스트

Node.js 20 이상에서:

```bash
npm test
```

필요한 NPM 의존성이 없어 `npm install`은 필수 작업이 아닙니다. 브라우저에서 정적 파일을 열어 직접 입력 UI를 점검할 수 있고, 서버리스 API까지 개발하려면 Vercel CLI의 `vercel dev`를 이용할 수 있습니다.

## 디자인

원색에 가까운 인공지능 도구 UI 대신 여행 브랜드 웹사이트 스타일을 목표로 했습니다. 크림색/세이지/코랄 팔레트, 에디토리얼 활자, 탑승권 모티브, 반응형 모바일 UI를 사용합니다. 외부 유료 이미지 소스나 빌드 프레임워크가 필요하지 않습니다.

## 근거 자료

- [Amadeus Flight Offers Search](https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search)
- [Amadeus Flight API documentation](https://github.com/amadeus4dev/developer-guides/blob/master/docs/resources/flights.md)
- [Skyscanner Travel API partner criteria](https://www.partners.skyscanner.net/contact/travel-api)
