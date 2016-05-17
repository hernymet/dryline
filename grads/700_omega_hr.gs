***********************************************
* Grafica Omega y humedad relativa en 700 hPa *
***********************************************
'reinit' 
'set display color white'
'reset'
'run jaecol'
'set mpdset sa'

* Cambiar fecha en el nombre de archivo de los datos
*****************************************************
*****************************************************
anio='2014'
mes='JAN'
mes_num='01'
dia='01'
hora='00'
*nombre_archivo='ERA-Int_pl_' anio mes_num '.nc'
* Ingresar la cantidad total de tiempos del archivo (VER CANTIDAD DE GRÁFICOS MATLAB)
cant_tiempos=124
*****************************************************
*****************************************************

carpeta_salida='/home/hernymet/Documents/figuras_grads/700_omega_hr/'
'sdfopen /home/hernymet/Documents/reanalisis/ERA-Int_pl_20140101.nc'
'sdfopen /home/hernymet/Documents/reanalisis/surface_geop_05.nc'

'set lat -50 -25'
'set lon 285 320'


'run jaecol'
'set mpdset sa'

tinicio=hora 'Z' dia mes anio
'set time 'tinicio
'q dims'
linea1=sublin(result,5)
tiempo_cero=subwrd(linea1,9)
tiempo=tiempo_cero

while ( tiempo < tiempo_cero+cant_tiempos )

'set t ' tiempo
'set lev 700'
'set grads off'

* OMEGA EN 700 hPa
'set gxout shaded'
'set rbrange 60 100'
'set clevs -2.5 -2.0 -1.5 -1.0 -.5 -.4 -.3 -.2 -.1 0 .1 .2 .3 .4 .5 1.0'
'set rbcols 57 29 28 27 26 25 24 23 22  0 0  41 42 43 44 45 46'
'set grads off'
'd maskout(smth9(w),3000-z.2(t=1,z=1)/9.80665)'
'run cbarn'

'set gxout contour'
'set ccolor 0'
'set cthick 4'
'set clab off'
'set clevs -2.5 -2.0 -1.5 -1.0 -.5 -.4 -.3 -.2 -.1 0 .1 .2 .3 .4 .5 1.0'
'set grads off'
'd maskout(smth9(w),3000-z.2(t=1,z=1)/9.80665)'

* HUMEDAD RELATIVA EN 700 hPa
'set gxout contour'
'set clab on'
'set ccolor 2'
'set clevs 80 90 100'
'd maskout(smth9(r),3000-z.2(t=1,z=1)/9.80665)'
'set gxout contour'
'set ccolor 1'
'set cthick 2'
'set clevs 30 40 50'
'd maskout(smth9(r),3000-z.2(t=1,z=1)/9.80665)'
'set gxout contour'
'set ccolor 4'
'set cthick 2'
'set clevs 60 70'
'd maskout(smth9(r),3000-z.2(t=1,z=1)/9.80665)'


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

'draw title Altura geop, omega (somb, Pa/s) \ y humedad relativa en 700 hPa 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/omega_700_' anio'_' mes '_' dia'_' hora Z'.gif gif white x800 y600'

*Borramos la pantalla
'c'
*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile

