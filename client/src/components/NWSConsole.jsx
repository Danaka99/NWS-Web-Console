import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  Cloud,
  Database,
  Gauge,
  HardDrive,
  Home,
  Layers,
  Menu,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Server,
  Shield,
  TerminalSquare,
  SunMedium,
  Timer,
  X,
  Zap,
} from 'lucide-react';

const INITIAL_USERS = [
  { id: 1, name: 'admin.uws', email: 'admin@uws.cloud', role: 'Admin', status: 'active' },
  { id: 2, name: 'ops.lead', email: 'ops@uws.cloud', role: 'Operator', status: 'active' },
  { id: 3, name: 'audit.readonly', email: 'audit@uws.cloud', role: 'Viewer', status: 'inactive' },
];

const INITIAL_INSTANCES = [
  {
    id: 'vm-001',
    name: 'api-gateway',
    flavor: 'c2.large',
    zone: 'us-east-1a',
    image: 'ubuntu-22.04-lts',
    privateIp: '10.24.1.11',
    uptime: '18d 03h',
    status: 'running',
    cpu: 43,
    memory: 61,
  },
  {
    id: 'vm-002',
    name: 'billing-worker',
    flavor: 'c2.medium',
    zone: 'us-east-1b',
    image: 'debian-12',
    privateIp: '10.24.2.33',
    uptime: '0d 00h',
    status: 'stopped',
    cpu: 0,
    memory: 0,
  },
  {
    id: 'vm-003',
    name: 'realtime-stream',
    flavor: 'c2.xlarge',
    zone: 'us-east-1a',
    image: 'ubuntu-22.04-lts',
    privateIp: '10.24.1.74',
    uptime: '4d 11h',
    status: 'running',
    cpu: 72,
    memory: 78,
  },
];

const INITIAL_CONTAINERS = [
  { id: 'obj-001', name: 'audit-archive', objects: 1971, size: '86.4 GB', policy: 'Versioning', region: 'us-east-1' },
  { id: 'obj-002', name: 'media-lake', objects: 446, size: '1.2 TB', policy: 'Lifecycle', region: 'us-east-1' },
  { id: 'obj-003', name: 'edge-cache', objects: 113, size: '18.0 GB', policy: 'Hot', region: 'us-east-1' },
];

const INITIAL_VOLUMES = [
  { id: 'vol-001', name: 'db-primary', size: 500, type: 'ssd.performance', attachedTo: 'vm-001', status: 'in-use', iops: 12000 },
  { id: 'vol-002', name: 'analytics-cold', size: 1024, type: 'hdd.archive', attachedTo: '-', status: 'available', iops: 800 },
  { id: 'vol-003', name: 'queue-disk', size: 220, type: 'ssd.standard', attachedTo: 'vm-003', status: 'in-use', iops: 4000 },
];

const INITIAL_EVENTS = [
  { id: 1, title: 'Created VM api-gateway in us-east-1a', when: '2 min ago', tone: 'good' },
  { id: 2, title: 'Attached volume db-primary to vm-001', when: '9 min ago', tone: 'info' },
  { id: 3, title: 'Policy lifecycle enabled on media-lake', when: '22 min ago', tone: 'warn' },
  { id: 4, title: 'Rotated identity keys for ops.lead', when: '41 min ago', tone: 'info' },
];

const SERVICES = [
  { id: 'dashboard', label: 'Overview', icon: Home, helper: 'Control plane status' },
  { id: 'identity', label: 'Identity', icon: Shield, helper: 'Users, roles, access' },
  { id: 'compute', label: 'Compute', icon: Server, helper: 'VMs, flavors, zones' },
  { id: 'storage', label: 'Object Storage', icon: Database, helper: 'Buckets and objects' },
  { id: 'block', label: 'Block Storage', icon: HardDrive, helper: 'Volumes and snapshots' },
  { id: 'network', label: 'Network', icon: Layers, helper: 'Virtual networking' },
  { id: 'operations', label: 'Operations', icon: Activity, helper: 'Alerts and runtime' },
];

const statusClass = {
  running: 'status-pill is-success',
  stopped: 'status-pill is-muted',
  rebooting: 'status-pill is-warning',
  active: 'status-pill is-success',
  inactive: 'status-pill is-danger',
  'in-use': 'status-pill is-warning',
  available: 'status-pill is-success',
};

function NWSConsole() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [query, setQuery] = useState('');

  const [users, setUsers] = useState(INITIAL_USERS);
  const [instances, setInstances] = useState(INITIAL_INSTANCES);
  const [containers, setContainers] = useState(INITIAL_CONTAINERS);
  const [volumes, setVolumes] = useState(INITIAL_VOLUMES);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [consoleWindow, setConsoleWindow] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('uws-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('uws-theme', theme);
  }, [theme]);

  const filteredInstances = useMemo(() => {
    if (!query.trim()) {
      return instances;
    }

    const normalized = query.toLowerCase();
    return instances.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        item.id.toLowerCase().includes(normalized) ||
        item.zone.toLowerCase().includes(normalized)
    );
  }, [instances, query]);

  const kpis = useMemo(
    () => [
      { id: 'users', label: 'Identity Principals', value: users.length, delta: '+12%', icon: Shield },
      { id: 'instances', label: 'Compute Instances', value: instances.length, delta: '+7%', icon: Server },
      { id: 'containers', label: 'Object Containers', value: containers.length, delta: '+18%', icon: Database },
      {
        id: 'storage',
        label: 'Provisioned Block (GB)',
        value: volumes.reduce((sum, vol) => sum + vol.size, 0),
        delta: '+4%',
        icon: HardDrive,
      },
    ],
    [users.length, instances.length, containers.length, volumes]
  );

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addEvent = (title, tone = 'info') => {
    setEvents((prev) => [{ id: Date.now(), title, when: 'just now', tone }, ...prev].slice(0, 6));
  };

  const createUser = () => {
    const suffix = Math.floor(Math.random() * 900 + 100);
    const next = {
      id: Date.now(),
      name: `engineer.${suffix}`,
      email: `engineer.${suffix}@uws.cloud`,
      role: 'Operator',
      status: 'active',
    };

    setUsers((prev) => [next, ...prev]);
    addEvent(`Created identity user ${next.name}`, 'good');
  };

  const createInstance = () => {
    const suffix = Math.floor(Math.random() * 900 + 100);
    const zones = ['us-east-1a', 'us-east-1b', 'us-east-1c'];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const next = {
      id: `vm-${suffix}`,
      name: `service-${suffix}`,
      flavor: 'c2.medium',
      zone,
      image: 'ubuntu-22.04-lts',
      privateIp: `10.24.${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 100 + 10)}`,
      uptime: '0d 00h',
      status: 'running',
      cpu: Math.floor(Math.random() * 50 + 20),
      memory: Math.floor(Math.random() * 40 + 30),
    };

    setInstances((prev) => [next, ...prev]);
    addEvent(`Launched instance ${next.name} in ${zone}`, 'good');
  };

  const toggleInstanceState = (id) => {
    setInstances((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const isRunning = item.status === 'running';
        addEvent(`${isRunning ? 'Stopped' : 'Started'} instance ${item.name}`, isRunning ? 'warn' : 'good');

        return {
          ...item,
          status: isRunning ? 'stopped' : 'running',
          uptime: isRunning ? '0d 00h' : '0d 01h',
          cpu: isRunning ? 0 : Math.floor(Math.random() * 50 + 20),
          memory: isRunning ? 0 : Math.floor(Math.random() * 45 + 35),
        };
      })
    );
  };

  const rebootInstance = (id) => {
    const instance = instances.find((item) => item.id === id);
    if (!instance) {
      return;
    }

    setInstances((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'rebooting',
            }
          : item
      )
    );
    addEvent(`Reboot initiated for ${instance.name}`, 'warn');

    setTimeout(() => {
      setInstances((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'running',
                cpu: Math.floor(Math.random() * 50 + 30),
                memory: Math.floor(Math.random() * 40 + 30),
              }
            : item
        )
      );
      addEvent(`Reboot completed for ${instance.name}`, 'good');
    }, 1200);
  };

  const createContainer = () => {
    const suffix = Math.floor(Math.random() * 900 + 100);
    const next = {
      id: `obj-${suffix}`,
      name: `assets-${suffix}`,
      objects: Math.floor(Math.random() * 500),
      size: `${(Math.random() * 200).toFixed(1)} GB`,
      policy: 'Lifecycle',
      region: 'us-east-1',
    };

    setContainers((prev) => [next, ...prev]);
    addEvent(`Created object container ${next.name}`, 'good');
  };

  const createVolume = () => {
    const suffix = Math.floor(Math.random() * 900 + 100);
    const next = {
      id: `vol-${suffix}`,
      name: `disk-${suffix}`,
      size: Math.floor(Math.random() * 600 + 100),
      type: 'ssd.standard',
      attachedTo: '-',
      status: 'available',
      iops: 3500,
    };

    setVolumes((prev) => [next, ...prev]);
    addEvent(`Provisioned block volume ${next.name}`, 'good');
  };

  const openConsoleWindow = (title, description, metadata) => {
    setConsoleWindow({ title, description, metadata });
  };

  const closeConsoleWindow = () => {
    setConsoleWindow(null);
  };

  const uploadObjectToContainer = (containerId) => {
    setContainers((prev) =>
      prev.map((item) => {
        if (item.id !== containerId) {
          return item;
        }

        const uploadedMb = Math.floor(Math.random() * 800 + 30);
        const updatedGb = `${(parseFloat(item.size) + uploadedMb / 1024).toFixed(1)} GB`;
        addEvent(`Uploaded object to ${item.name} (+${uploadedMb} MB)`, 'good');
        return { ...item, objects: item.objects + 1, size: updatedGb };
      })
    );
  };

  const attachVolumeToInstance = (volumeId) => {
    const runningInstance = instances.find((instance) => instance.status === 'running');
    if (!runningInstance) {
      addEvent('No running instance available for volume attach', 'warn');
      return;
    }

    setVolumes((prev) =>
      prev.map((item) => {
        if (item.id !== volumeId || item.attachedTo !== '-') {
          return item;
        }

        addEvent(`Attached volume ${item.name} to ${runningInstance.id}`, 'good');
        return { ...item, attachedTo: runningInstance.id, status: 'in-use' };
      })
    );
  };

  const detachVolume = (volumeId) => {
    setVolumes((prev) =>
      prev.map((item) => {
        if (item.id !== volumeId || item.attachedTo === '-') {
          return item;
        }

        addEvent(`Detached volume ${item.name} from ${item.attachedTo}`, 'warn');
        return { ...item, attachedTo: '-', status: 'available' };
      })
    );
  };

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((item) => {
        if (item.id !== userId) {
          return item;
        }

        const nextStatus = item.status === 'active' ? 'inactive' : 'active';
        addEvent(`Set user ${item.name} to ${nextStatus}`, nextStatus === 'active' ? 'good' : 'warn');
        return { ...item, status: nextStatus };
      })
    );
  };

  const renderConsoleWindow = () => {
    if (!consoleWindow) {
      return null;
    }

    return (
      <div className="console-window-overlay" role="dialog" aria-modal="true">
        <section className="console-window">
          <header className="console-head">
            <div>
              <p className="window-eyebrow">Frontend Service Console</p>
              <h3>{consoleWindow.title}</h3>
            </div>
            <button className="icon-btn" onClick={closeConsoleWindow} aria-label="Close window">
              <X size={16} />
            </button>
          </header>

          <p className="console-description">{consoleWindow.description}</p>

          <div className="window-grid">
            {consoleWindow.metadata.map((item) => (
              <article key={item.label} className="window-tile">
                <p>{item.label}</p>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <div className="terminal-block">
            <div className="terminal-head">
              <TerminalSquare size={16} />
              <span>Action Preview</span>
            </div>
            <pre>
              uwsctl inspect --service "{consoleWindow.title.toLowerCase()}"{`\n`}
              status: healthy{`\n`}
              workflow: frontend-simulation-mode
            </pre>
          </div>

          <div className="window-actions">
            <button className="btn btn-primary" onClick={closeConsoleWindow}>
              Continue
            </button>
          </div>
        </section>
      </div>
    );
  };

  const renderDashboard = () => (
    <section className="view-grid">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">UWS | Unseens Web Services</p>
          <h1>World-class cloud control, built for speed.</h1>
          <p>
            Operate identity, compute, and storage from one unified cockpit. Designed for modern operations teams with
            instant feedback and clean workflows.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={createInstance}>
              <Plus size={16} /> Launch Instance
            </button>
            <button className="btn btn-ghost" onClick={createUser}>
              <Shield size={16} /> Add Identity User
            </button>
          </div>
        </div>
        <div className="health-card">
          <h3>Global Health</h3>
          <div className="health-meter">
            <span>99.982%</span>
            <small>30-day uptime</small>
          </div>
          <div className="health-list">
            <p>
              <span /> API Gateway latency: 82ms
            </p>
            <p>
              <span /> VM scheduler queue: Normal
            </p>
            <p>
              <span /> Object replication: Healthy
            </p>
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((item, idx) => {
          const Icon = item.icon;
          return (
            <article key={item.id} className="kpi-card" style={{ animationDelay: `${idx * 80}ms` }}>
              <div>
                <p>{item.label}</p>
                <h2>{item.value}</h2>
              </div>
              <div className="kpi-right">
                <Icon size={20} />
                <strong>{item.delta}</strong>
              </div>
            </article>
          );
        })}
      </div>

      <div className="split-grid">
        <section className="panel">
          <header className="panel-header">
            <h3>Service Activity</h3>
            <button className="text-btn">View Stream</button>
          </header>
          <div className="timeline">
            {events.map((event) => (
              <div key={event.id} className={`timeline-row ${event.tone}`}>
                <div className="dot" />
                <div>
                  <p>{event.title}</p>
                  <small>{event.when}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <header className="panel-header">
            <h3>Quick Automations</h3>
            <Zap size={16} />
          </header>
          <div className="automation-list">
            <button className="automation-card" onClick={createContainer}>
              <Gauge size={18} />
              <div>
                <h4>Scale object ingest lane</h4>
                <p>Boost write throughput for media-lake by 2x.</p>
              </div>
            </button>
            <button className="automation-card" onClick={createVolume}>
              <HardDrive size={18} />
              <div>
                <h4>Provision analytics volume</h4>
                <p>Allocate optimized SSD block storage in one click.</p>
              </div>
            </button>
            <button className="automation-card" onClick={createInstance}>
              <Server size={18} />
              <div>
                <h4>Deploy edge runtime nodes</h4>
                <p>Launch compute workers near active traffic zones.</p>
              </div>
            </button>
            <button
              className="automation-card"
              onClick={() =>
                openConsoleWindow('Overview Control Window', 'Unified control plan for UWS frontend services.', [
                  { label: 'Live Services', value: SERVICES.length - 1 },
                  { label: 'Automation Rules', value: '14 active' },
                  { label: 'Safe Mode', value: 'Enabled' },
                ])
              }
            >
              <TerminalSquare size={18} />
              <div>
                <h4>Open unified console window</h4>
                <p>Inspect all service lanes and route actions from one place.</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </section>
  );

  const renderIdentity = () => (
    <section className="panel-stack">
      <header className="panel-header">
        <h2>Identity and Access Management</h2>
        <button className="btn btn-primary" onClick={createUser}>
          <Plus size={16} /> Create User
        </button>
      </header>
      <div className="table-wrap">
        <table className="uws-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={statusClass[user.status]}>{user.status}</span>
                </td>
                <td>
                  <div className="action-row">
                    <button className="chip-btn" onClick={() => toggleUserStatus(user.id)}>
                      {user.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      className="chip-btn"
                      onClick={() =>
                        openConsoleWindow(`Identity: ${user.name}`, 'Detailed principal view with role and access posture.', [
                          { label: 'Role', value: user.role },
                          { label: 'Email', value: user.email },
                          { label: 'Status', value: user.status },
                        ])
                      }
                    >
                      Open Window
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderCompute = () => (
    <section className="panel-stack">
      <header className="panel-header">
        <h2>Compute Instances</h2>
        <button className="btn btn-primary" onClick={createInstance}>
          <Plus size={16} /> New VM
        </button>
      </header>
      <div className="table-wrap">
        <table className="uws-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Flavor</th>
              <th>Zone</th>
              <th>IP</th>
              <th>CPU</th>
              <th>Memory</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstances.map((instance) => (
              <tr key={instance.id}>
                <td>{instance.name}</td>
                <td>{instance.flavor}</td>
                <td>{instance.zone}</td>
                <td>{instance.privateIp}</td>
                <td>{instance.cpu}%</td>
                <td>{instance.memory}%</td>
                <td>
                  <span className={statusClass[instance.status]}>{instance.status}</span>
                </td>
                <td>
                  <div className="action-row">
                    <button
                      className="chip-btn"
                      onClick={() => toggleInstanceState(instance.id)}
                      disabled={instance.status === 'rebooting'}
                    >
                      {instance.status === 'running' ? 'Stop' : 'Start'}
                    </button>
                    <button
                      className="chip-btn"
                      onClick={() => rebootInstance(instance.id)}
                      disabled={instance.status !== 'running'}
                    >
                      Reboot
                    </button>
                    <button
                      className="chip-btn"
                      onClick={() =>
                        openConsoleWindow(`Compute: ${instance.name}`, 'Instance shell and diagnostics (frontend simulation).', [
                          { label: 'Instance ID', value: instance.id },
                          { label: 'Image', value: instance.image },
                          { label: 'Uptime', value: instance.uptime },
                          { label: 'Zone', value: instance.zone },
                        ])
                      }
                    >
                      Open Console
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderStorage = () => (
    <section className="panel-stack">
      <header className="panel-header">
        <h2>Object Storage</h2>
        <button className="btn btn-primary" onClick={createContainer}>
          <Plus size={16} /> New Container
        </button>
      </header>
      <div className="cards-3up">
        {containers.map((item) => (
          <article key={item.id} className="service-card">
            <h3>{item.name}</h3>
            <p>{item.objects.toLocaleString()} objects</p>
            <p>{item.size}</p>
            <p>Region: {item.region}</p>
            <span className="tag">{item.policy}</span>
            <div className="action-row top-gap">
              <button className="chip-btn" onClick={() => uploadObjectToContainer(item.id)}>
                Upload Object
              </button>
              <button
                className="chip-btn"
                onClick={() =>
                  openConsoleWindow(`Storage: ${item.name}`, 'Container detail window with object and lifecycle controls.', [
                    { label: 'Objects', value: item.objects.toLocaleString() },
                    { label: 'Policy', value: item.policy },
                    { label: 'Size', value: item.size },
                  ])
                }
              >
                Open Window
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderBlock = () => (
    <section className="panel-stack">
      <header className="panel-header">
        <h2>Block Storage</h2>
        <button className="btn btn-primary" onClick={createVolume}>
          <Plus size={16} /> New Volume
        </button>
      </header>
      <div className="table-wrap">
        <table className="uws-table">
          <thead>
            <tr>
              <th>Volume</th>
              <th>Type</th>
              <th>Size (GB)</th>
              <th>IOPS</th>
              <th>Attached To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {volumes.map((vol) => (
              <tr key={vol.id}>
                <td>{vol.name}</td>
                <td>{vol.type}</td>
                <td>{vol.size}</td>
                <td>{vol.iops}</td>
                <td>{vol.attachedTo}</td>
                <td>
                  <span className={statusClass[vol.status]}>{vol.status}</span>
                </td>
                <td>
                  <div className="action-row">
                    <button className="chip-btn" onClick={() => attachVolumeToInstance(vol.id)} disabled={vol.attachedTo !== '-'}>
                      Attach
                    </button>
                    <button className="chip-btn" onClick={() => detachVolume(vol.id)} disabled={vol.attachedTo === '-'}>
                      Detach
                    </button>
                    <button
                      className="chip-btn"
                      onClick={() =>
                        openConsoleWindow(`Block: ${vol.name}`, 'Volume and snapshot controls (frontend console window).', [
                          { label: 'Type', value: vol.type },
                          { label: 'Size', value: `${vol.size} GB` },
                          { label: 'Attached', value: vol.attachedTo },
                        ])
                      }
                    >
                      Open Window
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderPlaceholder = (title, detail) => (
    <section className="panel-stack">
      <div className="hero-mini">
        <h2>{title}</h2>
        <p>{detail}</p>
      </div>
      <div className="cards-3up">
        <article className="service-card">
          <h3>Global Fabric Map</h3>
          <p>Visualize multi-zone links and egress routing in real time.</p>
          <div className="action-row top-gap">
            <button
              className="chip-btn"
              onClick={() =>
                openConsoleWindow('Network Fabric', 'Frontend network map and route table window.', [
                  { label: 'VPCs', value: '6' },
                  { label: 'Subnets', value: '28' },
                  { label: 'ACL Rules', value: '112' },
                ])
              }
            >
              Open Window
            </button>
          </div>
        </article>
        <article className="service-card">
          <h3>Policy Guardrails</h3>
          <p>Apply organization-wide controls with drift prevention.</p>
          <div className="action-row top-gap">
            <button className="chip-btn">Simulate Policy Check</button>
          </div>
        </article>
        <article className="service-card">
          <h3>Auto Healing</h3>
          <p>Runtime checks for service anomalies and instant response hooks.</p>
          <div className="action-row top-gap">
            <button className="chip-btn">Run Self-Heal</button>
          </div>
        </article>
      </div>

      <div className="cards-3up">
        <article className="service-card">
          <h3>Console Scheduler</h3>
          <p>Queue maintenance runs and operation windows across all services.</p>
          <div className="action-row top-gap">
            <button
              className="chip-btn"
              onClick={() =>
                openConsoleWindow('Operations Scheduler', 'Set operation windows for compute, storage, identity, and network.', [
                  { label: 'Pending Jobs', value: '5' },
                  { label: 'Current Window', value: '03:00 UTC' },
                  { label: 'Mode', value: 'Safe rollout' },
                ])
              }
            >
              Open Window
            </button>
          </div>
        </article>
        <article className="service-card">
          <h3>Service Timers</h3>
          <p>Track runtime timers for reboot cadence, backups, and policy sync.</p>
          <div className="action-row top-gap">
            <button className="chip-btn">
              <Timer size={14} /> View Timers
            </button>
          </div>
        </article>
        <article className="service-card">
          <h3>Refresh Orchestration</h3>
          <p>Run full-service refresh in frontend simulation mode.</p>
          <div className="action-row top-gap">
            <button className="chip-btn" onClick={() => addEvent('Executed all-service refresh workflow', 'info')}>
              <RefreshCw size={14} /> Refresh All
            </button>
          </div>
        </article>
      </div>
    </section>
  );

  return (
    <div className="uws-shell">
      <aside className={`uws-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-wrap">
          <div className="brand-icon">
            <Cloud size={20} />
          </div>
          <div>
            <h2>UWS Console</h2>
            <p>Unseens Web Services</p>
          </div>
        </div>

        <nav>
          {SERVICES.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link ${active ? 'active' : ''}`}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                <small>{item.helper}</small>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="uws-main">
        <header className="uws-topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-only" onClick={() => setSidebarOpen((prev) => !prev)}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="search-wrap">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search instances, zones, IDs..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <div className="topbar-right">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
            </button>
            <button className="icon-btn" aria-label="Notifications">
              <Bell size={16} />
            </button>
            <button className="org-badge">UWS · prod</button>
          </div>
        </header>

        <main className="uws-content">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'identity' && renderIdentity()}
          {activeView === 'compute' && renderCompute()}
          {activeView === 'storage' && renderStorage()}
          {activeView === 'block' && renderBlock()}
          {activeView === 'network' && renderPlaceholder('Network Fabric Console', 'Segment, secure, and route traffic intelligently across regions.')}
          {activeView === 'operations' && renderPlaceholder('Operations Runtime', 'Observe platform health with policy-aware alerts and runbooks.')}
        </main>
      </div>
      {renderConsoleWindow()}
    </div>
  );
}

export default NWSConsole;
