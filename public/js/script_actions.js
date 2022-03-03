// arrays for getActionsOnBoard function
let actionChecklists = [];
let checkItemsList = [];
let checkItemsListIncomplete = [];
let checkItemsListDelayed = [];
let actions_to_print = [];

let fecha = new Date();

async function getActionsOnBoard() {
  // ID tablero GESTION RECLAMACIONES : 5d1f2656d29b04175a69af05
  // ID tableo MEJORA CONTINUA: 602cc768663c8e75a7af0222

  // ID tablero personal VT/QMM: 5ab90ce8c9f851bb28fb84fb

  // GET ALL CHECKLISTS FROM BOARD

  
  
  

  const board = "5d1f2656d29b04175a69af05";
  var board_id = localStorage.getItem("board_id");
  document.getElementById("board_id").innerHTML = board_id;
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
    // console.log(checklists);
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
            switch (checkitem.idMember) {
              case null:
                checkitem.idMember = "SIN ASIGNAR";
                break;
              case "5d075c062c8c0354ed5e6c9e":
                checkitem.idMember = "NURIA";
                break;
              case "5cf64fb8ba654f42ae7d5aaf":
                checkitem.idMember = "NOELIA";
                break;
              case "5ce7866d3e41274383daf2a0":
                checkitem.idMember = "JORDI";
                break;
              case "5cc02f09f1590d25ba244874":
                checkitem.idMember = "IVAN";
                break;
              case "5cbecf4d9c2ccf362a75ed72":
                checkitem.idMember = "JOAN";
                break;
              case "5caf5c6a453a312fd01f679e":
                checkitem.idMember = "RAUL";
                break;
              case "5c78d11bb67f0004e9514299":
                checkitem.idMember = "SERGIO";
                break;
              case "5b5872f9649295013a40ff14":
                checkitem.idMember = "MARCOS";
                break;
              case "5addf2a95286994a13a44561":
                checkitem.idMember = "BRUNO";
                break;
              case "5c8bcbebd7b95e4c477476e5":
                checkitem.idMember = "MATHEW";
                break;
            }

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
