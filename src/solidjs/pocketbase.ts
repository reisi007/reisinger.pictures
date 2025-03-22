import { type RecordFullListOptions } from "pocketbase";
import { type Accessor, createMemo, createResource, type ResourceReturn } from "solid-js";
import { usePocketbase } from "./shooting/login/PocketbaseProvider";

export function createPocketbaseResource<R>(collectionIdOrName: string, options?: RecordFullListOptions): [data: ResourceReturn<R[]>[0], isReady: Accessor<boolean>, ResourceReturn<R[]>[1]] {
  const client = usePocketbase()
  const [data, first] = createResource<R[]>(
    () => client.collection<R>(collectionIdOrName).getFullList(options)
  );

  const ready = createMemo(() => data.state === "ready");
  return [data, ready, first];
}