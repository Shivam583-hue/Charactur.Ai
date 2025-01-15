## Workflow Explanation
### Chat History Management (Redis):

New messages from users are stored in Redis for fast retrieval.
### Semantic Memory Retrieval (Pinecone):

Recent conversations are embedded using OpenAI's embeddings.
These embeddings are used to query Pinecone, retrieving related past conversations or context.
### Enriching Responses (OpenAI):

The retrieved relevant history and current messages are concatenated and passed to the large language model (LLM).
The LLM generates context-aware responses, ensuring continuity in conversations.
---

## Example Flow
User sends a prompt (chat message).
The prompt is:
Stored in Redis for history tracking.
Embedded using OpenAIEmbeddings and used to query Pinecone for similar past records.
Relevant historical information is combined with the user's query and fed into the LLM.
The LLM produces a response.
The response is returned to the user and written to both:
Redis: For immediate future reference.
Pinecone: For long-term vector-based retrieval.
