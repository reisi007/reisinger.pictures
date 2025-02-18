import {createMemo} from "solid-js";
import {createPocketbaseResource} from "./pocketbase";

interface Statistics {
    id: string,
    cnt: number
}

function Item({id: name, cnt}: Statistics) {
    return (
        <a href={`/${name.toLowerCase()}`}
           class="black flex flex-col items-center justify-center rounded-2xl border border-primary/50 p-4">
            <div
                class="inline-flex size-10 items-center justify-center rounded-full bg-primary font-medium text-onPrimary">
                {cnt > 0 ? cnt : "-"}
            </div>
            <span class="mt-1 text-lg font-light">{name}</span>
        </a>
    );
}

const CATEGORIES = ["Beauty", "Akt", "Couples", "Videos", "Sport", "Tanz"]


export function PendingStatistics() {
    const [data, isReady] = createPocketbaseResource<Statistics>('pending_statistics', {
        sort: '-cnt',
        fields: "id,cnt"
    })

    const noShootings = createMemo(() => {
        const noShootingCategories = new Set(CATEGORIES);

        data()?.forEach(e => {
            noShootingCategories.delete(e.id)
        })

        return Array.from(noShootingCategories);
    })

    return <>
        {isReady() && <>
            <h3>Aktuell geplante Shootings</h3>
            <div class="p grid  grid-cols-3 gap-3 sm:grid-cols-6 ">
                {data()?.map((e) => <Item {...e}/>)}
                {noShootings()?.map(e => <Item id={e} cnt={0}/>)}
            </div>
        </>}
    </>
}
