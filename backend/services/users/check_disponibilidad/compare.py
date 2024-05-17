import pandas as pd
import matplotlib.pyplot as plt

# Cargar los DataFrames desde los archivos CSV
solicitudes = pd.read_csv("solicitudes.csv")
users_rds = pd.read_csv("user_rds.csv")

# Convertir las columnas de fecha y hora a objetos datetime
solicitudes["Hora de Solicitud"] = pd.to_datetime(solicitudes["Hora de Solicitud"])
solicitudes["Hora de Respuesta"] = pd.to_datetime(solicitudes["Hora de Respuesta"])
users_rds["created_at"] = pd.to_datetime(users_rds["created_at"])

# Fusionar los DataFrames por email
merged_data = pd.merge(solicitudes, users_rds, how='inner', left_on='Email', right_on='email')

# Calcular la duración de la transacción en relación con la columna 'created_at' como la hora final
merged_data['Duración'] = (merged_data['created_at'] - merged_data['Hora de Solicitud']).dt.total_seconds()

# Luego, crea el gráfico de barras con la duración total de todas las transacciones

# Finalmente, crea el gráfico de barras
plt.figure(figsize=(10, 6))
merged_data['Duración'].plot(kind='bar', color='skyblue')
plt.title('Duración de Transacciones por Usuario')
plt.xlabel('Usuario')
plt.ylabel('Duración (segundos)')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig('duracion_transacciones.png')
plt.show()
#save image


