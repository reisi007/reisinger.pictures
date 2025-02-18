import PocketBase, {type RecordFullListOptions} from 'pocketbase';
import {type Accessor, createMemo, createResource, type ResourceReturn} from "solid-js";

export function createPocketbase() {
    return new PocketBase('https://backend.reisinger.pictures');
}

export function createPocketbaseResource<R>(collectionIdOrName: string, options?: RecordFullListOptions): [data: ResourceReturn<R[]>[0], isReady: Accessor<boolean>, ResourceReturn<R[]>[1]] {
    const [data, first] = createResource<R[]>(
        () => createPocketbase().collection<R>(collectionIdOrName).getFullList(options)
    );

    const ready = createMemo(() => data.state === "ready");

    return [data, ready, first]
}

export enum ShootingEnvironment {
    INDOOR = "Indoor",
    OUTDOOR = "Outdoor"
}