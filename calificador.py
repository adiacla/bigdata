# -*- coding: utf-8 -*-
"""
Created on Sun Jan  9 16:04:27 2022

@author: Alfredo Diaz
"""

""" Módulo para cálculos diversos """

def calificacion(dfc,nulosfinales,y_predicNB):
    import os
    #Librerias para mostar unas imagenes
    import IPython.display as display
    from PIL import Image
    import requests
    nota=0
    nulos=dfc.isnull().sum()
    nulosfinales=nulos[0:12].sum()
    """ Calcula la suma total """
    if len(dfc)!=0:
        print('________________________________________________________')
        print('\n')
        print("1. El dataframe quedó bien cargado, tiene 1 punto",'\n')
        nota+=1
    else:
        print('________________________________________________________')
        print('\n')
        print("1. El dataframe NO quedó bien cargado, tiene 0 punto",'\n')
        
    if 'Unnamed: 0' in dfc.columns:
        print('________________________________________________________')
        print('\n')
        print("2. No borro la primera columna Unnamed: 0, No tiene punto",'\n')
    else:
        print('________________________________________________________')
        print('\n')
        print("2. Si borró la primera columna Unnamed: 0, tiene 1 punto",'\n')
        nota+=1
        
    if len(df._get_numeric_data.columns)!=13:
        print('________________________________________________________')
        print('\n')
        print("3. No convirtió todas las columnas en numéricas, No tiene punto",'\n')
    else:
        print('________________________________________________________')
        print('\n')
        print("3. Si convirtió todas las columnas en numéricas, tiene 1 punto",'\n')
        nota+=1     
        
    if 'CATEG' in dfc.columns:
         print('________________________________________________________')
         print('\n')
         print("4. No borro la  columna CATEG, No tiene punto",'\n')

    else:
         print('________________________________________________________')
         print('\n')
         print("4. Si borró la  columna CATEG, tiene 1 punto",'\n')
         nota+=1   
        
    if nulosfinales==0:
         print('________________________________________________________')
         print('\n')
         print("5. Si proceso todos los nulos, tiene 1 punto",'\n')
         nota+=1
    else:
         print('________________________________________________________')
         print('\n')
         print("5. No borró los nulos, no tiene punto",'\n')
      
    if dfc.COMPPRES.max()<22710:
         print('________________________________________________________')
         print('\n')
         print("6. Quito los oytlayer de COMPPRES , tiene 1 punto",'\n')
         nota+=1
    else:
         print('________________________________________________________')
         print('\n')
         print("6. No quito los outlier de COMPPRES, no tiene punto",'\n')
    
    if len(dfc)==980:
         print('________________________________________________________')
         print('\n')
         print("7. El dataframe quedó con 980 rows , tiene 1 punto",'\n')
         nota+=1
    else:
         print('________________________________________________________')
         print('\n')
         print("7. El dataframe no tiene la cantidad de filas de acuerdo a lo suguerido, no tiene punto",'\n')
    
    if 'ANTIG' in dfc.columns:
         print('________________________________________________________')
         print('\n')
         print("8. No borro la  columna ANTIG, que tenia colinealidad No tiene punto",'\n')

    else:
         print('________________________________________________________')
         print('\n')
         print("8. Si borró la  columna ANTIG, que tenía colinealidad, tiene 1 punto",'\n')
         nota+=1
         
    if len(y_predicNB)>0:
          print('________________________________________________________')
          print('\n')
          print("9. Si realizó la predicion en NB , tiene 1 punto",'\n')
          nota+=1
    else:
          print('________________________________________________________')
          print('\n')
          print("9. No realizó la predicción de NB, no tiene punto",'\n')
        
    if nota>7:
           print('________________________________________________________')
           print('\n')
           print("FELICITACIONES HA APROBADO EL EXAMEN")
           display.display(Image.open(requests.get('https://raw.githubusercontent.com/adiacla/bigdata/master/aprobado.jpg',stream=True).raw))
    else:
           print('________________________________________________________')
           print('\n')
           print("DEBE REPASAR TIENE UNA CALIFICACION POR DEBAJO DEL 7/12")           
           display.display(Image.open(requests.get('https://raw.githubusercontent.com/adiacla/bigdata/master/reject.jpg',stream=True).raw))
    
    return nota*10/12
