document.addEventListener("DOMContentLoaded", function () {
    fetchUnidadesConsumidoras();

    document.getElementById('unidadeFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); // Previne o recarregamento da página
        saveUnidadeConsumidora();
    });
});

function fetchUnidadesConsumidoras() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar unidades consumidoras');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data);
            const list = document.getElementById('unidadesList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.unidades_consumidoras.forEach(unidade => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"> <strong>${unidade.nome}</strong> - Tipo ID: ${unidade.tipo_id}</div>
                            <div class="col"> 
                                <button class="btn btn-info btn-sm float-end ms-2" 
                                    onclick="showEditUnidadeForm(${unidade.id}, '${unidade.nome}', ${unidade.tipo_id})">Editar</button>
                            </div>
                            <div class="col"> 
                                <button class="btn btn-danger btn-sm float-end" 
                                    onclick="deleteUnidade(${unidade.id})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}

function showAddUnidadeForm() {
    document.getElementById('unidadeForm').classList.remove('d-none');
    document.getElementById('unidadeId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('tipo_id').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Unidade Consumidora';
}

function showEditUnidadeForm(id, nome, tipo_id) {
    document.getElementById('unidadeForm').classList.remove('d-none');
    document.getElementById('unidadeId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('tipo_id').value = tipo_id;
    document.getElementById('formTitle').innerText = 'Editar Unidade Consumidora';
}

function saveUnidadeConsumidora() {
    const id = document.getElementById('unidadeId').value;
    const nome = document.getElementById('nome').value;
    const tipo_id = parseInt(document.getElementById('tipo_id').value, 10);
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/unidades-consumidoras/${id}` : 'http://localhost:8000/unidades-consumidoras';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, tipo_id: tipo_id })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar unidade consumidora');
        }
        return response.json();
    })
    .then(() => {
        fetchUnidadesConsumidoras();
        document.getElementById('unidadeForm').classList.add('d-none');
    })
    .catch(error => console.error('Erro ao salvar unidade consumidora:', error));
}

function deleteUnidade(id) {
    fetch(`http://localhost:8000/unidades-consumidoras/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar unidade consumidora');
        }
        fetchUnidadesConsumidoras();
    })
    .catch(error => console.error('Erro ao deletar unidade consumidora:', error));
}