// arrays for getActionsOnBoard function
let actionChecklists = [];
let checkItemsList = [];
let checkItemsListIncomplete = [];
let checkItemsListDelayed = [];
let actions_to_print = [];
let members = [];
const board = localStorage.getItem("board_id");
let fecha = new Date();

async function getMembers(){
  try{
    
      let url =
      "https://api.trello.com/1/boards/" +
      board +
      "/members?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68";
    let res = await fetch(url);
    members = await res.json();
    //console.log("board members: ", members);
    //sessionStorage.setItem("members", members)
    members.forEach((member) =>{
      members.push([member.id, member.fullName]);
      console.log(member.id, member.fullName);
    })
    //console.log(members);
    
  
}catch(err){
    console.log(err);
  }
}

async function getActionsOnBoard() {
 
  
  try {
    actionChecklists = [];
    checkItemsList = [];
    checkItemsListIncomplete = [];
    checkItemsListDelayed = [];

    let url =
      "https://api.trello.com/1/boards/" +
      board +
      "/checklists?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68";
    console.log(url);
    let res = await fetch(url);
    let checklists = await res.json();
    console.log(checklists);
    try {
      let counter = 0;
      
      checklists.forEach((checklist) => {
        if (checklist.name == "ACCIONES") {
          actionChecklists.push(checklist);
          counter++;
          //console.log(counter)
          //console.log(actionChecklists);
          // actions.push([accion.due.substr(0, 10), checkitems_id[i][3], accion.name, accion.state, accion.idMember, accion.id, accion.idChecklist, checkitems_id[i][2], checkitems_id[i][4]]);
          checklist.checkItems.forEach((checkitem) => {
            if (checkitem.due == null) {
              checkitem.due = "1901-01-01";
            }
            if (checkitem.state == "incomplete") {
              checkitem.state = "ABIERTA";
            } else {
              checkitem.state = "CERRADA";
            }
            if (checkitem.idMember == null) {
              checkitem.idMember = "SIN ASIGNAR";
            }
            
            members.forEach((member)=>{
              if (checkitem.idMember == member.id){
                checkitem.idMember = member.fullName;
                
              };
            });
            
            actions_to_print.push([
              checkitem.due.substr(0, 10),
              checkitem.state,
              checkitem.idMember,
              checkitem.name,
              checklist.idCard,
            ]);
          });
        }
      });
      
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }

  //get all items id within checklist list
  //checkitems_id content a bidimensional array [item_id, list_id]

  // console.log("Check Items obtained: " + checkitems.length);
  //console.log("Lst item id: " + checkitems_id[checkitems_id.length - 1][0] + " within list id: " + checkitems_id[checkitems_id.length - 1][1]);
  // console.log(checkItemsListIncomplete);

  $(document).ready(function () {
    $("#t_open").DataTable({
      destroy: true,
      dom: "Bfrtip",
      buttons: ["copy", "csv", "excel", "pdf", "print"],
      data: actions_to_print,
      columns: [
        { title: "FECHA", width: "15%" },
        { title: "ESTADO", width: "10%" },
        { title: "RESP.", width: "10%" },
        { title: "ACCIÓN", width: "65%" },
        { title: "CARD ID" },
      ],
      colReorder: true,
    });

    var mitabla = $("#t_open").DataTable();
    $("#t_open tbody").on("click", "td", function () {
      if (mitabla.cell(this).data().length == 24) {
        window.open("https://trello.com/c/" + mitabla.cell(this).data());
      }
    });
    // Hide columns
    //mitabla.columns([5, 6, 7]).visible(false);
  });
}

async function getActionsOnBoard_filtered(filter) {
 
  
  try {
    actionChecklists = [];
    checkItemsList = [];
    checkItemsListIncomplete = [];
    checkItemsListDelayed = [];

    let url =
      "https://api.trello.com/1/boards/" +
      board +
      "/checklists?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68";
    console.log(url);
    let res = await fetch(url);
    let checklists = await res.json();
    console.log(checklists);
    try {
      let counter = 0;
      
      checklists.forEach((checklist) => {
        if (checklist.name == "ACCIONES") {
          actionChecklists.push(checklist);
          counter++;
          //console.log(counter)
          //console.log(actionChecklists);
          // actions.push([accion.due.substr(0, 10), checkitems_id[i][3], accion.name, accion.state, accion.idMember, accion.id, accion.idChecklist, checkitems_id[i][2], checkitems_id[i][4]]);
          checklist.checkItems.forEach((checkitem) => {
            if (checkitem.due == null) {
              checkitem.due = "1901-01-01";
            }
            if (checkitem.state == "incomplete") {
              checkitem.state = "ABIERTA";
            } else {
              checkitem.state = "CERRADA";
            }
            if (checkitem.idMember == null) {
              checkitem.idMember = "SIN ASIGNAR";
            }
            
            members.forEach((member)=>{
              if (checkitem.idMember == member.id){
                checkitem.idMember = member.fullName;
                
              };
            });
            
            switch (filter){
              case 'ABIERTA':
                if (checkitem.state== "ABIERTA"){
              
                  actions_to_print.push([
                    checkitem.due.substr(0, 10),
                    checkitem.state,
                    checkitem.idMember,
                    checkitem.name,
                    checklist.idCard,
                  ]);
                };
                break;
              case 'CADUCADA':
                if (checkitem.due < fecha){
                  actions_to_print.push([
                    checkitem.due.substr(0, 10),
                    checkitem.state,
                    checkitem.idMember,
                    checkitem.name,
                    checklist.idCard,
                  ]);
                }
            }
            
          });
        }
      });
      
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }

  //get all items id within checklist list
  //checkitems_id content a bidimensional array [item_id, list_id]

  // console.log("Check Items obtained: " + checkitems.length);
  //console.log("Lst item id: " + checkitems_id[checkitems_id.length - 1][0] + " within list id: " + checkitems_id[checkitems_id.length - 1][1]);
  // console.log(checkItemsListIncomplete);

  $(document).ready(function () {
    $("#t_open").DataTable({
      destroy: true,
      dom: "Bfrtip",
      buttons: ["copy", "csv", "excel", "pdf", "print"],
      data: actions_to_print,
      columns: [
        { title: "FECHA", width: "15%" },
        { title: "ESTADO", width: "10%" },
        { title: "RESP.", width: "10%" },
        { title: "ACCIÓN", width: "65%" },
        { title: "CARD ID" },
      ],
      colReorder: true,
    });

    var mitabla = $("#t_open").DataTable();
    $("#t_open tbody").on("click", "td", function () {
      if (mitabla.cell(this).data().length == 24) {
        window.open("https://trello.com/c/" + mitabla.cell(this).data());
      }
    });
    // Hide columns
    //mitabla.columns([5, 6, 7]).visible(false);
  });
}
