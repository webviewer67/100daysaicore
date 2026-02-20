<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🔥 100 Day AI Coach Pro Max Ultra</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
<style>
body{
  margin:0;
  font-family:'Poppins',sans-serif;
  background:linear-gradient(135deg,#141e30,#243b55);
  color:white;
}
.container{
  max-width:520px;
  margin:auto;
  padding:15px;
  position:relative;
}
.calendar{
  position:absolute;
  right:15px;
  top:10px;
  font-size:24px;
  cursor:pointer;
}
.card{
  background:rgba(255,255,255,0.08);
  backdrop-filter:blur(10px);
  padding:20px;
  border-radius:20px;
  margin-top:15px;
}
button,input,select{
  width:100%;
  padding:12px;
  margin-top:10px;
  border-radius:12px;
  border:none;
  font-size:15px;
  font-weight:bold;
  cursor:pointer;
}
button{
  background:#ff416c;
  color:white;
}
button:hover{
  opacity:0.9;
}
progress{
  width:100%;
  height:15px;
  margin-top:10px;
}
#xpBar{
  height:12px;
  background:#333;
  border-radius:10px;
  overflow:hidden;
  margin-top:10px;
}
#xpFill{
  height:100%;
  width:0%;
  background:linear-gradient(90deg,#00f260,#0575e6);
  transition:width 0.6s ease;
}
.badge{
  display:inline-block;
  background:#ffcc00;
  color:black;
  padding:5px 10px;
  border-radius:20px;
  font-size:12px;
  margin:5px 5px 0 0;
}
.notification{
  position:fixed;
  right:10px;
  top:50%;
  background:#00c853;
  padding:12px;
  border-radius:10px;
  display:none;
}
#leaderboard{
  margin-top:15px;
  background:rgba(255,255,255,0.05);
  padding:10px;
  border-radius:12px;
}
</style>
</head>
<body>

<div class="container">

<div class="calendar" onclick="showHistory()">📅</div>

<h2 id="welcome">Welcome</h2>

<!-- SETUP -->
<div id="setup" class="card">
<input id="nameInput" placeholder="Your Name">
<input id="ageInput" type="number" placeholder="Your Age">

<select id="goalInput">
<option value="">Select Goal</option>
<option value="weight loss">Weight Loss</option>
<option value="muscle gain">Muscle Gain</option>
<option value="healthy lifestyle">Healthy Lifestyle</option>
<option value="productivity">Productivity</option>
</select>

<select id="personalityInput">
<option value="hardcore">Hardcore 🔥</option>
<option value="balanced">Balanced ⚖️</option>
<option value="chill">Chill 🌿</option>
</select>

<button onclick="startApp()">Start Challenge</button>
</div>

<!-- APP -->
<div id="app" style="display:none;">

<div class="card">
<h3 id="day">Day 1 / 100</h3>
<progress id="progressBar" max="100" value="1"></progress>

<h4>Level <span id="levelText">1</span></h4>
<div id="xpBar"><div id="xpFill"></div></div>

<h3>🎯 Daily Task</h3>
<p id="dailyTask">Loading...</p>
<div id="extraTasks"></div>

<button onclick="completeDay()">Complete Day ✅</button>
<button onclick="askAI()">Ask AI Coach 🤖</button>

<div id="aiResponse"></div>

<h3>🏅 Achievements</h3>
<div id="achievements"></div>

<h3>🌟 Leaderboard</h3>
<div id="leaderboard"></div>

</div>
</div>

<div id="notify" class="notification"></div>

<script>
const setup=document.getElementById("setup");
const app=document.getElementById("app");
const welcome=document.getElementById("welcome");
const dayEl=document.getElementById("day");
const progressBar=document.getElementById("progressBar");
const dailyTask=document.getElementById("dailyTask");
const extraTasks=document.getElementById("extraTasks");
const achievementsEl=document.getElementById("achievements");
const levelText=document.getElementById("levelText");
const xpFill=document.getElementById("xpFill");
const notify=document.getElementById("notify");
const aiResponse=document.getElementById("aiResponse");
const leaderboardEl=document.getElementById("leaderboard");

let userData=JSON.parse(localStorage.getItem("eliteAIData"))||{};

function saveLocal(){ localStorage.setItem("eliteAIData",JSON.stringify(userData)); }

function showNotify(msg){ notify.innerText=msg; notify.style.display="block"; setTimeout(()=>{notify.style.display="none";},2500); }

function startApp(){
  userData.name=nameInput.value.trim();
  userData.age=ageInput.value.trim();
  userData.goal=goalInput.value;
  userData.personality=personalityInput.value;
  userData.day=userData.day||1;
  userData.streak=userData.streak||0;
  userData.level=userData.level||1;
  userData.xp=userData.xp||0;
  userData.achievements=userData.achievements||[];
  userData.weeklyBossPoints=userData.weeklyBossPoints||0;

  saveLocal();
  setup.style.display="none";
  app.style.display="block";
  loadApp();
  generateDailyTask();
}

function loadApp(){
  welcome.innerText="Welcome "+userData.name;
  dayEl.innerText="Day "+userData.day+" / 100";
  progressBar.value=userData.day;
  levelText.innerText=userData.level;
  xpFill.style.width=Math.min(100,(userData.xp/(userData.level*200)*100))+"%";
  renderAchievements();
  renderLeaderboard();
}

async function generateDailyTask(){
  aiResponse.innerText="Generating task...";
  try{
    const res=await fetch("/.netlify/functions/ai",{
      method:"POST",
      body:JSON.stringify({type:"daily",name:userData.name,goal:userData.goal,personality:userData.personality,day:userData.day})
    });
    const result=await res.json();
    dailyTask.innerText=result.reply;

    extraTasks.innerHTML="<h4>📋 Extra Tasks</h4>• Stay consistent<br>• Small improvements";

    if(result.events.includes("LEVEL_UP")) showNotify("🎉 LEVEL UP!");
    if(result.events.includes("BOSS_UNLOCK")) showNotify("🔥 Weekly Boss Unlocked!");
    if(result.events.includes("ACHIEVEMENT_UNLOCK")) showNotify("🏅 Achievement Unlocked!");
    
    userData.achievements=result.achievements;
    userData.streak=result.streak;
    userData.level=result.level;
    userData.xp=result.xp;
    userData.weeklyBossPoints=result.weeklyBossPoints;

    saveLocal();
    loadApp();
  }catch(err){ aiResponse.innerText="AI error. Try again.";}
}

async function completeDay(){
  const now=Date.now();
  if(userData.lastComplete && now-userData.lastComplete<86400000){
    alert("Come back tomorrow 🔥"); return;
  }
  userData.day++;
  userData.lastComplete=now;
  saveLocal();
  await generateDailyTask();
}

async function askAI(){
  const question=prompt("Ask your AI Coach:");
  if(!question) return;
  aiResponse.innerText="Thinking...";
  try{
    const res=await fetch("/.netlify/functions/ai",{
      method:"POST",
      body:JSON.stringify({type:"assistant",name:userData.name,goal:userData.goal,personality:userData.personality,question:question})
    });
    const result=await res.json();
    aiResponse.innerText=result.reply;

    userData.achievements=result.achievements;
    userData.streak=result.streak;
    userData.level=result.level;
    userData.xp=result.xp;
    userData.weeklyBossPoints=result.weeklyBossPoints;

    saveLocal();
    loadApp();
  }catch(err){ aiResponse.innerText="AI error. Try again.";}
}

function renderAchievements(){
  achievementsEl.innerHTML="";
  if(userData.achievements){
    userData.achievements.forEach(a=>{ achievementsEl.innerHTML+=`<span class="badge">${a}</span>`; });
  }
}

function renderLeaderboard(){
  leaderboardEl.innerHTML="";
  if(userData.leaderboard){
    userData.leaderboard.forEach((u,i)=>leaderboardEl.innerHTML+=`${i+1}. ${u.id} - ${u.score}<br>`);
  }
}

function showHistory(){ alert(userData.tasks ? userData.tasks.join("\n") : "No history yet."); }

if(localStorage.getItem("eliteAIData")){ setup.style.display="none"; app.style.display="block"; loadApp(); generateDailyTask(); }
</script>

</body>
</html>
