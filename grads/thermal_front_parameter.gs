***************************
* Thermal front parameter *
***************************

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

carpeta_salida='/home/hernymet/Documents/figuras_grads/tfp/'
'sdfopen /home/hernymet/Documents/reanalisis/ERA-Int_pl_20160101.nc'
'sdfopen /home/hernymet/Documents/reanalisis/surface_geop_05.nc'

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

*ALGUNAS CONSTANTES DEL SCRIPT 'DYNAMIC.GS'

'pi=3.14159'
'dtr=pi/180'
'a=6.37122e6'
'omega=7.2921e-5'
'g=9.8'
'R=287'
'define f=2*omega*sin(lat*dtr)'
'define p=lev*100'
'define cp = 1004'

'define tcos=cos(lat*dtr)'
'define thick=z(lev=850)-z(lev=1000)'
'set gxout contour'
'define tave1=g*thick/(log(1000/850)*R)'


*Correction for moisture (specific humidity)
*Use Equivalent temperature definition

'define q1=75*(q(lev=1000)+q(lev=925))/2'
'define q2=75*(q(lev=925)+q(lev=850))/2'
'define qave=(q1+q2)/150'
'define tave=tave1+(2.5e+6/cp)*qave'
'define eqth=tave*log(1000/850)*R/g'

'set gxout contour'
'set clevs 0 1 1.5 2 2.5 3 3.5 4 4.5 5 5.5 6 7 8 9 10'
'set ccols 4 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2'
'set cthick 8'
*set ccolor 2
'set cint 1'

* Horizontal increments
'define dTy = cdiff(tave,y)'
'define dTx = cdiff(tave,x)'
'define dy = cdiff(lat,y)*dtr*a'
'define dx = cdiff(lon,x)*dtr*a*tcos'

* Temperature Gradient
'define Txgrad = (dTx/dx)'
'define Tygrad = (dTy/dy)'

* Magnitude Temperature Gradient
'define Tmagrad = mag(Txgrad, Tygrad)'

* Inflection Points
'define d2tx = cdiff(tmagrad,x)'
'define d2ty = cdiff(tmagrad,y)'
'define Txmagrad = -1*(d2tx/dx)'
'define Tymagrad = -1*(d2ty/dy)'

* Direction Projection
'define Txdir = (Txgrad/Tmagrad)'
'define Tydir = (Tygrad/Tmagrad)'


'define TFP = ((Txmagrad*Txdir)+(Tymagrad*Tydir))'
'd TFP*1e+11'


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

'draw title TFP 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/tfp_' anio'_' mes '_' dia'_' hora Z'.gif gif white x800 y600'

*Borramos la pantalla
'c'
*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile
















