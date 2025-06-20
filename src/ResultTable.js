import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function ResultTable({ answers }) {
  // 🔑 Une fonction pour formater proprement :
const formatNumber = (n) => Math.round(n).toLocaleString('en-US');

  const start = parseInt(answers.startYear);
  const duration = parseInt(answers.durationYears);
  const fy = Array.from({ length: duration }, (_, i) => `FY${String(start + i).slice(-2)}`);

  // Lease
  const lease = [];
  lease[0] = parseInt(answers.initialLease) || 0;
  for (let i = 1; i < fy.length; i++) {
    let growth = 0;
    if (answers.growthTypeLease === "Uniforme") {
      growth = parseInt(answers.growthLeaseUniform) || 0;
    } else {
      const key = `growthLease_${fy[i]}`;
      growth = parseInt(answers[key]) || 0;
    }
    lease[i] = lease[i - 1] + growth;
  }

  // Build
  const build = [];
  build[0] = parseInt(answers.initialBuild) || 0;
  for (let i = 1; i < fy.length; i++) {
    let growth = 0;
    if (answers.growthTypeBuild === "Uniforme") {
      growth = parseInt(answers.growthBuildUniform) || 0;
    } else {
      const key = `growthBuild_${fy[i]}`;
      growth = parseInt(answers[key]) || 0;
    }
    build[i] = build[i - 1] + growth;
  }

  // Ajouts annuels
  const leaseAdditions = [lease[0]];
  for (let i = 1; i < lease.length; i++) {
    leaseAdditions[i] = lease[i] - lease[i - 1];
  }

  const buildAdditions = [build[0]];
  for (let i = 1; i < build.length; i++) {
    buildAdditions[i] = build[i] - build[i - 1];
  }

  // % Urban/Rural
  const urbanPctLease = parseFloat(answers.percentUrbanLease) / 100 || 0;
  const ruralPctLease = 1 - urbanPctLease;

  const urbanPctBuild = parseFloat(answers.percentUrbanBuild) / 100 || 0;
  const ruralPctBuild = 1 - urbanPctBuild;
  // Créer un array pour chaque % répété sur toute la période
// Tableaux pour chaque année
const leaseUrbanPctArray = fy.map((_, i) => {
  return lease[i] === 0 ? "0%" : Math.round(urbanPctLease * 100) + "%";
});
const leaseRuralPctArray = fy.map((_, i) => {
  return lease[i] === 0 ? "0%" : Math.round(ruralPctLease * 100) + "%";
});

const buildUrbanPctArray = fy.map((_, i) => {
  return build[i] === 0 ? "0%" : Math.round(urbanPctBuild * 100) + "%";
});
const buildRuralPctArray = fy.map((_, i) => {
  return build[i] === 0 ? "0%" : Math.round(ruralPctBuild * 100) + "%";
});

  


  // Découpage Urban/Rural
  const leaseUrban = lease.map(n => n * urbanPctLease);
  const leaseRural = lease.map(n => n * ruralPctLease);

  const buildUrban = build.map(n => n * urbanPctBuild);
  const buildRural = build.map(n => n * ruralPctBuild);

  // Prix unitaires
 const leasePriceUrban = 25;  // USDk
 const leasePriceRural = 15;  // USDk
 const buildPriceUrban = 120; // USDk
 const buildPriceRural = 80;  // USDk


  // Nouveau Total Cost basé sur Urban/Rural
  const total = fy.map((_, i) =>
    leaseUrban[i] * leasePriceUrban +
    leaseRural[i] * leasePriceRural +
    buildUrban[i] * buildPriceUrban +
    buildRural[i] * buildPriceRural
  );
  const customDutyPct = parseFloat(answers.customDutyPercent) / 100 || 0;
  const customDuty = total.map(val => val * customDutyPct);
  const totalWithDuty = total.map((val, i) => val + customDuty[i]);
  // PoP : c’est le nombre total de tours par an
const totalPoP = build.map((b, i) => b + lease[i]);

const ranUpgradePercent = Array(fy.length).fill(0);
Object.entries(answers).forEach(([key, value]) => {
  if (key.startsWith("ranUpgradeYear_")) {
    const year = parseInt(value); // année choisie par l'utilisateur
    const index = fy.findIndex(y => y === `FY${String(year).slice(-2)}`);
    if (index >= 0) {
      const suffix = key.replace("ranUpgradeYear_", "");

      const percentKey = `ranUpgradePercent_${suffix}`;
      const percentValue = parseFloat(answers[percentKey]) || 0;
      ranUpgradePercent[index] = percentValue;
    }
  }
});

// Total Final : Capex + Duty
const finalTotal = total.map((val, i) => val + customDuty[i]);
  const customDutyPctArray = Array(fy.length).fill(Math.round(customDutyPct * 100) + "%");
  // ------------- RAN CALCULATIONS -------------


  let ran2G = [], ran3G = [], ran4G = [], ran5G = [];

  if (answers.ran2GStart !== undefined) {
    // Valeurs de départ
    const ran2GStart = parseInt(answers.ran2GStart) || 0;
    const ran3GStart = parseInt(answers.ran3GStart) || 0;
    const ran4GStart = parseInt(answers.ran4GStart) || 0;
    const ran5GStart = parseInt(answers.ran5GStart) || 0;
  
    // Valeur cible à la fin du BP
    const totalSitesEnd = parseInt(answers.totalSitesEnd) || 0;
    const ran2GTarget = (parseFloat(answers.ran2GTargetPct) / 100) * totalSitesEnd || 0;
    const ran3GTarget = (parseFloat(answers.ran3GTargetPct) / 100) * totalSitesEnd || 0;
    const ran4GTarget = (parseFloat(answers.ran4GTargetPct) / 100) * totalSitesEnd || 0;
    const ran5GTarget = (parseFloat(answers.ran5GTargetPct) / 100) * totalSitesEnd || 0;
  
    // Delta par an
    const delta2G = (ran2GTarget - ran2GStart) / (duration - 1);
    const delta3G = (ran3GTarget - ran3GStart) / (duration - 1);
    const delta4G = (ran4GTarget - ran4GStart) / (duration - 1);
    const delta5G = (ran5GTarget - ran5GStart) / (duration - 1);
  
    // Cumul annuel avec arrondi pour avoir des entiers réalistes
    ran2G[0] = ran2GStart;
    ran3G[0] = ran3GStart;
    ran4G[0] = ran4GStart;
    ran5G[0] = ran5GStart;
  
    for (let i = 1; i < fy.length; i++) {
      ran2G[i] = Math.round(ran2G[i - 1] + delta2G);
      ran3G[i] = Math.round(ran3G[i - 1] + delta3G);
      ran4G[i] = Math.round(ran4G[i - 1] + delta4G);
      ran5G[i] = Math.round(ran5G[i - 1] + delta5G);
    }
  }
  
  
const newRan234 = [ran2G[0] + ran3G[0] + ran4G[0]];
const newRan5G = [ran5G[0]];
for (let i = 1; i < fy.length; i++) {
  newRan234[i] = (ran2G[i] - ran2G[i-1]) + (ran3G[i] - ran3G[i-1]) + (ran4G[i] - ran4G[i-1]);
  newRan5G[i] = ran5G[i] - ran5G[i-1];
}
const ran234UnitPrice = 50; // USDk
const ran5GUnitPrice = 100; // USDk
const totalCapexRAN = fy.map((_, i) =>
  newRan234[i] * ran234UnitPrice + newRan5G[i] * ran5GUnitPrice
);
// === TOWER UPGRADES ===

// Exemple : tableau de % d'upgrades des tours (0 pour les années sans upgrade)
// SANS valeur par défaut → tout est 0 sauf si l'utilisateur donne quelque chose
// Initialiser à 0
const towerUpgradePercent = Array(fy.length).fill(0);

Object.entries(answers).forEach(([key, value]) => {
  if (key.startsWith("towerUpgradeYear_")) {
    const year = parseInt(value);
    const index = fy.findIndex(y => y === `FY${String(year).slice(-2)}`);
    if (index >= 0) {
      const suffix = key.replace("towerUpgradeYear_", "");
      const percentKey = `towerUpgradePercent_${suffix}`;
      const percentValue = parseFloat(answers[percentKey]) || 0;
      towerUpgradePercent[index] = percentValue;
    }
  }
});




// Nombre de tours à upgrader : % * total tours de l'année
const towerUpgradeUnits = fy.map((_, i) =>
  (towerUpgradePercent[i] / 100) * (lease[i] + build[i])
);

// Prix unitaire fixe
const towerUpgradeUnitPrice = 30; // USDk

// Capex total
const towerUpgradeCapex = towerUpgradeUnits.map(n => n * towerUpgradeUnitPrice);

// === RAN UPGRADES ===

// Exemple : tableau de % d'upgrades des PoP (0 pour les années sans upgrade)

// Nombre de PoP à upgrader : % * total PoP
const ranUpgradeUnits = fy.map((_, i) =>
  (ranUpgradePercent[i] / 100) * totalPoP[i]
);

// Prix unitaire fixe
const ranUpgradeUnitPrice = 20; // USDk

// Capex total
const ranUpgradeCapex = ranUpgradeUnits.map(n => n * ranUpgradeUnitPrice);

// === NOUVEAUX TOTALS Tower ===
const totalTowerCapex = total; // Déjà existant
const totalTowerCustomDuty = totalTowerCapex.map(val => val * customDutyPct);
const totalTowerCapexWithDuty = totalTowerCapex.map((val, i) => val + totalTowerCustomDuty[i]);
const totalTowerCapexWithDutyAndUpgrade = totalTowerCapexWithDuty.map((val, i) => val + towerUpgradeCapex[i]);

// === NOUVEAUX TOTALS RAN ===
const ranCustomDuty = totalCapexRAN.map(val => val * customDutyPct);
const totalCapexRANWithDuty = totalCapexRAN.map((val, i) => val + ranCustomDuty[i]);
const totalCapexRANWithDutyAndUpgrade = totalCapexRANWithDuty.map((val, i) => val + ranUpgradeCapex[i]);

const ranCustomDutyPctArray = Array(fy.length).fill(Math.round(customDutyPct * 100) + "%");
const ranUpgradeCustomDuty = ranUpgradeCapex.map(val => val * customDutyPct);

// Nouveau : pour le TOWER UPGRADE
const towerUpgradeCustomDuty = towerUpgradeCapex.map(val => val * customDutyPct);



  // Export Excel
  const exportToExcel = () => {
    const header = ["Ligne", "Unité", ...fy];
    const rows = [
      ["New Lease Towers", "#", ...leaseAdditions],
      ["Total Lease Towers", "#", ...lease],
      ["Lease Urban Towers", "#", ...leaseUrban],
      ["Lease Rural Towers", "#", ...leaseRural],
      ["Unit Price Lease Urban", "USDk", ...Array(fy.length).fill(leasePriceUrban)],
      ["Unit Price Lease Rural", "USDk", ...Array(fy.length).fill(leasePriceRural)],
      ["Urban % Lease", "%", ...leaseUrbanPctArray],
      ["Rural % Lease", "%", ...leaseRuralPctArray],
    
      ["New Build Towers", "#", ...buildAdditions],
      ["Total Build Towers", "#", ...build],
      ["Build Urban Towers", "#", ...buildUrban],
      ["Build Rural Towers", "#", ...buildRural],
      ["Unit Price Build Urban", "USDk", ...Array(fy.length).fill(buildPriceUrban)],
      ["Unit Price Build Rural", "USDk", ...Array(fy.length).fill(buildPriceRural)],
      ["Urban % Build", "%", ...buildUrbanPctArray],
      ["Rural % Build", "%", ...buildRuralPctArray],
      ["Nombre de PoP", "#", ...totalPoP],
      ["Total Final (Capex + Duty)", "USDk", ...finalTotal],
    
      ["Total Tower Capex", "USDk", ...total],
      ["Custom Duty", "USDk", ...customDuty],
      ["Custom Duty %", "%", ...customDutyPctArray],
      ["Total Capex + Custom Duty", "USDk", ...totalWithDuty],
    ];
    
    // Ajoute dynamiquement les blocs RAN & Upgrades :
    if (ran2G.length > 0) {
      rows.push(
        ["RAN 2G Sites", "#", ...ran2G],
        ["RAN 3G Sites", "#", ...ran3G],
        ["RAN 4G Sites", "#", ...ran4G],
        ["RAN 5G Sites", "#", ...ran5G],
        ["New RAN PoP (2G, 3G, 4G)", "#", ...newRan234],
        ["New RAN PoP (5G)", "#", ...newRan5G],
        ["Unit Price RAN (2G, 3G, 4G)", "USDk", ...Array(fy.length).fill(ran234UnitPrice)],
        ["Unit Price RAN (5G)", "USDk", ...Array(fy.length).fill(ran5GUnitPrice)],
        ["Total Capex RAN", "USDk", ...totalCapexRAN],
    
        ["Tower Upgrades Units", "#", ...towerUpgradeUnits],
        ["Unit Price Tower Upgrade", "USDk", ...Array(fy.length).fill(towerUpgradeUnitPrice)],
        ["Total Capex Tower Upgrade", "USDk", ...towerUpgradeCapex],
        ["Custom Duty Tower Upgrade", "USDk", ...towerUpgradeCustomDuty],
        ["Total Tower Capex (Without Duty)", "USDk", ...totalTowerCapex],
        ["Custom Duty", "USDk", ...totalTowerCustomDuty],
        ["Custom Duty %", "%", ...customDutyPctArray],
        ["Total Tower Capex + Duty", "USDk", ...totalTowerCapexWithDuty],
        ["Total Tower Capex + Duty + Upgrade", "USDk", ...totalTowerCapexWithDutyAndUpgrade],
      
        // RAN
        ["RAN 2G Sites", "#", ...ran2G],
        ["RAN 3G Sites", "#", ...ran3G],
        ["RAN 4G Sites", "#", ...ran4G],
        ["RAN 5G Sites", "#", ...ran5G],
        ["New RAN PoP (2G, 3G, 4G)", "#", ...newRan234],
        ["New RAN PoP (5G)", "#", ...newRan5G],
        ["Unit Price RAN (2G, 3G, 4G)", "USDk", ...Array(fy.length).fill(ran234UnitPrice)],
        ["Unit Price RAN (5G)", "USDk", ...Array(fy.length).fill(ran5GUnitPrice)],
        ["Total Capex RAN (Without Duty)", "USDk", ...totalCapexRAN],
        ["Custom Duty RAN", "USDk", ...ranCustomDuty],
        ["Custom Duty RAN %", "%", ...ranCustomDutyPctArray],
        ["Total Capex RAN + Duty", "USDk", ...totalCapexRANWithDuty],
      
        ["RAN Upgrades Units", "#", ...ranUpgradeUnits],
        ["Unit Price RAN Upgrade", "USDk", ...Array(fy.length).fill(ranUpgradeUnitPrice)],
        ["Total Capex RAN Upgrade", "USDk", ...ranUpgradeCapex],
        ["Total Capex RAN + Duty + Upgrade", "USDk", ...totalCapexRANWithDutyAndUpgrade],
        ["Custom Duty RAN (Base)", "USDk", ...ranCustomDuty],
["Custom Duty RAN Upgrade", "USDk", ...ranUpgradeCustomDuty],
["Custom Duty Tower Upgrade", "USDk", ...towerUpgradeCustomDuty],

        
      );
    }
    

    const data = [header, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CAPEX_Plan");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "CAPEX_Plan.xlsx");
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
   <table
  border="1"
  style={{
    margin: 'auto',
    borderCollapse: 'collapse',
    width: '90%',
    tableLayout: 'auto',
    fontSize: '12px',
  }}
>

        <thead>
          <tr>
            <th style={{ padding: '10px' }}>Item</th>
            <th style={{ padding: '10px' }}>Unité</th>
            {fy.map(y => <th key={y} style={{ padding: '10px' }}>{y}</th>)}
          </tr>
        </thead>
        <tbody>
  {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>

  {/* LEASE SECTION */}
  <tr>
    <td colSpan={fy.length + 2} style={{ fontWeight: 'bold', backgroundColor: '#E70E5B', color: '#F5F5F5', textAlign: 'center' }}>
      LEASE SECTION
    </td>
    </tr>
     {/* Ligne vide */}
 <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>


  <tr>
    <td>New Lease Towers</td><td>#</td>
    {leaseAdditions.map((n, i) => <td key={i}>{formatNumber(n)}</td>)}
  </tr>

  <tr>
    <td>Urban %</td><td>%</td>
    {leaseUrbanPctArray.map((p, i) => <td key={i}>{p}</td>)}
  </tr>

  <tr>
    <td>Rural %</td><td>%</td>
    {leaseRuralPctArray.map((p, i) => <td key={i}>{p}</td>)}
  </tr>

  <tr>
    <td style={{ fontWeight: 'bold' }}>Cumulative Leased Towers</td><td>#</td>
    {lease.map((n, i) => <td key={i} style={{ fontWeight: 'bold' }}>{formatNumber(n)}</td>)}
  </tr>

  <tr>
    <td>Urban Towers</td><td>#</td>
    {leaseUrban.map((n, i) => <td key={i}>{formatNumber(n)}</td>)}
  </tr>

  <tr>
    <td>Rural Towers</td><td>#</td>
    {leaseRural.map((n, i) => <td key={i}>{formatNumber(n)}</td>)}
  </tr>

  <tr>
    <td>Price/Unit (Urban)</td><td>USDk</td>
    {Array(fy.length).fill(leasePriceUrban).map((p, i) => <td key={i}>{formatNumber(p)}</td>)}
  </tr>

  <tr>
    <td>Price/Unit (Rural)</td><td>USDk</td>
    {Array(fy.length).fill(leasePriceRural).map((p, i) => <td key={i}>{formatNumber(p)}</td>)}
  </tr>

  {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>

  {/* BUILD SECTION */}
  <tr>
    <td colSpan={fy.length + 2} style={{ fontWeight: 'bold', backgroundColor: '#E70E5B', color: '#F5F5F5', textAlign: 'center' }}>
      BUILD SECTION
    </td>
    </tr>
     {/* Ligne vide */}
 <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
  

  <tr>
    <td>New Build Towers</td><td>#</td>
    {buildAdditions.map((n, i) => <td key={i}>{formatNumber(n)}</td>)}
  </tr>

  <tr>
    <td>Urban %</td><td>%</td>
    {buildUrbanPctArray.map((p, i) => <td key={i}>{p}</td>)}
  </tr>

  <tr>
    <td>Rural %</td><td>%</td>
    {buildRuralPctArray.map((p, i) => <td key={i}>{p}</td>)}
  </tr>

  <tr>
    <td style={{ fontWeight: 'bold' }}>Cumulative Owned Towers</td><td>#</td>
    {build.map((n, i) => <td key={i} style={{ fontWeight: 'bold' }}>{formatNumber(n)}</td>)}
  </tr>

  <tr>
    <td>Urban Towers</td><td>#</td>
    {buildUrban.map((n, i) => <td key={i}>{formatNumber(n)}</td>)}
  </tr>

  <tr>
    <td>Rural Towers</td><td>#</td>
    {buildRural.map((n, i) => <td key={i}>{formatNumber(n)}</td>)}
  </tr>

  <tr>
    <td>Price/Unit (Urban)</td><td>USDk</td>
    {Array(fy.length).fill(buildPriceUrban).map((p, i) => <td key={i}>{formatNumber(p)}</td>)}
  </tr>

  <tr>
    <td>Price/Unit (Rural)</td><td>USDk</td>
    {Array(fy.length).fill(buildPriceRural).map((p, i) => <td key={i}>{formatNumber(p)}</td>)}
  </tr>

  {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>

  {/* TOTAL TOWERS */}
  <tr>
    <td style={{ fontWeight: 'bold' }}>Total Towers (Owned + Leased)</td><td>#</td>
    {build.map((b, i) => (
      <td key={i} style={{ fontWeight: 'bold' }}>{formatNumber(b + lease[i])}</td>
    ))}
  </tr>
 {/* Ligne vide */}
 <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
  {/* TOTAL TOWER CAPEX */}
  <tr style={{ fontWeight: 'bold', backgroundColor: '#F8DADA' }}>
    <td>Total Tower Capex</td><td>USDk</td>
    {total.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
  </tr>

  {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>

  <tr>
    <td>Custom Duty %</td><td>%</td>
    {customDutyPctArray.map((p, i) => <td key={i}>{p}</td>)}
  </tr>

  <tr>
    <td>Custom Duty</td><td>USDk</td>
    {customDuty.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
  </tr>

  {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>

  <tr style={{ fontWeight: 'bold', backgroundColor: '#F8DADA' }}>
  <td>Total Tower Capex + Duty</td><td>USDk</td>
  {totalTowerCapexWithDuty.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
  {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>

  </tr>
  {/* TOWER UPGRADE SECTION */}
  {/* UPGRADE SECTION */}
<tr>
  <td colSpan={fy.length + 2} style={{ fontWeight: 'bold', backgroundColor: '#E70E5B', color: '#F5F5F5', textAlign: 'center' }}>
    TOWER UPGRADE SECTION
  </td>
  </tr>
  {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>


<tr>
  <td style={{ fontWeight: 'bold' }}>Tower Upgrades Units</td><td>#</td>
  {towerUpgradeUnits.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
<tr>
  <td>Unit Price Tower Upgrade</td><td>USDk</td>
  {Array(fy.length).fill(towerUpgradeUnitPrice).map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
<tr style={{ fontWeight: 'bold', backgroundColor: '#F8DADA' }}>
  <td>Total Capex Tower Upgrade</td><td>USDk</td>
  {towerUpgradeCapex.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
  {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
<tr>
  <td>Custom Duty Tower Upgrade</td><td>USDk</td>
  {towerUpgradeCustomDuty.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
 
<tr style={{ fontWeight: 'bold', backgroundColor: '#F8DADA' }}>
  <td>Total Tower Capex + Duty + Upgrade</td><td>USDk</td>
  {totalTowerCapexWithDutyAndUpgrade.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>


  {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>

  {/* RAN SECTION */}
  {ran2G.length > 0 && (
    <>
      <tr>
        <td colSpan={fy.length + 2} style={{ fontWeight: 'bold', backgroundColor: '#E70E5B', color: '#F5F5F5', textAlign: 'center' }}>
          RAN SECTION
        </td>
      </tr>
        {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
      <tr>
        <td>2G Sites</td><td>#</td>
        {ran2G.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
      </tr>
      <tr>
        <td>3G Sites</td><td>#</td>
        {ran3G.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
      </tr>
      <tr>
        <td>4G Sites</td><td>#</td>
        {ran4G.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
      </tr>
      <tr>
        <td>5G Sites</td><td>#</td>
        {ran5G.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
      </tr>
    </>
  )}

  {/* Nombre de PoP */}
  <tr>
    <td style={{ fontWeight: 'bold' }}>Nombre de PoP</td><td>#</td>
    {totalPoP.map((v, i) => (
      <td key={i} style={{ fontWeight: 'bold' }}>{formatNumber(v)}</td>
    ))}
  </tr>
    {/* Ligne vide */}
    <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
  <tr>
  <td>New RAN PoP (2G, 3G, 4G)</td><td>#</td>
  {newRan234.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>

<tr>
  <td>New RAN PoP (5G)</td><td>#</td>
  {newRan5G.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>

<tr>
  <td>Unit Price RAN (2G, 3G, 4G)</td><td>USDk</td>
  {Array(fy.length).fill(ran234UnitPrice).map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>

<tr>
  <td>Unit Price RAN (5G)</td><td>USDk</td>
  {Array(fy.length).fill(ran5GUnitPrice).map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
 {/* Ligne vide */}
 <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
<tr style={{ fontWeight: 'bold', backgroundColor: '#F8DADA' }}>
  <td>Total Capex RAN</td>
  <td>USDk</td>
  {totalCapexRAN.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
{/* Ligne vide */}
<tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
<tr>
  <td>Custom Duty RAN %</td>
  <td>%</td>
  {ranCustomDutyPctArray.map((p, i) => <td key={i}>{p}</td>)}
</tr>
<tr>
  <td>Custom Duty RAN</td>
  <td>USDk</td>
  {ranCustomDuty.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
 {/* Ligne vide */}
 <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
<tr style={{ fontWeight: 'bold', backgroundColor: '#F8DADA' }}>
  <td>Total Capex RAN + Duty</td><td>USDk</td>
  {totalCapexRANWithDuty.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>

 {/* Ligne vide */}
 <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
{/* RAN UPGRADE SECTION */}

<tr>
  <td colSpan={fy.length + 2} style={{ fontWeight: 'bold', backgroundColor: '#E70E5B', color: '#F5F5F5', textAlign: 'center' }}>
    RAN UPGRADE SECTION
  </td>
</tr>
     {/* Ligne vide */}
     <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>


<tr>
  <td style={{ fontWeight: 'bold' }}>RAN Upgrades Units</td><td>#</td>
  {ranUpgradeUnits.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
<tr>
  <td>Unit Price RAN Upgrade</td><td>USDk</td>
  {Array(fy.length).fill(ranUpgradeUnitPrice).map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
<tr style={{ fontWeight: 'bold', backgroundColor: '#F8DADA' }}>
  <td>Total Capex RAN Upgrade</td><td>USDk</td>
  {ranUpgradeCapex.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
  {/* Ligne vide */}
  <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
<tr>
  <td>Custom Duty RAN Upgrade</td><td>USDk</td>
  {ranUpgradeCustomDuty.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>
 {/* Ligne vide */}
 <tr>
    <td colSpan={fy.length + 2}>&nbsp;</td>
  </tr>
 
<tr style={{ fontWeight: 'bold',backgroundColor: '#F8DADA'}}>
  <td>Total Capex RAN + Duty + Upgrade</td><td>USDk</td>
  {totalCapexRANWithDutyAndUpgrade.map((v, i) => <td key={i}>{formatNumber(v)}</td>)}
</tr>


</tbody>

      </table>

      <button
        onClick={exportToExcel}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#0F1942',
          color:'#F1F1F1',
          fontWeight: 'bold',
        }}
      >
        Exporter en Excel
      </button>
    </div>
  );
}
