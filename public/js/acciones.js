
var t = TrelloPowerUp.iframe();

var cards_list = []; // [card.id,card.idBoard,card.idList,card.dateLastActivity.substr(0,10), card.badges.checkItemsChecked,card.name]
//checklists_id = [];
var checklists_list = [];
var checkitems_list = [];
var items_to_chart = [];
var items_to_table = [];
current_board = '5d1f2656d29b04175a69af05'; // Gestión NQ clientes
//inp_boards= ['5dce9f2b894e8e7279bfcc11']
inp_boards= ['5dce9f2b894e8e7279bfcc11','5fb50dab335fed6e1b2034ba','5fb50e57727475751b4076f2']
current_list = '';
hoy = new Date();
inp_to_sync = 0;
viejo = Date.parse('2020-01-01');  //limit the data to 2021

mi_atributo = "";


// Function called when update button is clicked
// First we get the number of cards in boards always.  It is only three http request, no time consuming.
// Cards obtained are stored on all_cards as an array of objects
// Also a list of all id is stored on cards_array.  It will be used to check if new cards while uodating using method 'includes' from array.
// Second we try to load all_cards_local from localStorage variable
// If does not exist it means first sync and we change need_first_sync to true and record all_cards into all_cards_local via localStorage variable
// Then we call get TrelloChecklists passing array of object (all_Cards if first sync or new_cards if already exist local information)

async function getTrelloCards() {
 
   last_update = localStorage.getItem("last_update");

   //Obtain complete list of cards in the boards array 'inp_boards'
   // INPUT : boards array => inp_boards
   // OUTPUTS:
   //           1 - JSON object containing all cards in 'inp_boards' => cards
   //           2 - JS object containing selected data to pass to next stage => cards_list


    all_cards = [];  // Array of objects where put minimun info need per card (id,date,board,list)
    cards_array = [];  // a list array with all the cards id only.  Used to check if new cards when updating
    new_cards = []; //  a list array where we keep only the new cards after compare with card_array when updating
    //cubiertas =0;  //internal counter for testing
    //hilo = 0;  //internal counter for testing
    //laminacion = 0;  //internal counter for testing
    
    need_init_syncro = false ;  // boolean to know if first sync has been done or not
    

    c=0;
    for (i=0;i<inp_boards.length;i++){  //whe look in all boards from the array inp_boards

        try {  // get card info from a board and store in all_cards

            let url = 'https://api.trello.com/1/boards/' + inp_boards[i] + '/cards?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68';
            //console.log(url);
            let res = await fetch(url);
            let cards = await res.json();
            let html = '';
                try{
                    
                    cards.forEach(card  => {
                            all_cards.push({
                            card_id: card.id,
                            date: card.dateLastActivity.substr(0,10),
                            board: inp_boards[i],
                            lista: card.idList,
                            url: card.url
                            });
                            c++;
                            
                        
                            cards_array.push(  // a a list array to keep only card.id to check if new cards when updating
                                card.id);
                            });
                    }catch (err){
                        document.getElementById("error").innerHTML = err.message;
                    }
            } catch (error) {
            console.log(error);

        }
        
    }

    inp_to_sync = c;  // number of cards detected to sync

    
    // save all_card local in browser 
   all_cards_local= localStorage.getItem("all_cards_local");

   if (all_cards_local != null){
        all_cards_local= JSON.parse(localStorage.getItem("all_cards_local"));
        cards_array= JSON.parse(localStorage.getItem("all_cards_local_array"));
        if (all_cards_local.length < all_cards.length){
            nuevas = all_cards.length - all_cards_local.length;
            inp_to_sync = nuevas;
            alert ("Se han encontrado incidencias nuevas: " + nuevas);

           all_cards.forEach(new_card=>{
                if(cards_array.includes(new_card.card_id) == false ){
                                all_cards_local.push({
                                        card_id: new_card.card_id,
                                        date: new_card.date,
                                        board : new_card.board,
                                        lista : new_card.lista,
                                        url: new_card.url
                                        });
                                new_cards.push({
                                        card_id: new_card.card_id,
                                        date: new_card.date,
                                        board : new_card.board,
                                        lista : new_card.lista,
                                        url: new_card.url
                                        });
                }

           })

           localStorage.setItem("all_cards_local", JSON.stringify(all_cards_local));
           localStorage.setItem("last_update", Date.parse(hoy)); 
           //localStorage.setItem("new_cards_local", JSON.stringify(new_cards_local));
        }else{
             alert ("No hay incidencias nuevas...");
             localStorage.setItem("last_update", Date.parse(hoy)); 
             ultima = new Date(JSON.parse(localStorage.getItem("last_update")));
            data_container = document.querySelector('.fecha');
            data_container.innerHTML = "<b>ACTUALIZADO: " + ultima.toLocaleDateString();
             show_table();
        }

   }else{
        //console.log("està buit");
        let html = `<div class="alert alert-primary text-center"><h5>SINCRONIZANDO DATOS POR PRIMERA VEZ...</h5></div>`;
        let container = document.querySelector('.container_1');
        container.innerHTML = html;
        html = `<div class="alert alert-primary text-center"><h5>Se han cargado ${c}  INCIDENCIAS</h5></div>`;
        container = document.querySelector('.container_2');
        container.innerHTML = html;
        localStorage.setItem("all_cards_local", JSON.stringify(all_cards));
        localStorage.setItem("all_cards_local_array", JSON.stringify(cards_array));
        //console.log("...però ara ja no!");
        localStorage.setItem("last_update", Date.parse(hoy)); 
        need_init_syncro = true;
        ultima = new Date(JSON.parse(localStorage.getItem("last_update")));
        data_container = document.querySelector('.fecha');
        data_container.innerHTML = "<b>ACTUALIZADO: " + ultima.toLocaleDateString();
   }


    /////// loading checklists from current cards list


    //which list to update, first syncro or new cards??

    if (need_init_syncro == false){
        
        if (new_cards.length > 0){
            getTrelloCheckLists(new_cards);
            console.log("actualitzant targetes noves")
        }
     
    }else{
        
        getTrelloCheckLists(all_cards);
        console.log("syncro checkclist inicial")
    }
    

}




// First get local data checklists_list
// If exist we load local data on global checlists_list
// then we call trello api passing card.id to obtain checklists id and name
// and we push to checklists_list array of objects keepin info coming from card_list
// so we have now (id, date, noar, list, check_name, checklist.id)
// Finalyy we store it on all_checklist_local via localStorage variable
////////////////////////////////////////////////////////////////////
async function getTrelloCheckLists(cards){



    temp = JSON.parse(localStorage.getItem("checklists_list"));


    if (temp != null){
        checklists_list = temp;
    }


    c=0;
    for (i=0;i<cards.length;i++){

        

        try {

            let url = 'https://api.trello.com/1/cards/' + cards[i].card_id + '/checklists?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68';
            //console.log(url);
            let res = await fetch(url);
            let checklists = await res.json();
            let html = '';
                try{
                        checklists.forEach(checklist => {

                        

                        html = `<div class="alert alert-primary text-center"><h5>CARGANDO INP ${c+1} de ${inp_to_sync} </h5></div>`;
            
                        checklists_list.push({
                            card_id: cards[i].card_id,
                            date: cards[i].date,
                            board: cards[i].board,
                            list: cards[i].lista,
                            url: cards[i].url,
                            check_name: checklist.name,
                            check_id: checklist.id});
                        container = document.querySelector('.container_2');
                        container.innerHTML = html;
                        c++;
                        //console.log(checklists_list[c]);
                       
                    });
                    }catch (err){
                        document.getElementById("error").innerHTML = err.message;
                    }
            } catch (error) {
            console.log(error);
        }
        

    }


        //console.log("Ara hauria d'estar complert checklists_list, mirem que hi ha...");
        //console.log(checklists_list);
        localStorage.setItem("all_checklist_local", JSON.stringify(checklists_list));
        localStorage.setItem("last_update", Date.parse(hoy)); 
        
        getTrelloCheckItems(checklists_list);

}





async function getTrelloCheckItems(checklists_list){


    temp = JSON.parse(localStorage.getItem("items_to_chart_local"));

    if (temp != null){
        items_to_chart = temp;
    }


    c = 1;
    seccion='';
    item_id=400;

    for (i=0;i<checklists_list.length;i++){
        item_id += 1;
        let url = 'https://api.trello.com/1/checklists/'+ checklists_list[i].check_id + '/checkitems?key=8ec6c3e51ab6d8dd92e69f3e23582eff&token=07843a91cede6b50196f92983c9be337105fd5336071710ea779bf2f70063f68';
        let res = await fetch(url);
        let checkitems = await res.json();
        let html = '';
        try{
            checkitems.forEach(checkitem => {
                let html = `<div class="alert alert-primary text-center"><h5>Analizando todas las <b>CAUSAS</b> ${c} de las INP</h5></div>`;
                if ((checkitem.state == "complete") && (Date.parse(checklists_list[i].date)>=viejo) ){
                    //myitems.push([checklists_list[i][0],checklists_list[i][1],checklists_list[i][2],checklists_list[i][3],checklists_list[i][4],checklists_list[i][5],checklists_list[i][6],checklists_list[i][7],checkitem.name,checkitem.id]);
                    t1= '3';

                    //console.log(checklists_list[i].board);  

                    switch (checklists_list[i].board){

                        case '5dce9f2b894e8e7279bfcc11': //cubiertas
                            t2='1';
                            break;
                        case '5fb50dab335fed6e1b2034ba': //hilo
                            t2='2';
                            break;
                        case '5fb50e57727475751b4076f2': //laminación
                            t2='3';
                            break;
                    }  

                    switch (checklists_list[i].check_name){

                        case 'Calidad':
                            t3='1';
                            break;
                        case 'OF':
                            t3='2';
                            break;
                        case 'MÁQUINA':
                            t3='3';
                            break;
                        case 'AUXILIARES':
                            t3='4';
                            break;
                        case 'MATERIA PRIMA (ALAMBRÓN - AISLANTE)':
                            t3='5';
                            break;
                    } 

                    //console.log(d1+d2+d3);
                    dts=(t1+t2+t3).toString();
                    //dts= dt.toString();
                    items_to_chart.push({
                        id: item_id.toString(),
                        name: checkitem.name,
                        fecha: checklists_list[i].date,
                        parent: dts});

                    //console.log(d1+d2+d3);
                    //items_to_table.push([checklists_list[i].board, checkitem.name,checklists_list[i].date,checklists_list[i].list]);
                    items_to_table.push([item_id.toString(), checkitem.name,checklists_list[i].date,checklists_list[i].url]);

                    //contenido += '"' + seccion + ',' + checklists_list[i][6]+ ',' + checkitem.name + ';'+ '"';
                    container = document.querySelector('.container_2');
                    container.innerHTML = html + " dentro";
                    c++;
                } container = document.querySelector('.container_2');
                    container.innerHTML = html;
                    c++;
            });

        }catch (err){
            document.getElementById("error").innerHTML = err.message;
        }
    }

    localStorage.setItem("items_to_chart_local", JSON.stringify(items_to_chart));
    localStorage.setItem("table", JSON.stringify(items_to_table));
    localStorage.setItem("last_update", Date.parse(hoy)); 
    alert("SINCRONIZACIÓN FINALIZADA");
    show_table();
}




////////////////////////////////////////////////////////////////////

function circle_pack_all_data(container, id){

    colores_botones(id);

    ultima = new Date(JSON.parse(localStorage.getItem("last_update")));
    data_container = document.querySelector('.fecha');
    data_container.innerHTML = "<b>ACTUALIZADO: " + ultima.toLocaleDateString();


       temp = JSON.parse(localStorage.getItem("items_to_chart_local"));

        if (temp == null){
            alert ("No hay datos, iniciando sincronzación inicial...");
            getTrelloCards();
        } else{
            items_to_chart = temp;


            r = d3.groups(items_to_chart, d=> d.parent, d=> d.name);

            final = [];
            final_table= [];

            for (i=0; i < r.length ; i++){
                for (j=0; j < r[i][1].length ; j++){
                    final.push({id : r[i][1][j][0].substr(0,5) , name: r[i][1][j][1][0].name, count:r[i][1][j][1].length, parent:r[i][1][j][1][0].parent });
                }
            }

            final.unshift({id: "331", name: "CALIDAD", count: null, parent: "213"});
            final.unshift({id: "332", name: "OF", count: null, parent: "213"});
            final.unshift({id: "333", name: "MÁQUINA", count: null, parent: "213"});
            final.unshift({id: "334", name: "AUX", count: null, parent: "213"});
            final.unshift({id: "335", name: "MATERIA PRIMA", count: null, parent: "213"});

            final.unshift({id: "321", name: "CALIDAD", count: null, parent: "212"});
            final.unshift({id: "322", name: "OF", count: null, parent: "212"});
            final.unshift({id: "323", name: "MÁQUINA", count: null, parent: "212"});
            final.unshift({id: "324", name: "AUX", count: null, parent: "212"});
            final.unshift({id: "325", name: "MATERIA PRIMA", count: null, parent: "212"});

            final.unshift({id: "311", name: "CALIDAD", count: null, parent: "211"});
            final.unshift({id: "312", name: "OF", count: null, parent: "211"});
            final.unshift({id: "313", name: "MÁQUINA", count: null, parent: "211"});
            final.unshift({id: "314", name: "AUX", count: null, parent: "211"});
            final.unshift({id: "315", name: "MATERIA PRIMA", count: null, parent: "211"});

            final.unshift({id: "211", name: "CUBIERTAS", count: null, parent: "111"});
            final.unshift({id: "212", name: "HILO", count: null, parent: "111"});
            final.unshift({id: "213", name: "LAMINACIÓN", count: null, parent: "111"});

            final.unshift({id: "111", name: "INP", count: null, parent: null});

            var treeData = d3.stratify()
            //.id( function( d ) { return d.name; })
            //.parentId( function( d ) { return d.parent; })
                .id( function( d ) { return d.id; })
                .parentId( function( d ) { return d.parent; })
              ( final );

            // assign the name to each node
            treeData.each( function( d ) {
                //console.log( d, d.id, d.name, d.count );
                //console.log( d.count );
            //d.name = d.id;
                d.id = d.data.name;
                d.name = d.data.name;
                d.count = d.data.count;
                d.parent = d.data.parent;
            });

            sun(container,treeData)

        }

}


function circle_pack_last(periodo, container, id){


    //console.log("antes de llamar colores");
    colores_botones(id);
    let hoy = new Date();
    //console.log(container);
    //console.log(periodo);

    switch (periodo){

        case 'semana':
            per = hoy.getTime()- 1000*60*60*24*10; 
            break;
        case 'mes':
            per=hoy.getTime()- 1000*60*60*24*30;
            break;
        case 'trimestre':
            per=hoy.getTime()- 1000*60*60*24*90;
            break;
        
    }
    //console.log(per);
    ultima = new Date(JSON.parse(localStorage.getItem("last_update")));
    data_container = document.querySelector('.fecha');
    data_container.innerHTML = "<b>ACTUALIZADO: " + ultima.toLocaleDateString();


    temp_items_to_chart= [];
    tempo = JSON.parse(localStorage.getItem("items_to_chart_local"));

    if (tempo == null){
        alert ("No hay datos, iniciando sincronzación inicial...");
        getTrelloCards();
    } else{


        //tempo = temp;


        tempo.forEach(item=>{
            //console.log(Date.parse(Date.now));
            //console.log(Date.now);
            //if((hoy.getTime()-Date.parse(item.fecha)) > per){
            if(per < Date.parse(item.fecha)){
                //console.log(hoy.getTime()-Date.parse(item.fecha));
                temp_items_to_chart.push({
                        id: item.id.toString(),
                        name: item.name,
                        fecha: item.fecha,
                        parent: item.parent});}

        })


        items_to_chart = temp_items_to_chart;


        r = d3.groups(items_to_chart, d=> d.parent, d=> d.name);

        final = [];
        final_table= [];

        for (i=0; i < r.length ; i++){
            for (j=0; j < r[i][1].length ; j++){
                final.push({id : r[i][1][j][0].substr(0,5) , name: r[i][1][j][1][0].name, count:r[i][1][j][1].length, parent:r[i][1][j][1][0].parent });
            }
        }

        final.unshift({id: "331", name: "CALIDAD", count: null, parent: "213"});
        final.unshift({id: "332", name: "OF", count: null, parent: "213"});
        final.unshift({id: "333", name: "MÁQUINA", count: null, parent: "213"});
        final.unshift({id: "334", name: "AUX", count: null, parent: "213"});
        final.unshift({id: "335", name: "MATERIA PRIMA", count: null, parent: "213"});

        final.unshift({id: "321", name: "CALIDAD", count: null, parent: "212"});
        final.unshift({id: "322", name: "OF", count: null, parent: "212"});
        final.unshift({id: "323", name: "MÁQUINA", count: null, parent: "212"});
        final.unshift({id: "324", name: "AUX", count: null, parent: "212"});
        final.unshift({id: "325", name: "MATERIA PRIMA", count: null, parent: "212"});

        final.unshift({id: "311", name: "CALIDAD", count: null, parent: "211"});
        final.unshift({id: "312", name: "OF", count: null, parent: "211"});
        final.unshift({id: "313", name: "MÁQUINA", count: null, parent: "211"});
        final.unshift({id: "314", name: "AUX", count: null, parent: "211"});
        final.unshift({id: "315", name: "MATERIA PRIMA", count: null, parent: "211"});

        final.unshift({id: "211", name: "CUBIERTAS", count: null, parent: "111"});
        final.unshift({id: "212", name: "HILO", count: null, parent: "111"});
        final.unshift({id: "213", name: "LAMINACIÓN", count: null, parent: "111"});

        final.unshift({id: "111", name: "INP", count: null, parent: null});

        var treeData = d3.stratify()
        //.id( function( d ) { return d.name; })
        //.parentId( function( d ) { return d.parent; })
            .id( function( d ) { return d.id; })
            .parentId( function( d ) { return d.parent; })
          ( final );

        // assign the name to each node
        treeData.each( function( d ) {
            
            d.id = d.data.name;
            d.name = d.data.name;
            d.count = d.data.count;
            d.parent = d.data.parent;
        });
        sun(container,treeData);
    }
    
}





//sun('.miarbol',treeData)






function show_table(){

var tempor = JSON.parse(localStorage.getItem("table"));

if (tempor != null){

    items_to_table = tempor;
}


    $(document).ready(function() {
        $('#hola').DataTable( {
            dom: 'BPlfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'],
            destroy: true,
            data: items_to_table,
            columns: [
                { title: "ID" },
                { title: "PROBLEMA"},
                { title: "FECHA" },
                { title: "URL"}

            ],
            colReorder: true,

            
        } );

       // var mitabla = $('#hola').DataTable();

   

});

}









/////////////////////////////////////////////////////
//  Empty localStorage  /////////////////////////////
/////////////////////////////////////////////////////

function purgar(){
    localStorage.clear();
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//  Choose which function to run depending if CTRL is pressed or not  /////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////



function update (){
                
    if (event.ctrlKey) {
    purgar();
    alert("Les dades s'han esborrat");
    } else {
    getTrelloCards();
    
    }
                
}



///////////////////////////////////////////////////////////////////////////////////////////////////
//  Draw Circle Pack using D3.js  /////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////



  
