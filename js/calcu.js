document.addEventListener("DOMContentLoaded", function () {
    fetchUnidadesConsumidoras();
    fetchBandeiras();
});

let dispositivosSelecionados = [];

// Função para buscar unidades consumidoras
function fetchUnidadesConsumidoras() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => response.json())
        .then(data => {
            const unidadeSelect = document.getElementById('unidadeConsumidoraSelect');
            unidadeSelect.innerHTML = '<option value="">Selecione uma unidade consumidora</option>';
            data.unidades_consumidoras.forEach(unidade => {
                unidadeSelect.innerHTML += `<option value="${unidade.id}">${unidade.nome}</option>`;
            });
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}

// Função para buscar bandeiras
function fetchBandeiras() {
    fetch('http://localhost:8000/bandeiras')
        .then(response => response.json())
        .then(data => {
            const bandeiraSelect = document.getElementById('bandeiraSelect');
            bandeiraSelect.innerHTML = '<option value="">Selecione uma bandeira tarifária</option>';
            data.bandeiras.forEach(bandeira => {
                bandeiraSelect.innerHTML += `<option value="${bandeira.tarifa}">${bandeira.nome} - R$ ${bandeira.tarifa.toFixed(2)}</option>`;
            });
        })
        .catch(error => console.error('Erro ao buscar bandeiras:', error));
}

// Função para buscar dependências e dispositivos
function buscarDispositivosPorUnidade() {
    const unidadeId = document.getElementById('unidadeConsumidoraSelect').value;

    if (!unidadeId) {
        alert("Selecione uma unidade consumidora.");
        return;
    }

    // Buscar dependências da unidade consumidora
    fetch(`http://localhost:8000/dependencias/unidade-consumidora/${unidadeId}`)
        .then(response => response.json())
        .then(data => {
            dispositivosSelecionados = []; // Limpar dispositivos selecionados
            let promises = [];

            // Verificar se há dependências
            if (data.dependencias && data.dependencias.length > 0) {
                data.dependencias.forEach(dependencia => {
                    // Para cada dependência, buscar dispositivos
                    dependencia.dispositivos.forEach(dispositivo => {
                        promises.push(
                            fetch(`http://localhost:8000/dispositivos/${dispositivo.id}`)
                                .then(response => response.json())
                                .then(dispositivoData => {
                                    dispositivosSelecionados.push(dispositivoData);
                                })
                                .catch(error => console.error('Erro ao buscar dispositivo:', error))
                        );
                    });
                });
            } else {
                console.error('Nenhuma dependência encontrada para esta unidade consumidora.');
            }

            // Após todas as requisições, atualizar a lista de dispositivos
            Promise.all(promises).then(() => {
                atualizarListaDispositivos();
            });
        })
        .catch(error => console.error('Erro ao buscar dependências:', error));
}

// Função para atualizar a lista de dispositivos na interface
function atualizarListaDispositivos() {
    const listaDispositivos = document.getElementById('listaDispositivos');
    listaDispositivos.innerHTML = '';

    if (dispositivosSelecionados.length === 0) {
        listaDispositivos.innerHTML = 'Nenhum dispositivo encontrado para essa unidade consumidora.';
        return;
    }

    dispositivosSelecionados.forEach((dispositivo) => {
        listaDispositivos.innerHTML += `
            <div class="dispositivo-item">
                <input type="checkbox" id="dispositivo-${dispositivo.id}" value="${dispositivo.id}">
                ${dispositivo.nome} - Consumo: ${dispositivo.consumo} W, Uso diário: ${dispositivo.uso_diario} horas
                <input type="number" id="quantidade-${dispositivo.id}" min="1" value="1" style="width: 60px;">
            </div>
        `;
    });
}

// Função para calcular o consumo de energia
function calcularConsumo() {
    const bandeiraTarifa = parseFloat(document.getElementById('bandeiraSelect').value);

    if (dispositivosSelecionados.length === 0 || isNaN(bandeiraTarifa)) {
        alert("Selecione uma unidade consumidora e uma bandeira tarifária.");
        return;
    }

    let consumoTotal = 0;

    dispositivosSelecionados.forEach(dispositivo => {
        const isChecked = document.getElementById(`dispositivo-${dispositivo.id}`).checked;
        const quantidade = parseInt(document.getElementById(`quantidade-${dispositivo.id}`).value) || 1;

        if (isChecked) {
            consumoTotal += dispositivo.consumo * dispositivo.uso_diario * quantidade; // Consumo diário total em W
        }
    });

    const consumoDiario = consumoTotal / 1000; // Convertendo para kW
    const consumoMensal = consumoDiario * 30; // Aproximando para 30 dias
    const consumoAnual = consumoDiario * 365; // Consumo anual total em kW
    const tarifa = consumoMensal * bandeiraTarifa;
    const custoMensal = consumoMensal + tarifa; // Custo mensal
    const custoAnual = custoMensal * 12; // Custo anual

    document.getElementById('resultado').innerText = `Consumo Diário: ${consumoDiario.toFixed(2)} kWh - Consumo Mensal: ${consumoMensal.toFixed(2)} kWh - Consumo Anual: ${consumoAnual.toFixed(2)} kWh - Custo Mensal: R$ ${custoMensal.toFixed(2)} - Custo Anual: R$ ${custoAnual.toFixed(2)}`;
}
