import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    // Datos simulados para los indicadores y tablas
    const kpis = [
        { title: "Manifiestos Emitidos", value: "1,248", change: "+12%", isPositive: true, color: "blue" },
        { title: "Toneladas Transportadas", value: "45.2 Ton", change: "+8.3%", isPositive: true, color: "green" },
        { title: "Pendientes de Firma", value: "14", change: "-3", isPositive: true, color: "amber" },
        { title: "Alertas Activas", value: "2", change: "+1", isPositive: false, color: "red" }
    ];

    const recentManifests = [
        { id: "MAN-2026-001", empresa: "Corporación Aceros SAC", fecha: "08/06/2026", estado: "Completado", peso: "12.5 Ton" },
        { id: "MAN-2026-002", empresa: "Logística del Sur E.I.R.L.", fecha: "07/06/2026", estado: "En Ruta", peso: "8.2 Ton" },
        { id: "MAN-2026-003", empresa: "Química Industrial Lima", fecha: "05/06/2026", estado: "Pendiente", peso: "4.0 Ton" },
        { id: "MAN-2026-004", empresa: "Transportes Meridian", fecha: "04/06/2026", estado: "Completado", peso: "20.5 Ton" }
    ];

    return (
        <div className='' style={{ padding: '8px', fontFamily: 'Segoe UI, sans-serif' }}>
            {/* CUADROS DE ÍNDICES / KPIS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {kpis.map((kpi, idx) => (
                    <div className="shadow-lg border border-gray-100" key={idx} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{kpi.title}</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '12px' }}>
                            <span style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{kpi.value}</span>
                            <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 8px', borderRadius: '20px', backgroundColor: kpi.isPositive ? '#f0fdf4' : '#fef2f2', color: kpi.isPositive ? '#16a34a' : '#dc2626' }}>
                                {kpi.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* SECCIÓN DE GRÁFICOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '32px' }}>

                {/* GRÁFICO 1: LÍNEA DE TENDENCIA */}
                <div className="shadow-lg border border-gray-100" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#1e293b' }}>Flujo Mensual de Manifiestos</h3>
                    <div style={{ width: '100%', height: '200px', position: 'relative' }}>
                        <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            {/* Líneas de cuadrícula de fondo */}
                            <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                            {/* Gráfico de línea */}
                            <path
                                d="M 20 160 Q 100 120 180 140 T 340 70 T 480 50"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            {/* Puntos clave */}
                            <circle cx="180" cy="140" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                            <circle cx="340" cy="70" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                            <circle cx="480" cy="50" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                        </svg>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>
                        <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
                    </div>
                </div>

                {/* GRÁFICO 2: BARRAS COMPARATIVAS */}
                <div className="shadow-lg border border-gray-100" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#1e293b' }}>Operaciones por Tipo de Residuo</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '200px', paddingTop: '20px' }}>
                        {[
                            { label: 'Peligrosos', height: '80%', color: '#ef4444' },
                            { label: 'No Peligrosos', height: '55%', color: '#10b981' },
                            { label: 'Reciclables', height: '40%', color: '#3b82f6' },
                            { label: 'Otros', height: '25%', color: '#64748b' }
                        ].map((bar, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
                                <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ height: bar.height, width: '100%', backgroundColor: bar.color, borderRadius: '4px', animation: 'grow 1s ease-out' }}></div>
                                </div>
                                <span style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{bar.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* TABLA DE ÚLTIMOS MOVIMIENTOS */}
            <div className="shadow-lg border border-gray-100" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#1e293b' }}>Últimos Manifiestos Registrados</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                                <th style={{ padding: '12px 8px' }}>Código</th>
                                <th style={{ padding: '12px 8px' }}>Empresa Co-partícipe</th>
                                <th style={{ padding: '12px 8px' }}>Fecha</th>
                                <th style={{ padding: '12px 8px' }}>Carga</th>
                                <th style={{ padding: '12px 8px' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentManifests.map((man, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                                    <td style={{ padding: '16px 8px', fontWeight: '600', color: '#3b82f6' }}>{man.id}</td>
                                    <td style={{ padding: '16px 8px' }}>{man.empresa}</td>
                                    <td style={{ padding: '16px 8px', color: '#64748b' }}>{man.fecha}</td>
                                    <td style={{ padding: '16px 8px' }}>{man.peso}</td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: man.estado === 'Completado' ? '#f0fdf4' : man.estado === 'En Ruta' ? '#eff6ff' : '#fffbeb',
                                            color: man.estado === 'Completado' ? '#16a34a' : man.estado === 'En Ruta' ? '#2563eb' : '#d97706'
                                        }}>
                                            {man.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;