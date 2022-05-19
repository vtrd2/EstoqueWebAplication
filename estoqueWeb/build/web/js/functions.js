let newBt = document.getElementById("newBt");
newBt.addEventListener("click", addTagsForNewProduct);

let removeBt = document.getElementById("removeBt");
removeBt.addEventListener("click", removeProduct);

let alterBt = document.getElementById("alterBt");
alterBt.addEventListener("click", alterProduct);

displayProducts();

let produtoSel = "";
let quantidadeSel = 0;

function cleanDiv(divf) {
    while (divf.firstChild) {
        divf.removeChild(divf.firstChild);
    }
    
}

function addTagsForNewProduct() {
    let divForm = document.getElementById("form");
    cleanDiv(divForm);


    let inputName = document.createElement("input");
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "product");
    inputName.id = "inputName";
    inputName.setAttribute("placeholder", "Nome do produto");

    let inputQuantity = document.createElement("input");
    inputQuantity.setAttribute("type", "number");
    inputQuantity.setAttribute("name", "quantity");
    inputQuantity.id = "inputQuantity";
    inputQuantity.setAttribute("placeholder", "Quantidade");

    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("onclick", "createNewProduct()");
    button.innerHTML = "Create";

    divForm.appendChild(document.createElement("hr"));
    divForm.appendChild(inputName);
    divForm.appendChild(document.createElement("br"));
    divForm.appendChild(inputQuantity);
    divForm.appendChild(document.createElement("br"));
    divForm.appendChild(button);
}

function createNewProduct() {
    let divForm = document.getElementById("form");
    let inputName = document.getElementById("inputName");
    let inputQuantity = document.getElementById("inputQuantity");

    let product = inputName.value;
    let quantity = inputQuantity.value;

    //remove espaços extras no product 
    product = product.trim();
    quantity = Math.floor(quantity);


    if (product == "") {
        inputName.style = "border: 1px solid red";
        alert("Preencha o produto corretamente");
        return;
    } else if (quantity == "" || isNaN(quantity)) {
        inputQuantity.style = "border: 1px solid red";
        alert("Preencha a quantidade corretamente");
        return;
    }

    let exist = false

    //verifica se o produto existe
    fetch("getproduct?nome=" + product)
    .then(response => response.json())
    .then(data => {
        if (data[product] != undefined) {
            alert("O produto já existe");
            exist = true;
        } else {

            let data = JSON.stringify({
                nome: product,
                quantidade: quantity

            });

            postToTheProduct(data);
            
            cleanDiv(divForm)

            changePropertiesSelectProduct(product, quantity);

            produtoSel = product;
            quantidadeSel = quantity;

        };
    })
}

function postToTheProduct(data) {
    fetch("saveproduct", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data,
    })
    .then(response => response.json())
    .then(data => {
        if (data.saved == true) {

            displayProducts();

            alert("Sucesso");
        } else {
            alert("Erro ao criar produto");
        }
    
    }).catch(error => console.error(error));
}  

function removeProduct() {
    if (produtoSel == "") {
        alert("Selecione um produto");
        return;
    }

    //Faz a request para o backend enviando o produto a ser removido
    fetch("deleteproduct?nome=" + produtoSel)
    .then(response => response.json())
    .then(data => {
        let deleted = data["deleted"];

        if (deleted == true) {
            produtoSel = "";
            quantidadeSel = 0;
            changePropertiesSelectProduct("Nenhum produto selecionado", 0);
            alert("O produto foi deletado");
        } else {
            alert("O produto não foi deletado");
        }

        cleanDiv(document.getElementById("form"));
        displayProducts();
    });
}

function alterProduct() {
    if (produtoSel == "") {
        alert("Selecione um produto");
        return;
    }

    let divForm = document.getElementById("form");

    cleanDiv(divForm);

    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("onclick", "EstoqueTags(1)");
    button.innerHTML = "Adicionar ao estoque";

    let button2 = document.createElement("button");
    button2.setAttribute("type", "button");
    button2.setAttribute("onclick", "EstoqueTags(0)");
    button2.innerHTML = "Remover do estoque";

    divForm.appendChild(document.createElement("hr"));
    divForm.appendChild(button);
    divForm.appendChild(document.createElement("br"));
    divForm.appendChild(button2);

}

function displayProducts() {
    //Recebe os produtos da database e os coloca na 3ª div
    let products = [];

    fetch("getproducts")
    .then(response => response.json())
    .then(data => {
        //itera as chaves de data
        for (let key in data) {
            products.push(key);
        };
    })

    .then(() => {
        let listaProdutos = document.getElementById("listaProdutos");

        cleanDiv(listaProdutos);

        if (products.length == 0) {
            let produto = document.createElement("p");
            produto.innerHTML = "Nenhum produto cadastrado";
            listaProdutos.appendChild(produto);
            return;
        }

        products = products.sort();

        for (let i = 0; i < products.length; i++) {
            let nome = products[i];
            nome = nome;

            let produto = document.createElement("div");
            produto.setAttribute("class", "produto");
            produto.textContent = nome;
            produto.setAttribute("onclick", "selectProduct('" + nome + "')");
            listaProdutos.appendChild(produto);
        }
    }).catch(error => console.error(error));
}

function selectProduct(nome) {
    fetch("getproduct?nome=" + nome)
    .then(response => response.json())
    .then(data => {
        produtoSel = nome;
        quantidadeSel = data[nome];
    
        changePropertiesSelectProduct(produtoSel[0].toUpperCase() + produtoSel.slice(1,), quantidadeSel);
        cleanDiv(document.getElementById("form"));
    });
}

function changePropertiesSelectProduct(nome, quantidade) {
    let nomeProdutoI = document.getElementById("nomeProdutoI");
    let quantidadeProdutoI = document.getElementById("quantidadeProduto");

    nomeProdutoI.textContent = nome[0].toUpperCase() + nome.slice(1,);
    quantidadeProdutoI.textContent = quantidade;
}

function EstoqueTags(type) {
    let divForm = document.getElementById("form");
    cleanDiv(divForm);


    let inputQuantity = document.createElement("input");
    inputQuantity.setAttribute("type", "number");

    let button = document.createElement("button");
    button.setAttribute("type", "button");

    if (type == 1) {
        inputQuantity.setAttribute("placeholder", "Quantidade Adicionada");
        inputQuantity.setAttribute("name", "quantidade");
        inputQuantity.id = "inputQuantityAdd";
        button.setAttribute("onclick", "changeEstoque(1)");
        button.innerHTML = "Adicionar";
    }
    if (type == 0) {
        inputQuantity.setAttribute("placeholder", "Quantidade Removida");
        inputQuantity.setAttribute("name", "quantidade");
        inputQuantity.id = "inputQuantityRemove";
        button.setAttribute("onclick", "changeEstoque(0)");
        button.innerHTML = "Remover";
    }

    divForm.appendChild(document.createElement("hr"));
    divForm.appendChild(inputQuantity);
    divForm.appendChild(document.createElement("br"));
    divForm.appendChild(button);
}

function changeEstoque(type) {
    let quantidadeSelcopy = quantidadeSel;
    let produtoSelcopy = produtoSel;

    let inputQuantity;
    if (type == 1) {
        inputQuantity = document.getElementById("inputQuantityAdd");
    } 
    if (type == 0) {
        inputQuantity = document.getElementById("inputQuantityRemove");
    }

    if (inputQuantity.value == "" || inputQuantity.value < 1) {
        alert("Digite a quantidade corretamente");
        inputQuantity.style = "border: 1px solid red";
        return;
    }

    let quantity = parseInt(inputQuantity.value);

    if (type == 1) {
        quantidadeSelcopy += quantity;
    } else {
        if (quantity > quantidadeSel) {
            alert("Quantidade maior que a disponível");
            inputQuantity.style = "border: 1px solid red";
            return;
        }
        quantidadeSelcopy -= quantity;
    }

    let data = JSON.stringify({
        nome: produtoSelcopy,
        quantidade: quantidadeSelcopy,
    });

    console.log(data);

    postToTheProduct(data);

    cleanDiv(document.getElementById("form"));

    changePropertiesSelectProduct(produtoSelcopy, quantidadeSelcopy);

    quantidadeSel = quantidadeSelcopy;
    produtoSel = produtoSelcopy;

}
