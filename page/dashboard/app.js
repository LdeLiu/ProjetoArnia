const formCriarPaciente = document.querySelector('#formNovoPaciente');
let idDoPaciente = 0

usuarioLogado()
exibirPacientes('')

formCriarPaciente.addEventListener('submit',(submit)=>{
    submit.preventDefault()

    const novoPaciente = document.querySelector('#modalNovoPaciente')
    novoPaciente.classList.add('d-none')
    const sucessoCadastro = document.querySelector('#modalCadastroConcluido')
    sucessoCadastro.classList.remove('d-none')

    const inputs = formCriarPaciente.querySelectorAll('input')
    const selects = formCriarPaciente.querySelectorAll('select')
    const btnCriar = document.querySelector('#btnCriarPaciente')

    const btnEnviar = document.querySelector('#enviarDados')
    btnEnviar.addEventListener('click', () =>{
        if(!btnCriar.classList.contains('d-none')){
            criandoCorpo(inputs, selects)
        }
        else{
            editandoCorpo(inputs, selects, idDoPaciente)
        }
    sucessoCadastro.classList.add('d-none')
    Location.reload()
    })
  
})


function filtrarUsuario(){
    const conteudo = document.querySelector('#conteudo')
    conteudo.innerHTML = ''

    // console.log(conteudo.childElementCount)
    let filtro = document.querySelector('#filtro').value 
    if(filtro == ''){
        exibirPacientes('')
        return
    }
    else{
        exibirPacientes(`?nome=${filtro}`)
    }
    

}
function usuarioLogado(){
    const nomeDoUsuario = document.querySelector('#nomeDoUsuario')
    const emailDoUsuario = document.querySelector('#emailDoUsuario')

    nomeDoUsuario.innerText = localStorage.getItem("nome");
    emailDoUsuario.innerText = localStorage.getItem("email");
}
async function exibirPacientes(req){
    const conteudo = document.querySelector('#conteudo')
    const pacientes = await metodoGet(`${req}`)
    console.log(pacientes)
    if(pacientes.length <= 0){
        conteudo.innerHTML = `<p class="alert alert-danger text-center p-2">Paciente não encontrado</p>`
        return
    }
    pacientes.forEach(paciente => {
        let tabelaCriada = criarTabelaPacientes(paciente)
        conteudo.innerHTML += tabelaCriada
    })
    
}
async function criandoCorpo(inputs,selects){
    const novoPost = {
        nome: inputs[1].value,
        cpf: inputs[0].value,
        outro: {
          nascimento: inputs[2].value,
          email: inputs[3].value,
          sexo: selects[0].value,
          nascionalidade: selects[1].value,
          naturalidade: inputs[4].value,
          profissao: inputs[5].value,
          escolaridade: inputs[6].value,
          estadoCivil: selects[2].value,
          nomeDaMae: inputs[7].value,
          nomeDoPai: inputs[8].value
          }
    }
    await metodoPost(novoPost)
  }
async function editandoCorpo(inputs,selects, id){
    const editPost = {
        nome: inputs[1].value,
        cpf: inputs[0].value,
        outro: {
          nascimento: inputs[2].value,
          email: inputs[3].value,
          sexo: selects[0].value,
          nascionalidade: selects[1].value,
          naturalidade: inputs[4].value,
          profissao: inputs[5].value,
          escolaridade: inputs[6].value,
          estadoCivil: selects[2].value,
          nomeDaMae: inputs[7].value,
          nomeDoPai: inputs[8].value
          }
    }
    await metodoPut(editPost,id)
  }
async function metodoPost(post){
    await fetch("https://projetoarnia.onrender.com/pacientes", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    });
  }
async function metodoGet(req){
    const apiResponse = await fetch(`https://projetoarnia.onrender.com/pacientes${req}`)
    return await apiResponse.json()
}
async function metodoDelete(id){
    await fetch(`https://projetoarnia.onrender.com/pacientes/${id}`, {
         method: 'DELETE' });
}
async function metodoPut(edit,id){
    await fetch(`https://projetoarnia.onrender.com/pacientes/${id}`, {
        method: "PuT",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(edit)
      });
}
function criarTabelaPacientes(entrada){
    return `
         <div class="container d-flex border border-top-0">
             <div class="col-2 p-1 ps-2  d-flex justify-content-center "><p class="text-secondary mb-0">${entrada.id}</p></div>
             <div class="col-4 p-1 ps-2  border-start "><button onClick="visializandoPaciente(${entrada.id})" class="text-secondary border-0 bg-transparent mb-0">${entrada.nome}</button></div>
             <div class="col-4 p-1 ps-2  border-start"><p class="text-secondary mb-0">${entrada.cpf}</p></div>
             <div class="col-2 p-1 ps-2  border-start d-flex justify-content-center"><p class="text-secondary mb-0">
                 <button onClick="prontuarioPaciente(${entrada.id})" class="p-1 px-2 border-success rounded"><i class="fa-solid fa-address-book" style="color: #195f17;"></i></i></button>
                 <button onClick="EditarPaciente(${entrada.id})" class="p-1 px-2 border-primary rounded"><i class="fa-solid fa-pen" style="color: #2c5ee9;"></i></button>
                 <button onClick="metodoDelete(${entrada.id})" class="p-1 px-2 border-danger rounded"><i class="fa-solid fa-trash-can" style="color: #f43e3e;"></i></button>
             </p></div>
         </div>
    `
}
function abrirModal(){
    const modal = document.querySelector('#modalNovoPaciente')
    modal.classList.remove('d-none')
}
function fecharModal(){
    const modal = document.querySelector('#modalNovoPaciente')
    modal.classList.add('d-none')

    const testeInputs = document.querySelector('#cPF').hasAttribute('disabled');
    if(testeInputs){
        const inputs = formCriarPaciente.querySelectorAll('input')
        const selects = formCriarPaciente.querySelectorAll('select')

        inputs.forEach(input => {
            input.removeAttribute('disabled')
        })
        selects.forEach(input => {
            input.removeAttribute('disabled')
        })
        const rodape = document.querySelector('.rodape')
        rodape.classList.remove('d-none')

    }
}

//botões que abrem o modal
function CriarPaciente(){
    const btnCriarPaciente = document.querySelector('#btnCriarPaciente')
    const btnEditarPaciente = document.querySelector('#btnEditarPaciente')

    btnCriarPaciente.classList.remove('d-none')
    btnEditarPaciente.classList.add('d-none')


    const inputs = formCriarPaciente.querySelectorAll('input')
    const selects = formCriarPaciente.querySelectorAll('select')

    inputs[0].value = ''
    inputs[1].value = ''
    inputs[2].value = ''
    inputs[3].value = ''
    inputs[4].value = ''
    inputs[5].value = ''
    inputs[6].value = ''
    inputs[7].value = ''
    inputs[8].value = ''

    selects[0].value = ''
    selects[1].value = ''
    selects[2].value = ''


    abrirModal()
}
async function EditarPaciente(id){
    idDoPaciente = id
    const data = await metodoGet(`/${id}`)
    
    const inputs = formCriarPaciente.querySelectorAll('input')
    const selects = formCriarPaciente.querySelectorAll('select')

    inputs[0].value = data.cpf
    inputs[1].value = data.nome
    inputs[2].value = data.outro.nascimento
    inputs[3].value = data.outro.email
    inputs[4].value = data.outro.naturalidade
    inputs[5].value = data.outro.profissao
    inputs[6].value = data.outro.escolaridade
    inputs[7].value = data.outro.nomeDaMae
    inputs[8].value = data.outro.nomeDoPai

    selects[0].value = data.outro.sexo
    selects[1].value = data.outro.nascionalidade
    selects[2].value = data.outro.estadoCivil
    
    
    const btnCriarPaciente = document.querySelector('#btnCriarPaciente')
    const btnEditarPaciente = document.querySelector('#btnEditarPaciente')
    btnEditarPaciente.classList.remove('d-none')
    btnCriarPaciente.classList.add('d-none')

    abrirModal()
}
function visializandoPaciente(id){

    const inputs = formCriarPaciente.querySelectorAll('input')
    const selects = formCriarPaciente.querySelectorAll('select')

    inputs.forEach(input => {
        input.setAttribute('disabled',1)
    })
    selects.forEach(input => {
        input.setAttribute('disabled',1)
    })

    const rodape = document.querySelector('.rodape')
    rodape.classList.add('d-none')
    EditarPaciente(id) //ja que o editar pacientes faz exatemente oq precisava, chamei ele aqui, porem com os campos bloqueados
}

//botão redirecionamento para prontuarios
function prontuarioPaciente(id){
    localStorage.setItem("idPaciente", id);
    window.location.replace('https://projeto-arnia-lvkb.vercel.app/page/prontuario/index.html')
}