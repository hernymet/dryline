***********************************************
* Grafica geopotencial y vorticidad en 300hPa *
***********************************************
'reinit' 
'set display color white'
'reset'
'run jaecol.gs'
'set mpdset hires'

* Cambiar fecha en el nombre de archivo de los datos
*****************************************************
*****************************************************
anio='2013'
mes='DEC'
mes_num='12'
dia='01'
hora='00'
*nombre_archivo='ERA-Int_pl_' anio mes_num '.nc'
* Ingresar la cantidad total de tiempos del archivo (VER CANTIDAD DE GRÁFICOS MATLAB)
cant_tiempos=124
*****************************************************
*****************************************************

carpeta_salida='/home/hernymet/Documents/figuras_grads/geop_vort_rel_500/'
'sdfopen /home/hernymet/Documents/reanalisis/ERA-Int_pl_20131201.nc'

'set lat -55 -15'
'set lon 260 320'
'set mpdset sa'

tinicio=hora 'Z' dia mes anio
'set time 'tinicio
'q dims'
linea1=sublin(result,5)
tiempo_cero=subwrd(linea1,9)
tiempo=tiempo_cero

while ( tiempo < tiempo_cero+cant_tiempos )

'set t ' tiempo

* GEOPOTENCIAL Y VORTICIDAD EN 500 hPa
'set grads off'
'set lev 500'
'set gxout shaded'
'set clevs   -12 -10 -8 -6 -4 -2  2 4 6 8 10 12'
'set rbcols 49 48 47 46 45 44  0 21 22 23 24 25 26'
'd vo*1e5'
'set gxout contour'
'set ccolor 0'
'set clab off'
'set clevs  -12 -10 -8 -6 -4 -2  2 4 6 8 10 12'
'd vo*1e5'

'run cbarn 0.8 1 10.5'


* Graficamos la altura geopotencial cada 60mgp
'set ccolor 1'
'set cint 60'
'set cthick 4'
'set clskip 2'
'set clab masked'
'd z/9.80665'

*BARBAS
'set grads off'
'set gxout barb'
'set strmden 4'
'set ccolor 1'
'set cthick 3'
'set cstyle 1'
'define ukn=u*1.943'
'define vkn=v*1.943'
'd skip(ukn,6);skip(vkn,6)'

*Grafico el titulo

'q dims'
line1=sublin(result,5)
itime1=subwrd(line1,6)

itime2=subwrd(line1,9)
'q dims'
line2=sublin(result,5)
itime3=subwrd(line2,6)
dia=substr(itime3,4,2)
mes=substr(itime3,6,3)
hora=substr(itime3,1,2)
anio= substr(itime3,9,4)

'draw title Altura Geopotencial (mgp), Vorticidad relativa (m2/s2*1e5)\ y viento (kts) en 500 hPa 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/geop_vort_500_' anio'_' mes '_' dia'_' hora Z'.gif gif white x800 y600'

*Borramos la pantalla
'c'
*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile


