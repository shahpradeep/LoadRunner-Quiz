'use client';
import {useMemo,useState} from 'react';
import {quizSets} from './quiz-data';

export default function Home(){
 const [setIndex,setSetIndex]=useState(0),[questionIndex,setQuestionIndex]=useState(0);
 const [responses,setResponses]=useState<Record<string,number>>({}),[finished,setFinished]=useState(false);
 const set=quizSets[setIndex],question=set.questions[questionIndex],key=`${setIndex}-${questionIndex}`,selected=responses[key];
 const answered=selected!==undefined;
 const setAnswers=useMemo(()=>set.questions.map((_,i)=>responses[`${setIndex}-${i}`]),[responses,setIndex,set.questions]);
 const answeredCount=setAnswers.filter(v=>v!==undefined).length;
 const score=set.questions.reduce((n,item,i)=>n+(responses[`${setIndex}-${i}`]===item.answer?1:0),0);
 const choose=(i:number)=>{if(!answered&&!finished)setResponses(r=>({...r,[key]:i}))};
 const changeSet=(i:number)=>{setSetIndex(i);setQuestionIndex(0);setFinished(false)};
 const next=()=>{if(questionIndex<set.questions.length-1)setQuestionIndex(i=>i+1);else setFinished(true)};
 const reset=()=>{const copy={...responses};set.questions.forEach((_,i)=>delete copy[`${setIndex}-${i}`]);setResponses(copy);setQuestionIndex(0);setFinished(false)};
 return <main className="shell">
  <header className="topbar"><div className="brand"><span className="brand-mark">LR</span><span>LoadRunner Lab</span></div><div className="top-actions"><span className="question-total">50 questions</span><span className="level-pill">Senior level</span></div></header>
  <section className="hero"><p className="eyebrow">VUGEN CODING PRACTICE</p><h1>Master LoadRunner, one script at a time.</h1><p>Five focused quiz sets for performance engineers who want sharper correlation, transactions, validation, data, and diagnostics skills.</p></section>
  <section className="workspace">
   <aside className="sets"><p className="section-label">QUIZ SETS</p>{quizSets.map((item,i)=>{const done=item.questions.filter((_,n)=>responses[`${i}-${n}`]!==undefined).length;return <button key={item.title} onClick={()=>changeSet(i)} className={i===setIndex?'set active':'set'}><span>{String(i+1).padStart(2,'0')}</span><div><b>{item.title}</b><small>{done?`${done}/10 answered`:item.subtitle}</small></div></button>})}</aside>
   <section className="main-column">
    <div className="set-heading"><div><span>SET {setIndex+1}</span><h2>{set.title}</h2></div><div className="score-mini"><b>{answeredCount}</b><small>of 10 answered</small></div></div>
    {finished?<article className="results-card"><div className="result-ring"><strong>{score}</strong><span>/ 10</span></div><p className="eyebrow">SET COMPLETE</p><h2>{score>=8?'Excellent work.':score>=6?'Strong foundation.':'Keep sharpening the script.'}</h2><p>You answered {score} of 10 questions correctly in {set.title}.</p><div className="result-actions"><button className="secondary" onClick={()=>{setQuestionIndex(0);setFinished(false)}}>Review answers</button><button className="next" onClick={reset}>Try again <span>↻</span></button></div></article>:
    <article className="quiz-card">
     <div className="progress-track"><span style={{width:`${((questionIndex+1)/10)*100}%`}} /></div>
     <div className="quiz-meta"><span className="topic">{question.topic.toUpperCase()}</span><span>Question {questionIndex+1} of 10</span></div>
     <h3>{question.prompt}</h3>
     <div className="answers">{question.options.map((option,i)=>{const state=!answered?'':i===question.answer?'correct':i===selected?'wrong':'dim';return <button disabled={answered} onClick={()=>choose(i)} className={`answer ${state}`} key={option}><span className="letter">{'ABCD'[i]}</span><div><code>{option}</code>{answered&&i===question.answer&&<p><b>Correct.</b> {question.explanation}</p>}{answered&&i===selected&&i!==question.answer&&<p><b>Not quite.</b> {question.explanation}</p>}</div></button>})}</div>
     <footer><button className="icon-btn" aria-label="Previous question" disabled={questionIndex===0} onClick={()=>setQuestionIndex(i=>i-1)}>←</button><div className="dots" aria-label={`${answeredCount} questions answered`}>{set.questions.map((_,i)=><button aria-label={`Go to question ${i+1}`} onClick={()=>setQuestionIndex(i)} className={`${i===questionIndex?'current ':''}${setAnswers[i]!==undefined?'done':''}`} key={i}/>)}</div><button disabled={!answered} className="next" onClick={next}>{questionIndex===9?'See results':'Next question'} <span>→</span></button></footer>
    </article>}
   </section>
  </section>
 </main>
}
