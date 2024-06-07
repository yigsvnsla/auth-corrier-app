/************************************************************************/
/*                              MODIFICACIONES                          */
/************************************************************************/
/*REF      FECHA           AUTOR     TAREA                              */
/*1  11/Jul/2008   German Medina C.   Emision inicial                   */
/*2  24/Sep/2008   German Medina C.   Validar recuadaciones fin de      */
/*                                    semana                            */
/*                                                                      */
/*3  29/Oct/2008   German Medina C.   Validacion de Horarios para el    */
/*                                    canal Ventanilla (VEN)          	*/
/*      								                                                */
/*4  05/Nov/2009   Tania Cumbicus     Cambios para empresa CNTTTSV      */
/*5  13/12/2012    Sandra Merino      CTE-CC-SGC00006244                */
/*6  20/01/2014    Daniel Pereira     SGC00012170 Facturacion 	        */
/*				                            Electronica			.                 */
/*									                                                    */
/*7  30/05/2016    Mar?a Jos? Silva   SGC00023537 Notificacion al 	    */
/*				                            cliente CNB 			                */
/*									*/
/*8  01/08/2016    Luis Banda Pozo    RECA-CC-SGC00025868 se agrega    	*/
/*	 			      validacion para obtener descuento	*/
/*                                    de la comision para damnificados 	*/
/*									*/
/*9  05/02/2017   Mar?a Jose Silva G. RECA-CC-SGC00028146 Cobro de      */
/*				      Comision CTE  			*/
/*									*/
/*10 13/Mar/2018  Maria Jose Silva    Factura cion OffLine Debitos	*/
/*									*/
/*11 13/Dic/2018  Monica Eras         SGC00033899 - Ingresar el campo 	*/
/*				      alterno de autorizacion Cyberbank */
/*12 25/Feb/2019  Maria Jose Silva SAT-CU-SGC00033011 - Cambios por SAT */
/*13 22/Sep/2020  Josue Rocafuerte RECMPS-260 - Notificaciones Latinia  */
/*14 07/Oct/2021  Jonathan Guerrero RECM -357  Agregar Canal WAP        */
/*15 08/Ago/2022  Luis Cepeda RECMPS-1805 MIGRACION CSP A BUS FLUJO CTE - CITACIONES*/
/*16 11/Nov/2022  Luis Cepeda RECM-497-CONCILIACION CANAL WAP CTE  */
/*17 24/01/2023   Angel Maquilon CNB-1041 - Horario diferido para CNB    */
/*18 06/02/2024   Jonathan Guerrero J.  RECMPS-3069 MIGRACION CTE        */
/*19 16/04/2024   Jonathan Guerrero J.  RECMPS-3127 COMISI?N VENTANILLA  */
/*20 17/04/2024   Leonardo Lozano J  ajuste de campo tm_ctadestino y tm_canal*/
/************************************************************************/

create procedure dbo.sp_procesa_ctg (
  @s_ssn        int,
  @s_user       varchar(30),
  @s_sesn       int = null,
  @s_term       varchar(10),
  @s_date       datetime,
  @s_srv        varchar(30),
  @s_lsrv       varchar(30),
  @s_ofi        smallint,
  @s_rol        smallint,
  @s_org_err    char(1) = null,
  @s_error      int =  null,
  @s_sev        tinyint = null,
  @s_msg        mensaje = null,
  @s_org        char(1),
  @t_debug      char(1) = 'N',
  @t_file       varchar(14) = null,
  @t_from       varchar(32) = null,
  @t_rty        char(1) = 'N',
  @t_corr       char(1) = 'N',
  @t_ssn_corr   int = null,
  @t_trn        INT,
  @i_mon        SMALLINT    = null,
  @i_tipoid     VARCHAR (3)   = null,
  @i_identificacion VARCHAR (15)  = null,
  @i_sucursal     VARCHAR (30)  = null,
  @i_rubro      VARCHAR (3)   = null,
  @i_comprobante    VARCHAR (25)  = null,
  @i_efectivo     MONEY     = 0,
  @i_cheque     MONEY     = 0,
  @i_debito     MONEY     = 0,
  @i_subtotal     MONEY     = 0,
  @i_comision_tot  MONEY     = 0,
  @i_comision_efe   MONEY     = 0,
  @i_comision_chq   MONEY     = 0,
  @i_total      MONEY     = 0,
  @i_cant_cheques   VARCHAR (3)   = null,
  @i_tipo_cta     VARCHAR (3)   = "",
  @i_cuenta     cuenta  = "",
  @i_nomb re_cta   VARCHAR (64)  = "",
  @i_servname     VARCHAR (30)  = null,
  @i_autoriza     VARCHAR (1)   = 'N',
  @o_fecha_contable varchar(20)   = null out,
  @o_fecha_efectiva varchar(20)   = null out,
  @o_fecha_efe    varchar(10)   = null out,
  @o_ssn        INT       = null out,
  @o_autorisri    VARCHAR (30)  = null out,
  @o_fecvensri    VARCHAR (30)  = null out,
  @o_nota_venta   VARCHAR (15)  = null out,
  @i_ubi        INT       = null,
  @i_nom_benefi   VARCHAR (100) = null,
  @i_aplcobis     char(1)     = 'S',
  @i_canal      varchar(14)   = 'VEN',
  @i_ind_costo    char(1)     = 'N',
  @i_costo      money     = 0,
  @i_comision_deb   money     = 0,
  @i_tsn        int       = null,
  @o_comision     money      = null out,
  @o_horario      char(1)     = null out,
  @i_operacion    char(1)     =   null,
  @i_secuencial   int       = null,
  @o_nombre_tramite varchar(120)  = null out,
  @o_secuencial_ctg varchar(30)   = null out,
  @i_empresa    small int = 2572,
  @o_tasa              money = 0 out,  --smerino
  @o_base_imp          float = 0 out,  --smerino
  @o_impuesto          float = 0 out,  --smerino
  @o_servicio_not  varchar(5) = null out,
  @o_nomb_ente     varchar(64) = null out ,
  @o_cod_ente      varchar(20) = null out,
  @o_desccanal     varchar(16) = null out,
  @o_celular       varchar(10) = null out,
  @o_correo        varchar(64) = null out,
  @o_desc_empresa  varchar(32)  = null out,
  @o_prod_deb      char(3) = null out,
  @o_valor  varchar(11) = null out,
  @o_fecha_deb varchar(10) = null out,
  @o_hora_deb  varchar(8) = null out,
  @o_valor_comi varchar(11) = null out,
  @o_valor_tot varchar(11) = null out,
  @o_cta_lat char(3)  = null out,
  @o_tipo_serv varchar(16)  = null out
)
as

declare
  @w_return int,
  @w_sp_name varchar(30),
  @w_fecha_proceso datetime,
  @w_empresa smallint,
  @w_val_usd money,
  @w_valch_usd money,
  @w_debito_usd money,
  @w_debito_usd_bak money,
  @w_reten_usd money,
  @w_factor smallint,
  @w_tipocta char(1),
  @w_hora_tope int,
  @w_hora_sys char(8),
  @w_hora int,
  @w_secuencial int,
  @w_control_nc char(1),
  @w_codigo char(15),
  @w_ndcta money,
  @w_debito_BR money,
  @w_offline char(1),
  @w_ind_diferido char(1),
  @w_emp varchar(6),
  @w_maximo_p money,
  @w_nom_tramite1 varchar(60),
  @w_nom_tramite2 varchar(60),
  @w_ts_campo_alt_dos varchar(30),
  @w_ts_descripcion varchar(120),
  @w_comprobante varchar(25),
  @w_causa varchar(5),
  @w_trx_orig int,
  @w_fecha_hoy varchar(10),
  @w_comision_serv money,
  @w_total_comision money,
  @w_servicio char(4),
  @w_trn int,
  @w_serie varchar(6),
  @w_com money,
  @w_horario char(1),
  @w_horario_emp char(1),
  @w_fecha_efe datetime,
  @w_autorisri varchar(30),
  @w_fecvensri varchar(30),
  @w_nota_venta varchar(15),
  @w_ssn int,
  @w_cant_cheques int,
  @w_causal char(3),
  @w_hora_dif varchar(9), --gamc 29OCT08
  @w_hora_trn varchar(5), --gamc 29OCT08
  @w_tasa float,
  @w_base_imp money,
  @w_impuesto2 money,
  @w_ced_ruc varchar(13),
  @w_nombre varchar(20),
  @w_cliente int,
  @w_fecha_desde_excep datetime, --REF 6
  @w_fecha_hasta_excep datetime, --REF 6
  @w_hora_dif_excep varchar(8), --REF 6
  @w_telefono varchar(10),
  @w_desc_canal varchar(16),
  @w_desc_empresa varchar(32),
  @w_valor_debito varchar(11),
  @w_categoria char(1),
  @w_correo varchar(64),
  @w_producto tinyint,
  @w_nombre_cta varchar(64),
  @w_valor_compensa money,
  @w_comi_total money,
  @w_com_original money,
  @w_aplica_des char(1),
  @w_ofi int,
  @w_emp_com int,
  @w_empresa_val varchar(6), --Ref009:msilvag
  @w_rowcount int, --Ref010:msilvag
  @w_servicio_alert char(5)


/* Captura nombre del Store Procedure */
select @w_sp_name = 'sp_pago_ctg'
select @s_date = convert(varchar(10),@s_date,101)
select @w_fecha_hoy = convert(varchar(10), getdate(),101)   --- ame 04/28/2004
select @w_ssn = @s_ssn
select @w_empresa = @i_empresa
select @w_cant_cheques = convert(int, @i_cant_cheques)
select @w_fecha_proceso = fp_fecha
from cobis..ba_fecha_proceso
--<REF 20
select @w_codigo = convert(varchar,@i_comprobante)
--REF 20>

-- Transaccion de Cobro
--if @i_opcion = 'T' - ini
if @i_operacion = 'T'
begin
  if @i_canal = 'CNB' select @w_ofi = @s_ofi, @s_ofi = 0
  else if @i_canal = 'VEN' select @w_ofi = @s_ofi

  --Seleccion de Horarios - ini
  select @w_hora_tope = convert(int, (substring (b.valor,1,2) + substring (b.valor,4,2) + substring (b.valor,7,2)) )
  from cobis..cl_tabla a, cobis..cl_catalogo b
  where a.tabla = 'sv_horario_serv'
  and   a.codigo = b.tabla
  and   b.codigo = convert(char(10),@i_empresa)
  and   estado = 'V'

  if @@rowcount = 0 or @w_hora_tope = 0
  begin
    if @i_aplcobis = 'S'
    begin
      exec cobis..sp_cerror
        @t_debug         = @t_debug,
        @t_file          = @t_file,
        @t_from          = @w_sp_name,
        @i_msg           = 'PARAMETRO DE HORA TOPE NO DEFINIDA',
        @i_num           = 111111
      return 1
    end
    else return 37601
  end

  select @w_hora_sys = convert(varchar(08),getdate(),108)

  select @w_hora = convert(int, (substring (@w_hora_sys,1,2) + substring (@w_hora_sys,4,2) + substring (@w_hora_sys,7,2)))

  if @w_hora >= @w_hora_tope
  begin
    set @w_horario_emp = 'D'
    select @w_fecha_efe = min(dl_fecha)
      from cob_cuentas..cc_dias_laborables
      where dl_ciudad = 1
      and dl_num_dias = 1
  end
  else
    set @w_horario_emp = 'N'
  --gamc - 24SEP08 - Validacion de horarios para las transacciones que se ingresan el fin de semana
  if @t_trn = 62154
    select @t_trn = 3925
  --gamc - 29OCT08 - Validacion de horario diferido para para las Ventanillas
  if @i_canal= 'VEN'
  begin --if @i_canal = 'VEN' - ini
    select
      @w_hora_dif = rh_inicio,
      @w_hora_trn = convert(varchar,getdate(),108),
      @w_fecha_desde_excep =rh_fecha_desde,   --REF 6
      @w_fecha_hasta_excep = rh_fecha_hasta,  --REF 6
      @w_hora_dif_excep = rh_nuevo_inicio  --REF 6
      from cob_remesas..re_horario
        where rh_oficina = @s_ofi
        and rh_ubicacion = @i_ubi
    ---Si la fecha de proceso esta dentro delperiodo de excepcion reemplazo la hora del diferido por la hora de excepcion
    if  @s_date >= @w_fecha_desde_excep and @s_date <= @w_fecha_hasta_excep  --REF 6
      select @w_hora_dif = @w_hora_dif_excep
    if @w_hora_trn >= @w_hora_dif
      select @t_trn = 3926
  end
  --if @i_canal = 'VEN' - fin

  --Obtener fecha de salida
  select @w_fecha_efe = @s_date

  --Autorizacion por monto
  --if @i_autoriza in ('n','N') AND @t_corr = 'N' and @i_canal = 'VEN' - ini
  if @i_autoriza in ('n','N') AND @t_corr = 'N' and @i_canal = 'VEN'
  begin
    if @i_debito > 0
    begin
    exec @w_return = cob_remesas..sp_verifica_cupos_rc
      @s_user     = @s_user,
      @s_ofi      = @s_ofi,
      @s_rol      = @s_rol,
      @t_debug    = @t_debug,
      @t_trn      = 4850, --Trx para los debitos de recaudaciones
      @i_mon      = @i_mon,
      @i_ubi      = @i_ubi,
      @i_sec      = 1,
      @i_cau      = null,
      @i_tsn      = @i_tsn,
      @i_tipo_cta = @i_tipo_cta,
      @i_cuenta   = @i_cuenta,
      @i_chq_lib  = 0,
      @i_valor    = @i_debito,
      @i_operacion = 'S',
      @i_nemonico = 'MMXDB'    --MMXDB MAXIMO DEBITO EN CTAS

      if @w_return != 0
        return @w_return
    end

    if @i_efectivo > 0
    begin
      select @w_maximo_p = pa_money
      from cobis..cl_parametro
      where pa_nemonico = 'MSVP'

      and  pa_producto = 'CTE'

      if (@w_maximo_p <= @i_efectivo )
      begin
        if @i_aplcobis = 'S'
        begin
          exec cobis..sp_cerror
          @t_debug        = @t_debug,
          @t_file         = @t_file,
          @t_from     = @w_sp_name,
          @i_num          = 311819
          return 311819
        end
        else
          return 37608
      end
    end
  end
  --if @i_autoriza in ('n','N') AND @t_corr = 'N' and @i_canal = 'VEN' - fin--
  if @i_autoriza in ('S','s') and @t_corr = 'N'
  begin --if @i_autoriza in ('S','s') and @t_corr = 'N' - ini

    exec @w_return = cob_remesas..sp_verifica_cupos_rc
      @s_user      = @s_user,
      @s_ofi       = @s_ofi,
      @s_rol       = @s_rol,
      @t_debug     = @t_debug,
      @t_trn       = 4850, --Trx para los debitos de recaudaciones
      @i_mon       = @i_mon,
      @i_ubi       = @i_ubi,
      @i_sec       = 1,
      @i_cau       = null,
      @i_tsn       = @i_tsn,
      @i_cuenta    = @i_cuenta,
      @i_tipo_cta  = @i_tipo_cta,
      @i_chq_lib   = 0,
      @i_valor     = @i_debito,
      @i_nemonico  = 'MMXDB',
      @i_operacion = "U"

      if @w_return != 0
        return @w_return
  end   --if @i_autoriza in ('S','s') and @t_corr = 'N' - fin

if @t_corr = 'S'
    begin --if @t_corr = 'S' -- ini
      select @w_factor = -1
        select
          @w_trx_orig     = ts_tipo_transaccion,    -- identifica trx original,
      @w_nom_tramite1   = ts_autorizante,
      @w_nom_tramite2   = ts_autoriz_ 
anula,
      @w_ts_campo_alt_dos = ts_campo_alt_dos,
      @w_ts_descripcion   = ts_descripcion_ec,
      @i_nombre_cta   = ts_nombre
        from
            cob_cuentas..cc_tran_servicio
        where
          ts_tsfecha = convert(smalldatetime,@s_date 
)
        and ts_secuencial = @t_ssn_corr
        and ts_tipo_transaccion not in (3366,3372,3497) --Ref007:msilvag 

        if @@rowcount <> 0
            select @t_trn = @w_trx_orig

    end   --if @t_corr = 'S' - fin
    else
        select @w_factor = 
  1


    -- Valida si se ha aperturado caja
    if @s_org = 'U' and @i_aplcobis = 'S' and @i_canal = 'VEN'
    begin
         exec @w_return = cob_remesas..sp_verifica_caja_rc
                   @s_ssn   = @s_ssn,
                   @s_srv   = @s_srv,
   
                 @s_lsrv  = @s_lsrv,
                   @s_user  = @s_user,
                   @s_term  = @s_term,
                   @s_date  = @s_date,
                   @s_ofi   = @s_ofi,
                   @s_rol   = @s_rol,
                   @s_sev 
   = @s_sev,
                   @s_msg   = @s_msg,
                   @s_org   = @s_org,
                   @t_trn   = @t_trn,
                   @t_corr  = @t_corr,
                   @i_mon   = @i_mon,
                   @i_ubi   = @i_ubi,
              
      @o_horario = @w_horario out
         if @w_return != 0

            return @w_return
    end

    --> ESTABLEZCO HORARIO DE PAGO >
    select @w_hora_sys = convert(varchar(08),getdate(),108)
    select @w_hora = convert(int, (substring (@w_hora_sys, 
1,2) + substring (@w_hora_sys,4,2) + substring (@w_hora_sys,7,2)))


  if @w_horario = 'N'
    select @t_trn = 3925
  if @w_horario = 'D'
    select @t_trn = 3926

    select @w_offline = atm_offline from cobis..ba_fecha_proceso

 if @w_hora >= @w_hora_to 
pe and @t_corr = 'N' and @s_date = @w_fecha_hoy
   
   begin

    select @w_ind_diferido = 'S'
        select @t_trn = 3927

        select @w_fecha_efe = min(dl_fecha)
          from cob_cuentas..cc_dias_laborables
         where dl_ciudad = 1
           
 and dl_num_dias = 1
    end
    else
    begin
        if @i_canal = "VEN" and @t_corr = 'N'
        begin

            if @w_horario = "D"
            begin
                if @i_cheque > 0
                begin

                    select @w_ind_diferi 
do = 'S'
                    select @t_trn = 3926
                end
                else
                    select @t_trn = 3925
            end
        end
        else
    begin
 
      if @w_hora >= @w_hora_tope and @t_corr = 'S' and @s_date = @w_fe 
cha_hoy
        begin

          select @w_ind_diferido = 'S'
          select @t_trn = 3927

        select @w_fecha_efe = min(dl_fecha)
        from cob_cuentas..cc_dias_laborables
        where dl_ciudad = 1
        and dl_num_dias = 1
        end
     
    end

    end
    --< HORARIO DE PAGO <

    -- validar que la NC no se haya realizado
    select @w_control_nc = b.valor
      from cobis..cl_tabla a, cobis..cl_catalogo b
     where a.tabla = 'sv_nc_servicios'
       and a.codigo = b.tabla
       and 
 convert(smallint,b.codigo) = @w_empresa
       and estado = 'V'
    if @w_control_nc = 'S' and @w_ind_diferido = 'N'
    begin
        if @i_aplcobis = 'S'
        begin
            exec cobis..sp_cerror
                 @t_debug         = @t_debug,
     
             @t_file          = @t_file,
                 @t_from          = @w_sp_name,
                 @i_msg           = 'CREDITO A EMPRESA YA REALIZADO NO SE PUEDEN REALIZAR TRX',
                 @i_num           = 111111
            return 1
       
  end
        else
            return 37603
    end

  -- Rutina que realiza verificacion de moneda de la cuenta
  exec @w_return = cob_cuentas..sp_convierte_valor
    @i_valor  = @i_efectivo,
    @i_val2   = @i_cheque,
    @i_moneda = @i_mon,
    @o_val_ 
usd_neto = @w_val_usd out,
    @o_val_usd_val2 = @w_valch_usd out

  if @w_return != 0
  begin
    if @i_aplcobis = 'S'
    begin
      exec cobis..sp_cerror
        @t_debug         = @t_debug,
        @t_file          = @t_file,
        @t_from          
 = @w_sp_name,
        @i_msg           = 'ERROR EN LA RUTINA DE CONVERSION',
        @i_num           = 111111
      return 1
    end
    else
    return 37607
  end

    --GAMC ojo con el campo de reten
  exec @w_return = cob_cuentas..sp_convierte_valor 

    @i_valor  = @i_debito,
    @i_moneda = @i_mon,
    @o_val_usd_neto = @w_debito_usd out

  if @w_return != 0
  begin
    if @i_aplcobis = 'S'
    begin
      exec cobis..sp_cerror
        @t_debug         = @t_debug,
        @t_file          = @t_file 
,
        @t_from          = @w_sp_name,
        @i_msg           = 'ERROR EN LA RUTINA DE CONVERSION',
        @i_num           = 111111
      return 1
    end
  else
    return 37607
  end


  exec @w_return = cobis..sp_cseqnos
    @t_debug  = @t_debug, 

    @t_file   = @t_file,
    @t_from   = @w_sp_name,
    @i_tabla  = 'ts_servicios',
    @o_siguiente = @w_secuencial out
  if @w_return != 0
    return @w_return

  --GAMC - Revisar estas comisiones
  ----------------------------------------------
  --  
Comision por pago servicio
  ----------------------------------------------
  select @w_comision_serv = 0--, @w_comision_sat = 0

  if @i_canal <> 'VEN' and @i_canal <> 'CNB' and @i_canal <> 'IBK' --Ref009:msilvag --Ref007:msilvag 
  begin
    exec @w_ret 
urn = cob_pagos..sp_verif_genera_costo
        @s_date         = @s_date,
        @i_mon          = @i_mon,
        @i_rubro        = 'PCTG',
        @i_servicio     = 'CSPB',
        @i_canal        = @i_canal,
        @i_tipocta    = @i_tipo_cta,
       
  @i_cuenta   = @i_cuenta,
        @o_costo        = @w_comision_serv out

    if @w_return <> 0
      return @w_return

    set @i_comision_deb = @w_comision_serv

  end

    --Ref009:msilvag Inicio
    if @i_canal = 'IBK'
    begin
        select @i_com 
ision_deb = @i_comision_tot , @w_comision_serv = @i_comision_tot
    end 
    --Ref009:msilvag Fin

   select @w_total_comision = @w_comision_serv-- + @w_comision_sat


  if @i_tipo_cta = 'AHO' and @i_debito > 0
    select @w_tipocta = 'A'

  if @i_tipo_c 
ta = 'CTE' and @i_debito > 0
    select @w_tipocta = 'C'

  select @w_ndcta = @w_debito_usd + @i_costo

  if @i_canal <> 'VEN' 
    select @w_ndcta = @w_ndcta + @w_total_comision

    --Ref007:msilvag Inicio
    if @i_canal = 'CNB' 
        select @w_ndct 
a = @w_ndcta + @i_comision_deb
    --Ref007:msilvag Fin

  --Debito automatico para cuentas corrientes
  if @i_tipo_cta = 'CTE' and @w_debito_usd > 0 and @i_ind_costo <> 'R'
  begin --if @i_tipo_cta = 'CTE' and @w_debito_usd > 0 and @i_ind_costo <> 'R' -  
ini

    select
      @w_causa = isnull(b.valor,' ')
    from
      cobis..cl_tabla a, cobis..cl_catalogo b
    where
      a.tabla = 'causa_nd_cte_servicios'
    and a.codigo = b.tabla
    and convert(smallint,b.codigo) = @w_empresa
    and estado = 'V'
 

    if @@rowcount = 0 or (@w_causa = null or @w_causa = ' ')
    begin
      if @i_aplcobis = 'S'
      begin
        exec cobis..sp_cerror
          @t_debug         = @t_debug,
          @t_file          = @t_file,
          @t_from          = @w_sp_na 
me,
          @i_msg           = 'CAUSA DE ND NO DEFINIDA PARA SERVICIO',
          @i_num           = 158693
          return 1
      end
      else
        return 37601
    end
       exec @w_return = cob_cuentas..sp_ccndc_automatica
          @s_srv    
       = @s_srv,
          @s_ofi          = @s_ofi,
          @s_ssn          = @s_ssn,
          @s_user         = @s_user,
          @s_term         = @s_term,
          @t_corr         = @t_corr,
          @t_trn          = 3050,
          @i_cta      
     = @i_cuenta,
          --@i_val          = @w_ndcta,
          @i_val          = @i_debito,
          @i_cau          = @w_causa,
          @i_mon          = 1,
          @i_ref          = @w_codigo,
          @i_fecha        = @s_date,
          @i_ 
nchq         = @t_ssn_corr,
          @i_aplcobis     = @i_aplcobis,
          @i_ubi          = @i_ubi,
          @s_rol          = @s_rol,
          @i_tsn          = @i_tsn,
          @i_con_tran     = 'N',
        --<REF 20
        @i_canal       = @i 
_canal, --REF 20>
          @i_detalle      = @w_comprobante
        if @w_return <> 0
        begin
          --rollback tran
          print 'ERROR AL DB CTE'
          return @w_return
    end
  end   --if @i_tipo_cta = 'CTE' and @w_debito_usd > 0 and  
@i_ind_costo <> 'R' - fin

  if @i_tipo_cta = 'AHO' and @w_debito_usd > 0 and @i_ind_costo <> 'R'
  begin --if @i_tipo_cta = 'AHO' and @w_debito_usd > 0 and @i_ind_costo <> 'R' - ini
    select
      @w_causa = isnull(b.valor,' ')
    from
      cobis..cl 
_tabla a, cobis..cl_catalogo b
    where
      a.tabla = 'causa_nd_aho_servicios'
    and a.codigo = b.tabla
    and convert(smallint,b.codigo) = @w_empresa
    and estado = 'V'

    if @@rowcount = 0 or (@w_causa = null or @w_causa = ' ')
    begin
      
 if @i_aplcobis = 'S'
      begin
        exec cobis..sp_cerror
          @t_debug         = @t_debug,
          @t_file          = @t_file,
          @t_from          = @w_sp_name,
          @i_msg           = 'CAUSA DE ND NO DEFINIDA PARA SERVICIO',
    
       @i_num           = 158693
        return 1
      end
    else
      return 37601
    end
    exec @w_return = cob_ahorros..sp_ahndc_automatica
    @s_srv          = @s_srv,
    @s_ofi          = @s_ofi,
    @s_ssn          = @s_ssn,
    @s_user     
     = @s_user,
    @s_term         = @s_term,
    @t_trn          = 4264,
    @t_corr         = @t_corr,
    @i_cta          = @i_cuenta,
    @i_val          = @i_debito,
    @i_cau          = @w_causa,
    @i_mon          = 1,
    @i_ref          = @w_c 
odigo,
    @i_fecha        = @s_date,
    @i_referen      = @t_ssn_corr,
    @i_aplcobis     = @i_aplcobis,
    @i_ubi          = @i_ubi,
    @s_rol          = @s_rol,
    @i_tsn          = @i_tsn,
    @i_con_tran     = 'N',
    --<REF 20
    @i_canal     
   = @i_canal, --REF 20>
    @i_tarjeta      = @w_comprobante
   

    if @w_return <> 0
    begin
      --rollback tran
      print 'ERROR AL DB AHO'
      return @w_return
    end

  end   --if @i_tipo_cta = 'AHO' and @w_debito_usd > 0 and @i_ind_costo  
<> 'R' - fin

  select @w_debito_usd_bak = @w_debito_usd

  if @w_debito_usd > 0
    if @i_ind_costo = 'R'
    begin
      select @w_debito_BR  = @w_debito_usd + @i_costo
      select @w_debito_usd = 0
    end
    else
      select @w_debito_usd = @w_ndct 
a

  select @w_codigo = convert(varchar,@i_comprobante) 
  select @w_emp = convert(varchar(6),@w_empresa)

  if @i_canal = 'VEN'
    select @w_com = @i_comision_efe + @i_comision_chq + @i_comision_deb --Ref010:msilvag
  else
    select @w_com = @w_comisio 
n_serv

    --Ref007:msilvag Inicio
    if @i_canal = 'CNB'
    begin
        if @i_comision_efe <> 0
            select @w_com = @i_comision_efe
        
        if @i_comision_deb <> 0
            select @w_com = @i_comision_deb

    end
    
    if @i_ 
tipo_cta = 'AHO' 
        select @w_producto = 4
    else
        select @w_producto = 3

 select @w_ts_campo_alt_dos = @i_servname --REF11
  

    if  @i_debito <> 0
    begin
        
        if @i_canal = 'ATM'
  select @w_desc_canal = 'VEINTI4EFECTIVO 
'
 if @i_canal = 'DBA'
  select @w_desc_canal = 'AUTOMATICO'
 if @i_canal = 'IBK'
  select @w_desc_canal = '24Online'  
 if @i_canal = 'IVR'
  select @w_desc_canal = 'VEINTI4FONO'
 if @i_canal = 'KSK'
  select @w_desc_canal = 'PUNTOVEINTI4'
 if @i_canal = 
 'VEN'
  select @w_desc_canal = 'VENTANILLA'
 if @i_canal = 'WAP'
  select @w_desc_canal = 'WAP'
 if @i_canal = 'CNB'
  select @w_desc_canal = 'CNB'
 if @i_canal = 'SAT'               /*<REF 18>*/
  select @w_desc_canal = 'SAT'  /*<REF 18>*/

        
    
     if @w_producto = 4 
        begin
            select @w_cliente = ah_cliente,
                @w_categoria = ah_categoria,
                @w_nombre_cta = substring(ah_nombre,1,32)
            from cob_ahorros..ah_cuenta
            where ah_cta_banc 
o = @i_cuenta
        end
        else
        begin
            select @w_cliente = cc_cliente,
                @w_categoria = cc_categoria,
                @w_nombre_cta = substring(cc_nombre,1,32)
            from cob_cuentas..cc_ctacte
            whe 
re cc_cta_banco = @i_cuenta
        end
        
        select @w_valor_debito = convert(varchar(11),@i_debito)
        
        select @w_desc_empresa ='CTE'
                
        exec  @w_return = cob_pagos..sp_consulta_celular
            @i_client 
e = @w_cliente,
            @o_celular = @w_telefono  out,
            @o_correo=@w_correo  out
        if @w_return <> 0
        begin
            if @@trancount > 0
                rollback tran

            return @w_return
        end
   
   
 if @t_c 
orr = 'N'
  select @w_servicio_alert = 'PAGSB', @w_ssn = @s_ssn
 else
  select @w_servicio_alert = 'PAGSR', @w_ssn = @s_ssn
 

    select @o_servicio_not = @w_servicio_alert,
        @o_nomb_ente = @w_nombre_cta,
        @o_cod_ente =  convert(varchar(20) 
,@w_cliente),
        @o_desccanal = @w_desc_canal,                 
        @o_celular = @w_telefono,
        @o_correo  = @w_correo,
        @o_desc_empresa = @w_desc_empresa,
        @o_prod_deb = @i_tipo_cta,
        @o_valor = @w_valor_debito,
       
  @o_fecha_deb = @w_fecha_hoy,
        @o_hora_deb = @w_hora_sys,
        @o_valor_comi = convert(varchar, @i_comision_deb),
        @o_valor_tot =  convert(varchar,(convert(money,isnull(@w_valor_debito,'0'))+ @i_comision_deb))  ,
        @o_cta_lat = sub 
string(@i_cuenta,8,3)
 
   if @i_rubro = 'CIT' /*<REF 18>*/
    begin
     select @o_tipo_serv = 'CITACIONES'
    end 
   else if @i_rubro = 'CDP'
    begin
     select @o_tipo_serv = 'CONVENIO DE PAGO'
    end 
   else 
    begin
     select @o_tipo_serv 
 = 'TRAMITE'
    end 
 
    end    


  -- Transaccion servicio
  /*<REF 18>*/
   select @i_nombre_cta = str_replace(str_replace(str_replace(str_replace(@i_nombre_cta,'|',rtrim('')),CHAR(13),rtrim('')),CHAR(10),rtrim('')),CHAR(9),rtrim('')) 
    select @w 
_nom_tramite1 = isnull(@i_nom_benefi,'')
    
  insert into cob_cuentas..cc_tran_servicio
    (ts_secuencial, ts_tipo_transaccion, ts_oficina, ts_usuario, ts_rol,
    ts_terminal, ts_correccion, ts_tipo_chequera, ts_reentry, ts_origen,
    ts_nodo, ts_tsf 
echa, ts_clase, ts_referencia, ts_saldo,
    ts_ssn_corr, ts_cta_banco, ts_moneda, ts_tipo, ts_valor,
    ts_monto, ts_ocasional, ts_contratado, ts_aporte_iess, ts_descuento_iess,
    ts_tsn, ts_ccontable, ts_hora, ts_endoso, ts_causa,
    ts_tipocta, ts_ 
nombre, ts_tipo_def, ts_oficina_cta, ts_cheque_rec,
    ts_ubicacion, ts_autoriz_aut, ts_fonres_iess, ts_descripcion_ec, ts_corresponsal,  /*<REF 18>*/
    ts_autorizante, ts_autoriz_anula, ts_campo_alt_dos, ts_campo_alt_uno, ts_stick_imp)
  values
    (@s_ssn, @t_trn, @s_ofi, @s_user, @s_rol,
    @s_term, @t_corr, @i_canal, null, 'L',
    @s_lsrv, @s_date, @i_rubro, @w_codigo, @w_valch_usd,
    @t_ssn_corr, @i_cuenta, 1, 'L',  @w_val_usd,
    @i_debito, 0, @i_subtotal, 0, @w_debito_BR,
    @i_tsn, null,  
getdate(), @w_secuencial, @w_emp,
    @w_tipocta, @i_nombre_cta, @i_aplcobis, null, convert(int, @i_cant_cheques),
    @i_ubi, convert(varchar(10), @w_com), 0, @i_nombre_cta, @t_from , /*<REF 18>*/
    @w_nom_tramite1, @w_nom_tramite2, @w_ts_campo_alt_dos,
    @i_identificacion, @i_tipoid) /*<REF 18>*/

  if @@rowcount <> 1
  begin
    if @i_aplcobis = 'S'
    begin
      --rollback tran
      exec cobis..sp_cerror
        @t_from = @w_sp_name,
        @i_msg = "ERROR EN LA GENERACION DE TRX DE SERVICIO",
        @i_num = 031004
      return 031004
    end
    else
      return 33005
  end


select @o_base_imp = 0, @o_impuesto = 0 , @o_tasa= 0 --Ref017:msilvag 

  if (@i_comision_efe > 0 or @i_comision_chq > 0 or @i_comision_deb > 0)
  begin
    select @w_serie = pa_char
    from
      cobis..cl_parametro
    where
      pa_nemonico = 'SERNV'
    and pa_producto = 'CTE'


    if @t_trn = 3925
    begin
      if @w_emp ='2572'
        select  @w_trn = 3366 , @w_servicio ="14"
      else
        select  @w_trn = 3366 , @w_servicio ="15"
    end

    if @t_trn = 3926 or @t_trn = 3927
    begin
      if @w_emp ='2572'
        select  @w_trn = 3372 , @w_servicio ="14"
      else
        select  @w_trn = 3372 , @w_servicio ="15"
    end
    --<REF- >
    -- if @i_canal = 'IBK'
    --   set @w_causal = '339'
    -- else
      set @w_causal = null

    -- if @i_canal = 'CNB' or @i_canal = 'IBK' --Ref009:msilvag
    --     select @w_causal = '317' --, @w_servicio ="28"
    --Ref010:msilvag Inicio

    --<REF- >
    if @i_canal in ('VEN','SAT','WAP','CNB','IBK') --Ref012:msilvag = 'VEN'   --Ref014:jg
    begin
        if @i_tipo_cta = 'CTE'
        begin
            select @w_causal = b.valor
            from cobis..cl_tabla a, cobis..cl_catalogo b
              where a.tabla = 'causa_nd_comision_servcte'
              and a.codigo = b.tabla
              and b.codigo = convert(varchar,@i_empresa )
              and estado = 'V'
              set @w_rowcount = @@rowcount
        end
        else
        begin
            if @i_tipo_cta = 'AHO'
            begin
                select @w_causal = b.valor
                from cobis..cl_tabla a, cobis..cl_catalogo b
                where a.tabla = 'causa_nd_comision_servaho'
                and a.codigo = b.tabla
                and b.codigo = convert(varchar,@i_empresa ) 

                and estado = 'V'
                set @w_rowcount = @@rowcount  
            end
        end
        if @w_rowcount = 0 or (@w_causal = null or @w_causal = ' ')
        begin
            if @i_aplcobis = 'S'
            begin
  exec cobis..sp_cerror
                  @t_debug = @t_debug,
                  @t_file  = @t_file,
                  @t_from  = @w_sp_name,
                  @i_msg   = 'CAUSA DE ND NO DEFINIDA PARA LA COMISION',
                  @i_num   = 300003517 
 
               return 300003517 
            end
            else
                return 300003517
        end
    end 


 /*REF08 Inicio LBP*/
 if exists(select 1 from cob_pagos..pg_p_rubro_ser_dam 
    where rs_empresa = @i_empresa 
    and rs_canal = @ 
i_canal and rs_estado = 'V')  
 begin

             if @i_canal = 'CNB'
                select @w_emp_com = @i_empresa
                else
                if @i_canal = 'VEN'
                    select @w_emp_com = 134 -- Nemonico ATX

             selec 
t @w_comi_total = isnull(@i_comision_efe,0) + isnull(@i_comision_chq,0) + isnull(@i_comision_deb,0) 

             exec @w_return = cob_pagos..pa_pg_ivalor_comcal
                  @e_valor_comision  = @w_comi_total,
                  @e_oficina         = 
 @w_ofi,
                  @e_empresa         = @w_emp_com,
                  @e_canal           = @i_canal,
                  @s_valor_com_final = @w_com_original out, -- obtengo comision original
                  @s_aplica          = @w_aplica_des out
 
             if @w_return <> 0
                return 300003360  -- NO EXISTE REGISTRO DE PARAMETRO COMISION 

             if @w_aplica_des = 'S'
             begin
                  exec @w_return = cob_gov..pa_iva_pcompensacion
                       @ 
e_oficina        = @w_ofi,
                       @e_monto          = @w_com_original,
                       @s_monto_compensa = @w_valor_compensa out   
                  if @w_return <> 0
                     return 300003360  -- NO EXISTE REGISTRO DE  
PARAMETRO COMISION 
             end

 end
 /*REF08 Fin LBP*/
    
  exec @w_return = cob_remesas..sp_cobro_comision_rc
    @s_ssn      = @s_ssn,
    @s_lsrv     = @s_lsrv,
    @s_srv      = @s_srv,
    @s_user     = @s_user,
    @s_sesn     = @s_sesn,
   
  @s_term     = @s_term,
    @s_date     = @s_date,
    @s_ofi      = @s_ofi,
    @s_rol      = @s_rol,
    @s_org      = @s_org,
    @s_org_err  = @s_org_err, /* Origen de error: [A], [S] */
    @s_error    = @s_error,
    @s_sev      = @s_sev,
    @t_co 
rr     = @t_corr,
    @t_ssn_corr = @t_ssn_corr, /* Trans a ser reversada */
    @t_debug    = @t_debug,
    @t_file     = @t_file,
    @t_from     = null, /*<REF 18>*/
    @t_rty      = @t_rty,
    @t_trn      = @w_trn,
    @i_ubi      = @i_ubi,
    @i_m 
on      = @i_mon,
    @i_opcion   = "T",
    @i_servicio = @w_servicio,
                  @i_codigo   = @w_codigo, --Ref009:msilvag @w_codigo,--REF 20:llozanoj
    @i_efectivo = @i_comision_efe,
    @i_cheque   = @i_comision_chq,
    @i_debito   = @i_comi 
sion_deb,
    @i_cuenta   = @i_cuenta,
    @i_tipocta  = @i_tipo_cta,
    @i_aplcobis = C,
    @i_causal = @w_causal,
    @i_canal  = @i_canal ,    --Ref007:msilvag 
    @i_tsn    = @i_tsn        --Ref007:msilvag 

    if @w_return != 0
    begin
    exec 
 cobis..sp_cerror
      @t_debug  = @t_debug,
      @t_file   = @t_file,
      @t_from   = @w_sp_name,
                  @i_num    = @w_return --Ref009:msilvag 035000
             return  @w_return --Ref009:msilvag 1
    end

       --smerino busca calcul 
o dle iva
       -- smerino busqueda de la tasa del iva parametrizada en el person



      exec @w_return = cob_pagos..sp_verif_genera_costo
                @s_date         = @s_date,
                @i_mon          = @i_mon,
                @i_rubro     
    = 'IVA',
                @i_servicio     = 'ICAE',  --'CSPB',
                @i_canal        = 'VEN',
                @i_tipocta      = '3',
                @o_costo        = @w_tasa out
        if @w_return <> 0
        begin
            if @@tranco 
unt >0
            rollback

            return @w_return
        end

        if @w_tasa > 0
        begin
            select @o_tasa = @w_tasa --Ref007:msilvag 
            
            /*REF08 Inicio LBP*/
            if @w_aplica_des = 'S' and (@i_can 
al = 'CNB' or @i_canal = 'VEN')
            begin
                 -- smerino llamar al sp que retorna el valor del iva ----
                 exec  @w_return = cob_cuentas..sp_cal_impuesto
                       @i_tasa         = @w_tasa,
                 
       @i_valor_serv   = @w_com_original, -- Comision al 14%
                       @o_base_imp     = @w_base_imp out,
                       @o_impuesto     = @w_impuesto2 out
                 if @w_return <> 0
                 begin
                     
  if @@trancount >0
                         rollback
                      return @w_return
                 end
                 --Ref007:msilvag Inicio
                 else
                     select @o_base_imp  = @w_base_imp ,
                      
       @o_impuesto  = @w_impuesto2
                 --Ref007:msilvag Fin
            end
            else
            begin
            /*REF08 Fin LBP*/
                 -- smerino llamar al sp que retorna el valor del iva ----
                 exec  @w_ 
return = cob_cuentas..sp_cal_impuesto
                       @i_tasa         = @w_tasa,
                       @i_valor_serv   = @w_com,
                       @o_base_imp     = @w_base_imp out,
                       @o_impuesto     = @w_impuesto2 out
   
               if @w_return <> 0
                 begin
                      if @@trancount >0
                         rollback
                      return @w_return
                 end
                 --Ref007:msilvag Inicio
                 else
   
                   select @o_base_imp  = @w_base_imp ,
                            @o_impuesto  = @w_impuesto2
                 --Ref007:msilvag Fin
            end -- Fin if @w_aplica_des = 'S' and (@i_canal = 'CNB' or @i_canal = 'VEN') LBP
            
 
        end
        else
            select @w_base_imp  = @w_com,
                   @w_impuesto2 = 0, 
                   @o_base_imp  = 0, 
                   @o_impuesto  = 0,  
                   @o_tasa      = 0 --Ref007:msilvag 

        if @w_base 
_imp > 0
        begin
            /*REF08: Inicio LBP */ 
            if (@i_canal = 'CNB' or @i_canal = 'VEN') and @w_aplica_des = 'S'
            begin
                 --insert la trx del iva 3497 para cobro de la comision ---
                 exec @w 
_return = cob_cuentas..sp_cont_impuesto
                      @t_trn       = 3497 ,
                      @s_ssn       = @s_ssn,
                      @s_date      = @s_date,
                      @t_corr      = @t_corr,
                      @t_ssn_corr  
 = @t_ssn_corr,
                      @s_user      = @s_user,
                      @s_term      = @s_term,
                      @s_ofi       = @w_ofi, -- Oficina Damnificado REF08 LBP
                      @t_rty       = @t_rty,
                      @s 
_org       = @s_org,
                      @i_base_imp  = @w_base_imp,
                      @i_iva       = @w_impuesto2,
                      @i_total     = @w_com_original, -- Comision Original al 14
                      @i_cau       = @w_servicio,
   
                    @i_cta       = @w_comprobante, --Ref009:msilvag  @w_codigo, --referencia
                      @i_mon       = @i_mon,    --Moneda
                      @i_oficina_cta = @w_ofi, -- Oficina Damnificado REF08 LBP
                      @i_ 
ubi         = @i_ubi ,
                      @i_canal       = @i_canal, --Ref007:msilvag 
                      @i_cta_deb     = @i_cuenta -- REF08 LBP se agrega cuenta
                 if @w_return <> 0
                 begin
                     if @@tr 
ancount >0
                         rollback
                     return @w_return
                 end
            end
            else
            begin
            /*REF08: Fin LBP */ 
                 --insert la trx del iva 3497 para cobro de la comi 
sion ---
                 exec @w_return = cob_cuentas..sp_cont_impuesto
                      @t_trn       = 3497 ,
                      @s_ssn       = @s_ssn,
                      @s_date      = @s_date,
                      @t_corr      = @t_corr,
  
                     @t_ssn_corr  = @t_ssn_corr,
                      @s_user      = @s_user,
                      @s_term      = @s_term,
                      @s_ofi       = @s_ofi,
                      @t_rty       = @t_rty,
                      @s 
_org       = @s_org,
                      @i_base_imp  = @w_base_imp,
                      @i_iva       = @w_impuesto2,
                      @i_total     = @w_com,
                      @i_cau       = @w_servicio,
                      @i_cta       = @ 
w_comprobante, --Ref009:msilvag @w_codigo, --referencia
                      @i_mon       = @i_mon,    --Moneda
                      @i_oficina_cta = @s_ofi,
                      @i_ubi         = @i_ubi ,
                      @i_canal       = @i_canal 
 --Ref007:msilvag 
                 if @w_return <> 0
                 begin
                     if @@trancount >0
                         rollback
                     return @w_return
                 end
            end -- Fin if @i_canal = 'CNB' or  
@i_canal = 'VEN' LBP
        end

           if @i_tipo_cta= 'CTE' and @w_debito_usd > 0
           begin
           select @w_cliente = cc_cliente
           from cob_cuentas..cc_ctacte
           where cc_cta_banco = @i_cuenta
           end

           
 if @i_tipo_cta = 'AHO' and @w_debito_usd > 0
           begin
           select @w_cliente = ah_cliente
           from cob_ahorros..ah_cuenta
           where ah_cta_banco = @i_cuenta
           end

           if @w_cliente > 0
           begin
        
      select @w_ced_ruc = en_ced_ruc,
                    @w_nombre = substring(ltrim(en_nombre) + " " + ltrim(p_p_apellido) + " " + rtrim(ltrim(p_s_apellido)),1,45)
             from cobis..cl_ente
             where en_ente = @w_cliente
          end
   
        else
            select @w_ced_ruc = '9999999999999' --REF 6

     --print 'inserto trx 3497'
     --fin smerino

   end

      -- Actualizacion de Totales de cajero

  if @i_canal = 'VEN'
  begin
    exec @w_return = cob_remesas..sp_upd_totales_r 
c
      @i_ofi            = @s_ofi,
      @i_rol            = @s_rol,
      @i_user           = @s_user,
      @i_producto       = 'CTE',
      @i_mon            = @i_mon,
      @i_ubi            = @i_ubi,
      @i_trn            = @t_trn,
      @i_nodo   
         = @s_srv,
      @i_tipo           = 'L',
      @i_corr           = @t_corr,
      @i_efectivo       = @w_val_usd,
      @i_cant_chq       = @w_cant_cheques,
      @i_cheque         = @w_valch_usd,
      @i_tipocta        = @i_tipo_cta,
      @i_t 
arjetas     = @i_subtotal,
      @i_otros          = @w_debito_usd_bak,
      @i_retencion      = @w_reten_usd,
      @i_causa          = @w_emp

    if @w_return != 0
    begin
      if @i_aplcobis = 'S'
      begin
        exec cobis..sp_cerror
         
  @t_debug         = @t_debug,
          @t_file          = @t_file,
          @t_from          = @w_sp_name,
          @i_msg           = 'ERROR EN LA GENERACION DE TOTALES',
          @i_num           = 111111
        return 1
      end
      else
      
   return 37609
    end
  end

  --commit tran

    if @t_corr = 'N'
        if @w_ind_diferido = "S"
            select @w_horario = "D"
        else
            select @w_horario = "N"
 
 --<REF 17
 if @i_canal = 'CNB'        
  select @o_horario = @w_h 
orario
 --REF 17>
 
    if @i_canal = 'VEN'
    begin
    select
      @w_fecvensri = pa_char
    from
      cobis..cl_parametro
    where
      pa_nemonico = 'FECVAL'
    and pa_producto = 'CTE'

    select
      @w_autorisri = pa_char
    from
      cob 
is..cl_parametro
    where
      pa_nemonico = 'NUMAUT'
    and pa_producto = 'CTE'
  end

    select
    @o_fecha_contable = convert(varchar(10),@w_fecha_efe,103),
    @o_fecha_efectiva = (convert(varchar(10),@w_fecha_efe,101) + ' ' + convert(varchar(9), 
getdate(),108)),
    @o_autorisri    = @w_autorisri,
    @o_fecvensri    = @w_fecvensri,
    @o_nota_venta   = @w_nota_venta,
    @o_ssn        = @w_ssn


  if @i_canal  IN ('IBK','WAP')  --ref014
  begin
    select "results_submit_rpc",
       r_sec_ts   
      = @w_ssn,
       r_fecha_contable  = @o_fecha_contable,
       r_fecha_efectiva  = @o_fecha_efectiva

    end

    if @i_canal in( 'CNB','IBK','WAP') --REF11 pagos por Cyberbank esta fecha retornaba mes dia a?o , el flujo del bus 
        select @o_ 
fecha_contable = convert(varchar(10),@w_fecha_efe,101)
 
end    



/*<REF 19 INI>*/
/***************************************************************/
/*Consulta de Horario de la empresa y comision para la empresa**/
/************************************* 
**************************/

if @i_operacion = 'Q'
begin

  select @w_fecha_efe = @s_date

  select @w_hora_tope = convert(int, (substring (b.valor,1,2) + substring (b.valor,4,2) + substring (b.valor,7,2)))
  from  cobis..cl_tabla a, cobis..cl_catalogo b
 
  where a.tabla = 'sv_horario_serv'
  and   a.codigo = b.tabla
  and   b.codigo = convert(char(10),@i_empresa)
  and   estado = 'V'

  if @@rowcount = 0 or @w_hora_tope = 0
  begin
      if @i_aplcobis = 'S'
    begin
     exec cobis..sp_cerror
      @t_d 
ebug         = @t_debug,
      @t_file          = @t_file,
      @t_from          = @w_sp_name,
      @i_msg           = 'PARAMETRO DE HORA TOPE NO DEFINIDA',
      @i_num           = 111111
     return 1
    end
      else
  begin
          return 37601
 
  end
  end

  select  @w_hora_sys = convert(varchar(08),getdate(),108)
  select  @w_hora = convert(int, (substring (@w_hora_sys,1,2) + substring (@w_hora_sys,4,2) + substring (@w_hora_sys,7,2)))

  if @w_hora >= @w_hora_tope
 begin
  set @o_horario = 'D' 

  select @w_fecha_efe = min(dl_fecha)
  from cob_cuentas..cc_dias_laborables
  where dl_ciudad = 1
    and dl_num_dias = 1
 end
  else
 begin
  set @o_horario = 'N'
 end

  exec @w_return = cob_pagos..sp_verif_genera_costo
    @s_date         = @s_date,
 
    @i_mon          = @i_mon,
    @i_rubro        = 'PCTG',
    @i_servicio     = 'CSPB',
    @i_canal        = @i_canal,
    @o_costo        = @o_comision out

  if @w_return <> 0
    return @w_return

  select @o_fecha_efe = convert(varchar(10), @w_fech 
a_efe, 101)


if  @o_comision > 0
  begin
    exec @w_return = cob_pagos..sp_verif_genera_costo
         @s_date         = @s_date,
         @i_mon          = @i_mon,
         @i_rubro        = 'IVA',
         @i_servicio     = 'SRI',   
         @i_canal 
        = @i_canal,
         @i_tipocta      = '3',
         @o_costo        = @o_tasa out

       if @w_return <> 0
      return @w_return
   
  if @o_tasa > 0
          begin
   exec  @w_return = cob_cuentas..sp_cal_impuesto
      @i_tasa   = @o_tasa,
  
     @i_valor_serv = @o_comision,
      @o_base_imp = @o_base_imp out,
      @o_impuesto  = @o_impuesto out
         if @w_return <> 0
        begin

           if @@trancount >0
    rollback

   return @w_return

       end
         end
         else
    
       select @w_base_imp=@o_comision,@w_impuesto2=0

  end 
end  
/*<REF 19 FIN>*/