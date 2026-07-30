"""
Chat router — handles streaming AI chat via Server-Sent Events (SSE).
"""
import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from models.schemas import ChatRequest, ChatResponse
from graph.erp_graph import get_graph
from config import Settings

router = APIRouter()
settings = Settings()


@router.post("/stream")
async def stream_chat(request: ChatRequest):
    """
    Stream AI response using Server-Sent Events.
    Returns chunks of the response as they are generated.
    """
    graph = get_graph(settings)

    initial_state = {
        "query": request.query,
        "user_email": request.user_email,
        "user_role": request.user_role,
        "session_id": request.session_id,
        "conversation_history": [],
        "target_agent": "",
        "intent": "",
        "entities": {},
        "context": [],
        "sql_query": None,
        "sql_result": None,
        "chart_data": None,
        "response": "",
        "citations": [],
        "workflow_definition": None,
        "error": None,
        "stream_tokens": True,
    }

    async def event_generator():
        try:
            # Stream the graph execution
            async for chunk in graph.astream(
                initial_state,
                config={"configurable": {"thread_id": request.session_id}}
            ):
                for node_name, node_output in chunk.items():
                    if node_name == "planner":
                        yield f"data: {json.dumps({'type': 'agent_start', 'agent': node_output.get('target_agent', ''), 'intent': node_output.get('intent', '')})}\n\n"
                    elif "response" in node_output and node_output["response"]:
                        # Stream response tokens
                        response_text = node_output["response"]
                        words = response_text.split()
                        for i in range(0, len(words), 3):
                            chunk_text = " ".join(words[i:i+3]) + " "
                            yield f"data: {json.dumps({'type': 'token', 'content': chunk_text})}\n\n"

                        # Send metadata
                        yield f"data: {json.dumps({'type': 'metadata', 'chart_data': node_output.get('chart_data'), 'citations': node_output.get('citations', []), 'sql_query': node_output.get('sql_query'), 'workflow_definition': node_output.get('workflow_definition')})}\n\n"

            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Non-streaming chat endpoint for simpler integrations."""
    graph = get_graph(settings)

    initial_state = {
        "query": request.query,
        "user_email": request.user_email,
        "user_role": request.user_role,
        "session_id": request.session_id,
        "conversation_history": [],
        "target_agent": "",
        "intent": "",
        "entities": {},
        "context": [],
        "sql_query": None,
        "sql_result": None,
        "chart_data": None,
        "response": "",
        "citations": [],
        "workflow_definition": None,
        "error": None,
        "stream_tokens": False,
    }

    try:
        final_state = await graph.ainvoke(
            initial_state,
            config={"configurable": {"thread_id": request.session_id}}
        )
        return ChatResponse(
            response=final_state.get("response", "No response generated"),
            agent_used=final_state.get("target_agent", "unknown"),
            intent=final_state.get("intent", "unknown"),
            chart_data=final_state.get("chart_data"),
            citations=final_state.get("citations", []),
            sql_query=final_state.get("sql_query"),
            workflow_definition=final_state.get("workflow_definition"),
            session_id=request.session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
