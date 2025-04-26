"use client";
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';


interface TelemetryData {
  time: number;
  temperature: number;
  pressure: number;
  voltage: number;
}

// Update the StatCard component props
interface StatCardProps {
  label: string;
  value: string | number;
  unit: string;
  trend?: 'up' | 'down';
}


export default function TelemetryDashboard() {
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'pressure'>('temperature');
  // const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    // Fetch telemetry data from FastAPI
    fetch('http://localhost:8000/telemetry')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch telemetry');
        return res.json();
      })
      .then(data => {
        setTelemetry(data);
        return fetch('http://localhost:8000/anomalies');
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch anomalies');
        return res.json();
      })
      // .then(data => setAnomalies(data.anomalies))
      .catch(error => {
        console.error('Fetch error:', error);
        alert('Failed to load data. Check console for details.');
      });
  }, []);


  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-12">
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Spacecraft Artemis-7
              <span className="ml-4 text-xl font-mono text-slate-400">Live Telemetry</span>
            </motion.h1>
            <div className="flex gap-4">
              <Badge
                variant={selectedMetric === 'temperature' ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => setSelectedMetric('temperature')}
              >
                🌡️ Temperature
              </Badge>
              <Badge
                variant={selectedMetric === 'pressure' ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => setSelectedMetric('pressure')}
              >
                🌀 Pressure
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Animated Chart Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-slate-200">
                  {selectedMetric === 'temperature' ? 'Temperature' : 'Pressure'} Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                {telemetry.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={telemetry}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="time"
                        tick={{ fill: '#94a3b8' }}
                        stroke="#94a3b8"
                        label={{
                          value: 'Time (s)',
                          position: 'bottom',
                          fill: '#94a3b8'
                        }}
                      />
                      <YAxis
                        tick={{ fill: '#94a3b8' }}
                        stroke="#94a3b8"
                        label={{
                          value: selectedMetric === 'temperature' ? '°C' : 'kPa',
                          angle: -90,
                          position: 'insideLeft',
                          fill: '#94a3b8'
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#0f172a',
                          border: '1px solid #1e293b',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey={selectedMetric}
                        stroke={selectedMetric === 'temperature' ? '#22d3ee' : '#818cf8'}
                        strokeWidth={2}
                        dot={false}
                        animationDuration={300}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton className="w-full h-full rounded-lg bg-slate-700/50" />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* System Status */}
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800/50 border-slate-700 h-full backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-slate-200">Anomaly Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {telemetry.filter(d =>
                  (selectedMetric === 'temperature' && !(20 <= d.temperature && d.temperature <= 25)) ||
                  (selectedMetric === 'pressure' && !(91.1925 <= d.pressure && d.pressure <= 101.3))
                ).map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'p-4 rounded-lg transition-all cursor-pointer',
                      'hover:bg-slate-700/50 border border-slate-700',
                      selectedMetric === 'temperature' ? 'bg-cyan-900/20' : 'bg-indigo-900/20'
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-slate-200">
                          {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Anomaly
                        </h3>
                        <p className="text-sm text-slate-400">
                          {entry.time}s • Value: {entry[selectedMetric].toFixed(2)}
                        </p>
                      </div>
                      <Badge variant="destructive" className="animate-pulse">
                        ⚠️ Critical
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Current Temp"
            value={telemetry[telemetry.length - 1]?.temperature ?? '--'}
            unit="°C"
            trend="up"
          />
          <StatCard
            label="Current Pressure"
            value={telemetry[telemetry.length - 1]?.pressure ?? '--'}
            unit="kPa"
            trend="down"
          />
          <StatCard
            label="Total Anomalies"
            value={telemetry.filter(d =>
              !(20 <= d.temperature && d.temperature <= 25) ||
              !(91.1925 <= d.pressure && d.pressure <= 101.3)
            ).length}
            unit="events"
          />
          <StatCard
            label="System Health"
            value={telemetry.length > 0 ?
              `${Math.round((1 - (telemetry.filter(d =>
                !(20 <= d.temperature && d.temperature <= 25) ||
                !(91.1925 <= d.pressure && d.pressure <= 101.3)
              ).length / telemetry.length) * 100))}%` : '--'}
            
            unit=""
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, unit, trend }: StatCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400">{label}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-slate-200">
                  {value}
                </span>
                <span className="text-sm text-slate-400">{unit}</span>
              </div>
            </div>
            {trend && (
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'
              )}>
                {trend === 'up' ? '📈' : '📉'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}