// o método OpenDatabase precisa de 4 parametros; o nome do banco de dados, a versão, a descrição e o tamanho estimado (em bytes)
let db = openDatabase(
  "Experimento_Reniel",
  "1.0",
  "Teste Web SQL Database",
  200000
);
let id;

version("1.0.2");

function version(version) {
  db.transaction(function(transaction) {
    transaction.executeSql("CREATE TABLE IF NOT EXISTS version (version TEXT)");
    transaction.executeSql(
      "SELECT * FROM version WHERE version = '" + version + "'",
      [],
      function(transaction, result) {
        var line = result.rows;
        if (line.length > 0) {
          create();
        } else {
          transaction.executeSql(
            'INSERT INTO version (version) VALUES ("' + version + '")'
          );
          deleteTable();
          create();
        }
      }
    );
  });
}
let INTEGRANTES = [];

function create() {
  db.transaction(function(transaction) {
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS leg_0 (nome TEXT, leg TEXT, combinacoes TEXT, tempo TEXT)"
    );
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS leg_2 (nome TEXT, leg TEXT, combinacoes TEXT, tempo TEXT)"
    );
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS leg_5 (nome TEXT, leg TEXT, combinacoes TEXT, tempo TEXT)"
    );
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS leg_8 (nome TEXT, leg TEXT, combinacoes TEXT, tempo TEXT)"
    );
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS AC (nome TEXT, leg TEXT, combinacoes TEXT, tempo TEXT)"
    );
  });
}

function deleteTable() {
  db.transaction(function(transaction) {
    transaction.executeSql("DELETE FROM leg_0");
    transaction.executeSql("DELETE FROM leg_2");
    transaction.executeSql("DELETE FROM leg_5");
    transaction.executeSql("DELETE FROM leg_8");
    transaction.executeSql("DELETE FROM AC");
  });
}

let ResultDB = {};
function set_resultDB(result) {
  ResultDB = result;
}

export function get_resultDB() {
  return ResultDB;
}

export function select(Table, Nome) {
  db.transaction(function(transaction) {
    transaction.executeSql(
      "SELECT * FROM " + Table + " WHERE nome = '" + Nome + "'",
      [],
      function(transaction, result) {
        // for(var i = 0; i < result.rows.length; i++){
        // 	var line = result.rows.item(i);
        // 	console.log('Combinacoes: ', JSON.parse(line.combinacoes));
        // }
        var line = result.rows.item(0);
        set_resultDB(line);
      }
    );
  });
}

export function download(Table, Nome) {
  db.transaction(function(transaction) {
    transaction.executeSql(
      "SELECT * FROM " + Table + " WHERE nome = '" + Nome + "'",
      [],
      function(transaction, result) {
        for (var i = 0; i < result.rows.length; i++) {
          var line = result.rows.item(i);
          create_table(line);
          // console.log('Combinacoes: ', JSON.parse(line.combinacoes));
        }
      }
    );
  });
}

function get_create() {
  if ($("#participante").val().length == 0) {
    $(".gerar-link").fadeOut();
  }
  $("#participante").keyup(function() {
    if ($.inArray($(this).val(), INTEGRANTES) == 0) {
      $(".gerar-link").fadeOut();
    } else {
      $(".gerar-link").fadeIn();
    }
  });
}
get_create();

function get_users() {
  db.transaction(function(transaction) {
    transaction.executeSql("SELECT * FROM leg_0", [], function(
      transaction,
      result
    ) {
      for (var i = 0; i < result.rows.length; i++) {
        var line = result.rows.item(i);
        INTEGRANTES.push(line.nome);
      }
    });
  });
  db.transaction(function(transaction) {
    transaction.executeSql("SELECT * FROM leg_2", [], function(
      transaction,
      result
    ) {
      for (var i = 0; i < result.rows.length; i++) {
        var line = result.rows.item(i);
        INTEGRANTES.push(line.nome);
      }
    });
  });
  db.transaction(function(transaction) {
    transaction.executeSql("SELECT * FROM leg_5", [], function(
      transaction,
      result
    ) {
      for (var i = 0; i < result.rows.length; i++) {
        var line = result.rows.item(i);
        INTEGRANTES.push(line.nome);
      }
    });
  });
  db.transaction(function(transaction) {
    transaction.executeSql("SELECT * FROM leg_8", [], function(
      transaction,
      result
    ) {
      for (var i = 0; i < result.rows.length; i++) {
        var line = result.rows.item(i);
        INTEGRANTES.push(line.nome);
      }
    });
  });
  db.transaction(function(transaction) {
    transaction.executeSql("SELECT * FROM AC", [], function(
      transaction,
      result
    ) {
      for (var i = 0; i < result.rows.length; i++) {
        var line = result.rows.item(i);
        INTEGRANTES.push(line.nome);
      }
    });
  });

  var participantes = "";

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  setTimeout(function() {
    var user = [];
    var participantes = "";
    INTEGRANTES.forEach(function(currentValue, index) {
      user.push(currentValue);
    });

    var unique = user.filter(onlyUnique);
    unique.forEach(function(currentValue, index) {
      participantes += "<option>" + currentValue + "</option>";
    });

    $(".select_participantes").html(participantes);
  }, 1000);
}
get_users();

$(document).on("click", ".get_dados", function(e) {
  e.preventDefault();
  download($(".select_tab").val(), $(".select_participantes").val());
});

function create_table(line) {
  var combinacoes = JSON.parse(line.combinacoes);
  var tempo = JSON.parse(line.tempo);

  var nomeLeg = $(".select_tab option:selected").text();
  var stringLeg = "";

  switch (nomeLeg) {
    case "leg_0":
      stringLeg = "Leg 0";
      break;
    case "leg_2":
      stringLeg = "Leg 2";
      break;
    case "leg_5":
      stringLeg = "Leg 5";
      break;
    case "leg_8":
      stringLeg = "Leg 8";
      break;
    case "AC":
      stringLeg = "Acoplado";
      break;
  }

  var indexArr = 0;
  var item = "";
  var indexNum = 1;
  combinacoes.forEach(function(currentValue, index) {
    var indexCombinacao = index;
    currentValue.forEach(function(currentValue, index) {
      var style = "";
      if (currentValue == false) {
        style = 'style="background-color: red;"';
      }

      if (currentValue == false) {
        var leg = JSON.parse(line.leg);
        if (tempo[indexCombinacao][index] == 20) {
          item += "<tr " + style + ">";
          item += "<td>" + line.nome + "</td>";
          item += "<td>" + indexNum + "</td>";
          item += "<td>" + stringLeg + "</td>";
          item += "<td></td>";
          item += "<td>" + currentValue + "</td>";
          item += "<td>" + tempo[indexCombinacao][index] + "</td>";
          item += "</tr>";
        } else {
          item += "<tr " + style + ">";
          item += "<td>" + line.nome + "</td>";
          item += "<td>" + indexNum + "</td>";
          item += "<td>" + stringLeg + "</td>";
          item += "<td>" + leg[indexArr] + "</td>";
          item += "<td>" + currentValue + "</td>";
          item += "<td>" + tempo[indexCombinacao][index] + "</td>";
          item += "</tr>";
          indexArr = indexArr + 1;
        }
      } else {
        var leg = JSON.parse(line.leg);
        item += "<tr " + style + ">";
        item += "<td>" + line.nome + "</td>";
        item += "<td>" + indexNum + "</td>";
        item += "<td>" + stringLeg + "</td>";
        item += "<td>" + leg[indexArr] + "</td>";
        item += "<td>" + currentValue + "</td>";
        item += "<td>" + tempo[indexCombinacao][index] + "</td>";
        item += "</tr>";
        indexArr = indexArr + 1;
      }

      indexNum = indexNum + 1;
    });
  });

  var tb = "<tr>";
  tb += "<th>NOME</th>";
  tb += "<th>TENTATIVA</th>";
  tb += "<th>LAG</th>";
  tb += "<th>SEQUÊNCIA</th>";
  tb += "<th>CONSEQUÊNCIA</th>";
  tb += "<th>LATÊNCIA</th>";
  tb += "</tr>";
  tb += item;
  $("#leg_table").html(tb);
}

export function getID() {
  return id;
}

export function insert(
  LEG,
  nome,
  leg_0_combinacoes,
  leg_0_tentativas_unidades,
  tempo
) {
  console.log("------------------------------------------------------");
  console.log("Insert");
  console.log("LEG", LEG);
  console.log("nome", nome);
  console.log("leg_0_combinacoes", leg_0_combinacoes);
  console.log("leg_0_tentativas_unidades", leg_0_tentativas_unidades);
  console.log("tempo", tempo);
  console.log("------------------------------------------------------");
  db.transaction(function(transaction) {
    transaction.executeSql(
      "INSERT INTO " +
        LEG +
        " (nome, leg, combinacoes, tempo) VALUES (?, ?, ?, ?)",
      [nome, leg_0_combinacoes, leg_0_tentativas_unidades, tempo],
      function(tx, results) {
        id = results.insertId;
      }
    );
  });
}

export function update(
  LEG,
  leg_0_combinacoes,
  leg_0_tentativas_unidades,
  tempo,
  ID
) {
  db.transaction(function(tx) {
    tx.executeSql(
      "update " + LEG + " set leg=?, combinacoes=?, tempo=? where id=?",
      [leg_0_combinacoes, leg_0_tentativas_unidades, tempo, ID],
      function(transaction, result) {
        console.log(result);
        console.info("Record Updated Successfully!");
      },
      function(transaction, error) {
        console.log(error);
      }
    );
  });
}

function transError(t, e) {
  // console.log(t);
  // console.log(e);
  // console.error("Error occured ! Code:" + e.code + " Message : " + e.message);
}

function transSuccess(t, r) {
  // console.info("Transaction completed Successfully!");
  // console.log(t);
  // console.log(r);
}
