document.addEventListener("DOMContentLoaded", function () {
    fetchTiposDispositivos();

    document.getElementById('tipoDispositivoFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); // Previne o recarregamento da página
        saveTipoDispositivo();
    });
});

function fetchTiposDispositivos() {
    fetch('http://localhost:8000/tipos-dispositivos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar tipos de dispositivos');
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('tiposDispositivosList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.tipos_dispositivos.forEach(tipo => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"> <strong>${tipo.nome}</strong></div>
                            <div class="col"> 
                                <button class="btn btn-info btn-sm float-end ms-2" 
                                    onclick="showEditTipoDispositivoForm(${tipo.id}, '${tipo.nome}')">Editar</button>
                            </div>
                            <div class="col"> 
                                <button class="btn btn-danger btn-sm float-end" 
                                    onclick="deleteTipoDispositivo(${tipo.id})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar tipos de dispositivos:', error));
}

function showAddTipoDispositivoForm() {
    document.getElementById('tipoDispositivoForm').classList.remove('d-none');
    document.getElementById('tipoDispositivoId').value = '';
    document.getElementById('tipoDispositivoNome').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Tipo de Dispositivo';
}

function showEditTipoDispositivoForm(id, nome) {
    document.getElementById('tipoDispositivoForm').classList.remove('d-none');
    document.getElementById('tipoDispositivoId').value = id;
    document.getElementById('tipoDispositivoNome').value = nome;
    document.getElementById('formTitle').innerText = 'Editar Tipo de Dispositivo';
}

function saveTipoDispositivo() {
    const id = document.getElementById('tipoDispositivoId').value;
    const nome = document.getElementById('tipoDispositivoNome').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/tipos-dispositivos/${id}` : 'http://localhost:8000/tipos-dispositivos';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar tipo de dispositivo');
        }
        return response.json();
    })
    .then(() => {
        fetchTiposDispositivos();
        document.getElementById('tipoDispositivoForm').classList.add('d-none');
    })
    .catch(error => console.error('Erro ao salvar tipo de dispositivo:', error));
}

function deleteTipoDispositivo(id) {
    fetch(`http://localhost:8000/tipos-dispositivos/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar tipo de dispositivo');
        }
        fetchTiposDispositivos();
    })
    .catch(error => console.error('Erro ao deletar tipo de dispositivo:', error));
}
