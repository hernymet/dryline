***********************************************************************
* Grafica geopotencial y el gradiente de temperatura en 925hPa *
***********************************************************************
'reinit' 
'set display color white'
'reset'
'run jaecol'
'set mpdset sa'

* Cambiar fecha en el nombre de archivo de los datos
*****************************************************
*****************************************************
anio='2009'
mes='NOV'
mes_num='11'
dia='26'
hora='00'
*nombre_archivo='ERA-Int_pl_' anio mes_num '.nc'
* Ingresar la cantidad total de tiempos del archivo (VER CANTIDAD DE GRÁFICOS MATLAB)
cant_tiempos=12
*****************************************************
*****************************************************

carpeta_salida='/home/hernymet/Documents/ERA-Interim/925_geop_grad_temp/'
'sdfopen /home/hernymet/Documents/ERA-Interim/0125ERA-Int_pl.nc'
'sdfopen surface_geop_125.nc'

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
'set lev 925'


*GRADIENTE DE TEMPERATURA EN 925
*ALGUNAS CONSTANTES DEL SCRIPT 'DYNAMIC.GS'

'pi=3.14159'
'dtr=pi/180'
'a=6.37122e6'
'omega=7.2921e-5'
'g=9.8'
'R=287'
'define f=2*omega*sin(lat*dtr)'
'define p=lev*100'

'dy=cdiff(lat,y)*dtr*a'
'dx=cdiff(lon,x)*dtr*a*cos(lat*dtr)'


'dtdx=cdiff(t,x)/dx'
'dtdy=cdiff(t,y)/dy'

'define gt=sqrt((dtdx*dtdx)+(dtdy*dtdy))'

'set clevs 4 6 8 10 12'
'set ccols 0 65 67 69 57 59'
*'set ccols 0 63 65 66 67 68 69 70' 

'set grads off'
'set gxout shaded'
'd smth9(maskout(gt*1e5,1500-z.2(z=1)/9.80665))'
'run cbarn'

* ALTURA GEOPOTENCIAL


'set gxout contour'
'set cint 60'
'set ccolor 59'
'set cthick 6'
'set cstyle 1'
'set clab masked'
'set clopts -1 6 0.10'
'd smth9(maskout(z/9.80665,1500-z.2(z=1)/9.80665))'

* TEMPERATURA
'set gxout contour'
'set cint 4'
*'set cmin 2'
'set ccolor 1'
'set cthick 6'
'set cstyle 1'
'set clab masked'
*'set clopts -1 4 0.13'
'd smth9(maskout(t-273.15,1500-z.2(z=1)/9.80665))'

*BARBAS
'set gxout barb'
'set strmden 4'
'set ccolor 1'
'set cthick 3'
'set cstyle 1'
'define ukn=u*1.943'
'define vkn=v*1.943'
'd maskout((skip(ukn,12)),1500-z.2(z=1)/9.80665);skip(vkn,12)'

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

'draw title Altura geop (cont. violeta), Temperatura (cont. negro, C)\ grad. de T (C/100Km) y viento (kts) en 925 hPa 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/geop_grad_temp_925_' anio'_' mes '_' dia'_' hora Z'.gif gif white x800 y600'

*Borramos la pantalla
'c'
*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile


