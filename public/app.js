const natal = [
 {name:"Sun · AK",planet:"Sun",sign:9,deg:19+32/60+59.37/3600,nak:"Shravana"},
 {name:"Moon · BK",planet:"Moon",sign:4,deg:14+23/60+14.5/3600,nak:"Purva Phalguni"},
 {name:"Mars · PiK",planet:"Mars",sign:6,deg:8+58/60+40.65/3600,nak:"Swati"},
 {name:"Mercury · AmK",planet:"Mercury",sign:9,deg:18+27/60+37.58/3600,nak:"Shravana"},
 {name:"Jupiter · GK",planet:"Jupiter",sign:11,deg:3+57/60+40.96/3600,nak:"Uttara Bhadrapada"},
 {name:"Venus · MK",planet:"Venus",sign:10,deg:12+25/60+9.95/3600,nak:"Shatabhisha"},
 {name:"Saturn · PK",planet:"Saturn",sign:0,deg:4+2/60+30.47/3600,nak:"Ashwini"},
 {name:"Rahu · DK",planet:"Rahu",sign:3,deg:28+49/60+23.93/3600,nak:"Ashlesha"},
 {name:"Ketu",planet:"Ketu",sign:9,deg:28+49/60+23.93/3600,nak:"Dhanishta"}
];
const signs=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const signGlyph=["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
const grahas=[
 {name:"Sun",sym:"☉",kind:"sun"},{name:"Moon",sym:"☾",kind:"moon"},{name:"Mars",sym:"♂",kind:"planet"},{name:"Mercury",sym:"☿",kind:"planet"},{name:"Jupiter",sym:"♃",kind:"planet"},{name:"Venus",sym:"♀",kind:"planet"},{name:"Saturn",sym:"♄",kind:"planet"},{name:"Rahu",sym:"☊",kind:"node"},{name:"Ketu",sym:"☋",kind:"node"}
];
const nakNames=["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const R=Math.PI/180;
function norm(x){return ((x%360)+360)%360}
function kepler(M,e){let E=M;for(let i=0;i<8;i++)E-= (E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E}
function helio(d, p){
 const T=d/36525;
 const el={
 Mercury:[48.3313+3.24587e-5*d,7.0047+5e-8*d,29.1241+1.01444e-5*d,.387098,.205635+5.59e-10*d,168.6562+4.0923344368*d],
 Venus:[76.6799+2.46590e-5*d,3.3946+2.75e-8*d,54.8910+1.38374e-5*d,.723330,.006773-1.302e-9*d,48.0052+1.6021302244*d],
 Earth:[0,0,282.9404+4.70935e-5*d,1,.016709-1.151e-9*d,356.0470+.9856002585*d],
 Mars:[49.5574+2.11081e-5*d,1.8497-1.78e-8*d,286.5016+2.92961e-5*d,1.523688,.093405+2.516e-9*d,18.6021+.5240207766*d],
 Jupiter:[100.4542+2.76854e-5*d,1.3030-1.557e-7*d,273.8777+1.64505e-5*d,5.20256,.048498+4.469e-9*d,19.8950+.0830853001*d],
 Saturn:[113.6634+2.38980e-5*d,2.4886-1.081e-7*d,339.3939+2.97661e-5*d,9.55475,.055546-9.499e-9*d,316.9670+.0334442282*d]
 }[p];
 const [N,i,w,a,e,M0]=el;const M=norm(M0)*R,E=kepler(M,e);
 const xv=a*(Math.cos(E)-e),yv=a*Math.sqrt(1-e*e)*Math.sin(E);
 const v=Math.atan2(yv,xv),r=Math.hypot(xv,yv);
 const x=r*(Math.cos(N*R)*Math.cos(v+w*R)-Math.sin(N*R)*Math.sin(v+w*R)*Math.cos(i*R));
 const y=r*(Math.sin(N*R)*Math.cos(v+w*R)+Math.cos(N*R)*Math.sin(v+w*R)*Math.cos(i*R));
 const z=r*Math.sin(v+w*R)*Math.sin(i*R);
 return {x,y,z};
}
function geoLong(date,planet){
 // Use Astronomy Engine's geocentric ephemeris for the seven visible planets; sidereal longitude uses Lahiri ayanamsa.
 if(window.Astronomy && planet!=="Rahu" && planet!=="Ketu"){
   const vector=window.Astronomy.GeoVector(planet,date,true);
   const ecliptic=window.Astronomy.Ecliptic(vector);
   return norm(ecliptic.elon-ayanamsa(date));
 }
 const jd=date.getTime()/86400000+2440587.5,d=jd-2451543.5;
 if(planet==="Rahu"||planet==="Ketu"){
   const node=norm(125.1228-0.0529538083*d);return norm((planet==="Ketu"?node+180:node)-ayanamsa(date));
 }
 if(planet==="Moon"){
   const N=norm(125.1228-0.0529538083*d),i=5.1454,w=norm(318.0634+0.1643573223*d),a=60.2666,e=.0549,M=norm(115.3654+13.0649929509*d),E=kepler(M*R,e);
   const xv=a*(Math.cos(E)-e),yv=a*Math.sqrt(1-e*e)*Math.sin(E),v=Math.atan2(yv,xv),r=Math.hypot(xv,yv);
   let x=r*(Math.cos(N*R)*Math.cos(v+w*R)-Math.sin(N*R)*Math.sin(v+w*R)*Math.cos(i*R));
   let y=r*(Math.sin(N*R)*Math.cos(v+w*R)+Math.cos(N*R)*Math.sin(v+w*R)*Math.cos(i*R));
   // Main lunar perturbations (low-precision)
   const sunM=norm(356.0470+.9856002585*d),sunW=norm(282.9404+4.70935e-5*d),sunL=norm(sunM+sunW);
   const moonL=norm(N+w+M), D=norm(moonL-sunL),F=norm(moonL-N);
   let lon=norm(Math.atan2(y,x)/R + -1.274*Math.sin((M-2*D)*R)+.658*Math.sin(2*D*R)-.186*Math.sin(sunM*R)-.059*Math.sin((2*M-2*D)*R)-.057*Math.sin((M-2*D+sunM)*R)+.053*Math.sin((M+2*D)*R)+.046*Math.sin((2*D-sunM)*R)+.041*Math.sin((M-sunM)*R)-.035*Math.sin(D*R)-.031*Math.sin((M+sunM)*R)-.015*Math.sin((2*F-2*D)*R)+.011*Math.sin((M-4*D)*R));
   return norm(lon-ayanamsa(date));
 }
 const earth=helio(d,"Earth");
 if(planet==="Sun")return norm(Math.atan2(-earth.y,-earth.x)/R-ayanamsa(date));
 const q=helio(d,planet),x=q.x-earth.x,y=q.y-earth.y;
 return norm(Math.atan2(y,x)/R-ayanamsa(date));
}
function ayanamsa(date){const y=date.getUTCFullYear()+(date.getUTCMonth()+.5)/12;return 23.85675+(y-2000)*.013968}
function formatPos(lon){const s=Math.floor(lon/30),d=lon%30,deg=Math.floor(d),min=Math.floor((d-deg)*60);return {sign:s,deg,min,txt:String(deg).padStart(2,"0")+"°"+String(min).padStart(2,"0")+"′"}}
function houseFrom(lon,baseSign){return (Math.floor(lon/30)-baseSign+12)%12+1}
// Dasa calculators for the fixed natal chart. Calendar years use 365.2425 days.
const dasaBirth=new Date("1999-02-02T16:45:00Z"); // 23:45 Vietnam time (UTC+7)
const signLord={0:"Mars",1:"Venus",2:"Mercury",3:"Moon",4:"Sun",5:"Mercury",6:"Venus",7:"Mars",8:"Jupiter",9:"Saturn",10:"Saturn",11:"Jupiter"};
const vimOrder=["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
const vimYears={Ketu:7,Venus:20,Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17};
const planetSigns={Sun:9,Moon:4,Mars:6,Mercury:9,Jupiter:11,Venus:10,Saturn:0,Rahu:3,Ketu:9};
const signNameVi=["Bạch Dương","Kim Ngưu","Song Tử","Cự Giải","Sư Tử","Xử Nữ","Thiên Bình","Bọ Cạp","Nhân Mã","Ma Kết","Bảo Bình","Song Ngư"];
function addDasaYears(date,years){return new Date(date.getTime()+years*365.2425*86400000)}
function fmtDasaDate(d){return new Intl.DateTimeFormat("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric",timeZone:"Asia/Ho_Chi_Minh"}).format(d)}
function mandookaOrder(){
 // K.N. Rao-style leap sequence: Libra is a movable/odd-sign seed for this natal.
 // Libra seed: movable signs first, then dual, then fixed; leap by three signs in each quartet.
 return [6,9,0,3,8,11,2,5,1,10,7,4];
}
function mandookaYears(sign){
 const lord=signLord[sign],lordSign=planetSigns[lord];
 if(lordSign===sign)return 12;
 // Odd signs count forward from sign to lord; even signs count backward.
 let count=1,cur=sign;
 for(let i=0;i<11&&cur!==lordSign;i++){cur=(cur+(sign%2===0?1:11))%12;count++}
 // Published K.N. Rao notes specify 10 years when the lord is in the 7th.
 if((lordSign-sign+12)%12===6)return 10;
 return count;
}
function fmtDasaDateTime(d){return new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,timeZone:'Asia/Ho_Chi_Minh'}).format(d)}
function renderDasaTimeline(periods,now,currentEl,timelineEl,kind){
 const active=periods.find(p=>now>=p.start&&now<p.end);
 if(active){
   currentEl.innerHTML='<strong>'+active.label+'</strong><div>'+fmtDasaDate(active.start)+' – '+fmtDasaDate(active.end)+'</div><small>Giai đoạn hiện tại tại ngày đã chọn</small>';
 }else{
   currentEl.innerHTML='<strong>Chưa xác định</strong><small>Ngày chọn nằm ngoài phạm vi đã tính.</small>';
 }
 timelineEl.innerHTML=periods.map((p,i)=>'<div class="dasa-period '+(p===active?'active':'')+' '+(p.subperiods?'has-subperiods':'')+'" '+(p.subperiods?'role="button" tabindex="0" data-period-index="'+i+'" aria-expanded="false"':'')+'><div><strong>'+p.label+(p.subperiods?' <span class="expand-mark">＋ chi tiết</span>':'')+'</strong><small>'+p.years.toFixed(2)+' năm</small></div><time>'+fmtDasaDateTime(p.start)+'<br>→ '+fmtDasaDateTime(p.end)+'</time></div>'+(p.subperiods?'<div class="subperiod-list" id="subperiod-'+kind+'-'+i+'" hidden>'+p.subperiods.map(sp=>'<div class="subperiod-row '+(now>=sp.start&&now<sp.end?'active':'')+'"><span><strong>'+sp.label+'</strong><small>'+sp.years.toFixed(2)+' năm</small></span><time>'+fmtDasaDateTime(sp.start)+'<br>→ '+fmtDasaDateTime(sp.end)+'</time></div>').join('')+'</div>':'')).join('');
 timelineEl.querySelectorAll('[data-period-index]').forEach(el=>{const toggle=()=>{const box=timelineEl.querySelector('#subperiod-'+kind+'-'+el.dataset.periodIndex);if(!box)return;box.hidden=!box.hidden;el.setAttribute('aria-expanded',String(!box.hidden));const mark=el.querySelector('.expand-mark');if(mark)mark.textContent=box.hidden?'＋ chi tiết':'－ thu gọn'};el.addEventListener('click',toggle);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})});
}
function renderDasa(){
 const val=document.getElementById("transitDate").value,parts=val.split("-").map(Number),now=new Date(Date.UTC(parts[0],parts[1]-1,parts[2],5));
 // Mandooka reference dates supplied by the user: exact K.N. Rao Cancer MD and Antardasas.
 const mandookaRef=[["Cancer","Cn","2024-02-03T09:33:29+07:00","2025-02-02T15:39:05+07:00"],["Libra","Li","2025-02-02T15:39:05+07:00","2026-02-02T21:51:52+07:00"],["Capricorn","Cp","2026-02-02T21:51:52+07:00","2027-02-03T03:59:03+07:00"],["Aries","Ar","2027-02-03T03:59:03+07:00","2028-02-03T10:04:33+07:00"],["Leo","Le","2028-02-03T10:04:33+07:00","2029-02-02T16:14:21+07:00"],["Scorpio","Sc","2029-02-02T16:14:21+07:00","2030-02-02T22:23:17+07:00"],["Aquarius","Aq","2030-02-02T22:23:17+07:00","2031-02-03T04:31:18+07:00"],["Taurus","Ta","2031-02-03T04:31:18+07:00","2032-02-03T10:40:43+07:00"],["Virgo","Vi","2032-02-03T10:40:43+07:00","2033-02-02T16:51:56+07:00"],["Sagittarius","Sg","2033-02-02T16:51:56+07:00","2034-02-02T23:07:59+07:00"],["Pisces","Pi","2034-02-02T23:07:59+07:00","2035-02-03T05:16:43+07:00"],["Gemini","Ge","2035-02-03T05:16:43+07:00","2036-02-03T11:22:28+07:00"]];
 const mdStart=new Date("2024-02-03T09:33:29+07:00"),mdEnd=new Date("2036-02-03T11:22:28+07:00");
 const subperiods=mandookaRef.map(([en,abbr,a,b])=>{const start=new Date(a),end=new Date(b);return {label:en+" · "+abbr,years:(end-start)/(365.2425*86400000),start,end}});
 const periods=[{label:"Cancer MD · Cn",years:(mdEnd-mdStart)/(365.2425*86400000),start:mdStart,end:mdEnd,subperiods}];
 renderDasaTimeline(periods,now,document.getElementById("mandookaCurrent"),document.getElementById("mandookaTimeline"),"sign");
 document.getElementById("mandookaNote").textContent="Biến thể đang dùng: Mandooka kiểu K.N. Rao — nhảy theo nhóm cung cùng tính chất; độ dài tính từ cung đến chủ tinh (không trừ 1), cung tự chủ 12 năm và chủ tinh ở cung đối diện 10 năm. Điều kiện số lượng: natal Libra Lagna có 4 hành tinh không phải nút ở Kendra — Mars (nhà 1), Sun và Mercury (nhà 4), Saturn (nhà 7) — nên đạt ngưỡng ≥4 hành tinh thường được nêu trong mô tả Mandooka Dasa kiểu K.N. Rao. Đây chỉ xác nhận điều kiện đếm hành tinh; cách tính và mốc thời gian vẫn cần đối chiếu tài liệu Jyotish chuyên dụng.";
 // Tara Dasa: use the exact Maha Dasa sequence and boundary timestamps supplied by the user.
 const taraSeq=["Sun","Mercury","Ketu","Mars","Rahu","Saturn","Moon","Venus","Jupiter"];
 const taraBoundaries=["1998-08-15T23:09:10+07:00","2004-08-15T12:08:29+07:00","2021-08-15T20:36:38+07:00","2028-08-15T15:48:19+07:00","2035-08-16T10:39:15+07:00","2053-08-16T01:28:33+07:00","2072-08-15T22:16:19+07:00","2082-08-16T11:42:37+07:00","2102-08-17T14:39:17+07:00","2118-08-17T17:00:27+07:00"].map(x=>new Date(x));
 const taraAbbr={Sun:"Su",Mercury:"Me",Ketu:"Ke",Mars:"Ma",Rahu:"Ra",Saturn:"Sa",Moon:"Mo",Venus:"Ve",Jupiter:"Ju"};
 const taraPeriods=taraSeq.map((p,i)=>{const start=taraBoundaries[i],end=taraBoundaries[i+1],span=end-start,years=vimYears[p];const rotated=[...taraSeq.slice(i),...taraSeq.slice(0,i)];let subCursor=new Date(start);const subperiods=rotated.map(sub=>{const subYears=years*vimYears[sub]/120;const subEnd=new Date(sub===rotated[rotated.length-1]?end.getTime():subCursor.getTime()+span*vimYears[sub]/120);const item={label:sub+" · "+taraAbbr[sub],years:vimYears[sub]*years/120,start:new Date(subCursor),end:subEnd};subCursor=subEnd;return item});subperiods[subperiods.length-1].end=new Date(end);return {label:p+" · "+taraAbbr[p],years:span/(365.2425*86400000),start:new Date(start),end:new Date(end),planet:p,subperiods}});
 renderDasaTimeline(taraPeriods,now,document.getElementById("taraCurrent"),document.getElementById("taraTimeline"),"tara");
 document.getElementById("taraNote").textContent="Tara Dasa đã được chỉnh theo đúng chuỗi Maha Dasa và các mốc ngày/giờ bạn cung cấp. Bấm vào từng Maha Dasa để xem Antardasa; tiểu vận được chia theo tỷ lệ Vimshottari trong tổng thời lượng Maha Dasa, nên đây là phép triển khai tiểu vận từ bảng mốc bạn đưa, không phải xác minh độc lập từ phần mềm gốc.";
}
function renderNatal(){
 document.getElementById("natalList").innerHTML=natal.map(p=>{const lon=p.sign*30+p.deg,fp=formatPos(lon);return '<div class="natal-row"><div class="natal-name">'+p.name+'<small>'+p.nak+'</small></div><div class="natal-pos">'+fp.txt+' '+signGlyph[fp.sign]+'<br>'+signs[fp.sign]+'</div></div>'}).join("");
}
function renderRasi(dateOverride){
 const symbols={Sun:"Su",Moon:"Mo",Mars:"Ma",Mercury:"Me",Jupiter:"Ju",Venus:"Ve",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke"};
 const names={0:"Aries",1:"Taurus",2:"Gemini",3:"Cancer",4:"Leo",5:"Virgo",6:"Libra",7:"Scorpio",8:"Sagittarius",9:"Capricorn",10:"Aquarius",11:"Pisces"};
 const inputValue=document.getElementById("transitDate").value;const parts=inputValue.split("-").map(Number);const transitDate=dateOverride||new Date(Date.UTC(parts[0],parts[1]-1,parts[2],5,0,0));
 const moving=grahas.map(g=>({name:g.name,sym:symbols[g.name],sign:Math.floor(geoLong(transitDate,g.name)/30)}));
 document.querySelectorAll(".rasi-cell").forEach(cell=>{
  const sign=Number(cell.dataset.sign);
  const planets=natal.filter(p=>p.sign===sign).map(p=>'<span class="rasi-planet" title="Natal '+p.name+'">'+symbols[p.planet]+'</span>').join("");
  const transits=moving.filter(p=>p.sign===sign).map(p=>'<span class="rasi-transit" title="Transit '+p.name+'">'+p.sym+'<sup>T</sup></span>').join("");
  const asc=sign===6?'<span class="rasi-asc" title="Natal Ascendant">As</span>':"";
  cell.innerHTML='<span class="rasi-sign">'+signGlyph[sign]+' '+names[sign]+'</span><div class="rasi-placements">'+asc+planets+transits+'</div>';
 });
}
function renderTransit(){
 const value=document.getElementById("transitDate").value;
 const [yy,mm,dd]=value.split("-").map(Number);
 // Evaluate at 12:00 Vietnam time (05:00 UTC), keeping the chosen local date stable.
 const date=new Date(Date.UTC(yy,mm-1,dd,5,0,0));
 renderRasi(date);
 const rows=grahas.map(g=>{const lon=geoLong(date,g.name),fp=formatPos(lon),nk=Math.floor(lon/(360/27)),pada=Math.floor((lon%(360/27))/(360/108))+1;
 const houseL=houseFrom(lon,6),houseM=houseFrom(lon,4);
 return {g,lon,fp,nk,pada,houseL,houseM};});
 document.getElementById("transitRows").innerHTML=rows.map(r=>'<tr><td><div class="planet"><span class="planet-symbol">'+r.g.sym+'</span>'+r.g.name+'</div></td><td class="position">'+r.fp.txt+' <span class="sign-tag">'+signGlyph[r.fp.sign]+' '+signs[r.fp.sign]+'</span></td><td>'+nakNames[r.nk]+' <span style="color:var(--muted)">P'+r.pada+'</span></td><td><span class="house-pill">'+r.houseL+'H</span></td><td><span class="house-pill">'+r.houseM+'H</span></td></tr>').join("");
 const opts={weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Ho_Chi_Minh"};
 document.getElementById("dateLabel").textContent=new Intl.DateTimeFormat(uiLanguage==="en"?"en-US":"vi-VN",opts).format(date)+(uiLanguage==="en"?" · calculated at 12:00 Vietnam time (UTC+7)":" · tính tại 12:00 giờ Việt Nam (UTC+7)");
 if(typeof buildChartText==="function")buildChartText();
}
function localDateString(d){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return y+"-"+m+"-"+day}
const input=document.getElementById("transitDate");
input.value=localDateString(new Date());
input.addEventListener("change",renderTransit);
input.addEventListener("change",renderDasa);
document.getElementById("prevDay").addEventListener("click",()=>{const d=new Date(input.value+"T12:00:00");d.setDate(d.getDate()-1);input.value=localDateString(d);renderTransit()});
document.getElementById("nextDay").addEventListener("click",()=>{const d=new Date(input.value+"T12:00:00");d.setDate(d.getDate()+1);input.value=localDateString(d);renderTransit()});
document.getElementById("todayBtn").addEventListener("click",()=>{input.value=localDateString(new Date());renderTransit()});
let uiLanguage="vi";
function dms(value){const d=Math.floor(value),mFloat=(value-d)*60,m=Math.floor(mFloat),s=Math.round((mFloat-m)*60);return String(d).padStart(2,"0")+"°"+String(m).padStart(2,"0")+"′"+String(s).padStart(2,"0")+"″"}
function buildChartText(){
 const value=document.getElementById("transitDate").value,[yy,mm,dd]=value.split("-").map(Number),date=new Date(Date.UTC(yy,mm-1,dd,5,0,0));
 const en=uiLanguage==="en",signsText=en?signs:signNameVi,lagna=6,moonSign=4;
 const heading=en?"NATAL + TRANSIT SNAPSHOT":"TỔNG HỢP NATAL + TRANSIT";
 const lines=[heading,(en?"Selected date: ":"Ngày đang chọn: ")+value,(en?"Zodiac: sidereal · Ayanamsa: Lahiri approximation · Houses: whole-sign from natal Libra Ascendant":"Hoàng đạo: sidereal · Ayanamsa: Lahiri ước tính · Nhà: whole-sign từ Lagna natal Thiên Bình"),"",en?"NATAL (fixed birth chart)":"NATAL (lá số gốc cố định)","Ascendant / Lagna: Libra 15°50′31″ · House 1"];
 natal.forEach(p=>{const house=houseFrom(p.sign*30+p.deg,lagna),label=p.planet;lines.push(label+": "+signsText[p.sign]+" "+dms(p.deg)+" · "+(en?"House ":"Nhà ")+house+(p.nak?" · Nakshatra "+p.nak:""))});
 lines.push("","TRANSIT · "+value+(en?" at 12:00 Vietnam time (UTC+7)":" · 12:00 giờ Việt Nam (UTC+7)"));
 grahas.forEach(g=>{const lon=geoLong(date,g.name),fp=formatPos(lon),nk=Math.floor(lon/(360/27)),pada=Math.floor((lon%(360/27))/(360/108))+1;lines.push(g.name+": "+signsText[fp.sign]+" "+dms(lon%30)+" · "+(en?"House from natal Lagna ":"Nhà từ Lagna natal ")+houseFrom(lon,lagna)+" · "+(en?"House from natal Moon ":"Nhà từ Moon natal ")+houseFrom(lon,moonSign)+" · Nakshatra "+nakNames[nk]+" P"+pada)});
 lines.push("","NOTE: Transit positions are generated by the app's built-in approximate ephemeris and Lahiri approximation; verify against a trusted Jyotish ephemeris before relying on exact degrees.");
 lines.push(en?"Please analyze Natal and Transit separately, state the astrological tradition and assumptions, and distinguish calculation from interpretation.":"Hãy phân tích riêng Natal và Transit, nêu rõ trường phái và giả định chiêm tinh, phân biệt dữ liệu tính toán với phần diễn giải.");
 document.getElementById("chartTextOutput").value=lines.join("\n");
}
const translations={
 vi:{"#copyHeading":"Natal + Transit · bản văn bản","#copyIntro":"Tự tổng hợp cung, nhà và độ số theo ngày đang chọn. Sao chép toàn bộ để hỏi ChatGPT hoặc AI khác.","#copyChartText":"Copy text",".date-panel h2":"Chọn bầu trời muốn xem",".date-panel .eyebrow":"NGÀY TRANSIT","#todayBtn":"Hôm nay",".rasi-panel h2":"Lá số Rāśi · D1",".rasi-intro":"Khung vuông kiểu Nam Ấn · các cung giữ nguyên vị trí, hành tinh đặt theo lá số gốc.",".dasa-section h2":"Mandooka Dasa · Tara Dasa",".transit-panel h2":"Hành tinh quá cảnh",".natal-panel h2":"Natal của bạn",".explain-panel h2":"Đọc lớp đối chiếu",".sub":"Lá số gốc cố định · Bầu trời thay đổi theo ngày bạn chọn.",".hero .eyebrow":"LÁ SỐ GỐC · BẦU TRỜI HIỆN TẠI",".date-note .translation-placeholder":"Tính theo ngày đã chọn · múi giờ Việt Nam (UTC+7)",".transit-panel th:nth-child(2)":"Vị trí sidereal",".transit-panel th:nth-child(3)":"Nakshatra",".transit-panel th:nth-child(4)":"Nhà từ Lagna",".transit-panel th:nth-child(5)":"Nhà từ Moon",".rasi-legend .translation-placeholder":"Natal · vị trí gốc"},
 en:{"#copyHeading":"Natal + Transit · text snapshot","#copyIntro":"Automatically lists signs, houses and degrees for the selected date. Copy the text into ChatGPT or another AI assistant.","#copyChartText":"Copy text",".date-panel h2":"Choose a transit date",".date-panel .eyebrow":"TRANSIT DATE","#todayBtn":"Today",".rasi-panel h2":"Rāśi Chart · D1",".rasi-intro":"South Indian square chart · natal placements stay fixed.",".dasa-section h2":"Mandooka Dasa · Tara Dasa",".transit-panel h2":"Transiting planets",".natal-panel h2":"Your Natal Chart",".explain-panel h2":"How to read the chart",".sub":"Fixed natal chart · the sky changes with the selected date.",".hero .eyebrow":"YOUR NATAL · YOUR SKY",".transit-panel th:nth-child(2)":"Sidereal position",".transit-panel th:nth-child(3)":"Nakshatra",".transit-panel th:nth-child(4)":"House from Lagna",".transit-panel th:nth-child(5)":"House from Moon"}
};
function applyLanguage(){
 const dict=translations[uiLanguage];Object.entries(dict).forEach(([sel,val])=>{const el=document.querySelector(sel);if(el)el.textContent=val});
 document.getElementById("langToggle").textContent=uiLanguage==="vi"?"EN":"VI";
 document.documentElement.lang=uiLanguage;
 buildChartText();
}
const themeButton=document.getElementById("themeToggle");
function applyTheme(dark){document.body.classList.toggle("dark-mode",dark);themeButton.textContent=dark?"☀":"☾";themeButton.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");try{localStorage.setItem("vedic-theme",dark?"dark":"light")}catch(e){}}
try{applyTheme(localStorage.getItem("vedic-theme")==="dark")}catch(e){applyTheme(false)}
document.getElementById("themeToggle").addEventListener("click",()=>applyTheme(!document.body.classList.contains("dark-mode")));
document.getElementById("langToggle").addEventListener("click",()=>{uiLanguage=uiLanguage==="vi"?"en":"vi";applyLanguage()});
document.getElementById("copyChartText").addEventListener("click",async()=>{const area=document.getElementById("chartTextOutput");try{await navigator.clipboard.writeText(area.value)}catch(e){area.focus();area.select();document.execCommand("copy")}const b=document.getElementById("copyChartText");b.textContent=uiLanguage==="vi"?"Đã copy!":"Copied!";setTimeout(()=>{b.textContent=uiLanguage==="vi"?"Copy text":"Copy text"},1400)});
renderNatal();renderRasi();renderTransit();renderDasa();applyLanguage();
// Tara Maha Dasa sequence is fixed to the supplied reference table; no manual start selector.
document.getElementById("prevDay").addEventListener("click",renderDasa);
document.getElementById("nextDay").addEventListener("click",renderDasa);
document.getElementById("todayBtn").addEventListener("click",renderDasa);