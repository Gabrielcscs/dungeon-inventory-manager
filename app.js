const inputNome = document.getElementById("nome-item")
const inputQtd = document.getElementById("qtd-item")
const botaoAdd = document.getElementById("botao-adicionar")
const divBotao = document.getElementById("principal__texto")
const dadosSalvos = localStorage.getItem("inventarioSalvo")

let meuInventario = JSON.parse(localStorage.getItem("inventarioSalvo")) || [];

atualizarLista()


botaoAdd.addEventListener('click', () =>{
    const nome = inputNome.value;
    const quantidade = inputQtd.value;

    if (nome.trim() === "" ) {
        alert("Digite um nome para o item!");
        return;
    }else if (quantidade <= 0){
        alert("Quantidade Inválida")
    }else if(nome.length > 20){
        alert("Limite de caracteres excedidos")
    }else {
        const novoItem = new criarItem(nome, quantidade);
        meuInventario.push(novoItem);
        localStorage.setItem("inventarioSalvo", JSON.stringify(meuInventario))
        atualizarLista()
    }


    inputNome.value = "";
    inputQtd.value = 1;
})


divBotao.addEventListener('click', (event) =>{
    const botaoClicado = event.target

    if (botaoClicado.classList.contains("botao-remover")){
        const botaoIndex = Number(event.target.dataset.posicao);
         removeObjeto(botaoIndex)
         atualizarLista()
        }
})

function atualizarLista(){
    divBotao.innerHTML = ""
    meuInventario.forEach((itens, index) => {
        divBotao.innerHTML += ` 
            <div>
                <strong>Nome:</strong> ${itens.nome}
                <strong>Quantidade:</strong> ${itens.qtd}
                <button class="botao-remover"  data-posicao="${index}">Remover</button>
            </div>
            <hr>
        `;

    });
    if(meuInventario.length === 0){
        divBotao.innerHTML += `
        <h1>O seu inventário está vazio, percorra as dungeons atrás de itens</h1>
        `;
    }
}

function removeObjeto(indice){
    meuInventario.splice(indice, 1)
    localStorage.setItem("inventarioSalvo", JSON.stringify(meuInventario))
}

function criarItem(nome, quantidade){
    this.nome = nome.trim();
    this.qtd = quantidade;
}
