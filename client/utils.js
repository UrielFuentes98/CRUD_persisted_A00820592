
function add_pokemon_to_grid() {
    let pokemon_name = document.getElementById("pokemon-name").value;
    let server_link = 'http://localhost:3000/' + pokemon_name;
    axios.get(server_link, {responseType: 'json'}).then(response => {
        if ("error" in response.data){
            document.getElementById("notFound").innerHTML = 'Pokemon not found.';
            inputError("pokemon-name");    
        } else{
            document.getElementById("notFound").innerHTML = null;
            removeErrorEl(document.getElementById("pokemon-name"));
            const weight = response.data.weight;
            const img_url = response.data.sprites.front_default;
            const id = response.data.id;
            const height = response.data.height;
            const base_ex = response.data.base_experience;
            const types = response.data.types;
            let new_entry = get_new_element(pokemon_name, id, weight, height, img_url, base_ex, types);
            document.getElementsByClassName("grid-container")[0].innerHTML += new_entry;
        }
        
      })
      .catch((response) => {
            document.getElementById("notFound").innerHTML = 'Server not found.';
            inputError("pokemon-name");
            console.log(response);
      })
}

function add_card() {
    let ID = document.getElementById("ID_new").value;
    let card_type = document.getElementById("type_sel").value;
    let card_value = document.getElementById("val_new").value;
    axios.post('http://localhost:3000/', null, {
        params: {ID, card_type, card_value}
    }).then(response => {
        console.log(response.data);
    }).catch(e => {
        console.log(e);
    });
}

function get_card() {
    let ID = document.getElementById("get_ID").value;
    axios.get('http://localhost:3000/', {
        params: {ID}
    }).then(response => {
            let type = response.data.type;
            let value = response.data.value;
            if (type != undefined){
                let result = 'type: ' + type + ', value: ' + value; 
                document.getElementById("get_result").innerHTML=result;
            }else{
                let result = 'Card not found.';
                document.getElementById("get_result").innerHTML=result;
            }
    }).catch(e => {
        console.log(e);
    });
}

function clear_get1(){
    document.getElementById("get_result").innerHTML = '';
}

function get_all() {
    axios.get('http://localhost:3000/', {
        params: {ID: "all"}
    }).then(response => {
        document.getElementById("json_results").textContent = JSON.stringify(response.data, undefined, 2);
        console.log(response.data);
    }).catch(e => {
        console.log(e);
    });   
}

function clear_all(){
    document.getElementById("json_results").textContent = ''
}

function update_card() {
    let ID = document.getElementById("update_ID").value;
    let value = document.getElementById("update_val").value;
    axios.put('http://localhost:3000/'+ID, {value}).then(response => {
        if (response.data == 'Not in cards'){
            console.log("Card not found.");
        }else{
            console.log("Card with ID = " + ID + " updated.");
        }
    }).catch(e => {
        console.log(e);
    });
}

function delete_card() {
    let ID = document.getElementById("delete_ID").value;
    axios.delete('http://localhost:3000/', {params: {ID}})
    .then(response => {
        if (response.data == 'Not in cards'){
            console.log("Card not found.");
        }else{
            console.log("Card with ID = " + ID + " deleted.");
        }
    }).catch(e => {
        console.log(e);
    });
}

function get_new_element(name, id, weight, height, img_url, base_ex, types) {
    let typeNames = "";
    types.forEach(element => {typeNames += " " + element.type.name + ","; });
    const typesF = typeNames.slice(0, -1);
    return `<div class="grid-item">
            <div class="text"><div> <strong>name:</strong> ${name}.</div>
            <div> <strong>id:</strong> ${id}.</div>
            <div> <strong>height:</strong> ${height}.</div>
            <div> <strong>weight:</strong> ${weight}.</div>
            <div> <strong>base_ex:</strong> ${base_ex}.</div>
            <div> <strong>types:</strong> ${typesF}.</div></div>
            <div><img src=${img_url}>
            <button class="remove-pokemon" onclick="remove_pokemon.call(this)" >remove</button>
            </div></div>`
}

function remove_pokemon () {
    this.parentNode.parentNode.remove();
  }

function removeErrorEl (element){
    if (element.classList.contains("error")){
      element.classList.remove("error");
    }
}
  
  
function inputError (id) {
    var element = document.getElementById(id);
    element.classList.add("error");
}