import dayjs from "dayjs";

interface AnmeldezeitraumProps {
    from: string,
    to: string,
    title: string,
    shootingFrom: string,
    shootingTo: string
}

dayjs.locale('de-AT')

function Duration({from, to, children}: { from: string, to: string, children: string }) {
    const year = dayjs().format("YYYY")
    let fromWithYear = dayjs(`${year}-${from}`);
    let toWithYear = dayjs(`${year}-${to}`);
    const today = dayjs();

    if (toWithYear.isBefore(fromWithYear)) {
        toWithYear = toWithYear.add(1, "y")
    }

    if (today.isAfter(toWithYear) && today.isBefore(fromWithYear)) {
        fromWithYear = fromWithYear.add(1, "y")
        toWithYear = toWithYear.add(1, "y")
    }

    const isActive = today.isAfter(fromWithYear) && today.isBefore(toWithYear);

    return <span classList={{'bg-yellow-300 p-1 rounded-lg font-bold': isActive}}>
        {children} {`${fromWithYear.format("DD.MM.YYYY")} - ${toWithYear.format("DD.MM.YYYY")}`}
    </span>
}

function Zeitraum({title, from, to, shootingFrom, shootingTo}: AnmeldezeitraumProps) {
    return <div class="text-center">
        <h3>{title}</h3>
        <ul class={"list-none"}>
            <li><Duration from={from} to={to}>Anmeldezeitraum:</Duration></li>

            <li><Duration from={shootingFrom} to={shootingTo}>Shootingzeitraum:</Duration></li>
        </ul>

    </div>
}

const INDOOR = {title: "Indoor", from: "8-14", to: "9-15", shootingFrom: "9-1", shootingTo: "4-30"};
const OUTDOOR = {title: "Outdoor", from: "12-20", to: "1-9", shootingFrom: "4-1", shootingTo: "9-30"};

export function Anmeldezeitraum() {
    return <>
        <h2>Anmeldezeitraum</h2>
        <div class="p grid gap-y-4 md:grid-cols-2">
            <Zeitraum {...OUTDOOR}/>
            <Zeitraum {...INDOOR}/>
        </div>
    </>
}
