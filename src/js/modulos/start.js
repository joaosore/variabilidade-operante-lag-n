import {getParameterByName} from './library.js';

// ?nome=Pessoa 1&leg_0=TRUE&sequencia_0=4&duracao_0=20000&intervalo_0=2000&tentativas_0=2&leg_2=TRUE&sequencia_2=4&duracao_2=20000&intervalo_0=2000&tentativas_2=2&leg_5=TRUE&sequencia_5=4&duracao_5=20000&intervalo_0=2000&tentativas_5=2&leg_8=TRUE&sequencia_8=4&duracao_8=20000&intervalo_0=2000&tentativas_8=2&leg_AC=TRUE

export function GetNome()
{
	return getParameterByName('nome');
}

// Leg Numero

export function GetLeg(n)
{
	return getBoolean(getParameterByName('leg_'+n));
}

//Sequencia

export function GetSequencia(n)
{
	return getParameterByName('sequencia_'+n);
}


// Duração

export function GetDuracao(n)
{
	return getParameterByName('duracao_'+n);
}

// Intervalo

export function GetIntervalo(n)
{
	return getParameterByName('intervalo_'+n);
}

// Tentativas

export function GetTentativas(n)
{
	return getParameterByName('tentativas_'+n);
}

export function GetSeq(string)
{
	return getParameterByName(string);
}

function init()
{
	if(getBoolean(getParameterByName('leg_0')) == true || getBoolean(getParameterByName('leg_2')) == true || getBoolean(getParameterByName('leg_5')) == true || getBoolean(getParameterByName('leg_8')) == true)
	{
		$('.dados').hide();
		$('.inicial').css('display', 'flex');
	} else if(getBoolean(getParameterByName('download')) == true)
	{
		$('.dados').hide();
		$('.download').css('display', 'flex');
	}
}
init();


function create()
{
	$('.leg_0, .leg_2, .leg_5, .leg_8').hide();

	$('#leg_0').change(function(){
        if($(this).is(":checked"))
        {
        	$('.leg_0').fadeIn();
        	$(this).val('true');
        }
        else
        {
        	$('.leg_0').fadeOut();
        	$(this).val('false');
        }
    });

    $('#leg_2').change(function(){
        if($(this).is(":checked"))
        {
        	$('.leg_2').fadeIn();
        	$(this).val('true');
        }
        else
        {
        	$('.leg_2').fadeOut();
        	$(this).val('false');
        }
    });

    $('#leg_5').change(function(){
        if($(this).is(":checked"))
        {
        	$('.leg_5').fadeIn();
        	$(this).val('true');
        }
        else
        {
        	$('.leg_5').fadeOut();
        	$(this).val('false');
        }
    });

    $('#leg_8').change(function(){
        if($(this).is(":checked"))
        {
        	$('.leg_8').fadeIn();
        	$(this).val('true');
        }
        else
        {
        	$('.leg_8').fadeOut();
        	$(this).val('false');
        }
    });

    $('#ac').change(function(){
        if($(this).is(":checked"))
        {
        	$(this).val('true');
        }
        else
        {
        	$(this).val('false');
        }
    });

    $('.gerar-link').click(function(e){
    	e.preventDefault();

		var PARTICIPANTE = $('#participante').val();

		var leg_0 = getBoolean($('#leg_0').val());
		var leg_2 = getBoolean($('#leg_2').val());
		var leg_5 = getBoolean($('#leg_5').val());
		var leg_8 = getBoolean($('#leg_8').val());
		var ac = getBoolean($('#ac').val());

		var sequencia_0 = $('#sequencia_0').val();
		var duracao_0 = $('#duracao_0').val();
		var intervalo_0 = $('#intervalo_0').val();
		var tentativas_0 = $('#tentativas_0').val();

		var sequencia_2 = $('#sequencia_2').val();
		var duracao_2 = $('#duracao_2').val();
		var intervalo_2 = $('#intervalo_2').val();
		var tentativas_2 = $('#tentativas_2').val();

		var sequencia_5 = $('#sequencia_5').val();
		var duracao_5 = $('#duracao_5').val();
		var intervalo_5 = $('#intervalo_5').val();
		var tentativas_5 = $('#tentativas_5').val();

		var sequencia_8 = $('#sequencia_8').val();
		var duracao_8 = $('#duracao_8').val();
		var intervalo_8 = $('#intervalo_8').val();
		var tentativas_8 = $('#tentativas_8').val();

		var URL = [];
		if(leg_0 == true)
		{
			URL.push('nome='+PARTICIPANTE+'&leg_0='+leg_0+'&sequencia_0='+sequencia_0+'&duracao_0='+duracao_0+'&intervalo_0='+intervalo_0+'&tentativas_0='+tentativas_0+'');
		}

		if(leg_2 == true)
		{
			URL.push('nome='+PARTICIPANTE+'&leg_2='+leg_2+'&sequencia_2='+sequencia_2+'&duracao_2='+duracao_2+'&intervalo_2='+intervalo_2+'&tentativas_2='+tentativas_2+'');
		}

		if(leg_5 == true)
		{
			URL.push('nome='+PARTICIPANTE+'&leg_5='+leg_5+'&sequencia_5='+sequencia_5+'&duracao_5='+duracao_5+'&intervalo_5='+intervalo_5+'&tentativas_5='+tentativas_5+'');
		}

		if(leg_8 == true)
		{
			URL.push('nome='+PARTICIPANTE+'&leg_8='+leg_8+'&sequencia_8='+sequencia_8+'&duracao_8='+duracao_8+'&intervalo_8='+intervalo_8+'&tentativas_8='+tentativas_8+'');
		}

		if(leg_5 == true && ac == true)
		{
			URL.push('nome='+PARTICIPANTE+'&leg_ac='+ac);
		}

		var seq = $('.sequencia_seq option:selected').text();
		URL.push('seq='+seq);

	    $('.link').html('<a href="'+window.location.pathname+montURL(URL)+'">Iniciar</a>');
    });

}
create();

function getBoolean(value){
   switch(value){
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default: 
            return false;
    }
}
function montURL(URL)
{
	var LINK = '';
	URL.forEach(function(currentValue, index){
		if(index == 0)
		{
			LINK += '?';
		}
		else
		{
			LINK += '&'
		}
		LINK += currentValue;
	});
	return LINK;
}