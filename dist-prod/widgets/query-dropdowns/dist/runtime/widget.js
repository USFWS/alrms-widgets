System.register(["jimu-core","jimu-arcgis","jimu-ui","jimu-core/react"],(function(e,t){var n={},o={},r={},a={};return{setters:[function(e){n.React=e.React,n.appActions=e.appActions,n.css=e.css,n.jsx=e.jsx},function(e){o.JimuMapViewComponent=e.JimuMapViewComponent,o.loadArcGISJSAPIModules=e.loadArcGISJSAPIModules},function(e){r.AdvancedSelect=e.AdvancedSelect,r.Alert=e.Alert,r.Button=e.Button,r.Checkbox=e.Checkbox,r.Dropdown=e.Dropdown,r.DropdownButton=e.DropdownButton,r.DropdownItem=e.DropdownItem,r.DropdownMenu=e.DropdownMenu,r.Label=e.Label,r.Radio=e.Radio},function(e){a.default=e.default,a.useEffect=e.useEffect,a.useRef=e.useRef,a.useState=e.useState}],execute:function(){e((()=>{var e={244:e=>{"use strict";e.exports=n},321:e=>{"use strict";e.exports=r},686:e=>{"use strict";e.exports=o},972:e=>{"use strict";e.exports=a}},t={};function s(n){var o=t[n];if(void 0!==o)return o.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,s),r.exports}s.d=(e,t)=>{for(var n in t)s.o(t,n)&&!s.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.p="";var i={};return s.p=window.jimuConfig.baseUrl,(()=>{"use strict";s.r(i),s.d(i,{__set_webpack_public_path__:()=>_,default:()=>T});var e=s(244);function t(t){var n,o,r,a,s,i,l,c;return e.css`
    height: 100%;
    overflow: auto;
    padding: ${t.sys.spacing(4)} ${t.sys.spacing(4)} 15% ${t.sys.spacing(4)};
    background-color: ${t.sys.color.surface.paper};

    h3 {
      color: ${t.sys.color.surface.paperText};
      font-size: ${(null===(o=null===(n=t.typography)||void 0===n?void 0:n.sizes)||void 0===o?void 0:o.display3)||"1.25rem"};
      font-weight: ${(null===(a=null===(r=t.typography)||void 0===r?void 0:r.weights)||void 0===a?void 0:a.bold)||"bold"};
      margin-bottom: ${t.sys.spacing(2)};
    }

    h4 {
      color: ${t.sys.color.surface.paperText};
      font-size: ${(null===(i=null===(s=t.typography)||void 0===s?void 0:s.sizes)||void 0===i?void 0:i.body1)||"0.875rem"};
      font-weight: ${(null===(c=null===(l=t.typography)||void 0===l?void 0:l.weights)||void 0===c?void 0:c.medium)||"500"};
      margin-bottom: ${t.sys.spacing(2)};
    }

    .dropdown {
      min-width: 100px;
      max-width: 200px;
      width: 90%;
      padding-bottom: 0;
    }
  `}function n(t){var n,o;const r=16;return e.css`
    .wrapper {
      position: relative;
      display: flex;
      align-items: center;
      margin: ${t.sys.spacing(2)} calc(${r}px / 1);
      height: calc(${r}px + 1.6rem);
      max-width: 200px;
      min-width: 32px;
    }

    .input-wrapper {
      width: calc(100% + ${r}px);
      position: absolute;
      height: ${r}px;
    }

    .control-wrapper {
      width: 90%;
      position: absolute;
      height: ${r}px;
    }

    .input {
      position: absolute;
      width: 90%;
      pointer-events: none;
      appearance: none;
      height: 100%;
      opacity: 0;
      z-index: 3;
      padding: 0;

      &::-webkit-slider-thumb {
        appearance: none;
        pointer-events: all;
        width: ${r}px;
        height: ${r}px;
        border-radius: 0;
        border: 0 none;
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }

      &::-moz-range-thumb {
        appearance: none;
        pointer-events: all;
        width: ${r}px;
        height: ${r}px;
        border-radius: 0;
        border: 0 none;
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }

      &::-ms-thumb {
        appearance: none;
        pointer-events: all;
        width: ${r}px;
        height: ${r}px;
        border-radius: 0;
        border: 0 none;
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }

      &::-webkit-slider-runnable-track {
        appearance: none;
        background: transparent;
        border: transparent;
      }

      &::-moz-range-track {
        appearance: none;
        background: transparent;
        border: transparent;
      }

      &::-ms-track {
        appearance: none;
        background: transparent;
        border: transparent;
      }

      &:focus::-webkit-slider-runnable-track {
        appearance: none;
        background: transparent;
        border: transparent;
      }
    }

    .control-label {
      position: absolute;
      top: 100%;
      transform: translateX(-50%);
      white-space: nowrap;
      color: ${t.sys.color.surface.paperText};
      font-size: ${(null===(o=null===(n=t.typography)||void 0===n?void 0:n.sizes)||void 0===o?void 0:o.body2)||"0.75rem"};
    }

    .rail {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      height: 6px;
      border-radius: 3px;
      background: ${t.sys.color.divider.secondary};
    }

    .inner-rail {
      position: absolute;
      height: 100%;
      background: ${t.sys.color.primary.main};
      opacity: 0.6;
    }

    .control {
      width: ${r}px;
      height: ${r}px;
      border-radius: 50%;
      position: absolute;
      background: ${t.sys.color.surface.paper};
      border: 2px solid ${t.sys.color.primary.main};
      top: 50%;
      margin-left: calc(${r}px / -2);
      transform: translate3d(0, -50%, 0);
      z-index: 2;
      box-shadow: ${t.sys.shadow[1]};

      &:hover {
        box-shadow: ${t.sys.shadow[2]};
      }
    }
  `}function o(t){return e.css`
    .group-buttons {
      display: flex;
      gap: ${t.sys.spacing(2)};
      padding-bottom: ${t.sys.spacing(2)};
    }

    .btn {
      flex: 1;
    }

    .dropdown {
      padding-bottom: ${t.sys.spacing(4)};
    }
  `}function r(t){return e.css`
    .drawTool {
      display: flex;
      gap: ${t.sys.spacing(2)};
    }
  `}var a=s(686),l=s(321);function c({dataSource:t,variables:n,handleVarClick:o}){return t?n.map(((t,n)=>e.React.createElement(e.React.Fragment,null,e.React.createElement(l.DropdownItem,{key:n,value:t,onClick:()=>o(t)},t)))):null}function u({sourceVariables:t,handleVarClick:n}){if(!t)throw new Error("sourceVariables is null or undefined");const o=Object.entries(t).flatMap((([e,t])=>(null==t?void 0:t.map((t=>`${e}: ${t}`)))||[]));return e.React.createElement(e.React.Fragment,null,o.map(((t,o)=>e.React.createElement(l.DropdownItem,{key:o,value:t,onClick:()=>n(t)},t))))}function d({zones:t,handleZoneClick:n}){return t?t.map(((t,o)=>{var r,a;return e.React.createElement(e.React.Fragment,null,e.React.createElement(l.DropdownItem,{key:o,value:t.title,onClick:()=>n(t)},(null===(r=t.title)||void 0===r?void 0:r.split(" - ")[1])?null===(a=t.title)||void 0===a?void 0:a.split(" - ")[1]:t.title))})):null}function p({dataSources:t,handleDataSourceClick:n}){return e.React.createElement(e.React.Fragment,null,Object.keys(t).map(((t,o)=>e.React.createElement(l.DropdownItem,{key:o,value:t,onClick:()=>n(t)},t))))}var m=s(972);function f({min:t,max:o,value:r,step:a,onChange:s,theme:i,disabled:l}){const[c,u]=m.default.useState(r?r.min:t),[d,p]=m.default.useState(r?r.max:o);m.default.useEffect((()=>{r&&(u(r.min),p(r.max))}),[r]);const f=(c-t)/(o-t)*100,y=(d-t)/(o-t)*100;return(0,e.jsx)("div",{css:n(i)},(0,e.jsx)("div",{className:"wrapper"},(0,e.jsx)("div",{className:"input-wrapper"},(0,e.jsx)("input",{disabled:l,className:"input",type:"range",value:c,min:t,max:o,step:a,onChange:e=>{e.preventDefault();const t=Math.min(+e.target.value,d-a);r||u(t),s({min:t,max:d})}}),(0,e.jsx)("input",{disabled:l,className:"input",type:"range",value:d,min:t,max:o,step:a,onChange:e=>{e.preventDefault();const t=Math.max(+e.target.value,c+a);r||p(t),s({min:c,max:t})}})),(0,e.jsx)("div",{className:"control-wrapper"},(0,e.jsx)("div",{className:"control",style:{left:`${f}%`}}),(0,e.jsx)("div",{className:"control-label",style:{left:`${f}%`}},c),(0,e.jsx)("div",{className:"rail"},(0,e.jsx)("div",{className:"inner-rail",style:{left:`${f}%`,right:100-y+"%"}})),(0,e.jsx)("div",{className:"control",style:{left:`${y}%`}}),(0,e.jsx)("div",{className:"control-label",style:{left:`${y}%`}},d))))}var y=function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function s(e){try{l(o.next(e))}catch(e){a(e)}}function i(e){try{l(o.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,i)}l((o=o.apply(e,t||[])).next())}))};const h=({jmv:t,activeLayer:n,handleDraw:o,theme:s,group_id:i})=>{const l=(0,m.useRef)(null),c=(0,m.useRef)(null),u=(0,m.useRef)(null);console.log(s),(0,m.useEffect)((()=>(t&&n&&(0,a.loadArcGISJSAPIModules)(["esri/widgets/Sketch/SketchViewModel","esri/layers/GraphicsLayer"]).then((([e,r])=>{const a=new r;t.view.map.add(a),u.current=a;const l=new e({layer:a,view:t.view,activeFillSymbol:{type:"simple-fill",color:s.colors.secondary,style:"solid",outline:{color:s.colors.primary,width:"2px"}},polygonSymbol:{type:"simple-fill",color:s.colors.primary,symbolLayers:[{type:"fill",material:{color:s.colors.primary},outline:{color:s.colors.primary,size:"2px"}}]},pointSymbol:{type:"simple-marker",style:"circle",size:10,color:s.colors.secondary,outline:{color:s.colors.primary,size:10}}});l.on(["create","update"],(e=>y(void 0,void 0,void 0,(function*(){var r;if("complete"===e.state){console.log(e);const s=(null===(r=e.graphic)||void 0===r?void 0:r.geometry)||e.graphics[0].geometry;console.log(s);function l(e){return y(this,void 0,void 0,(function*(){const t={spatialRelationship:"intersects",geometry:e,outFields:["name, zone_name, objectid"],returnGeometry:!1};let r;try{r=yield n.queryFeatures(t),r.features.length||(console.warn("No results found with the first query. Retrying with a modified query."),t.outFields=["zone_name, objectid"],r=yield n.queryFeatures(t)),r.features.length>0&&console.log("Query Results:",r.features)}catch(e){try{console.warn("No results found with the first query. Retrying with a modified query."),t.outFields=["zone_name, objectid"],r=yield n.queryFeatures(t)}catch(e){console.error(e)}}if(r.features.length>=500)return void alert("More than 500 features selected - please select smaller zone.");const a=r.features.map((e=>({label:e.attributes.name,value:e.attributes.zone_name,objectid:e.attributes.objectid})));console.log(a),o(a,i)}))}yield l(s),t.view.map.remove(a)}})))),c.current=l})),()=>{c.current&&(c.current.destroy(),c.current=null),u.current&&(t.view.map.remove(u.current),u.current=null)})),[t,n]);return(0,e.jsx)("div",{css:r(s),className:"drawTool",ref:l},(0,e.jsx)("button",{className:"esri-widget--button esri-icon-polygon",onClick:()=>{c.current&&c.current.create("polygon")}}),(0,e.jsx)("button",{className:"esri-widget--button esri-icon-map-pin",onClick:()=>{c.current&&c.current.create("point")}}))};var g=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};function v({group:e,selectedZones:t,polygons:n=[],handleZoneSubsetClick:o,jmv:r,activeLayer:a,theme:s}){const[i,c]=(0,m.useState)(Date.now());(0,m.useEffect)((()=>{c(Date.now())}),[n]);return m.default.createElement("div",{style:{display:"flex",width:"90%",paddingBottom:"16px"}},m.default.createElement(l.AdvancedSelect,{key:i,staticValues:n,selectedValues:t,placeholder:"please select",onChange:function(t){if(t&&(t=t.map((e=>{const t=n.find((t=>t.value==e.value)),o=t?Object.assign(Object.assign({},e),{objectid:t.objectid}):e,{render:r}=o;return g(o,["render"])}))),t)if(t.some((e=>"select_all"==e.value))){const t=n.filter((e=>"select_all"!==e.value));o(t,e)}else t.length&&o(t,e);else o([],e)},isMultiple:!0,hideBottomTools:!1,hideSearchInput:!1,sortValuesByLabel:!0,customDropdownButtonContent:e=>0===t.length?"Select Zones":1===t.length?t[0].label:t.length===n.length-1?"All Zones Selected":`${t.length} Zones Selected`}),m.default.createElement(h,{jmv:r,activeLayer:a,handleDraw:o,theme:s,group_id:e}))}function b({jmv:e,activeLayer:t,handleDraw:n,theme:o,group_id:r,selectedZones:a}){const s=r;return m.default.createElement("div",{style:{display:"flex",width:"90%",paddingBottom:"16px",gap:"16px"}},m.default.createElement(l.Button,null,a.length?`Group ${s}: ${a.length} Tiles`:`Group ${s}`),m.default.createElement(h,{jmv:e,activeLayer:t,handleDraw:n,theme:o,group_id:r}))}function x({zone:t,zoneSubsets:n,handleZoneSubsetClick:r,jmv:a,theme:s,setZoneSubsets:i,multGroups:c,setMultGroups:u}){const d=()=>{i((e=>[...e,{groupId:e.length+1,polygons:[]}]))},p=()=>{const e=n.length;i((t=>t.filter((t=>t.groupId!==e))))},f=()=>(0,e.jsx)("div",{className:"group-buttons"},(0,e.jsx)(l.Button,{className:"btn",onClick:d},"Add Group"),(0,e.jsx)(l.Button,{className:"btn",disabled:n.length<2,onClick:p},"Delete Group")),y=t.dataset&&0===t.polygons.length;return m.default.useEffect((()=>{y&&!c&&u(!0)}),[y,c,u]),(0,e.jsx)("div",{css:o(s)},(0,e.jsx)(l.Label,null,(0,e.jsx)(l.Checkbox,{checked:c,onChange:e=>{u(e.target.checked),i((e=>e.filter((e=>1===e.groupId))))},disabled:y})," Compare Groups"),(0,e.jsx)("br",null),t.dataset?t.polygons.length>0?(0,e.jsx)(m.default.Fragment,null,n.map((n=>(0,e.jsx)("div",{key:n.groupId},c&&(0,e.jsx)("span",null,(0,e.jsx)("strong",null,"Group ",n.groupId)),(0,e.jsx)(v,{group:n.groupId,polygons:t.polygons,selectedZones:n.polygons,handleZoneSubsetClick:r,jmv:a,activeLayer:t.dataset,theme:s})))),c&&(0,e.jsx)(f,null)):(0,e.jsx)(m.default.Fragment,null,n.map((n=>(0,e.jsx)("div",{key:n.groupId},c&&(0,e.jsx)("p",null,"Group ",n.groupId),(0,e.jsx)(b,{jmv:a,activeLayer:t.dataset,handleDraw:r,theme:s,group_id:n.groupId,selectedZones:n.polygons})))),c&&(0,e.jsx)(f,null)):(0,e.jsx)(l.Dropdown,{className:"dropdown",style:{paddingBottom:"16px"}},(0,e.jsx)(l.DropdownButton,{disabled:!0},"Select Zone Dataset")))}var w,j=function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function s(e){try{l(o.next(e))}catch(e){a(e)}}function i(e){try{l(o.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,i)}l((o=o.apply(e,t||[])).next())}))};function S(e,t,n){return j(this,void 0,void 0,(function*(){const o={};return yield Promise.all(Object.keys(n).map((r=>j(this,void 0,void 0,(function*(){const a=n[r].map((e=>`${e}`)).join(", "),s=yield function(e,t,n){return j(this,void 0,void 0,(function*(){if(!n)return[];const o=yield e.view.whenLayerView(t),r={where:`objectid IN (${n})`,outFields:["objectid"],returnGeometry:!0};return(yield o.layer.queryFeatures(r)).features.map((e=>({oid:e.attributes.objectid,geom:e.geometry})))}))}(e,t.dataset,a),i=parseInt(r,10);o[i]||(o[i]=[]),s.length&&o[i].push(...s)}))))),o}))}function R(e,t,n,o){return j(this,arguments,void 0,(function*(e,t,n,o,r=!0){const[s,i]=yield(0,a.loadArcGISJSAPIModules)(["esri/layers/GraphicsLayer","esri/Graphic"]);let l=t[n];l||(l=new s({title:`New Group ${n}`,id:`groupLayer-${n}`}),e.view.map.add(l));const c=function(e,t=!0){return t?{1:[255,0,0,.4],2:[0,255,0,.4],3:[0,0,255,.4],4:[255,165,0,.4],5:[128,0,128,.4],6:[0,255,255,.4],7:[255,192,203,.4],8:[165,42,42,.4]}[e]||[255,255,0,.4]:[0,122,194,.4]}(parseInt(n,10),r),u=o.map((e=>new i({geometry:e.geom,symbol:{type:"simple-fill",color:c,style:"solid",outline:{color:[255,255,255],width:0}},attributes:{oid:e.oid}})));return l.removeAll(),l.addMany(u),l}))}function $(e,t,n){const o=t[n];o&&(e.view.map.remove(o),delete t[n])}function E(e,t,n,o,r,a=!0){const s=(0,m.useRef)(n),i=(0,m.useRef)(o),l=(0,m.useRef)(t.dataset);(0,m.useEffect)((()=>{s.current=n,i.current=o})),(0,m.useEffect)((()=>{if(l.current&&t.dataset!==l.current){const t=i.current;Object.keys(t).forEach((n=>{const o=t[n];o&&e&&e.view.map.remove(o)})),r({})}l.current=t.dataset}),[t.dataset,e,r]),(0,m.useEffect)((()=>{if(!e||!t.dataset)return;const o=n.filter((e=>e.polygons&&e.polygons.length>0)),s=o.reduce(((e,t)=>{e[t.groupId]||(e[t.groupId]=[]);const n=t.polygons.map((e=>e.objectid));return e[t.groupId].push(...n),e}),{});!function(e){j(this,arguments,void 0,(function*({zone:e,zoneOids:t,graphicsLayers:n,jmv:o,onGraphicsLayersUpdate:r,isMultiGroup:a=!0}){const s=yield S(o,e,t),i=Object.assign({},n);for(const e of Object.keys(s))if(s[e].length>0){const t=yield R(o,i,e,s[e],a);i[e]=t}else $(o,i,e);for(const e of Object.keys(i))Object.keys(s).includes(e)||$(o,i,e);r(i)}))}({zone:t,zoneOids:s,graphicsLayers:i.current,jmv:e,onGraphicsLayersUpdate:r,isMultiGroup:a});const l=i.current;Object.keys(l).forEach((t=>{if(!o.find((e=>String(e.groupId)===t))){const n=l[t];n&&e.view.map.remove(n)}}))}),[e,t,n,r,a])}!function(e){e[e.TIME_SERIES=0]="TIME_SERIES",e[e.SCATTER=1]="SCATTER"}(w||(w={}));var C=function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function s(e){try{l(o.next(e))}catch(e){a(e)}}function i(e){try{l(o.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,i)}l((o=o.apply(e,t||[])).next())}))};function I(e,t,n,o,r,a,s,i){(0,m.useEffect)((()=>{if(!e.dataset||!t.source)return;const l=e.tables.find((e=>e.title.includes(t.source.split(" ")[1]))),c=n?e.tables.find((e=>e.title.includes(n.split(":")[0].split(" ")[1]))):void 0;function u(e){return C(this,void 0,void 0,(function*(){try{if("feature"===(null==e?void 0:e.type)){yield e.load();const t=e.createQuery();t.returnDistinctValues=!0,t.outFields=["stdtime"];const n=yield e.queryFeatures(t);return n.features.map((e=>{return t=e.attributes.stdtime,new Date(t).getUTCFullYear();var t}))}}catch(e){console.error("Error loading table:",e)}}))}(()=>{C(this,void 0,void 0,(function*(){const e=yield u(l);if(!e)return;const t=c&&1===o?yield u(c):void 0,n=t?e.filter((e=>t.includes(e))):e,d=Math.min(...n),p=Math.max(...n);if(s(n),!n.includes(a.min)||!n.includes(a.max)||a.min===Math.min(...r)||a.max===Math.max(...r)){const e=Object.assign(Object.assign({},a),{min:n.includes(a.min)&&a.min!==Math.min(...r)?a.min:d,max:n.includes(a.max)&&a.max!==Math.max(...r)?a.max:p});i(e)}}))})()}),[e.dataset,t.source,n,o])}var k=function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function s(e){try{l(o.next(e))}catch(e){a(e)}}function i(e){try{l(o.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,i)}l((o=o.apply(e,t||[])).next())}))};function D(e,t,n,o){return k(this,void 0,void 0,(function*(){try{if("feature"===e.type){yield e.load();const r=e.createQuery();r.returnDistinctValues=!0,r.maxRecordCountFactor=5,r.where=t;const a=yield e.queryFeatures(r);return a.features.length===2e3*r.maxRecordCountFactor&&o(`Results for Group ${n+1} may have exceeded query limits (${2e3*r.maxRecordCountFactor} table rows) and data may be truncated. Consider limiting time range or geographic area.`),a.features.map((e=>e.attributes))}}catch(e){throw console.error("Error loading table:",e),e}}))}function A(e){return k(this,void 0,void 0,(function*(){return e.plotType===w.TIME_SERIES?yield function(e){return k(this,void 0,void 0,(function*(){const{zone:t,dataSource:n,zoneSubsets:o,var1:r,tableQuery:a,onWarning:s,onError:i}=e,l=o.some((e=>e.polygons&&e.polygons.length>0));if(!(t.dataset&&n.source&&l&&r))return i("Please select a zone, data source, and variable before querying."),null;const c=t.tables.find((e=>e.title.includes(n.source.split(" ")[1])));return c?[yield Promise.all(a.map(((e,t)=>k(this,void 0,void 0,(function*(){return yield D(c,e,t,s)})))))]:(console.error("No matching table found."),null)}))}(e):e.plotType===w.SCATTER?function(e){return k(this,void 0,void 0,(function*(){const{zone:t,dataSource:n,zoneSubsets:o,var1:r,var2:a,tableQuery:s,onWarning:i,onError:l,onAncillaryChange:c}=e,u=o.some((e=>e.polygons&&e.polygons.length>0));if(!(t.dataset&&n.source&&u&&r&&a))return l("Please select zone, data source, both variables before querying."),null;const d=t.tables.find((e=>e.title.includes(n.source.split(" ")[1])));let p;return a.toLowerCase().includes("ancillary")?(p=t.tables.find((e=>e.title.toLowerCase().includes("ancillary"))),c(!0)):(p=t.tables.find((e=>e.title.includes(a.split(":")[0].split(" ")[1]))),c(!1)),d&&p?[yield Promise.all(s.map(((e,t)=>k(this,void 0,void 0,(function*(){return yield D(d,e[0],t,i)}))))),yield Promise.all(s.map(((e,t)=>k(this,void 0,void 0,(function*(){return yield D(p,e[1],t,i)})))))]:(console.error("Error fetching table(s)."),null)}))}(e):null}))}var M=function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function s(e){try{l(o.next(e))}catch(e){a(e)}}function i(e){try{l(o.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,i)}l((o=o.apply(e,t||[])).next())}))};function z(e){return M(this,void 0,void 0,(function*(){var t;const{layerItem:n,jmv:o,currentZone:r,onZoneUpdate:a,onZoneSubsetsReset:s}=e;if((null===(t=r.dataset)||void 0===t?void 0:t.title)!==n.title){r.dataset&&(r.dataset.visible=!1,s());try{const e=yield function(e){return M(this,void 0,void 0,(function*(){const t=e.createQuery();t.returnGeometry=!1;try{return t.outFields=["name, zone_name, objectid"],yield e.queryFeatures(t)}catch(n){t.outFields=["zone_name, objectid"];try{return yield e.queryFeatures(t)}catch(e){throw console.error("Zone query failed:",e),e}}}))}(n);let t=[];e.features.length<2e3&&(t=function(e){return Array.isArray(e.features)?[{label:"\u200b Select All",value:"select_all",objectid:null},...e.features.map((e=>({label:e.attributes.name||e.attributes.zone_name||"Unnamed Polygon",value:e.attributes.zone_name||"No Code",objectid:e.attributes.objectid||0}))).sort(((e,t)=>e.label.localeCompare(t.label)))]:[]}(e));const r=function(e,t,n){return{dataset:e,title:e.title.split(" - ")[1],tables:t.view.map.tables.toArray().filter((t=>t.url===e.url)),polygons:n}}(n,o,t);a(r),n.visible=!0,n.outFields=["*"]}catch(e){throw console.error("Zone query error:",e),e}}}))}var N=function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function s(e){try{l(o.next(e))}catch(e){a(e)}}function i(e){try{l(o.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,i)}l((o=o.apply(e,t||[])).next())}))};function T(n){var o;const[r,s]=e.React.useState(null),[i,y]=e.React.useState([]),[h,g]=e.React.useState({dataset:null,title:"",tables:[],polygons:[]}),[v,b]=e.React.useState([{groupId:1,polygons:[]}]),[j,S]=e.React.useState({}),[R,$]=e.React.useState(!1),[k,D]=e.React.useState(null),[M,T]=e.React.useState(null),[_,P]=e.React.useState(""),[O,F]=e.React.useState([]),[G,L]=e.React.useState(""),[Z,V]=e.React.useState(!1),[q,B]=e.React.useState({source:"",variables:[]}),[Q,W]=e.React.useState([]),[J,U]=e.React.useState(w.TIME_SERIES),[Y,X]=e.React.useState([2e3,2025]),[H,K]=e.React.useState({min:Math.min(...Y),max:Math.max(...Y)}),[ee,te]=e.React.useState([]);e.React.useEffect((()=>{n.dispatch(e.appActions.widgetStatePropChange("widget_comms","dataTable",Q))}),[Q]),E(r,h,v,j,S,R),I(h,q,G,J,Y,H,X,K),function(e,t,n,o,r,a,s,i){(0,m.useEffect)((()=>{if(!e.dataset||!t.source||!n)return;const l=[],c=a.filter((e=>e.polygons&&e.polygons.length>0));for(let e=0;e<c.length;e++){const t=c[e].polygons.map((e=>`'${e.value}'`)).join(", ");if(r===w.TIME_SERIES){const e=`zone_name IN (${t}) AND variable = '${n}' AND stdtime >= date '${s.min}-01-01' AND stdtime <= date '${s.max}-01-01'`;l.push(e)}else if(r===w.SCATTER){const e=`zone_name IN (${t}) AND variable = '${n}' AND stdtime >= date '${s.min}-01-01' AND stdtime <= date '${s.max}-01-01'`,r=`zone_name IN (${t}) AND variable = '${o.split(": ")[1]}' AND stdtime >= date '${s.min}-01-01' AND stdtime <= date '${s.max}-01-01'`;l.push([e,r])}}i(l)}),[e,t,a,r,n,o,s])}(h,q,_,G,J,v,H,te),function(e,t,n,o){(0,m.useEffect)((()=>{var r;if(!e.dataset||!t||!n.config.AllowedCombinations)return;const a=(null===(r=n.config.AllowedCombinations[t])||void 0===r?void 0:r.asMutable())||{},s=e.tables.find((e=>e.title.toLowerCase().includes("ancillary")));if(s){const e=s.createQuery();e.where="1=1",e.returnDistinctValues=!0,e.outFields=["variable"];const t=e=>C(this,void 0,void 0,(function*(){try{return yield s.queryFeatures(e)}catch(e){return console.error("Error querying ancillary data:",e),null}}));t(e).then((e=>{if(e){const t=[...new Set(e.features.map((e=>e.attributes.variable)))];o(Object.assign(Object.assign({},a),{"Ancillary Data":t}))}}))}else o(a)}),[e,t])}(h,_,n,F),function(e,t,n){(0,m.useEffect)((()=>{e.source&&n("")}),[e.source,t])}(q,_,L),function(e,t,n,o){(0,m.useEffect)((()=>{if(!e.source||!n.DataSources)return;const r=n.DataSources[e.source];r&&!r.variables.includes(t)&&o(null)}),[e.source])}(q,_,n.config,P);const ne=(e,t,n)=>{U(n)};return n.useMapWidgetIds&&0!==n.useMapWidgetIds.length?(0,e.jsx)("div",{css:t(n.theme)},1===n.useMapWidgetIds.length&&(0,e.jsx)(a.JimuMapViewComponent,{useMapWidgetId:null===(o=n.useMapWidgetIds)||void 0===o?void 0:o[0],onActiveViewChange:e=>{e&&e.view.map&&(s(e),y(null==e?void 0:e.view.map.layers.toArray().filter((e=>"feature"===e.type))))}}),k&&(0,e.jsx)(l.Alert,{type:"error",form:"basic",size:"small",text:k,onClose:()=>D(null),closable:!0,withIcon:!0,open:!0}),M&&(0,e.jsx)(l.Alert,{type:"warning",form:"basic",size:"small",text:M,onClose:()=>T(null),closable:!0,withIcon:!0,open:!0}),(0,e.jsx)("h3",null,"Area of Interest"),(0,e.jsx)(l.Dropdown,{className:"dropdown"},(0,e.jsx)(l.DropdownButton,null,(null==h?void 0:h.dataset)?h.title:"Feature Layers"),(0,e.jsx)(l.DropdownMenu,null,(0,e.jsx)(d,{zones:i,handleZoneClick:function(e){z({layerItem:e,jmv:r,currentZone:h,onZoneUpdate:g,onZoneSubsetsReset:()=>b([{groupId:1,polygons:[]}])})}}))),(0,e.jsx)("h4",null,"Zone Selection"),(0,e.jsx)(x,{zone:h,zoneSubsets:v,handleZoneSubsetClick:function(e,t){const n=[...e.filter((e=>"select_all"!==e.value))];b((e=>e.map((e=>e.groupId===t?Object.assign(Object.assign({},e),{polygons:n}):e))))},jmv:r,theme:n.theme,setZoneSubsets:b,multGroups:R,setMultGroups:$}),(0,e.jsx)("h3",null,"Primary Data Source"),(0,e.jsx)(l.Dropdown,{className:"dropdown"},(0,e.jsx)(l.DropdownButton,null,q.source?q.source:"Select Data Source"),(0,e.jsx)(l.DropdownMenu,null,(0,e.jsx)(p,{dataSources:n.config.DataSources,handleDataSourceClick:function(e){B({source:e,variables:Array.from(n.config.DataSources[e].variables)})}}))),(0,e.jsx)("h4",null,"Primary Variable"),(0,e.jsx)(l.Dropdown,{className:"dropdown"},(0,e.jsx)(l.DropdownButton,{disabled:!q.source},q.source&&_?_:"Please Select"),(0,e.jsx)(l.DropdownMenu,null,(0,e.jsx)(c,{dataSource:q.source,variables:q.variables,handleVarClick:function(e){P(e)}}))),(0,e.jsx)("h4",null,"Secondary Variable "),(0,e.jsx)(l.Dropdown,{className:"dropdown"},(0,e.jsx)(l.DropdownButton,{disabled:J!==w.SCATTER||!q.source||!_},q.source&&G?G:"Please Select"),(0,e.jsx)(l.DropdownMenu,null,(0,e.jsx)(u,{sourceVariables:O,handleVarClick:function(e){L(e)}}))),(0,e.jsx)("h4",null,"Type of Plot"),(0,e.jsx)(l.Label,null,(0,e.jsx)(l.Radio,{name:"timeseries",checked:J===w.TIME_SERIES,onChange:(e,t)=>{ne(0,0,w.TIME_SERIES)}}),"Time Series"),(0,e.jsx)("br",null),(0,e.jsx)(l.Label,null,(0,e.jsx)(l.Radio,{name:"scatterplot",checked:J===w.SCATTER,onChange:(e,t)=>{ne(0,0,w.SCATTER)}}),"Scatter Plot"),(0,e.jsx)("h4",null,"Time Range"),Y&&(0,e.jsx)("div",null,(0,e.jsx)(f,{disabled:!q.source,min:Math.min(...Y),max:Math.max(...Y),step:1,value:H,onChange:K,theme:n.theme})),(0,e.jsx)(l.Button,{onClick:function(){return N(this,void 0,void 0,(function*(){const t=yield A({zone:h,dataSource:q,zoneSubsets:v,var1:_,var2:G,plotType:J,tableQuery:ee,onWarning:T,onError:D,onAncillaryChange:V});t&&(W(t),n.dispatch(e.appActions.widgetStatePropChange("widget_comms","plotType",J)),n.dispatch(e.appActions.widgetStatePropChange("widget_comms","ancillary",Z)),n.dispatch(e.appActions.widgetStatePropChange("widget_comms","multGroups",R)))}))},disabled:0===ee.length,size:"default"},"Generate Table")):(0,e.jsx)("div",{css:t(n.theme)},(0,e.jsx)(l.Alert,{type:"info",form:"basic",size:"small",text:"Please configure a map widget in the widget settings.",withIcon:!0,open:!0}))}function _(e){s.p=e}})(),i})())}}}));