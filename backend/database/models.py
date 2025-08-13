from sqlalchemy import Column, Integer, String, Float, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

Base = declarative_base()

# PostgreSQL connection (Docker container on localhost:5432)
DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/cv_match"
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    id = Column(Integer, primary_key=True, index=True)
    summary = Column(String)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc))

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    data = Column(String)  # JSON blob

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer)
    jd_id = Column(Integer)
    score = Column(Float)
    timestamp = Column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc))

Base.metadata.create_all(bind=engine)
