import React, { useState } from 'react';
import NetworkMap from './NetworkMap';
import Questionnaire from './Questionnaire';
import ResultTable from './ResultTable';

export default function App() {
  const [answers, setAnswers] = useState({});
  const [mode, setMode] = useState('map'); // 'map' | 'qcm' | 'result' | 'continueRan' | 'ran'

  const [ranQuestions, setRanQuestions] = useState([]);

  const handleFinishQCM = (finalAnswers) => {
    // Si c’est juste Tours : passer en mode résultat Tours + bouton Continue
    if (!finalAnswers.ran2GStart) {
      setAnswers(finalAnswers);
      setMode('continueRan');
    } else {
      // Si c’est après RAN : résultat final
      setAnswers(finalAnswers);
      setMode('result');
    }
  };
  const handleContinueRan = () => {
    // Liste fixe pour le bloc RAN + RAN Upgrade
    const ranQ = [
      { question: "Êtes-vous en situation Greenfield ?", key: "greenField", options: ["Oui", "Non"] },
      { question: "Combien de sites 2G au départ ?", key: "ran2GStart", type: "number" },
      { question: "Combien de sites 3G au départ ?", key: "ran3GStart", type: "number" },
      { question: "Combien de sites 4G au départ ?", key: "ran4GStart", type: "number" },
      { question: "Combien de sites 5G au départ ?", key: "ran5GStart", type: "number" },
      { question: "Quel est le nombre total de tours en fin de Business Plan ?", key: "totalSitesEnd", type: "number" },
      { question: "Quel % de ce total pour 2G ?", key: "ran2GTargetPct", type: "number" },
      { question: "Quel % de ce total pour 3G ?", key: "ran3GTargetPct", type: "number" },
      { question: "Quel % de ce total pour 4G ?", key: "ran4GTargetPct", type: "number" },
      { question: "Quel % de ce total pour 5G ?", key: "ran5GTargetPct", type: "number" },
    ];
  
    setRanQuestions(ranQ);
    setMode('ran');
  };
  

  return (
    <div className="container">
      <h1
        style={{
          margin: 0,
          padding: '20px',
          fontSize: '32px',
          fontFamily: 'sans-serif',
          color: '#fff',
          backgroundColor: '#080D37',
          textAlign: 'center',
        }}
      >
        CAPEX Network Map
      </h1>

      <div style={{ flex: 1, height: '100%' }}>
        {mode === 'map' && (
          <>
            <NetworkMap />
            <button
              onClick={() => setMode('qcm')}
              style={{
                position: 'absolute',
                top: '20px',
                right: '40px',
                zIndex: 20,
                padding: '10px 20px',
                fontSize: '18px',
                cursor: 'pointer',
                backgroundColor: '#091C53',
                color:'#F3F4F6',
                fontWeight: 'bold',
              }}
            >
              START YOUR CAPEX PLAN
            </button>
          </>
        )}

        {mode === 'qcm' && (
          <Questionnaire
            onFinish={handleFinishQCM}
          />
        )}

        {mode === 'continueRan' && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <ResultTable answers={answers} />
            <button
              onClick={handleContinueRan}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '18px',
                cursor: 'pointer',
                backgroundColor: '#0EF2E2',
              }}
            >
              Continue vers RAN
            </button>
          </div>
        )}

        {mode === 'ran' && (
          <Questionnaire
            questions={ranQuestions}
            onFinish={(ranAnswers) => handleFinishQCM({ ...answers, ...ranAnswers })}
          />
        )}

        {mode === 'result' && (
          <ResultTable answers={answers} />
        )}
      </div>
    </div>
  );
}
