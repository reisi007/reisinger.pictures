import { createMemo } from "solid-js";
import { createPocketbaseResource } from "../pocketbase.ts";
import type { ContractsResponse } from "../pocketbase.types.ts";
import { LoginIsland } from "../login/Island.tsx";


function DisplayContract(props: { item: ContractsResponse }) {
  const item = props.item;
  return <div class="border rounded-xl py-4 px-2 my-2">
    <h5>{item.title}</h5>
    <p class="tailwind-disabled" innerHTML={item.text}></p>
  </div>;
}

function DisplayContractList(props: { data: ContractsResponse[] }) {
  const data = props.data;
  return <>
    {data.map((item: ContractsResponse) => <DisplayContract item={item} />
    )}
  </>;
}


function DisplayContracts(props: { data?: ContractsResponse[], title: string }) {
  const data = props.data;
  return <>
    <h4>{props.title}</h4>
    {(data === undefined || data.length === 0) && <p>Keine Vertäge gefunden</p>}
    {data !== undefined && <DisplayContractList data={data} />}
  </>;
}

function AfterLogin() {
  const [data] = createPocketbaseResource<ContractsResponse>("contracts", {
    fields: "id,title,text,signature"
  });
  const signed = createMemo(() => data()?.filter((item: ContractsResponse) => item.signature !== ""));

  const notSigned = createMemo(() => data()?.filter((item: ContractsResponse) => item.signature === ""));

  return <> {data() !== undefined && <>
    <DisplayContracts data={notSigned()} title="Verträge, die unterzeichnet werden müssen" />

    <DisplayContracts data={signed()} title="Bereits unterzeichnete Verträge" />
  </>
  }
  </>;
}

export function Contracts() {
  return <LoginIsland>
    <AfterLogin />
  </LoginIsland>;

}