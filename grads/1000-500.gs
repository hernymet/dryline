***********************************************
* Grafica geopotencial y viento en 1000hPa y el espesor 1000/500 *
***********************************************
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

carpeta_salida='/home/hernymet/Documents/figuras_grads/1000-500/'
'sdfopen /home/hernymet/Documents/reanalisis/ERA-Int_pl_20160101.nc'
'sdfopen /home/hernymet/Documents/reanalisis/surface_geop_05.nc'


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

*ESPESOR 1000/500

'set grads off'
'set gxout shaded'
'set clevs 5160 5220 5280 5340 5400 5460 5520 5580 5640 5700 5760 5820'
'set rbcols 49 48 47 46 45 44 43 42 41 21 22 23 24 25 26'
'set cint 60'
'd maskout((z(lev=500)-z(lev=1000))/9.80665,2000-z.2(t=1,z=1)/9.80665)'
'run cbarn 0.8 1 10.45'
'set gxout contour'
'set ccolor 39'
'set clab off'
'set cint 60'
'd maskout((z(lev=500)-z(lev=1000))/9.80665,2000-z.2(t=1,z=1)/9.80665)'

* EN ROJO CONTORNOS DE 5400 Y 5700
'set ccolor 0'
'set gxout contour'
'set clevs 5400 5700'
'set clab masked'
'set ccolor 2'
'set cstyle 1'
'set cthick 6'
'set clopts 29 13 0.12'
'd maskout((z(lev=500)-z(lev=1000))/9.80665,2000-z.2(t=1,z=1)/9.80665)'

*GEOPOTENCIAL EN 1000 HPA
'set lev 1000'
'set ccolor 1'
'set clab on'
'set clskip 2'
'set cint 40'
'set clab masked'
'set clskip 2'
'set cthick 6'
'set clopts -2 6 0.12'
*'d smth9(maskout(geop,2000-HGTsfc))'
'd maskout(z(lev=1000)/9.80665,2000-z.2(t=1,z=1)/9.80665)'

*BARBAS
'set grads off'
'set gxout barb'
'set strmden 4'
'set ccolor 1'
'set cthick 3'
'set cstyle 1'
'define ukn=u*1.943'
'define vkn=v*1.943'
'd skip(ukn,3);skip(vkn,3)'

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

'draw title Altura geop. (lineas), viento en 1000 hPa (kts)\ y Espesor 500/1000 hPa (somb.), 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/1000-500_' anio'_' mes '_' dia'_' hora Z'.gif gif white x800 y600'

*Borramos la pantalla
'c'
*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile


