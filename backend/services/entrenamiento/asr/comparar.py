import pandas as pd
import matplotlib.pyplot as plt

# Cargar los DataFrames desde los archivos CSV
solicitudes = pd.read_csv("entrenamientos.csv")

# Convertir las columnas de fecha y hora a objetos datetime
solicitudes["Hora de Solicitud"] = pd.to_datetime(solicitudes["Hora de Solicitud"])
solicitudes["Hora de Respuesta"] = pd.to_datetime(solicitudes["Hora de Respuesta"])

# Calcular la duración de la transacción en relación con la columna 'created_at' como la hora final
solicitudes['Duración'] = (solicitudes['Hora de Respuesta'] - solicitudes['Hora de Solicitud']).dt.total_seconds()

# Luego, crea el gráfico de barras con la duración total de todas las transacciones

# Finalmente, crea el gráfico de barras
plt.figure(figsize=(10, 6))
solicitudes['Duración'].plot(kind='bar', color='skyblue')
plt.title('Duración de transacción creación de entrenamiento en Sport App con envío a Strava.')
plt.xlabel('Solicitud de creación de entrenamiento.')
plt.ylabel('Duración (segundos)')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig('duracion_transacciones.png')
plt.show()
#save image


