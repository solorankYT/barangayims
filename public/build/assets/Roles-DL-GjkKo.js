import{K as C,r as t,j as e,S as r}from"./app-BUJ-Xs52.js";import{A as g}from"./AuthenticatedLayout-cLHCBzW-.js";import{B as D,I as x}from"./index-DhyXgqfG.js";import{B as d,P as R}from"./Menu-BBYLuhnE.js";import{A as T,E as A,D as S}from"./Edit-B-_es7x1.js";import{T as y,a as E,b as v,c as h,d as n,e as B}from"./TableRow-XQUvRJBl.js";import{D as k,a as w,b as I,T as N,c as O}from"./TextField-DtEF5oPB.js";import"./useControlled-dll_wIeD.js";import"./MenuItem-DcNJRPM_.js";import"./index-Bim1y6ZO.js";import"./Report-DqM0_vN-.js";const G=()=>{const{roles:j}=C().props,[p,c]=t.useState(!1),[a,i]=t.useState({id:"",name:""}),[l,u]=t.useState(!1),m=(s=null)=>{u(!!s),i(s?{id:s.id,name:s.name}:{id:"",name:""}),c(!0)},o=()=>{c(!1),i({id:"",name:""})},f=()=>{l?r.put(`/roles/${a.id}`,{name:a.name},{onSuccess:()=>o()}):r.post("/roles",{name:a.name},{onSuccess:()=>o()})},b=s=>{window.confirm("Are you sure you want to delete this role?")&&r.delete(`/roles/${s}`)};return e.jsx(g,{header:"Roles Management",children:e.jsxs(D,{sx:{width:"100%",padding:3},children:[e.jsx(d,{variant:"contained",color:"primary",startIcon:e.jsx(T,{}),onClick:()=>m(),sx:{mb:2},children:"Add Role"}),e.jsx(y,{component:R,children:e.jsxs(E,{children:[e.jsx(v,{children:e.jsxs(h,{children:[e.jsx(n,{children:e.jsx("b",{children:"ID"})}),e.jsx(n,{children:e.jsx("b",{children:"Role Name"})}),e.jsx(n,{children:e.jsx("b",{children:"Actions"})})]})}),e.jsx(B,{children:j.map(s=>e.jsxs(h,{children:[e.jsx(n,{children:s.id}),e.jsx(n,{children:s.name}),e.jsxs(n,{children:[e.jsx(x,{onClick:()=>m(s),color:"primary",children:e.jsx(A,{})}),e.jsx(x,{onClick:()=>b(s.id),color:"error",children:e.jsx(S,{})})]})]},s.id))})]})}),e.jsxs(k,{open:p,onClose:o,children:[e.jsx(w,{children:l?"Edit Role":"Add Role"}),e.jsx(I,{children:e.jsx(N,{fullWidth:!0,margin:"dense",label:"Role Name",variant:"outlined",value:a.name,onChange:s=>i({...a,name:s.target.value})})}),e.jsxs(O,{children:[e.jsx(d,{onClick:o,color:"secondary",children:"Cancel"}),e.jsx(d,{onClick:f,color:"primary",children:l?"Update":"Save"})]})]})]})})};export{G as default};
