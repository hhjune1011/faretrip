(() => {
  'use strict';
  const Trip = window.Faretrip;
  const $ = id => document.getElementById(id);
  const state = { flight:null, plan:null, style:'balanced', pace:'normal', apiOffers:[], mode:'manual', sample:false };
  const html = text => String(text == null ? '' : text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const localDate = (date) => [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
  const plusDays = (date, days) => { const d = new Date(date); d.setDate(d.getDate()+days); return localDate(d); };
  const fmtDate = x => { const [y,m,d] = String(x).slice(0,10).split('-'); return `${y}.${m}.${d}`; };
  const fmtDateTime = x => `${fmtDate(x)} ${String(x).slice(11,16)}`;
  const money = (v, currency='KRW') => Number.isFinite(Number(v)) ? new Intl.NumberFormat('ko-KR',{style:'currency',currency:currency || 'KRW',maximumFractionDigits:0}).format(v) : '가격 미입력';
  const weekday = x => ['일','월','화','수','목','금','토'][new Date(x+'T12:00:00Z').getUTCDay()];
  let toastTimer;
  function toast(msg) { const node=$('toast'); node.textContent=msg; node.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>node.classList.remove('show'),3600); }
  function setDefaults() {
    const today=new Date();
    const dep=plusDays(today,20),back=plusDays(today,23);
    $('manual-out-depart').value=dep+'T09:05';
    $('manual-out-arrive').value=dep+'T11:30';
    $('manual-back-depart').value=back+'T19:10';
    $('manual-back-arrive').value=back+'T21:50';
    $('api-out-date').value=dep; $('api-back-date').value=back;
    $('api-out-date').min=localDate(today); $('api-back-date').min=localDate(today);
  }
  function clearFlight() {
    state.flight=null; state.plan=null;state.sample=false;
    $('generate').disabled=true;
    $('selected-flight').classList.remove('ready');
    $('selected-flight').innerHTML='<span class="mini-warning">!</span><span>먼저 항공권을 선택하면 일정을 만들 수 있어요.</span>';
  }
  function chooseFlight(flight, isSample=false) {
    const e=Trip.validateFlight(flight);
    if(e) { toast(e); return; }
    state.flight={...flight,isSample}; state.sample=isSample;
    const d=Trip.parseCity(flight.destination);
    $('selected-flight').classList.add('ready');
    $('selected-flight').innerHTML='<span class="mini-warning">✓</span><span><strong>'+html(flight.origin)+' → '+html(flight.destination)+' / '+html(d.name)+'</strong><br>'+html(fmtDate(flight.outboundArrival))+' 도착 · '+html(fmtDate(flight.returnDeparture))+' 귀국'+(isSample?' · 예시 항공권':'')+'</span>';
    $('generate').disabled=false;
    toast('항공권을 선택했어요. 여행 스타일을 정하고 일정을 만들어 보세요.');
  }
  function manualFlight() {
    return {
      origin:$('manual-origin').value,destination:$('manual-destination').value,
      outboundDeparture:$('manual-out-depart').value,outboundArrival:$('manual-out-arrive').value,
      returnDeparture:$('manual-back-depart').value,returnArrival:$('manual-back-arrive').value,
      airline:$('manual-airline').value.trim(),
      price:$('manual-price').value === '' ? null : Number($('manual-price').value),
      currency:'KRW',source:'manual'
    };
  }
  function switchMode(mode) {
    state.mode=mode;
    const isManual=mode==='manual';
    $('manual-panel').hidden=!isManual;$('api-panel').hidden=isManual;
    $('mode-manual').classList.toggle('active',isManual);$('mode-search').classList.toggle('active',!isManual);
    $('mode-manual').setAttribute('aria-selected',String(isManual));$('mode-search').setAttribute('aria-selected',String(!isManual));
  }
  function setupChoices(id,stateKey){
    const el=$(id);el.addEventListener('click',ev=>{const b=ev.target.closest('button[data-value]');if(!b)return;
      for(const c of el.querySelectorAll('button')){c.classList.toggle('active',c===b)}state[stateKey]=b.dataset.value;
    });
  }
  function flightLabel(flight){ return `${flight.origin} → ${flight.destination} · ${fmtDateTime(flight.outboundArrival)} 현지 도착 · ${fmtDateTime(flight.returnDeparture)} 현지 출발`; }
  function planText(plan) {
    const lines=[`faretrip. 여행 일정 — ${plan.city} (${plan.dates.length}일)`,flightLabel(plan.flight),''];
    for (const day of plan.days){lines.push(`DAY ${day.day} | ${day.date} (${weekday(day.date)})`);
      for(const item of day.items)lines.push(` ${item.time}  ${item.title} (${item.area}) — ${item.detail}`);
      lines.push(''); }
    lines.push('※ 예상 이동시간, 영업시간, 실제 예약 및 교통 정보는 반드시 별도 확인하세요.');
    return lines.join('\n');
  }
  function renderPlan(plan) {
    $('result').hidden=false;
    $('result-title').innerHTML=html(plan.city)+'에서 보내는<br/><em>우리만의 시간.</em>';
    $('result-subtitle').textContent=`${fmtDate(plan.dates[0])} — ${fmtDate(plan.dates[plan.dates.length-1])} · ${plan.dates.length}일 일정 · ${plan.country}`;
    const price = plan.flight.price == null ? '직접 확인' : money(plan.flight.price,plan.flight.currency) + (plan.flight.isSample ? ' (예시)' : plan.flight.source==='amadeus-test' ? ' (테스트)' : '');
    const cardInfo=[['여행 목적지',`${plan.city}, ${plan.country}`],['현지 체류',`${plan.dates.length}일`],['선택한 항공권',price],['여행 스타일',({'balanced':'균형 있게','culture':'관광 중심','food':'먹거리 중심','shopping':'쇼핑 중심','relax':'휴식 중심'})[plan.options.style]]];
    $('plan-summary').innerHTML=cardInfo.map(x=>`<div class="summary-item"><span>${html(x[0])}</span><strong>${html(x[1])}</strong></div>`).join('');
    $('itinerary').innerHTML=plan.days.map(day=>`<article class="day-card"><div class="day-side"><span class="day-index">DAY ${String(day.day).padStart(2,'0')}</span><h3>${html(String(day.date).slice(5).replace('-','.'))}</h3><small>${weekday(day.date)}요일<br/>${day.first?'ARRIVAL DAY':day.last?'DEPARTURE DAY':'EXPLORE THE CITY'}</small></div><div class="day-main"><p class="day-note">${html(day.notes)}</p>${day.items.map(stop=>`<div class="stop"><span class="stop-time">${html(stop.time)}</span><div class="stop-track"><span class="stop-point"></span></div><div><div class="stop-title">${html(stop.title)}<span class="stop-area">${html(stop.area)}</span></div><div class="stop-detail">${html(stop.detail)}</div>${stop.kind!=='travel' && stop.area!=='숙소 인근'?`<a class="stop-map" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.title+' '+plan.city)}">지도에서 확인 ↗</a>`:''}</div></div>`).join('')}</div></article>`).join('');
    $('result').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function fillSample() {
    clearFlight();
    $('manual-origin').value='ICN';$('manual-destination').value='NRT';
    const d = new Date(); const a=plusDays(d,20),b=plusDays(d,23);
    $('manual-out-depart').value=a+'T09:05';$('manual-out-arrive').value=a+'T11:30';
    $('manual-back-depart').value=b+'T19:10';$('manual-back-arrive').value=b+'T21:50';
    $('manual-price').value='189000';$('manual-airline').value='예시 항공사';
    chooseFlight(manualFlight(),true);
    toast('예시 항공편을 불러왔어요. 가격과 항공사는 실제 조회 정보가 아닙니다.');
  }
  function renderOffers(offers, mode) {
    state.apiMode=mode;
    if (!offers.length){$('api-results').innerHTML='<div class="api-empty">해당 조건에서 조회 가능한 왕복 항공편이 없습니다. 날짜나 공항을 변경해 보세요.</div>';return;}
    const test=mode!=='production';
    $('api-results').innerHTML=`<p class="api-intro"><span class="offer-mode">${test?'테스트 API · 실제 판매 가격 아님':'운영 API · 실시간 변동 가능'}</span><br/><span style="font-size:11px;color:#65756b;line-height:2">검색 결과 중 가격순 정렬입니다. 할인율이나 특가 여부를 검증하지 않습니다.</span></p><div class="offer-list">${offers.map((f,i)=>`<div class="offer-card"><div><strong>${html(money(f.price,f.currency))}</strong> <small>/ ${html($('api-adults').value)}명 전체</small><div class="offer-meta">${html(f.airline)} · ${html(fmtDateTime(f.outboundDeparture))} 출발<br/>${html(fmtDateTime(f.outboundArrival))} 도착 · ${html(fmtDateTime(f.returnDeparture))} 귀국편 출발<br/>경유 ${Number(f.outboundStops)}회 / 귀국편 ${Number(f.returnStops)}회</div></div><button type="button" class="use-offer" data-index="${i}">선택하기 →</button></div>`).join('')}</div>`;
  }
  function init(){
    setDefaults(); setupChoices('style-options','style');setupChoices('pace-options','pace');
    $('mode-manual').addEventListener('click',()=>switchMode('manual'));
    $('mode-search').addEventListener('click',()=>switchMode('search'));
    $('manual-form').addEventListener('submit',event=>{
      event.preventDefault();
      const f=manualFlight();
      if (!f.outboundDeparture||!f.outboundArrival||!f.returnDeparture) {toast('필수 비행 시각을 모두 입력해 주세요.');return;}
      chooseFlight(f,false);
    });
    $('manual-form').addEventListener('change',()=>{if(state.flight?.source==='manual')clearFlight()});
    $('fill-sample').addEventListener('click',fillSample);
    $('api-form').addEventListener('submit',async ev=>{
      ev.preventDefault();const btn=$('api-submit');
      const p=new URLSearchParams({origin:$('api-origin').value,destination:$('api-destination').value,departureDate:$('api-out-date').value,returnDate:$('api-back-date').value,adults:$('api-adults').value});
      if(p.get('returnDate')<=p.get('departureDate')){toast('귀국일은 출국일보다 뒤로 설정해 주세요.');return;}
      if(!p.get('departureDate')||!p.get('returnDate')){toast('출국일과 귀국일을 입력해 주세요.');return;}
      btn.disabled=true;btn.textContent='항공편 검색 중...';$('api-results').innerHTML='<div class="api-empty">항공편 제공사의 응답을 확인하고 있어요.</div>';
      try{
        const controller=new AbortController();const t=setTimeout(()=>controller.abort(),24000);
        let response;
        try{response=await fetch('/api/flights?'+p,{signal:controller.signal})}finally{clearTimeout(t)}
        const data=await response.json().catch(()=>({error:'서버에서 응답을 해석할 수 없습니다.'}));
        if(!response.ok) throw Error(data.error||'항공편 조회에 실패했습니다.');
        state.apiOffers=(data.offers||[]).filter(f=>Trip.parseCity(f.destination));
        renderOffers(state.apiOffers,data.mode);
      }catch(e){$('api-results').innerHTML='<div class="api-error">'+html(e.name==='AbortError'?'조회 시간이 초과됐습니다. 잠시 후 다시 시도해 주세요.':e.message)+'</div>';}
      finally{btn.disabled=false;btn.innerHTML='항공편 가격 조회 <span>↗</span>'}
    });
    $('api-results').addEventListener('click',e=>{const b=e.target.closest('.use-offer');if(!b)return;const f=state.apiOffers[Number(b.dataset.index)];if(f) chooseFlight({...f,source:state.apiMode==='production'?'amadeus-production':'amadeus-test'},false)});
    $('generate').addEventListener('click',()=>{
      if(!state.flight) return;
      try{const plan=Trip.buildPlan(state.flight,{style:state.style,pace:state.pace});state.plan=plan;renderPlan(plan);}
      catch(e){toast(e.message)}
    });
    $('copy-plan').addEventListener('click',async()=>{
      if(!state.plan)return;
      const text=planText(state.plan);
      try{await navigator.clipboard.writeText(text);toast('여행 일정을 복사했어요.');}
      catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();toast(ok?'여행 일정을 복사했어요.':'복사할 수 없습니다. HTTPS에서 다시 시도해 주세요.');}
    });
    $('save-plan').addEventListener('click',()=>{if(!state.plan)return;try{localStorage.setItem('faretrip-last-plan',JSON.stringify(state.plan));toast('현재 브라우저에 일정을 저장했어요.');}catch(e){toast('브라우저 저장 공간에 접근할 수 없습니다.')}});
    $('print-plan').addEventListener('click',()=>{if(state.plan)window.print()});
    for(const tile of document.querySelectorAll('.destination-tile'))tile.addEventListener('click',()=>{switchMode('manual');clearFlight();$('manual-destination').value=tile.dataset.destination;$('planner').scrollIntoView({behavior:'smooth'});toast('여행지를 선택했어요. 항공편을 입력해 주세요.')});
    try{
      const cached=JSON.parse(localStorage.getItem('faretrip-last-plan')||'null');
      if(cached&&Array.isArray(cached.days)&&cached.flight&&cached.dates&&cached.city){state.plan=cached;renderPlan(cached);setTimeout(()=>window.scrollTo({top:0,behavior:'instant'}),0)}
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded',init);
})();
