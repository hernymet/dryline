**********************************************************************************************************
* Intento de graficar la función frontogénesis bidimensional aplicada a la humedad específica en 925 hPa,*
* Ecuación 13.1 del Carlson										 *
* No es elegante pero funciona, no tocar nada o revisar todo el código	    				 *
* Si no te gusta programalo vos										 *
* Simplemente reemplazo tita por q en las ecuaciones							 *
**********************************************************************************************************

'reinit' 
'set display color white'
'reset'
'run jaecol'
'set mpdset sa'

* Cambiar fecha en el nombre de archivo de los datos
*****************************************************
*****************************************************
anio='2013'
mes='DIC'
mes_num='12'
dia='17'
hora='00'
*nombre_archivo='ERA-Int_pl_' anio mes_num '.nc'
* Ingresar la cantidad total de tiempos
cant_tiempos=24
*****************************************************
*****************************************************

carpeta_salida='/home/hernymet/Documents/figuras_grads/frontogenesis_q/'
'sdfopen /home/hernymet/Documents/reanalisis/ERA-Int_pl_20131201.nc'
'sdfopen /home/hernymet/Documents/reanalisis/surface_geop_05.nc'

'set lat -50 -25'
'set lon 280 310'


tinicio=hora 'Z' dia mes anio
'set time 'tinicio
'q dims'
linea1=sublin(result,5)
tiempo_cero=subwrd(linea1,9)
tiempo=tiempo_cero

while ( tiempo < tiempo_cero+cant_tiempos )

'set t ' tiempo
'set lev 925'

* Defino algunas constantes para poder hacer diferencias finitas

'pi=3.14159'
'dtr=pi/180'
'a=6.37122e6'
'omega=7.2921e-5'
'g=9.8'
'R=287'
'define f=2*omega*sin(lat*dtr)'

'dy=cdiff(lat,y)*dtr*a'
'dx=cdiff(lon,x)*dtr*a*cos(lat*dtr)'

* Defino q para el tiempo anterior
'qprevio = q(T-1)'

* Sus derivadas en la dirección x e y, y la magnitud del gradiente:
* Para el tiempo actual y el anterior
'dqdx=cdiff(q,x)/dx'
'dqdy=cdiff(q,y)/dy'
'gradq=mag(dqdx,dqdy)'

'dqdxprev=cdiff(qprevio,x)/dx'
'dqdyprev=cdiff(qprevio,y)/dy'


* Derivada vertical de q entre 950 y en 900 hPa 
* Para el tiempo actual y el anterior
'q950 = q(lev=950)'
'q900 = q(lev=900)'
'dqdp=(q950-q900)/5000'

'q950prev = q(lev=950,T-1)'
'q900prev = q(lev=900,T-1)'
'dqdpprev=(q950prev-q900prev)/5000'


* Derivadas direccionales de u, v y omega

'dudx=cdiff(u,x)/dx'
'dudy=cdiff(u,y)/dy'
'dvdx=cdiff(v,x)/dx'
'dvdy=cdiff(v,y)/dy'

'dwdx=cdiff(w,x)/dx'
'dwdy=cdiff(w,y)/dy'

* Ya podemos empezar a calcular los términos de la ecuación frontogenesis

* Termino de Confluencia
'define f1= - (dqdx*dqdx*dudx)'
'define f2= - (dqdy*dqdy*dvdy)'
'define confluencia= (f1+f2) / gradq'

* Término de cortante
'define f3= - (dqdx*dqdy*dvdx)'
'define f4= - (dqdx*dqdy*dudy)'
'define cortante= (f3+f4) / gradq'

* Término de tilting (ojo, los reanálisis ERA-Interim usan la variable w=omega, para otros datos chequear)
'define f5= - (dqdx*dqdp*dwdx)'
'define f6= - (dqdy*dqdp*dwdy)'
'define tilting= (f5+f6) / gradq'

* Para el término "diabático": descompongo derivada total de q en derivada local más advección media entre el tiempo actual y el anterior (6hs)
* Derivada temporal local de q entre el tiempo actual y las 6hs anteriores
'dqdt = (q-qprevio)/(6*60*60)'

* Calculo las advecciones actual y de 6 hs antes y las promedio (la m de madvec es porque no tiene el- :))
'define madveccionya= (u*dqdx)+(v*dqdy)+(w*dqdp)'
'define madveccionprev= (u(T-1)*dqdxprev)+(v(T-1)*dqdyprev)+(w(T-1)*dqdpprev))'
'define madvecprom= (madveccionya+madveccionprev)/2'
'define calordiab= dqdt + madvecprom'
* Derivadas direccionales del "calor diabático"
'dcalordiabdx=cdiff(calordiab,x)/dx'
'dcalordiabdy=cdiff(calordiab,y)/dy'

* Al fin podemos calcular el término diabático
'define diabatico= (dqdx*dcalordiabdx+dqdy*dcalordiabdy) / gradq'


* CREO QUE TERMINÉ DE CALCULAR TODO LO NECESARIO
* LOS TERMINOS SON LO QUE LLAMÉ confluencia, cortante, tilting, diabático, para graficar por separado llamar esas variables.

*********************************************************************
'define frontogenesis= confluencia + cortante + tilting + diabatico'
*********************************************************************
*********************************************************************

* Ahora graficamos lo que queremos. Frontogénesis en sombreado [F]=(g/Kg)/(100km*24hs):

'set gxout shaded'
'set clevs  -25 -20 -15 -10 -5 0 5 10 15 20 25'
'set rbcols 29 27 26 25 24 23 0 0 52 53 54 55 57 59'
'set grads off'
'd smth9(maskout(frontogenesis*3600*24*1e5*1000,1500-z.2(t=1,z=1)/9.80665)))' 
'run cbarn'

* q en contornos negros cada 2 g/Kg
'set gxout contour'
'set cthick 6'
'set cint 2'
'd smth9(maskout(q*1000,1500-z.2(t=1,z=1)/9.80665)))' 

* En contornos rojos el gradiente de q en (g/Kg)/100km:
'set clevs 3 5 7 9 11'
'set ccolor 29'
'd smth9(maskout(gradq*1e8,1500-z.2(t=1,z=1)/9.80665)))' 

*BARBAS
'set gxout barb'
'set strmden 4'
'set ccolor 1'
'set cthick 3'
'set cstyle 1'
'define ukn=u*1.943'
'define vkn=v*1.943'
'd maskout((skip(ukn,3)),1500-z.2(t=1,z=1)/9.80665);skip(vkn,3)'

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

'draw title Funcion frontogenesis total (somb, (g/Kg)/(100km*dia)), q (negro, g/Kg)\ y gradiente de q (rojo, (g/Kg)/100km) en 925 hPa 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/frontogenesis_q_' anio'_' mes '_' dia'_' hora Z'_total.gif gif white x800 y600'

*Borramos la pantalla
'c'

**********************************************
* GRAFICAMOS AHORA CADA TÉRMINO POR SEPARADO *
**********************************************

* Confluencia: En sombreado [F_confl]=(g/Kg)/(100km*24hs):

'set gxout shaded'
'set clevs  -25 -20 -15 -10 -5 0 5 10 15 20 25'
'set rbcols 29 27 26 25 24 23 0 0 52 53 54 55 57 59'
'set grads off'
'd smth9(maskout(confluencia*3600*24*1e5*1000,1500-z.2(t=1,z=1)/9.80665)))' 
'run cbarn'

* q en contornos negros cada 2 g/Kg
'set gxout contour'
'set cthick 6'
'set cint 2'
'd smth9(maskout(q*1000,1500-z.2(t=1,z=1)/9.80665)))' 

* En contornos rojos el gradiente de q en (g/Kg)/100km:
'set clevs 3 5 7 9 11'
'set ccolor 29'
'd smth9(maskout(gradq*1e8,1500-z.2(t=1,z=1)/9.80665)))' 

*BARBAS
'set gxout barb'
'set strmden 4'
'set ccolor 1'
'set cthick 3'
'set cstyle 1'
'define ukn=u*1.943'
'define vkn=v*1.943'
'd maskout((skip(ukn,3)),1500-z.2(t=1,z=1)/9.80665);skip(vkn,3)'

*Grafico el titulo

'draw title Frontogenesis por confluencia (somb, (g/Kg)/(100km*dia)), q (negro, g/Kg)\ y gradiente de q (rojo, (g/Kg)/100km) en 925 hPa 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/frontogenesis_q_' anio'_' mes '_' dia'_' hora Z'_confluencia.gif gif white x800 y600'

*Borramos la pantalla
'c'

* Cortante: En sombreado [F_cort]=(g/Kg)/(100km*24hs):

'set gxout shaded'
'set clevs  -25 -20 -15 -10 -5 0 5 10 15 20 25'
'set rbcols 29 27 26 25 24 23 0 0 52 53 54 55 57 59'
'set grads off'
'd smth9(maskout(cortante*3600*24*1e5*1000,1500-z.2(t=1,z=1)/9.80665)))' 
'run cbarn'

* q en contornos negros cada 2 g/Kg
'set gxout contour'
'set cthick 6'
'set cint 2'
'd smth9(maskout(q*1000,1500-z.2(t=1,z=1)/9.80665)))' 

* En contornos rojos el gradiente de q en (g/Kg)/100km:
'set clevs 3 5 7 9 11'
'set ccolor 29'
'd smth9(maskout(gradq*1e8,1500-z.2(t=1,z=1)/9.80665)))' 

*BARBAS
'set gxout barb'
'set strmden 4'
'set ccolor 1'
'set cthick 3'
'set cstyle 1'
'define ukn=u*1.943'
'define vkn=v*1.943'
'd maskout((skip(ukn,3)),1500-z.2(t=1,z=1)/9.80665);skip(vkn,3)'

*Grafico el titulo

'draw title Frontogenesis por cortante (somb, (g/Kg)/(100km*dia)), q (negro, g/Kg)\ y gradiente de q (rojo, (g/Kg)/100km) en 925 hPa 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/frontogenesis_q_' anio'_' mes '_' dia'_' hora Z'_cortante.gif gif white x800 y600'

*Borramos la pantalla
'c'

* Tilting: En sombreado [F_tilt]=(g/Kg)/(100km*24hs):

'set gxout shaded'
'set clevs  -25 -20 -15 -10 -5 0 5 10 15 20 25'
'set rbcols 29 27 26 25 24 23 0 0 52 53 54 55 57 59'
'set grads off'
'd smth9(maskout(tilting*3600*24*1e5*1000,1500-z.2(t=1,z=1)/9.80665)))' 
'run cbarn'

* q en contornos negros cada 2 g/Kg
'set gxout contour'
'set cthick 6'
'set cint 2'
'd smth9(maskout(q*1000,1500-z.2(t=1,z=1)/9.80665)))' 

* En contornos rojos el gradiente de q en (g/Kg)/100km:
'set clevs 3 5 7 9 11'
'set ccolor 29'
'd smth9(maskout(gradq*1e8,1500-z.2(t=1,z=1)/9.80665)))' 

*BARBAS
'set gxout barb'
'set strmden 4'
'set ccolor 1'
'set cthick 3'
'set cstyle 1'
'define ukn=u*1.943'
'define vkn=v*1.943'
'd maskout((skip(ukn,3)),1500-z.2(t=1,z=1)/9.80665);skip(vkn,3)'

*Grafico el titulo

'draw title Frontogenesis por tilting (somb, (g/Kg)/(100km*dia)), q (negro, g/Kg)\ y gradiente de q (rojo, (g/Kg)/100km) en 925 hPa 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/frontogenesis_q_' anio'_' mes '_' dia'_' hora Z'_tilting.gif gif white x800 y600'

*Borramos la pantalla
'c'

* "Diabático": En sombreado [F_diab]=(g/Kg)/(100km*24hs):

'set gxout shaded'
'set clevs  -25 -20 -15 -10 -5 0 5 10 15 20 25'
'set rbcols 29 27 26 25 24 23 0 0 52 53 54 55 57 59'
'set grads off'
'd smth9(maskout(diabatico*3600*24*1e5*1000,1500-z.2(t=1,z=1)/9.80665)))' 
'run cbarn'

* q en contornos negros cada 2 g/Kg
'set gxout contour'
'set cthick 6'
'set cint 2'
'd smth9(maskout(q*1000,1500-z.2(t=1,z=1)/9.80665)))' 

* En contornos rojos el gradiente de q en (g/Kg)/100km:
'set clevs 3 5 7 9 11'
'set ccolor 29'
'd smth9(maskout(gradq*1e8,1500-z.2(t=1,z=1)/9.80665)))' 

*BARBAS
'set gxout barb'
'set strmden 4'
'set ccolor 1'
'set cthick 3'
'set cstyle 1'
'define ukn=u*1.943'
'define vkn=v*1.943'
'd maskout((skip(ukn,3)),1500-z.2(t=1,z=1)/9.80665);skip(vkn,3)'

*Grafico el titulo

'draw title Frontogenesis por "calor diab" (somb, (g/Kg)/(100km*dia)), q (negro, g/Kg)\ y gradiente de q (rojo, (g/Kg)/100km) en 925 hPa 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/frontogenesis_q_' anio'_' mes '_' dia'_' hora Z'_diabatico.gif gif white x800 y600'

*Borramos la pantalla
'c'

*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile





