import React, { useState } from 'react';

export default function Questionnaire({ onFinish, questions: externalQuestions }) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [inputValue, setInputValue] = useState("");

  // ✅ Si on te donne une liste externe : utilise-la, sinon prends celles par défaut.
  const [questions, setQuestions] = useState(
    externalQuestions?.length
      ? externalQuestions
      : [
          { question: "Quelle est l'année de départ ?", key: "startYear", type: "number" },
          { question: "Durée du plan (en années) ?", key: "durationYears", type: "number" },
          { question: "Quel est le % de Custom Duty dans le pays concerné ?", key: "customDutyPercent", type: "number" },
          { question: "Lease, Build ou Both ?", key: "buildOrLease", options: ["Lease", "Build", "Both"] },
        ]
  );
  const [suffixCounter, setSuffixCounter] = useState(0);


  const current = questions[step];
const handleAnswer = (answer) => {
  const final = answer ?? inputValue.trim();
  if (!final) return;

  const newResp = { ...responses, [current.key]: final };
  setResponses(newResp);
  setInputValue("");

  if (!externalQuestions) {

    // 1️⃣ Après choix Lease / Build / Both
    if (current.key === "buildOrLease") {
      const plan = final;
      const start = parseInt(newResp.startYear);
      const duration = parseInt(newResp.durationYears);

      const newQ = [];

      if (plan === "Lease") {
        newQ.push({ question: "Combien de tours Lease au départ ?", key: "initialLease", type: "number" });
        newQ.push({ question: "Croissance uniforme ou variable pour Lease ?", key: "growthTypeLease", options: ["Uniforme", "Variable"] });
      } else if (plan === "Build") {
        newQ.push({ question: "Combien de tours Build au départ ?", key: "initialBuild", type: "number" });
        newQ.push({ question: "Croissance uniforme ou variable pour Build ?", key: "growthTypeBuild", options: ["Uniforme", "Variable"] });
      } else if (plan === "Both") {
        newQ.push({ question: "Combien de tours Lease au départ ?", key: "initialLease", type: "number" });
        newQ.push({ question: "Combien de tours Build au départ ?", key: "initialBuild", type: "number" });
        newQ.push({ question: "Croissance uniforme ou variable pour Lease ?", key: "growthTypeLease", options: ["Uniforme", "Variable"] });
        newQ.push({ question: "Croissance uniforme ou variable pour Build ?", key: "growthTypeBuild", options: ["Uniforme", "Variable"] });
      }

      setQuestions(prev => {
        const updated = [...prev, ...newQ];
        setStep(step + 1);
        return updated;
      });
      return;
    }

    // 2️⃣ Après choix Uniforme/Variable pour Lease ou Build
    if (current.key === "growthTypeLease" || current.key === "growthTypeBuild") {
      const isLease = current.key === "growthTypeLease";
      const finalKey = isLease ? "growthLeaseUniform" : "growthBuildUniform";
      const prefix = isLease ? "growthLease_" : "growthBuild_";

      const start = parseInt(newResp.startYear);
      const duration = parseInt(newResp.durationYears);

      if (final === "Uniforme") {
        setQuestions(prev => {
          const updated = [...prev, { question: `Combien de nouvelles tours ${isLease ? "Lease" : "Build"} par an ?`, key: finalKey, type: "number" }];
          setStep(step + 1);
          return updated;
        });
      } else {
        const extra = [];
        for (let i = 1; i < duration; i++) {
          const fy = `FY${String(start + i).slice(-2)}`;
          extra.push({ question: `Combien de nouvelles tours ${isLease ? "Lease" : "Build"} pour ${fy} ?`, key: `${prefix}${fy}`, type: "number" });
        }
        setQuestions(prev => {
          const updated = [...prev, ...extra];
          setStep(step + 1);
          return updated;
        });
      }
      return;
    }

    // 3️⃣ Après avoir entré toutes les croissances : pose % Urban + Tower Upgrade seulement
    if (
      current.key === "growthBuildUniform" ||
      current.key.startsWith("growthBuild_") ||
      current.key === "growthLeaseUniform" ||
      current.key.startsWith("growthLease_")
    ) {
      const plan = newResp.buildOrLease;
      const extra = [];

      if (plan === "Lease" || plan === "Both") {
        extra.push({ question: "Quel est le % Urban pour Lease ?", key: "percentUrbanLease", type: "number" });
      }
      if (plan === "Build" || plan === "Both") {
        extra.push({ question: "Quel est le % Urban pour Build ?", key: "percentUrbanBuild", type: "number" });
      }

      setQuestions(prev => {
        const updated = [...prev, ...extra];
        setStep(step + 1);
        return updated;
      });
      return;
    }

    // 4️⃣ Après % Urban : pose seulement TOWER UPGRADE
    if (current.key === "percentUrbanLease" || current.key === "percentUrbanBuild") {
      const extra = [
        { question: "Souhaites-tu faire un Tower Upgrade ?", key: "wantTowerUpgrade", options: ["Oui", "Non"] }
      ];
      setQuestions(prev => {
        const updated = [...prev, ...extra];
        setStep(step + 1);
        return updated;
      });
      return;
    }

    // 5️⃣ Si user veut Tower Upgrade : pose année + % + continue
    if (current.key === "wantTowerUpgrade") {
      if (final === "Oui") {
        const suffix = suffixCounter;
        setSuffixCounter(suffixCounter + 1);
        const extra = [
          { question: "Pour quelle année veux-tu ajouter un Tower Upgrade ?", key: `towerUpgradeYear_${suffix}`, type: "number" }
        ];
        setQuestions(prev => {
          const updated = [...prev, ...extra];
          setStep(step + 1);
          return updated;
        });
      } else {
        // pas de tower upgrade → direct RAN Upgrade
        const extra = [
          { question: "Souhaites-tu faire un RAN Upgrade ?", key: "wantRANUpgrade", options: ["Oui", "Non"] }
        ];
        setQuestions(prev => {
          const updated = [...prev, ...extra];
          setStep(step + 1);
          return updated;
        });
      }
      return;
    }
    

    // 6️⃣ Quand user donne une année de Tower Upgrade : pose % + continuer ?
    if (current.key.startsWith("towerUpgradeYear_")) {
      const suffix = current.key.split("_")[1];
      const extra = [
        { question: "Quel % des tours veux-tu upgrader cette année ?", key: `towerUpgradePercent_${suffix}`, type: "number" },
        { question: "Souhaites-tu ajouter un autre Tower Upgrade ?", key: `addMoreTowerUpgrade_${suffix}`, options: ["Oui", "Non"] }
      ];
      setQuestions(prev => {
        const updated = [...prev, ...extra];
        setStep(step + 1);
        return updated;
      });
      return;
    }
    
    

    // 7️⃣ Après % → boucle ou pose RAN Upgrade si fini
    if (current.key.startsWith("addMoreTowerUpgrade_")) {
      if (final === "Oui") {
        const suffix = suffixCounter;
        setSuffixCounter(suffixCounter + 1);
        const extra = [
          { question: "Pour quelle année veux-tu ajouter un autre Tower Upgrade ?", key: `towerUpgradeYear_${suffix}`, type: "number" }
        ];
        setQuestions(prev => {
          const updated = [...prev, ...extra];
          setStep(step + 1);
          return updated;
        });
      } else {
        // Fin Tower Upgrade → RAN Upgrade
        const extra = [
          { question: "Souhaites-tu faire un RAN Upgrade ?", key: "wantRANUpgrade", options: ["Oui", "Non"] }
        ];
        setQuestions(prev => {
          const updated = [...prev, ...extra];
          setStep(step + 1);
          return updated;
        });
      }
      return;
    }
    
// 8️⃣ Si user veut RAN Upgrade : boucle
if (current.key === "wantRANUpgrade") {
  if (final === "Oui") {
    const suffix = suffixCounter;
    setSuffixCounter(suffixCounter + 1);

    const extra = [
      { question: "Pour quelle année veux-tu ajouter un RAN Upgrade ?", key: `ranUpgradeYear_${suffix}`, type: "number" }
    ];
    setQuestions(prev => {
      const updated = [...prev, ...extra];
      setStep(step + 1);
      return updated;
    });
  } else {
    onFinish(newResp);
  }
  return;
}

// 9️⃣ Quand user donne une année RAN Upgrade : pose % + continuer ?
if (current.key.startsWith("ranUpgradeYear_")) {
  const suffix = current.key.split("_")[1];
  const extra = [
    { question: "Quel % des PoP veux-tu upgrader cette année ?", key: `ranUpgradePercent_${suffix}`, type: "number" },
    { question: "Souhaites-tu ajouter un autre RAN Upgrade ?", key: `addMoreRANUpgrade_${suffix}`, options: ["Oui", "Non"] }
  ];
  setQuestions(prev => {
    const updated = [...prev, ...extra];
    setStep(step + 1);
    return updated;
  });
  return;
}

// 10️⃣ Après % → boucle ou fin
if (current.key.startsWith("addMoreRANUpgrade_")) {
  if (final === "Oui") {
    const suffix = suffixCounter;
    setSuffixCounter(suffixCounter + 1);

    const extra = [
      { question: "Pour quelle année veux-tu ajouter un autre RAN Upgrade ?", key: `ranUpgradeYear_${suffix}`, type: "number" }
    ];
    setQuestions(prev => {
      const updated = [...prev, ...extra];
      setStep(step + 1);
      return updated;
    });
  } else {
    onFinish(newResp);
  }
  return;
}


  }

  // Fin normal
  if (step + 1 < questions.length) {
    setStep(step + 1);
  } else {
    onFinish(newResp);
  }
};


  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{current.question}</h2>

      {current.options ? (
        current.options.map(opt => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            style={{ margin: '10px', padding: '10px 20px' }}
          >
            {opt}
          </button>
        ))
      ) : (
        <>
          <input
            type={current.type || 'text'}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAnswer()}
            placeholder="Entrer puis ENTER ou cliquer"
            style={{ padding: '10px 20px', fontSize: '18px' }}
          />
          <br />
          <button onClick={() => handleAnswer()} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Suivant
          </button>
        </>
      )}
    </div>
  );
}
