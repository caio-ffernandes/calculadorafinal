// Evento para carregar as "tipos-consumidores" e configurar o formulário de "tipos"
document.addEventListener("DOMContentLoaded", function () {
    fetchTipos();
    document.getElementById('tipoFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveTipo();
    });
});

// Evento para carregar as "unidades-consumidoras" e configurar o formulário de "unidades"
document.addEventListener("DOMContentLoaded", function () {
    fetchUnidadeConsumidoras();
    document.getElementById('unidadeFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveUnidadeConsumidora();
    });
});

// Evento para carregar as "dependencias" e configurar o formulário de "dependências"
document.addEventListener("DOMContentLoaded", function () {
    fetchDependencias();
    document.getElementById('dependenciaFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveDependencia();
    });
});

// Evento para carregar os "tipos de dispositivos" e configurar o formulário de "tipos de dispositivos"
document.addEventListener("DOMContentLoaded", function () {
    fetchTiposDispositivos();
    document.getElementById('tipoDispositivoFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveTipoDispositivo();
    });
});

// Evento para carregar os "dispositivos" e configurar o formulário de "dispositivos"
document.addEventListener("DOMContentLoaded", function () {
    fetchDispositivos();
    document.getElementById('dispositivoFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveDispositivo();
    });
});

// Evento para carregar as "bandeiras" e configurar o formulário de "bandeiras"
document.addEventListener("DOMContentLoaded", function () {
    fetchBandeiras();
    document.getElementById('bandeiraFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveBandeira();
    });
});


function fetchTipos() {
    fetch('http://localhost:8000/tipos-consumidores')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const list = document.getElementById('tiposList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.tipos_consumidores.forEach(tipo => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"> <strong>${tipo.nome}</strong> - R$ ${tipo.valor_kwh.toFixed(2)}/kWh</div>
                            <div class="col"> <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${tipo.id}, '${tipo.nome}', ${tipo.valor_kwh})">Editar</button></div>
                            <div class="col"> <button class="btn btn-danger btn-sm float-end" onclick="deleteTipo(${tipo.id})">Deletar</button></div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        });
}

function showAddForm() {
    document.getElementById('tipoForm').classList.remove('d-none');
    document.getElementById('tipoId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('valor_kwh').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Tipo de Consumidor';
}

function showEditForm(id, nome, valor_kwh) {
    document.getElementById('tipoForm').classList.remove('d-none');
    document.getElementById('tipoId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('valor_kwh').value = valor_kwh;
    document.getElementById('formTitle').innerText = 'Editar Tipo de Consumidor';
}

function saveTipo() {
    const id = document.getElementById('tipoId').value;
    const nome = document.getElementById('nome').value;
    const valor_kwh = parseFloat(document.getElementById('valor_kwh').value);
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/tipos-consumidores/${id}` : 'http://localhost:8000/tipos-consumidores';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, valor_kwh: valor_kwh })
    })
        .then(response => response.json())
        .then(() => {
            fetchTipos();
            document.getElementById('tipoForm').classList.add('d-none');
        });
}

function deleteTipo(id) {
    fetch(`http://localhost:8000/tipos-consumidores/${id}`, {
        method: 'DELETE'
    })
        .then(() => fetchTipos());
}
document.addEventListener("DOMContentLoaded", function () {
    fetchUnidadeConsumidoras(); // Função inicial para carregar as unidades consumidoras

    document.getElementById('unidadeFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveUnidadeConsumidora();
    });
});




// Repetir funções para 'dependencias', 'tipos-dispositivos', 'dispositivos' e 'bandeiras'

function fetchDependencias() {
    fetch('http://localhost:8000/dependencias')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const list = document.getElementById('dependenciasList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.dependencias.forEach(dep => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"> <strong>${dep.nome}</strong></div>
                            <div class="col"> <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditDependenciaForm(${dep.id}, '${dep.nome}')">Editar</button></div>
                            <div class="col"> <button class="btn btn-danger btn-sm float-end" onclick="deleteDependencia(${dep.id})">Deletar</button></div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        });
}

function showAddDependenciaForm() {
    document.getElementById('dependenciaForm').classList.remove('d-none');
    document.getElementById('dependenciaId').value = '';
    document.getElementById('dependenciaNome').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Dependência';
}

function showEditDependenciaForm(id, nome) {
    document.getElementById('dependenciaForm').classList.remove('d-none');
    document.getElementById('dependenciaId').value = id;
    document.getElementById('dependenciaNome').value = nome;
    document.getElementById('formTitle').innerText = 'Editar Dependência';
}

function saveDependencia() {
    const id = document.getElementById('dependenciaId').value;
    const nome = document.getElementById('dependenciaNome').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/dependencias/${id}` : 'http://localhost:8000/dependencias';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome })
    })
        .then(response => response.json())
        .then(() => {
            fetchDependencias();
            document.getElementById('dependenciaForm').classList.add('d-none');
        });
}

function deleteDependencia(id) {
    fetch(`http://localhost:8000/dependencias/${id}`, {
        method: 'DELETE'
    })
        .then(() => fetchDependencias());
}

// Repetir para 'tipos-dispositivos', 'dispositivos' e 'bandeiras'



// Repetir para 'dispositivos'



