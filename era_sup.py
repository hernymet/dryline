#!/usr/bin/env python
from ecmwfapi import ECMWFDataServer
server = ECMWFDataServer()
server.retrieve({
    "class": "ei",
    "dataset": "interim",
    "date": "2013-12-01/to/2013-12-31",
    "expver": "1",
    "grid": "0.5/0.5",
    "levtype": "sfc",
    "param": "34.128/55.162/134.128/136.128/137.128/151.128/164.128/165.128/166.128/167.128/168.128/206.128",
    "step": "0",
    "stream": "oper",
    "time": "00:00:00/06:00:00/12:00:00/18:00:00",
    "type": "an",
    "target": "CHANGEME",
})
