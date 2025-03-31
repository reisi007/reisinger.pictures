import { type RecordFullListOptions } from "pocketbase";
import { createResource, type ResourceReturn } from "solid-js";
import { createPocketbase } from "./login/PocketbaseProvider.tsx";

export function createPocketbaseResource<R>(collectionIdOrName: string, options?: RecordFullListOptions): ResourceReturn<R[]> {
  const client = createPocketbase();
  return createResource<R[]>(
    () => client.collection<R>(collectionIdOrName).getFullList(options)
  );
}

export function createFileUrl(record: { id: string }, filename: string, options?: { thumb: string }) {
  const client = createPocketbase();
  return client.files.getURL(record, filename, options);
}
