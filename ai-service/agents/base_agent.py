"""
Base Agent — Common LLM initialization and utilities for all agents.
"""
from abc import ABC, abstractmethod
from config import Settings
from models.schemas import AgentState


class BaseAgent(ABC):
    """Abstract base for all ERP Copilot agents."""

    def __init__(self, settings: Settings):
        self.settings = settings

    def get_llm(self, temperature: float = 0.1):
        """Get LLM based on configured provider."""
        provider = self.settings.primary_llm_provider

        if provider == "gemini":
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(
                model=self.settings.primary_llm_model,
                google_api_key=self.settings.gemini_api_key,
                temperature=temperature,
                convert_system_message_to_human=True,
            )
        elif provider == "openai":
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(
                model=self.settings.primary_llm_model,
                api_key=self.settings.openai_api_key,
                temperature=temperature,
            )
        elif provider == "anthropic":
            from langchain_anthropic import ChatAnthropic
            return ChatAnthropic(
                model=self.settings.primary_llm_model,
                api_key=self.settings.anthropic_api_key,
                temperature=temperature,
            )
        elif provider == "groq":
            from langchain_groq import ChatGroq
            return ChatGroq(
                model=self.settings.primary_llm_model,
                api_key=self.settings.groq_api_key,
                temperature=temperature,
            )
        else:
            # Mock LLM for testing
            from langchain_core.language_models.fake import FakeListChatModel
            return FakeListChatModel(responses=["This is a mock response for testing."])

    @abstractmethod
    async def run(self, state: AgentState) -> dict:
        """Execute agent logic and return updated state."""
        pass
