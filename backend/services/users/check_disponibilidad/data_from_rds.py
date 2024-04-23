import pandas as pd
from sqlalchemy import create_engine

def descargar_datos(tabla, archivo_salida):
    # Establecer la conexión a la base de datos utilizando SQLAlchemy
    engine = create_engine('postgresql://users:userspassword@users-db-new5.c9h4jegst7hj.us-east-1.rds.amazonaws.com:5432/postgres')

    # Consulta SQL para obtener todos los datos de la tabla
    consulta = 'SELECT "id", "username", "password", "email", "auth0_id", "nombre", "apellido", "tipo_documentacion", "numero_identificacion", "genero", "edad", "peso", "pais_nacimiento", "ciudad_nacimiento", "pais_residencia", "ciudad_residencia", "antiguedad_residencia", "altura", "tipo_plan", "deportes", created_at FROM "user";'


    # Leer los datos en un DataFrame de pandas directamente desde la base de datos utilizando SQLAlchemy
    df = pd.read_sql(consulta, engine)

    # Guardar el DataFrame en un archivo CSV
    df.to_csv(archivo_salida, index=False)

if __name__ == "__main__":
    # Nombre de la tabla y nombre del archivo CSV de salida
    tabla = "user"
    archivo_salida = "user_rds.csv"

    # Descargar los datos y guardarlos en un archivo CSV
    descargar_datos(tabla, archivo_salida)
