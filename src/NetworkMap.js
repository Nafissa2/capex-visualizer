import React from 'react';
import RanInfoBox from './RanInfoBox';
import FiberInfoBox from './FiberInfoBox';
import DataCenterInfoBox from './DataCenterInfoBox';
import EnergyInfoBox from './EnergyInfoBox';
import TowerInfoBox from './TowerInfoBox';

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

// Voici bien le tableau nodes que tu avais oublié de coller !
const nodes = [
  {
    id: 'fiber-info',
    type: 'fiberinfo',
    position: { x: 675, y: 250 },
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
    position: { x: 2000, y: 300 },
    data: {
      label: 'Data Center',
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
    position: { x: 550, y: 0 },
    data: {
      label: 'Energy',
      price: '$10k-$25k',
    },
  },
  {
    id: 'tower1',
    type: 'tower',
    position: { x: -350, y: -700 },
    data: { label: 'RAN Tower 1', image: '/tower3.png.jpg' },
  },
  {
    id: 'tower2',
    type: 'tower',
    position: { x:1400, y: -680 },
    data: { label: 'RAN Tower 2', image: '/tower3.png.jpg' },
  },
  {
    id: 'datacenter',
    type: 'datacenter',
    position: { x: 0, y: 0 },
    data: { label: 'Data Center', image: '/datacenter3.png.jpg' },
  },
  {
    id: 'energy',
    type: 'energy',
    position: { x: 700, y: -100 },
    data: { label: 'Energy Unit', image: '/energy.png' },
  },
  {
    id: 'energy2',
    type: 'energy',
    position: { x: 2950, y: -150 },
    data: { label: 'Energy Unit', image: '/energy.png' },
  },
  {
    id: 'ran-info',
    type: 'raninfo',
    position: { x: 700, y: -700 },
    data: {
      label: 'RAN & Tower',
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
];

const edges = [
  {
    id: 'fibre-t1-dc',
    source: 'tower1',
    target: 'datacenter',
    type: 'bezier',
    animated: true,
    label: 'Fibre Optic',
    labelStyle: { fill: 'blue', fontWeight: 'bold', fontSize: 12 },
    sourcePosition: 'right',
    targetPosition: 'left',
    style: {
      stroke: '#007bff',
      strokeWidth: 7,
      strokeDasharray: '8 4',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#007bff',
    },
  },
  {
    id: 'fibre-t2-dc',
    source: 'tower2',
    target: 'datacenter',
    type: 'bezier',
    animated: true,
    label: 'Fibre Optic',
    labelStyle: { fill: 'blue', fontWeight: 'bold', fontSize: 12 },
    sourcePosition: 'left',
    targetPosition: 'right',
    style: {
      stroke: '#007bff',
      strokeWidth: 7,
      strokeDasharray: '8 4',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#007bff',
    },
  },
  {
    id: 'radio-t1-t2',
    source: 'tower1',
    target: 'tower2',
    type: 'bezier',
    animated: true,
    label: 'Radio Link ➔',
    labelStyle: { fill: 'yellow', fontWeight: 'bold', fontSize: 12 },
    sourcePosition: 'bottom',
    targetPosition: 'bottom',
    style: {
      stroke: 'yellow',
      strokeWidth: 6,
      strokeDasharray: '2 1',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'gray',
    },
  },
  {
    id: 'radio-t2-t1',
    source: 'tower2',
    target: 'tower1',
    type: 'bezier',
    animated: true,
    label: 'Radio Link ⬅',
    labelStyle: { fill: 'black', fontWeight: 'bold', fontSize: 12 },
    sourcePosition: 'top',
    targetPosition: 'top',
    style: {
      stroke: 'red',
      strokeWidth: 6,
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
      stroke: '#28a745',
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#28a745',
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
      stroke: '#28a745',
      strokeWidth: 3,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#28a745',
    },
  },
];

export default function NetworkMap() {
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
  edgeTypes={{ custom: CustomEdge }}
  defaultViewport={{
    x: 0,
    y: 0,
    zoom: 1.5, // ➜ plus grand au chargement
  }}
  fitView
  fitViewOptions={{
    padding: 0.2,
  }}
  minZoom={0.5}
  maxZoom={2}
>
  <Background color="transparent" />
  <Controls />
</ReactFlow>

    </div>
  );
}
