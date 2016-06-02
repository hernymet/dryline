*************************************************************************
* GRAFICA LA IMAGEN SATELITAL INFRARROJA Y EL GRADIENTE DE Q EN 925 hPa *
*************************************************************************
'reinit' 
'set display color white'
'reset'
'set mpdset sa'

* Modificar las fechas que queremos graficar
*****************************************************
*****************************************************
* Poner la fecha del primer tiempo a graficar
anio='2016'
mes='JAN'
mes_num='01'
dia='13'
hora='06'
*nombre de archivo de los datos ERA-interim
nombre_archivo='ERA-Int_pl_' anio mes_num '01.nc'
* Ingresar la cantidad total de tiempos que queremos graficar
cant_tiempos=16
*****************************************************
*****************************************************

* Adónde van a parar las figuras:
carpeta_salida='/home/hernymet/Dropbox/drylines/casos_de_estudio/17-20-diciembre-2013/gradiente_q_ir/'


*********************************
*A PARTIR DE ACÁ NO CAMBIAR NADA*
*********************************

* Abrimos los archivos del ERA-Interim, incluyendo el de topografía
'sdfopen /home/hernymet/Documents/reanalisis/' nombre_archivo
'sdfopen /home/hernymet/Documents/reanalisis/surface_geop_05.nc'

* Abrimos el ctl correspondiente a las imágenes satelitales
'run jaecol'
'open ir_area2.ctl'

* Declaramos cuál va a ser el primer tiempo

tinicio=hora 'Z' dia mes anio
'set time 'tinicio
'q dims'
linea1=sublin(result,5)
tiempo_cero=subwrd(linea1,9)
tiempo=tiempo_cero

* Arranco el loop

while ( tiempo < tiempo_cero+cant_tiempos )
'set t ' tiempo

* Grafico la imágen satelital IR
* Extraigo los datos

'!gunzip /home/hernymet/Documents/satelitales/ir' anio mes_num dia hora '.dat.gz'


* Defino el dominio y arranco a graficar
'set lat -45 -30'
'set lon -75 -54'
'set grads off'
'set gxout shaded'
*'set map 1'
'set rbcols 59   56   53     29   27   25    23   21     49   47    45  43     41  39    37  35    33    72   73    74   75 76 77 78 79 1 '
'set clevs   -85  -80 -75 -70   -65  -60    -55 -50    -45  -40   -35  -30   -25 -20   -15 -10   -5   0     5   10    15   20  25 30 35 40'
'd ch4.3(Z=1)+75-273'
'run cbarn'

* Ahora el gradiente de q en 925 hPa

'set lev 925'
* La longitud tiene otro formato
'set lon 285 306'
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


'dqdx=cdiff(q,x)/dx'
'dqdy=cdiff(q,y)/dy'

'define gq=sqrt((dqdx*dqdx)+(dqdy*dqdy))'

'set gxout contour'
'set clevs 3 4 5 6 7 8 9'
'set ccolor 4'
*'set ccols 0 23 25 26 27 28 29 30' 
'set cthick 6'
'set clopts 4 6 0.07'
'set clab on'
'd maskout(gq*1e8,3000-z.2(t=1,z=1)/9.80665)'

* HUMEDAD ESPECÍFICA
'set gxout contour'
'set cint 2'
'set ccolor 1'
'set cthick 6'
'set cstyle 1'
'set clab masked'
*'set clopts -1 4 0.13'
'd smth9(maskout(q*1000,1500-z.2(t=1,z=1)/9.80665))'


*BARBAS
'set gxout barb'
'set strmden 4'
'set ccolor 1'
'set cthick 3'
'set cstyle 1'
'define ukn=u*1.943'
'define vkn=v*1.943'
'd maskout((skip(ukn,2)),1500-z.2(t=1,z=1)/9.80665);vkn'

* Título

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


'draw title Imagen satelital IR, Grad. de q ((g/kg)/100km)\y viento (kts) en 925 hPa 'itime1

* Nombre de archivo
'printim 'carpeta_salida'/ir_grad_q_925_' anio'_' mes '_' dia'_' hora Z'.png png x1500 y1200 white'

'!gzip /home/hernymet/Documents/satelitales/ir' anio mes_num dia hora '.dat'

*Borramos la pantalla
'c'

*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile











