***************************************************
* Grafica T y Td a 2m y lineas de corriente a 10m *
***************************************************
'reinit' 
'set display color white'
'reset'
'run jaecol'
'set mpdset sa'

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
carpeta_salida='/home/hernymet/Documents/figuras_grads/temp_td/'
'sdfopen /home/hernymet/Documents/reanalisis/ERA-Int_sup_20160101.nc'
'sdfopen /home/hernymet/Documents/reanalisis/mask.nc'

'set lat -50 -25'
'set lon 285 320'


tinicio=hora 'Z' dia mes anio
'set time 'tinicio
'q dims'
linea1=sublin(result,5)
tiempo_cero=subwrd(linea1,9)
tiempo=tiempo_cero

while ( tiempo < tiempo_cero+cant_tiempos )

'set t ' tiempo

*TEMPERATURA A 2m
'set gxout shaded'
'set clevs -12 -8 -4 0 4 8 12 16 20 24 28 32 36 40 44'
'set rbcols 59 57 55 53 49 47 45 39 37 22 24 27 29 55 53 51' 
'set grads off'
'd maskout(t2m-273.15,lsm.2(t=1)-1)'
'run cbarn'



*Td a 2m

'set gxout contour'
'set clevs -12 -8 -4 0 4 8 12 16 20 24'
'set cstyle 1'
'set ccolor 1'
'set cthick 6'
'd maskout(d2m-273.15,lsm.2(t=1)-1)'


*Lineas de corriente a 10m
'set gxout stream'
'set strmden 4'
'set ccolor 74'
'set cthick 5'
'set cstyle 1'
*'set strmden -5 0.05 0.5'
*'d u10;v10'


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

'draw title T (somb, C) y Td (cont, C) c/4C a 2m, 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/t_td_' anio'_' mes '_' dia'_' hora Z'.gif gif white x800 y600'

*Borramos la pantalla
'c'
*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile

