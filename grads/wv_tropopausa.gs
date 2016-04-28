***************************************************************
* Grafica la imagen de satélite y la presión de la tropopausa *
***************************************************************
'reinit' 
'set display color white'
'reset'

'set mpdset hires'

* Cambiar fecha en el nombre de archivo de los datos
*****************************************************
*****************************************************
fecha_carpeta='1999-03-06_a_1999-03-09'

anio='1999'
mes='MAR'
mes_num='03'
dia='04'
hora='00'
nombre_archivo='ERA-Int_pl_' anio mes_num '.nc'
* Ingresar la cantidad total de tiempos del archivo (VER CANTIDAD DE GRÁFICOS MATLAB)
cant_tiempos=1

tiempo=hora 'Z' dia mes anio
*****************************************************
*****************************************************

carpeta_salida='/media/Google_Drive/Tesis/casos_estudio/' fecha_carpeta '/wv_tropopausa_16'
imagen_sat='/media/windows/datos/sat_nuevas/GOES08_BAND_03_19990303_234514.nc'


'sdfopen ' imagen_sat
'run escala_grises.gs'

*original
'set lat -65 -15'
'set lon -120 -40'
*zoom	
*'set lat -50 -25'
*'set lon -82 -60'
*'set lon 240 315'
'set mpdset sa'

*******************************
* GRAFICA LA IMAGEN SATELITAL *
*******************************
'ch3=calibrateddata-273'
'c'
'set time ' tiempo


'set gxout shaded'
'set clevs -68 -67 -66 -65 -64 -63 -62 -61 -60 -59 -58 -57 -56 -55 -54 -53 -52 -51 -50 -49 -48 -47 -46 -45 -44 -43 -42 -41 -40 -39 -38 -37 -36 -35 -34 -33 -32 -31 -30 -29 -28 -27 -26 -25 -24 -23 -22 -21 -20 -19 -18'
'set rbcols 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67'

'set grads off'
'd ch3'
'close 1'

**********************************************
* Pasamos a graficar variables del reanálisis*
**********************************************
'sdfopen /media/windows/datos/' anio  '/' nombre_archivo

*original
'set lat -65 -15'
'set lon 240 320'
*zoom
*'set lat -50 -25'
*'set lon 278 300'
'set time ' tiempo
'run jaecol.gs'

*Graficamos la tropopausa


'set rgb 16 212 0 0'
'set rgb 17 255 84 0'
'set rgb 18 255 171 0'
'set rgb 19 255 255 0'
'set rgb 20 171	255 84'
'set rgb 21 84	255 171'
'set rgb 22 0 171 255'
'set rgb 23 0 84 255'
'set rgb 24 0 0 255'
'set rgb 25 0 0 171'

'set lev 650'
'set gxout contour'
'set ccolor 16'
'set clevs -1.6'
'set cstyle 1'
'set cthick 6'
'set clab masked'
'set clab 650'
'd maskout(pv*1e6,1-q*1e3)'

'set lev 600'
'set ccolor 17'
'set clevs -1.6'
'set cstyle 1'
'set cthick 6'
'set clab masked'
'set clab 600'
'd maskout(pv*1e6,1-q*1e3)'

'set lev 550'
'set ccolor 18'
'set clevs -1.6'
'set cstyle 1'
'set cthick 6'
'set clab masked'
'set clab 550'
'd maskout(pv*1e6,1-q*1e3)'

'set lev 500'
'set ccolor 19'
'set clevs -1.6'
'set cstyle 1'
'set cthick 6'
'set clab masked'
'set clab 500'
'd maskout(pv*1e6,1-q*1e3)'

'set lev 450'
'set ccolor 20'
'set clevs -1.6'
'set cstyle 1'
'set cthick 6'
'set clab masked'
'set clab 450'
'd maskout(pv*1e6,1-q*1e3)'

'set lev 400'
'set ccolor 21'
'set clevs -1.6'
'set cstyle 1'
'set cthick 6'
'set clab masked'
'set clab 400'
'd maskout(pv*1e6,1-q*1e3)'

'set lev 350'
'set ccolor 22'
'set clevs -1.6'
'set cstyle 1'
'set cthick 6'
'set clab masked'
'set clab 350'
'd maskout(pv*1e6,1-q*1e3)'

'set lev 300'
'set ccolor 23'
'set clevs -1.6'
'set cstyle 1'
'set cthick 6'
'set clab masked'
'set clab 300'
'd maskout(pv*1e6,1-q*1e3)'

'set lev 250'
'set ccolor 24'
'set clevs -1.6'
'set cstyle 1'
'set cthick 6'
'set clab masked'
'set clab 250'
'd maskout(pv*1e6,1-q*1e3)'

*BARBAS
'set lev 300'
'set gxout barb'
'set strmden 4'
'set ccolor 5'
'set cthick 3'
'set cstyle 1'
'define ukn=u*1.943'
'define vkn=v*1.943'
*'d skip(ukn,6);skip(vkn,6)'


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

'draw title Presion de la Tropopausa Dinamica (-1.6PVU) \ Imagen satelital WV GOES 8 'itime1

*Guardamos la figura

'printim 'carpeta_salida'/zooom_wv_tropo_' anio'_' mes '_' dia'_' hora Z'.gif gif white x800 y600'




