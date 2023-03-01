const form = document.querySelector("#form-search");
const moneda = document.querySelector("#moneda");
const criptomoneda = document.querySelector("#criptomonedas");
const formcontainer = document.querySelector(".forms");
const contaieranswer = document.querySelector(".container-answer");

const objBusqueda = {

moneda : '',
criptomoneda : ''

}

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptos();

    form.addEventListener('submit' , submitForm);
    moneda.addEventListener('change', getValue);
    criptomoneda.addEventListener('change', getValue);


})


function submitForm(e){
    e.preventDefault();
    const {moneda , criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){ 
        showError('"seleccione ambos campos" '); 
        
         
        return;
    }


    consultarAPI(moneda, criptomoneda);
    /* console.log(moneda);
    console.log(criptomoneda); */
}

function consultarAPI(moneda, criptomoneda){
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch(url)
        .then(resultado => resultado.json())
        .then(resultadoJson => {
            mostrarCotizacion(resultadoJson.DISPLAY[criptomoneda][moneda]);
        })
        .catch(error => console.log(error));
}

function mostrarCotizacion(data){
    clearHTML();
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = data;
    const answer = document.createElement('div');
    answer.classList.add('display-info');
    answer.innerHTML = `
    
        <p class="price">Precio: <span>${PRICE}</span></p>
        <p>Precio mas alto del dia: <span>${HIGHDAY}</span></p>
        <p>Precio mas bajo del dia: <span>${LOWDAY}</span></p>
        <p>Variacion de precio ultimas 24 hs: <span>${CHANGEPCT24HOUR}%</span></p>
        <p>Ultima actualizacion: <span>${LASTUPDATE}</span></p>
    `;
    contaieranswer.appendChild(answer);
}

function showError(mensaje){
    const error = document.createElement('p');
    error.classList.add("error");
    error.textContent = mensaje;
    formcontainer.appendChild(error); 
    setTimeout(() => error.remove(),3000);
}


function getValue(e){

    objBusqueda[e.target.name] = e.target.value;
}

function consultarCriptos(){
    const url='https://min-api.cryptocompare.com/data/top/mktcapfull?limit=25&tsym=USD';
    fetch (url)
        .then(respuesta => respuesta.json())
        .then(respuestaJson => {
            selectCriptos(respuestaJson.Data);
            /* console.log(respuestaJson.Data); */
    })
    .catch(error => console.log(error));

}

function selectCriptos(criptos){
    criptos.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo; 
        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;
        criptomoneda.appendChild(option);
    });
}
function clearHTML(){
    contaieranswer.innerHTML = '';
}