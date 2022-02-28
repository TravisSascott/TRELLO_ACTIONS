actionChecklists = [];
checkItemsList = [];
checkItemsListIncomplete = [];
checkItemsListDelayed = [];

let fecha = new Date();

async function getActionsOnBoard() {
    // ID tablero GESTION RECLAMACIONES : 5d1f2656d29b04175a69af05
    // ID tableo MEJORA CONTINUA: 602cc768663c8e75a7af0222

    // ID tablero personal VT/QMM: 5ab90ce8c9f851bb28fb84fb

    // GET ALL CHECKLISTS FROM BOARD

    const board = "5ab90ce8c9f851bb28fb84fb";

    try {

        actionChecklists = [];
        checkItemsList = [];
        checkItemsListIncomplete = [];
        checkItemsListDelayed = [];

        let url = 'https://api.trello.com/1/boards/' + board + '/checklists?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68';
        console.log(url);
        let res = await fetch(url);
        let checklists = await res.json();
        // console.log(checklists);
        try {
            counter = 0;
            let html = `<div class="alert alert-primary text-center"><h5>IDENTIFICANDO TARJETAS CON ACCIONES </h5></div>`;
            checklists.forEach(checklist => {
                if (checklist.name == "ACCIONES") {
                    actionChecklists.push(checklist);
                    counter++;
                    //console.log(counter)
                    //console.log(actionChecklists);
                }
            });
            let container = document.querySelector('.container_1');
            container.innerHTML = html;
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }

    //get all items id within checklist list
    //checkitems_id content a bidimensional array [item_id, list_id]

    try {

        counter_all = 0;
        counter_incomplete = 0;
        for (i = 0; i < actionChecklists.length; i++) {
            let url = 'https://api.trello.com/1/checklists/' + actionChecklists[i].id + '/checkitems?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68';
            let res = await fetch(url);
            let checkitems = await res.json();
            // console.log(checkitems);
            let html = '';

            try {
                let html = `<div class="alert alert-primary text-center"><h5> RECOPILANDO ACCIONES </h5></div>`;
                checkitems.forEach(checkitem => {
                    // checkItemsList.push(checkitem, actionChecklists[1].idCard);
                    checkItemsList.push(checkitem);
                    counter_all++;
                    // console.log('checkitem #: ', counter);
                    if (checkitem.state == 'incomplete') {
                        checkItemsListIncomplete.push(checkitem);
                        counter_incomplete++;
                        let tempDate = new Date(checkitem.due);
                        // console.log(tempDate, fecha);
                        if (tempDate < fecha){
                            checkItemsListDelayed.push(checkitem);

                        }
                    }
                });
                let container = document.querySelector('.container_2');
                container.innerHTML = html;
            } catch (err) {
                console.log(err);
            }

            /*  try {
                 checkitems.forEach(checkitem => {
        
                     let html = `<div class="alert alert-primary text-center"><h5>Cargando todas las <b>ACCIONES</b> ${c}</h5></div>`;
                     checkitems_id.push([checkitem.id, checklists_id[i][0], checklists_id[i][1], checklists_id[i][2], checklists_id[i][3]]);
                     let container = document.querySelector('.container_3');
                     container.innerHTML = html;
                     c++;
        
                 });
        
             } catch (err) {
                 document.getElementById("error").innerHTML = err.message;
             } */

        };
        let html = `<div class="alert  text-center"><h5> TOTAL ACCIONES DEFINIDAS: ${checkItemsList.length} </h5></div>`;
        let container = document.querySelector('.container_3');
        container.innerHTML = html;
        html = `<div class="alert  text-center"><h5> ACCIONES INCOMPLETAS:  ${checkItemsListIncomplete.length} </h5></div>`;
        container = document.querySelector('.container_4');
        container.innerHTML = html;
        html = `<div class="alert  text-center"><h5> ACCIONES EN RETRASO: ${checkItemsListDelayed.length} </h5></div>`;
        container = document.querySelector('.container_5');
        container.innerHTML = html;
        console.log(actionChecklists);
        console.log("TOTAL ACCIONES DEFINIDAS: ", checkItemsList.length);
        console.log("ACCIONES INCOMPLETAS: ", checkItemsListIncomplete.length);
        console.log("ACCIONES EN RETRASO: ", checkItemsListDelayed.length)


    } catch (error) {
        console.log(error);
    }

    // console.log("Check Items obtained: " + checkitems.length);
    //console.log("Lst item id: " + checkitems_id[checkitems_id.length - 1][0] + " within list id: " + checkitems_id[checkitems_id.length - 1][1]);
    // console.log(checkItemsListIncomplete);



};