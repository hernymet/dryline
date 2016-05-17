#!/usr/bin/env python
from ecmwfapi import ECMWFDataServer
import calendar

server = ECMWFDataServer()

for year in range(2016, 2017):
 print 'YEAR ',year
 for month in range(1,2):
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
    'levtype'  : "pt",
    'levelist' : "265/275/285/300/315/330/350/370/395/430/475/530/600/700/850",
    'type'     : "an",
    'class'    : "ei",
    'grid'     : "1/1",
    'param'    : "53.128/54.128/60.128/131.128/132.128/133.128/138.128/155.128/203.128",
    'target'   : "/home/hernymet/Documents/reanalisis/ERA-Int_isen_%s.grib2"%(bdate),
    'area'     : "-10/-100/-65/-30",
    'format'   : 'grib2'
    }) 

