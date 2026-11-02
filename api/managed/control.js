import {requireOwner,requireSameOrigin} from "../_lib/security.js";

const GITHUB="https://api.github.com";
const VERCEL="https://api.vercel.com";
const CLOUDFLARE="https://api.cloudflare.com/client/v4";
const RENDER="https://api.render.com/v1";

export function validRepoSlug(value){const parts=String(value||"").split("/");return parts.length===2&&parts.every(p=>/^[A-Za-z0-9_.-]+$/.test(p)&&p!=="."&&p!=="..");}
export function validGitRef(value){return /^[A-Za-z0-9_./-]{1,100}$/.test(String(value||""))&&!String(value).includes("..");}
function ghHeaders(){return {Authorization:"Bearer "+process.env.GITHUB_TOKEN,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"};}
function bearer(name){return {Authorization:"Bearer "+process.env[name],Accept:"application/json","Content-Type":"application/json"};}
async function json(r){return r.json().catch(()=>({}));}
async function fail(r,provider){const b=await json(r);return {error:b.message||b.error?.message||b.msg||provider+" API returned HTTP "+r.status,providerStatus:r.status};}
async function githubOwnedRepo(repo){if(!validRepoSlug(repo))return {error:"Use owner/repository format."};const [meR,repoR]=await Promise.all([fetch(GITHUB+"/user",{headers:ghHeaders()}),fetch(GITHUB+"/repos/"+repo,{headers:ghHeaders()})]);if(!meR.ok)return {error:(await fail(meR,"GitHub")).error,status:meR.status};if(!repoR.ok)return {error:(await fail(repoR,"GitHub")).error,status:repoR.status};const me=await json(meR),data=await json(repoR);if(data.owner?.login?.toLowerCase()!==me.login?.toLowerCase())return {error:"For safety, workflow controls are limited to repositories owned by the connected GitHub account.",status:403};return {login:me.login,repo:data};}

export default async function handler(req,res){
  if(!["GET","POST"].includes(req.method))return res.status(405).json({error:"Method not allowed"});
  if(!requireOwner(req,res))return;
  res.setHeader("Cache-Control","private, max-age=20, stale-while-revalidate=40");
  const provider=String(req.query?.provider||"").toLowerCase();
  if(req.method==="POST"&&!requireSameOrigin(req,res))return;
  const body=req.body||{};
  if(provider==="github"){
    if(!process.env.GITHUB_TOKEN)return res.status(503).json({error:"GITHUB_TOKEN is not configured."});
    const repo=String(req.method==="GET"?req.query?.repo:body.repo||"").trim();
    const owned=await githubOwnedRepo(repo);if(owned.error)return res.status(owned.status||400).json({error:owned.error});
    if(req.method==="GET"){
      const [r,runsR]=await Promise.all([fetch(GITHUB+"/repos/"+repo+"/actions/workflows?per_page=50",{headers:ghHeaders()}),fetch(GITHUB+"/repos/"+repo+"/actions/runs?per_page=10",{headers:ghHeaders()})]);
      if(!r.ok)return res.status(r.status>=500?502:r.status).json(await fail(r,"GitHub"));
      if(!runsR.ok)return res.status(runsR.status>=500?502:runsR.status).json(await fail(runsR,"GitHub"));
      const [b,runs]=await Promise.all([json(r),json(runsR)]);
      return res.status(200).json({provider:"github",repo,workflows:(b.workflows||[]).map(w=>({id:w.id,name:w.name,path:w.path,state:w.state,badgeUrl:w.badge_url})),runs:(runs.workflow_runs||[]).map(x=>({id:x.id,name:x.name,displayTitle:x.display_title,status:x.status,conclusion:x.conclusion,branch:x.head_branch,createdAt:x.created_at,htmlUrl:x.html_url}))});
    }
    if(body.action==="rerun_failed"){
      const runId=String(body.runId||"").trim();if(!/^\d{1,20}$/.test(runId))return res.status(400).json({error:"Invalid workflow run ID."});
      const check=await fetch(GITHUB+"/repos/"+repo+"/actions/runs/"+runId,{headers:ghHeaders()});if(!check.ok)return res.status(check.status>=500?502:check.status).json(await fail(check,"GitHub"));
      const run=await json(check);if(run.repository?.full_name?.toLowerCase()!==repo.toLowerCase())return res.status(403).json({error:"Workflow run does not belong to the selected repository."});
      if(run.status!=="completed"||run.conclusion!=="failure")return res.status(409).json({error:"Only completed failed runs can be retried."});
      const retry=await fetch(GITHUB+"/repos/"+repo+"/actions/runs/"+runId+"/rerun-failed-jobs",{method:"POST",headers:ghHeaders()});if(!retry.ok)return res.status(retry.status>=500?502:retry.status).json(await fail(retry,"GitHub"));
      return res.status(202).json({retried:true,runId,message:"GitHub accepted the retry of failed jobs."});
    }
    const workflow=String(body.workflow||"").trim(),ref=String(body.ref||"").trim();
    if(!/^(\d{1,20}|[A-Za-z0-9_./-]{1,150})$/.test(workflow)||!validGitRef(ref))return res.status(400).json({error:"Choose a valid workflow and branch/tag ref."});
    const r=await fetch(GITHUB+"/repos/"+repo+"/actions/workflows/"+encodeURIComponent(workflow)+"/dispatches",{method:"POST",headers:ghHeaders(),body:JSON.stringify({ref})});
    if(!r.ok)return res.status(r.status>=500?502:r.status).json(await fail(r,"GitHub"));
    return res.status(202).json({dispatched:true,repo,workflow,ref,message:"Workflow dispatch accepted by GitHub."});
  }
  if(provider==="vercel"){
    if(!process.env.VERCEL_TOKEN)return res.status(503).json({error:"VERCEL_TOKEN is not configured."});
    if(req.method!=="GET")return res.status(405).json({error:"Vercel operation is read-only in this control panel."});
    const q=new URLSearchParams({limit:"20"});if(process.env.VERCEL_TEAM_ID)q.set("teamId",process.env.VERCEL_TEAM_ID);
    const r=await fetch(VERCEL+"/v6/deployments?"+q.toString(),{headers:bearer("VERCEL_TOKEN")});
    if(!r.ok)return res.status(r.status>=500?502:r.status).json(await fail(r,"Vercel"));
    const b=await json(r);
    return res.status(200).json({provider:"vercel",deployments:(b.deployments||[]).map(d=>({id:d.uid,name:d.name,url:d.url,state:d.state,readyState:d.readyState,target:d.target,createdAt:d.createdAt,projectId:d.projectId,meta:d.meta?.githubCommitMessage||null}))});
  }
  if(provider==="cloudflare"){
    if(!process.env.CLOUDFLARE_API_TOKEN)return res.status(503).json({error:"CLOUDFLARE_API_TOKEN is not configured."});
    if(req.method!=="GET")return res.status(405).json({error:"Cloudflare mutation controls are not enabled yet."});
    const r=await fetch(CLOUDFLARE+"/zones?per_page=50&order=name",{headers:bearer("CLOUDFLARE_API_TOKEN")});
    if(!r.ok)return res.status(r.status>=500?502:r.status).json(await fail(r,"Cloudflare"));
    const b=await json(r);if(b.success===false)return res.status(502).json({error:(b.errors||[]).map(x=>x.message).join("; ")||"Cloudflare request failed."});
    return res.status(200).json({provider:"cloudflare",zones:(b.result||[]).map(z=>({id:z.id,name:z.name,status:z.status,plan:z.plan?.name||null,paused:z.paused,developmentMode:z.development_mode,modifiedOn:z.modified_on}))});
  }
  if(provider==="render"){
    if(!process.env.RENDER_API_KEY)return res.status(503).json({error:"RENDER_API_KEY is not configured."});
    if(req.method==="GET"){
      const r=await fetch(RENDER+"/services?limit=50",{headers:bearer("RENDER_API_KEY")});
      if(!r.ok)return res.status(r.status>=500?502:r.status).json(await fail(r,"Render"));
      const rows=await json(r);
      return res.status(200).json({provider:"render",services:(Array.isArray(rows)?rows:[]).map(row=>{const s=row.service||row;return {id:s.id,name:s.name,type:s.type,status:s.suspended?"suspended":s.status||"unknown",url:s.serviceDetails?.url||null,updatedAt:s.updatedAt||null};})});
    }
    const id=String(body.id||"").trim(),confirmName=String(body.confirmName||"");
    if(!/^[A-Za-z0-9_-]{5,100}$/.test(id))return res.status(400).json({error:"Invalid Render service ID."});
    const list=await fetch(RENDER+"/services?limit=100",{headers:bearer("RENDER_API_KEY")});if(!list.ok)return res.status(502).json(await fail(list,"Render"));
    const rows=await json(list),entry=(Array.isArray(rows)?rows:[]).map(x=>x.service||x).find(s=>s.id===id);
    if(!entry)return res.status(404).json({error:"Render service not found in your accessible services."});
    if(confirmName!==entry.name)return res.status(400).json({error:"Confirmation name does not match the Render service."});
    const r=await fetch(RENDER+"/services/"+encodeURIComponent(id)+"/restart",{method:"POST",headers:bearer("RENDER_API_KEY")});
    if(!r.ok)return res.status(r.status>=500?502:r.status).json(await fail(r,"Render"));
    return res.status(202).json({restarted:true,id,name:entry.name,message:"Render accepted the restart request."});
  }
  return res.status(400).json({error:"Unknown provider. Use github, vercel, cloudflare or render."});
}
