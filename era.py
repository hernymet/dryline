#!/usr/bin/env python
from ecmwfapi import ECMWFDataServer
import calendar

server = ECMWFDataServer()

for year in range(2015, 2016):
 print 'YEAR ',year
 for month in range(01,02):
 lastday1=calendar.monthrange(year,month)
 lastday=lastday1[1]
 bdate="%s%02d01"%(year,month)
 edate="%s%02d%s"%(year,month,lastday)
  print "######### ERA-interim  #########"
  print 'get data from ', bdate,' to ',edate,' (YYYYMMDD)'
  print "################################"
  server.retrieve({
    'dataset'  : "interim",
    'date'     : "%s/to/%s"%(bdate,edate),
 #   'date'     : "20091126/to/20091128",
    'time'     : "00/06/12/18",
    'step'     : "0",
    'stream'   : "oper",
    'levtype'  : "pl",
    'levelist' : "100/125/150/175/200/225/250/300/350/400/450/500/550/600/650/700/750/775/800/825/850/875/900/925/950/975/1000",
    'type'     : "an",
    'class'    : "ei",
    'grid'     : "0.5/0.5",
    'param'    : "60.128/129.128/130.128/131.128/132.128/133.128/135.128/138.128/155.128/157.128/203.128/246.128/247.128/248.128",
    'target'   : "/home/hernymet/Documents/reanalisis/ERA-Int_pl_%s.nc"%(bdate),
    'area'     : "-10/-100/-55/-30",
    'format'   : 'netcdf'
    }) 

