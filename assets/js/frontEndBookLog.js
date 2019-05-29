$(function () {
  bitacoras = {
    init: function () {
      bitacoras.events();
      bitacoras.checkStateType();
      // $(".valD").attr("maxlength",19);
      $(`.valD`).mask('00/00/0000 00:00:00',{placeholder: "--/--/-- --:--:--"})
    },

    events: function () {
      $('#tipo_bitacora').on('change', function () {
        if ($('#tipo_bitacora').hasClass("err")) $('#tipo_bitacora').removeClass("err");
        bitacoras.allTypesDisable();
        bitacoras.checkStateType();  
      });
      $("#saveBookLog").on('click', bitacoras.validateForm);
      // todos los input que contengan este espacio, 
      // $(".valD").on('keydown',bitacoras.validateFormat);
      $(`#inicio_actividad,#fin_actividad`).blur({idDStart:'inicio_actividad',idDEnd:'fin_actividad',final:'tiempo_atencion'},bitacoras.getAttentionTime);
      $(`#inicio_alarma,#creacion_tk`).blur({idDStart:'inicio_alarma',idDEnd:'creacion_tk', final:'tiempo_deteccion'},bitacoras.getAttentionTime);
      $(`#num_tk_incidente,#ot_tarea`).on('keypress',bitacoras.validateOnlyNumbers);
      $('#id_users').on('change',function(){ $(`#cedulaBitacora`).val($(this).val()) } );

    },

    validateOnlyNumbers: function(e){
      switch (String.fromCharCode(e.keyCode)) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
          return true;
        default:
          return false;
      }
      
    },

    allTypesDisable: function () {
      $("#validate_selection").children().remove();
      // elimina los ingenieros anteriores para posteriormente volverlos a llenar
      $(`#id_users`).children().not($(`#id_users`).children()[0]).remove();
      $(`#caso_de_uso`).children().not($(`#caso_de_uso`).children()[0]).remove();
      $(".generalFields input, .generalFields select, .generalFields textarea").attr("disabled",true);
      $("#intermitenciasx").remove();
    },

    checkStateType: function () {
      

      const tiempoDeteccion =
        `<div class="form-group col-sm-4" >
          <label for="tiempo_deteccion">Tiempo de detección</label>
          <input type="text" class="form-control" id="tiempo_deteccion" disabled>
        </div>`;

      $(".generalFields input, .generalFields select, .generalFields textarea").not('#tiempo_atencion,#cedulaBitacora').attr("disabled",false);

      // obtiene los ingenieros para cada tipo de bitácora
      if ($('#tipo_bitacora').val() !== "Seleccione...") 
      bitacoras.getEngineersAccordingType();

      $(`#tipo_incidente option:nth-child(3),#tipo_incidente option:nth-child(5)`).css('display','block');
      switch ($('#tipo_bitacora option:selected').text()) {
        case "Energía": //********************************ENERGÍA********************************
          $("#validate_selection").append(`

          ${tiempoDeteccion}


          <div class="form-group col-md-4 input-group-sm">
          <label for="tipo_falla">Tipo de Falla</label>
          <select id="tipo_falla" class="form-control">
            <option value="">Seleccione...</option>
            <option value="SITIO SIN PLANTA">SITIO SIN PLANTA</option>
            <option value="SITIO CON PLANTA">SITIO CON PLANTA</option>
            <option value="RPT">RPT</option>
            <option value="CCM">CCM</option>
            <option value="BLOQUEO">BLOQUEO</option>
          </select>
        </div>
        `);

        $(`#tipo_falla`).on('change',function(){
          const val = $(this).val();
          switch (val) {
            case 'CCM':
            case 'BLOQUEO':
            case 'RPT':
                alert("LOS ESCALAMIENTOS DEBEN LLAMAR A GERENTE DE ZONA, RESPONSABLE DE CASO, NOC INCIDENT, BO ENERGÍA, GRUPO DE COMUNICADOS Y SI TIENE UNA AUTONOMÍA BAJA, NOTIFICAR A DUTY O GERENTE CENTRO GESTIÓN SEGÚN DISPONIBILIDAD.")
              break;
            case 'SITIO SIN PLANTA':
              alert("AL INGENIERO EN TURNO ESCALAR AL ÁREA RESOLUTORIA AVISAR.");
              break;

            case 'BLOQUEO':
              alert("ESCALAR AL NOC INCIDENT, GERENTE DE ZONA, RESPONSABLE.");
              break;
          
            default:
              break;
          }
          console.log('val: ', val);
        }); 

        // opciones para cada caso de uso
        $(`#caso_de_uso`).append(`
        <option value="SITIO CCM">SITIO CCM</option>
        <option value="FALLA MASIVA">FALLA MASIVA</option>
        <option value="PLANTA ENCENDIDA">PLANTA ENCENDIDA</option>
        <option value="BLOQUEO MANUAL">BLOQUEO MANUAL</option>
        <option value="BLOQUEO AUTOMÁTICO">BLOQUEO AUTOMÁTICO</option>
        <option value="ALTA TEMPERATURA">ALTA TEMPERATURA</option>
        <option value="SDH">SDH</option>
        <option value="DEPURACIÓN">DEPURACIÓN</option>
        <option value="FUERA SERVICIO">FUERA SERVICIO</option>
        <option value="POWER BATERÍAS">POWER BATERÍAS</option>
        <option value="BAJO VOLTAJE">BAJO VOLTAJE</option>
        <option value="OTROS">OTROS</option>
        `);

          break;
        case "Intermitencias": //********************************INTERMITENCIAS********************************

          // agrega nuevas opciones que los tipos de actividade tipo intermitencias requieren
          $("#tipo_actividad").append(`
              <optgroup label="Intermitencias" id="intermitenciasx">
                <option value="INTERMITENCIA">INTERMITENCIA</option>
                <option value="BLOQUEO X USUARIO">BLOQUEO X USUARIO</option>
                <option value="REVISIÓN SATELITAL">REVISIÓN SATELITAL</option>
                <option value="REPORTE ELECTRIFICADORA">REPORTE ELECTRIFICADORA</option>
                <option value="REVISIÓN POWER BI">REVISIÓN POWER BI</option>
              </optgroup>
            `);

          // en intermitencias, sólo existen dos tipos de incidentes por lo cual los otros dos se deben ocultar
          $(`#tipo_incidente option:nth-child(3),#tipo_incidente option:nth-child(5)`).css('display','none');

          $("#validate_selection").append(`
            ${tiempoDeteccion}

            <div class="col-md-4">
            
              <div class="form-group">
                <label for="tk_padre">TK Padre</label>
                <select id="tk_padre" class="form-control">
                  <option value="">Seleccione...</option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>
            </div>
          
            <div class="col-md-4">
              <div class="form-group">
                <label for="saltos_validados">Saltos validados</label>
                <input type="text" class="form-control" id="saltos_validados" placeholder="ingrese número..">
              </div>
            </div>
        
          `);

          // opciones para cada caso de uso
          $(`#caso_de_uso`).append(`
            <option value="HARDWARE">HARDWARE</option>
            <option value="SOFTWARE">SOFTWARE</option>
            <option value="ENERGÍA">ENERGÍA</option>
            <option value="DESCONEXIÓN">DESCONEXIÓN</option>
            <option value="BLOQUEO">BLOQUEO</option>
            <option value="TX">TX</option>
            <option value="DESBORDE">DESBORDE</option>
            <option value="CÓDIGO SERVICIO">CÓDIGO SERVICIO</option>
            <option value="OTROS">OTROS</option>
          `);

          break;
        case "Plataforma": //********************************PLATAFORMA********************************
          $("#validate_selection").append(`

            <div class="form-group col-md-4">
              <label for="reporte_proveedores">Reporte con proveedores</label>
              <select id="reporte_proveedores" class="form-control">
                <option value="">Seleccione...</option>
                <option value="ALCATEL">ALCATEL</option>
                <option value="ANDIRED">ANDIRED</option>
                <option value="AZTECA">AZTECA</option>
                <option value="DATOS">DATOS</option>
                <option value="LAZUS">LAZUS</option>
                <option value="NO">NO</option>
                <option value="NOKIA">NOKIA</option>
                <option value="NOKIA ALCATEL">NOKIA ALCATEL</option>
                <option value="PLANTA EXTERNA">PLANTA EXTERNA</option>
                <option value="PROMITEL">PROMITEL</option>
                <option value="SDH">SDH</option>
                <option value="SI">SI</option>
                <option value="UFINET">UFINET</option>
                <option value="OTRO">OTRO</option>
              </select>
            </div>


            <div class="form-group col-md-4">
              <label for="servicios_corporativos">Servicios Corporativos</label>
              <select id="servicios_corporativos" class="form-control">
                <option value="">Seleccione...</option>
                <option value="0 a 9">0 a 9</option>
                <option value="MAYOR A 10">MAYOR A 10</option>
              </select>
            </div>
          

            <div class="form-group servCorpDesc col-sm-12">
                <label for="servicios_corporativos_descripcion">Servicios Corporativos Descripción</label>
                <input type="text" class="form-control" id="servicios_corporativos_descripcion">
            </div>
          `);
          $(`#caso_de_uso`).append(`
            <option value="CÓDIGO SERVICIO">CÓDIGO SERVICIO</option>
            <option value="ENERGÍA">ENERGÍA</option>
            <option value="HARDWARE">HARDWARE</option>
            <option value="PERDIDA ALCANZABILIDAD">PERDIDA ALCANZABILIDAD</option>
            <option value="SIN GESTIÓN ">SIN GESTIÓN </option>
            <option value="TRONCAL">TRONCAL</option>
            <option value="FALLA MASIVA">FALLA MASIVA</option>
            <option value="OTRO">OTRO</option>
          `);
          break;
        case "Servicios": //********************************SERVICIOS********************************

          $("#validate_selection").append(`
            <div id="if_servicios" class="col-md-4">
              <div class="form-group">
                <label for="valida_ruta_tx">Valida Ruta Tx</label>
                <input type="text" class="form-control" id="valida_ruta_tx" placeholder="ingrese valor...">
              </div>
            </div>
      
            
            <div id="if_intermitencias_servicios" class="col-md-4">
              <div class="form-group">
                <label for="saltos_validados">Saltos validados</label>
                <input type="text" class="form-control" id="saltos_validados" placeholder="ingrese número..">
              </div>
            </div>

        
            ${tiempoDeteccion}


            `);
            $(`#caso_de_uso`).append(`
              <option value="ENERGÍA">ENERGÍA</option>
              <option value="RUTA TX">RUTA TX</option>
              <option value="CÓDIGO SERVICIO">CÓDIGO SERVICIO</option>
              <option value="REINICIO">REINICIO</option>
              <option value="FEMTOCELDA">FEMTOCELDA</option>
              <option value="FALLA MASIVA">FALLA MASIVA</option>
              <option value="OTRO">OTRO</option>
            `);
          break;
        default:
          bitacoras.allTypesDisable();
      }
    },


    validateForm: function () {
      if ($('#tipo_bitacora option:selected').text() !== "Seleccione...") {
        $(".err").removeClass("err");
        const campos = $("div.frame input, div.frame select,div.frame textarea").not('#cedulaBitacora');
        var vacios = [];
        var data = {};
        var tipoBitacora = {};
        $.each(campos, function (i, element) {

          if ($(element).val() == null || $(element).val() == '' || $(element).val() == ' ' || $(element).val() == '  ') {
            vacios.push($(element).attr("id"));
          } else {
            
            
            if (typeof $(element).parents('.generalFields').val() === "string") {
              if ($(element).hasClass('valD')) {
                $.each($(`.valD`), function (i, el) { 
                  const f = $(el).val().split(' ');
                  const af= f[0].split('/');
                  data[$(element).attr("id")] =  `${af[2]}-${af[1]}-${af[0]} ${f[1]}`;
                });
              }else{
                data[$(element).attr("id")] = $(element).val();
              }

            } else if($(element).attr('id') != "tipo_bitacora"){
              tipoBitacora[$(element).attr("id")] = $(element).val();
            }
          }


        });


        if (vacios.length == 0) {
          
          $.post(base_url + "Bitacoras/savebookLogsFrontEnd",
            {
              general: data,
              tipo: tipoBitacora,
              tabla: $('#tipo_bitacora').val(),
            },
            function (data) {
              if (data == 'true') {
                helper.alert_refresh('¡Bien hecho', `Se guardó la bitácora de <b>${$('#tipo_bitacora').val()}</b>.`, 'success');
              } else {
                swal({
                  "title": "Ocurrió un error inesperado",
                  "text": data,
                  "type": "error",
                });
              }
            },
          );

        } else {
          $.each(vacios, function (i, id) {
            $(`#${id}`).addClass('err');
          });
          swal({
            "html": "¡No puede dejar los campo en rojo vacios!",
            "type": "error"
          });

          // console.log("vacios", vacios);

        }

      } else {
        swal({
          "title": "¡Error!",
          "html": "¡Debe seleccionar un tipo de bitácora!",
          "type": "error"
        });
        $('#tipo_bitacora').addClass("err");
      }

    },

    
    getEngineersAccordingType: function(){
      $.post(base_url+"Bitacoras/getEngineersByTypeLogBooks", {
        type: $('#tipo_bitacora option:selected').attr("data-id"),
      },
        function (data) {
          const obj = JSON.parse(data);
          $.each(obj, function (id, ing) { 
            $('#id_users').append(`<option value="${id}">${ing}</option>`);
          });
        },
      );

    },

    
    // validateFormat: function(e){
    //   // console.log(e.keyCode);
      
    //   if (($(this).val().length + 1 ) < 20) {
    //     if (e.shiftKey) {
    //       switch (e.keyCode) {
    //         case 190:
    //         case 55:
    //         case 37:
    //         case 39:
    //         case 9:
    //           return true;
          
    //         default:
    //           return false;
    //       }
    //     }else if (e.ctrlKey) {
    //       switch (String.fromCharCode(e.keyCode)) {
    //         case "V":
    //         case "C":
    //           return true;
          
    //         default:
    //           return false;
    //       }
  
    //     }else if((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 8 || e.keyCode == 189 || e.keyCode == 32 || e.keyCode == 9){
    //       return true;
    //     }else return false;
        
    //   }else {
    //     if (e.ctrlKey) {
    //       if(String.fromCharCode(e.keyCode)== "C" ||String.fromCharCode(e.keyCode)== "X" ) {
    //         return true
    //       }else return false;
  
    //     }
    //     switch (e.keyCode) {
    //       case 37:
    //       case 39:
    //       case 8:
    //       case 9:
    //         return true;
        
    //       default:
    //         $(this).val($(this).val().slice(0,19));
    //         return false;
    //     }
    //   }
      
      
      
    // },
    
    // realiza la formula para obtener el tiempo pasado en horas, minutos y segundos  
    getAttentionTime: function(e){

      const startD = $(`#${e.data.idDStart}`), endD = $(`#${e.data.idDEnd}`);
      

      if (endD.hasClass('err') || startD.hasClass('err')) 
          $(`#${e.data.idDStart},#${e.data.idDEnd}`).removeClass("err");  
      
      if (startD.val() != "" && endD.val() != "") {
        
        const ini = startD.val().split(' '), fin = endD.val().split(' ');

        const a = ini[0].split('/'), b = ini[1].split(':');

        const ax = fin[0].split('/'),  bx = fin[1].split(':');

        const inicio = new Date(a[2],a[1],a[0],b[0],b[1],b[2]);

        const final = new Date(ax[2],ax[1],ax[0],bx[0],bx[1],bx[2]);

        if (inicio < final) {
          const total = final-inicio; //esta en milisegundos

          let segundos = total, resultado = '';

          while (segundos >= 60000) {
            segundos-= 60000;
          }

          if (total < 59999) {  //si son en segundos la diferencia
            resultado = `${(total/1000)} SEGUNDO${(total==1000) ? '': 'S'}`;
          }else if(total < 3599999 ){ //si son en minutos la diferencia
            let minutos = (total-segundos)/1000;
            resultado =`${minutos/60} MINUTO${(minutos == 60) ? '': 'S'} ${(segundos == 0) ? '': `, ${segundos/1000} SEGUNDO${(segundos==1000) ? '': 'S'}`}`;
          // }else if(total <= 86399999){ //si se requiere para la validacion de días
          }else{ // si son en horas la diferencia
            let horas = parseInt(total/3600000);
            let minutos = (total-segundos-(horas*3600000))/1000;
            resultado = `${horas} HORA${(horas == 1 ? '' : 'S')} ${(minutos/60 == 0) ? '' : `, ${minutos/60} MINUTO${(minutos == 60) ? '': 'S'} `} ${(segundos == 0) ? '': `, ${segundos/1000} SEGUNDO${(segundos==1000) ? '': 'S'}`}`;
            // console.log(horas,"horas");
            

            // console.log("es en horas");

          }

          $(`#${e.data.final}`).val(resultado); //pondrá la diferencia en horas, minutos y segundos
          // else{

          //   console.log("es en días");
            
          // }
        }else{

          $(`#${e.data.idDStart},#${e.data.idDEnd}`).addClass("err");
          if ($(`#${e.data.idDStart}`).val() === $(`#${e.data.idDEnd}`).val()) {
            helper.miniAlertN(`La fecha ${$(`#${e.data.idDStart}`).siblings().text()} y la de ${$(`#${e.data.idDEnd}`).siblings().text()} son iguales`,'error',3000);
          }else{
            helper.miniAlertN(`La fecha ${$(`#${e.data.idDStart}`).siblings().text()} es mayor a  de ${$(`#${e.data.idDEnd}`).siblings().text()}`,'error',3000);
          }
        }

          // var inicio = new Date(startD.val().slice(11));
        // startD.val().replace(/\//g,"-")
        // console.log("inicio_actividad: ", startD.val().slice(11));
        // console.log("fin_actividad: ",$('#fin_actividad').val().slice(11));
        
          
      }

    },
  },
    bitacoras.init();
});




