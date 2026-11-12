'use strict';
const VALID = /^[A-Z]{3}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const currency = 'KRW';
const API_HOST = process.env.AMADEUS_ENV === 'production' ? 'https://api.amadeus.com' : 'https://test.api.amadeus.com';
const CONFIGURED = Boolean(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET);

async function jsonFetch(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {...options, signal:controller.signal});
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const issue = Array.isArray(data.errors) ? data.errors[0] : null;
      const e = new Error(issue?.detail || issue?.title || '항공권 API 요청 실패');
      e.httpStatus = response.status;
      throw e;
    }
    return data;
  } finally { clearTimeout(timeout); }
}
function tidyOffer(offer, carriers) {
  const outbound = offer.itineraries?.[0]?.segments || [];
  const inbound = offer.itineraries?.[1]?.segments || [];
  if (!outbound.length || !inbound.length) return null;
  const first = outbound[0], last = outbound[outbound.length - 1], backFirst = inbound[0], backLast = inbound[inbound.length-1];
  if (!first.departure?.at || !last.arrival?.at || !backFirst.departure?.at || !backLast.arrival?.at) return null;
  const price = Number(offer.price?.grandTotal);
  if (!Number.isFinite(price) || price < 0) return null;
  return {
    id: String(offer.id || ''), currency:offer.price.currency || currency, price,
    airline:carriers?.[first.carrierCode] || first.carrierCode || '항공사 미상',
    outboundDeparture:first.departure.at, outboundArrival:last.arrival.at,
    returnDeparture:backFirst.departure.at, returnArrival:backLast.arrival.at,
    origin:first.departure.iataCode, destination:last.arrival.iataCode,
    outboundStops:outbound.length - 1, returnStops:inbound.length - 1,
    lastTicketingDate:offer.lastTicketingDate || null
  };
}
async function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'GET') return res.status(405).json({error:'GET 요청만 지원합니다.'});
  if (!CONFIGURED) return res.status(503).json({error:'AMADEUS_CLIENT_ID / AMADEUS_CLIENT_SECRET이 설정되지 않았습니다.',code:'NOT_CONFIGURED'});
  const {origin,destination,departureDate,returnDate,adults='1'} = req.query || {};
  if (![origin,destination].every(x => typeof x === 'string' && VALID.test(x)) || origin === destination ||
      ![departureDate,returnDate].every(x => typeof x === 'string' && DATE.test(x)) ||
      !Number.isInteger(Number(adults)) || Number(adults) < 1 || Number(adults) > 6 ||
      departureDate > returnDate || Date.parse(departureDate) < Date.now() - 86400000)
    return res.status(400).json({error:'공항 코드와 여행 날짜, 탑승 인원을 확인해 주세요.'});
  try {
    const credentials = new URLSearchParams({grant_type:'client_credentials',client_id:process.env.AMADEUS_CLIENT_ID,client_secret:process.env.AMADEUS_CLIENT_SECRET});
    const token = await jsonFetch(API_HOST+'/v1/security/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:credentials});
    const p = new URLSearchParams({originLocationCode:origin,destinationLocationCode:destination,departureDate,returnDate,adults:String(adults),currencyCode:currency,max:'20'});
    const data = await jsonFetch(API_HOST+'/v2/shopping/flight-offers?'+p.toString(),{headers:{Authorization:'Bearer '+token.access_token}});
    const offers = (data.data || []).map(x=>tidyOffer(x,data.dictionaries?.carriers)).filter(Boolean).sort((a,b)=>a.price-b.price).slice(0,12);
    return res.status(200).json({mode:process.env.AMADEUS_ENV === 'production'?'production':'test',currency,offers,coverageNote:'검색 범위와 가격은 공급사 및 API 제공 범위에 따라 다릅니다. 실결제 시 달라질 수 있습니다.'});
  } catch (e) {
    const status = e.name === 'AbortError' ? 504 : [400,401,403,429].includes(e.httpStatus) ? 502 : 502;
    const message = e.name === 'AbortError' ? '외부 API 응답 시간이 초과되었습니다.' : '항공편 제공사에서 조회하지 못했습니다. 인증키·호출 한도·검색 범위를 확인해 주세요.';
    return res.status(status).json({error:message,code:'UPSTREAM_ERROR'});
  }
}
module.exports = handler;
module.exports._tidyOffer = tidyOffer;
