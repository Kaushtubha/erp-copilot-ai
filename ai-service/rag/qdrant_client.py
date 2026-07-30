"""
Qdrant Vector Database manager.
Manages collections and operations for Hybrid RAG.
"""
import structlog
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import (
    Distance, VectorParams, HnswConfigDiff, OptimizersConfigDiff
)
from config import Settings

log = structlog.get_logger()

COLLECTIONS = [
    "erp_products",
    "erp_inventory",
    "erp_purchase_orders",
    "erp_sales_orders",
    "erp_vendors",
    "erp_warehouse",
    "erp_documents",
    "erp_workflows",
]


class QdrantManager:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = AsyncQdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
            api_key=settings.qdrant_api_key or None,
        )

    async def initialize_collections(self):
        """Create all required Qdrant collections if they don't exist."""
        existing = {c.name for c in await self.client.get_collections().collections}

        for collection_name in COLLECTIONS:
            if collection_name not in existing:
                await self.client.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(
                        size=self.settings.embedding_dimension,
                        distance=Distance.COSINE,
                    ),
                    hnsw_config=HnswConfigDiff(m=16, ef_construct=100),
                    optimizers_config=OptimizersConfigDiff(
                        indexing_threshold=10000,
                    ),
                )
                log.info("qdrant_collection_created", collection=collection_name)
            else:
                log.info("qdrant_collection_exists", collection=collection_name)

    async def search(self, collection: str, query_vector: list[float], limit: int = 5) -> list[dict]:
        """Search a collection with a query vector."""
        results = await self.client.search(
            collection_name=collection,
            query_vector=query_vector,
            limit=limit,
            with_payload=True,
        )
        return [{"score": r.score, "payload": r.payload} for r in results]
