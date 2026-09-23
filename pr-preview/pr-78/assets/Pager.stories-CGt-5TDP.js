import{j as e}from"./jsx-runtime-Tst0Uo-4.js";import{f as he}from"./index-5LejAjL2.js";import{r as be}from"./index-CALWQ3JB.js";import"./_commonjsHelpers-Cpj98o6Y.js";const Pe=3,v=({current:n=1,neighbors:P=1,totalResults:i,resultsPerPage:o=25,previousLabel:se="Previous",nextLabel:re="Next",onPageChange:te,scrollToTop:ne=!0,ariaLabel:oe="Pagination"})=>{const T=Math.max(0,Math.min(P,Pe)),t=Math.ceil(i/o),r=n<1||n>t?1:n,ie=s=>s*o-o,x=s=>{ne&&window.scrollTo(0,0),te({page:s,offset:ie(s),resultsPerPage:o})},le=(s,a)=>{s.preventDefault(),x(a)};if(i<=o)return null;const ue=5,ce=()=>{const s=[];for(let a=1;a<=t;a++){const ge=t<=ue,N=a===r,pe=a===1||a===t;let j=!1;T>0&&(j=Math.abs(r-a)<=T);const _=ge||pe||N||j,C=a===2||a===t-1,de=C&&!_&&a<r,me=C&&!_&&a>r;_?s.push(e.jsx("li",{className:"usa-pagination__item usa-pagination__page-no",children:e.jsx("a",{href:"#",className:`usa-pagination__button${N?" usa-current":""}`,"aria-label":`Page ${a}`,"aria-current":N?"page":void 0,onClick:fe=>le(fe,a),children:a})},`page-${a}`)):de?s.push(e.jsx("li",{className:"usa-pagination__item usa-pagination__overflow ellipsis--left","aria-hidden":"true",children:e.jsx("span",{children:"…"})},"left-ellipsis")):me&&s.push(e.jsx("li",{className:"usa-pagination__item usa-pagination__overflow ellipsis--right","aria-hidden":"true",children:e.jsx("span",{children:"…"})},"right-ellipsis"))}return s};return e.jsx("nav",{className:"usa-pagination","aria-label":oe,children:e.jsxs("ul",{className:"usa-pagination__list",children:[e.jsx("li",{className:"usa-pagination__item usa-pagination__arrow",children:e.jsxs("a",{href:"#",className:`usa-pagination__link usa-pagination__previous-page${r===1?" hidden":""}`,"aria-label":"Previous page","aria-hidden":r===1,role:"button",onClick:s=>{s.preventDefault(),x(r-1)},children:[e.jsx("svg",{className:"usa-icon","aria-hidden":"true",focusable:"false",role:"img",children:e.jsx("use",{xlinkHref:"/img/sprite.svg#navigate_before"})}),e.jsx("span",{className:"usa-pagination__link-text",children:se})]})}),ce(),e.jsx("li",{className:"usa-pagination__item usa-pagination__arrow",children:e.jsxs("a",{href:"#",className:`usa-pagination__link usa-pagination__next-page${r===t?" hidden":""}`,"aria-label":"Next page","aria-hidden":r===t,role:"button",onClick:s=>{s.preventDefault(),x(r+1)},children:[e.jsx("span",{className:"usa-pagination__link-text",children:re}),e.jsx("svg",{className:"usa-icon","aria-hidden":"true",focusable:"false",role:"img",children:e.jsx("use",{xlinkHref:"/img/sprite.svg#navigate_next"})})]})})]})})};v.__docgenInfo={description:"",methods:[],displayName:"Pager",props:{current:{required:!1,tsType:{name:"number"},description:"Currently active page number (1-indexed). Defaults to 1.",defaultValue:{value:"1",computed:!1}},neighbors:{required:!1,tsType:{name:"number"},description:"Number of neighboring pages to show on each side of the current page (0-3). Defaults to 1.",defaultValue:{value:"1",computed:!1}},totalResults:{required:!0,tsType:{name:"number"},description:"Total number of results to paginate."},resultsPerPage:{required:!1,tsType:{name:"number"},description:"Number of results displayed per page. Defaults to 25.",defaultValue:{value:"25",computed:!1}},previousLabel:{required:!1,tsType:{name:"string"},description:'Label for the previous navigation button. Defaults to "Previous".',defaultValue:{value:"'Previous'",computed:!1}},nextLabel:{required:!1,tsType:{name:"string"},description:'Label for the next navigation button. Defaults to "Next".',defaultValue:{value:"'Next'",computed:!1}},onPageChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(data: PageChangeData) => void",signature:{arguments:[{type:{name:"PageChangeData"},name:"data"}],return:{name:"void"}}},description:"Callback fired when a page navigation occurs."},scrollToTop:{required:!1,tsType:{name:"boolean"},description:"Whether to scroll to top of the page on navigation. Defaults to true.",defaultValue:{value:"true",computed:!1}},ariaLabel:{required:!1,tsType:{name:"string"},description:'Accessible label for the nav landmark. Defaults to "Pagination".',defaultValue:{value:"'Pagination'",computed:!1}}}};const je={title:"NCIDS/Pager",component:v,tags:["autodocs"],args:{onPageChange:he()},argTypes:{current:{control:{type:"number",min:1},description:"Currently active page number (1-indexed)"},neighbors:{control:{type:"number",min:0,max:3},description:"Number of neighboring pages shown on each side of the current page"},totalResults:{control:{type:"number",min:0},description:"Total number of results to paginate"},resultsPerPage:{control:{type:"number",min:1},description:"Number of results per page"},scrollToTop:{control:"boolean",description:"Scroll to top on page change"}}},l={args:{totalResults:250,resultsPerPage:25,current:1}},u={args:{totalResults:250,resultsPerPage:25,current:5}},c={args:{totalResults:250,resultsPerPage:25,current:10}},g={name:"Few Pages (No Ellipsis)",args:{totalResults:100,resultsPerPage:25,current:2}},p={args:{totalResults:1e3,resultsPerPage:10,current:50,neighbors:2}},d={name:"Neighbors = 0",args:{totalResults:250,resultsPerPage:25,current:5,neighbors:0}},m={name:"Neighbors = 3",args:{totalResults:500,resultsPerPage:25,current:10,neighbors:3}},f={args:{totalResults:200,resultsPerPage:25,current:3,previousLabel:"Anterior",nextLabel:"Siguiente"}},h={args:{totalResults:200,resultsPerPage:25,current:1,scrollToTop:!1}},xe=()=>{const[n,P]=be.useState(1);return e.jsxs("div",{children:[e.jsxs("p",{children:["Current page: ",e.jsx("strong",{children:n})]}),e.jsx(v,{current:n,totalResults:250,resultsPerPage:25,onPageChange:({page:i})=>P(i),scrollToTop:!1})]})},b={render:()=>e.jsx(xe,{})};var R,y,S;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    totalResults: 250,
    resultsPerPage: 25,
    current: 1
  }
}`,...(S=(y=l.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var w,D,L;u.parameters={...u.parameters,docs:{...(w=u.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    totalResults: 250,
    resultsPerPage: 25,
    current: 5
  }
}`,...(L=(D=u.parameters)==null?void 0:D.docs)==null?void 0:L.source}}};var k,E,M;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    totalResults: 250,
    resultsPerPage: 25,
    current: 10
  }
}`,...(M=(E=c.parameters)==null?void 0:E.docs)==null?void 0:M.source}}};var q,V,A;g.parameters={...g.parameters,docs:{...(q=g.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'Few Pages (No Ellipsis)',
  args: {
    totalResults: 100,
    resultsPerPage: 25,
    current: 2
  }
}`,...(A=(V=g.parameters)==null?void 0:V.docs)==null?void 0:A.source}}};var F,I,$;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    totalResults: 1000,
    resultsPerPage: 10,
    current: 50,
    neighbors: 2
  }
}`,...($=(I=p.parameters)==null?void 0:I.docs)==null?void 0:$.source}}};var O,H,B;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'Neighbors = 0',
  args: {
    totalResults: 250,
    resultsPerPage: 25,
    current: 5,
    neighbors: 0
  }
}`,...(B=(H=d.parameters)==null?void 0:H.docs)==null?void 0:B.source}}};var G,W,X;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'Neighbors = 3',
  args: {
    totalResults: 500,
    resultsPerPage: 25,
    current: 10,
    neighbors: 3
  }
}`,...(X=(W=m.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};var z,J,K;f.parameters={...f.parameters,docs:{...(z=f.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    totalResults: 200,
    resultsPerPage: 25,
    current: 3,
    previousLabel: 'Anterior',
    nextLabel: 'Siguiente'
  }
}`,...(K=(J=f.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,Y;h.parameters={...h.parameters,docs:{...(Q=h.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    totalResults: 200,
    resultsPerPage: 25,
    current: 1,
    scrollToTop: false
  }
}`,...(Y=(U=h.parameters)==null?void 0:U.docs)==null?void 0:Y.source}}};var Z,ee,ae;b.parameters={...b.parameters,docs:{...(Z=b.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <ControlledPagerExample />
}`,...(ae=(ee=b.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};const Ce=["Default","MiddlePage","LastPage","FewPages","ManyPages","NoNeighbors","MaxNeighbors","CustomLabels","NoScrollToTop","Controlled"];export{b as Controlled,f as CustomLabels,l as Default,g as FewPages,c as LastPage,p as ManyPages,m as MaxNeighbors,u as MiddlePage,d as NoNeighbors,h as NoScrollToTop,Ce as __namedExportsOrder,je as default};
