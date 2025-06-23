import React, { useState } from 'react';

import RanInfoBox from './RanInfoBox';
import FiberInfoBox from './FiberInfoBox';
import DataCenterInfoBox from './DataCenterInfoBox';
import EnergyInfoBox from './EnergyInfoBox';
import TowerInfoBox from './TowerInfoBox';
import CustomWaveEdge from './CustomWaveEdge';
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TowerNode from './TowerNode';
import DataCenterNode from './DataCenterNode';
import EnergyNode from './EnergyNode';
import CustomEdge from './CustomEdge';

const nodeTypes = {
  tower: TowerNode,
  datacenter: DataCenterNode,
  energy: EnergyNode,
  raninfo: RanInfoBox,
  fiberinfo: FiberInfoBox,
  datacenterinfo: DataCenterInfoBox,
  energyinfo: EnergyInfoBox,
  towerinfo: TowerInfoBox,
};

const edges = [

  {
    id: 'radio-t1-t2',
    source: 'tower1',
    target: 'tower2',
    type: 'customWave',
    animated: true,
    label: 'Radio Link ➔',
    labelStyle: { fill: 'yellow', fontWeight: 'bold', fontSize: 12 },
    sourcePosition: 'bottom',
    targetPosition: 'bottom',
    style: {
      stroke: '#E0135C',
      strokeWidth: 4,
      strokeDasharray: '2 1',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'gray',
    },
  },

  {
    id: 'power-t1-energy',
    source: 'tower1',
    target: 'energy',
    type: 'step',
    animated: false,
    label: 'Power Cable',
    labelStyle: { fill: 'red', fontWeight: 'bold', fontSize: 12 },
    style: {
      stroke: '#32CCD6',
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#32CCD6',
    },
  },
  {
    id: 'power-t2-energy2',
    source: 'tower2',
    target: 'energy2',
    type: 'step',
    animated: false,
    label: 'Power Cable',
    labelStyle: { fill: 'green', fontWeight: 'bold', fontSize: 12 },
    style: {
      stroke: '#32CCD6',
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#32CCD6',
    },
  },
];

export default function NetworkMap() {

  // ✅ useState placé CORRECTEMENT à l'intérieur
  const [nodes, setNodes] = useState([
    {
      id: 'fiber-info',
      type: 'fiberinfo',
      position: { x: 100, y: 450 },
      data: {
        label: 'FIBER',
        details: [
          { name: 'Transmission Backbone(TX)', price: '$7k' },
          { name: 'Metro(TX)', price: '$15k' },
          { name: 'MW (Microwave)', price: '$7.5k-$15k/line' },
          { name: 'Satellite', price: '$?k' },
        ],
      },
    },
    {
      id: 'datacenter-info',
      type: 'datacenterinfo',
      position: { x: 1000, y: 415},
      data: {
        label: 'DATA CENTER',
        details: [
          { name: 'Total Data-center', price: '$10k-$20k' },
          { name: 'Core Network - Internet', price: '$1-2/Subs/an' },
          { name: 'Core Network - Voice', price: '$?k' },
          { name: 'Core Network - SMS', price: '$?' },
          { name: 'IT Stack - BSS', price: '$?' },
          { name: 'IT Stack - MFS', price: '$?' },
          { name: 'IT Stack - IT', price: '?' },
        ],
      },
    },
    {
      id: 'energy-info',
      type: 'energyinfo',
      position: { x: 300, y: 300 },
      data: {
        label: 'ENERGY',
        price: '$10k-$25k',
      },
    },
    {
      id: 'tower1',
      type: 'tower',
      position: { x: 100, y: -85 },
      data: { label: '', image: '/tower3.png.jpg' },
    },
    {
      id: 'tower2',
      type: 'tower',
      position: { x: 850, y: -85 },
      data: { label: '', image: '/tower3.png.jpg' },
    },
    {
      id: 'datacenter',
      type: 'datacenter',
      position: { x: 500, y: 400 },
      data: { label: 'Data Center', image: '/datacenter3.png.jpg' },
    },
    {
      id: 'energy',
      type: 'energy',
      position: { x: 100, y: 260 },
      data: { label: 'Energy Unit', image: '/energy2.png' },
    },
    {
      id: 'energy2',
      type: 'energy',
      position: { x: 1050, y: 260 },
      data: { label: 'Energy Unit', image: '/energy2.png' },
    },
    {
      id: 'ran-info',
      type: 'raninfo',
      position: { x: 575, y: 7 },
      data: {
        label: 'RAN & TOWER',
        details: [
          { name: 'BuildPrice', price: '$80k-$100k/tower(rural) and $100k-$120k/tower(urban)' },
          { name: 'UpgradePrice', price: '$7k-$15k/an' },
          { name: 'Lease', price: '$20k/tour/year' },
          { name: '2G', price: '$25k-$35k' },
          { name: '3G', price: '$25k-$35k' },
          { name: '4G', price: '$25k-$35k' },
          { name: '5G', price: '$40k-$50k' },
        ],
      },
    },
  ]);

  return (
    <div style={{
      width: '100%',
      height: '1000px',
      backgroundImage: 'url("/background4.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
     
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={{ custom: CustomEdge, customWave: CustomWaveEdge }}
      >
        <Background color="transparent" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
