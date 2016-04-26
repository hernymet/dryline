***********************************************
* Grafica titae en 850 hPa *
***********************************************
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

carpeta_salida='/home/hernymet/Documents/ERA-Interim/titae_850'
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
'set lev 850'

'set lev 850'
'define et=(-2937.4/(t))-(4.9283*log10(t))+22.5518'
'define es=pow(10,et)*10'
'define e=es*0.01*r'
'define q=0.622*e/(lev-e)'
'define aux=3.5 *log(t)-log(e)-4.805'
'define tl=2840./aux + 55.'
'undefine aux'
'define aux=3.376/tl - 0.00254'
'define aux1=q*1000*(1.+0.81*q)'
'define aux2=0.2854*(1.-0.28*q)'
'define aux3=(1000/lev)'
'define te=((t)*pow(aux3,aux2)*exp(aux*aux1))'
'undefine aux'
'undefine aux1'
'undefine aux2'
'undefine aux3'
'set gxout shaded'
*'set xlopts 1 3 .10'
*'set ylopts 1 3 .10'
*'set clopts -1 3 0.10'
*'set xlint 10'
*'set ylint 10'


*CONVERGENCIA DE HUMEDAD
'set gxout shaded'
'set clevs -80 -70 -60 -50 -40 -30 -20 -15 -10 -5 -1 0'
'set ccols 29 28 27 26 25 24 23 35 34 33 32 31 0'
'set grads off'
'd maskout(smth9(hdivg(q*u,q*v))*86400000,1500-z.2(z=1)/9.80665)'
'run cbarn 0.8 1 10.5'
'set gxout contour'
'set ccolor 0'
'set clevs  -80 -70 -60 -50 -40 -30 -20 -15 -10 -5 -1 0'
'set clab off'
'set grads off'
'd maskout(smth9(hdivg(q*u,q*v))*86400000,1500-z.2(z=1)/9.80665)'
*'d smth9(hdivg(q*u,q*v))*86400000'


* TITAE
'set ccolor 1'
'set cint 5'
'set cthick 6'
'set clab masked'
'set clskip 2'
'set grads off'
'd maskout(smth9(te),1500-z.2(z=1)/9.80665)'
'set ccolor 55'
'set cthick 7'
'set clevs 310 350'
'd maskout(smth9(te),1500-z.2(z=1)/9.80665)'
*'d smth9(te)'

*VIENTO
'set gxout barb'
'set ccolor 26'
'set cthick 5'
'set grads off'
'define ukt=u*1.943'
'define vkt=v*1.943'
'd skip(maskout(ukt,1500-z.2(z=1)/9.80665),12);skip(maskout(vkt,1500-z.2(z=1)/9.80665),12)' 


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

'draw title Convergencia de humedad g/Kg*dia(somb) \Viento (kts) y Theta-e (lineas) en 850 hPa, 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/titae_850_' anio'_' mes '_' dia'_' hora Z'.gif gif white x800 y600'

*Borramos la pantalla
'c'
*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile


