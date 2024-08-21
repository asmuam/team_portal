import './App.css';

import TeamHierarchy from './components/TeamHierarchy.js';
import DataTable from './components/DataTable.js';
import React, { useState } from 'react';
import LinkPenting from './components/LinkPenting.js';

function App() {
    const [teams, setTeams] = useState([
        {
            id: 1,
            name: 'Produksi Pertanian',
            activities: [
                {
                    name: 'Survei Produksi Pertanian 2024',
                    subActivities: [
                        {
                            name: 'Perencanaan',
                            tasks: [
                                { name: 'Rapat koordinasi', dateCreated: '2024-01-10', dueDate: '2024-02-01', dateUpload: '', link: '', completed: false, status: '' },
                                { name: 'Pelatihan mitra', dateCreated: '2024-02-05', dueDate: '2024-03-01', dateUpload: '', link: '', completed: true, status: '' }
                            ]
                        },
                        {
                            name: 'Pencacahan',
                            tasks: [
                                { name: 'Pencacahan data lapangan', dateCreated: '2024-03-10', dueDate: '2024-04-10', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                },
                {
                    name: 'Pemantauan Harga Komoditas Pertanian 2024',
                    subActivities: [
                        {
                            name: 'Pengolahan',
                            tasks: [
                                { name: 'Pengolahan data harga', dateCreated: '2024-05-01', dueDate: '2024-06-01', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        },
                        {
                            name: 'Diseminasi',
                            tasks: [
                                { name: 'Penyusunan laporan harga', dateCreated: '2024-06-05', dueDate: '2024-07-01', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 2,
            name: 'Produksi IPEK',
            activities: [
                {
                    name: 'Survei Produksi Industri dan Perdagangan 2024',
                    subActivities: [
                        {
                            name: 'Perencanaan',
                            tasks: [
                                { name: 'Penyusunan jadwal survei', dateCreated: '2024-01-20', dueDate: '2024-02-10', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        },
                        {
                            name: 'Pencacahan',
                            tasks: [
                                { name: 'Pengumpulan data lapangan', dateCreated: '2024-03-15', dueDate: '2024-04-05', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                },
                {
                    name: 'Pemantauan Harga Industri 2024',
                    subActivities: [
                        {
                            name: 'Pengolahan',
                            tasks: [
                                { name: 'Pengolahan data harga industri', dateCreated: '2024-04-20', dueDate: '2024-05-20', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 3,
            name: 'Distribusi Harga',
            activities: [
                {
                    name: 'Pemantauan Harga Eceran 2024',
                    subActivities: [
                        {
                            name: 'Perencanaan',
                            tasks: [
                                { name: 'Rapat penentuan sampel pasar', dateCreated: '2024-02-01', dueDate: '2024-02-15', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        },
                        {
                            name: 'Pencacahan',
                            tasks: [
                                { name: 'Pengumpulan data harga pasar', dateCreated: '2024-03-01', dueDate: '2024-03-31', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 4,
            name: 'Distribusi KTIP',
            activities: [
                {
                    name: 'Survei Ketahanan Pangan 2024',
                    subActivities: [
                        {
                            name: 'Perencanaan',
                            tasks: [
                                { name: 'Penyusunan kerangka survei', dateCreated: '2024-03-01', dueDate: '2024-03-20', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        },
                        {
                            name: 'Diseminasi',
                            tasks: [
                                { name: 'Pelaporan hasil survei', dateCreated: '2024-06-01', dueDate: '2024-06-30', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 5,
            name: 'Umum',
            activities: [
                {
                    name: 'Pengelolaan Administrasi Umum 2024',
                    subActivities: [
                        {
                            name: 'Pengelolaan Surat Menyurat',
                            tasks: [
                                { name: 'Penataan dokumen surat masuk dan keluar', dateCreated: '2024-01-05', dueDate: '2024-01-20', dateUpload: '', link: '', completed: true, status: '' }
                            ]
                        },
                        {
                            name: 'Pengelolaan Keuangan',
                            tasks: [
                                { name: 'Penyusunan laporan keuangan triwulan', dateCreated: '2024-03-01', dueDate: '2024-04-01', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 6,
            name: 'IPDS Diseminasi',
            activities: [
                {
                    name: 'Diseminasi Data Statistik 2024',
                    subActivities: [
                        {
                            name: 'Perencanaan Diseminasi',
                            tasks: [
                                { name: 'Penyusunan strategi diseminasi', dateCreated: '2024-01-15', dueDate: '2024-02-15', dateUpload: '', link: '', completed: true, status: '' }
                            ]
                        },
                        {
                            name: 'Pelaksanaan Diseminasi',
                            tasks: [
                                { name: 'Penyebaran publikasi melalui media', dateCreated: '2024-03-01', dueDate: '2024-03-20', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 7,
            name: 'IPDS TI',
            activities: [
                {
                    name: 'Pengelolaan Sistem Informasi 2024',
                    subActivities: [
                        {
                            name: 'Perencanaan Infrastruktur TI',
                            tasks: [
                                { name: 'Penyusunan rencana pengembangan TI', dateCreated: '2024-01-10', dueDate: '2024-02-01', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        },
                        {
                            name: 'Pemeliharaan Sistem Informasi',
                            tasks: [
                                { name: 'Pemeliharaan server dan jaringan', dateCreated: '2024-04-01', dueDate: '2024-04-30', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 8,
            name: 'Sosial Kependudukan',
            activities: [
                {
                    name: 'Survei Sosial Ekonomi 2024',
                    subActivities: [
                        {
                            name: 'Perencanaan',
                            tasks: [
                                { name: 'Penyusunan instrumen survei', dateCreated: '2024-02-15', dueDate: '2024-03-01', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        },
                        {
                            name: 'Pencacahan',
                            tasks: [
                                { name: 'Pelatihan petugas', dateCreated: '2024-03-20', dueDate: '2024-04-01', dateUpload: '', link: '', completed: true, status: '' },
                                { name: 'Pencacahan data lapangan', dateCreated: '2024-04-05', dueDate: '2024-05-01', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 9,
            name: 'Sosial KesRa',
            activities: [
                {
                    name: 'Survei Kesejahteraan Rakyat 2024',
                    subActivities: [
                        {
                            name: 'Perencanaan',
                            tasks: [
                                { name: 'Penyusunan pedoman survei', dateCreated: '2024-01-25', dueDate: '2024-02-10', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        },
                        {
                            name: 'Pengolahan',
                            tasks: [
                                { name: 'Pengolahan data kesejahteraan rakyat', dateCreated: '2024-04-15', dueDate: '2024-05-15', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 10,
            name: 'Zona Integritas',
            activities: [
                {
                    name: 'Pembangunan Zona Integritas 2024',
                    subActivities: [
                        {
                            name: 'Perencanaan Zona Integritas',
                            tasks: [
                                { name: 'Rapat pembentukan tim ZI', dateCreated: '2024-01-05', dueDate: '2024-01-20', dateUpload: '', link: '', completed: true, status: '' }
                            ]
                        },
                        {
                            name: 'Monitoring dan Evaluasi',
                            tasks: [
                                { name: 'Penyusunan laporan monev', dateCreated: '2024-03-01', dueDate: '2024-03-20', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 11,
            name: 'Nerwilis PDRB LU',
            activities: [
                {
                    name: 'Penghitungan PDRB 2024',
                    subActivities: [
                        {
                            name: 'Pengolahan Data PDRB',
                            tasks: [
                                { name: 'Pengumpulan data sektor LU', dateCreated: '2024-02-01', dueDate: '2024-03-01', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        },
                        {
                            name: 'Diseminasi PDRB',
                            tasks: [
                                { name: 'Penyebaran hasil PDRB ke stakeholder', dateCreated: '2024-06-01', dueDate: '2024-06-30', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 12,
            name: 'Nerwilis PDRB P',
            activities: [
                {
                    name: 'Penghitungan PDRB 2024',
                    subActivities: [
                        {
                            name: 'Pengolahan Data PDRB',
                            tasks: [
                                { name: 'Pengumpulan data sektor LU', dateCreated: '2024-02-01', dueDate: '2024-03-01', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        },
                        {
                            name: 'Diseminasi PDRB',
                            tasks: [
                                { name: 'Penyebaran hasil PDRB ke stakeholder', dateCreated: '2024-06-01', dueDate: '2024-06-30', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        },
        {
            id: 13,
            name: 'Nerwilis Survei',
            activities: [
                {
                    name: 'Survei Sosial Ekonomi Nasional (SUSENAS) 2024',
                    subActivities: [
                        {
                            name: 'Perencanaan',
                            tasks: [
                                { name: 'Penyusunan kuesioner SUSENAS', dateCreated: '2024-01-15', dueDate: '2024-02-15', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        },
                        {
                            name: 'Pencacahan',
                            tasks: [
                                { name: 'Pelaksanaan pencacahan lapangan', dateCreated: '2024-03-01', dueDate: '2024-03-31', dateUpload: '', link: '', completed: false, status: '' }
                            ]
                        }
                    ]
                }
            ],
            links: []
        }
    ]);
    const [activeTab, setActiveTab] = useState('teamHierarchy'); // Default tab

    return (
        <div className='App'>
            <header className='App-header'>
                <h1>Team Hierarchy Management</h1>
            </header>
            <main className='App-main'>
                {/* Tab Navigation */}
                <div className="tabs">
                    <button
                        className={activeTab === 'teamHierarchy' ? 'active' : ''}
                        onClick={() => setActiveTab('teamHierarchy')}
                    >
                        Team Hierarchy
                    </button>
                    <button
                        className={activeTab === 'dataTable' ? 'active' : ''}
                        onClick={() => setActiveTab('dataTable')}
                    >
                        Data Table
                    </button>
                    <button
                        className={activeTab === 'linkPenting' ? 'active' : ''}
                        onClick={() => setActiveTab('linkPenting')}
                    >
                        Link Penting
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'teamHierarchy' && (
                        <div className='main-page'>
                            <div className="page active">
                                <TeamHierarchy teams={teams} setTeams={setTeams} />
                            </div>
                        </div>

                    )}
                    {activeTab === 'dataTable' && (
                        <div className="page active">
                            <DataTable data={teams} />
                        </div>
                    )}
                    {activeTab === 'linkPenting' && (
                        <div className="page active">
                            <LinkPenting data={teams} />
                        </div>
                    )}
                </div>
            </main>
            <footer className='App-footer'>
                <p>&copy; 2024 Your Company</p>
            </footer>
        </div>
    );
}

export default App;
