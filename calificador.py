
"""
Created on Sun Jan  9 16:04:27 2022

@author: Alfredo Diaz
"""

""" Módulo para cálculos diversos """

def calificacion(dfc,dfe,nulosfinales,y_predicNB,exactitud):
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
        
    if len(dfc.columns)!=13:
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
      
    if dfe.ANTIG.max()<2121:
         print('________________________________________________________')
         print('\n')
         print("6. Quito los outlayer de ANTIF , tiene 1 punto",'\n')
         nota+=1
    else:
         print('________________________________________________________')
         print('\n')
         print("6. No quito los outlier de ANTIG, no tiene punto",'\n')
    
    if len(dfc)==980:
         print('________________________________________________________')
         print('\n')
         print("7. El dataframe quedó con 980 rows , tiene 1 punto",'\n')
         nota+=1
    else:
         print('________________________________________________________')
         print('\n')
         print("7. El dataframe no tiene la cantidad de filas de acuerdo a lo sugerido, no tiene punto",'\n')
    
    if exactitud<80:
         print('________________________________________________________')
         print('\n')
         print("8. El accuracy no es el adecuado. No tiene punto",'\n')
    else:
         print('________________________________________________________')
         print('\n')
         print("8. Si calculó bien el accuracy, tiene 1 punto",'\n')
         nota+=1
         
    if len(y_predicNB)>0:
          print('________________________________________________________')
          print('\n')
          print("9. Si realizó la predicion en NB de 196 datos de prueba, tiene 1 punto",'\n')
          nota+=1
    else:
          print('________________________________________________________')
          print('\n')
          print("9. No realizó la predicción de NB de los datos de prueba, no tiene punto",'\n')
        
    if nota>6:
           print('________________________________________________________')
           print('\n')
           print("FELICITACIONES HA APROBADO. SI EL EXAMEN ESTA POR ARRIBA FUE 8 EXCELENTE")
           display.display(Image.open(requests.get('https://raw.githubusercontent.com/adiacla/bigdata/master/aprobado.jpg',stream=True).raw))
    else:
           print('________________________________________________________')
           print('\n')
           print("DEBE REPASAR PARA EL PROXIMO EXAMEN, PORQUE TIENE UNA CALIFICACION POR DEBAJO DE 6")           
           display.display(Image.open(requests.get('https://raw.githubusercontent.com/adiacla/bigdata/master/reject.jpg',stream=True).raw))
    
    return (nota/9)*5
