import{f as e}from"./index-5LejAjL2.js";import{j as q}from"./jsx-runtime-Tst0Uo-4.js";import"./index-CALWQ3JB.js";import"./_commonjsHelpers-Cpj98o6Y.js";const w=({id:C,name:T,type:v="text",className:D,...I})=>{const E=["usa-input",D||""].filter(Boolean).join(" ");return q.jsx("input",{className:E,id:C,name:T,type:v,...I})};w.__docgenInfo={description:"",methods:[],displayName:"TextInput",props:{id:{required:!0,tsType:{name:"string"},description:"Input ID"},name:{required:!0,tsType:{name:"string"},description:"Input name"},type:{required:!1,tsType:{name:"union",raw:`| 'text'
| 'email'
| 'password'
| 'tel'
| 'url'
| 'number'
| 'search'`,elements:[{name:"literal",value:"'text'"},{name:"literal",value:"'email'"},{name:"literal",value:"'password'"},{name:"literal",value:"'tel'"},{name:"literal",value:"'url'"},{name:"literal",value:"'number'"},{name:"literal",value:"'search'"}]},description:"HTML input type",defaultValue:{value:"'text'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes on the <input>."}},composes:["Omit"]};const A={title:"NCIDS/TextInput",component:w,tags:["autodocs"],argTypes:{type:{control:"select",options:["text","email","password","tel","url","number","search"],description:"HTML input type"},className:{control:"text",description:"Additional CSS classes on the <input>"},disabled:{control:"boolean"},required:{control:"boolean"},placeholder:{control:"text"}}},a={args:{id:"default-text-input",name:"default-text-input",type:"text","aria-label":"Text input",onChange:e()}},n={args:{id:"email-input",name:"email-input",type:"email",placeholder:"name@example.com","aria-label":"Email",onChange:e()}},t={args:{id:"password-input",name:"password-input",type:"password","aria-label":"Password",onChange:e()}},r={args:{id:"search-input",name:"search-input",type:"search",placeholder:"Search","aria-label":"Search",onChange:e()}},s={args:{id:"disabled-input",name:"disabled-input",type:"text",disabled:!0,"aria-label":"Disabled input",onChange:e()}};var i,o,l;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    id: 'default-text-input',
    name: 'default-text-input',
    type: 'text',
    'aria-label': 'Text input',
    onChange: fn()
  }
}`,...(l=(o=a.parameters)==null?void 0:o.docs)==null?void 0:l.source}}};var p,d,u;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    id: 'email-input',
    name: 'email-input',
    type: 'email',
    placeholder: 'name@example.com',
    'aria-label': 'Email',
    onChange: fn()
  }
}`,...(u=(d=n.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var c,m,h;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    id: 'password-input',
    name: 'password-input',
    type: 'password',
    'aria-label': 'Password',
    onChange: fn()
  }
}`,...(h=(m=t.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var g,x,b;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    id: 'search-input',
    name: 'search-input',
    type: 'search',
    placeholder: 'Search',
    'aria-label': 'Search',
    onChange: fn()
  }
}`,...(b=(x=r.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var f,y,S;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    id: 'disabled-input',
    name: 'disabled-input',
    type: 'text',
    disabled: true,
    'aria-label': 'Disabled input',
    onChange: fn()
  }
}`,...(S=(y=s.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};const H=["Default","Email","Password","Search","Disabled"];export{a as Default,s as Disabled,n as Email,t as Password,r as Search,H as __namedExportsOrder,A as default};
