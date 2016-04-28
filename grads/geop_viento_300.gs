*******************************************
* Grafica geopotencial y viento en 300hPa *
*******************************************
'reinit' 
'set display color white'
'reset'
'run jaecol.gs'
'set mpdset hires'

* Cambiar fecha en el nombre de archivo de los datos
*****************************************************
*****************************************************
anio='2016'
mes='JAN'
mes_num='01'
dia='01'
hora='00'
*nombre_archivo='ERA-Int_pl_' anio mes_num '.nc'
* Ingresar la cantidad total de tiempos del archivo (VER CANTIDAD DE GRÁFICOS MATLAB)
cant_tiempos=124
*****************************************************
*****************************************************

carpeta_salida='/home/hernymet/Documents/figuras_grads/geop_viento_300/'
'sdfopen /home/hernymet/Documents/reanalisis/ERA-Int_pl_20160101.nc'
'sdfopen /home/hernymet/Documents/reanalisis/surface_geop_05.nc'

'set lat -55 -15'
'set lon 260 320'
'set mpdset sa'
'set lev 300'

tinicio=hora 'Z' dia mes anio
'set time 'tinicio
'q dims'
linea1=sublin(result,5)
tiempo_cero=subwrd(linea1,9)
tiempo=tiempo_cero

while ( tiempo < tiempo_cero+cant_tiempos )

'set t ' tiempo

*Graficamos el viento

'set gxout shaded'
*'set clevs 40 50 60 70 80'
'set clevs 75 100 125 150 175'
'set ccols 0 22 23 24 25 26'
'set grads off'
'define ukn=u*1.943'
'define vkn=v*1.943'
'd mag(ukn,vkn)'
'run cbarn 0.8 1 10.5'

'set gxout contour'
'set ccolor 0'
'set clab off'
'set clevs 75 100 125 150 175'
'd mag(ukn,vkn)'

*BARBAS
'set grads off'
'set gxout barb'
'set strmden 4'
'set ccolor 1'
'set cthick 3'
'set cstyle 1'
'd skip(ukn,6);skip(vkn,6)'


* Graficamos la altura geopotencial cada 60mgp
'set cint 60'
'set gxout contour'
'set ccolor 1'
'set clab masked'
'd z/9.80665'


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

'draw title Altura Geopotencial (cont, mgp) y Viento (somb, kts)\en 300 hPa 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/geop_viento_300_' anio'_' mes '_' dia'_' hora Z'.gif gif white x800 y600'

*Borramos la pantalla
'c'
*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile


