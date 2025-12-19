window.addEventListener('load', ()=>{
    const card = document.querySelector('.card');
    setTimeout(() =>{
        card.classList.add('show');
    }, 50);
});

const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const settings = document.getElementById("settings");

let currentPriority = "medium";

function setPriority(p){
  currentPriority = p;
}

input.addEventListener("keydown",function(e){
    if (e.key==="Enter"){
        addTask();  
    }
});


function addTask(){
  const text = input.value.trim();
  if (!text){ 
    alert('Add a task!');
    return;}

  const li = document.createElement("li");

  li.dataset.priority = currentPriority;
  li.dataset.text = text.toLowerCase();
  li.dataset.time = Date.now();

  const left = document.createElement("div");
  left.className = "task-left";

  const box = document.createElement("div");
  box.className = "box " + currentPriority;
  box.onclick = () => li.classList.toggle("done");

  const span = document.createElement("span");
  span.textContent = text;

  const del = document.createElement("span");
  del.className = "delete";
  del.textContent = "✕";
  del.onclick = () => {li.remove();
    saveTasks();
  }

  left.append(box,span);
  li.append(left,del);
  list.appendChild(li);
  setTimeout(()=>{
      li.classList.add("show");
  }, 10); 

  input.value = "";
}


function sortTasks(){
  const items=Array.from(list.children);
  const sortType = document.getElementById("sortSelect").value;

  if(sortType ==="alpha"){
    items.sort((a,b) =>
      a.dataset.text.localeCompare(b.dataset.text)
    );
  } else if(sortType==="priority"){
    const order = { high: 1, medium: 2, low: 3 };

    items.sort((a,b)=>
      order[a.dataset.priority]-order[b.dataset.priority]
    );
  }
  else if (sortType==="date"){
    items.sort((a,b) =>
      a.dataset.time-b.dataset.time 
    );
  }

  items.forEach(item => list.appendChild(item));
}

window.addEventListener('load',() =>{
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        inputBox.value = task; 
        addTask(); 
    });
});

window.addEventListener('load',() =>{
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task =>{
        input.value = task.text;  
        currentPriority = task.priority; 
        addTask();  
        const lastLi = list.lastChild;
        if (task.done) lastLi.classList.add("done"); 
    });
});

function saveTasks(){
    const tasks=[];
    list.querySelectorAll("li").forEach(li =>{
        const span = li.querySelector(".task-left span");
        tasks.push({
            text: span.textContent,
            priority: li.dataset.priority,
            done: li.classList.contains("done")
        });
    });
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

const originalAddTask = addTask;
addTask = function(){
    originalAddTask();  
    saveTasks();      
};

list.addEventListener("click",(e) =>{
    if (e.target.classList.contains("box")){
        saveTasks();
    }
});


function openSettings(){
  settings.style.display="block";
}

function closeSettings(){
  settings.style.display="none";
}

function setTheme(t){
    const theme = document.documentElement;
    theme.classList.remove("light", "dark", "blue");
    if(t==="light") theme.classList.add("light");
    else if(t==="dark") theme.classList.add("dark");
    else if(t==="blue") theme.classList.add("blue");
}
