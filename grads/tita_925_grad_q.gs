*********************************************************************
* Calcula temperatura potencial en 850hPa y la diferencia con titae *
*********************************************************************

'reinit' 
'set display color white'
'reset'
'run jaecol'
'set mpdset sa'

* Cambiar fecha en el nombre de archivo de los datos
*****************************************************
*****************************************************
anio='2013'
mes='DEC'
mes_num='12'
dia='01'
hora='00'
*nombre_archivo='ERA-Int_pl_' anio mes_num '.nc'
* Ingresar la cantidad total de tiempos del archivo (VER CANTIDAD DE GRÁFICOS MATLAB)
cant_tiempos=124
*****************************************************
*****************************************************

carpeta_salida='/home/hernymet/Documents/figuras_grads/tita_925_grad_q/'
'sdfopen /home/hernymet/Documents/reanalisis/ERA-Int_pl_20131201.nc'
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

*GRADIENTE DE HUMEDAD ESPECÍFICA EN 925

* Defino constantes y operadores
'pi=3.14159'
'dtr=pi/180'
'a=6.37122e6'
'omega=7.2921e-5'
'g=9.8'
'R=287'
'define f=2*omega*sin(lat*dtr)'
'dy=cdiff(lat,y)*dtr*a'
'dx=cdiff(lon,x)*dtr*a*cos(lat*dtr)'
'dqdx=cdiff(q,x)/dx'
'dqdy=cdiff(q,y)/dy'

'define gq=sqrt((dqdx*dqdx)+(dqdy*dqdy))'

'set clevs 3 4 5 6 7 8 9'
'set ccols 0 23 25 26 27 28 29 30' 
'set gxout shaded'
'set grads off'
'd maskout(gq*1e8,1500-z.2(t=1,z=1)/9.80665)'
'run cbarn'


* TITAE EN 925
'set lev 850'
'define et=(-2937.4/(t))-(4.9283*log10(t))+22.5518'
'define es=pow(10,et)*10'
'define e=es*0.01*r'
*'define q=0.622*e/(lev-e)'
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

* TITAE
'set gxout contour'
'set ccolor 1'
'set cint 5'
'set cthick 6'
'set clab masked'
*'set clskip 2'

*'d maskout(smth9(te),1500-z.2(t=1,z=1)/9.80665)'

* TITA A SECAS
'tita=t*pow((1000/lev),287/1004)'
'set ccolor 27'
'set cint 2'
'set cthick 6'
'set clab masked'
*'set clskip 2'
'd maskout(smth9(tita),1500-z.2(t=1,z=1)/9.80665)'



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

'draw title Tita (cont, rojo), Viento (kts) y\ grad. de q (somb, (g/kg)/100km)  en 925 hPa, 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/tita_925_grad_q_' anio'_' mes '_' dia'_' hora Z'.gif gif white x800 y600'

*Borramos la pantalla
'c'
*Avanzamos el contador para pasar al tiempo siguiente.
itime4=subwrd(line2,9)
tiempo=itime4 + 1
endwhile






















