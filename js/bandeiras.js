document.addEventListener("DOMContentLoaded", function () {
    fetchBandeiras();

    document.getElementById('bandeiraFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir o recarregamento da página
        saveBandeira();
    });
});

function fetchBandeiras() {
    fetch('http://localhost:8000/bandeiras')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('bandeirasList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.bandeiras.forEach(bandeira => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"><strong>${bandeira.nome}</strong> - R$ ${bandeira.tarifa.toFixed(2)}</div>
                            <div class="col"> 
                                <button class="btn btn-info btn-sm float-end ms-2" 
                                    onclick="showEditBandeiraForm(${bandeira.id}, '${bandeira.nome}', ${bandeira.tarifa})">Editar</button>
                            </div>
                            <div class="col"> 
                                <button class="btn btn-danger btn-sm float-end" 
                                    onclick="deleteBandeira(${bandeira.id})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar bandeiras:', error));
}

function showAddBandeiraForm() {
    document.getElementById('bandeiraForm').classList.remove('d-none');
    document.getElementById('bandeiraId').value = '';
    document.getElementById('bandeiraNome').value = '';
    document.getElementById('bandeiraValor').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Bandeira';
}

function showEditBandeiraForm(id, nome, valor) {
    document.getElementById('bandeiraForm').classList.remove('d-none');
    document.getElementById('bandeiraId').value = id;
    document.getElementById('bandeiraNome').value = nome;
    document.getElementById('bandeiraValor').value = valor;
    document.getElementById('formTitle').innerText = 'Editar Bandeira';
}

function saveBandeira() {
    const id = document.getElementById('bandeiraId').value;
    const nome = document.getElementById('bandeiraNome').value;
    const tarifa = parseFloat(document.getElementById('bandeiraValor').value);
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/bandeiras/${id}` : `http://localhost:8000/bandeiras`;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, tarifa: tarifa })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar bandeira');
        }
        return response.json();
    })
    .then(() => {
        fetchBandeiras();
        document.getElementById('bandeiraForm').classList.add('d-none');
    })
    .catch(error => console.error('Erro ao salvar bandeira:', error));
}

function deleteBandeira(id) {
    fetch(`http://localhost:8000/bandeiras/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar bandeira');
        }
        fetchBandeiras();
    })
    .catch(error => console.error('Erro ao deletar bandeira:', error));
}
