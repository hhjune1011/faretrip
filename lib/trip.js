(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.Faretrip = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const cities = {
    NRT: 'TOKYO', HND: 'TOKYO', KIX: 'OSAKA', FUK: 'FUKUOKA', TPE: 'TAIPEI',
    BKK: 'BANGKOK', HKG: 'HONGKONG', SIN: 'SINGAPORE', DAD: 'DANANG'
  };
  const destinations = {
    TOKYO: { name: '도쿄', country: '일본', timezone: 'Asia/Tokyo', airportTransfer: 95, color: '#df7253', places: [
      ['센소지와 나카미세 거리', '아사쿠사', 'culture', 90, '도쿄의 오래된 사찰과 골목을 걸어보기'],
      ['스미다강 산책', '아사쿠사', 'relax', 70, '강변 풍경과 도심의 여유를 즐기는 시간'],
      ['우에노 공원', '우에노', 'relax', 90, '도시 속 큰 공원에서 쉬어가기'],
      ['아메요코 시장', '우에노', 'food', 90, '활기찬 시장에서 로컬 먹거리 탐색'],
      ['시부야 스크램블 교차로', '시부야', 'culture', 70, '도쿄를 대표하는 도심 풍경'],
      ['미야시타 파크', '시부야', 'shopping', 85, '쇼핑과 카페를 함께 즐기는 공간'],
      ['메이지 신궁', '하라주쿠', 'culture', 100, '숲길을 따라 걷는 도심 신궁'],
      ['오모테산도 거리', '하라주쿠', 'shopping', 100, '편집숍과 건축물을 둘러보기'],
      ['츠키지 장외시장', '긴자', 'food', 90, '해산물과 일본식 아침 메뉴 탐방'],
      ['긴자 거리', '긴자', 'shopping', 90, '백화점과 쇼핑 거리 구경'],
      ['신주쿠 교엔', '신주쿠', 'relax', 100, '계절마다 다른 정원 산책'],
      ['오모이데 요코초', '신주쿠', 'food', 90, '작은 식당이 모여 있는 골목 탐색'],
      ['아키하바라 전자상가', '아키하바라', 'shopping', 105, '전자기기와 서브컬처 상점 탐방'],
      ['도쿄역 마루노우치', '마루노우치', 'culture', 75, '붉은 벽돌 역사와 주변 광장']
    ]},
    OSAKA: { name: '오사카', country: '일본', timezone: 'Asia/Tokyo', airportTransfer: 85, color: '#d46b4b', places: [
      ['도톤보리 운하', '난바', 'culture', 80, '네온사인과 운하가 어우러진 거리'],
      ['구로몬 시장', '난바', 'food', 90, '오사카의 인기 시장 먹거리'],
      ['난바 쇼핑 거리', '난바', 'shopping', 90, '상점과 골목 구경'],
      ['신사이바시스지', '신사이바시', 'shopping', 100, '긴 아케이드 상점가 산책'],
      ['아메리카무라', '신사이바시', 'shopping', 75, '개성 있는 빈티지 숍 탐방'],
      ['오사카성 공원', '오사카성', 'culture', 120, '성 주변 녹지와 역사적인 풍경'],
      ['나카노시마 공원', '나카노시마', 'relax', 90, '강변 도심 공원 산책'],
      ['우메다 스카이 빌딩', '우메다', 'culture', 95, '고층에서 오사카 풍경 감상'],
      ['그랜드 프런트 오사카', '우메다', 'shopping', 90, '복합 쇼핑 공간 구경'],
      ['덴진바시스지 상점가', '덴마', 'food', 100, '현지 음식점과 긴 상점가'],
      ['스미요시 타이샤', '스미요시', 'culture', 90, '전통 신사 건축 감상'],
      ['쓰텐카쿠와 신세카이', '신세카이', 'food', 105, '레트로 거리와 구시카쓰 맛보기']
    ]},
    FUKUOKA: { name: '후쿠오카', country: '일본', timezone: 'Asia/Tokyo', airportTransfer: 45, color: '#438e88', places: [
      ['오호리 공원', '오호리', 'relax', 95, '호수를 따라 여유롭게 산책'],
      ['후쿠오카 성터', '오호리', 'culture', 90, '성터와 공원 둘러보기'],
      ['텐진 지하상가', '텐진', 'shopping', 85, '쇼핑과 카페 방문'],
      ['텐진 야타이', '텐진', 'food', 95, '포장마차 음식 즐기기'],
      ['캐널시티 하카타', '하카타', 'shopping', 100, '실내 복합쇼핑몰 구경'],
      ['하카타역 주변', '하카타', 'food', 80, '하카타 라멘과 로컬 식당 찾기'],
      ['구시다 신사', '하카타', 'culture', 70, '하카타 지역의 역사적인 신사'],
      ['나카스 강변', '나카스', 'relax', 70, '야경과 강변 풍경 감상'],
      ['모모치 해변', '모모치', 'relax', 110, '바닷가에서 쉬어가기'],
      ['후쿠오카 타워 주변', '모모치', 'culture', 80, '해변과 타워를 함께 구경']
    ]},
    TAIPEI: { name: '타이베이', country: '대만', timezone: 'Asia/Taipei', airportTransfer: 85, color: '#659679', places: [
      ['중정기념당', '중정', 'culture', 100, '넓은 광장과 건축물 구경'],
      ['융캉제 거리', '중정', 'food', 95, '딤섬과 디저트가 모인 거리'],
      ['시먼딩', '시먼', 'shopping', 110, '젊은 거리와 쇼핑 구역'],
      ['용산사', '완화', 'culture', 80, '전통 사찰 방문'],
      ['화산1914 문화창의산업원구', '중산', 'culture', 105, '전시와 디자인 상점 구경'],
      ['디화제 거리', '다퉁', 'shopping', 105, '전통 상점과 건물 탐방'],
      ['닝샤 야시장', '다퉁', 'food', 95, '현지 인기 야시장 음식'],
      ['타이베이 101 주변', '신이', 'culture', 105, '도심 랜드마크와 광장'],
      ['샹산 산책로', '신이', 'relax', 105, '도심 전망을 위한 가벼운 등산'],
      ['스린 야시장', '스린', 'food', 110, '야시장 먹거리 체험']
    ]},
    BANGKOK: { name: '방콕', country: '태국', timezone: 'Asia/Bangkok', airportTransfer: 100, color: '#bb864d', places: [
      ['왓 포', '올드타운', 'culture', 110, '방콕 대표 사원 방문'],
      ['왕궁 주변', '올드타운', 'culture', 125, '역사 중심지 탐방'],
      ['짜오프라야 강변', '올드타운', 'relax', 80, '강변 경치 감상'],
      ['카오산 로드', '올드타운', 'food', 85, '스트리트 푸드와 거리 문화'],
      ['아이콘시암', '짜오프라야', 'shopping', 100, '강변 복합쇼핑몰 방문'],
      ['왓 아룬', '짜오프라야', 'culture', 100, '강 건너 사원 구경'],
      ['시암 파라곤', '시암', 'shopping', 100, '중심가 쇼핑'],
      ['짐 톰슨 하우스', '시암', 'culture', 95, '태국식 건축과 컬렉션 감상'],
      ['차이나타운 야오와랏', '차이나타운', 'food', 105, '거리 음식 탐험'],
      ['룸피니 공원', '실롬', 'relax', 85, '도심 녹지에서 휴식']
    ]},
    HONGKONG: { name: '홍콩', country: '홍콩', timezone: 'Asia/Hong_Kong', airportTransfer: 85, color: '#b96769', places: [
      ['빅토리아 피크', '센트럴', 'culture', 130, '항구 전망 즐기기'],
      ['소호 거리', '센트럴', 'food', 95, '카페와 식당 탐방'],
      ['미드레벨 에스컬레이터', '센트럴', 'culture', 75, '도심 속 독특한 이동 경로'],
      ['PMQ', '센트럴', 'shopping', 90, '디자인 편집숍 둘러보기'],
      ['스타페리', '침사추이', 'relax', 80, '페리에서 항구 풍경 감상'],
      ['침사추이 산책로', '침사추이', 'relax', 90, '홍콩 스카이라인 감상'],
      ['K11 뮤제아', '침사추이', 'shopping', 100, '디자인 쇼핑몰 방문'],
      ['템플 스트리트 야시장', '조던', 'food', 95, '현지 야시장 방문'],
      ['몽콕 거리', '몽콕', 'shopping', 100, '시장과 쇼핑 거리 탐색'],
      ['치린 수도원', '다이아몬드힐', 'culture', 95, '조용한 전통 건축 감상']
    ]},
    SINGAPORE: { name: '싱가포르', country: '싱가포르', timezone: 'Asia/Singapore', airportTransfer: 75, color: '#46908b', places: [
      ['마리나 베이 산책로', '마리나베이', 'relax', 100, '싱가포르 야경 산책'],
      ['가든스 바이 더 베이', '마리나베이', 'culture', 130, '미래형 정원 방문'],
      ['머라이언 파크', '마리나베이', 'culture', 70, '대표 랜드마크 구경'],
      ['차이나타운 푸드 센터', '차이나타운', 'food', 95, '호커 음식 맛보기'],
      ['차이나타운 거리', '차이나타운', 'shopping', 85, '전통 상점과 골목 탐색'],
      ['내셔널 갤러리', '시티홀', 'culture', 120, '미술관 관람'],
      ['하지 레인', '캄퐁글람', 'shopping', 90, '작은 디자인 숍 탐방'],
      ['아랍 스트리트', '캄퐁글람', 'food', 90, '다양한 식문화 즐기기'],
      ['보타닉 가든', '오차드', 'relax', 125, '넓은 열대 정원 산책'],
      ['오차드 로드', '오차드', 'shopping', 100, '싱가포르 대표 쇼핑 거리']
    ]},
    DANANG: { name: '다낭', country: '베트남', timezone: 'Asia/Ho_Chi_Minh', airportTransfer: 50, color: '#6a9893', places: [
      ['미케 비치', '미케', 'relax', 120, '해변 산책과 휴식'],
      ['안트엉 카페 거리', '미케', 'food', 95, '카페와 현지 음식 탐방'],
      ['한시장', '시내', 'shopping', 95, '시장 쇼핑과 기념품 구경'],
      ['다낭 대성당', '시내', 'culture', 65, '도심 건축물 구경'],
      ['용다리', '시내', 'culture', 70, '강변 랜드마크 감상'],
      ['선짜 반도 전망대', '선짜', 'relax', 115, '해안 풍경 감상'],
      ['오행산', '오행산', 'culture', 120, '동굴과 사찰 탐방'],
      ['논느억 비치', '오행산', 'relax', 95, '상대적으로 한적한 해변'],
      ['호이안 올드타운', '호이안', 'culture', 150, '전통 도시 골목 탐방'],
      ['호이안 야시장', '호이안', 'food', 105, '등불과 먹거리 즐기기']
    ]}
  };
  function pad(x) { return String(x).padStart(2, '0'); }
  function isoDate(date) { return date.toISOString().slice(0, 10); }
  function utcDate(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const d = new Date(s + 'T00:00:00Z');
    return Number.isNaN(d.getTime()) || isoDate(d) !== s ? null : d;
  }
  function dateRange(start, end) {
    const a = utcDate(start), b = utcDate(end);
    if (!a || !b || b < a || b - a > 13 * 86400000) return null;
    const days = [];
    for (let t = a.getTime(); t <= b.getTime(); t += 86400000) days.push(isoDate(new Date(t)));
    return days;
  }
  function minutes(iso) {
    const x = /T(\d{2}):(\d{2})/.exec(iso || '');
    return x ? Number(x[1]) * 60 + Number(x[2]) : NaN;
  }
  function timeLabel(min) { return pad(Math.floor(min / 60)) + ':' + pad(min % 60); }
  function parseCity(code) { return destinations[cities[code]] || null; }
  function validateFlight(flight) {
    if (!flight || !cities[flight.destination]) return '지원하는 도착지를 선택해 주세요.';
    const a = String(flight.outboundArrival || ''), b = String(flight.returnDeparture || '');
    const days = dateRange(a.slice(0, 10), b.slice(0, 10));
    if (!days) return '여행 날짜를 확인해 주세요. 현 버전은 목적지 도착일 기준 최대 14일까지 지원합니다.';
    if (!Number.isFinite(minutes(a)) || !Number.isFinite(minutes(b))) return '도착 시각과 귀국편 출발 시각을 입력해 주세요.';
    if (days.length === 1 && minutes(b) <= minutes(a) + 210) return '현지 체류 시간이 너무 짧아 일정을 생성할 수 없습니다.';
    return null;
  }
  function pickPlaces(places, style, used, dayIndex, count) {
    const ranked = places.map((place, index) => {
      const preferred = style === 'balanced' ? 3 : (place[2] === style ? 7 : 0);
      const balance = style === 'balanced' ? (place[2] === ['culture','food','relax','shopping'][dayIndex % 4] ? 3 : 0) : 0;
      return { place, index, rank: preferred + balance - index * 0.14 };
    }).filter(x => !used.has(x.index));
    if (!ranked.length) return [];
    ranked.sort((a,b) => b.rank - a.rank);
    // Keep a few stops in the same neighbourhood where practical.
    const first = ranked[0], area = first.place[1], picked = [first];
    for (const x of ranked.slice(1)) if (picked.length < count && x.place[1] === area) picked.push(x);
    for (const x of ranked.slice(1)) if (picked.length < count && !picked.includes(x)) picked.push(x);
    picked.forEach(x => used.add(x.index));
    return picked.map(x => x.place);
  }
  function buildPlan(flight, opts) {
    const error = validateFlight(flight);
    if (error) throw new Error(error);
    const dest = parseCity(flight.destination);
    const dates = dateRange(flight.outboundArrival.slice(0,10), flight.returnDeparture.slice(0,10));
    const pace = ['slow', 'normal', 'full'].includes(opts.pace) ? opts.pace : 'normal';
    const style = ['balanced', 'culture', 'food', 'shopping', 'relax'].includes(opts.style) ? opts.style : 'balanced';
    const maxStops = {slow:2, normal:3, full:4}[pace];
    const used = new Set();
    const days = dates.map((date, dayIndex) => {
      const first = dayIndex === 0, last = dayIndex === dates.length-1;
      const arrival = first ? minutes(flight.outboundArrival) : 0;
      const departure = last ? minutes(flight.returnDeparture) : 1440;
      const start = first ? arrival + dest.airportTransfer + 55 : 570;
      const end = last ? departure - 180 : 1230;
      const items = [];
      if (first) {
        items.push({ time: timeLabel(Math.min(arrival,1439)), kind:'travel', title:'목적지 도착', area:'공항', detail:'입국 심사와 수하물 수령 후 시내 이동', duration:dest.airportTransfer });
        if (start < 1440) items.push({ time:timeLabel(Math.min(start,1439)), kind:'travel', title:'숙소 체크인 및 짐 정리', area:'숙소', detail:'체크인 가능 시각을 숙소에 확인해 주세요.', duration:40 });
      }
      let cursor = Math.max(start, 570);
      if (cursor < end - 65) {
        let slots = Math.min(maxStops, Math.max(0, Math.floor((end - cursor + 25) / 130)));
        if (first || last) slots = Math.min(slots, maxStops - 1);
        const chosen = pickPlaces(dest.places, style, used, dayIndex, slots);
        chosen.forEach((p, i) => {
          if (i && cursor + p[3] > end) return;
          items.push({time: timeLabel(cursor),kind:p[2],title:p[0],area:p[1],detail:p[4],duration:p[3]});
          cursor += p[3] + 25;
        });
      }
      if (!last && cursor + 80 < end) {
        items.push({time:timeLabel(Math.min(cursor,1230)),kind:'food',title:'자유 식사 · 현지 산책',area:'숙소 인근',detail:'식사 장소와 쉬는 시간은 자유롭게 조정하세요.',duration:80});
      }
      if (last) {
        const airportAt = Math.max(0, departure - 180);
        items.push({time:timeLabel(airportAt),kind:'travel',title:'공항 도착 목표 시각',area:'공항',detail:'국제선 기준 출발 3시간 전 도착을 권장하는 계획용 기준입니다. 항공사 안내를 우선하세요.',duration:0});
        items.push({time:timeLabel(departure),kind:'travel',title:'귀국편 출발',area:'공항',detail:'탑승 수속과 출국 심사 시간을 고려하세요.',duration:0});
      }
      return {date,day:dayIndex+1,first,last,items,notes: (first ? '비행 후 이동 시간을 고려해 일정을 가볍게 구성했어요.' : last ? '공항 이동에 충분한 시간을 확보한 날이에요.' : '방문지 사이 이동시간은 약 25분으로 가정했어요.')};
    });
    return {city:dest.name,country:dest.country,timezone:dest.timezone,airport:flight.destination,dates,days,flight,options:{pace,style},createdAt:new Date().toISOString(),assumptions:['도시별 추천 장소를 기반으로 한 자동 초안이며, 실제 영업시간과 휴무일은 확인되지 않았습니다.','장소 간 25분의 개략 이동시간을 사용하며 실시간 교통이나 숙소 위치는 반영하지 않습니다.','기재된 관광지는 티켓 구매 및 예약이 완료된 것이 아닙니다.']};
  }
  return { destinations, cities, parseCity, dateRange, minutes, validateFlight, buildPlan };
});
