import {createPocketbaseResource, ShootingEnvironment} from "./pocketbase";
import {SkeletonList} from "./skeleton/SkeletonList";

interface Idea {
    title: string,
    description: string,
}

export function Shootingideen({type, skeletonCount = 4}: { type: ShootingEnvironment, skeletonCount?: number }) {

    const [data, isReady] = createPocketbaseResource<Idea>("ideas", {
        sort: "priority,title",
        fields: "title,description",
        filter: `(type='${type}')`
    })

    return <>
        {!isReady() && <SkeletonList count={skeletonCount} showImage={type === ShootingEnvironment.OUTDOOR}/>}
        {isReady() && <ul class="[&_img]:max-h-96 [&_img]:mx-auto [&_img]:my-2 [&_img]:w-full">
            {data()?.map(({description, title}) => <li>
                <b>{title}: </b>
                <span class="*:inline" innerHTML={description}/>
            </li>) ?? <></>}
        </ul>
        }
    </>
}