import { CosmosClient } from "@azure/cosmos"

const endpoint = process.env.COSMOS_ENDPOINT!
const key = process.env.COSMOS_KEY!
const databaseId = process.env.COSMOS_DATABASE_ID!
const containerId = process.env.COSMOS_CONTAINER_ID!

const client = new CosmosClient({ endpoint, key })

console.log(`Connecting to Cosmos DB at ${endpoint}...`)
console.log(`Database ID: ${databaseId}`)
console.log(`Container ID: ${containerId}`)
console.log(`Key: ${key}`)
console.log(`Client: ${client}`)

export const cosmosContainer = client
  .database(databaseId)
  .container(containerId)
