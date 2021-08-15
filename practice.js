let grid=document.querySelector(".grid");
let filters=document.querySelectorAll(".filter div");
let addbtn=document.querySelector(".add");
let deletebtn=document.querySelector(".delete");
let body=document.querySelector("body");
let uid = new ShortUniqueId();
let deleteState=false;
if (!localStorage.getItem("tasks")) {
   localStorage.setItem("tasks", JSON.stringify([]));
 }
let colors={
pink:"#d595aa",
blue:"#5ecdde",
green:"#91e6c7",
black:"black"
}
let colorArray=["pink","blue","green","black"];
let modalVisible=false;
deletebtn.addEventListener("click",function(e){
   if(deleteState){
      deleteState=false;
      e.currentTarget.classList.remove("delete-state");
   }else{
      deleteState=true;
      e.currentTarget.classList.add("delete-state");
   }
});
addbtn.addEventListener("click",function(){
if(modalVisible) return;
if(deletebtn.classList.contains("delete-state")){
   deleteState=false;
   deletebtn.classList.remove("delete-state") ;
}
   let modal=document.createElement("div");
   modal.classList.add("card");
   modal.setAttribute("click-first",true);
   modal.innerHTML=`<div class="left" contenteditable>Enter your Task</div>
   <div class="right">
       <div class="modal-filter pink"></div>
       <div class="modal-filter blue"></div>
       <div class="modal-filter green"></div>
       <div class="modal-filter black active-modal-filter "></div>
   </div>`;
   // let flag=false;
let left=modal.querySelector(".left");
left.addEventListener("click",function(e){
   if(modal.getAttribute("click-first")=="true"){
      // if(!flag){
   e.currentTarget.innerText="";
   modal.setAttribute("click-first",false);
   // flag=true;
   }
})
let modal_filter=modal.querySelectorAll(".modal-filter")
for(let i=0;i<modal_filter.length;i++){
   modal_filter[i].addEventListener("click",function(e){
      for(let j=0;j<modal_filter.length;j++){
         if(modal_filter[j].classList.contains("active-modal-filter"))
         modal_filter[j].classList.remove("active-modal-filter");

         e.currentTarget.classList.add("active-modal-filter");
      }
   })
}
left.addEventListener("keypress",function(e){
if(e.key=="Enter"){
   let task=e.currentTarget.innerText;
   let selectedModalFilter=document.querySelector(".active-modal-filter");
   let color=selectedModalFilter.classList[1];
   let ticket=document.createElement("div");
   let id=uid();
   ticket.classList.add("ticket");
   ticket.innerHTML=`<div class="ticket-color ${color}"></div>
   <div class="ticket-id">#${id}</div>
   <div class="ticket-box" contenteditable>${task}</div>`

   saveTicket(color,id,task);

    let ticketWritingArea=ticket.querySelector(".ticket-box");
    ticketWritingArea.addEventListener("input",ticketWritingAreaHandler);

   ticket.addEventListener("click",function(e){
      if(deleteState) {
         let id=e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
         let tasks=JSON.parse(localStorage.getItem("tasks")); 
         tasks=tasks.filter(function(el){
            return (el.id!=id);
         })
         localStorage.setItem("tasks",JSON.stringify(tasks));
         e.currentTarget.remove();}
   })
   let ticketcolor=ticket.querySelector(".ticket-color");
   ticketcolor.addEventListener("click",ticketcolorHandler)
   grid.appendChild(ticket);
   modal.remove();
   modalVisible=false;
}
})
   body.appendChild(modal);
   modalVisible=true;

});
for(let i=0;i<filters.length;i++){
   filters[i].addEventListener("click",function(e){
     
      if(e.currentTarget.parentElement.classList.contains("selected-filter")){
         e.currentTarget.parentElement.classList.remove("selected-filter");
         loadTickets();
      }
      else{
      for(let i=0;i<filters.length;i++){
         if(filters[i].parentElement.classList.contains("selected-filter"))
         filters[i].parentElement.classList.remove("selected-filter");
      }
      let color= e.currentTarget.classList[0].split("-")[0];
      e.currentTarget.parentElement.classList.add("selected-filter");
      loadTickets(color);
      }
   })
}
function saveTicket(color,id,task){
   let ticketInfo={color,id,task};
   let tasks=JSON.parse(localStorage.getItem("tasks"));
   tasks.push(ticketInfo);
   localStorage.setItem("tasks",JSON.stringify(tasks));
}
function ticketWritingAreaHandler(e){
   let ticketId=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
   let  taskArray=JSON.parse(localStorage.getItem("tasks"));
   let reqIndex=-1;
   for(let i=0;i<taskArray.length;i++){
if(taskArray[i].id==ticketId){
  reqIndex=i;
  break;
}
   }
   taskArray[reqIndex].task=e.currentTarget.innerText;
   localStorage.setItem("tasks",JSON.stringify(taskArray));
}
function ticketcolorHandler(e){
   let currentColor=e.currentTarget.classList[1];
   let index=colorArray.indexOf(currentColor);
   index++;
   index=index%4;
   let ticketId=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
  let  taskArray=JSON.parse(localStorage.getItem("tasks"));
  let reqIndex=-1;
  for(let i=0;i<taskArray.length;i++){
if(taskArray[i].id==ticketId){
 reqIndex=i;
 break;
}
  }
  
  
   e.currentTarget.classList.remove(currentColor);
   e.currentTarget.classList.add(colorArray[index]);

   taskArray[reqIndex].color=colorArray[index];
  localStorage.setItem("tasks",JSON.stringify(taskArray));
}
function loadTickets(passedColor){
   let allTickets=document.querySelectorAll(".ticket");
   for(let i=0;i<allTickets.length;i++) allTickets[i].remove();
   let tasks=JSON.parse(localStorage.getItem("tasks"))
console.log(tasks.length);
   for(let i=0;i<tasks.length;i++){
      let id=tasks[i].id;
      let color=tasks[i].color;
      let task=tasks[i].task;

      if(passedColor && passedColor!=color) continue;
      let ticket=document.createElement("div");
  
   ticket.classList.add("ticket");
   ticket.innerHTML=`<div class="ticket-color ${color}"></div>
   <div class="ticket-id">#${id}</div>
   <div class="ticket-box" contenteditable>${task}</div>`

   let ticketWritingArea=ticket.querySelector(".ticket-box");
   ticketWritingArea.addEventListener("input",ticketWritingAreaHandler);

   let ticketcolor=ticket.querySelector(".ticket-color");
  ticketcolor.addEventListener("click",ticketcolorHandler)

  ticket.addEventListener("click",function(e){
     if(deleteState) {
        let id=e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
        let tasks=JSON.parse(localStorage.getItem("tasks")); 
        tasks=tasks.filter(function(el){
           return (el.id!=id);
        })
        localStorage.setItem("tasks",JSON.stringify(tasks));
        e.currentTarget.remove();}
  });
  
  grid.appendChild(ticket);
   }
}
loadTickets();