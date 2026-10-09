"use client";

import React from 'react'
import { Check } from 'lucide-react'
import { steps } from '../data/applicationData'
export default function Progress({ current }) { return <><div className="mobile-progress"><div className="mobile-step">Step {current + 1} of 5 <span>{steps[current]}</span></div><div className="progress-track"><i style={{ width: `${((current + 1) / steps.length) * 100}%` }}/></div></div><nav className="desktop-progress" aria-label="Application progress">{steps.map((step, i) => <div className={`progress-item ${i === current ? 'active' : ''} ${i < current ? 'complete' : ''}`} key={step}><span className="step-dot">{i < current ? <Check size={14}/> : `0${i + 1}`}</span><span>{step}</span>{i < steps.length - 1 && <i/>}</div>)}</nav></> }
