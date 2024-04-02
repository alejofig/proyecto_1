import pandas as pd
import matplotlib.pyplot as plt

PETICIONES_HTTP = "peticiones_http.csv"
PETICIONES_SQS = "peticiones_sqs.csv"
tipo_peticion = PETICIONES_HTTP

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

# Graficar la duración de cada solicitud para cada endpoint
for endpoint in endpoints:
    df_endpoint = df[df['Endpoint'] == endpoint]
    plt.bar(df_endpoint.index, df_endpoint['Duración'], label=endpoint)

plt.xlabel('Índice de solicitud')
plt.ylabel('Duración (segundos)')
plt.title('Duración de cada solicitud')
plt.legend()

# Guardar la gráfica en un archivo de imagen
plt.savefig(f'{tipo_peticion.split(".")[0]}.png')

# Mostrar la gráfica
plt.show()
