#!/usr/bin/env python3

# -*- coding: utf-8 -*-

"""
Create bode diagrams
"""

import sys, json, os
from scipy import signal
import matplotlib.pyplot as plt

DP = "plots/"

def read_in():
  lines = sys.stdin.readlines()
  return json.loads(lines[0])

def what_name(sid):
  n = 1
  name = lambda i,n: DP+f'{i}/fig{n}.png'
  while os.path.exists(name(sid,n)):
    n+=1
  return name(sid,n)
def main():
  try:
    data = read_in()
    i = data['id']
    n = data["n"]
    d = data["d"]
    if not os.path.exists(DP):
      os.makedirs(DP)
    if not os.path.exists(DP+i):
      os.makedirs(DP+i)
    s1 = signal.lti(n,d)
    w,m,p = signal.bode(s1,1000)
    f, (ax1, ax2) = plt.subplots(2,1,sharex=True)
    ax1.grid()
    ax2.grid()
    ax1.set_title("Gain")
    ax2.set_title("Phase")
    ax2.set_xlabel("log(w)")
    ax1.set_ylabel("Gain")
    ax2.set_ylabel("Phase")
    
    ax1.semilogx(w,m)
    ax2.semilogx(w,p)
    
    f.suptitle("Bode plot")
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