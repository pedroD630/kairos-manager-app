const baseUrl = "/";
let cron;
let hour = 0;
let minute = 0;
let second = 0;
let millisecond = 0;

let cronParte;
let pHour = 0;
let pMinute = 0;
let pSecond = 0;
let pMillisecond = 0;
let parteAtual = 0;
let temposPartes;

let reuniaoIniciada = false;
let parteIniciada = false;
let reuniaoPausada = false;

class Parte {
  constructor(quem, tempo) {
    this.quem = quem;
    this.tempo = tempo;
  }
}

// Carrega o menu HTML dinamicamente
fetch(`${baseUrl}src/reutil/menu-inf.html`)
  .then(response => {
    if (!response.ok) throw new Error(`Erro ao carregar menu: ${response.statusText}`);
    return response.text(); // Converte o conteúdo para texto
  })
  .then(menuHTML => {
    document.getElementById('menu').innerHTML = menuHTML; // Insere o menu no elemento com id="menu"
  })
  .catch(error => {
    console.error('Erro ao carregar o menu:', error); // Exibe o erro no console
  });

fetch(`${baseUrl}src/reutil/cronometro.html`)
  .then(response => {
    if (!response.ok) throw new Error(`Erro ao carregar cronometro: ${response.statusText}`);
    return response.text(); // Converte o conteúdo para texto
  })
  .then(menuHTML => {
    document.getElementById('cronometro').innerHTML = menuHTML; // Insere o menu no elemento com id="menu"
  })
  .catch(error => {
    console.error('Erro ao carregar o cronometro:', error); // Exibe o erro no console
  });

function selecionarRelPorData() {
  const diasFimDeSemana = [5, 6, 0];
  const dataAtual = new Date();
  const diaHoje = dataAtual.getDay();

  if (diasFimDeSemana.includes(diaHoje)) {
    window.location.href = `${baseUrl}src/relatorios/fds.html`;
  } else {
    window.location.href = `${baseUrl}src/relatorios/mds.html`;
  }
}

function receberHorario(){
  let date = new Date();
  let horas = date.getHours();
  let minutos = date.getMinutes();

  let horasFormatada = horas.toString().padStart(2, '0');
  let minutosFormatado = minutos.toString().padStart(2, '0');

  return `${horasFormatada}:${minutosFormatado}`;
}

function startCron() {
  pauseCron();
  cron = setInterval(() => { timer(); }, 10);

  if(parteIniciada){
    startParte();
  }
}

function pauseCron() {
  clearInterval(cron);
  clearInterval(cronParte);
}

function resetCron() {
  clearInterval(cron);
  hour = 0;
  minute = 0;        
  second = 0;    
  millisecond = 0;
  document.getElementById('displayTime').innerText = '00:00:00';
}

function timer() {
  if ((millisecond += 10) === 1000) {
    millisecond = 0;
    second++;
  }
  if (second === 60) {
    second = 0;
    minute++;
  }
  if (minute === 60) {
    minute = 0;
    hour++;
  }

  const formattedHour = returnData(hour);
  const formattedMinute = returnData(minute);
  const formattedSecond = returnData(second);

  document.getElementById('displayTime').innerText = `${formattedHour}:${formattedMinute}:${formattedSecond}`;
}

function startParte() {
  clearInterval(cronParte);
  cronParte = setInterval(() => { timerParte(); }, 10);
}

function resetParte() {
  clearInterval(cronParte);
  pHour = 0;
  pMinute = 0;        
  pSecond = 0;    
  pMillisecond = 0;
  document.getElementById('displayParte').innerText = '00:00:00';
}

function timerParte() {
  if ((pMillisecond += 10) === 1000) {
    pMillisecond = 0;
    pSecond++;
  }
  if (pSecond === 60) {
    pSecond = 0;
    pMinute++;
  }
  if (pMinute === 60) {
    pMinute = 0;
    pHour++;
  }

  const formattedPHour = returnData(pHour);
  const formattedPMinute = returnData(pMinute);
  const formattedPSecond = returnData(pSecond);

  if (parteAtual < temposPartes.length) {
    if(pHour > 0) {
      temposPartes[parteAtual].value = `${formattedPHour}:${formattedPMinute}:${formattedPSecond}`;
    }
    else {
      temposPartes[parteAtual].value = `${formattedPMinute}:${formattedPSecond}`;
    }
    
  }

  document.getElementById('displayParte').innerText = `${formattedPHour}:${formattedPMinute}:${formattedPSecond}`;

}

function preencherTempo(index) {
  const parteTempo = temposPartes[index];
  const formattedPHour = returnData(pHour);
  const formattedPMinute = returnData(pMinute);
  const formattedPSecond = returnData(pSecond);

  if(pHour > 0){
    parteTempo.value = `${formattedPHour}:${formattedPMinute}:${formattedPSecond}`;
  }
  else {
    parteTempo.value = `${formattedPMinute}:${formattedPSecond}`;
  }
}

function returnData(input) {
  return input >= 10 ? input : `0${input}`
}

function preencherTempoTotal() {
  let tempoTotal = document.getElementById("tempoTotal");
  tempoTotal.value = document.getElementById("displayTime").textContent;
}

function gerarPdfMds(){
  const horaInicio = document.getElementById("horaInicio").value;
  const comentInicial = new Parte(document.getElementById("comentariosIniciais").value, document.getElementById("tempoComentariosIniciais").value);
  const discurso = new Parte(document.getElementById("discurso").value, document.getElementById("tempoDiscurso").value);
  const encontreJoias = new Parte(document.getElementById("encontreJoias").value, document.getElementById("tempoEncontreJoias").value);
  const leituraBiblia = new Parte(document.getElementById("leituraBiblia").value, document.getElementById("tempoLeituraBiblia").value);
  const conselho1 = new Parte(document.getElementById("conselho1").value, document.getElementById("tempoConselho1").value);
  const parte1 = new Parte(document.getElementById("parte1").value, document.getElementById("tempoParte1").value);
  const conselho2 = new Parte(document.getElementById("conselho2").value, document.getElementById("tempoConselho2").value);
  const parte2 = new Parte(document.getElementById("parte2").value, document.getElementById("tempoParte2").value);
  const conselho3 = new Parte(document.getElementById("conselho3").value, document.getElementById("tempoConselho3").value);
  const parte3 = new Parte(document.getElementById("parte3").value, document.getElementById("tempoParte3").value);
  const conselho4 = new Parte(document.getElementById("conselho4").value, document.getElementById("tempoConselho4").value);
  const parte4 = new Parte(document.getElementById("parte4").value, document.getElementById("tempoParte4").value);
  const conselho5 = new Parte(document.getElementById("conselho1").value, document.getElementById("tempoConselho5").value);
  const NvcParte1 = new Parte(document.getElementById("NvcParte1").value, document.getElementById("tempoNvcParte1").value);
  const NvcParte2 = new Parte(document.getElementById("NvcParte2").value, document.getElementById("tempoNvcParte2").value);
  const NvcParte3 = new Parte(document.getElementById("NvcParte3").value, document.getElementById("tempoNvcParte3").value);
  const estudoBiblico = new Parte(document.getElementById("estudoBiblico").value, document.getElementById("tempoEstudoBiblico").value);
  const comentariosFinais = new Parte(document.getElementById("comentariosFinais").value, document.getElementById("tempoComentariosFinais").value);
  const anuncios = new Parte(document.getElementById("anuncios").value, document.getElementById("tempoAnuncios").value);
  const horaFim = document.getElementById("horaFim").value;
  const tempoTotal = document.getElementById("tempoTotal").value;

  // playground requires you to assign document definition to a variable called dd
  var dd = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    content: [
      { text: 'Reunião Meio de Semana', style: 'subheader' },
      {
        style: 'tableExample',
        table: {
          widths: ['auto', 'auto'], // Define as larguras das colunas
          body: [
            ['Hora Início', `${horaInicio}`],
          ],
        },
      },
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: ['auto', 'auto', 'auto', 'auto'], // Larguras para 4 colunas
          headerRows: 1, // Define o número de linhas de cabeçalho
          body: [
            // Primeira linha com colSpan
            [
              { text: '', style: 'tableHeader', alignment: 'center' }, // Cabeçalho vazio
              { text: 'Parte', style: 'tableHeader', alignment: 'center' },
              { text: 'Tempo Gasto', style: 'tableHeader', alignment: 'center' },
              { text: 'Quem', style: 'tableHeader', alignment: 'center' }
            ],
            // Segunda linha de cabeçalho
            ['', { text: 'Comentários Iniciais', alignment: 'center' }, `${comentInicial.tempo}`, `${comentInicial.quem}`],
            // Corpo da tabela
            [
              { rowSpan: 4, text: 'Tesouros da Palavra de Deus', fillColor: '#cce5ff' },
              'Discurso (10 min.)',
              `${discurso.tempo}`,
              `${discurso.quem}`
            ],
            ['', 'Encontre Joias (10 min.)', `${encontreJoias.tempo}`, `${encontreJoias.quem}`],
            ['', 'Leitura da Bíblia (4 min.)', `${leituraBiblia.tempo}`, `${leituraBiblia.quem}`],
            ['', 'Conselho (1 min.)', `${conselho1.tempo}`, `${conselho1.quem}`],
            [
              { rowSpan: 8, text: 'Faça Seu Melhor no Ministério', fillColor: '#ffda9e'},
              '1° Parte',
              `${parte1.tempo}`,
              `${parte1.quem}`
            ],
            ['', 'Conselho (1 min.)', `${conselho2.tempo}`, `${conselho2.quem}`],
            ['', '2° Parte', `${parte2.tempo}`, `${parte2.quem}`],
            ['', 'Conselho (1 min.)', `${conselho3.tempo}`, `${conselho3.quem}`],
            ['', '3° Parte', `${parte3.tempo}`, `${parte3.quem}`],
            ['', 'Conselho (1 min.)', `${conselho4.tempo}`, `${conselho4.quem}`],
            ['', '4° Parte', `${parte4.tempo}`, `${parte4.quem}`],
            ['', 'Conselho (1 min.)', `${conselho5.tempo}`, `${conselho5.quem}`],
            [
              { rowSpan: 4, text: 'Nossa Vida Cristã', fillColor: '#fcb7af' },
              '1° Parte',
              `${NvcParte1.tempo}`,
              `${NvcParte1.quem}`
            ],
            ['', '2° Parte', `${NvcParte2.tempo}`, `${NvcParte2.quem}`],
            ['', '3° Parte', `${NvcParte3.tempo}`, `${NvcParte3.quem}`],
            ['', 'Estudo Bíblico', `${estudoBiblico.tempo}`, `${estudoBiblico.quem}`],

            ['', 'Comentários Finais', `${comentariosFinais.tempo}`, `${comentariosFinais.quem}`],
            ['', 'Anúncios', `${anuncios.tempo}`, `${anuncios.quem}`],
          ],
        },
      },
      {
        style: 'tableExample',
        table: {
          widths: ['auto', 'auto', 'auto', 'auto'], // Define as larguras das colunas
          body: [
            [{text: 'Hora Fim', fillColor: '#fbdcb0'}, `${horaFim}`, {text:'Tempo Total', fillColor: '#a4d9a3'}, `${tempoTotal}`]
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
        alignment: 'center',
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
      },
    },
    defaultStyle: {
      // alignment: 'justify'
    },
  };
  
  pdfMake.createPdf(dd).download('reuniao-mds.pdf');
}

function gerarPdfRelatorio(tipoReuniao){
  if(tipoReuniao == "fds"){
    gerarPdfFds();
  }
  else {
    gerarPdfMds();
  }
}

document.addEventListener("DOMContentLoaded", () =>{

  temposPartes = document.querySelectorAll(".tempo-parte");

  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "hideTimer") {
      let timerNavbar = document.getElementById("cronometro");
      timerNavbar.classList.toggle("hidden");
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "startMeeting") {

      if(!reuniaoIniciada){
        let horaInicio = document.getElementById("horaInicio");
        horaInicio.value = receberHorario();
        reuniaoIniciada = true;
      }
      reuniaoPausada = false;
      startCron();
    }

    if (event.target && event.target.id === "encerrarReuniao") {
      event.preventDefault();
      let horaFim = document.getElementById("horaFim");
      horaFim.value = receberHorario();

      preencherTempoTotal();
      resetCron();

      reuniaoIniciada = false;

      if(parteIniciada){
        parteIniciada = false;
        preencherTempo(parteAtual);
        parteAtual = 0;
        resetParte();
      }

      gerarPdfRelatorio(tipoReuniao);
    }

    if (event.target && event.target.id === "pauseMeeting") {
      reuniaoPausada = true;
      pauseCron();
    }

    if (event.target && event.target.id === "startParte") {

      if(reuniaoIniciada && !reuniaoPausada){
        if(!parteIniciada){
          parteIniciada = true;
        }
  
        startParte();
      }
      else {alert("Reunião não iniciada!")}
    }

    if (event.target && event.target.id === "endParte") {
      parteIniciada = false;
      preencherTempo(parteAtual);
      parteAtual++;
      resetParte();
    }
  });
});
