#!/usr/bin/env python3

# -*- coding: utf-8 -*-

import sys,json,os
from scipy import signal
import matplotlib.pyplot as plt

DP = "plots/"

def read_in():
  lines = sys.stdin.readlines()
  return json.loads(lines[0])

def what_name(sid):
  name = lambda i,n: DP+f'{i}/nyquist{n}.png'
  n = 1
  while os.path.exists(name(sid,n)):
    n+=1
  return name(sid,n)

def main():
  try:
    data = read_in()
    i,n,d = data["id"],data["n"],data["d"]
    if not os.path.exists(DP+i):
      os.makedirs(DP+i)
    s1 = signal.lti(n,d)
    w,H = s1.freqresp()
    f, ax1 = plt.subplots()
    f.suptitle("Nyquist plot")
    ax1.grid()
    ax1.set_xlabel("Real(G)")
    ax1.set_ylabel("Imag(G)")
    ax1.plot(H.real,H.imag,"b")
    ax1.plot(H.real,-H.imag,"--r")
    na = what_name(i)
    f.savefig(na,dpi=300)
    print(na.split("/")[-1],end="")
    sys.exit()
  except Exception as e:
    exc_type, exc_obj, exc_tb = sys.exc_info()
    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
    print(exc_type, fname, exc_tb.tb_lineno)
    
if __name__=="__main__":
  main()