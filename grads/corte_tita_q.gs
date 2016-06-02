****************************************************************************************
* Corte vertical meridional de temperatura potencial, q y viento bidimensional v, omega*
****************************************************************************************

'reinit' 
'set display color white'
'reset'
'run jaecol'
'set mpdset sa'

* Cambiar fecha en el nombre de archivo de los datos
*****************************************************
*****************************************************
anio='2016'
mes='ENE'
mes_num='01'
dia='15'
hora='00'
*nombre_archivo='ERA-Int_pl_' anio mes_num '.nc'
*****************************************************
*****************************************************

carpeta_salida='/home/hernymet/Documents/figuras_grads/corte_meridio_tita_q/'
'sdfopen /home/hernymet/Documents/reanalisis/ERA-Int_pl_20160101.nc'
'sdfopen /home/hernymet/Documents/reanalisis/surface_geop_05.nc'

latcorte='-45 -32'
loncor=-72
loncorte=loncor+360
fin=loncorte+15


'define altopo=z.2(lev=0,t=1)/9.80665'
'set lev 1000 150'
'define geop=z/9.80665'


tiempo=hora 'Z' dia mes anio

while ( loncorte < fin )

'set time 'tiempo
'set lat 'latcorte
'set lon 'loncorte 
'set lev 1000 150'

* Cosas de Formato
'set vpage  0 10.5 0. 8.5'
'set parea 1 9.5 1 7.5'

* Graficamos la humedad específica

'set gxout shaded'
'set clevs 6 8 10 12 14 16 18'
'set ccols  0 43 39 37 35 22 63 65'
'set grads off'
'set zlog on'
'd q*1000'
'run cbarn 1 1'


* Definimos la temperatura potencial y graficamos
'tita = t*pow((1000/lev),287/1004)'
'set cint 3'
'set gxout contour'
'set ccolor 1'
'set cthick 6'
'set clab forced' 
'set zlog on'
'd tita'

* Graficamos el vector v;w, tenemos que convertir omega a w primero:

'g=9.8'
'R=287'
'rho=(lev*100)/(R*t)'
'wvel=-w/(rho*g)'
'set gxout vector'
'set ccolor 1'
'set arrscl 0.3 10'
'd v;skip(wvel*100,2)'

* Graficamos omega
'set clevs -2.5 -2 -1.5 -1 -0.5  0.5 1 1.5 2 2.5'
'set ccolor 29'
'set clab on' 
'd w'


* La tropopausa dinámica (-1.6 PVU por encima de 650 hPa) 
'set clevs -1.6'
'set gxout contour'
'set ccolor 4'
'set cthick 24'
'set clab TROPO_DIN'
'set cstyle 1'
'set zlog on'
'd maskout(pv*1e6, 650-lev)'


*Grafico de la TOPOGRAFIA

'set gxout contour'
'set clab off'
size=750
int=10
i=0
'hgt=geop-altopo'

while(i*size>=-5000)
j=i-1
'set ccolor 1'
'set cthick 12'
'set cstyle 1'
'set cmax 'i*size
'set cmin 'j*size
'set cint 'int
'd hgt'
i=i-1
endwhile

*Para marcar el contorno exterior con negro
'set ccolor 1'
'set cthick 5'
'set cstyle 1'
'set cmax 40'
'set cmin 40'
'set cint 40'
'd hgt'

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

'draw title Corte Vertical en lon='loncor' de Temperatura Potencial (cont. negro, K),\q (somb, g/Kg), omega (cont. rojo, Pa/s) y \vector (v,w*100) (m/s, flechas) 'itime1'.'

*Guardamos la figura
tiempo_guarda=itime2+100
'printim 'carpeta_salida'/'tiempo_guarda''m_corte_tita_q''loncor''_''itime1'.gif gif white x800 y600'


*Borramos la pantalla
'c'
*Avanzamos el contador para pasar al tiempo siguiente.
loncorte=loncorte + 1
loncor=loncor + 1
endwhile

