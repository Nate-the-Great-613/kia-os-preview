
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var sym=function(n,label){return '<svg class="sym" '+(label?'role="img" aria-label="'+label+'"':'aria-hidden="true"')+'><use href="#s-'+n+'"/></svg>'};
var chev='<svg class="chev" width="8" height="14" aria-hidden="true"><use href="#chev"/></svg>';
var SYMLABEL={alert:'Urgent',clock:'Needs attention',ask:'Waiting for your answer',ok:'Fine',pause:'On hold'};

/* ───── demo data (KIA's public demo agency) ───── */
var E=[
 {id:'hollow',name:'Hollow Oak Market',type:'Market',street:'1205 Avenue J',city:'Brooklyn',st:'alert',stText:'Flagged',hours:'8:00 AM to 9:00 PM',rc:'Rabbi Meir Kaplan',mash:['Moshe Katzman','Dovi Gluck'],visit:'The last one was November 7. The next is due in 10 days.'},
 {id:'kestrel',name:'Kestrel Farms Commissary',type:'Parve kitchen',street:'240 Moonachie Ave',city:'Moonachie',st:'ask',stText:'Pending review',hours:null,rc:'Rabbi Meir Kaplan',mash:[],visit:'None yet.'},
 {id:'harbor',name:'Harborview Summer Grill',type:'Meat restaurant',street:'311 Ocean Ave',city:'Lakewood',st:'pause',stText:'On hold',hours:null,rc:'Rabbi Meir Kaplan',mash:[],visit:'None scheduled while on hold.'},
 {id:'bloomfield',name:'Bloomfield Creamery',type:'Dairy restaurant',street:'1889 Coney Island Ave',city:'Brooklyn',st:'ok',stText:'Approved',hours:'12:00 PM to 10:00 PM',rc:'Rabbi Meir Kaplan',mash:['Chaim Perlow','Avi Rosenberg'],visit:'The last one was November 7.'},
 {id:'cloudberry',name:'Cloudberry Dairy Café',type:'Dairy restaurant',street:'1023 Kings Hwy',city:'Brooklyn',st:'ok',stText:'Approved',hours:'7:00 AM to 9:00 PM',rc:'Rabbi Meir Kaplan',mash:['Avi Rosenberg','Chaim Perlow'],visit:'The next is due in 16 days.'},
 {id:'ember',name:'Golden Ember Grill House',type:'Meat restaurant',street:'63-42 108th St',city:'Forest Hills',st:'ok',stText:'Approved',hours:'12:00 PM to 11:00 PM',rc:'Rabbi Meir Kaplan',mash:['Sruly Halpern','Shloimy Weiss'],visit:'Every 2 weeks. The last one was November 9. The next is due in 12 days.',std:'Glatt',setup:{loc:'MG-2692, expires July 29, 2027',onb:'5 of 12 done',web:'Listed',mail:'Off'}},
 {id:'butchers',name:'Maple Glen Glatt Butchers',type:'Butcher',street:'4811 13th Ave',city:'Brooklyn',st:'ok',stText:'Approved',hours:'6:00 AM to 2:00 PM',rc:'Rabbi Meir Kaplan',mash:['Dovi Gluck','Chaim Perlow'],visit:'The last one was November 4.'},
 {id:'perla',name:'Perla’s Deli & Provisions',type:'Deli',street:'72-38 Main St',city:'Flushing',st:'ok',stText:'Approved',hours:'10:00 AM to 8:00 PM',rc:'Rabbi Meir Kaplan',mash:['Moshe Katzman','Sruly Halpern'],visit:'On schedule.'},
 {id:'silver',name:'Silver Fig Sushi',type:'Sushi restaurant',street:'1410 Avenue M',city:'Brooklyn',st:'ok',stText:'Approved',hours:'11:00 AM to 9:00 PM',rc:'Rabbi Meir Kaplan',mash:['Moshe Katzman'],visit:'The next is due in 16 days.'},
 {id:'brass',name:'The Brass Pomegranate',type:'Meat restaurant',street:'212 W 45th St',city:'New York',st:'ok',stText:'Approved',hours:'11:00 AM to 11:00 PM',rc:'Rabbi Yaakov Feldman',mash:['Yossi Friedman','Naftali Berger'],visit:'The last one was November 10. The next is due in 13 days.'},
 {id:'gates',name:'Twelve Gates Bakery',type:'Bakery',street:'455 Central Ave',city:'Cedarhurst',st:'ok',stText:'Approved',hours:null,rc:'Rabbi Yaakov Feldman',mash:['Dovi Gluck','Avi Rosenberg'],visit:'The last one was November 7.'},
 {id:'rivers',name:'Two Rivers Fish House',type:'Fish restaurant',street:'969 W Beech St',city:'Long Beach',st:'ok',stText:'Approved',hours:'11:00 AM to 9:00 PM',rc:'Rabbi Meir Kaplan',mash:['Sruly Halpern'],visit:'On schedule.'},
 {id:'vine',name:'Vine & Fig Wine Room',type:'Wine room',street:'138 Cedarhurst Ave',city:'Cedarhurst',st:'ok',stText:'Approved',hours:'5:00 PM to 11:00 PM',rc:'Rabbi Yaakov Feldman',mash:['Yossi Friedman'],visit:'The next is due in 18 days.'},
 {id:'willow',name:'Willow & Sage Catering',type:'Caterer',street:'5620 New Utrecht Ave',city:'Brooklyn',st:'ok',stText:'Approved',hours:null,rc:'Rabbi Meir Kaplan',mash:['Shloimy Weiss'],visit:'The last one was November 6.'}
];
var byId={};E.forEach(function(e){byId[e.id]=e});
var P=[
 {name:'Rabbi Dovid Stern',role:'Owner',you:true},
 {name:'Rabbi Meir Kaplan',role:'Coordinator'},
 {name:'Rabbi Yaakov Feldman',role:'Coordinator'},
 {name:'Avi Rosenberg',role:'Mashgiach',phone:'(718) 555-0143',kia:true},
 {name:'Chaim Perlow',role:'Mashgiach',phone:'(929) 555-0122',kia:false},
 {name:'Dovi Gluck',role:'Mashgiach',phone:'(347) 555-0189',kia:true},
 {name:'Moshe Katzman',role:'Mashgiach',phone:'(646) 555-0177',kia:true},
 {name:'Naftali Berger',role:'Mashgiach',kia:true},
 {name:'Shloimy Weiss',role:'Senior mashgiach',kia:true},
 {name:'Sruly Halpern',role:'Mashgiach',kia:true},
 {name:'Yossi Friedman',role:'Senior mashgiach',kia:true}
];
var SH=[ /* tomorrow's shifts */
 ['5:30 AM to 1:00 PM','Dovi Gluck','gates'],['6:00 AM to 2:00 PM','Chaim Perlow','butchers'],['7:00 AM to 2:30 PM','Avi Rosenberg','cloudberry'],
 ['10:00 AM to 5:00 PM','Shloimy Weiss','willow'],['10:30 AM to 5:00 PM','Yossi Friedman','brass'],
 ['11:00 AM to 8:30 PM','Moshe Katzman','silver'],['12:00 PM to 11:00 PM','Sruly Halpern','ember'],['4:45 PM to 11:00 PM','Naftali Berger','brass']];
var DAYS=[['Friday, November 13','5 shifts','Community Siyum, 6:30 PM'],['Sunday, November 15','9 shifts','Hollander Sheva Brachos, 6:30 PM'],['Monday, November 16','8 shifts',''],['Tuesday, November 17','9 shifts',''],['Wednesday, November 18','13 shifts','',{s:'clock',t:'1 open shift',c:'warn'}]];
var EV=[
 ['Community Siyum','Friday, November 13, 6:30 PM · Willow & Sage Catering · 120 guests',{s:'ok',t:'Scheduled'}],
 ['Hollander Sheva Brachos','Sunday, November 15, 6:30 PM · Private home, Flatbush · 60 guests',{s:'ok',t:'Approved'}],
 ['Goldberg Bar Mitzvah','Thursday, November 19, 6:30 PM · Ateres Chaya Hall · 180 guests',{s:'ask',t:'Waiting for approval'}],
 ['Adler–Reisman Wedding','Tuesday, November 24, 6:30 PM · The Grand Cedar · 420 guests',{s:'ok',t:'Scheduled'}]];
var DUE=[['hollow','10 days'],['ember','12 days'],['brass','13 days'],['silver','16 days'],['cloudberry','16 days'],['vine','18 days']];
var R=[ /* records, newest first */
 {d:'Today',k:'Incident',t:'Equipment incident',s:'A new countertop fryer was delivered without approval.',loc:'ember',who:'Sruly Halpern',st:{s:'alert',t:'Open',c:'bad'}},
 {d:'Today',k:'Approval',t:'Prepared Horseradish Sauce',s:'Product approval',loc:'brass',who:'Yossi Friedman',st:{s:'ask',t:'Pending'}},
 {d:'Today',k:'Checklist',t:'Critical checklist answer',s:'One case arrived without a legible hechsher stamp.',loc:'silver',who:'Moshe Katzman',st:{s:'alert',t:'Needs review',c:'bad'}},
 {d:'Today',k:'Checklist',t:'Critical checklist answer',s:'The seal on the back freezer looked disturbed.',loc:'perla',who:'Moshe Katzman',st:{s:'alert',t:'Needs review',c:'bad'}},
 {d:'Today',k:'Checklist',t:'Critical checklist answer',s:'The certificate frame was taken down during painting.',loc:'brass',who:'Yossi Friedman',st:{s:'alert',t:'Needs review',c:'bad'}},
 {d:'November 10',k:'Incident',t:'Unapproved product',s:'Two cases of non-certified yogurt in the cholov yisroel dairy case.',loc:'hollow',who:'Dovi Gluck',st:{s:'alert',t:'Open',c:'bad'}},
 {d:'November 10',k:'Visit',t:'RC visit',s:'No red flags',loc:'brass',who:'Rabbi Yaakov Feldman',st:{s:'ok',t:'Submitted'}},
 {d:'November 10',k:'Approval',t:'Panko Bread Crumbs',s:'Product approval, all establishments',loc:null,who:'Avi Rosenberg',st:{s:'ask',t:'Pending'}},
 {d:'November 9',k:'Visit',t:'RC visit',s:'Report submitted',loc:'ember',who:'Rabbi Meir Kaplan',st:{s:'alert',t:'1 red flag',c:'bad'}},
 {d:'November 9',k:'Approval',t:'Yuzu Ponzu Sauce',s:'Product approval',loc:'silver',who:'Moshe Katzman',st:{s:'ask',t:'Pending'}},
 {d:'November 9',k:'Approval',t:'Concord Grape Juice',s:'Product approval, all establishments',loc:null,who:'Avi Rosenberg',st:{s:'ok',t:'Approved'}},
 {d:'November 8',k:'Incident',t:'Temperature incident',s:'Walk-in #1 read 46°F at opening. Meat was moved to walk-in #2.',loc:'brass',who:'Yossi Friedman',st:{s:'clock',t:'Pending',c:'warn'}},
 {d:'November 7',k:'Visit',t:'RC visit',s:'No red flags',loc:'hollow',who:'Rabbi Meir Kaplan',st:{s:'ok',t:'Submitted'}},
 {d:'November 7',k:'Visit',t:'RC visit',s:'No red flags',loc:'bloomfield',who:'Rabbi Meir Kaplan',st:{s:'ok',t:'Submitted'}},
 {d:'November 7',k:'Visit',t:'RC visit',s:'No red flags',loc:'gates',who:'Rabbi Yaakov Feldman',st:{s:'ok',t:'Submitted'}},
 {d:'November 7',k:'Approval',t:'Oat Milk Barista Blend',s:'Product approval',loc:'cloudberry',who:'Avi Rosenberg',st:{s:'ok',t:'Approved'}},
 {d:'November 6',k:'Visit',t:'RC visit',s:'No red flags',loc:'willow',who:'Rabbi Meir Kaplan',st:{s:'ok',t:'Submitted'}},
 {d:'November 5',k:'Incident',t:'Staff incident',s:'A staff member brought in an unapproved sauce bottle.',loc:'cloudberry',who:'Avi Rosenberg',st:{s:'ok',t:'Resolved'}},
 {d:'November 5',k:'Approval',t:'Smoked Paprika Rub',s:'Product approval',loc:'ember',who:'Sruly Halpern',st:{s:'ok',t:'Approved'}},
 {d:'November 4',k:'Visit',t:'RC visit',s:'No red flags',loc:'butchers',who:'Rabbi Yaakov Feldman',st:{s:'ok',t:'Submitted'}}
];
var N=[ /* what needs the signed-in person */
 {id:'n1',s:'alert',t:'Unapproved product at Hollow Oak Market',d:'Dovi Gluck reported it yesterday. High severity.',label:'Review',go:['est','hollow'],loc:'hollow',short:'Unapproved product'},
 {id:'n2',s:'alert',t:'41 critical checklist answers',d:'The latest are at Silver Fig Sushi, Perla’s Deli & Provisions and The Brass Pomegranate.',label:'Review',go:['records','Checklist']},
 {id:'n3',s:'alert',t:'Equipment incident at Golden Ember Grill House',d:'Sruly Halpern reported a new fryer delivered without approval.',label:'Review',go:['est','ember'],loc:'ember',short:'Equipment incident'},
 {id:'n4',s:'ask',t:'Naftali Berger asks to inspect Golden Ember Grill House',d:'He isn’t assigned there. He asked about 24 hours ago.',label:'Respond',menu:['Approve','Allow One Visit','Hold','Decline'],loc:'ember',short:'Naftali Berger asks to inspect here'},
 {id:'n5',s:'ask',t:'3 product approvals',d:'Horseradish sauce, panko bread crumbs and yuzu ponzu.',label:'Review',go:['records','Approval']},
 {id:'n6',s:'ask',t:'1 catering request',d:'Goldberg Bar Mitzvah, November 19, 180 guests.',label:'Respond',menu:['Approve','Ask for Changes','Decline']}
];
var LOCN={brass:[{id:'l2',s:'ask',t:'Product approval',d:'Yossi Friedman asked about Prepared Horseradish Sauce today.',label:'Review',tab:'Records'}],
 silver:[{id:'l3',s:'ask',t:'Product approval',d:'Moshe Katzman asked about Yuzu Ponzu Sauce on November 9.',label:'Review',tab:'Records'}]};
var PN={'Chaim Perlow':[{id:'p1',s:'clock',t:'KIA course not finished',d:'He started it but has not completed it.',label:'Remind',menu:['Send Reminder']}]};

/* ───── state ───── */
var S={route:'today',id:null,tab:'Overview',sub:'Shifts',filter:'All',status:'All',q:'',view:'List',stack:[],done:{},device:'office',mode:'new',look:'plain',all:false};
var app=$('#app'), win=$('#win');
var initials=function(n){var p=n.replace(/^Rabbi /,'').split(' ');return (p[0][0]+(p[p.length-1][0]||'')).toUpperCase()};
var open=function(list){return list.filter(function(n){return !S.done[n.id]})};
var sitesOf=function(name){return E.filter(function(e){return e.mash.indexOf(name)>-1||e.rc===name})};

/* ───── pieces ───── */
function stateHtml(st){return '<span class="state '+(st.c||'')+'">'+sym(st.s)+esc(st.t)+'</span>'}
function needRows(list,first){
  return list.map(function(n,i){
    var prim=first&&i===0?' primary':'';
    var btn=n.menu?'<button class="pill'+prim+'" data-menu="'+n.id+'" aria-haspopup="menu">'+esc(n.label)+'</button>'
      :'<button class="pill'+prim+'" data-need="'+n.id+'">'+esc(n.label)+'</button>';
    return '<div class="row">'+sym(n.s,SYMLABEL[n.s])+'<div class="main"><div class="t">'+esc(n.short&&S.route==='est'?n.short:n.t)+'</div><div class="d">'+esc(n.d)+'</div></div>'+btn+'</div>';
  }).join('');
}
function needsBlock(list,first){
  if(!list.length) return '';
  return '<div class="sec"><h2>Needs You</h2><span class="n">'+list.length+'</span></div><div class="group needs">'+needRows(list,first)+'</div>';
}
function estRow(e,live){
  var st=live&&e.st==='ok'?'<span class="state">Closed now</span>':stateHtml({s:e.st,t:e.stText,c:e.st==='alert'?'bad':''});
  return '<button class="row" data-go="est:'+e.id+'">'+(S.look==='visual'?estTile(e):'')+'<div class="main"><div class="t">'+esc(e.name)+'</div><div class="d">'+esc(e.type+' · '+e.city)+'</div></div><span class="trail">'+st+chev+'</span></button>';
}
function recRow(r,hideLoc){
  var where=[!hideLoc&&r.loc?byId[r.loc].name:null,r.who].filter(Boolean).join(' · ');
  return '<div class="row">'+(S.look==='visual'?kindTile(r.k):'')+'<div class="main"><div class="t">'+esc(r.t)+'</div><div class="d">'+esc(r.s)+'</div><div class="d">'+esc(where)+'</div></div><span class="trail" style="flex-direction:column;align-items:flex-end;gap:2px">'+stateHtml(r.st)+'<span>'+esc(r.d)+'</span></span></div>';
}
function personRow(p){
  var n=sitesOf(p.name).length, bits=[p.role+(p.you?' (you)':'')]; if(n) bits.push(n+(n===1?' establishment':' establishments'));
  var st=p.kia===false?stateHtml({s:'clock',t:'KIA course pending',c:'warn'}):'';
  return '<button class="row" data-go="person:'+esc(p.name)+'">'+(S.look==='visual'?face(p.name):'<span class="avatar" aria-hidden="true">'+initials(p.name)+'</span>')+'<div class="main"><div class="t">'+esc(p.name)+'</div><div class="d">'+esc(bits.join(' · '))+'</div></div><span class="trail">'+st+chev+'</span></button>';
}
function segHtml(name,opts,cur,full){
  return '<div class="seg'+(full?' full':'')+'" role="group" aria-label="'+name+'">'+opts.map(function(o){return '<button data-seg="'+name+':'+o+'" aria-pressed="'+(o===cur)+'">'+o+'</button>'}).join('')+'</div>';
}
function topbar(){
  var tabs=[['today','Today'],['schedule','Schedule'],['ests','Establishments'],['people','People'],['records','Records']];
  var cur={est:'ests',person:'people'}[S.route]||S.route;
  return '<header class="topbar"><div class="brand">Maple Glen</div><nav class="tabs" aria-label="Sections">'+tabs.map(function(t){return '<button data-nav="'+t[0]+'"'+(cur===t[0]?' aria-current="page"':'')+'>'+t[1]+'</button>'}).join('')+'</nav>'+
  '<div class="tools"><button class="icon-btn" data-nav="search" aria-label="Search"><svg width="20" height="20" aria-hidden="true"><use href="#i-search"/></svg></button>'+
  '<button class="icon-btn" data-pop="msgs" aria-label="Messages, 3 unread" aria-haspopup="menu"><svg width="22" height="22" aria-hidden="true"><use href="#i-msg"/></svg><span class="badge">3</span></button>'+
  '<button class="icon-btn" data-pop="acct" aria-label="Account: Rabbi Dovid Stern" aria-haspopup="menu"><span class="me">DS</span></button></div></header>';
}

/* ───── pages ───── */
var pages={
 today:function(){
  var n=open(N), six=E.slice(0,6);
  return '<p class="eyebrow">Wednesday, November 11</p><h1 class="title">Today</h1>'+
   (n.length?needsBlock(n,true):'<div class="sec"><h2>Needs You</h2></div><div class="group"><div class="empty">Nothing needs you right now.</div></div>')+
   '<div class="sec"><h2>On Site Now</h2></div><div class="group"><button class="row" data-nav="schedule"><div class="main"><div class="t">Nobody is on shift right now</div><div class="d">The first shift tomorrow starts at 5:30 AM at Twelve Gates Bakery.</div></div><span class="trail">'+chev+'</span></button></div>'+
   '<div class="sec"><h2>Establishments</h2><div class="end">'+segHtml('view',['List','Map'],S.view)+'</div></div>'+
   (S.view==='Map'?'<div class="group"><div class="empty">The map shows the same 14 establishments as pins, with the same statuses. It is not drawn in this preview.</div></div>'
    :'<div class="group wrap">'+six.map(function(e){return estRow(e,true)}).join('')+'<button class="row more" data-nav="ests"><div class="main">Show All 14</div></button></div>');
 },
 schedule:function(){
  var body='', addL={Shifts:'Add Shift',Events:'Add Event',Visits:'Schedule Visit'}[S.sub];
  if(S.sub==='Shifts'){
   var list=S.all?SH:SH.slice(0,4);
   body=needsBlock(open([{id:'s1',s:'clock',t:'1 open shift on Wednesday, November 18',d:'Nobody is assigned yet.',label:'Assign',menu:['Offer to Everyone','Pick a Mashgiach']}]),false)+
    '<div class="sec"><h2>Tomorrow</h2><span class="n">Thursday, November 12</span></div><div class="group wrap">'+list.map(function(s){return '<button class="row" data-go="person:'+s[1]+'"><div class="main"><div class="t">'+esc(s[1])+'</div><div class="d">'+esc(byId[s[2]].name)+'</div></div><span class="trail">'+esc(s[0])+chev+'</span></button>'}).join('')+
    (S.all?'':'<button class="row more" data-all="1"><div class="main">Show All '+SH.length+'</div></button>')+'</div>'+
    '<div class="sec"><h2>Coming Up</h2></div><div class="group wrap">'+DAYS.map(function(d){return '<div class="row"><div class="main"><div class="t">'+esc(d[0])+'</div><div class="d">'+esc(d[1]+(d[2]?' · '+d[2]:''))+'</div></div>'+(d[3]?'<span class="trail">'+stateHtml(d[3])+'</span>':'')+'</div>'}).join('')+'</div>';
  } else if(S.sub==='Events'){
   body=needsBlock(open([N[5]]),false)+'<div class="sec"><h2>Coming Up</h2></div><div class="group wrap">'+EV.map(function(e){return '<div class="row"><div class="main"><div class="t">'+esc(e[0])+'</div><div class="d">'+esc(e[1])+'</div></div><span class="trail">'+stateHtml(e[2])+'</span></div>'}).join('')+'</div>';
  } else {
   body='<div class="sec"><h2>Due Next</h2></div><div class="group wrap">'+DUE.map(function(d){var e=byId[d[0]];return '<button class="row" data-go="est:'+e.id+'"><div class="main"><div class="t">'+esc(e.name)+'</div><div class="d">'+esc(e.rc)+'</div></div><span class="trail">Due in '+d[1]+chev+'</span></button>'}).join('')+'<div class="row"><div class="main" style="color:var(--text2)">6 more are due later. Nothing is overdue.</div></div></div>';
  }
  return '<div class="titlebar"><h1 class="title">Schedule</h1><div class="acts"><button class="act primary" data-todo="'+addL+'">'+addL+'</button></div></div>'+segHtml('sub',['Shifts','Events','Visits'],S.sub,true)+body;
 },
 ests:function(){
  var q=S.q.toLowerCase(), list=E.filter(function(e){return (S.status==='All'||e.stText===S.status)&&(!q||(e.name+' '+e.city+' '+e.type).toLowerCase().indexOf(q)>-1)});
  return '<div class="titlebar"><h1 class="title">Establishments</h1><div class="acts"><button class="act icon" data-pop="more" aria-label="More" aria-haspopup="menu"><svg width="24" height="24" aria-hidden="true"><use href="#i-more"/></svg></button><button class="act primary" data-todo="Add Establishment">Add Establishment</button></div></div>'+
   '<div class="tools-row"><label class="field"><svg width="18" height="18" aria-hidden="true"><use href="#i-search"/></svg><input id="estq" type="search" placeholder="Search establishments" aria-label="Search establishments" value="'+esc(S.q)+'"></label>'+
   '<select class="popup" id="eststatus" aria-label="Status">'+['All','Approved','Flagged','Pending review','On hold'].map(function(o){return '<option value="'+o+'"'+(o===S.status?' selected':'')+'>'+(o==='All'?'All Statuses':o)+'</option>'}).join('')+'</select></div>'+
   '<div class="sec" style="margin-top:20px"><h2>'+(list.length===14?'All 14':list.length+' of 14')+'</h2></div>'+
   (list.length?'<div class="group wrap">'+list.map(function(e){return estRow(e)}).join('')+'</div>':'<div class="group"><div class="empty">No establishment matches. Clear the search or choose All Statuses.</div></div>');
 },
 est:function(){
  var e=byId[S.id], needs=open(N.filter(function(n){return n.loc===e.id}).concat(LOCN[e.id]||[]));
  var recs=R.filter(function(r){return r.loc===e.id}), shift=SH.filter(function(s){return s[2]===e.id})[0];
  var head='<button class="back" data-back="1"><svg width="8" height="14" style="transform:scaleX(-1)" aria-hidden="true"><use href="#chev"/></svg>'+esc(S.backLabel||'Establishments')+'</button><h1 class="title">'+esc(e.name)+'</h1>'+
   '<div class="headline"><span>'+esc(e.type+' · '+e.street+', '+e.city)+'</span>'+stateHtml({s:e.st,t:e.stText,c:e.st==='alert'?'bad':''})+'</div>'+
   '<div class="acts below"><button class="act primary" data-todo="Start Inspection">Start Inspection</button><button class="act" data-todo="Message">Message</button><button class="act" data-todo="Report an Issue">Report an Issue</button></div>'+
   segHtml('tab',['Overview','Records','Notes','Setup'],S.tab,true);
  var kv=function(k,v,go){return go?'<button class="row" data-go="'+go+'"><span class="k">'+k+'</span><span class="v">'+v+'</span>'+chev+'</button>':'<div class="row"><span class="k">'+k+'</span><span class="v">'+v+'</span></div>'};
  if(S.tab==='Overview'){
   return head+needsBlock(needs,false)+'<div class="sec"><h2>Right Now</h2></div><div class="group kv">'+
    kv('On Site','<b>Nobody right now.</b>'+(shift?' The next shift is tomorrow, '+esc(shift[0].split(' to ')[0])+', '+esc(shift[1])+'.':''))+
    kv('Open Today',e.hours?'<b>'+e.hours+'</b>':'Hours are not set.')+
    kv('Coordinator','<b>'+esc(e.rc)+'</b>','person:'+e.rc)+
    kv('Mashgichim',e.mash.length?'<b>'+esc(e.mash.join(', '))+'</b>':'None assigned.')+
    kv('RC Visits',esc(e.visit))+
    (e.std?kv('Standards','<b>'+e.std+'</b>'):'')+'</div>'+
    '<div class="sec"><h2>Recent</h2></div>'+(recs.length?'<div class="group wrap">'+recs.slice(0,3).map(function(r){return recRow(r,true)}).join('')+'<button class="row more" data-seg="tab:Records"><div class="main">Show All Records</div></button></div>':'<div class="group"><div class="empty">Nothing has been recorded here in the last two weeks.</div></div>');
  }
  if(S.tab==='Records') return head+'<div class="sec"><h2>Records</h2></div>'+(recs.length?'<div class="group wrap">'+recs.map(function(r){return recRow(r,true)}).join('')+'</div>':'<div class="group"><div class="empty">Nothing has been recorded here in the last two weeks.</div></div>');
  if(S.tab==='Notes') return head+'<div class="sec"><h2>Notes</h2><div class="end"><button class="pill" data-todo="Add Note">Add Note</button></div></div><div class="group"><div class="empty">No notes yet. Notes are visible to coordinators only.</div></div>';
  var su=e.setup||{}, sr=function(k,v){return '<button class="row" data-todo="'+k+'"><span class="k" style="width:220px">'+k+'</span><span class="v">'+(v||'')+'</span>'+chev+'</button>'};
  return head+'<div class="sec"><h2>Setup</h2></div><div class="group kv">'+sr('Details',esc(e.type))+sr('Hours',e.hours?'Set':'Not set')+sr('Letter of Certification',su.loc||'')+sr('Kosher Standards',e.std||'Agency defaults')+sr('Contract Terms','')+sr('Website Listing',su.web||'')+sr('Weekly Schedule Email',su.mail||'Off')+sr('Clock-In QR Code','')+sr('Onboarding',su.onb||'')+'</div>';
 },
 people:function(){
  var inv=open([{id:'i1',s:'ask',t:'1 invitation not sent',d:'eli.mandel@example.test was added but has not been invited.',label:'Send',menu:['Send Invitation']}]);
  return '<div class="titlebar"><h1 class="title">People</h1><div class="acts"><button class="act primary" data-todo="Add Person">Add Person</button></div></div>'+needsBlock(inv,false)+
   '<div class="sec"><h2>Agency Team</h2></div><div class="group people">'+P.filter(function(p){return !/ashgiach/.test(p.role)}).map(personRow).join('')+'</div>'+
   '<div class="sec"><h2>Mashgichim</h2></div><div class="group people">'+P.filter(function(p){return /ashgiach/.test(p.role)}).map(personRow).join('')+'</div>';
 },
 person:function(){
  var p=P.filter(function(x){return x.name===S.id})[0], sites=sitesOf(p.name), sh=SH.filter(function(s){return s[1]===p.name})[0], recs=R.filter(function(r){return r.who===p.name});
  var isM=/ashgiach/.test(p.role);
  return '<button class="back" data-back="1"><svg width="8" height="14" style="transform:scaleX(-1)" aria-hidden="true"><use href="#chev"/></svg>'+esc(S.backLabel||'People')+'</button><h1 class="title">'+esc(p.name)+'</h1>'+
   '<div class="headline"><span>'+esc(p.role)+(p.phone?' · '+p.phone:'')+'</span></div>'+
   '<div class="acts below"><button class="act primary" data-todo="Message">Message</button></div>'+
   needsBlock(open(PN[p.name]||[]),false)+
   '<div class="sec"><h2>Right Now</h2></div><div class="group kv"><div class="row"><span class="k">On Shift</span><span class="v"><b>No.</b>'+(sh?' The next shift is tomorrow, '+esc(sh[0].split(' to ')[0])+', at '+esc(byId[sh[2]].name)+'.':'')+'</span></div>'+
   (isM?'<div class="row"><span class="k">KIA Course</span><span class="v">'+(p.kia?stateHtml({s:'ok',t:'Completed'}):stateHtml({s:'clock',t:'Not finished',c:'warn'}))+'</span></div>':'')+'</div>'+
   '<div class="sec"><h2>Establishments</h2></div>'+(sites.length?'<div class="group wrap">'+sites.map(function(e){return estRow(e)}).join('')+'</div>':'<div class="group"><div class="empty">None assigned.</div></div>')+
   '<div class="sec"><h2>Recent</h2></div>'+(recs.length?'<div class="group wrap">'+recs.slice(0,4).map(function(r){return recRow(r)}).join('')+'</div>':'<div class="group"><div class="empty">Nothing recorded in the last two weeks.</div></div>');
 },
 records:function(){
  var kinds=['All','Visit','Incident','Approval','Checklist'], names={All:'All Records',Visit:'RC Visits',Incident:'Incidents',Approval:'Product Approvals',Checklist:'Checklist Answers'};
  var list=R.filter(function(r){return S.filter==='All'||r.k===S.filter}), out='', last='';
  list.forEach(function(r){ if(r.d!==last){ out+=(last?'</div>':'')+'<div class="sec"><h2>'+esc(r.d)+'</h2></div><div class="group wrap">'; last=r.d } out+=recRow(r) });
  return '<div class="titlebar"><h1 class="title">Records</h1></div><div class="tools-row"><select class="popup" id="reckind" aria-label="Kind of record">'+kinds.map(function(k){return '<option value="'+k+'"'+(k===S.filter?' selected':'')+'>'+names[k]+'</option>'}).join('')+'</select></div>'+
   (S.filter==='Checklist'?'<p style="color:var(--text2);margin:16px 4px 0">Showing the 3 newest of 41 critical answers.</p>':'')+
   (list.length?out+'</div>':'<div class="group" style="margin-top:20px"><div class="empty">No records of this kind.</div></div>');
 },
 search:function(){
  return '<div class="titlebar"><h1 class="title">Search</h1><div class="acts"><button class="act" data-back="1">Cancel</button></div></div><div class="tools-row"><label class="field"><svg width="18" height="18" aria-hidden="true"><use href="#i-search"/></svg><input id="gq" type="search" placeholder="Search establishments, people and records" aria-label="Search establishments, people and records" value="'+esc(S.gq||'')+'"></label></div><div id="gres">'+searchResults()+'</div>';
 }
};
function searchResults(){
  var q=(S.gq||'').trim().toLowerCase(); if(!q) return '<div class="group" style="margin-top:20px"><div class="empty">Type a name, a city or a kind of record.</div></div>';
  var es=E.filter(function(e){return (e.name+' '+e.city+' '+e.type).toLowerCase().indexOf(q)>-1}), ps=P.filter(function(p){return p.name.toLowerCase().indexOf(q)>-1}), rs=R.filter(function(r){return (r.t+' '+r.s+' '+r.k).toLowerCase().indexOf(q)>-1}).slice(0,5);
  if(!es.length&&!ps.length&&!rs.length) return '<div class="group" style="margin-top:20px"><div class="empty">Nothing matches “'+esc(S.gq)+'”.</div></div>';
  return (es.length?'<div class="sec"><h2>Establishments</h2></div><div class="group wrap">'+es.map(function(e){return estRow(e)}).join('')+'</div>':'')+
   (ps.length?'<div class="sec"><h2>People</h2></div><div class="group people">'+ps.map(personRow).join('')+'</div>':'')+
   (rs.length?'<div class="sec"><h2>Records</h2></div><div class="group wrap">'+rs.map(function(r){return recRow(r)}).join('')+'</div>':'');
}

/* ───── new phone screen ───── */
function phoneHtml(){
  return '<section class="phone" aria-label="Mashgiach phone, on shift"><div class="screen"><div class="scroll">'+
  '<div class="status" aria-hidden="true"><span>1:41</span><span class="island"></span><span class="sys"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2.4" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.500-1.100 1.500-2s-.700-1.700-1.500-2Z" fill="currentColor" opacity=".45"/></svg></span></div>'+
  '<h1 class="p-title">Silver Fig Sushi</h1><div class="shift"><div class="l">On shift since 11:00 AM</div><div class="timer" id="timer">2:41:07</div></div>'+
  '<h2 class="p-sec">Today</h2><div class="group">'+
  '<button class="row" data-todo="Opening Checklist">'+sym('ok','Done').replace('class="sym"','class="sym" style="width:26px;height:26px"')+'<div class="main"><div class="t">Opening Checklist</div><div class="d">Done at 11:08 AM</div></div>'+chev+'</button>'+
  '<div class="row"><svg width="26" height="26" viewBox="0 0 26 26" role="img" aria-label="In progress"><circle cx="13" cy="13" r="10.8" fill="none" stroke="var(--fill2)" stroke-width="2.4"/><path d="M13 2.2a10.8 10.8 0 0 1 7.640 18.440" fill="none" stroke="var(--blue-fill)" stroke-width="2.400" stroke-linecap="round"/></svg><div class="main"><div class="t">During the Shift</div><div class="d">3 of 8 checked</div></div><button class="pill primary" data-todo="Continue">Continue</button></div>'+
  '<div class="row muted"><svg width="26" height="26" viewBox="0 0 26 26" role="img" aria-label="Locked"><rect x="6.5" y="11.5" width="13" height="10" rx="2.6" fill="var(--text3)"/><path d="M9.300 11.500V8.700a3.700 3.700 0 0 1 7.400 0v2.800" fill="none" stroke="var(--text3)" stroke-width="2.200" stroke-linecap="round"/></svg><div class="main"><div class="t">Closing Checklist</div><div class="d">Opens at the end of your shift</div></div></div></div>'+
  '<div class="btns"><button class="btn" data-todo="Report a Problem">Report a Problem</button><button class="btn" data-todo="Ask My RC">Ask My RC</button><button class="btn text" data-todo="Clock Out">Clock Out</button></div></div>'+
  '<nav class="tabbar" aria-label="Sections"><button aria-current="page"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="16" rx="4" fill="currentColor"/><rect x="6.5" y="9.5" width="11" height="8" rx="1.6" fill="var(--surface)"/></svg>Today</button><button data-todo="Lists"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3.800 6.300 1.500 1.500 2.600-2.900M3.800 12.300l1.500 1.500 2.600-2.900M3.800 18.300l1.500 1.500 2.600-2.900M11.500 6.500h8.700M11.500 12.500h8.700M11.500 18.500h8.700"/></svg>Lists</button><button data-todo="Messages"><svg aria-hidden="true" width="24" height="24" aria-hidden="true"><use href="#i-msg"/></svg>Messages</button><button data-todo="Profile"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="9.800" r="3.100"/><path d="M6.200 18.600c1.200-2.200 3.300-3.400 5.800-3.400s4.600 1.200 5.800 3.400"/></svg>Profile</button></nav><span class="home" aria-hidden="true"></span></div></section>';
}

/* ───── visual design: the same screens and data, drawn with symbol tiles, cards and small charts ───── */
var TYPEG={'Market':['cart','indigo'],'Parve kitchen':['pot','teal'],'Meat restaurant':['flame','pink'],'Dairy restaurant':['cup','blue'],'Butcher':['knife','pink'],'Deli':['bag','pink'],'Sushi restaurant':['fish','teal'],'Bakery':['loaf','brown'],'Fish restaurant':['fish','teal'],'Wine room':['glass','purple'],'Caterer':['cloche','indigo']};
var KINDG={Visit:['clip','blue'],Incident:['warn','brown'],Approval:['tag','purple'],Checklist:['list','teal']};
var KN={Visit:'RC Visits',Incident:'Incidents',Approval:'Product Approvals',Checklist:'Checklist Answers'};
var STN={ok:'Approved',alert:'Flagged',ask:'Pending review',pause:'On hold'};
function tile(g,c,size){return '<span class="tile t-'+c+(size?' '+size:'')+'" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#g-'+g+'"/></svg></span>'}
var PHOTO={hollow:'market-produce',kestrel:'scene-kitchen-prep',harbor:'restaurant-meat-burger',bloomfield:'restaurant-dairy-icecream',cloudberry:'restaurant-dairy-cafe',ember:'restaurant-meat-steak',butchers:'butcher-case',perla:'restaurant-meat-deli',silver:'restaurant-fish-sushi',brass:'restaurant-meat-lamb',gates:'bakery-challah',rivers:'restaurant-fish-branzino',vine:'restaurant-wine-bar',willow:'caterer-buffet'};
var FACE={'Rabbi Dovid Stern':'rabbi-senior','Rabbi Meir Kaplan':'rabbi-greying','Rabbi Yaakov Feldman':'rabbi-dark-beard','Shloimy Weiss':'staff-office','Yossi Friedman':'rabbi-young','Avi Rosenberg':'staff-young'};
function pic(e,lg){return '<img alt="" src="photos/'+PHOTO[e.id]+(lg?'-lg':'')+'.webp">'}
function estTile(e){return '<span class="thumb" aria-hidden="true">'+pic(e)+'</span>'}
function face(n,size){var f=FACE[n];return '<span class="avatar'+(size?' '+size:'')+(f?' ph':'')+'" aria-hidden="true">'+(f?'<img alt="" src="photos/team-'+f+'.webp">':initials(n))+'</span>'}
function kindTile(k){var g=KINDG[k]||['clip','blue'];return tile(g[0],g[1])}
function hrs(t){var m=/(\d+):(\d+) (AM|PM)/.exec(t);return +m[1]%12+(m[3]==='PM'?12:0)+ +m[2]/60}
function span(s){var p=s.split(' to ');return [hrs(p[0]),hrs(p[1])]}
function card(nav,g,c,label,big,sub,chart){return '<button class="card" data-vnav="'+nav+'"><div class="hd">'+tile(g,c,'sm')+'<span>'+label+'</span>'+chev+'</div><div class="big">'+esc(big)+'</div>'+(sub?'<div class="sub">'+esc(sub)+'</div>':'')+chart+'</button>'}
function fact(g,c,label,big,sub,extra){return '<div class="card"><div class="hd">'+tile(g,c,'sm')+'<span>'+label+'</span></div>'+(big?'<div class="big sm">'+big+'</div>':'')+(sub?'<div class="sub">'+sub+'</div>':'')+(extra||'')+'</div>'}
function gauge(v,max,label){var o='';for(var i=0;i<max;i++)o+='<i'+(i<v?' class="on"':'')+'></i>';return '<div class="gauge" role="img" aria-label="'+v+' of '+max+' '+label+'">'+o+'</div>'}
function statusCounts(){var o={ok:0,alert:0,ask:0,pause:0};E.forEach(function(e){o[e.st]++});return o}
function chartHours(){
  var c=[],max=0,h;
  for(h=5;h<23;h++){ var n=SH.filter(function(s){var x=span(s[0]);return x[0]<h+1&&x[1]>h}).length; c.push(n); if(n>max)max=n }
  return '<div class="chart" role="img" aria-label="Mashgichim on shift tomorrow, hour by hour from 5 AM to 11 PM. The most at one time is '+max+'."><div class="bars">'+c.map(function(n){return '<i style="height:'+Math.max(n/max*100,5)+'%"></i>'}).join('')+'</div><div class="axis"><span>5 AM</span><span>11 AM</span><span>5 PM</span><span>11 PM</span></div></div>';
}
function chartStatus(){
  var c=statusCounts(),ks=['ok','alert','ask','pause'];
  return '<div class="chart"><div class="stack" role="img" aria-label="'+ks.map(function(k){return c[k]+' '+STN[k].toLowerCase()}).join(', ')+'">'+ks.map(function(k){return c[k]?'<i class="k-'+k+'" style="flex:'+c[k]+'"></i>':''}).join('')+'</div></div><div class="legend" aria-hidden="true">'+ks.map(function(k){return '<span>'+sym(k)+STN[k]+' <b>'+c[k]+'</b></span>'}).join('')+'</div>';
}
function chartDue(){
  return '<div class="chart" role="img" aria-label="RC visits due in the next 30 days: '+esc(DUE.map(function(d){return byId[d[0]].name+' in '+d[1]}).join(', '))+'."><div class="strip">'+DUE.map(function(d){return '<i style="left:'+(parseInt(d[1],10)/30*100)+'%"></i>'}).join('')+'</div><div class="axis"><span>Today</span><span>10 days</span><span>20 days</span><span>30 days</span></div></div>';
}
function needCard(n,i){
  var prim=i===0?' primary':'';
  var btn=n.menu?'<button class="pill'+prim+'" data-menu="'+n.id+'" aria-haspopup="menu">'+esc(n.label)+'</button>':'<button class="pill'+prim+'" data-need="'+n.id+'">'+esc(n.label)+'</button>';
  return '<div class="card need">'+sym(n.s,SYMLABEL[n.s]).replace('class="sym"','class="sym lg"')+'<div class="big sm">'+esc(n.t)+'</div><div class="sub">'+esc(n.d)+'</div><div class="foot2">'+btn+'</div></div>';
}
function gantt(){
  var a=5,b=23;
  return '<div class="group gantt"><div class="gaxis" aria-hidden="true"><span></span><div><span>5 AM</span><span>11 AM</span><span>5 PM</span><span>11 PM</span></div><span></span></div>'+SH.map(function(s){
    var x=span(s[0]);
    return '<button class="grow" data-go="person:'+esc(s[1])+'"><span class="gn"><b>'+esc(s[1])+'</b><small>'+esc(byId[s[2]].name)+'</small></span><span class="gt" aria-hidden="true"><i style="left:'+((x[0]-a)/(b-a)*100)+'%;width:'+((x[1]-x[0])/(b-a)*100)+'%"></i></span><span class="gh">'+esc(s[0])+'</span></button>';
  }).join('')+'</div>';
}
function hero(html,name,lead){return html.replace('<h1 class="title">'+esc(name)+'</h1>','<div class="hero">'+lead+'<h1 class="title">'+esc(name)+'</h1></div>')}
var V={
 today:function(){
  var n=open(N),c=statusCounts(),m=P.filter(function(p){return /ashgiach/.test(p.role)}),done=m.filter(function(p){return p.kia}).length;
  var late=m.filter(function(p){return !p.kia}).map(function(p){return p.name}).join(', ');
  return '<p class="eyebrow">Wednesday, November 11</p><h1 class="title">Today</h1>'+
   '<div class="sec"><h2>Needs You</h2>'+(n.length?'<span class="n">'+n.length+'</span>':'')+'</div>'+
   (n.length?'<div class="cards">'+n.map(needCard).join('')+'</div>':'<div class="group"><div class="empty">Nothing needs you right now.</div></div>')+
   '<div class="sec"><h2>At a Glance</h2></div><div class="cards two">'+
   card('schedule:Shifts','clock','indigo','On Site','Nobody is on shift right now','Tomorrow has '+SH.length+' shifts. The first starts at 5:30 AM.',chartHours())+
   card('ests','bldg','blue','Establishments',c.ok+' of '+E.length+' are approved','',chartStatus())+
   card('schedule:Visits','clip','teal','RC Visits','The next visit is due in 10 days','Nothing is overdue.',chartDue())+
   card('people','people','purple','KIA Course',done+' of '+m.length+' mashgichim finished it',late?late+' has not finished.':'',gauge(done,m.length,'mashgichim finished the KIA course'))+'</div>';
 },
 schedule:function(){
  var body='', addL={Shifts:'Add Shift',Events:'Add Event',Visits:'Schedule Visit'}[S.sub];
  if(S.sub==='Shifts'){
   body=needsBlock(open([{id:'s1',s:'clock',t:'1 open shift on Wednesday, November 18',d:'Nobody is assigned yet.',label:'Assign',menu:['Offer to Everyone','Pick a Mashgiach']}]),false)+
    '<div class="sec"><h2>Tomorrow</h2><span class="n">Thursday, November 12</span></div>'+gantt()+
    '<div class="sec"><h2>Coming Up</h2></div><div class="week">'+DAYS.map(function(d){
      var p=d[0].split(', '), n=parseInt(d[1],10);
      return '<div class="day"><span class="wd">'+p[0].slice(0,3)+'</span><span class="dn">'+p[1].replace(/\D/g,'')+'</span><span class="colbar" aria-hidden="true"><i style="height:'+(n/13*100)+'%"></i></span><b>'+esc(d[1])+'</b>'+(d[2]?'<span class="ev">'+esc(d[2])+'</span>':'')+(d[3]?stateHtml(d[3]):'')+'</div>';
    }).join('')+'</div>';
  } else if(S.sub==='Events'){
   body=needsBlock(open([N[5]]),false)+'<div class="sec"><h2>Coming Up</h2></div><div class="group wrap">'+EV.map(function(e){
     var day=/November (\d+)/.exec(e[1])[1], rest=e[1].split(' · ');
     return '<div class="row"><span class="date" aria-hidden="true"><i>NOV</i><b>'+day+'</b></span><div class="main"><div class="t">'+esc(e[0])+'</div><div class="d">'+esc(rest[0])+'</div><div class="d">'+esc(rest.slice(1).join(' · '))+'</div></div><span class="trail">'+stateHtml(e[2])+'</span></div>';
   }).join('')+'</div>';
  } else {
   body='<div class="sec"><h2>Due Next</h2></div><div class="group wrap">'+DUE.map(function(d){
     var e=byId[d[0]], n=parseInt(d[1],10);
     return '<button class="row" data-go="est:'+e.id+'">'+estTile(e)+'<div class="main"><div class="t">'+esc(e.name)+'</div><div class="d">'+esc(e.rc)+'</div></div><span class="duebar" aria-hidden="true"><span class="daybar"><i style="left:0;width:'+(n/30*100)+'%"></i></span></span><span class="trail">Due in '+d[1]+chev+'</span></button>';
   }).join('')+'<div class="row"><div class="main" style="color:var(--text2)">6 more are due later. Nothing is overdue.</div></div></div>';
  }
  return '<div class="titlebar"><h1 class="title">Schedule</h1><div class="acts"><button class="act primary" data-todo="'+addL+'">'+addL+'</button></div></div>'+segHtml('sub',['Shifts','Events','Visits'],S.sub,true)+body;
 },
 ests:function(){
  var q=S.q.toLowerCase(), c=statusCounts(), list=E.filter(function(e){return (S.status==='All'||e.stText===S.status)&&(!q||(e.name+' '+e.city+' '+e.type).toLowerCase().indexOf(q)>-1)});
  var chip=function(v,label,n,s){return '<button class="chip'+(s?'':' plain')+'" data-status="'+v+'" aria-pressed="'+(S.status===v)+'">'+(s?sym(s):'')+label+' <b>'+n+'</b></button>'};
  return '<div class="titlebar"><h1 class="title">Establishments</h1><div class="acts"><button class="act icon" data-pop="more" aria-label="More" aria-haspopup="menu"><svg width="24" height="24" aria-hidden="true"><use href="#i-more"/></svg></button><button class="act primary" data-todo="Add Establishment">Add Establishment</button></div></div>'+
   '<div class="tools-row"><label class="field"><svg width="18" height="18" aria-hidden="true"><use href="#i-search"/></svg><input id="estq" type="search" placeholder="Search establishments" aria-label="Search establishments" value="'+esc(S.q)+'"></label></div>'+
   '<div class="chips" role="group" aria-label="Status">'+chip('All','All',E.length)+chip('Approved','Approved',c.ok,'ok')+chip('Flagged','Flagged',c.alert,'alert')+chip('Pending review','Pending Review',c.ask,'ask')+chip('On hold','On Hold',c.pause,'pause')+'</div>'+
   (list.length?'<div class="cards" style="margin-top:20px">'+list.map(function(e){
     return '<button class="card est" data-go="est:'+e.id+'"><span class="cover" aria-hidden="true">'+pic(e)+'</span><div class="main"><div class="t">'+esc(e.name)+'</div><div class="d">'+esc(e.type+' · '+e.city)+'</div>'+stateHtml({s:e.st,t:e.stText,c:e.st==='alert'?'bad':''})+'</div></button>';
   }).join('')+'</div>':'<div class="group" style="margin-top:20px"><div class="empty">No establishment matches. Clear the search or choose All.</div></div>');
 },
 est:function(){
  var e=byId[S.id], plain=pages.est().replace('<h1 class="title">'+esc(e.name)+'</h1>','<div class="banner" aria-hidden="true">'+pic(e,true)+'</div><h1 class="title">'+esc(e.name)+'</h1>');
  if(S.tab!=='Overview') return plain;
  var cut=plain.indexOf('</div>',plain.indexOf('class="seg full"'))+6, head=plain.slice(0,cut);
  var needs=open(N.filter(function(n){return n.loc===e.id}).concat(LOCN[e.id]||[]));
  var shift=SH.filter(function(s){return s[2]===e.id})[0], due=DUE.filter(function(d){return d[0]===e.id})[0];
  var who=function(n){return '<button class="who" data-go="person:'+esc(n)+'">'+face(n)+esc(n)+'</button>'};
  var hb='';
  if(e.hours){ var x=span(e.hours); hb='<div class="daybar-wrap"><div class="daybar" role="img" aria-label="Open '+esc(e.hours)+'"><i style="left:'+(x[0]/24*100)+'%;width:'+((x[1]-x[0])/24*100)+'%"></i></div><div class="axis"><span>12 AM</span><span>12 PM</span><span>12 AM</span></div></div>' }
  var recent=plain.indexOf('<div class="sec"><h2>Recent</h2>');
  return head+needsBlock(needs,false)+'<div class="sec"><h2>Right Now</h2></div><div class="cards two">'+
   fact('clock','indigo','On Site','Nobody right now',shift?'The next shift is tomorrow, '+esc(shift[0].split(' to ')[0])+', '+esc(shift[1])+'.':'No shift is scheduled tomorrow.')+
   fact('cal','blue','Open Today',e.hours?esc(e.hours):'Hours are not set','',hb)+
   fact('clip','teal','RC Visits',due?'The next visit is due in '+due[1]:esc(e.visit),due?esc(e.visit):'')+
   fact('people','purple','Team','','','<div class="team">'+who(e.rc)+e.mash.map(who).join('')+'</div>')+'</div>'+
   plain.slice(recent);
 },
 people:function(){
  var plain=pages.people(), cut=plain.indexOf('<div class="sec"><h2>Agency Team</h2>');
  var pc=function(p){
    var n=sitesOf(p.name).length;
    return '<button class="card person" data-go="person:'+esc(p.name)+'">'+face(p.name,'lg')+'<div class="t">'+esc(p.name)+'</div><div class="d">'+esc(p.role+(p.you?' (you)':''))+'</div><div class="d">'+(n?n+(n===1?' establishment':' establishments'):'&nbsp;')+'</div>'+(p.kia===false?stateHtml({s:'clock',t:'KIA course pending',c:'warn'}):'')+'</button>';
  };
  return plain.slice(0,cut)+'<div class="sec"><h2>Agency Team</h2></div><div class="cards">'+P.filter(function(p){return !/ashgiach/.test(p.role)}).map(pc).join('')+'</div>'+
   '<div class="sec"><h2>Mashgichim</h2></div><div class="cards">'+P.filter(function(p){return /ashgiach/.test(p.role)}).map(pc).join('')+'</div>';
 },
 person:function(){ return hero(pages.person(),S.id,face(S.id,'xl')) },
 records:function(){
  var plain=pages.records(), c={Visit:0,Incident:0,Approval:0,Checklist:0}; R.forEach(function(r){c[r.k]++}); c.Checklist=41;
  var chip=function(k,label,n){return '<button class="chip'+(k==='All'?' plain':'')+'" data-kind="'+k+'" aria-pressed="'+(S.filter===k)+'">'+(k==='All'?'':kindTile(k).replace('class="tile','class="tile sm'))+label+(n!=null?' <b>'+n+'</b>':'')+'</button>'};
  return '<div class="titlebar"><h1 class="title">Records</h1></div><div class="chips" role="group" aria-label="Kind of record">'+chip('All','All')+Object.keys(KN).map(function(k){return chip(k,KN[k],c[k])}).join('')+'</div>'+(S.filter==='All'?'<p style="color:var(--text2);margin:16px 4px 0">Checklist answers: the list shows the 3 newest of 41.</p>':'')+plain.slice(plain.indexOf('</select></div>')+15);
 }
};
function vPhoneHtml(){
  var p=phoneHtml(), a=p.indexOf('<div class="shift">'), b=p.indexOf('<h2 class="p-sec">'), c=p.indexOf('<div class="btns">'), d=p.indexOf('<nav class="tabbar"');
  return p.slice(0,a)+'<div class="shift"><div class="l">On shift since 11:00 AM</div><div class="timer" id="timer">2:41:07</div>'+gauge(3,8,'checks done on this shift')+'<div class="l" style="margin-top:8px">3 of 8 checks done</div></div>'+
   p.slice(b,c)+'<div class="tiles2"><button class="tbtn" data-todo="Report a Problem">'+tile('warn','brown','lg')+'<span>Report a Problem</span></button><button class="tbtn" data-todo="Ask My RC">'+tile('msg','blue','lg')+'<span>Ask My RC</span></button></div><div class="btns" style="margin-top:10px"><button class="btn text" data-todo="Clock Out">Clock Out</button></div></div>'+p.slice(d);
}

/* ───── shell: which system, which device, what changed ───── */
var OLD={today:'home',schedule:'calendar',ests:'locations',est:'location',people:'mashgichim',person:'mashgichim',records:'reports',search:'home'};
var NOTE={
 today:'<b>Home.</b> Current: a menu of 45 links in 8 groups, 4 shortcut cards, a list of 41 alerts, 6 counters, messages, events and a map. New: one list of what needs a decision, then who is on site, then the establishments.',
 schedule:'<b>Schedule.</b> Current: a month calendar with 5 filters, plus separate pages for shifts, events and one-time jobs. New: one place for everything with a future date, split into Shifts, Events and Visits.',
 ests:'<b>Establishments.</b> Current: 5 toolbar buttons, 7 filters and 6 small icons on every row. New: a search field, one status filter, and rows that open the establishment.',
 est:'<b>One establishment.</b> Current: about ten sections on one long page, from website listing to certificate standards. New: what needs you, what is true right now and what happened recently. Everything you set once moved to the Setup tab. The current-system screenshot is of Golden Ember Grill House.',
 people:'<b>People.</b> Current: mashgichim, coordinators, the course, orientations and applications are separate pages. New: one People section with everyone in it, and one page per person.',
 person:'<b>One person.</b> Current: the screenshot shows the mashgichim list; a person’s details are spread over several pages. New: one page per person with their shifts, establishments, training and recent records.',
 records:'<b>Records.</b> Current: inspections, incidents, approvals, submissions and reports each have their own page. New: one history, newest first, filtered by kind.',
 search:'<b>Search.</b> One search covers establishments, people and records.',
 phone:'<b>Mashgiach phone.</b> Current: the screen before clocking in, with a photo prompt, a notice and an arrival form above the clock-in. New: the screen during a shift, with the timer, three checklists in order and three buttons. These are two different moments, so compare the structure, not the content. The new phone screen is also a different moment from the office screens, where nobody is on shift.'
};
var phoneLook=null;
function shell(){
  var phone=S.device==='phone', both=S.mode==='both', showOld=S.mode!=='new', showNew=S.mode!=='old';
  $('#stage').className='stage'+(both?' both':'');
  $('#oldPane').hidden=!showOld; $('#newPane').hidden=!showNew;
  win.hidden=phone; $('#phoneWrap').hidden=!phone;
  if(phone&&phoneLook!==S.look){ $('#phoneWrap').innerHTML=S.look==='visual'?vPhoneHtml():phoneHtml(); phoneLook=S.look }
  $('#newH').textContent=(S.look==='visual'?'Aurora':'Clarity')+': try the buttons and rows';
  $('#oldWin').hidden=phone; $('#oldPhoneWrap').hidden=!phone;
  $('#oldH').textContent=phone?'Current System: a picture of the real screen':'Current System: a picture of the real screen, scroll inside it';
  var img=$('#oldImg'), src='old/'+OLD[S.route]+'.jpg';
  if(img.getAttribute('src')!==src){ img.setAttribute('src',src); $('#shot').scrollTop=0 }
  img.alt='Screenshot of the current system: '+S.route;
  $('#note').innerHTML=NOTE[phone?'phone':S.route]+(S.look==='visual'&&S.mode!=='old'?' <b>Aurora</b> holds the same information as Clarity, shown in a more visual way.':'');
  [['devOffice',!phone],['devPhone',phone],['modeNew',showNew&&S.look!=='visual'],['modeVis',showNew&&S.look==='visual'],['modeOld',S.mode==='old']].forEach(function(x){$('#'+x[0]).setAttribute('aria-pressed',x[1])});
  $('#noteBox').hidden=!showOld; $('#modeBoth').checked=both; $('#modeBoth').disabled=!showNew; $('#cmpWrap').style.visibility=showNew?'':'hidden';
}
function render(keepFocus,pos){
  closeMenu();
  var vis=S.look==='visual'; app.className=vis?'vis':'';
  app.innerHTML=topbar()+'<main class="col'+(vis?' wide':'')+'">'+((vis&&V[S.route])||pages[S.route])()+'</main>';
  shell();
  if(keepFocus){ var el=$('#'+keepFocus); if(el){ el.focus(); if(pos!=null&&el.setSelectionRange){ try{ el.setSelectionRange(pos,pos) }catch(e){} } } }
}
function go(route,id,label){
  if(route==='est'||route==='person'||route==='search'){ S.stack.push({route:S.route,id:S.id,tab:S.tab,backLabel:S.backLabel}); S.backLabel=label||({today:'Today',schedule:'Schedule',ests:'Establishments',people:'People',records:'Records',est:byId[S.id]&&byId[S.id].name,person:S.id,search:'Search'}[S.route]) }
  else { S.stack=[]; S.backLabel=null }
  S.route=route; S.id=id||null; S.all=false; if(route==='est') S.tab='Overview';
  render(); if(route==='search'){ var g=$('#gq'); g&&g.focus() }
  var top=win.getBoundingClientRect().top; if(top<0) window.scrollBy(0,top-12);
}
function back(){ var p=S.stack.pop()||{route:'today'}; S.route=p.route; S.id=p.id; S.tab=p.tab||'Overview'; S.backLabel=p.backLabel; render() }

/* menus + toast */
var menuEl=null, menuBtn=null, toastT=null;
function closeMenu(refocus){ if(menuEl){ menuEl.remove(); menuEl=null; if(menuBtn){ menuBtn.setAttribute('aria-expanded','false'); if(refocus&&document.contains(menuBtn)) menuBtn.focus(); menuBtn=null } } }
function openMenu(anchor,html){
  closeMenu(); menuEl=document.createElement('div'); menuEl.className='menu'; menuEl.setAttribute('role','menu'); menuEl.setAttribute('aria-label',anchor.getAttribute('aria-label')||anchor.textContent.trim()); menuBtn=anchor; anchor.setAttribute('aria-expanded','true'); menuEl.innerHTML=html; win.appendChild(menuEl);
  var a=anchor.getBoundingClientRect(), w=win.getBoundingClientRect(), mw=menuEl.offsetWidth;
  var left=Math.min(Math.max(a.right-w.left-mw,12),w.width-mw-12);
  menuEl.style.left=left+'px'; menuEl.style.top=(a.bottom-w.top+6)+'px';
  var f=$('button',menuEl); f&&f.focus();
}
function toast(msg){
  var old=$('.toast'); old&&old.remove(); clearTimeout(toastT);
  var t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=msg;
  if(S.device==='phone') $('#phoneWrap .screen').appendChild(t); else { t.className='toast fixed'; document.body.appendChild(t) }; toastT=setTimeout(function(){t.remove()},2600);
}
var allNeeds=function(){ var a=N.slice(); Object.keys(LOCN).forEach(function(k){a=a.concat(LOCN[k])}); Object.keys(PN).forEach(function(k){a=a.concat(PN[k])}); a.push({id:'s1',menu:['Offer to Everyone','Pick a Mashgiach']},{id:'i1',menu:['Send Invitation']}); return a };

document.addEventListener('click',function(ev){
  var t=ev.target.closest('button,[data-go]');
  if(menuEl&&!ev.target.closest('.menu')&&!(t&&(t.dataset.menu||t.dataset.pop))) closeMenu();
  if(!t) return;
  var d=t.dataset;
  if(t.id==='devOffice'||t.id==='devPhone'){ S.device=t.id==='devPhone'?'phone':'office'; if(S.device==='phone'&&!$('#phoneWrap').innerHTML){ $('#phoneWrap').innerHTML=phoneHtml(); tick() } shell(); return }
  if(t.id==='modeNew'||t.id==='modeVis'){ S.mode=S.mode==='both'&&!mq.matches?'both':'new'; S.look=t.id==='modeVis'?'visual':'plain'; render(); return }
  if(t.id==='modeOld'){ S.mode='old'; shell(); return }
  if(d.vnav){ var vn=d.vnav.split(':'); if(vn[1]) S.sub=vn[1]; go(vn[0]); return }
  if(d.status){ S.status=d.status; render(); var fs=$('[data-status="'+d.status+'"]',app); fs&&fs.focus(); return }
  if(d.kind){ S.filter=d.kind; render(); var fk=$('[data-kind="'+d.kind+'"]',app); fk&&fk.focus(); return }
  if(d.nav){ if(d.nav==='search'&&S.route==='search'){ var g=$('#gq'); g&&g.focus() } else go(d.nav); return }
  if(d.back){ back(); return }
  if(d.go){ var p=d.go.split(':'); go(p[0],p.slice(1).join(':')); return }
  if(d.seg){ var s=d.seg.split(':'); S[s[0]]=s[1]; S.all=false; render(); return }
  if(d.all){ S.all=true; render(); return }
  if(d.need){ var n=allNeeds().filter(function(x){return x.id===d.need})[0]; if(n.go&&n.go[0]==='est'&&S.route==='est'&&S.id===n.go[1]){ S.tab='Records'; render() } else if(n.go){ if(n.go[0]==='records'){ S.filter=n.go[1]; go('records') } else go(n.go[0],n.go[1]) } else if(n.tab){ S.tab=n.tab; render() } return }
  if(d.menu){ var m=allNeeds().filter(function(x){return x.id===d.menu})[0]; openMenu(t,m.menu.map(function(o){return m.id==='s1'?'<button role="menuitem" data-todo="'+o+'">'+o+'</button>':'<button role="menuitem" data-pick="'+m.id+'" data-label="'+o+'">'+o+'</button>'}).join('')); return }
  if(d.pick){ S.done[d.pick]=true; var lbl=d.label; render(); toast(lbl+': done. The item left the list.'); return }
  if(d.pop==='acct'){ openMenu(t,'<div class="mh">Rabbi Dovid Stern · Owner<br>Vaad HaKashrus of Maple Glen</div><hr><button role="menuitem" data-todo="Agency Settings">Agency Settings</button><button role="menuitem" data-todo="What’s New">What’s New</button><button role="menuitem" data-todo="My Requests">My Requests</button><hr><button role="menuitem" data-todo="Sign Out">Sign Out</button>'); return }
  if(d.pop==='msgs'){ openMenu(t,'<div class="msg"><div><b>Rabbi Yaakov Feldman</b></div><div class="d">Reviewed the Twelve Gates visit report. Clean. Scheduling their cert renewal photos for next week.</div></div><hr><div class="msg"><div class="d">2 unread messages in your group chats.</div></div><hr><button role="menuitem" data-todo="All Messages">Show All Messages</button>'); return }
  if(d.pop==='more'){ openMenu(t,'<button role="menuitem" data-todo="Import">Import…</button><button role="menuitem" data-todo="Print List">Print List</button><button role="menuitem" data-todo="Data Table">Show as Data Table</button>'); return }
  if(d.todo){ closeMenu(); toast(d.todo+' is not built in this preview.'); return }
});
document.addEventListener('keydown',function(ev){ if(ev.key==='Escape'){ if(menuEl) closeMenu(true); else if(S.route==='search') back() }
  if(menuEl&&(ev.key==='ArrowDown'||ev.key==='ArrowUp')){ var bs=[].slice.call(menuEl.querySelectorAll('button')), k=bs.indexOf(document.activeElement); if(bs.length){ ev.preventDefault(); bs[(k+(ev.key==='ArrowDown'?1:bs.length-1)+bs.length)%bs.length].focus() } } });
document.addEventListener('focusin',function(ev){ if(menuEl&&!menuEl.contains(ev.target)&&ev.target!==menuBtn) closeMenu() });
document.addEventListener('input',function(ev){
  if(ev.target.id==='estq'){ S.q=ev.target.value; render('estq',ev.target.selectionStart) }
  if(ev.target.id==='gq'){ S.gq=ev.target.value; $('#gres').innerHTML=searchResults() }
});
document.addEventListener('change',function(ev){
  if(ev.target.id==='modeBoth'){ S.mode=ev.target.checked?'both':'new'; shell(); return }
  if(ev.target.id==='eststatus'){ S.status=ev.target.value; render('eststatus') }
  if(ev.target.id==='reckind'){ S.filter=ev.target.value; render('reckind') }
});
function tick(){} /* the shift timer is a still picture, so it never disagrees with the clock in the status bar */
var mq=window.matchMedia('(max-width:1179px)'), narrow=function(){ if(mq.matches&&S.mode==='both'){ S.mode='new'; shell() } };
mq.addEventListener?mq.addEventListener('change',narrow):mq.addListener(narrow);
render();
})();
