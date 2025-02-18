import {SkeletonImage} from "./SkeletonImage";

export function SkeletonList({count, showImage = false}: { count: number, showImage?: boolean }) {
    return (
        <ul>
            {Array.from({length: count})
                .map(() => (
                    <li class="flex flex-col animate-pulse">
                        <div class="w-11/12 flex space-y-2 py-1 items-baseline">
                            <span class="before:content-['•'] before:text-gray-600 before:text-2xl before:pr-2"/>
                            <span class="h-4 bg-gray-600 rounded-sm grow basis-1 mr-2"/>
                            <span class="h-4 bg-gray-300 rounded-sm grow-5 basis-1"/>
                        </div>
                        {showImage && <SkeletonImage/>}
                    </li>
                ))}
        </ul>
    );
};