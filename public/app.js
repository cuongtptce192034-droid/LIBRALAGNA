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
function renderNatal(){
 document.getElementById("natalList").innerHTML=natal.map(p=>{const lon=p.sign*30+p.deg,fp=formatPos(lon);return '<div class="natal-row"><div class="natal-name">'+p.name+'<small>'+p.nak+'</small></div><div class="natal-pos">'+fp.txt+' '+signGlyph[fp.sign]+'<br>'+signs[fp.sign]+'</div></div>'}).join("");
}
function renderTransit(){
 const value=document.getElementById("transitDate").value;
 const [yy,mm,dd]=value.split("-").map(Number);
 // Evaluate at 12:00 Vietnam time (05:00 UTC), keeping the chosen local date stable.
 const date=new Date(Date.UTC(yy,mm-1,dd,5,0,0));
 const rows=grahas.map(g=>{const lon=geoLong(date,g.name),fp=formatPos(lon),nk=Math.floor(lon/(360/27)),pada=Math.floor((lon%(360/27))/(360/108))+1;
 const houseL=houseFrom(lon,6),houseM=houseFrom(lon,4);
 return {g,lon,fp,nk,pada,houseL,houseM};});
 document.getElementById("transitRows").innerHTML=rows.map(r=>'<tr><td><div class="planet"><span class="planet-symbol">'+r.g.sym+'</span>'+r.g.name+'</div></td><td class="position">'+r.fp.txt+' <span class="sign-tag">'+signGlyph[r.fp.sign]+' '+signs[r.fp.sign]+'</span></td><td>'+nakNames[r.nk]+' <span style="color:var(--muted)">P'+r.pada+'</span></td><td><span class="house-pill">'+r.houseL+'H</span></td><td><span class="house-pill">'+r.houseM+'H</span></td></tr>').join("");
 const opts={weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Ho_Chi_Minh"};
 document.getElementById("dateLabel").textContent=new Intl.DateTimeFormat("vi-VN",opts).format(date)+" · tính tại 12:00 giờ Việt Nam (UTC+7)";
}
function localDateString(d){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return y+"-"+m+"-"+day}
const input=document.getElementById("transitDate");
input.value=localDateString(new Date());
input.addEventListener("change",renderTransit);
document.getElementById("prevDay").addEventListener("click",()=>{const d=new Date(input.value+"T12:00:00");d.setDate(d.getDate()-1);input.value=localDateString(d);renderTransit()});
document.getElementById("nextDay").addEventListener("click",()=>{const d=new Date(input.value+"T12:00:00");d.setDate(d.getDate()+1);input.value=localDateString(d);renderTransit()});
document.getElementById("todayBtn").addEventListener("click",()=>{input.value=localDateString(new Date());renderTransit()});
renderNatal();renderTransit();