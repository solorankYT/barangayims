import{j as e,K as w,r as x,a as C,L as T}from"./app-BUJ-Xs52.js";import{A,C as L}from"./AuthenticatedLayout-cLHCBzW-.js";import{G as r}from"./Grid-pnX0zcTp.js";import{C as c,a as d}from"./CardContent-B-eIVxiP.js";import{c as j,T as t,P as m}from"./Menu-BBYLuhnE.js";import{T as p,a as u,b as g,c as l,d as i,e as f}from"./TableRow-XQUvRJBl.js";import"./index-DhyXgqfG.js";import"./MenuItem-DcNJRPM_.js";import"./useControlled-dll_wIeD.js";import"./index-Bim1y6ZO.js";import"./Report-DqM0_vN-.js";const z=j(e.jsx("path",{d:"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"}),"People"),R=j(e.jsx("path",{d:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5"}),"Place"),W=j(e.jsx("path",{d:"M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z"}),"Warning");function F(){const{residents:h=[],evacuationSites:o=[],incidents:b=[]}=w().props,[E,v]=x.useState([]),[n,S]=x.useState(null);x.useEffect(()=>{y()},[]);const y=async()=>{try{const s=await C.get("/fetchWeatherData");if(s.data){const a=Array.isArray(s.data)?s.data:[s.data];v(a),a.length>0&&S(a[0])}else console.error("Unexpected response format:",s.data)}catch(s){console.error("Error fetching weather history:",s)}};return e.jsxs(A,{children:[e.jsx(T,{title:"Dashboard"}),e.jsxs(r,{container:!0,spacing:3,sx:{mb:3},children:[e.jsx(r,{item:!0,xs:12,md:4,children:e.jsx(c,{sx:{borderLeft:"6px solid #2196f3",boxShadow:2},children:e.jsx(d,{children:e.jsxs(r,{container:!0,spacing:2,alignItems:"center",children:[e.jsx(r,{item:!0,children:e.jsx(z,{sx:{fontSize:40,color:"#2196f3"}})}),e.jsxs(r,{item:!0,children:[e.jsx(t,{variant:"h6",children:"Total Residents"}),e.jsx(t,{variant:"h4",children:h.length})," "]})]})})})}),e.jsx(r,{item:!0,xs:12,md:4,children:e.jsx(c,{sx:{borderLeft:"6px solid #4caf50",boxShadow:2},children:e.jsx(d,{children:e.jsxs(r,{container:!0,spacing:2,alignItems:"center",children:[e.jsx(r,{item:!0,children:e.jsx(R,{sx:{fontSize:40,color:"#4caf50"}})}),e.jsxs(r,{item:!0,children:[e.jsx(t,{variant:"h6",children:"Evacuation Sites"}),e.jsx(t,{variant:"h4",children:o.length})," "]})]})})})}),e.jsx(r,{item:!0,xs:12,md:4,children:e.jsx(c,{sx:{borderLeft:"6px solid #f44336",boxShadow:2},children:e.jsx(d,{children:e.jsxs(r,{container:!0,spacing:2,alignItems:"center",children:[e.jsx(r,{item:!0,children:e.jsx(W,{sx:{fontSize:40,color:"#f44336"}})}),e.jsxs(r,{item:!0,children:[e.jsx(t,{variant:"h6",children:"Active Incidents"}),e.jsx(t,{variant:"h4",children:b.length})," "]})]})})})})]}),e.jsxs(r,{container:!0,spacing:3,children:[e.jsx(r,{item:!0,xs:12,md:4,children:n&&e.jsx(c,{sx:{borderRadius:3,boxShadow:3},children:e.jsxs(d,{children:[e.jsxs(t,{variant:"h6",gutterBottom:!0,children:[e.jsx(L,{sx:{verticalAlign:"middle",mr:1}}),"Weather Update"]}),e.jsxs(t,{variant:"subtitle1",children:[n.city,", ",n.country]}),e.jsx(t,{variant:"body2",color:"textSecondary",children:n.region}),e.jsxs("div",{style:{display:"flex",alignItems:"center",marginTop:10},children:[e.jsx("img",{src:n.weather_icon,alt:n.weather_description,width:"50"}),e.jsxs("div",{style:{marginLeft:10},children:[e.jsxs(t,{variant:"h4",children:[n.temperature,"°C"]}),e.jsx(t,{children:n.weather_description})]})]}),e.jsxs(t,{variant:"caption",color:"textSecondary",children:["Updated: ",new Date(n.created_at).toLocaleString()]})]})})}),e.jsx(r,{item:!0,xs:12,md:4,children:e.jsx(c,{sx:{borderRadius:3,boxShadow:3},children:e.jsxs(d,{children:[e.jsx(t,{variant:"h6",children:"Residents"}),e.jsx(p,{component:m,sx:{minHeight:30},children:e.jsxs(u,{size:"small",children:[e.jsx(g,{children:e.jsxs(l,{children:[e.jsx(i,{children:"Name"}),e.jsx(i,{children:"Contact Number"}),e.jsx(i,{children:"Address"})]})}),e.jsx(f,{children:h.length>0?h.map((s,a)=>e.jsxs(l,{children:[e.jsx(i,{children:s.name}),e.jsx(i,{children:s.contact_number}),e.jsx(i,{children:s.address})]},a)):e.jsx(l,{children:e.jsx(i,{colSpan:3,align:"center",children:"No Residents Found"})})})]})})]})})}),e.jsx(r,{item:!0,xs:12,md:4,children:e.jsx(c,{sx:{borderRadius:3,boxShadow:3},children:e.jsxs(d,{children:[e.jsx(t,{variant:"h6",children:"Evacuation Sites"}),e.jsx(p,{component:m,sx:{minHeight:300},children:e.jsxs(u,{size:"small",children:[e.jsx(g,{children:e.jsxs(l,{children:[e.jsx(i,{children:"Site Name"}),e.jsx(i,{children:"Capacity"})]})}),e.jsx(f,{children:o.length>0?o.map((s,a)=>e.jsxs(l,{children:[e.jsx(i,{children:s.site_name}),e.jsx(i,{children:s.capacity})]},a)):e.jsx(l,{children:e.jsx(i,{colSpan:2,align:"center",children:"No Sites Available"})})})]})})]})})})]})]})}export{F as default};
