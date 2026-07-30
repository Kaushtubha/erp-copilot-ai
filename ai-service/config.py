"""
Application settings using pydantic-settings.
Reads from environment variables with defaults.
"""
from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    # LLM Providers
    gemini_api_key: str = ""
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    groq_api_key: str = ""
    primary_llm_provider: Literal["gemini", "openai", "anthropic", "groq", "mock"] = "gemini"
    primary_llm_model: str = "gemini-2.0-flash"

    # Embedding
    embedding_model: str = "models/text-embedding-004"
    embedding_dimension: int = 768

    # Qdrant
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    qdrant_api_key: str = ""

    # Backend
    backend_base_url: str = "http://localhost:8080"

    # PostgreSQL (for direct AI queries)
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "erp_copilot"
    postgres_user: str = "erp_user"
    postgres_password: str = "erp_password_secure_2024"

    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: str = ""

    # App
    testing: bool = False
    log_level: str = "INFO"

    @property
    def postgres_dsn(self) -> str:
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"

    @property
    def qdrant_url(self) -> str:
        return f"http://{self.qdrant_host}:{self.qdrant_port}"

    class Config:
        env_file = ".env"
        case_sensitive = False
