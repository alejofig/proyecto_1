import unittest
from datetime import datetime
from unittest.mock import MagicMock
from sqlmodel import SQLModel, Session
from app.models import Entrenamiento
from sqlalchemy import create_engine
from app.database import create_entrenamiento, obtener_entrenamientos, obtener_ultimo_entrenamiento, obtener_entrenamientos_user, obtener_estadisticas

class TestTrainingFunctions(unittest.TestCase):

    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        SQLModel.metadata.create_all(self.engine)
        self.session = Session(self.engine)

    def test_create_entrenamiento(self):
        entrenamiento = Entrenamiento(user_id=1, total_calories=500, distance=5, duration=60,sport_type="Ride",fecha=datetime.now())
        result = create_entrenamiento(entrenamiento)
        self.assertIsNotNone(result)
        self.assertEqual(result.user_id, 1)

    def test_obtener_entrenamientos(self):
        session_mock = MagicMock(return_value=self.session)
        with unittest.mock.patch('app.database.create_session', session_mock):
            result = obtener_entrenamientos()
            self.assertIsInstance(result, list)

    def test_obtener_ultimo_entrenamiento(self):
        entrenamiento = Entrenamiento(id=2, user_id=4, total_calories=600, distance=6, duration=70,sport_type="Ride",fecha=datetime.now())
        self.session.add(entrenamiento)
        self.session.commit()
        result = obtener_ultimo_entrenamiento(user_id=1)
        self.assertIsNotNone(result)

    def test_obtener_entrenamientos_user(self):
        entrenamiento = Entrenamiento(user_id=1, total_calories=700, distance=7, duration=80,sport_type="Ride",fecha=datetime.now())
        self.session.add(entrenamiento)
        self.session.commit()

        result = obtener_entrenamientos_user(user_id=1)
        self.assertIsInstance(result, list)

    def test_obtener_estadisticas(self):
        entrenamiento = Entrenamiento(user_id=1, fecha=datetime.now(), total_calories=800, distance=8, duration=90,sport_type="Ride")
        self.session.add(entrenamiento)
        self.session.commit()

        result = obtener_estadisticas(user_id=1)
        self.assertIsInstance(result, dict)
        self.assertIn("total_trainnings_month", result)

    def tearDown(self):
        self.session.close()
        SQLModel.metadata.drop_all(self.engine)

