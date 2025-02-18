import {createEffect, createSignal} from "solid-js"
import {updateQueryParamInUrl} from "./utils";

export function Dialog({openText, name, content, title}: {
    openText: string,
    name: string
    content?: Element,
    title?: Element,
}) {
    const params = new URLSearchParams(window.location.search);
    const showDialog = params.get(name);
    const [visibility, setVisibility] = createSignal<"visible" | undefined>(undefined)

    setVisibility(showDialog === "visible" ? "visible" : undefined)

    createEffect(() => {
        updateQueryParamInUrl(name, visibility())
    });

    return <>
        <div data-type="dialog" data-state={visibility()}
             onclick={() => setVisibility(undefined)}
             class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/80">
            <div
                onclick={(e) => {
                    e.stopPropagation()
                }}
                class="container flex-col items-center rounded-lg border border-gray-900 bg-gray-50/90 p-4">
                <div class="mb-1 inline-flex w-full flex-row items-stretch pb-1">
                    <span class="grow">                    </span>
                    {title}
                    <span class="grow">                    </span>
                    <span class="i-mdi-close cursor-pointer text-xl" onclick={() => {
                        setVisibility(undefined)
                    }}></span>

                </div>
                <div classList={{
                    "w-[80%] border-b border-black my-2": !!title,
                    "-my-3": !title
                }}/>
                {content}
            </div>
        </div>
        <button onclick={() => {
            setVisibility("visible");
        }}>{openText}</button>
    </>
}


