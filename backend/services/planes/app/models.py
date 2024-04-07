class Plan(SQLModel, table=True):
    id = Field(default=None, primary_key=True)
    deporte: str
    nombre: str
    numeroEntrenamientosSemana: str
    objetivoDistanciaEntrenamiento: str

SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)

def create_session():
    session = Session(engine)
    return session