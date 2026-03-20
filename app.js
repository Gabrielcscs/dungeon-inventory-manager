
const inputNome = document.getElementById("nome__item")
const inputQtd = document.getElementById("qtd__item")
const botaoAdd = document.getElementById("botao__adicionar")
const divBotao = document.getElementById("principal__texto")
const divBusca = document.getElementById("principal__busca")
const mensagemErroServer = "Falha na comunicação com o servidor"
let meuInventario = [];

const urlAPI = "https://dungeon-inventory-manager-api.onrender.com/api/itens";

async function carregarItens() {
    try {
        const resposta = await fetch(urlAPI);
        if (!resposta.ok) throw new Error(mensagemErroServer);

        const itensDoBaco = await resposta.json();
        
        meuInventario = itensDoBaco; 
        
        console.log("Itens carregados do banco:", meuInventario);

    } catch (erro) {
        console.error("Houve um problema com a requisição:", erro);
    }
    atualizarLista()
}
carregarItens()


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
            <button id="botao-busca">Buscar</button>
        `;
    }

    
}

async function removeObjeto(id){
    try{
        const urlRemove = `${urlAPI}/${id}`
        const resposta = await fetch(urlRemove,{
            method: "DELETE"
        })
        
        if(resposta.ok){
            console.log("Item removido do banco")
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

    if (nome.trim() === "" ) {
        alert("Digite um nome para o item!");
        return;
    }else if (isNaN(quantidade) || quantidade <= 0){
        alert("Quantidade Inválida")
    }else if(nome.length > 20){
        alert("Limite de caracteres excedidos")
    }else {
        try{
        
        const novoItem = {nome: nome, quantidade: quantidade};
        const resposta = await fetch(urlAPI, {
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