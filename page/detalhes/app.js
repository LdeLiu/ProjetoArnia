const idSessao = localStorage.getItem("idDetalhes")
const Sessao = localStorage.getItem("numeroDaSessao")

usuarioLogado()

document.querySelector('#tituloDaSessao').innerText = (`Sessão ${Sessao}`)
dados()

async function dados(){
    const respostaApi = await fetch(`http://localhost:3000/prontuarios?id=${idSessao}`)
    const dados = await respostaApi.json()

    document.querySelector('#dataDaSessao').innerText = (`${converterData(dados[0].data)}`)
    document.querySelector('#detalheDaSessao').innerText = (`${dados[0].dados.texto}`)
    document.querySelector('#valorDaSessao').innerText = (`R$${dados[0].dados.pagamento.valor}`)
    document.querySelector('#metodoPagamento').innerText = (`${await verificarPagamento(dados[0])}`)
    document.querySelector('#estadoPagamento').innerText = (dados[0].dados.pagamento.estado == "true" ? 'Pago' : 'Não Pago')
}

async function verificarPagamento(dados){
    if(dados.dados.pagamento.formaPagamento === "1"){
        return "PIX"
    }
    else if(dados.dados.pagamento.formaPagamento === "2"){
        return "Cartão"
    }
    else{
        return "Dinheiro"
    }
}

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
async function excluirSessao(id){
    await fetch(`http://localhost:3000/prontuarios/${id}`, {
         method: 'DELETE' });
    window.location.replace('http://127.0.0.1:5500/page/prontuario/index.html')
}
function usuarioLogado(){
    const nomeDoUsuario = document.querySelector('#nomeDoUsuario')
    const emailDoUsuario = document.querySelector('#emailDoUsuario')

    nomeDoUsuario.innerText = localStorage.getItem("nome");
    emailDoUsuario.innerText = localStorage.getItem("email");
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

// funções modal
function abrirModal(){
    const modal = document.querySelector('#modalNovaSessao')


    editarCard(idSessao)
    modal.classList.remove('d-none')


}
function fecharModal(btnId){
    btnId.classList.add('d-none')
}
async function editarCard(prontId){
    const respostaApi = await fetch(`http://localhost:3000/prontuarios/${prontId}`)
    const dados = await respostaApi.json()

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
            const radioChecked = document.querySelector('input[name="ststusPagamento"]:checked');
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
                        estado: radioChecked.value
                    }
                }
            }
            
            metodoPut(prontId,editCard)
        })  
}
