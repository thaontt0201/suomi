from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    database_url_sync: str

    google_client_id: str
    google_client_secret: str

    secret_key: str
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"
    production: bool = False

    ollama_base_url: str = "http://localhost:11434"
    ollama_model_generate: str = "qwen2.5"
    ollama_model_evaluate_writing: str = "llama3.2"
    ollama_model_evaluate_speaking: str = "mistral"
    ollama_model_vocabulary: str = "qwen2.5"

    whisper_model: str = "base"


settings = Settings()
