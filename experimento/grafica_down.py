import pandas as pd
import matplotlib.pyplot as plt

PETICIONES_HTTP = "peticiones_http_down.csv"
PETICIONES_SQS = "peticiones_sqs_down.csv"
tipo_peticion = PETICIONES_SQS

# Cargar los datos del archivo CSV en un DataFrame de pandas
df = pd.read_csv(tipo_peticion)

# Convertir las columnas de hora_inicio y hora_fin al formato datetime
df['Hora_inicio'] = pd.to_datetime(df['Hora_inicio'], unit='s')
df['Hora_fin'] = pd.to_datetime(df['Hora_fin'], unit='s')

# Calcular la duración de cada solicitud
df['Duración'] = (df['Hora_fin'] - df['Hora_inicio']).dt.total_seconds()

# Separar los datos por endpoint
endpoints = df['Endpoint'].unique()

# Crear una sola figura para ambas gráficas
plt.figure(figsize=(10, 6))

# Crear un diccionario de colores para cada estado
colores_estado = {200: 'blue', 401: 'red'}

# Graficar la duración de cada solicitud para cada endpoint
for endpoint in endpoints:
    df_endpoint = df[df['Endpoint'] == endpoint]
    for estado in df_endpoint['Estado'].unique():
        df_estado = df_endpoint[df_endpoint['Estado'] == estado]
        plt.bar(df_estado.index, df_estado['Duración'], label=f'{endpoint} - Estado {estado}', color=colores_estado[estado])

plt.xlabel('Índice de solicitud')
plt.ylabel('Duración (segundos)')
plt.title('Duración de cada solicitud')
plt.legend()

# Guardar la gráfica en un archivo de imagen
plt.savefig(f'{tipo_peticion.split(".")[0]}.png')

# Mostrar la gráfica
plt.show()
