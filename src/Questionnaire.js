import React, { useState, useEffect } from 'react';

export default function Questionnaire({ onFinish, questions: externalQuestions, dynamicMode = true }) {

  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [suffixCounter, setSuffixCounter] = useState(0);

  // ✅ Initialise questions : dynamique ou liste fixe
  const [questions, setQuestions] = useState(() => {
    return Array.isArray(externalQuestions) && externalQuestions.length > 0
      ? [...externalQuestions]
      : [
          { question: "Starting year ?", key: "startYear", type: "number" },
          { question: "Plan duration (in years)?", key: "durationYears", type: "number" },
          { question: "What is the custom duty % in the country concerned?", key: "customDutyPercent", type: "number" },
          { question: "Lease, Build ou Both ?", key: "buildOrLease", options: ["Lease", "Build", "Both"] },
        ];
  });

  // ✅ Si la liste fixe change après coup → reset
  useEffect(() => {
    if (Array.isArray(externalQuestions) && externalQuestions.length > 0) {
      setQuestions([...externalQuestions]);
      setStep(0);
    }
  }, [externalQuestions]);

  const current = questions[step];

  const handleAnswer = (answer) => {
    const final = answer ?? inputValue.trim();
    if (!final) return;

    const newResp = { ...responses, [current.key]: final };
    setResponses(newResp);
    setInputValue("");

    // ✅ Logique dynamique activée UNIQUEMENT si pas de liste fixe
    if (dynamicMode) {
      if (current.key === "buildOrLease") {
        const plan = final;
        const extra = [];
        if (plan === "Lease") {
          extra.push({ question: "How many towers were leased initially?", key: "initialLease", type: "number" });
          extra.push({ question: "Is the lease growth uniform or variable?", key: "growthTypeLease", options: ["Uniforme", "Variable"] });
        } else if (plan === "Build") {
          extra.push({ question: "How many towers were built initially ?", key: "initialBuild", type: "number" });
          extra.push({ question:"Is the build growth uniform or variable?", key: "growthTypeBuild", options: ["Uniforme", "Variable"] });
        } else {
          extra.push({ question: "How many lease towers initially?", key: "initialLease", type: "number" });
          extra.push({ question: "How many towers were built initially?", key: "initialBuild", type: "number" });
          extra.push({ question: "Is the growth for lease uniform, variable, or both?", key: "growthTypeLease", options: ["Uniforme", "Variable", "Both"] });
          extra.push({ question: "Is the growth for build uniform, variable, or both?", key: "growthTypeBuild", options: ["Uniforme", "Variable", "Both"] });

        }
        setQuestions(prev => [...prev, ...extra]);
        setStep(step + 1);
        return;
      }

      if (current.key === "growthTypeLease" || current.key === "growthTypeBuild") {
        const isLease = current.key === "growthTypeLease";
        const prefix = isLease ? "growthLease_" : "growthBuild_";
        const finalKey = isLease ? "growthLeaseUniform" : "growthBuildUniform";
        const start = parseInt(newResp.startYear);
        const duration = parseInt(newResp.durationYears);
      
        if (final === "Uniforme") {
          setQuestions(prev => [
            ...prev,
            { question: `How many new towers ${isLease ? "Lease" : "Build"} par an ?`, key: finalKey, type: "number" }
          ]);
        } else if (final === "Variable") {
          const extra = [];
          for (let i = 1; i < duration; i++) {
            const fy = `FY${String(start + i).slice(-2)}`;
            extra.push({ question: `How many new towers ${isLease ? "Lease" : "Build"} pour ${fy} ?`, key: `${prefix}${fy}`, type: "number" });
          }
          setQuestions(prev => [...prev, ...extra]);
        } else if (final === "Both") {
          // Both: d'abord Uniforme, puis toutes les années spécifiques
          const extra = [
            { question: `How many towers ${isLease ? "Lease" : "Build"} per year (Uniforme part) ?`, key: finalKey, type: "number" }
          ];
          for (let i = 1; i < duration; i++) {
            const fy = `FY${String(start + i).slice(-2)}`;
            extra.push({ question: `How many towers ${isLease ? "Lease" : "Build"} for ${fy} (Specific part) ?`, key: `${prefix}${fy}`, type: "number" });
          }
          setQuestions(prev => [...prev, ...extra]);
        }
      
        setStep(step + 1);
        return;
      }
      

      if (
        current.key === "growthLeaseUniform" || current.key === "growthBuildUniform" ||
        (
          current.key.startsWith("growthLease_") &&
          current.key === `growthLease_FY${String(parseInt(newResp.startYear) + parseInt(newResp.durationYears) - 1).slice(-2)}`
        ) ||
        (
          current.key.startsWith("growthBuild_") &&
          current.key === `growthBuild_FY${String(parseInt(newResp.startYear) + parseInt(newResp.durationYears) - 1).slice(-2)}`
        )
      ) {
        const plan = newResp.buildOrLease;
        const extra = [];
        if (plan === "Lease" || plan === "Both") {
          extra.push({ question: "What is the % of urban sites for lease?", key: "percentUrbanLease", type: "number" });
        }
        if (plan === "Build" || plan === "Both") {
          extra.push({ question: "What is the % of urban sites for Build?", key: "percentUrbanBuild", type: "number" });
        }
        setQuestions(prev => [...prev, ...extra]);
        setStep(step + 1);
        return;
      }
// ✅ UN SEUL BLOC PERCENT URBAN
if (current.key === "percentUrbanLease" || current.key === "percentUrbanBuild") {
  const plan = newResp.buildOrLease;

  if (plan === "Both") {
    const leaseDone = newResp.percentUrbanLease !== undefined;
    const buildDone = newResp.percentUrbanBuild !== undefined;
    const alreadyAdded = newResp._unitPriceDone;

    if (leaseDone && buildDone && !alreadyAdded) {
      newResp._unitPriceDone = true;
      setResponses(newResp);
      const extra = [
        { question: "What is the unit price for lease urban (USDk)? ( Range :15USDk - 20 USDk )", key: "leasePriceUrban", type: "number" },
        { question: "What is the unit price for lease rural (USDk)? ( Range :15USDk - 20 USDk )", key: "leasePriceRural", type: "number" },
        { question: "What is the unit price for build urban (USDk)? ( Range :100USDk - 120 USDk )", key: "buildPriceUrban", type: "number" },
        { question: "What is the unit price for build rural (USDk)? ( Range :80USDk - 100 USDk )", key: "buildPriceRural", type: "number" },
        { question: "Want Tower Upgrade?", key: "wantTowerUpgrade", options: ["YES", "NO"] }
      ];
      setQuestions(prev => [...prev, ...extra]);
    }
    setStep(step + 1);
    return;
  }

  if (!newResp._unitPriceDone) {
    newResp._unitPriceDone = true;
    setResponses(newResp);
    const extra = [];
    if (plan === "Lease") {
      extra.push({ question: "What is the unit price for lease urban (USDk)?", key: "leasePriceUrban", type: "number" });
      extra.push({ question: "What is the unit price for lease rural (USDk)?", key: "leasePriceRural", type: "number" });
    }
    if (plan === "Build") {
      extra.push({ question: "What is the unit price for build urban (USDk)?", key: "buildPriceUrban", type: "number" });
      extra.push({ question: "What is the unit price for build rural (USDk)?", key: "buildPriceRural", type: "number" });
    }
    extra.push({ question: "Want Tower Upgrade?", key: "wantTowerUpgrade", options: ["YES", "NO"] });
    setQuestions(prev => [...prev, ...extra]);
  }

  setStep(step + 1);
  return;
}




  // Si Lease seul ou Build seul : direct le bloc


      
      if (current.key === "towerUpgradeUnitPrice") {
        const suffix = suffixCounter;
        setSuffixCounter(suffixCounter + 1);
        setQuestions(prev => [
          ...prev,
          {
            question: "For which year?",
            key: `towerUpgradeYear_${suffix}`,
            type: "number"
          }
        ]);
        setStep(step + 1);
        return;
      }
      
      

      if (current.key.startsWith("towerUpgradeYear_")) {
        const suffix = current.key.split("_")[1];
        const extra = [
          { question: "What % of towers to upgrade?", key: `towerUpgradePercent_${suffix}`, type: "number" },
          { question: "Want tower upgrade for another year", key: `addMoreTowerUpgrade_${suffix}`, options: ["YES", "NO"] },
        ];
        setQuestions(prev => [...prev, ...extra]);
        setStep(step + 1);
        return;
      }

      if (current.key.startsWith("addMoreTowerUpgrade_")) {
        if (final === "YES") {
          const suffix = suffixCounter;
          setSuffixCounter(suffixCounter + 1);
          setQuestions(prev => [
            ...prev,
            { question: "For which year?", key: `towerUpgradeYear_${suffix}`, type: "number" }
          ]);
          setStep(step + 1);
        } else {
          // ✅ Vérifie que RAN Upgrade n’a pas déjà été ajouté
          if (!newResp._ranAsked) {
            newResp._ranAsked = true;
            setResponses(newResp);
            setQuestions(prev => [
              ...prev,
              { question: "Want RAN Upgrade?", key: "wantRANUpgrade", options: ["YES", "NO"] }
            ]);
          }
          setStep(step + 1);
        }
        return;
      }
      
      
      

      if (current.key === "wantTowerUpgrade") {
        const plan = newResp.buildOrLease;
        if (final === "YES") {
          const suffix = suffixCounter;
          setSuffixCounter(suffixCounter + 1);
          setQuestions(prev => [
            ...prev,
            { question: "For which year?", key: `towerUpgradeYear_${suffix}`, type: "number" }
          ]);
          setStep(step + 1);
        } else {
          // Si pas d'upgrade : poser RAN Upgrade si plan = Both
          if (plan === "Both" && !newResp._ranAsked) {
            newResp._ranAsked = true;
            setResponses(newResp);
            setQuestions(prev => [
              ...prev,
              { question: "Want RAN Upgrade?", key: "wantRANUpgrade", options: ["YES", "NO"] }
            ]);
          } else {
            onFinish(newResp);
          }
          setStep(step + 1);
        }
        return;
      }
      
      
      
      if (current.key.startsWith("addMoreRANUpgrade_")) {
        if (final === "YES") {
          const suffix = suffixCounter;
          setSuffixCounter(suffixCounter + 1);
          setQuestions(prev => [...prev, { question: "For which year ?", key: `ranUpgradeYear_${suffix}`, type: "number" }]);
          setStep(step + 1);
        } else {
          onFinish(newResp);
        }
        return;
      }
      
      
    }

    // ✅ Sinon : progression liste fixe ou fin
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