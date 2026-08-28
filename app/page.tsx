'use client';
import {useMemo,useState} from 'react';
import {quizSets} from './quiz-data';

const correctPosition=(setIndex:number,questionIndex:number)=>(setIndex+questionIndex)%4;
const arrangedOptions=(options:string[],originalAnswer:number,setIndex:number,questionIndex:number)=>{
 const target=correctPosition(setIndex,questionIndex), result=new Array<string>(options.length);
 result[target]=options[originalAnswer];
 const distractors=options.filter((_,i)=>i!==originalAnswer);
 const offset=(setIndex*2+questionIndex)%distractors.length;
 const rotated=[...distractors.slice(offset),...distractors.slice(0,offset)];
 let d=0;for(let i=0;i<result.length;i++)if(i!==target)result[i]=rotated[d++];
 return result;
};

const optionQualifier=(option:string,longest:number,topic:string)=>{
 const gap=longest-option.length;
 const subject=topic.toLowerCase();
 if(gap>45)return `This choice treats it as the primary ${subject} mechanism and the main action for the scenario described.`;
 if(gap>20)return `This choice presents it as the main ${subject} technique to apply in this situation.`;
 return `This is proposed as the appropriate ${subject} approach for the stated scenario.`;
};

const learningGuides:Record<string,{why:string;example:string}>={
 'Correlation & Capture':{why:'Dynamic server values must be captured from the response that creates them and substituted into later requests. A script may replay once with recorded data yet fail under load when every Vuser receives a different token or identifier.',example:'If login returns sessionId=ABC123, register the capture before login, verify that the value was found, and send {sessionId} in the next authenticated request.'},
 'Transactions & Flow':{why:'Transaction boundaries determine what LoadRunner reports as business response time. Accurate placement keeps user delays, setup work, and cleanup from distorting the measurement.',example:'Start Checkout immediately before the first checkout request and end it after the confirmation is validated; place the shopper think time before the transaction begins.'},
 'Validation & Errors':{why:'A successful HTTP connection does not prove that the business operation worked. Content, status, and data validation prevent application error pages from being counted as successful transactions.',example:'A payment request can return HTTP 200 with “Payment declined” in the body. A business-content check should fail the transaction even though transport succeeded.'},
 'Data & Parameterization':{why:'Test data controls realism, repeatability, and concurrency. Incorrect row-selection or value conversion can create duplicate users, exhausted datasets, or requests that never represent production behavior.',example:'For 100 Vusers creating one account per iteration across five iterations, prepare at least 500 unique identities or use a collision-safe generation strategy.'},
 'Protocols & Diagnostics':{why:'The request function, headers, cookies, cache, and diagnostic level must match the protocol behavior being tested. Extra logging or an inaccurate request model can change the load generated.',example:'Use a raw custom request for a JSON PATCH body, set the correct content type, validate the response, and enable extended logging only for a small diagnostic run.'},
 'Controller Professional':{why:'A professional scenario is driven by business arrival rates and verified generator capacity—not simply a target Vuser number. The run is valid only when it sustains the intended workload without injector saturation.',example:'If the target is 1,200 orders per hour and one iteration produces one order, confirm that the achieved rate remains near 20 orders per minute during the steady-state interval.'},
 'LoadRunner Enterprise':{why:'LRE adds shared-resource governance, repeatable test definitions, permissions, and scheduling. Correct configuration prevents resource conflicts and makes results traceable across teams.',example:'Reserve a timeslot containing the required Controller and generators, record the script version, and confirm all assigned hosts are healthy before the scheduled execution window.'},
 'Analysis Engineering':{why:'Performance conclusions require distributions and correlated evidence. Averages can hide tail behavior, and one graph alone rarely proves where a bottleneck exists.',example:'Compare demand, transaction percentiles, error rate, and server saturation over the same steady-state interval before attributing latency to a component.'},
 'Analysis Diagnostics':{why:'Diagnostic analysis separates symptoms from causes by aligning workload, errors, latency distributions, and infrastructure metrics in time. Segmentation prevents unrelated transactions from masking the affected path.',example:'Filter the checkout transaction to the 10-minute degradation window, then align its latency and errors with database waits, CPU, network retransmissions, and request throughput.'},
 'Controller & Generators':{why:'Load generators must produce the workload without becoming the bottleneck themselves. Connectivity, version compatibility, clock synchronization, and reserved capacity protect test validity.',example:'If generator CPU reaches 95% while request rate flattens, reduce its assigned Vusers or add calibrated generators before drawing conclusions about the application.'},
 'Geographic Load Strategy':{why:'Generator geography determines the network path included in response time, while the Controller primarily coordinates the run. Placement must follow the test objective and actual user distribution.',example:'For a workload that is 60% Florida, assign roughly 60% of user traffic to a validated Orlando generator, but keep the Controller in a secure management location with reliable links to every generator.'}
};

const detailedFeedback=(setTitle:string,topic:string)=>{
 if(topic==='Percentiles')return {why:'The 95th percentile exposes tail latency by identifying a response-time threshold that approximately 95% of observations meet. Unlike an average, it is not pulled into a deceptively reassuring value by mixing many fast responses with a smaller group of very slow ones.',example:'With 100 requests, suppose 94 finish in 1 second and 6 take 10 seconds. The average is 1.54 seconds, but the nearest-rank 95th percentile is 10 seconds—clearly showing that more than 5% of users encounter the slow path.'};
 return learningGuides[setTitle];
};

export default function Home(){
 const [setIndex,setSetIndex]=useState(0),[questionIndex,setQuestionIndex]=useState(0);
 const [responses,setResponses]=useState<Record<string,number>>({}),[finished,setFinished]=useState(false);
 const set=quizSets[setIndex],question=set.questions[questionIndex],key=`${setIndex}-${questionIndex}`,selected=responses[key];
 const correctIndex=correctPosition(setIndex,questionIndex);
 const displayOptions=arrangedOptions(question.options,question.answer,setIndex,questionIndex);
 const longestOption=Math.max(...displayOptions.map(option=>option.length));
 const guide=detailedFeedback(set.title,question.topic);
 const answered=selected!==undefined;
 const setAnswers=useMemo(()=>set.questions.map((_,i)=>responses[`${setIndex}-${i}`]),[responses,setIndex,set.questions]);
 const answeredCount=setAnswers.filter(v=>v!==undefined).length;
 const score=set.questions.reduce((n,_,i)=>n+(responses[`${setIndex}-${i}`]===correctPosition(setIndex,i)?1:0),0);
 const choose=(i:number)=>{if(!answered&&!finished)setResponses(r=>({...r,[key]:i}))};
 const changeSet=(i:number)=>{setSetIndex(i);setQuestionIndex(0);setFinished(false)};
 const next=()=>{if(questionIndex<set.questions.length-1)setQuestionIndex(i=>i+1);else setFinished(true)};
 const reset=()=>{const copy={...responses};set.questions.forEach((_,i)=>delete copy[`${setIndex}-${i}`]);setResponses(copy);setQuestionIndex(0);setFinished(false)};
 return <main className="shell">
  <header className="topbar"><div className="brand"><span className="brand-mark">LR</span><span>LoadRunner Lab</span></div><div className="top-actions"><span className="question-total">{quizSets.length * 10} questions</span><span className="level-pill">Advanced level</span></div></header>
  <section className="hero"><p className="eyebrow">LOADRUNNER PROFESSIONAL PRACTICE</p><h1>Engineer performance with confidence.</h1><p>Eleven focused quiz sets covering VuGen scripting, Controller, LoadRunner Enterprise, Analysis, generator architecture, and geographic load strategy.</p></section>
  <section className="workspace">
   <aside className="sets"><p className="section-label">QUIZ SETS</p>{quizSets.map((item,i)=>{const done=item.questions.filter((_,n)=>responses[`${i}-${n}`]!==undefined).length;return <button key={item.title} onClick={()=>changeSet(i)} className={i===setIndex?'set active':'set'}><span>{String(i+1).padStart(2,'0')}</span><div><b>{item.title}</b><small>{done?`${done}/10 answered`:item.subtitle}</small></div></button>})}</aside>
   <section className="main-column">
    <div className="set-heading"><div><span>SET {setIndex+1}</span><h2>{set.title}</h2></div><div className="score-mini"><b>{answeredCount}</b><small>of 10 answered</small></div></div>
    {finished?<article className="results-card"><div className="result-ring"><strong>{score}</strong><span>/ 10</span></div><p className="eyebrow">SET COMPLETE</p><h2>{score>=8?'Excellent work.':score>=6?'Strong foundation.':'Keep sharpening the script.'}</h2><p>You answered {score} of 10 questions correctly in {set.title}.</p><div className="result-actions"><button className="secondary" onClick={()=>{setQuestionIndex(0);setFinished(false)}}>Review answers</button><button className="next" onClick={reset}>Try again <span>↻</span></button></div></article>:
    <article className="quiz-card">
     <div className="progress-track"><span style={{width:`${((questionIndex+1)/10)*100}%`}} /></div>
     <div className="quiz-meta"><span className="topic">{question.topic.toUpperCase()}</span><span>Question {questionIndex+1} of 10</span></div>
     <h3>{question.prompt}</h3>
     <div className="answers">{displayOptions.map((option,i)=>{const state=!answered?'':i===correctIndex?'correct':i===selected?'wrong':'dim';const showFeedback=answered&&i===correctIndex;return <button disabled={answered} onClick={()=>choose(i)} className={`answer ${state}`} key={`${i}-${option}`}><span className="letter">{'ABCD'[i]}</span><div className="option-content"><div className="option-copy"><code>{option}</code><span className="option-note">— {optionQualifier(option,longestOption,question.topic)}</span></div>{answered&&i===selected&&i!==correctIndex&&<p className="wrong-note"><b>Not quite.</b> Compare this choice with the correct answer and explanation below.</p>}{showFeedback&&<div className="feedback"><p className="feedback-summary"><b>Correct.</b> {question.explanation}</p><p><b>Why it matters:</b> {guide.why}</p><p><b>Example:</b> {guide.example}</p></div>}</div></button>})}</div>
     <footer><button className="icon-btn" aria-label="Previous question" disabled={questionIndex===0} onClick={()=>setQuestionIndex(i=>i-1)}>←</button><div className="dots" aria-label={`${answeredCount} questions answered`}>{set.questions.map((_,i)=><button aria-label={`Go to question ${i+1}`} onClick={()=>setQuestionIndex(i)} className={`${i===questionIndex?'current ':''}${setAnswers[i]!==undefined?'done':''}`} key={i}/>)}</div><button disabled={!answered} className="next" onClick={next}>{questionIndex===9?'See results':'Next question'} <span>→</span></button></footer>
    </article>}
   </section>
  </section>
  <footer className="site-credit">Developed by <strong>Pradeep Shah</strong> · Built for LoadRunner professionals</footer>
 </main>
}
