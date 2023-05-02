const formSessao = document.querySelector('#formNovaSessao')
const formFatoRelevante = document.querySelector('#formFatoRelevante')
const idPaciente = localStorage.getItem("idPaciente")
let idPront = 0

usuarioLogado()
addCard(idPaciente,'')
pacienteSelecionado(idPaciente)

formSessao.addEventListener('submit', (submit) => {
    submit.preventDefault()


    if(!document.querySelector('#btnCriarSS').classList.contains('d-none')){
        const inputs = document.querySelectorAll('.nSessao')
        const radio = document.querySelector('input[name="ststusPagamento"]:checked').value
        criarSessao(inputs,radio,idPaciente)
    }
    
})
formFatoRelevante.addEventListener('submit', (submit) => {
    submit.preventDefault()

    if(!document.querySelector('#btnCriarFR').classList.contains('d-none')){
        const inputs = document.querySelectorAll('.nFatoRelevante')
        criarFatoRelevante(inputs,idPaciente)
    }
    
})


// funcões modal
function abrirModal(btnId,tipo,btn){
    const btnCriarFR = document.querySelector("#btnCriarFR")
    const btnEditarFR = document.querySelector("#btnEditarFR")
    const btnCriarSS = document.querySelector("#btnCriarSS")
    const btnEditarSS = document.querySelector("#btnEditarSS")


    if(tipo === "FR"){
        if(btn === "btnCriar"){
            btnCriarFR.classList.remove('d-none')
            btnEditarFR.classList.add('d-none')
        }
        else if(btn === "btnEditar"){
            btnCriarFR.classList.add('d-none')
            btnEditarFR.classList.remove('d-none')
        }
        editarCard(btnId)
        document.querySelector(`#modalFatoRelevante`).classList.remove('d-none')
        return
    }
    else if(tipo === "SS"){
        if(btn === "btnCriar"){
            btnCriarSS.classList.remove('d-none')
            btnEditarSS.classList.add('d-none')
        }
        else if(btn === "btnEditar"){
            btnCriarSS.classList.add('d-none')
            btnEditarSS.classList.remove('d-none')
        }
        editarCard(btnId)
        document.querySelector(`#modalNovaSessao`).classList.remove('d-none')
        return
    }

    btnId.classList.remove('d-none')

}
function fecharModal(btnId){
    btnId.classList.add('d-none')
}
function criarSessao(inputs,radio,id){
    const novoCard = {
        paciente: id,
        tipo: "sessao",
        data: inputs[0].value,
        dados: {
            inicio: inputs[1].value,
            fim: inputs[2].value,
            titulo: inputs[3].value,
            texto: inputs[4].value,
            pagamento: {
                valor: inputs[5].value,
                formaPagamento: inputs[6].value,
                estado: radio
            }
        }
    }
    metodoPost(novoCard)
}
function criarFatoRelevante(inputs,id){
    console.log(inputs)
    const novoCard = {
        paciente: id,
        tipo: "fatoRelevante",
        data: inputs[0].value,
        dados: {
            titulo: inputs[1].value,
            texto: inputs[2].value
        }
    }
    metodoPost(novoCard)
}

// funções dos cards
async function filtrarCard(){
    const filter = document.querySelector('#filtrarProntuario').value
    
    let dados = ''
    if(filter === ''){
        dados = await metodoGet(idPaciente,'')
    }
    else{
        dados = await metodoGet(idPaciente,`&dados.titulo=${filter}`)
    }
    const conteudo = document.querySelector('#conteudo')
    conteudo.innerHTML = ''

    // 

    let sessao = 0
    dados.forEach((dado,ind) => {
    
        if(dado.tipo == 'sessao'){sessao = sessao + 1}
        conteudo.innerHTML += `
        <div class="bg-white p-3 rounded-end shadow my-1 d-flex position-relative">
             <!-- BARRA LATERAL (MUDAR A COR) -->
             <div class="${dado.tipo == 'sessao' ? 'bg-arnia' : 'bg-primary'} position-absolute top-0 bottom-0 start-0">
                &nbsp;
             </div>
             <!-- ICONE E LINHA PARA CIMA (MUDAR A COR E A IMAGEM) -->
             <div>
                ${detalheCard(ind,dado)}
               <img src="../../src/prontuario/conteudo/${dado.tipo == 'sessao' ? 'mental-health.png' : 'Group1.png'}" alt="" class="position-absolute top-0 translate-middle" style="left: 3rem;">
             </div>
             <!-- CONTEUDO -->
             <div class="row col-12">
             <div class="dropdown d-flex justify-content-end">
             <button class="btn btn-secondary bg-transparent border-0 text-black" type="button" data-bs-toggle="dropdown" aria-expanded="false">
               ...
             </button>
             <ul class="dropdown-menu">
                 <div class="d-flex flex-column p-1">
                     <button onClick="abrirModal(${dado.id},'${dado.tipo == 'sessao' ? 'SS' : 'FR'}','btnEditar')" class="border-0 bg-transparent"><a class="dropdown-item text-primary d-flex  gap-2 align-items-center" href="#"><i class="fa-solid fa-pen" style="color: #2c5ee9;"></i>Editar</a></button>
                     <button onCLick="excluirSessao(${dado.id})" class="border-0 bg-transparent"><a class="dropdown-item text-danger d-flex  gap-2 align-items-center" href="#"><i class="fa-solid fa-trash-can" style="color: #f43e3e;"></i>Excluir</a></button>
                 </div>
             </ul>
           </div>
                <div class="pe-0">
                    <p class="fw-bold fs-5 m-0">${dado.tipo == 'sessao' ? 'Sessão ' : 'Fato Relevante '}<span class="${dado.tipo == 'sessao' ? '' : 'd-none'}">${sessao}</span></p>
                    <p class="" style="font-size: 0.8rem;">${converterData(dado.data)}</p>
                    <p class="text-break">${dado.dados.texto}<button onClick="abrirDetalhes(${dado.id},${sessao})" class="border-0 bg-transparent text-primary ${dado.tipo == 'sessao' ? 'd-flex' : 'd-none'}">Ver mais</button></p>
                </div>
            </div>
        </div>
    `
    });
    

}
async function addCard(id,filter){

    let dados = ''
    if(filter === ''){
        dados = await metodoGet(id,'')
    }
    else{
        dados = await metodoGet(id,`&tipo=${filter}`)
    }
    const conteudo = document.querySelector('#conteudo')
    conteudo.innerHTML = ''

    // 

    let sessao = 0
    dados.forEach((dado,ind) => {
    
        if(dado.tipo == 'sessao'){sessao = sessao + 1}
        conteudo.innerHTML += `
        <div class="bg-white p-3 rounded-end shadow my-1 d-flex position-relative">
             <!-- BARRA LATERAL (MUDAR A COR) -->
             <div class="${dado.tipo == 'sessao' ? 'bg-arnia' : 'bg-primary'} position-absolute top-0 bottom-0 start-0">
                &nbsp;
             </div>
             <!-- ICONE E LINHA PARA CIMA (MUDAR A COR E A IMAGEM) -->
             <div>
                ${detalheCard(ind,dado)}
               <img src="../../src/prontuario/conteudo/${dado.tipo == 'sessao' ? 'mental-health.png' : 'Group1.png'}" alt="" class="position-absolute top-0 translate-middle" style="left: 3rem;">
             </div>
             <!-- CONTEUDO -->
             <div class="row col-12">
             <div class="dropdown d-flex justify-content-end">
             <button class="btn btn-secondary bg-transparent border-0 text-black" type="button" data-bs-toggle="dropdown" aria-expanded="false">
               ...
             </button>
             <ul class="dropdown-menu">
                 <div class="d-flex flex-column p-1">
                     <button onClick="abrirModal(${dado.id},'${dado.tipo == 'sessao' ? 'SS' : 'FR'}','btnEditar')" class="border-0 bg-transparent"><a class="dropdown-item text-primary d-flex  gap-2 align-items-center" href="#"><i class="fa-solid fa-pen" style="color: #2c5ee9;"></i>Editar</a></button>
                     <button onCLick="excluirSessao(${dado.id})" class="border-0 bg-transparent"><a class="dropdown-item text-danger d-flex  gap-2 align-items-center" href="#"><i class="fa-solid fa-trash-can" style="color: #f43e3e;"></i>Excluir</a></button>
                 </div>
             </ul>
           </div>
                <div class="pe-0">
                    <p class="fw-bold fs-5 m-0">${dado.tipo == 'sessao' ? 'Sessão ' : 'Fato Relevante '}<span class="${dado.tipo == 'sessao' ? '' : 'd-none'}">${sessao}</span></p>
                    <p class="" style="font-size: 0.8rem;">${converterData(dado.data)}</p>
                    <p class="text-break">${dado.dados.texto}<button onClick="abrirDetalhes(${dado.id},${sessao})" class="border-0 bg-transparent text-primary ${dado.tipo == 'sessao' ? 'd-flex' : 'd-none'}">Ver mais</button></p>
                </div>
            </div>
        </div>
    `
    });
    

}
function exibirCard(id){
    const dropdownFilter = document.querySelector('#dd-filter')
    if(id === "todos"){
        dropdownFilter.innerText = "Todos"
        addCard(idPaciente,'')
    }
    else if(id === "sessao"){
        dropdownFilter.innerText = "Sessão"
        addCard(idPaciente,'sessao')
    }
    else if(id === "fatoRelevante"){
        dropdownFilter.innerText = "Fatos Relevantes"
        addCard(idPaciente,'fatoRelevante')
    }
    



}
async function editarCard(prontId,tipo,btn){
    const respostaApi = await fetch(`http://localhost:3000/prontuarios/${prontId}`)
    const dados = await respostaApi.json()

    if(dados.tipo === "sessao"){
        // PEGAR OS INPUTS E PREENCHER COM OS DADOS!!
        const form = document.querySelector('#formNovaSessao')
        const inputs = document.querySelectorAll('.nSessao')
        inputs[0].value = dados.data
        inputs[1].value = dados.dados.inicio
        inputs[2].value = dados.dados.fim
        inputs[3].value = dados.dados.titulo
        inputs[4].value = dados.dados.texto
        inputs[5].value = dados.dados.pagamento.valor
        if(dados.dados.pagamento.formaPagamento === 1){
            inputs[6].value = 1
        }
        else if(dados.dados.pagamento.formaPagamento === 2){
            inputs[6].value = 2
        }
        else{
            inputs[6].value = 3
        }

        if(dados.dados.pagamento.estado === "true"){
            inputs[7].setAttribute('checked',1)
        }
        else{
            inputs[8].setAttribute('checked',1)
        }
       
        form.addEventListener('submit', ()=>{
            const editCard = {
                paciente: dados.paciente,
                tipo: "sessao",
                data: inputs[0].value,
                dados: {
                    inicio: inputs[1].value,
                    fim: inputs[2].value,
                    titulo: inputs[3].value,
                    texto: inputs[4].value,
                    pagamento: {
                        valor: inputs[5].value,
                        formaPagamento: inputs[6].value,
                        estado: inputs[7]
                    }
                }
            }
            metodoPut(prontId,editCard)
        })


    }
    else if(dados.tipo === "fatoRelevante"){
        // PEGAR OS INPUTS E PREENCHER COM OS DADOS!!

        const form = document.querySelector('#formFatoRelevante')
        let inputs = document.querySelectorAll(".nFatoRelevante")
        inputs[0].value = dados.data
        inputs[1].value = dados.dados.titulo
        inputs[2].value = dados.dados.texto

        form.addEventListener('submit', () => {
            const editCard = {
                paciente: dados.paciente,
                tipo: "fatoRelevante",
                data: inputs[0].value,
                dados: {
                    titulo: inputs[1].value,
                    texto: inputs[2].value
                }
            }
            metodoPut(prontId,editCard)
        })
       
    }
}
function detalheCard(ind,dado){
    if(ind > 0){
        return `
        <div class="position-relative border">
            <div class="${dado.tipo == 'sessao' ? 'bg-arnia' : 'bg-primary'} position-absolute" style="top: -4.5rem; left: 1.8rem; height: 2rem; width: 0.16rem;">
                &nbsp;
            </div>
        </div>
        `
    }
    else{
        return ''
    }
}
function converterData(data){
    const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    let dados = data.split('-').reverse()
    let mes

    for(let i = 0; i < dados[1]; i++){
        mes = meses[i]
    }
    
    return (`${dados[0]} de ${mes} de ${dados[2]}`)
}
function usuarioLogado(){
    const nomeDoUsuario = document.querySelector('#nomeDoUsuario')
    const emailDoUsuario = document.querySelector('#emailDoUsuario')

    nomeDoUsuario.innerText = localStorage.getItem("nome");
    emailDoUsuario.innerText = localStorage.getItem("email");
}


// api
async function metodoPut(id,editCard){
    await fetch(`http://localhost:3000/prontuarios/${id}`, {
        method: "PUT",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editCard)
      });
}
async function metodoPost(post){
    await fetch("http://localhost:3000/prontuarios", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    });
  }
async function metodoGet(id,filter){
    const respostaApi = await fetch(`http://localhost:3000/prontuarios?paciente=${id}${filter}`)
    return await respostaApi.json()
  }
async function excluirSessao(id){
    await fetch(`http://localhost:3000/prontuarios/${id}`, {
         method: 'DELETE' });
    window.location.replace('http://127.0.0.1:5500/page/prontuario/index.html')
}

//prontuarios
function abrirDetalhes(id,sessao){
    localStorage.setItem("idDetalhes", id);
    localStorage.setItem("numeroDaSessao", sessao )
    window.location.replace('http://127.0.0.1:5500/page/detalhes/sessao.html')
}
async function pacienteSelecionado(id){
    const apiResponse = await fetch(`http://localhost:3000/pacientes?id=${id}`)
    const dados = await apiResponse.json()
    const asideInfo = document.querySelector('#asideInfo')

    asideInfo.querySelector('#NomeDoPaciente').innerText = dados[0].nome
    asideInfo.querySelector('#NascimentoPaciente').innerText = dados[0].outro.nascimento
    asideInfo.querySelector('#profissaoPaciente').innerText = dados[0].outro.profissao
    asideInfo.querySelector('#escolaridadePaciente').innerText = dados[0].outro.escolaridade

}



