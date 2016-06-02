function dyanmic(args)

'q dims'
xline=sublin(result,2)
yline=sublin(result,3)
zline=sublin(result,4)
tline=sublin(result,5)

lons=subwrd(xline,6)' 'subwrd(xline,8)
lats=subwrd(yline,6)' 'subwrd(yline,8)
if(subwrd(zline,7)='Z');levs=subwrd(zline,6);else;levs=subwrd(zline,6)' 'subwrd(zline,8);endif
time=subwrd(tline,6)

check=1
a=1
v=1
while(check=1)
  line=subwrd(args,a)
  if(line='');break;endif

  if(line='-help')
    help()
    return
  endif

  if(line='-var');hgt=subwrd(args,a+1);tmp=subwrd(args,a+2);uwnd=subwrd(args,a+3);vwnd=subwrd(args,a+4);v=0;endif

  a=a+1
endwhile

  if(v=1)
    say ''
    say 'You have Chosen the Default variables for Height, Temperature, and Wind'
    say 'To specify your variables, type "-var" then your variable names in the order of Height, Temperature, Uwind, Vwind'
    say ''
    'hgt=hgtprs'
    'tmp=tmpprs'
    'vwnd=vgrdprs'
    'uwnd=ugrdprs'
  endif

  if(v!=1)
    say ''
    say 'You have Chosen to specify the variables for Height, Temperature, and Wind'
    say 'You have specified the variables as:'
    say 'Height: 'hgt
    say 'Temp:   'tmp
    say 'U-wind: 'uwnd
    say 'V-wind: 'vwnd
    'hgt='hgt
    'tmp='tmp
    'vwnd='vwnd
    'uwnd='uwnd
  endif
say 'Please wait while I calculate your variables'

'pi=3.14159'
'dtr=pi/180'
'a=6.37122e6'
'omega=7.2921e-5'
'g=9.8'
'R=287'

'define f=2*omega*sin(lat*dtr)'
'define p=lev*100'

say '...'

'dy=cdiff(lat,y)*dtr*a'
'dx=cdiff(lon,x)*dtr*a*cos(lat*dtr)'

'dhgtx=cdiff(hgt,x)'
'dhgty=cdiff(hgt,y)'

'define ug=-1*(g/f)*(dhgty/dy)'
'define vg=(g/f)*(dhgtx/dx)'

'define ua=uwnd-ug'
'define va=vwnd-vg'

say '....'

'dugx=cdiff(ug,x)'
'dugy=cdiff(ug,y)'
'dvgx=cdiff(vg,x)'
'dvgy=cdiff(vg,y)'

'dtdx=cdiff(tmp,x)/dx'
'dtdy=cdiff(tmp,y)/dy'

say '.....'

'define Q1=-1*(R/p)*(dugx/dx*dtdx + dvgx/dx*dtdy)'
'define Q2=-1*(R/p)*(dugy/dy*dtdx + dvgy/dy*dtdy)'
'define divq=hdivg(Q1,Q2)'
'define tadv=(-uwnd*dtdx-vwnd*dtdy)'

say '......'

'divg=hdivg(uwnd,vwnd)'
'vort=hcurl(uwnd,vwnd)'

'dvdx=cdiff(vort,x)/dx'
'dvdy=cdiff(vort,y)/dy'

'define vadv=(-uwnd*dvdx-vwnd*dvdy)'

say '.......'

'def1=cdiff(uwnd,x)/dx-cdiff(vwnd,y)/dy-vwnd*tan(dtr*lat)/a'
'def2=cdiff(vwnd,x)/dx+cdiff(uwnd,y)/dy+uwnd*tan(dtr*lat)/a'

'f1=-(dtdx*(divg+def1)+dtdy*(vort+def2))/2'
'f2=(dtdx*(vort-def2)-dtdy*(divg-def1))/2'


'fn=(dtdx*f1+dtdy*f2)/mag(dtdx,dtdy)'
'fs=(dtdx*f2-dtdy*f1)/mag(dtdx,dtdy)'

'fnx=-1*((dtdx*f1)/mag(dtdx,dtdy))*10e9'
'fny=-1*((dtdy*f2)/mag(dtdx,dtdy))*10e9'

say '........'

'define F=(fn+fs)*10e9'

say 'DONE!'
say ''

say 'The following variables have been defined for the dimensions:'
say 'Longitude: 'lons
say 'Latitude: 'lats
say 'Pressure Levels: 'levs
say 'Time: 'time
say '--------------------------------------------------------------------'
say 'Defined Variables: Variable              Name          Units        '                 
say '                  -Geostrophic Wind :    ug,vg         [m/s]        '
say '                  -Ageostrophic Wind:    ua,va         [m/s]        '
say '                  -Q-Vectors        :    Q1,Q1         [pa/m2/s]    '
say '                  -Temp Advection   :    tadv          [K/s]        '  
say '                  -Vort Advection   :    vadv          [-]          '
say '                  -Frontogenesis    :    F             [K/m/s]x10^9 '
say '                  -Fn Vector        :    fnx,fny       [K/m/s]x10^9 '
say '                  -Deformation      :    def1,def2     [m]          '
say '--------------------------------------------------------------------'
say 'To plot a variable simply type "d " then pick a Name from the list  '


return




function help()
  say '---------------------------------------------------'
  say '                 Dynamic v2.0                    '
  say '---------------------------------------------------'
  say 'Usage:'
  say 'Calculates advanced dynamic variables:'
  say '           -Qvectors, Frontogenesis, advection, Geostrophic winds, etc.'
  say '           -ALL variables must have MKS units, convert before running the script'
  say ''
  say 'Required: No required arguments'
  say '---------------------------------------------------'
  say ''
  say 'Optional: -help  - Pulls up Help Page'
  say '          -var   - Allows you to specify variable names'
  say '                 - Defaults: hgt=hgtprs, tmp=tmpprs, uwnd=ugrdprs, vwnd=vgrdprs'
  say ''
  say '---------------------------------------------------'
  say ''
  say 'Example: dynamic -var height tempk u v'
  say '         calculates dynamic variables using the variables, height, tempk, u, v'
  say 
  say 'Version 2.0: Orginially Developed Sept 2012'
  say '            -Help page and arguments added May 2013 as part of v2.0'
 
**
***