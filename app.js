const C=window.HOERBUCH, $=id=>document.getElementById(id), audio=$("audio");let client=null,published=[],draft=[],pending=new Map(),active=-1;
const ok=C.supabaseUrl?.startsWith("https://")&&C.supabaseKey&&!C.supabaseUrl.includes("DEINE_");
if(ok && window.supabase && typeof window.supabase.createClient === "function") client=window.supabase.createClient(C.supabaseUrl,C.supabaseKey);
const fmt=n=>Number.isFinite(n)?`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,"0")}`:"0:00";
const url=p=>client.storage.from("audio").getPublicUrl(p).data.publicUrl;
function modal(id,on=true){$(id).classList.toggle("hidden",!on)}
document.querySelectorAll("[data-close]").forEach(x=>x.onclick=async()=>{
  const target=x.dataset.close;
  modal(target,false);
  if(target==="manageBox") await loadPublic();
});
$("admin").onclick=()=>{ $("pin").value="";$("pinError").textContent="";modal("pinBox") };
$("enter").onclick=()=>{if($("pin").value===String(C.pin)){modal("pinBox",false);modal("manageBox");loadDraft()}else $("pinError").textContent="PIN nicht korrekt."};
$("pin").onkeydown=e=>{if(e.key==="Enter")$("enter").click()};
async function loadPublic(){
  if(C.cover){const im=new Image();im.src=C.cover;im.onload=()=>{$("cover").replaceChildren(im)}}
  if(!client){$("current").textContent=ok?"Supabase-Bibliothek konnte nicht geladen werden.":"Online-Speicher noch nicht eingerichtet.";return false}
  try{
    const {data,error}=await client.from("chapters_public").select("*").order("sort_order");
    if(error) throw error;
    published=data||[];
    renderPublic();
    return true;
  }catch(e){$("current").textContent="Hörbuch konnte nicht geladen werden: "+(e.message||String(e));return false}
}
function renderPublic(){let root=$("chapters");root.innerHTML="";published.forEach((c,i)=>{let li=document.createElement("li");li.className=i===active?"active":"";let b=document.createElement("button");b.className="playSmall";b.textContent=i===active&&!audio.paused?"Ⅱ":"▶";b.onclick=()=>play(i);let n=document.createElement("span");n.className="name";n.textContent=c.title||`Kapitel ${i+1}`;let d=document.createElement("span");d.className="duration";d.textContent=c.duration||"—";li.append(b,n,d);root.append(li)});if(!published.length)$("current").textContent="Noch keine Kapitel veröffentlicht"}
function play(i){active=i;audio.src=url(published[i].file_path);$("current").textContent=published[i].title;$("elapsed").textContent="0:00";$("total").textContent=published[i].duration||"0:00";$("seek").value=0;renderPublic();audio.play().catch(()=>{})}
$("play").onclick=()=>{if(active<0){if(published.length)play(0)}else if(audio.paused)audio.play();else audio.pause()};
audio.ontimeupdate=()=>{if(audio.duration){$("seek").value=audio.currentTime/audio.duration*1000;$("elapsed").textContent=fmt(audio.currentTime);$("total").textContent=fmt(audio.duration)}};
audio.onloadedmetadata=()=>{$("total").textContent=fmt(audio.duration)};
$("seek").oninput=()=>{if(audio.duration)audio.currentTime=$("seek").value/1000*audio.duration};
audio.onplay=()=>{$("play").textContent="Ⅱ";renderPublic()};audio.onpause=()=>{$("play").textContent="▶";renderPublic()};audio.onended=()=>{if(active+1<published.length)play(active+1)};
async function loadDraft(){if(!client){$("note").textContent=ok?"Supabase konnte nicht geladen werden. Bitte Internetverbindung prüfen und Seite neu laden.":"Bitte zuerst Supabase einrichten (Anleitung in README.txt).";return}let {data,error}=await client.from("chapters_draft").select("*").order("sort_order");if(error){$("note").textContent="Datenbank noch nicht eingerichtet. Siehe README.txt.";return}draft=(data||[]).map(x=>({...x}));pending.clear();$("status").textContent="Entwurf geladen";renderDraft()}
function dirty(){ $("status").textContent="Ungespeicherte Änderungen" }
function renderDraft(){let root=$("editList");root.innerHTML="";draft.forEach((c,i)=>{let row=document.createElement("div");row.className="edit";let arrows=document.createElement("div");arrows.className="arrows";let up=document.createElement("button");up.textContent="↑";up.disabled=i===0;up.onclick=()=>move(i,-1);let down=document.createElement("button");down.textContent="↓";down.disabled=i===draft.length-1;down.onclick=()=>move(i,1);arrows.append(up,down);
let fields=document.createElement("div");fields.className="fields";let title=document.createElement("input");title.placeholder=`Abschnitt ${String(i+1).padStart(2,"0")}`;title.value=c.title||"";title.oninput=()=>{c.title=title.value;dirty()};let desc=document.createElement("input");desc.placeholder="Beschreibung (optional)";desc.value=c.description||"";desc.oninput=()=>{c.description=desc.value;dirty()};let fname=document.createElement("div");fname.className="fname";fname.textContent=c.file_name||"Noch keine Audiodatei";fields.append(title,desc,fname);
let actions=document.createElement("div");actions.className="actions";let replace=document.createElement("button");replace.textContent="Audio ändern";replace.onclick=()=>{let inp=document.createElement("input");inp.type="file";inp.accept="audio/*";inp.onchange=()=>{if(inp.files[0])setFile(i,inp.files[0])};inp.click()};let del=document.createElement("button");del.textContent="Löschen";del.onclick=()=>{draft.splice(i,1);dirty();renderDraft()};actions.append(replace,del);row.append(arrows,fields,actions);root.append(row)});if(!draft.length)root.innerHTML='<p class="muted small">Noch keine Abschnitte vorhanden.</p>'}
function move(i,d){[draft[i],draft[i+d]]=[draft[i+d],draft[i]];dirty();renderDraft()}
function leadingNumber(name){const match=String(name||"").match(/^\s*(\d+)/);return match?Number(match[1]):null}
function sortByFilenameNumber(){draft=draft.map((item,index)=>({...item,_originalIndex:index})).sort((a,b)=>{const na=leadingNumber(a.file_name),nb=leadingNumber(b.file_name);if(na!==null&&nb!==null)return na-nb;if(na!==null)return -1;if(nb!==null)return 1;return a._originalIndex-b._originalIndex}).map(({_originalIndex,...item})=>item)}
function setFile(i,f){draft[i].file_name=f.name;draft[i]._file=f;const tmp=new Audio();const tempUrl=URL.createObjectURL(f);tmp.preload="metadata";tmp.onloadedmetadata=()=>{draft[i].duration=fmt(tmp.duration);URL.revokeObjectURL(tempUrl);renderDraft()};tmp.onerror=()=>URL.revokeObjectURL(tempUrl);tmp.src=tempUrl;dirty();renderDraft()}
$("files").addEventListener("change",e=>{const selected=Array.from(e.currentTarget.files||[]);if(!selected.length)return;selected.forEach(f=>{draft.push({id:crypto.randomUUID(),title:f.name.replace(/\.[^.]+$/,""),description:"",file_name:f.name,file_path:"",duration:"",_file:f})});sortByFilenameNumber();dirty();renderDraft();$("note").textContent=`${selected.length} Audiodatei(en) ausgewählt. Jetzt „Änderungen speichern“ drücken, danach „Veröffentlichen“.`;e.currentTarget.value=""});
$("empty").onclick=()=>{draft.push({id:crypto.randomUUID(),title:"",description:"",file_name:"",file_path:"",duration:""});dirty();renderDraft()};
async function save(){if(!client){$("note").textContent="Supabase bitte zuerst einrichten.";return false}try{$("status").textContent="Speichert…";let rows=[];for(let i=0;i<draft.length;i++){let c=draft[i],path=c.file_path;if(c._file){let ext=(c._file.name.split(".").pop()||"mp3").toLowerCase();path=`${c.id}.${ext}`;let {error}=await client.storage.from("audio").upload(path,c._file,{upsert:true,contentType:c._file.type||"audio/mpeg"});if(error)throw error}if(!path)throw Error(`Abschnitt ${i+1}: Audiodatei fehlt.`);rows.push({id:c.id,title:c.title||`Abschnitt ${String(i+1).padStart(2,"0")}`,description:c.description||"",file_name:c.file_name||"",file_path:path,duration:c.duration||"",sort_order:i})}
let {error:de}=await client.from("chapters_draft").delete().gte("sort_order",0);if(de)throw de;if(rows.length){let {error}=await client.from("chapters_draft").insert(rows);if(error)throw error}draft=rows; $("status").textContent="Entwurf gespeichert";$("note").textContent="Gespeichert. Öffentlich bleibt weiterhin die zuletzt veröffentlichte Version.";renderDraft();return true}catch(e){$("status").textContent="Fehler";$("note").textContent="Speichern fehlgeschlagen: "+e.message;return false}}
$("save").onclick=save;
$("publish").onclick=async()=>{
  const button=$("publish");
  if(!client){$("note").textContent="Keine Verbindung zu Supabase. Bitte config.js prüfen.";return}
  button.disabled=true;
  button.textContent="Veröffentliche…";
  try{
    if(!draft.length) throw new Error("Es sind noch keine Kapitel in der Verwaltung. Bitte zuerst Audiodateien auswählen.");
    const saved=await save();
    if(!saved) throw new Error($("note").textContent||"Der Entwurf konnte nicht gespeichert werden.");
    const {data,error}=await client.from("chapters_draft").select("*").order("sort_order");
    if(error) throw new Error("Entwurf konnte nicht gelesen werden: "+error.message);
    const rows=data||[];
    if(!rows.length) throw new Error("Der Entwurf ist in Supabase leer. Die Veröffentlichung wurde abgebrochen.");
    const {error:delError}=await client.from("chapters_public").delete().gte("sort_order",0);
    if(delError) throw new Error("Alte Veröffentlichung konnte nicht ersetzt werden: "+delError.message);
    const {error:insertError}=await client.from("chapters_public").insert(rows);
    if(insertError) throw new Error("Kapitel konnten nicht veröffentlicht werden: "+insertError.message);
    const refreshed=await loadPublic();
    if(!refreshed) throw new Error("Die Kapitel wurden übertragen, aber die öffentliche Liste konnte nicht neu geladen werden.");
    if(published.length!==rows.length) throw new Error(`Kontrolle fehlgeschlagen: ${rows.length} Kapitel sollten veröffentlicht sein, aber ${published.length} wurden öffentlich geladen.`);
    active=-1;audio.pause();audio.removeAttribute("src");audio.load();renderPublic();
    $("status").textContent="Veröffentlicht";
    $("note").textContent=`Fertig! ${published.length} Kapitel sind veröffentlicht. Schließe dieses Fenster mit × – die öffentliche Liste wird beim Schließen nochmals aktualisiert.`;
  }catch(e){
    $("status").textContent="Veröffentlichung fehlgeschlagen";
    $("note").textContent=e.message||String(e);
    $("note").scrollIntoView({behavior:"smooth",block:"nearest"});
  }finally{button.disabled=false;button.textContent="Veröffentlichen"}
};
if(ok && !client){const msg="Supabase-Bibliothek wurde nicht geladen. Bitte Internetverbindung prüfen und die Seite neu laden.";$("current").textContent=msg;}
loadPublic();