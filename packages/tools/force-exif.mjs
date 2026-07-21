import fs from "fs/promises";
import path from "path";
import * as yaml from "js-yaml";
import ExifReader from "exifreader";
import sharp from "sharp";
import { applyCameraMap, applyLensMap } from "./scripts/apply-camera-lens-map.mjs";

const FOLDER_PATH = "/Users/florianreisinger/dev/reisinger.pictures/apps/reisinger.pictures/src";

async function getAll(dir){const e=await fs.readdir(dir,{withFileTypes:true});let f=[];for(const x of e){const p=path.join(dir,x.name);if(x.isDirectory())f=f.concat(await getAll(p));else f.push(p);}return f;}

function fmtShutter(v){if(Array.isArray(v)&&v.length===2)return `${v[0]}/${v[1]}`;if(typeof v==="number"){if(v>=1)return `${v}s`;return `1/${Math.round(1/v)}`;}return undefined;}
function fmtAperture(v){if(typeof v!=="string")return undefined;return v.replace(".0","");}
function fmtDate(v){if(typeof v!=="string"||v.length!==19)return undefined;return `${v.substring(0,10).replace(/:/g,"-")}T${v.substring(11)}`;}

let updated=0;
const files=(await getAll(FOLDER_PATH)).filter(f=>f.endsWith(".yaml")||f.endsWith(".yml"));
for(const fp of files){
  try{
    const raw=await fs.readFile(fp,"utf-8");
    const data=yaml.load(raw);
    if(!data?.metadata) continue;
    const base=path.basename(fp,path.extname(fp));
    const dir=path.dirname(fp);
    const imgPath=path.join(dir,`${base}.jpg`);
    let buf;
    try{buf=await fs.readFile(imgPath);}catch{continue;}
    const exif=ExifReader.load(buf);
    const info=await sharp(buf).metadata();
    let orientation="square";
    if(info.width>info.height)orientation="landscape";else if(info.height>info.width)orientation="portrait";
    const m=data.metadata;
    const newMeta={
      captureDate: fmtDate(exif.DateTimeOriginal?.description) || m.captureDate,
      aperture: fmtAperture(exif.FNumber?.description) || m.aperture,
      focalLength: exif.FocalLength?.description || m.focalLength,
      shutter: exif.ExposureTime?.value ? fmtShutter(exif.ExposureTime.value) : m.shutter,
      iso: exif.ISOSpeedRatings?.description ? parseInt(exif.ISOSpeedRatings.description,10) : m.iso,
      camera: exif.Model?.description ? applyCameraMap(exif.Model.description) : m.camera,
      lens: exif.LensModel?.description ? applyLensMap(exif.LensModel.description) : m.lens,
      orientation: m.orientation || orientation
    };
    Object.keys(newMeta).forEach(k=>newMeta[k]===undefined&&delete newMeta[k]);
    const changed=JSON.stringify(newMeta)!==JSON.stringify(m);
    if(changed){
      data.metadata=newMeta;
      await fs.writeFile(fp,yaml.dump(data),"utf-8");
      updated++;
      console.log(`✅ ${path.relative(FOLDER_PATH,fp)}`);
    }
  }catch(e){console.error(`❌ ${fp}: ${e.message}`);}
}
console.log(`\n--- ${updated} Datei(en) aktualisiert. ---`);
