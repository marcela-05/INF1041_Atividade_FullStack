

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Criar config.py


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

const insertEditButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u{1F589}"); 
  span.className = "edit";
  span.appendChild(txt);

  span.isEditing = false;

  span.onclick = function () {
    let row = this.parentElement.parentElement;
    let tds = row.getElementsByTagName("td");

    if (!this.isEditing) {
      this.isEditing = true;
      this.originalName = tds[0].innerHTML;

      for (let i = 0; i < 3; i++) {
        tds[i].contentEditable = "true";
        tds[i].classList.add("editing-cell");
        tds[i].focus(); 
      }

      this.textContent = "Salvar";
    } else {
      let nomeNovo = tds[0].innerHTML.trim();
      let novaQtd = tds[1].innerHTML.trim();
      let novoPreco = tds[2].innerHTML.trim();

      if (nomeNovo === "") {
        alert("Nome tem que ser preenchido!");
        return;
      }

      if (isNaN(novaQtd) || isNaN(novoPreco)) {
        alert("Quantidade e valor precisam ser apenas números!");
        return;
      }

      updateItem(this.originalName, nomeNovo, novaQtd, novoPreco)
        .then(() => {
          for (let i = 0; i < 3; i++) {
            tds[i].contentEditable = "false";
            tds[i].classList.remove("editing-cell");
          }

          this.isEditing = false;
          this.textContent = "\u{1F589}";
          alert("Atualizado com sucesso!");
        });
    }
  };

  parent.appendChild(span);
};

const updateItem = (nomeAntigo, nomeNovo, novaQtd, novoPreco) => {
  const formData = new FormData();
  formData.append("nome", nomeNovo);
  formData.append("quantidade", novaQtd);
  formData.append("valor", novoPreco);
  const url = "http://127.0.0.1:5000/produto?nome=" + nomeAntigo;
  return fetch(url, {
    method: "put",
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};


/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertEditButton(row.insertCell(-1));
  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
}