# alembic/env.py

from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context
import os
import sys
root_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(root_directory)

# Importa tus modelos para que Alembic los conozca
from users.app.models import User
import users.app.config as configuration

URL_POSTGRES = configuration.get_postgres_url()
# Esto carga la configuración de logging de alembic.ini
fileConfig(context.config.config_file_name)

# Configura tu conexión a la base de datos PostgreSQL (reemplaza los valores con los de tu instancia de RDS)
config = context.config
config.set_main_option("sqlalchemy.url",URL_POSTGRES )

# Asegúrate de que tus modelos estén disponibles para Alembic
target_metadata = [User.metadata]

# Esto se utiliza para pre-cargar tus modelos con SQLAlchemy
def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    engine = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    connection = engine.connect()
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
    )

    try:
        with context.begin_transaction():
            context.run_migrations()
    finally:
        connection.close()


# Si la ejecución es en línea (por ejemplo, en un servidor), llama a run_migrations_online().
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
