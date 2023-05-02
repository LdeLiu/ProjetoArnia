const formLogin = document.querySelector('#formLogin')

formLogin.addEventListener('submit', (submit) => {
    submit.preventDefault()
    const login = formLogin.querySelector('#email').value
    const senha = formLogin.querySelector('#password').value
    verificarLogin(login,senha)
    
})



async function verificarLogin(login,senha){
    try{
        const apiResponse = await metodoGet(login)
        const dadosLogin = apiResponse[0]
        // console.log(apiResponse)

        if(dadosLogin.senha === senha){
            localStorage.setItem("nome", dadosLogin.nome);
            localStorage.setItem("email", dadosLogin.email);
            window.location.replace('http://127.0.0.1:5500/page/dashboard/index.html')
        }
        else{
            alert('senha incorreta')
        }
    }
    catch{
        alert('Usuario não encontrado')
    }
    


}

async function metodoGet(login){
    const apiResponse = await fetch(`https://projetoarnia.onrender.com/cadastro?email=${login}`)
    const posts = await apiResponse.json()
    return(posts)
}