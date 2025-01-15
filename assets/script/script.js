// Função de Votação
function votar() {
    const matricula = document.getElementById('matricula').value.trim();
    const candidatoSelecionado = document.querySelector('input[name="candidato"]:checked');


    // Verificar se um candidato foi selecionado
    if (candidatoSelecionado) {
        const voto = candidatoSelecionado.value;
        const votos = JSON.parse(localStorage.getItem('votos')) || {};
        const horarios = JSON.parse(localStorage.getItem('horarios')) || {};

        // Registrar o voto
        if (!votos[voto]) votos[voto] = 0;
        if (!horarios[voto]) horarios[voto] = [];
        
        votos[voto]++;
        horarios[voto].push(new Date().toLocaleString());

        // Salvar os votos e horários no localStorage
        localStorage.setItem('votos', JSON.stringify(votos));
        localStorage.setItem('horarios', JSON.stringify(horarios));


        // Ocultar a página de votação e mostrar a tela de confirmação
        document.getElementById('paginaVotacao').style.display = 'none';
        document.getElementById('telaConfirmacao').style.display = 'block';

       var audio = new Audio('/test-votacao/assets/aud/som.mp3');  // Caminho relativo ao GitHub Pages
        audio.play();
        // Limpar seleção e matrícula
        document.querySelector('input[name="candidato"]:checked').checked = false;
        document.getElementById('matricula').value = ''; // Limpar o campo de matrícula
    } else {
        alert('Selecione um candidato para votar.');
    }
}

// Função para voltar com senha
document.getElementById('voltarComSenhaBtn').addEventListener('click', function() {
    // Mostrar a tela de senha
    document.getElementById('telaSenha').style.display = 'block';
    document.getElementById('telaConfirmacao').style.display = 'none';

    // Limpar o campo de senha
    document.getElementById('senhaInput').value = ''; // Limpar o campo de senha
});

// Função para verificar a senha
document.getElementById('verificarSenhaBtn').addEventListener('click', function() {
    const senhaDigitada = document.getElementById('senhaInput').value;
    const senhaCorreta = '12345'; // Defina a senha que deseja aqui

    if (senhaDigitada === senhaCorreta) {
        // Senha correta, exibe novamente a página de votação
        document.getElementById('paginaVotacao').style.display = 'block';
        document.getElementById('telaSenha').style.display = 'none';

        // Limpar o campo de matrícula e senha
        document.getElementById('matricula').value = ''; // Limpar matrícula
        document.getElementById('senhaInput').value = ''; // Limpar senha
    } else {
        // Senha incorreta, exibe mensagem de erro
        document.getElementById('mensagemSenha').style.display = 'block';
    }
});


function irParaApuracao() {
    document.getElementById('paginaVotacao').style.display = 'none';
    document.getElementById('paginaResultado').style.display = 'block';
}

function verificarSenha() {
    const senha = document.getElementById('senha').value;
    if (senha === '1546') {
        exibirResultado();
    } else {
        alert('Senha incorreta!');
    }
}

function voltar() {

    document.getElementById('paginaResultado').style.display = 'none';
    document.getElementById('paginaVotacao').style.display = 'block';
    document.getElementById('matricula').value = ''; 
    const candidatos = document.querySelectorAll('input[name="candidato"]');
    candidatos.forEach(candidato => candidato.checked = false); 
}

function exibirResultado() {
    const votos = JSON.parse(localStorage.getItem('votos')) || {};
    const candidatos = [
        "MIRLON BACELAR GOMES", "RAINARA SOUZA CASTELO BRANCO", "MARILENE DOS SANTOS SILVA",
        "JERRY LIMA GOMES", "MARLENE SOUSA", "FRANCISCO MARIO SANTOS VIEIRA FILHO",
        "RODRIGO ALVES DE SOUZA", "KARLA LOURENA DOS REIS DE ANDRADE", "GABRIEL VITOR BERTOLDO",
        "JOEL DOS SANTOS DIAS (FOGUIM)", "BARBARA HOLANDA DOS SANTOS", "WENDYELLE RIOS CORDEIRO",
        "WRANA INGRID GOMES FEITOSA", "ANDRÉ LOPES DE ALMEIDA", "FRANCISCO ARAUJO DE SOUSA FILHO",
        "CARLOS HENRIQUE OLIVEIRA SOUZA", "ANTONIO JOSE LOBO DA SILVA", "MARCOS LIMA DA ROCHA", 
        "WARDSON MIRANDA SILVA", "VOTO NULO"
    ];

    const resultado = candidatos.map(candidato => ({
        nome: candidato,
        votos: votos[candidato] || 0
    })).sort((a, b) => b.votos - a.votos);

    const listaResultados = document.getElementById('resultadoVotos');
    listaResultados.innerHTML = '';

    resultado.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nome}: ${item.votos} votos`;
        listaResultados.appendChild(li);
    });

    document.getElementById('resultados').style.display = 'block';
}

function gerarRelatorio() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const resultados = document.getElementById('resultadoVotos').innerText;

    doc.text('Relatório de Resultados da Votação CIPA 2025/2026', 10, 10);
    doc.text(resultados, 10, 20);

    doc.save('relatorio_resultados_cipa.pdf');
}

function gerarRelatorioHora() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const votos = JSON.parse(localStorage.getItem('votos')) || {};
    const horarios = JSON.parse(localStorage.getItem('horarios')) || {}; 
    const candidatos = [
        "MIRLON BACELAR GOMES", "RAINARA SOUZA CASTELO BRANCO", "MARILENE DOS SANTOS SILVA",
        "JERRY LIMA GOMES", "MARLENE SOUSA", "FRANCISCO MARIO SANTOS VIEIRA FILHO",
        "RODRIGO ALVES DE SOUZA", "KARLA LOURENA DOS REIS DE ANDRADE", "GABRIEL VITOR BERTOLDO",
        "JOEL DOS SANTOS DIAS (FOGUIM)", "BARBARA HOLANDA DOS SANTOS", "WENDYELLE RIOS CORDEIRO",
        "WRANA INGRID GOMES FEITOSA", "ANDRÉ LOPES DE ALMEIDA", "FRANCISCO ARAUJO DE SOUSA FILHO",
        "CARLOS HENRIQUE OLIVEIRA SOUZA", "ANTONIO JOSE LOBO DA SILVA", "MARCOS LIMA DA ROCHA", 
        "WARDSON MIRANDA SILVA", "VOTO NULO"
    ];

    doc.text('Relatório Detalhado de Votos com Horários - CIPA 2025/2026', 10, 10);

    let yPosition = 20;

    // Definir a altura máxima antes de uma nova página
    const alturaMaxima = 270; // Pode ser ajustado conforme necessário

    candidatos.forEach(candidato => {
        const candidatoVotos = votos[candidato] || 0;
        const candidatoHorarios = horarios[candidato] || [];

        // Adicionar o nome do candidato e quantidade de votos
        doc.text(`${candidato}: ${candidatoVotos} votos`, 10, yPosition);
        yPosition += 10;

        // Adicionar os horários dos votos
        if (candidatoHorarios.length > 0) {
            candidatoHorarios.forEach((hora, index) => {
                doc.text(`  Voto ${index + 1}: ${hora}`, 20, yPosition);
                yPosition += 10;
            });
        }

        yPosition += 5; // Espaço entre candidatos

        // Verificar se a posição y ultrapassou a altura máxima
        if (yPosition > alturaMaxima) {
            doc.addPage(); // Cria uma nova página
            yPosition = 10; // Reseta a posição y para o topo da nova página
        }
    });

    doc.save('relatorio_detalhado_votos_horarios_cipa.pdf');
}






// Função para verificar a senha
function verificarSenhaLimpar() {
    let senhaCorreta = "1234";  // Substitua com a senha real
    let senhaDigitada = prompt("Digite a senha para limpar os dados:");

    if (senhaDigitada === senhaCorreta) {
        // Se a senha estiver correta, limpar os dados
        limparDados();
    } else {
        // Caso a senha esteja errada
        alert("Senha incorreta. Acesso negado.");
    }
}

// Função para limpar todos os dados da sessão
function limparDados() {
    // Remove as informações de votos e horários armazenados no localStorage
    localStorage.removeItem('votos');
    localStorage.removeItem('horarios');
    localStorage.removeItem('matriculasQueJaVotaram'); // Remove as matrículas que já votaram

    alert('Todos os dados de votação foram apagados!');

    // Opcional: Redirecionar ou esconder os resultados
    document.getElementById('resultados').style.display = 'none';
    document.getElementById('resultadoVotos').innerHTML = '';
}
