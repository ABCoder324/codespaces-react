import React, { useRef, useCallback } from 'react';

export function Legend() {

return (
    <div className="Legend" ><p>
<div style={{background:'rgba(255, 255, 255, 1)', border:'1px solid black'}}>0-50 (Good)</div>
<div style={{background:'rgba(0, 255, 0, 0.7)', border:'1px solid black'}}>51-100 (Moderate)</div>
<div style={{background:'rgba(145, 255, 0, 0.59)', border:'1px solid black'}}>101-150 (Unhealthy for Sensitive Groups)</div>
<div style={{background:'rgba(255,255,0,0.5)', border:'1px solid black'}}>151-200 (Unhealthy)</div>
<div style={{background:'rgba(255, 145, 2, 0.89)', border:'1px solid black'}}>201-300 (Very Unhealthy)</div>
<div style={{background:'rgba(218, 44, 0, 0.84)', border:'1px solid black'}}>301-500 (Hazardous)</div> </p></div>
  );

};
