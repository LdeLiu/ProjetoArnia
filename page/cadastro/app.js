//regex para verificar se senha tem numeros e letras
const regexSenha = /^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{8,15}$/;
//regex para verificar o email
const regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;


const formCadastro = document.querySelector('#formCadastro')
const main = document.querySelector('main')

formCadastro.addEventListener('submit', (submit) => {
    submit.preventDefault()

    async function cadastro(){
        let nome
        let email
        let senha
        let confSenha
        
        nome = formCadastro.querySelector('#name').value
        if(regexEmail.test(formCadastro.querySelector('#email').value) && await verificandoEmail(formCadastro.querySelector('#email').value)){
            email = formCadastro.querySelector('#email').value
            
            main.innerHTML = secondStepRegister()

            let novoFormCadastro = document.querySelector('#novoFormCadastro')
            novoFormCadastro.addEventListener('submit',(submit) => {
                submit.preventDefault()

                if(regexSenha.test(novoFormCadastro.querySelector('#password').value)){
                    senha = novoFormCadastro.querySelector('#password').value
                    confSenha = (senha === novoFormCadastro.querySelector('#confPassword').value)
                    if(confSenha){
                        criandoCorpo(nome,email,senha)
                        redirecionamento()
                    }
                    else{
                        alert("as senhas informadas devem ser iguais")
                    }
                }
                else{
                    alert('senha não atende aos requisitos minimos')
                }
            })
        }
        else{
            alert('O email inserido é invalido ou ja esta em uso')
        }

    
    }
    cadastro()

})


//funções--->
function secondStepRegister(){
    return(`
    <div class="container d-flex justify-content-center mt-5 "> 
        <div class="row col-6 bg-white shadow rounded-4 d-flex justify-content-center p-5 gap-3 ">
            <img src="../../src/cadastro/logo.png" class="img-fluid w-50" alt="logo, wexei">
            <div class="d-flex flex-column text-center"> 
                <p class="text-arnia fs-5 m-0 fw-medium">Seja bem-vindo(a)!</p>
                <p class="text-arnia fs-5 fw-light">Escolha uma senha</p>
            </div>
            <form id="novoFormCadastro" action="" class="d-flex flex-column justify-content-center gap-4 col-10 ">
                <div>
                    <label class="text-secondary-emphasis" for="password">Senha</label>
                    <div class=" input-group">
                        <input placeholder="" type="password" id="password" name="password" class="form-control rounded border p-2 ps-3">
                    </div>
                </div>
                <div>
                    <label class="text-secondary-emphasis" for="confPassword">Confirmar senha</label>
                    <div class=" input-group">
                        <input placeholder="" type="password" id="confPassword" name="confPassword" class="form-control rounded border p-2 ps-3">
                    </div>
                </div>
                <div>
                    <p class="text-secondary mb-0"><span class="text-danger">*</span>Precisa no mínimo 8 digitos</p>
                    <p class="text-secondary mb-0"><span class="text-danger">*</span>Precisa conter um caractere especial */+.</p>
                    <p class="text-secondary mb-0"><span class="text-danger">*</span>Precisa conter uma letra em MAIÚSCULA</p>
                </div>
                <div class="d-flex justify-content-end">
                    <input class="btn btn-arnia text-light fs-5 w-50 px-4 py-2 shadow" type="submit" value="Prosseguir   -> ">
                </div>
            </form>
        </div>
    </div>
    `)
}
const criandoCorpo = async (nome,email,senha) => {
    const novoPost = {
      "nome": nome,
      "email": email,
      "senha": senha,
    }
    await metodoPost(novoPost)
  }
function redirecionamento(){
    //alertar que foi cadastrado com sucesso
    window.location.replace('https://projeto-arnia-lvkb.vercel.app/page/login/index.html')
}
async function verificandoEmail(mail) {
    const response = await metodoGet()
    
    if(response.length > 0){
        for(let i = 0 ; i < response.length ; i++) {
            if(response[i].email === mail){
                return false
            }
            return true
        }
    }
    else{
        return true
    }
    
}

//funções api--->
async function metodoPost(post){
    await fetch("https://projetoarnia.onrender.com/cadastro", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    });
  }
async function metodoGet(){
    const apiResponse = await fetch("https://projetoarnia.onrender.com/cadastro")
    return await apiResponse.json()
}