import React, { useState } from 'react';
import NetworkMap from './NetworkMap';
import Questionnaire from './Questionnaire';
import ResultTable from './ResultTable';

export default function App() {
  const [answers, setAnswers] = useState({});
  const [mode, setMode] = useState('map');
  const [ranQuestions, setRanQuestions] = useState([]);

  const handleFinishQCM = (finalAnswers) => {
    setAnswers(finalAnswers);
    setMode('continueRan');
  };

  const handleContinueRan = () => {
    const ranQ = [
      { question: "Are you in a Greenfield situation?", key: "greenField", options: ["Yes", "No"] },
      { question: "How many 2G sites initially?", key: "ran2GStart", type: "number" },
      { question: "How many 3G sites initially?", key: "ran3GStart", type: "number" },
      { question: "How many 4G sites initially?", key: "ran4GStart", type: "number" },
      { question: "How many 5G sites initially?", key: "ran5GStart", type: "number" },
      { question: "What is the total number of sites at the end of the Business Plan?", key: "totalSitesEnd", type: "number" },
      { question: "What % of this total for 2G?", key: "ran2GTargetPct", type: "number" },
      { question: "What % of this total for 3G?", key: "ran3GTargetPct", type: "number" },
      { question: "What % of this total for 4G?", key: "ran4GTargetPct", type: "number" },
      { question: "What % of this total for 5G?", key: "ran5GTargetPct", type: "number" },
      { question: "What is the unit price for RAN 2G?", key: "ran2GUnitPrice", type: "number" },
      { question: "What is the unit price for RAN 3G?", key: "ran3GUnitPrice", type: "number" },
      { question: "What is the unit price for RAN 4G?", key: "ran4GUnitPrice", type: "number" },
      { question: "What is the unit price for RAN 5G?", key: "ran5GUnitPrice", type: "number" },
      { question: "What is the unit price for RAN Upgrade?", key: "ranUpgradeUnitPrice", type: "number" },
    ];
    
    
    setRanQuestions(ranQ);
  // utilise un micro-retard pour garantir le rendu après mise à jour
  setTimeout(() => setMode('ran'), 0);
    
  };

  return (
    <div className="container" style={{ position: 'relative' }}>
    {/* ✅ Ton logo global */}
    <img 
      src="/logo_axian.png"  // Chemin vers ton fichier dans public/
      alt="Logo"
      style={{
        position: 'absolute',
        top: '10px',
        right: '20px',
        height: '60px', // adapte la taille si besoin
        zIndex: 9999
      }}
    />
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
        CAPEX Network Map Simulation
      </h1>

      <div style={{ flex: 1, height: '100%', overflowY: 'auto' }}>
        {mode === 'map' && (
          <>
            <NetworkMap />
            <button
              onClick={() => setMode('qcm')}
              style={{
                position: 'absolute',
                top: '700px',
                right: '40px',
                zIndex: 20,
                padding: '10px 20px',
                fontSize: '18px',
                cursor: 'pointer',
                backgroundColor: '#D31B64',
                color: '#F3F4F6',
                fontWeight: 'bold',
              }}
            >
              START YOUR CAPEX PLAN
            </button>
          </>
        )}

        {mode === 'qcm' && (
          <Questionnaire onFinish={handleFinishQCM} />
        )}

        {mode === 'continueRan' && (
          <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '80px' }}>
            <ResultTable answers={answers} />

            <button
              onClick={handleContinueRan}
              style={{
                marginTop: '20px',
                marginRight: '10px',
                padding: '10px 20px',
                fontSize: '18px',
                cursor: 'pointer',
                backgroundColor: '#0EF2E2',
              }}
            >
              Continue vers RAN
            </button>

            {/* ✅ SUPPRIMÉ : le bouton rose inutile */}
          </div>
        )}

{mode === 'ran' && (
  <Questionnaire
    questions={ranQuestions}
    dynamicMode={false}   // ✅ on désactive la logique dynamique pour RAN
    onFinish={(ranAnswers) => {
      setAnswers({ ...answers, ...ranAnswers });
      setMode('result');
    }}
  />
)}


        {mode === 'result' && (
          <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '80px' }}>
            <ResultTable answers={answers} />
            {/* ✅ SUPPRIMÉ : le bouton rose inutile */}
          </div>
        )}
      </div>
    </div>
  );
}
