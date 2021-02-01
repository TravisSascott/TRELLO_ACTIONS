
cards_in_actions = [];
checklists_id = [];
checklists_name = [];
checkitems_id = [];
actions = [];
current_board = '5d1f2656d29b04175a69af05'; // Gestión NQ clientes
current_list = '';



async function getTrelloOpenBoards() {
    //let url = 'https://api.trello.com/1/boards/5d1f2656d29b04175a69af05?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68';
    
    // get all the cards in list ACCIONES and store in global cards_in_action

cards_in_actions = [];
checklists_id = [];
checklists_name = [];
checkitems_id = [];
actions = [];
    
    try {

        let url = 'https://api.trello.com/1/boards/' + current_board + '/cards?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68';
        let res = await fetch(url);
        let cards = await res.json();
        let html = '';
            try{
                c= 1;
                cards.forEach(card => {

                    let html = `<div class="alert alert-primary text-center"><h5>Actualmente hay ${c}  tarjetas en el tablero </h5></div>`;

                     //html == htmlSegment;
                     console.log(c);
                    cards_in_actions.push([card.id,card.name,card.url]);
                    let container = document.querySelector('.container_1');
                    container.innerHTML = html;
                    c++;
                    });

                }catch (err){
                    document.getElementById("error").innerHTML = err.message;
                }
        } catch (error) {
        console.log(error);
    }
    console.log("cards with actions: " + cards_in_actions.length);

    // get all checklists named ACCIONES from global cards_in_actions
    
    try {

                c = 1;
                for (i=0;i<cards_in_actions.length;i++){

                
                let url = 'https://api.trello.com/1/cards/'+ cards_in_actions[i][0] + '/checklists?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68';
                let res = await fetch(url);
                let checklists = await res.json();
                let html = '';
                    try{
                        //c = 1;
                        checklists.forEach(checklist => {

                            
                            console.log(c);
                            if (checklist.name == 'ACCIONES'){
                                let html = `<div class="alert alert-info text-center"><h5>Identificando <b>CHECKLISTS</b> con acciones ${c}</h5></div>`;
                                c++;
                                checklists_id.push([checklist.id,cards_in_actions[i][0],cards_in_actions[i][1],cards_in_actions[i][2]]);
                                //console.log(checklists_id[0][0]);
                                //checklists_name.push([checklist.name,cards_in_actions[i]]);
                                let container = document.querySelector('.container_2');
                                container.innerHTML = html;
                                
                                
                            }
                            
                                     
                            });

                        }catch (err){
                            document.getElementById("error").innerHTML = err.message;
                        }
                }
                } catch (error) {
                console.log(error);
    }
    console.log("Checklists obtained: " + checklists_name.length); 
    console.table(checklists_id);                       


    //get all items id within checklist_id
    //checkitems_id content a bidimensional array [item_id, list_id]

    try {

                c = 1;
                for (i=0;i<checklists_id.length;i++){

                
                let url = 'https://api.trello.com/1/checklists/'+ checklists_id[i][0] + '/checkitems?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68';
                let res = await fetch(url);
                let checkitems = await res.json();
                let html = '';
                    try{
                        checkitems.forEach(checkitem => {
                            
                                let html = `<div class="alert alert-primary text-center"><h5>Cargando todas las <b>ACCIONES</b> ${c}</h5></div>`;
                                checkitems_id.push([checkitem.id,checklists_id[i][0],checklists_id[i][1],checklists_id[i][2],checklists_id[i][3]]);
                                let container = document.querySelector('.container_3');
                                container.innerHTML = html;
                                c++;
                                  
                            });

                        }catch (err){
                            document.getElementById("error").innerHTML = err.message;
                        }
                }
                } catch (error) {
                console.log(error);
    }
    console.log("Check Items obtained: " + checkitems_id.length);
    console.log("Lst item id: " + checkitems_id[checkitems_id.length-1][0] + " within list id: " + checkitems_id[checkitems_id.length-1][1]);  
    console.table(checkitems_id);


    // finally get the details from each checkitems
    try {

                //actions.push(['ID','ACCION','ESTADO', 'RESPONSABLE','FECHA']);
                c = 1;
                a = 0;
                ce = 0;
                s = 0;
                actions = [];

                for (i=0;i<checkitems_id.length;i++){

                
                let url = 'https://api.trello.com/1/checklists/'+ checkitems_id[i][1] + '/checkitems/' + checkitems_id[i][0] + '?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68';
                //console.log(url);
                let res = await fetch(url);
                let accion = await res.json();
                let html = '';
                    try{
                        
                           
                                if (accion.due==null){accion.due='1901-01-01'}
                                if (accion.state=='incomplete'){accion.state='ABIERTA';a++}else{accion.state='CERRADA';ce++}
                                switch (accion.idMember){
                                    case null:
                                        accion.idMember='SIN ASIGNAR';
                                        s++;
                                        break;
                                    case '5d075c062c8c0354ed5e6c9e':
                                        accion.idMember='NURIA';
                                        break;
                                    case '5cf64fb8ba654f42ae7d5aaf':
                                        accion.idMember='NOELIA';
                                        break;
                                    case '5ce7866d3e41274383daf2a0':
                                        accion.idMember='JORDI';
                                        break;
                                    case '5cc02f09f1590d25ba244874':
                                        accion.idMember='IVAN';
                                        break;
                                    case '5cbecf4d9c2ccf362a75ed72':
                                        accion.idMember='JOAN';
                                        break;
                                    case '5caf5c6a453a312fd01f679e':
                                        accion.idMember='RAUL';
                                        break;
                                    case '5c78d11bb67f0004e9514299':
                                        accion.idMember='SERGIO';
                                        break;
                                    case '5b5872f9649295013a40ff14':
                                        accion.idMember='MARCOS';
                                        break;
                                    case '5addf2a95286994a13a44561':
                                        accion.idMember='BRUNO';
                                        break;
                                }

                                //actions.push([checkitem.id,checkitem.state,checkitem.due,checkitem.idMember,checkitem.idChecklist]);
                                let html = `<div class="alert alert-success text-center"><h5>Actualizando ESTADOS y creando tabla de <b>ACCIONES</b>:  ${c}</h5></div>`;
                                actions.push([accion.due.substr(0,10),checkitems_id[i][3],accion.name,accion.state, accion.idMember,accion.id,accion.idChecklist,checkitems_id[i][2],checkitems_id[i][4]]);
                                let container = document.querySelector('.container_4');
                                container.innerHTML = html;
                                c++;

                                  
                            

                        }catch (err){
                            document.getElementById("error").innerHTML = err.message;
                        }
                }


                let html = '';
                let container = document.querySelector('.container_2');
                container.innerHTML = html;
                
                container = document.querySelector('.container_3');
                container.innerHTML = html;
                
                container = document.querySelector('.container_4');
                container.innerHTML = html;
                html = `<div class="alert alert-success text-center"><h5><b>ACCIONES:</b>  ${c}     &#32&#32&#32       ABIERTAS: ${a}  &#32&#32&#32      CERRADAS: ${ce}    &#32&#32&#32    SIN ASIGNAR: ${s}</h5></div>`;
                
                container = document.querySelector('.container_1');
                container.innerHTML = html;

                } catch (error) {
                console.log(error + ' ' + i);

                
    }
    //console.log("Total Actions: " + actions.length);
    //console.log("Lst item id: " + checkitems_id[checkitems_id.length-1][0] + " within list id: " + checkitems_id[checkitems_id.length-1][1]);  
    //console.table(actions);
    //createTable(actions);

    $(document).ready(function() {
    $('#t_open').DataTable( {
        destroy: true,
        data: actions,
        columns: [
            { title: "FECHA" , width : "5%"},
            { title: "NQ", width: "5%"},
            { title: "ACCIÓN" , width: "65%"},
            { title: "ESTADO" , width: "5%"},
            { title: "RESP.", width: "5%" },
            { title: "TARJETA ID"},
            { title: "CHECKLIST ID"},
            { title: "CARD ID"},
            { title: "URL", width: "15%"}
        ],
        colReorder: true
        
    } );
    
    var mitabla = $('#t_open').DataTable();
    $('#t_open tbody').on( 'click', 'td', function (){
        if (mitabla.cell(this).data().substr(0,4)=="http"){
        window.open (mitabla.cell(this).data());
    }
    });
    // Hide two columns
    mitabla.columns( [5,6,7] ).visible( false );

} );


}

// https://api.trello.com/1/checklists/5f2bac97ef9fe76aeee2daa5/checkitems/5f9a83887bebef3bf618d3b3?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68'

// 5f9a838fab7110223466f48c


//https://api.trello.com/1/checklists/5f58f211e14f8f08f208085c/checkitems/5f904e5b7d31138e311d3db2?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68

