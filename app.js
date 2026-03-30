const telaInve = document.getElementById("tela__inventario")
const telaLogi = document.getElementById("tela__login")
const telaCad = document.getElementById("tela__cadastro")
const botaoCada = document.getElementById("tela__login__cadastre-se")
const botaoVisiCad = document.getElementById("tela__cadastro__visitante")
const botaoVisiLog = document.getElementById("tela__login__visitante")
const botaoLogin = document.getElementById("botao__entrar")
const botaoCadastrar = document.getElementById("botao__cadastrar")
const botaoOlhoCad = document.getElementById("botao__olho__cadastro")
const botaoOlhoLog = document.getElementById("botao__olho__login")
const botaoSair = document.getElementById("botao__sair")
const botaoAdd = document.getElementById("botao__adicionar")
const divBotao = document.getElementById("principal__texto")
const divBusca = document.getElementById("principal__busca")
const inputCadUser = document.getElementById("tela__cadastro__user")
const inputCadEmail = document.getElementById("tela__cadastro__email")
const inputCadSenha = document.getElementById("tela__cadastro__senha")
const inputLoginUser = document.getElementById("tela__login__user")
const inputLoginSenha = document.getElementById("tela__login__senha")

const inputNome = document.getElementById("nome__item")
const inputQtd = document.getElementById("qtd__item")
const mensagemErroServer = "Falha na comunicação com o servidor"
let meuInventario = [];

const urlitensLocal = "https://dungeon-inventory-manager-api.onrender.com/api/itens"
const urlUsuariosLocal = "https://dungeon-inventory-manager-api.onrender.com/api/usuarios"

const credencial = localStorage.getItem("usuario_id")
const credencialVal = parseInt(credencial)
if(credencialVal >= 0){
    carregarItens()
    mostrarTela(telaInve)
}else{
    mostrarTela(telaLogi)
}


botaoAdd.addEventListener('click', () =>{
    adicionarItem()
})



divBotao.addEventListener('click', (event) =>{
    const botaoClicado = event.target

    if (botaoClicado.classList.contains("botao-remover")){
        const botaoId = Number(event.target.dataset.id);
         removeObjeto(botaoId)
        }
})

divBusca.addEventListener('click', (event) => {

    if (event.target.id === 'botao-busca') {
        const inputBuscaLocal = document.getElementById("input__busca");
        const termo = inputBuscaLocal.value.toLowerCase();
        
        const itens = document.querySelectorAll('.item-lista');
        
        itens.forEach(item => {
            const nomeItem = item.querySelector('.valor-variavel').textContent.toLowerCase();
            item.style.display = nomeItem.includes(termo) ? 'flex' : 'none';
        });
    }
});

botaoOlhoCad.addEventListener('click', (event) =>{
    const input = document.getElementById("tela__cadastro__senha")
    mostrarSenha(input)
})

botaoOlhoLog.addEventListener('click', (event) => {
    const input = document.getElementById("tela__login__senha")
    mostrarSenha(input)
    })

botaoCada.addEventListener('click', () =>{
    mostrarTela(telaCad)
})

botaoVisiCad.addEventListener('click', () =>{
    //mostrarTela(telaInve)
})

botaoVisiLog.addEventListener('click', () =>{
    //mostrarTela(telaInve)
})

botaoCadastrar.addEventListener('click', cadastraUsuario)
botaoLogin.addEventListener('click', logarUsuarios)
botaoSair.addEventListener('click', sair)

async function logarUsuarios(event){
    event.preventDefault();
    if(inputLoginUser.value.trim() === ""){
        alert("Digite o usuario!")
    }else if(inputLoginSenha.value.trim() === ""){
        alert("Digite a senha!")
    }else{
        login = {
                username: inputLoginUser.value.trim(), 
                senha: inputLoginSenha.value.trim()
            }

        try{
            const resposta = await fetch(`${urlUsuariosLocal}/login`,{
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(login)
            })
            const retorno = await resposta.text()
            const dadosRetornados =  (retorno != "") ? JSON.parse(retorno) : null;
            
            if(dadosRetornados === null){
                alert("Usuario ou Senha Incorretos ou Inexistentes!")

            }else{

                localStorage.setItem("usuario_id",dadosRetornados.id )

                inputLoginSenha.value = ""
                inputLoginUser.value = ""

                carregarItens()
                mostrarTela(telaInve)
            }


        }catch(erro){
            console.log(erro)
            alert(mensagemErroServer,erro)
        }
    } 
}

function sair(){
    localStorage.removeItem("usuario_id")
    mostrarTela(telaLogi)
}

async function carregarItens() {
    try {
        const credencial = localStorage.getItem("usuario_id")
        const resposta = await fetch(`${urlitensLocal}/usuario/${credencial}`);
        if (!resposta.ok) throw new Error(mensagemErroServer);

        const itensDoBanco = await resposta.json();
        meuInventario = itensDoBanco; 
        
        console.log("Itens carregados do banco:", meuInventario);

    } catch (erro) {
        console.error("Houve um problema com a requisição:", erro);
    }
    atualizarLista()
}

function mostrarTela(telaMostra){
    telaInve.style.display= "none"
    telaLogi.style.display= "none"
    telaCad.style.display= "none"

    telaMostra.style.display = "block"

}   

function mostrarSenha(input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  
}

function atualizarLista(){


    const meuInventarioHTML = meuInventario.map((item) => {
        return ` 
            <div class="item-lista">
                <div class="coluna-nome">
                    <strong class="texto-destaque">Nome:</strong>
                    <span class="valor-variavel">${item.nome}</span>
                </div>    

                <div class="coluna-qtd">    
                    <strong class="texto-destaque">Quantidade:</strong>
                    <span class="valor-variavel">${item.quantidade}</span>
                </div>
                <button class="botao-remover"  data-id="${item.id}">Remover</button>
            </div> 
        `
    }).join('')

    
    if(meuInventario.length === 0){ 
        divBusca.innerHTML = ""
        divBotao.innerHTML = `
            <div class="mensagem-vazia">
                <i class="icone-bau"></i>
                <p>O seu inventário está vazio, percorra as dungeons atrás de itens</p>
            </div>
        `;
    }else{
        divBotao.innerHTML = meuInventarioHTML
        divBusca.innerHTML = `
            <input type=text id="input__busca" placeholder="🔍 Buscar item no inventário...">
            <button id="botao__busca">Buscar</button>
        `;
    }

    
}

async function cadastraUsuario(event) {
    event.preventDefault();
    const username = inputCadUser.value.trim();
    const email = inputCadEmail.value.trim();
    const senha = inputCadSenha.value.trim();
    if(username === "" || email === "" || senha === ""){
        alert("Preencha todos os campos para se cadastrar!")
        return
    }

    const novoUsuario = {
        username: username,
        email: email,
        senha: senha
    }
    try{
        const urlcadastro = `${urlUsuariosLocal}/cadastrar`
        const resposta = await fetch(urlcadastro,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoUsuario)
        })

        const textoResposta = await resposta.text()
        const dadosRetornados = textoResposta ? JSON.parse(textoResposta) : null;

        if(dadosRetornados){
            alert("Sucesso! Guerreiro cadastrado. Faça seu login para acessa o seu inventário")
            
            inputCadUser.value = ""
            inputCadEmail.value = ""
            inputCadSenha.value = ""
            mostrarTela(telaLogi);

        }else {
            alert("Esse nome de usuário já existe no reino! Escolha outro.");
        }
    }catch(erro){
        console.error("Erro no cadastro:", erro)
        alert(mensagemErroServer)
    }
}

async function removeObjeto(id){
    const usuario_id = localStorage.getItem("usuario_id")
    try{
        const urlRemove = `${urlitensLocal}/${usuario_id}/${id}`
        const resposta = await fetch(urlRemove,{
            method: "DELETE"
        })
        
        if(resposta.ok){
            console.log(`Item removido do banco`)
            carregarItens()
        }else{
            console.error("Exclusão do Item deu erro")
        }

    } catch(erro){
        console.error(mensagemErroServer, erro)
    }
}

async function adicionarItem(){
    
    const nome = inputNome.value;
    const quantidade = parseInt(inputQtd.value);
    const id = localStorage.getItem("usuario_id")

    if (nome.trim() === "" ) {
        alert("Digite um nome para o item!");
        return;
    }else if (isNaN(quantidade) || quantidade <= 0){
        alert("Quantidade Inválida")
    }else if(nome.length > 20){
        alert("Limite de caracteres excedidos")
    }else {
        try{
        const usuario_id = localStorage.getItem("usuario_id")
        const novoItem = {nome: nome, quantidade: quantidade};
        const resposta = await fetch(`${urlitensLocal}/usuario/${usuario_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoItem)
        })
        if(resposta.ok){
            console.log(`Sucesso! Item: [${novoItem.nome}] adicionado ao banco`)
            inputNome.value = "";
            inputQtd.value = 1;
            carregarItens()
        }else{
            console.error(`Falha! Item: [${novoItem.nome}] não adicionado ao banco`)
        }
        
        }catch(erro){
            console.error(mensagemErroServer, erro)
        }
        
    }


}