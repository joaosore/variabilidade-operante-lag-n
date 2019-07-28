import { canvasSelect, canvasExit } from "./canvas.js";
import { insert, update, select, getID, get_resultDB } from "./web_sql.js";
import {
  GetNome,
  GetLeg,
  GetSequencia,
  GetDuracao,
  GetIntervalo,
  GetTentativas,
  GetSeq
} from "./start.js";

let TENTATIVAS;
let SEQUENCE;
let LEG;
let TIME;
let TIME_INTERVALO;
let NOME;

let ID;
let COMBINACOES = [];
let UNIDADE = "";

let STAP = [];
let TENTATIVAS_UNIDADE = [];

let COUT_TENTATIVAS = 1;

let L = "E";
let R = "D";

let AUDIO;

let leg_0 = false;
let leg_2 = false;
let leg_5 = false;
let leg_8 = false;
let AC = false;

let TB_DB;

let TIME_START;
let TIME_END;
let TIME_EXE = [];
let TIME_EXE_UNIDADE = [];

let COMBINACOES_AC = [];
let COMBINACOES_AC_TIME = [];

function LegsAtivos() {
  leg_0 = GetLeg(0);
  leg_2 = GetLeg(2);
  leg_5 = GetLeg(5);
  leg_8 = GetLeg(8);
  AC = GetLeg("ac");
}
LegsAtivos();

function updateLegs() {
  ID;
  COMBINACOES = [];
  UNIDADE = "";
  STAP = [];
  TENTATIVAS_UNIDADE = [];
  COUT_TENTATIVAS = 1;
  AUDIO.pause();
  AUDIO.currentTime = 0;

  if (
    leg_0 != true &&
    leg_2 != true &&
    leg_5 != true &&
    leg_8 != true &&
    AC != true
  ) {
    alert("Finalizado!!!");
    window.location = window.location.pathname;
  } else {
    ifLeg();
  }
}

function ifLeg() {
  var seq = GetSeq("seq");
  switch (seq) {
    case "Crescente":
      if (leg_0 === true) {
        console.log("AQUI leg_0");
        GetData(0);
        TB_DB = "leg_0";
        leg_0 = false;
      } else if (leg_2 === true) {
        console.log("AQUI leg_2");
        GetData(2);
        TB_DB = "leg_2";
        leg_2 = false;
      } else if (leg_5 === true) {
        console.log("AQUI leg_5");
        GetData(5);
        TB_DB = "leg_5";
        leg_5 = false;
      } else if (leg_8 == true) {
        console.log("AQUI leg_8");
        GetData(8);
        TB_DB = "leg_8";
        leg_8 = false;
      } else if (AC == true) {
        console.log("AQUI AC");
        GetData("AC");
        TB_DB = "AC";
        AC = false;
      }
      break;
    case "Decrescente":
      if (leg_8 === true) {
        console.log("AQUI leg_8");
        GetData(8);
        TB_DB = "leg_8";
        leg_8 = false;
      } else if (leg_5 === true) {
        console.log("AQUI leg_5");
        GetData(5);
        TB_DB = "leg_5";
        leg_5 = false;
      } else if (leg_2 === true) {
        console.log("AQUI leg_2");
        GetData(2);
        TB_DB = "leg_2";
        leg_2 = false;
      } else if (leg_0 == true) {
        console.log("AQUI leg_0");
        GetData(0);
        TB_DB = "leg_0";
        leg_0 = false;
      } else if (AC == true) {
        console.log("AQUI AC");
        GetData("AC");
        TB_DB = "AC";
        AC = false;
      }
      break;
  }

  sequenceNumer();
}

export function GetData(n) {
  if (n == "AC") {
    n = 5;
    NOME = GetNome(n);
    LEG = "AC";
    SEQUENCE = GetSequencia(n);
    TIME = GetDuracao(n);
    TIME_INTERVALO = GetIntervalo(n);
    select("leg_5", GetNome(n));
    setTimeout(function() {
      COMBINACOES_AC = JSON.parse(get_resultDB().combinacoes);
      COMBINACOES_AC_TIME = JSON.parse(get_resultDB().tempo);

      console.log("AC COMBINACOES_AC: ", COMBINACOES_AC);
      console.log("AC COMBINACOES_AC_TIME: ", COMBINACOES_AC_TIME);
    }, 50);
  } else {
    NOME = GetNome(n);
    TENTATIVAS = GetTentativas(n);
    SEQUENCE = GetSequencia(n);
    LEG = n;
    TIME = GetDuracao(n);
    TIME_INTERVALO = GetIntervalo(n);
  }
}
som();

export function click_L() {
  console.log("Esquerda");
  UNIDADE += L;
  sequence(UNIDADE);
  showSquad();
}

export function click_R() {
  console.log("Direta");
  UNIDADE += R;
  sequence(UNIDADE);
  showSquad();
}

$(".iniciar").clickOrTouch(function() {
  timeStart();
  updateLegs();
  blackView();
  setTimeout(function() {
    ID = getID();
    $(".inicial").hide();
    $(".teste").show();
  }, 500);
});

function removeParams(sParam) {
  var url = window.location.href.split("?")[0] + "?";
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] != sParam) {
      url = url + sParameterName[0] + "=" + sParameterName[1] + "&";
    }
  }
  return url.substring(0, url.length - 1);
}

function showSquad() {
  var index = $(".status .bar.active").length;
  $(".status .bar:eq(" + index + ")").addClass("active");
}

function resetSquad() {
  $(".status .bar").removeClass("active");
}

function sequenceNumer() {
  $(".status").empty();
  for (var i = SEQUENCE; i >= 1; i--) {
    $(".status").append('<div class="bar"></div>');
  }
}

function sequence(unidade) {
  if (unidade.length == SEQUENCE) {
    COMBINACOES.push(unidade);
    UNIDADE = "";
    leg() ? proxEtapa() : resetEtapa();
  }
}

function leg() {
  var LASTELEMENT = COMBINACOES.length - 1;
  var dados = false;
  switch (LEG) {
    case 0:
      dados = true;
      break;
    case 2:
      if (
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 1] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 2]
      ) {
        dados = true;
      }
      break;
    case 5:
      if (
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 1] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 2] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 3] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 4] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 5]
      ) {
        dados = true;
      }
      break;
    case 8:
      if (
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 1] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 2] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 3] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 4] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 5] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 6] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 7] &&
        COMBINACOES[LASTELEMENT] != COMBINACOES[LASTELEMENT - 8]
      ) {
        dados = true;
      }
      break;
    case "AC":
      console.log("AC");
      console.log(COMBINACOES_AC);
      console.log(COMBINACOES_AC_TIME);
      COMBINACOES_AC.forEach(function(currentValue, index) {
        if (STAP.length == index) {
          console.log("index", index);
          console.log("currentValue.length", currentValue.length);
          console.log(
            "TENTATIVAS_UNIDADE.length",
            TENTATIVAS_UNIDADE.length + 1
          );
          if (currentValue.length == TENTATIVAS_UNIDADE.length + 1) {
            console.log("COMBINACOES_AC_TIME", COMBINACOES_AC_TIME);

            var lest_item = COMBINACOES_AC_TIME[index].length - 1;

            if (COMBINACOES_AC_TIME[index][lest_item] != 20) {
              dados = true;
            } else {
              dados = false;
            }
          }
        }
      });
      break;
  }
  return dados;
}

function timeStart() {
  TIME_START = new Date();
  console.log(TIME_START);
}

function timeEnd() {
  var TIME_END = new Date();
  var TIME_ITEM = (TIME_START.getTime() - TIME_END.getTime()) / 1000;
  var timeInt = TIME_ITEM * -1;
  if (timeInt > parseInt(TIME) / 1000) {
    timeInt = 20;
  }
  return timeInt;
}

function resetEtapa() {
  TIME_EXE_UNIDADE.push(timeEnd());
  TENTATIVAS_UNIDADE.push(false);

  console.log("------------------------------------------------------");
  console.log("resetEtapa");
  console.log("------------------------------------------------------");

  console.log("TIME_EXE_UNIDADE: ", TIME_EXE_UNIDADE);
  console.log("TENTATIVAS_UNIDADE: ", TENTATIVAS_UNIDADE);
  console.log("COMBINACOES: ", COMBINACOES);

  console.log("------------------------------------------------------");
  UNIDADE = "";

  setTimeout(function() {
    resetSquad();
  }, 50);
}

function proxEtapa() {
  TIME_EXE_UNIDADE.push(timeEnd());
  TIME_EXE.push(TIME_EXE_UNIDADE);
  timeStart();
  TENTATIVAS_UNIDADE.push(true);
  STAP.push(TENTATIVAS_UNIDADE);

  console.log("------------------------------------------------------");
  console.log("proxEtapa");
  console.log("------------------------------------------------------");

  console.log("TIME_EXE_UNIDADE: ", TIME_EXE_UNIDADE);
  console.log("TIME_EXE:", TIME_EXE);
  console.log("TENTATIVAS_UNIDADE: ", TENTATIVAS_UNIDADE);
  console.log("STAP: ", STAP);
  console.log("COMBINACOES: ", COMBINACOES);

  console.log("------------------------------------------------------");

  coutTentativa();
  TENTATIVAS_UNIDADE = [];
  TIME_EXE_UNIDADE = [];
  UNIDADE = "";
}

function proxEtapaTimeout() {
  TIME_EXE_UNIDADE.push(timeEnd());
  TIME_EXE.push(TIME_EXE_UNIDADE);
  timeStart();
  TENTATIVAS_UNIDADE.push(false);
  STAP.push(TENTATIVAS_UNIDADE);

  console.log("------------------------------------------------------");
  console.log("proxEtapaTimeout");
  console.log("------------------------------------------------------");

  console.log("TIME_EXE_UNIDADE: ", TIME_EXE_UNIDADE);
  console.log("TIME_EXE:", TIME_EXE);
  console.log("TENTATIVAS_UNIDADE: ", TENTATIVAS_UNIDADE);
  console.log("STAP: ", STAP);
  console.log("COMBINACOES: ", COMBINACOES);

  console.log("------------------------------------------------------");
  coutTentativa();
  TENTATIVAS_UNIDADE = [];
  TIME_EXE_UNIDADE = [];
  UNIDADE = "";
}

function coutTentativa() {
  if (TENTATIVAS == STAP.length) {
    stop();
  } else {
    blackView();
  }
}

function stop() {
  AUDIO.pause();
  AUDIO.currentTime = 0;
  $(".black-view").fadeIn();
  insert(
    TB_DB,
    NOME,
    tratamento(COMBINACOES),
    tratamento(STAP),
    tratamento(TIME_EXE)
  );
  // update(TB_DB, tratamento(COMBINACOES), tratamento(STAP), tratamento(TIME_EXE), ID);
  $(".grey-view").show();
  canvasExit();
  TIME_EXE = [];
}

$(".next").clickOrTouch(function() {
  console.log("");
  $(".grey-view").hide();
  updateLegs();
  $(".black-view").fadeOut();
  canvasSelect();
  AUDIO.play();
  resetSquad();
  timeStart();
});

function tratamento(array) {
  return JSON.stringify(array);
}

function blackView() {
  AUDIO.pause();
  AUDIO.currentTime = 0;
  $(".black-view").fadeIn();
  setTimeout(function() {
    AUDIO.play();
    resetSquad();
    $(".black-view").fadeOut();
    canvasSelect();
  }, TIME_INTERVALO);
}

function som() {
  AUDIO = document.createElement("audio");
  AUDIO.setAttribute("src", "assets/som.mp3");
  // AUDIO.volume = 0;
  AUDIO.addEventListener("timeupdate", function() {
    // console.log(parseInt(AUDIO.currentTime)*1000);
    // console.log(UNIDADE);
    if (parseInt(AUDIO.currentTime) * 1000 == parseInt(TIME)) {
      proxEtapaTimeout();
    }
  });
}

$(".debug").clickOrTouch(function() {
  console.log("COMBINACOES: ", COMBINACOES);
  console.log("STAP: ", STAP);
});
