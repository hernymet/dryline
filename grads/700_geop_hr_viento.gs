* Grafica geopotencial, humedad relativa y viento en 700 hPa
function main(args)
ciclo=subwrd(args,1)
*Directorio donde estan los datos.
datapath=subwrd(args,2)
*Directorio donde se generan los gif
gifpath=subwrd(args,3)
*Directorio donde estan los demas scripts que usa este script.
gspath=subwrd(args,4)
say ciclo
say datapath
say gifpath
say gspath

'reset'
'open 'datapath'/gfs'ciclo'.ctl'


'run jaecol'
'set mpdset hires'
'set mpdset sa'
'set map 75 1 6'
'set lat -60 -20'
'set lon -85 -45'


'set parea 0.4 8 0.3 11'


count=1
while (count<=25)

time=count
count=count+1
h=time*6-6
'set t 'time
'set grads off'
'set lev 700'

'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
itit=substr(itime1,1,12)
dia=subwrd(line1,6)

* HUMEDAD RELATIVA EN 700
'set gxout shaded'
'set clevs 50 70 90'
'set rbcols 0 34 36 38'
'd RHprs'
'run cbarn'

* ALTURA GEOPOTENCIAL
'set grads off'
'set gxout contour'
'set cint 40'
'set ccolor 59'
'set cthick 13'
'set cstyle 1'
'set clab masked'
'set clopts -1 6 0.10'
'd maskout(smth9(HGTprs),3000-HGTsfc)'

* BARBAS DE VIENTO
'set gxout barb'
'set ccolor 1'
'set cthick 6'
'define u=UGRDprs*1.943'
'define v=VGRDprs*1.943'
'd skip(u,6);skip(v,6)'


'set strsiz 0.07'
if(h<10)
'draw title Altura geop y humedad relativa en 700hPa\ Prono a 'h' horas - Verificando a 'dia ' 'itit''
'printim  'gifpath'/700_hr/GFS_700_hr0'h'AR.gif gif x720 y960 white'
'c'
endif

if(h>10)
'draw title Altura geop y humedad relativa en 700hPa\Prono a 'h' horas - Verificando a 'dia ' 'itit''
'printim  'gifpath'/700_hr/GFS_700_hr'h'AR.gif gif x720 y960 white'
'c'
endif


endwhile

'quit'
