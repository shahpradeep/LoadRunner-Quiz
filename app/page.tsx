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

export default function Home(){
 const [setIndex,setSetIndex]=useState(0),[questionIndex,setQuestionIndex]=useState(0);
 const [responses,setResponses]=useState<Record<string,number>>({}),[finished,setFinished]=useState(false);
 const set=quizSets[setIndex],question=set.questions[questionIndex],key=`${setIndex}-${questionIndex}`,selected=responses[key];
 const correctIndex=correctPosition(setIndex,questionIndex);
 const displayOptions=arrangedOptions(question.options,question.answer,setIndex,questionIndex);
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
     <div className="answers">{displayOptions.map((option,i)=>{const state=!answered?'':i===correctIndex?'correct':i===selected?'wrong':'dim';return <button disabled={answered} onClick={()=>choose(i)} className={`answer ${state}`} key={`${i}-${option}`}><span className="letter">{'ABCD'[i]}</span><div><code>{option}</code>{answered&&i===correctIndex&&<p><b>Correct.</b> {question.explanation}</p>}{answered&&i===selected&&i!==correctIndex&&<p><b>Not quite.</b> {question.explanation}</p>}</div></button>})}</div>
     <footer><button className="icon-btn" aria-label="Previous question" disabled={questionIndex===0} onClick={()=>setQuestionIndex(i=>i-1)}>←</button><div className="dots" aria-label={`${answeredCount} questions answered`}>{set.questions.map((_,i)=><button aria-label={`Go to question ${i+1}`} onClick={()=>setQuestionIndex(i)} className={`${i===questionIndex?'current ':''}${setAnswers[i]!==undefined?'done':''}`} key={i}/>)}</div><button disabled={!answered} className="next" onClick={next}>{questionIndex===9?'See results':'Next question'} <span>→</span></button></footer>
    </article>}
   </section>
  </section>
  <footer className="site-credit">Developed by <strong>Pradeep Shah</strong> · Built for LoadRunner professionals</footer>
 </main>
}
