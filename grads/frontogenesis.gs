*************************************************************************************************************
* Intento de graficar la función frontogénesis bidimensional aplicada a la temperatura potencial en 925 hPa,*
* Ecuación 13.1 del Carlson										    *
* No es elegante pero funciona, no tocar nada o revisar todo el código	    				    *
* Si no te gusta programalo vos										    *
*************************************************************************************************************

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

carpeta_salida='/home/hernymet/Documents/figuras_grads/frontogenesis/'
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

* Calculo la temperatura potencial [K] para el tiempo actual y el anterior
'tita = t*pow((1000/lev),287/1004)'
'titaprevio = t(T-1)*pow((1000/lev),287/1004)'

* Sus derivadas en la dirección x e y, y la magnitud del gradiente:
* Para el tiempo actual y el anterior
'dtitadx=cdiff(tita,x)/dx'
'dtitady=cdiff(tita,y)/dy'
'gradtita=mag(dtitadx,dtitady)'

'dtitadxprev=cdiff(titaprevio,x)/dx'
'dtitadyprev=cdiff(titaprevio,y)/dy'


* Derivada vertical de tita entre 950 y en 900 hPa 
* Para el tiempo actual y el anterior
'tita950 = t(lev=950)*pow((1000/950),287/1004)'
'tita900 = t(lev=900)*pow((1000/900),287/1004)'
'dtitadp=(tita950-tita900)/5000'

'tita950prev = t(lev=950,T-1)*pow((1000/950),287/1004)'
'tita900prev = t(lev=900,T-1)*pow((1000/900),287/1004)'
'dtitadpprev=(tita950prev-tita900prev)/5000'


* Derivadas direccionales de u, v y omega

'dudx=cdiff(u,x)/dx'
'dudy=cdiff(u,y)/dy'
'dvdx=cdiff(v,x)/dx'
'dvdy=cdiff(v,y)/dy'

'dwdx=cdiff(w,x)/dx'
'dwdy=cdiff(w,y)/dy'

* Ya podemos empezar a calcular los términos de la ecuación frontogenesis

* Termino de Confluencia
'define f1= - (dtitadx*dtitadx*dudx)'
'define f2= - (dtitady*dtitady*dvdy)'
'define confluencia= (f1+f2) / gradtita'

* Término de cortante
'define f3= - (dtitadx*dtitady*dvdx)'
'define f4= - (dtitadx*dtitady*dudy)'
'define cortante= (f3+f4) / gradtita'

* Término de tilting (ojo, los reanálisis ERA-Interim usan la variable w=omega, para otros datos chequear)
'define f5= - (dtitadx*dtitadp*dwdx)'
'define f6= - (dtitady*dtitadp*dwdy)'
'define tilting= (f5+f6) / gradtita'

* Para el término diabático: descompongo derivada total de tita en derivada local más advección media entre el tiempo actual y el anterior (6hs)
* Derivada temporal local de tita entre el tiempo actual y las 6hs anteriores
'dtitadt = (tita-titaprevio)/(6*60*60)'

* Calculo las advecciones actual y de 6 hs antes y las promedio (la m de madvec es porque no tiene el- :))
'define madveccionya= (u*dtitadx)+(v*dtitady)+(w*dtitadp)'
'define madveccionprev= (u(T-1)*dtitadxprev)+(v(T-1)*dtitadyprev)+(w(T-1)*dtitadpprev))'
'define madvecprom= (madveccionya+madveccionprev)/2'
'define calordiab= dtitadt + madvecprom'
* Derivadas direccionales del calor diabático
'dcalordiabdx=cdiff(calordiab,x)/dx'
'dcalordiabdy=cdiff(calordiab,y)/dy'

* Al fin podemos calcular el término diabático
'define diabatico= (dtitadx*dcalordiabdx+dtitady*dcalordiabdy) / gradtita'


* CREO QUE TERMINÉ DE CALCULAR TODO LO NECESARIO
* LOS TERMINOS SON LO QUE LLAMÉ confluencia, cortante, tilting, diabático, para graficar por separado llamar esas variables.

*********************************************************************
'define frontogenesis= confluencia + cortante + tilting + diabatico'
*********************************************************************
*********************************************************************

* Ahora graficamos lo que queremos. Frontogénesis en sombreado [F]=K/(100km*24hs):

'set gxout shaded'
'set clevs   -25 -20 -15 -10 0 10 15 20 25'
'set rbcols 49 48 47 46 45  0 0 22 23 24 25 26'
'set grads off'
'd smth9(maskout(frontogenesis*3600*24*1e5,1500-z.2(t=1,z=1)/9.80665)))' 
'run cbarn'

* Tita en contornos negros cada 4K
'set gxout contour'
'set cthick 6'
'set cint 4'
'd smth9(maskout(tita,1500-z.2(t=1,z=1)/9.80665)))' 

* En contornos rojos el gradiente de tita en K/100km:
'set clevs 4 6 8 10'
'set ccolor 29'
'd smth9(maskout(gradtita*1e5,1500-z.2(t=1,z=1)/9.80665)))' 

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

'draw title Funcion frontogenesis total (somb, K/(100km*dia)), tita (negro, K)\ y gradiente de tita (rojo, K/100km) en 925 hPa 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/frontogenesis_T_' anio'_' mes '_' dia'_' hora Z'_total.gif gif white x800 y600'

*Borramos la pantalla
'c'

**********************************************
* GRAFICAMOS AHORA CADA TÉRMINO POR SEPARADO *
**********************************************

* Confluencia: En sombreado [F_confl]=K/(100km*24hs):

'set gxout shaded'
'set clevs   -25 -20 -15 -10 0 10 15 20 25'
'set rbcols 49 48 47 46 45  0 0 22 23 24 25 26'
'set grads off'
'd smth9(maskout(confluencia*3600*24*1e5,1500-z.2(t=1,z=1)/9.80665)))' 
'run cbarn'

* Tita en contornos negros cada 4K
'set gxout contour'
'set cthick 6'
'set cint 4'
'd smth9(maskout(tita,1500-z.2(t=1,z=1)/9.80665)))' 

* En contornos rojos el gradiente de tita en K/100km:
'set clevs 4 6 8 10'
'set ccolor 29'
'd smth9(maskout(gradtita*1e5,1500-z.2(t=1,z=1)/9.80665)))' 

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
'draw title Frontogenesis por confluencia (somb, K/(100km*dia)), tita (negro, K)\ y gradiente de tita (rojo, K/100km) en 925 hPa 'itime1
*Guardamos la figura

'printim 'carpeta_salida'/frontogenesis_T_' anio'_' mes '_' dia'_' hora Z'_confluencia.gif gif white x800 y600'

*Borramos la pantalla
'c'

* Cortante: En sombreado [F_cort]=K/(100km*24hs):

'set gxout shaded'
'set clevs   -25 -20 -15 -10 0 10 15 20 25'
'set rbcols 49 48 47 46 45  0 0 22 23 24 25 26'
'set grads off'
'd smth9(maskout(cortante*3600*24*1e5,1500-z.2(t=1,z=1)/9.80665)))' 
'run cbarn'

* Tita en contornos negros cada 4K
'set gxout contour'
'set cthick 6'
'set cint 4'
'd smth9(maskout(tita,1500-z.2(t=1,z=1)/9.80665)))' 

* En contornos rojos el gradiente de tita en K/100km:
'set clevs 4 6 8 10'
'set ccolor 29'
'd smth9(maskout(gradtita*1e5,1500-z.2(t=1,z=1)/9.80665)))' 

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
'draw title Frontogenesis por cortante (somb, K/(100km*dia)), tita (negro, K)\ y gradiente de tita (rojo, K/100km) en 925 hPa 'itime1
*Guardamos la figura

'printim 'carpeta_salida'/frontogenesis_T_' anio'_' mes '_' dia'_' hora Z'_cortante.gif gif white x800 y600'

*Borramos la pantalla
'c'

* Tilting: En sombreado [F_tilt]=K/(100km*24hs):

'set gxout shaded'
'set clevs   -25 -20 -15 -10 0 10 15 20 25'
'set rbcols 49 48 47 46 45  0 0 22 23 24 25 26'
'set grads off'
'd smth9(maskout(tilting*3600*24*1e5,1500-z.2(t=1,z=1)/9.80665)))' 
'run cbarn'

* Tita en contornos negros cada 4K
'set gxout contour'
'set cthick 6'
'set cint 4'
'd smth9(maskout(tita,1500-z.2(t=1,z=1)/9.80665)))' 

* En contornos rojos el gradiente de tita en K/100km:
'set clevs 4 6 8 10'
'set ccolor 29'
'd smth9(maskout(gradtita*1e5,1500-z.2(t=1,z=1)/9.80665)))' 

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
'draw title Frontogenesis por tilting (somb, K/(100km*dia)), tita (negro, K)\ y gradiente de tita (rojo, K/100km) en 925 hPa 'itime1
*Guardamos la figura

'printim 'carpeta_salida'/frontogenesis_T_' anio'_' mes '_' dia'_' hora Z'_tilting.gif gif white x800 y600'

*Borramos la pantalla
'c'


* Diabático: En sombreado [F_diab]=K/(100km*24hs):

'set gxout shaded'
'set clevs   -25 -20 -15 -10 0 10 15 20 25'
'set rbcols 49 48 47 46 45  0 0 22 23 24 25 26'
'set grads off'
'd smth9(maskout(diabatico*3600*24*1e5,1500-z.2(t=1,z=1)/9.80665)))' 
'run cbarn'

* Tita en contornos negros cada 4K
'set gxout contour'
'set cthick 6'
'set cint 4'
'd smth9(maskout(tita,1500-z.2(t=1,z=1)/9.80665)))' 

* En contornos rojos el gradiente de tita en K/100km:
'set clevs 4 6 8 10'
'set ccolor 29'
'd smth9(maskout(gradtita*1e5,1500-z.2(t=1,z=1)/9.80665)))' 

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
'draw title Frontogenesis por calor diab. (somb, K/(100km*dia)), tita (negro, K)\ y gradiente de tita (rojo, K/100km) en 925 hPa 'itime1
*Guardamos la figura

'printim 'carpeta_salida'/frontogenesis_T_' anio'_' mes '_' dia'_' hora Z'_diabatico.gif gif white x800 y600'

*Borramos la pantalla
'c'


*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile

