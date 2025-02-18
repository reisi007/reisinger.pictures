export function updateQueryParamInUrl(param: string, value?: string | null): void {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (value === null || value === undefined) {
        // Delete the parameter if the value is null or undefined
        params.delete(param);
    } else {
        // Update or add the parameter with the new value
        params.set(param, value);
    }

    // Update the browser's URL without reloading the page
    window.history.replaceState({}, '', url.toString());
}
