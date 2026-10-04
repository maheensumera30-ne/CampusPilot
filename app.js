const $ = id => document.getElementById(id);

let tasks = JSON.parse(localStorage.getItem("campuspilot_tasks") || "null") || [
  {text:"Finish DBMS ER diagram",priority:"high",done:false},
  {text:"Revise correlation formulas",priority:"medium",done:false},
  {text:"Complete SE requirements notes",priority:"high",done:false},
  {text:"Practice binary tree questions",priority:"low",done:false}
];

function showSection(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.remove("active"));
  $(id).classList.add("active");
  const btn=document.querySelector(`[data-section="${id}"]`);
  if(btn) btn.classList.add("active");
  const titles={dashboard:"Good evening 👋",attendance:"Attendance, without the guesswork.",planner:"Let's turn pressure into a plan.",tasks:"Your workload, under control.",focus:"Deep work starts now."};
  $("pageTitle").textContent=titles[id];
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.section)));
$("quickPlanBtn").addEventListener("click",()=>{showSection("planner");generatePlan();});

function calculateAttendance(){
  const a=Number($("attended").value), t=Number($("total").value);
  const per=Number($("perDay").value), days=Number($("daysLeft").value);
  const current=a/t*100, futureClasses=per*days;
  const finalIfAttendAll=(a+futureClasses)/(t+futureClasses)*100;
  const target=.75;
  const minAttendNeeded=Math.max(0,Math.ceil(target*(t+futureClasses)-a));
  const maxMiss=Math.max(0,futureClasses-minAttendNeeded);
  $("attResult").textContent=current.toFixed(2)+"%";
  $("attMessage").textContent = finalIfAttendAll>=75 ? `You can recover to ${finalIfAttendAll.toFixed(2)}% if you attend every remaining class.` : "Even perfect attendance will not reach 75% in the remaining window.";
  $("attDetails").innerHTML=`
    <div>Classes remaining: <b>${futureClasses}</b></div>
    <div>Minimum classes to attend: <b>${Math.min(futureClasses,minAttendNeeded)}</b></div>
    <div>Maximum classes you can miss: <b>${maxMiss}</b></div>
    <div>Safe recommendation: <b>${maxMiss===0?"Attend every class":"Keep at least "+Math.max(0,maxMiss-1)+" classes as your leave buffer."}</b></div>`;
  updateDashboard(current);
}
function updateDashboard(att){
  $("dashAttendance").textContent=att.toFixed(0)+"%";
  $("attendanceStatus").textContent=att<75?"Needs attention":att<80?"Watch zone":"Safe zone";
  const score=Math.max(40,Math.min(98,Math.round(55+(att-65)*1.8)));
  $("healthScore").textContent=score;
  $("healthMeter").style.width=score+"%";
  $("healthText").textContent=score<65?"High academic pressure.":score<78?"You're in a manageable zone.":"You're in a strong zone.";
}
calculateAttendance();

function renderRecommendations(){
  const open=tasks.filter(t=>!t.done);
  const recs=[];
  if(Number($("attended").value)/Number($("total").value)<.75) recs.push(["Protect attendance","Your attendance is below the 75% target.","ATTENDANCE"]);
  open.filter(t=>t.priority==="high").slice(0,2).forEach(t=>recs.push([t.text,"High-priority task — do this before low-effort work.","HIGH"]));
  recs.push(["25-minute focus sprint","Start one timer. Momentum matters more than motivation.","FOCUS"]);
  $("recommendations").innerHTML=recs.slice(0,4).map(r=>`<div class="rec"><span><b>${r[0]}</b><small>${r[1]}</small></span><span class="tag">${r[2]}</span></div>`).join("");
}
function renderTasks(){
  $("taskList").innerHTML=tasks.map((t,i)=>`
    <div class="task ${t.done?"done":""}">
      <div class="check" onclick="toggleTask(${i})">${t.done?"✓":""}</div>
      <div class="task-main"><b>${escapeHtml(t.text)}</b><small>Added to your adaptive workload</small></div>
      <span class="priority ${t.priority}">${t.priority}</span>
      <button class="text-btn" onclick="deleteTask(${i})">×</button>
    </div>`).join("");
  $("dashTasks").textContent=tasks.filter(t=>!t.done).length;
  localStorage.setItem("campuspilot_tasks",JSON.stringify(tasks));
  renderRecommendations();
}
function addTask(){
  const text=$("taskInput").value.trim(); if(!text)return;
  tasks.unshift({text,priority:$("taskPriority").value,done:false});
  $("taskInput").value=""; renderTasks();
}
function toggleTask(i){tasks[i].done=!tasks[i].done;renderTasks()}
function deleteTask(i){tasks.splice(i,1);renderTasks()}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
renderTasks();

function generatePlan(){
  const mins=Number($("studyTime").value), energy=Number($("energy").value);
  const available=tasks.filter(t=>!t.done);
  const sorted=[...available].sort((a,b)=>{
    const p={high:3,medium:2,low:1}; return p[b.priority]-p[a.priority];
  });
  let used=0, out=[];
  const subjects=[
    {name:sorted[0]?.text||"Highest-priority assignment",base:50,reason:"deadline/risk first"},
    {name:sorted[1]?.text||"Revision block",base:40,reason:"protect consistency"},
    {name:energy>=7?"Practice questions":"Light review + notes",base:35,reason:"match your energy"},
    {name:"Break + reset",base:15,reason:"prevent fatigue"}
  ];
  subjects.forEach((s,i)=>{
    if(used>=mins)return;
    const dur=Math.min(s.base,mins-used);
    if(dur>0){out.push(`<div class="plan-step"><div class="num">${i+1}</div><span><b>${escapeHtml(s.name)}</b><small>${dur} min • ${s.reason}</small></span></div>`);used+=dur;}
  });
  $("planOutput").innerHTML=out.join("") || "<p class='muted'>Add tasks to generate a plan.</p>";
}
generatePlan();

let seconds=25*60,timerId=null;
function drawTimer(){
  $("timer").textContent=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");
}
function toggleTimer(){
  if(timerId){clearInterval(timerId);timerId=null;$("timerBtn").textContent="Resume sprint";return}
  $("timerBtn").textContent="Pause sprint";
  timerId=setInterval(()=>{
    seconds--;
    drawTimer();
    if(seconds<=0){clearInterval(timerId);timerId=null;seconds=5*60;$("timerBtn").textContent="Start break";alert("Sprint complete! Take a 5-minute break.");drawTimer();}
  },1000);
}
function resetTimer(){clearInterval(timerId);timerId=null;seconds=25*60;$("timerBtn").textContent="Start sprint";drawTimer()}
drawTimer();
