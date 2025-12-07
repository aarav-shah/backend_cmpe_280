import {QdrantClient} from "@qdrant/js-client-rest";

export const qdrantClient = new QdrantClient({
  url: "http://localhost:6333",
});

export const ensureCollection = async (collectionName) => {
    const collections = await qdrantClient.getCollections();
    if(collections.collections.find(c => c.name === collectionName)) {
        console.log("Collection exists:", collectionName);
    }else{
        await qdrantClient.createCollection(collectionName, {
            vectors: {
                size: 1024,
                distance: "Cosine"
            }
        });
        console.log("Collection created:", collectionName);
    }
}

export const insertToQdrant = async (collectionName,id, vector, data) => {
    return await qdrantClient.upsert(collectionName, {
        points: [
            {
                id: id,
                vector: vector,
                payload: data
            }
        ]
    });
}

export const searchInQdrant = async (collectionName, vector) => {
    const results = await qdrantClient.search(collectionName, {
        vector: vector,
        top: 5,
    });
    return results;
}

export const deleteCollection = async (collectionName) => {
    await qdrantClient.deleteCollection(collectionName);
    console.log("Collection deleted:", collectionName);
}
