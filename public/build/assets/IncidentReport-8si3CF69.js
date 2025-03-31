import{K as D,r as c,j as e,S as u}from"./app-BUJ-Xs52.js";import{A as R}from"./AuthenticatedLayout-cLHCBzW-.js";import{B as P,I as T}from"./index-DhyXgqfG.js";import{T as a,D as k,a as B,b as E,c as _}from"./TextField-DtEF5oPB.js";import{I as w,S as W}from"./Search-CPsxp5Z_.js";import{B as h,P as N}from"./Menu-BBYLuhnE.js";import{A as O,E as L,D as H}from"./Edit-B-_es7x1.js";import{T as M,a as $,b as q,c as p,d as s,e as F}from"./TableRow-XQUvRJBl.js";import{A as K}from"./Autocomplete-HL6gNpe-.js";import{M as l}from"./MenuItem-DcNJRPM_.js";import"./useControlled-dll_wIeD.js";import"./index-Bim1y6ZO.js";import"./Report-DqM0_vN-.js";import"./Autocomplete-BLYPNwWp.js";import"./Close-BEU_eJTi.js";const re=()=>{const{incidents:b=[],residents:x=[]}=D().props,[y,j]=c.useState(!1),[d,v]=c.useState(!1),[m,C]=c.useState(""),[n,r]=c.useState({id:null,resident_id:null,title:"",incidentType:"",description:"",status:""}),g=(t=null)=>{var i;v(!!t),r(t?{...t,resident_id:((i=t.resident)==null?void 0:i.id)||null}:{id:null,resident_id:null,title:"",incidentType:"",description:"",status:""}),j(!0)},o=()=>{j(!1),r({id:null,resident_id:null,title:"",incidentType:"",description:"",status:""})},I=()=>{if(!n.resident_id){alert("Resident is required.");return}let t={...n};d||(delete t.id,delete t.status),d?u.put(`/incidentreport/${n.id}`,t,{onSuccess:()=>o()}):u.post("/incidentreport",t,{onSuccess:()=>o()})},S=t=>{window.confirm("Are you sure you want to delete this incident report?")&&u.delete(`/incidentreport/${t}`)},f=b.filter(t=>{var i;return[t.id.toString(),(i=t.resident)==null?void 0:i.name,t.title,t.incidentType,t.description,t.status].filter(Boolean).some(A=>A.toLowerCase().includes(m.toLowerCase()))});return e.jsx(R,{header:"Incident Reports",children:e.jsxs(P,{sx:{width:"100%",padding:3},children:[e.jsx(a,{variant:"outlined",placeholder:"Search by ID, Resident, Title, Type, Status...",fullWidth:!0,value:m,onChange:t=>C(t.target.value),sx:{mb:2},InputProps:{startAdornment:e.jsx(w,{position:"start",children:e.jsx(W,{})})}}),e.jsx(h,{variant:"contained",color:"primary",startIcon:e.jsx(O,{}),onClick:()=>g(),sx:{mb:2},children:"Add Incident"}),e.jsx(M,{component:N,children:e.jsxs($,{children:[e.jsx(q,{children:e.jsxs(p,{children:[e.jsx(s,{children:e.jsx("b",{children:"ID"})}),e.jsx(s,{children:e.jsx("b",{children:"Resident"})}),e.jsx(s,{children:e.jsx("b",{children:"Title"})}),e.jsx(s,{children:e.jsx("b",{children:"Type"})}),e.jsx(s,{children:e.jsx("b",{children:"Description"})}),e.jsx(s,{children:e.jsx("b",{children:"Status"})}),e.jsx(s,{children:e.jsx("b",{children:"Actions"})})]})}),e.jsx(F,{children:f.length>0?f.map(t=>{var i;return e.jsxs(p,{children:[e.jsx(s,{children:t.id}),e.jsx(s,{children:((i=t.resident)==null?void 0:i.name)||"No Resident Assigned"}),e.jsx(s,{children:t.title}),e.jsx(s,{children:t.incidentType||"No Type Specified"}),e.jsx(s,{children:t.description}),e.jsx(s,{children:t.status}),e.jsxs(s,{children:[e.jsx(T,{onClick:()=>g(t),color:"primary",children:e.jsx(L,{})}),e.jsx(T,{onClick:()=>S(t.id),color:"error",children:e.jsx(H,{})})]})]},t.id)}):e.jsx(p,{children:e.jsx(s,{colSpan:7,align:"center",children:"No incident reports found."})})})]})}),e.jsxs(k,{open:y,onClose:o,children:[e.jsx(B,{children:d?"Edit Incident":"Add Incident"}),e.jsxs(E,{children:[e.jsx(K,{options:x,getOptionLabel:t=>t.name||"",value:x.find(t=>t.id===n.resident_id)||null,onChange:(t,i)=>{r({...n,resident_id:i?i.id:null})},renderInput:t=>e.jsx(a,{...t,label:"Resident",fullWidth:!0,margin:"dense"})}),e.jsx(a,{label:"Title",fullWidth:!0,margin:"dense",name:"title",value:n.title,onChange:t=>r({...n,title:t.target.value})}),e.jsxs(a,{select:!0,label:"Incident Type",fullWidth:!0,margin:"dense",name:"incidentType",value:n.incidentType,onChange:t=>r({...n,incidentType:t.target.value}),children:[e.jsx(l,{value:"Noise Complaint",children:"Noise Complaint"}),e.jsx(l,{value:"Illegal Parking",children:"Illegal Parking"}),e.jsx(l,{value:"Robbery / Hold-up",children:"Robbery / Hold-up"}),e.jsx(l,{value:"Physical Assault",children:"Physical Assault"}),e.jsx(l,{value:"Theft",children:"Theft"})]}),e.jsx(a,{label:"Description",fullWidth:!0,margin:"dense",name:"description",value:n.description,onChange:t=>r({...n,description:t.target.value}),multiline:!0}),d&&e.jsxs(a,{select:!0,label:"Status",fullWidth:!0,margin:"dense",name:"status",value:n.status,onChange:t=>r({...n,status:t.target.value}),children:[e.jsx(l,{value:"Pending",children:"Pending"}),e.jsx(l,{value:"Ongoing",children:"Ongoing"}),e.jsx(l,{value:"Completed",children:"Completed"})]})]}),e.jsxs(_,{children:[e.jsx(h,{onClick:o,color:"secondary",children:"Cancel"}),e.jsx(h,{onClick:I,color:"primary",children:d?"Update":"Save"})]})]})]})})};export{re as default};
