'reinit'
'set display color white'
'reset'
'run /filer2/paola/jaecol'
'open ir_area2.ctl'


*INICIO
'set time 01z21feb2015'
'q dims'
line5=sublin(result,5)
tini=subwrd(line5,9)

*FIN
'set time 23z28feb2015'
'q dims'
line5=sublin(result,5)
tfin=subwrd(line5,9)

say tini tfin

while(tini<=tfin)
'reset'
'set t ' tini
'q dims'
line5=sublin(result,5)
fecha=subwrd(line5,6)
anio=substr(fecha,9,4)
hora=substr(fecha,1,2)
dia=substr(fecha,4,2)
mes=substr(fecha,6,3)
if ( mes = 'JAN' )
  mes2 = '01'
endif

if ( mes = 'FEB' )
  mes2 = '02'
endif

if ( mes = 'MAR' )
  mes2 = '03'
endif

if ( mes = 'APR' )
  mes2 = '04'
endif

if ( mes = 'MAY' )
  mes2 = '05'
endif

if ( mes = 'JUN' )
  mes2 = '06'
endif

if ( mes = 'JUL' )
  mes2 = '07'
endif

if ( mes = 'AUG' )
  mes2 = '08'
endif

if ( mes = 'SEP' )
  mes2 = '09'
endif

if ( mes = 'OCT' )
  mes2 = '10'
endif

if ( mes = 'NOV' )
  mes2 = '11'
endif

if ( mes = 'DEC' )
  mes2 = '12'
endif

'!gunzip /filer2/bases/IR/' anio'/ir' anio mes2 dia hora '.dat.gz'

say anio mes2 dia hora 
'reset'
'set t ' tini
'set lat -38 -22'
'set lon -72 -56'
'set grads off'
'set gxout shaded'
'set mpdset /home/salio/sa'
'set map 1'
'set rbcols 59   56   53     29   27   25    23   21     49   47    45  43     41  39    37  35    33    72   73    74   75 76 77 78 79 1 '
'set clevs   -85  -80 -75 -70   -65  -60    -55 -50    -45  -40   -35  -30   -25 -20   -15 -10   -5   0     5   10    15   20  25 30 35 40'
'd ch4+75-273'
'run /filer2/paola/cbarn'
'draw title 'anio' 'mes2' 'dia' 'hora':00Z'
'printim RELAMPAGO/' anio mes2 '/' anio mes2 dia hora '00.png   white'


say anio mes2 dia hora
'reset'
'set t ' tini+1
'set lat -38 -22'
'set lon -72 -56'
'set grads off'
'set gxout shaded'
'set mpdset /home/salio/sa'
'set map 1'
'set rbcols 59   56   53     29   27   25    23   21     49   47    45  43     41  39    37  35    33    72   73    74   75 76 77 78 79 1 '
'set clevs   -85  -80 -75 -70   -65  -60    -55 -50    -45  -40   -35  -30   -25 -20   -15 -10   -5   0     5   10    15   20  25 30 35 40'
'd ch4+75-273'
'run /filer2/paola/cbarn'
'draw title 'anio' 'mes2' 'dia' 'hora':30Z'
'printim RELAMPAGO/' anio mes2 '/' anio mes2 dia hora '30.png   white'


'!gzip /filer2/bases/IR/' anio'/ir' anio mes2 dia hora '.dat'


tini=tini+2
endwhile

'quit'


