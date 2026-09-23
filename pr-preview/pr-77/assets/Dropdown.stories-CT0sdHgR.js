import{j as e}from"./jsx-runtime-Tst0Uo-4.js";import{f as g}from"./index-5LejAjL2.js";import"./index-CALWQ3JB.js";import"./_commonjsHelpers-Cpj98o6Y.js";const h=({label:n,className:s,value:a})=>e.jsx("option",{value:a,className:s,children:n},`option_${a}`),o=({id:n,name:s,options:a,className:f,ariaLabel:v,onChange:w,...b})=>{const y=["usa-select",f||""].filter(Boolean).join(" ");return e.jsx("select",{className:y,name:s,id:n,"aria-label":v,onChange:w,...b,children:a.map(l=>e.jsx(h,{...l},`option_${l.value}`))})};h.__docgenInfo={description:"",methods:[],displayName:"DropdownOption",props:{label:{required:!0,tsType:{name:"string"},description:"Option label"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes on the <option>."},value:{required:!0,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"Value of the option"}}};o.__docgenInfo={description:"",methods:[],displayName:"Dropdown",props:{id:{required:!0,tsType:{name:"string"},description:"Dropdown list ID"},name:{required:!0,tsType:{name:"string"},description:"Name for the dropdown list"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes on the <select>."},options:{required:!0,tsType:{name:"Array",elements:[{name:"DropdownOptionProps"}],raw:"DropdownOptionProps[]"},description:"Array of options"},ariaLabel:{required:!0,tsType:{name:"string"},description:"Aria label on the <select>"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(event: React.ChangeEvent<HTMLSelectElement>) => void",signature:{arguments:[{type:{name:"ReactChangeEvent",raw:"React.ChangeEvent<HTMLSelectElement>",elements:[{name:"HTMLSelectElement"}]},name:"event"}],return:{name:"void"}}},description:"Callback fired when an option is selected"}}};const D={title:"NCIDS/Dropdown",component:o,tags:["autodocs"],argTypes:{className:{control:"text",description:"Additional CSS classes on the list"}}},t={args:{id:"default-dropdown",name:"default-dropdown",options:[{label:"20",value:20},{label:"50",value:50},{label:"100",value:100}],onChange:g()}},r={name:"With Results Per Page Text",render:n=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[e.jsx("span",{children:"Show"}),e.jsx(o,{...n,style:{width:"70px"}}),e.jsx("span",{children:"results per page"})]}),args:{id:"results-per-page",name:"results-per-page",ariaLabel:"Select option",options:[{label:"20",value:20},{label:"50",value:50},{label:"100",value:100}],onChange:g()}};var i,p,d;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    id: 'default-dropdown',
    name: 'default-dropdown',
    options: [{
      label: '20',
      value: 20
    }, {
      label: '50',
      value: 50
    }, {
      label: '100',
      value: 100
    }],
    onChange: fn()
  }
}`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var u,c,m;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'With Results Per Page Text',
  render: args => {
    return <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
                <span>Show</span>
                <Dropdown {...args} style={{
        width: '70px'
      }} />
                <span>results per page</span>
            </div>;
  },
  args: {
    id: 'results-per-page',
    name: 'results-per-page',
    ariaLabel: 'Select option',
    options: [{
      label: '20',
      value: 20
    }, {
      label: '50',
      value: 50
    }, {
      label: '100',
      value: 100
    }],
    onChange: fn()
  }
}`,...(m=(c=r.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};const j=["Default","WithResultsPerPageText"];export{t as Default,r as WithResultsPerPageText,j as __namedExportsOrder,D as default};
