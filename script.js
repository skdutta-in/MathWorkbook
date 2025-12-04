// ---------------- LEVEL ----------------
function getLevel() {
  const lvlSelect = document.getElementById("level");
  if(!lvlSelect) return "easy"; // fallback
  return lvlSelect.value;
}

// ---------------- WORKSHEET GENERATOR ----------------
function generateWorksheet() {
  updateLevelDisplay();
  horizontalAdd();
  horizontalSub();
  horizontalMul();
  horizontalDiv();

  verticalAdd();
  verticalSub();
  verticalMul();

  longDivision();
  loadMini();
}

// ---------------- HORIZONTAL ----------------
function horizontalAdd() {
  const level = getLevel();
  let min, max;

  if(level==="easy"){ min=5; max=20; }
  else if(level==="medium"){ min=10; max=99; }
  else { min=100; max=999; }

  fill("add", () => `${r(min,max)} + ${r(min,max)} = ___________`);
}

function horizontalSub() {
  const level = getLevel();
  let min, max;

  if(level==="easy"){ min=5; max=20; }
  else if(level==="medium"){ min=10; max=99; }
  else { min=100; max=999; }

  fill("sub", () => {
    let a = r(min,max);
    let b = r(min,a); // no negative
    return `${a} - ${b} = ___________`;
  });
}

function horizontalMul() {
  const level = getLevel();
  let min, max, min1, max1;

  if(level==="easy"){ min=2; max=9; min1=2; max1=6; }
  else if(level==="medium"){ min=5; max=9; min1=6; max1=9;}
  else { min=7; max=20; min1=2; max1=10;}

  fill("mul", () => `${r(min,max)} X ${r(min1,max1)} = ___________`);
}

function horizontalDiv() {
  const level = getLevel();
  let min, max;

  if(level==="easy"){ min=2; max=5; min1=2; max1=5;}
  else if(level==="medium"){ min=2; max=9; min1=2; max1=9;}
  else { min=5; max=10; min1=6; max1=20;}

  fill("div", () => {
    let b = r(min1,max1);
    let q = r(min,max);
    return `${b*q} ÷ ${b} = ___________`;
  });
}

// ---------------- VERTICAL ----------------
function verticalAdd() {
  const level = getLevel();
  let min, max;
  if(level==="easy"){ min=5; max=20; }
  else if(level==="medium"){ min=100; max=999; }
  else { min=100; max=999; }

  fillBlock("vadd", () => ({
    top: r(min,max),
    bottom: "+" + r(min,max)
  }));
}

function verticalSub() {
  const level = getLevel();
  let min, max;
  if(level==="easy"){ min=5; max=20; }
  else if(level==="medium"){ min=100; max=999; }
  else { min=100; max=999; }

  fillBlock("vsub", () => {
    let a = r(min,max);
    let b = r(min,a);
    return { top: a, bottom: "-" + b };
  });
}

function verticalMul() {
  const level = getLevel();
  let min, max;
  if(level==="easy"){ min=2; max=9; min1=2; max1=9;}
  else if(level==="medium"){ min=10; max=99; min1=6; max1=9;}
  else { min=10; max=99; min1=10; max1=99;}

  MulfillBlock("vmul", () => {
    let a = r(min,max);
    let b = r(min1,max1);
    return { top: a, bottom: "X " + b };
  }, false);
}

// ---------------- LONG DIVISION ----------------
function longDivision() {
  const level = getLevel();
  let minDividend, maxDividend;

  if(level==="easy"){ minDividend=100; maxDividend=200; }
  else if(level==="medium"){ minDividend=100; maxDividend=999; }
  else { minDividend=100; maxDividend=999; }

  let out = "";
  for(let i=0;i<6;i++){
    let d = r(2,9);
    let q = r(2,9);
    let n = r(minDividend, maxDividend);
    out += `
      <div>
        <div class="division-text">${d})${n}(</div>
        <div class="division-space"></div>
      </div>
    `;
  }
  document.getElementById("longdiv").innerHTML = out;
}

// ---------------- MINI QUESTIONS ----------------
async function loadMini() {
  try {
    const level = getLevel();
    let res = await fetch("./mini.json");
    let data = await res.json();

    // if your JSON has levels, filter here, else random pick
    let pick = data.sort(()=>0.5-Math.random()).slice(0,8);

    let out="<ol>";
    pick.forEach(q => out+=`<li>${q.replace("____","__________")}</li>`);
    out+="</ol>";

    document.getElementById("mini").innerHTML = out;
  }
  catch(err) {
    document.getElementById("mini").innerHTML="Mini questions failed to load.";
    console.error(err);
  }
}

// ---------------- HELPERS ----------------
function fill(id, fn) {
  let out = "";
  for(let i=0;i<6;i++)
    out+=`<div class="row">${fn()}</div>`;
  document.getElementById(id).innerHTML=out;
}

function fillBlock(id, fn, doubleLine=false){
  let out="";
  for(let i=0;i<5;i++){
    let p = fn();
    out += `
      <div class="problem">
        <div class="num">${p.top}</div>
        <div class="num">${p.bottom}</div>
        <div class="line"></div>
        ${doubleLine?'<div class="line"></div>':''}
        <div class="answer"></div>
      </div>
    `;
  }
  document.getElementById(id).innerHTML=out;
}


function MulfillBlock(id, fn, doubleLine=false){
  
const level = getLevel();
if(level==="hard"){

  let out="";
  for(let i=0;i<3;i++){
    let p = fn();
    out += `
      <div class="problem">
        <div class="num">${p.top}</div>
        <div class="num">${p.bottom}</div>
        <div class="line"></div>
        ${doubleLine?'<div class="line"></div>':''}
                    <br><br>
        <div class="answer"></div>
        <div class="answer"></div>
      </div>
    `;
  }
  document.getElementById(id).innerHTML=out;
    }

    else {

  let out="";
  for(let i=0;i<5;i++){
    let p = fn();
    out += `
      <div class="problem">
        <div class="num">${p.top}</div>
        <div class="num">${p.bottom}</div>
        <div class="line"></div>
        ${doubleLine?'<div class="line"></div>':''}
        <div class="answer"></div>
      </div>
    `;
  }
  document.getElementById(id).innerHTML=out;

      }


}



function updateLevelDisplay() {
  const lvl = getLevel();
  let text = "";

  if(lvl === "easy") text = "Difficulty Level: EASY";
  else if(lvl === "medium") text = "Difficulty Level: MEDIUM";
  else if(lvl === "hard") text = "Difficulty Level: HARD";

  document.getElementById("levelDisplay").innerText = text;
}




function r(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

// ---------------- LOAD EASY BY DEFAULT ----------------
window.onload = function(){
  if(document.getElementById("level")) document.getElementById("level").value="medium";
  generateWorksheet();
};
