import React, { useEffect, useMemo, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

function Chart({ performanceData, viewMode = 'overview', setViewMode }) {
  // Debug logging
  console.log('Chart render - viewMode:', viewMode, 'performanceData length:', performanceData?.length);
  
  // Track viewMode changes
  useEffect(() => {
    console.log('Chart viewMode changed to:', viewMode);
  }, [viewMode]);
  
  // Phân loại dữ liệu theo loại hoạt động (memoized để tránh re-computation)
  const algorithmData = useMemo(() => 
    (performanceData || []).filter(item => 
      ['Generate Key', 'Encrypt', 'Decrypt'].includes(item.operation)
    ), [performanceData]
  );
  
  const chatData = useMemo(() => 
    (performanceData || []).filter(item => 
      ['Generate Key (Alice)', 'Generate Key (Bob)', 'Encrypt (Chat)', 'Decrypt (Chat)'].includes(item.operation)
    ), [performanceData]
  );
  
  // Hàm chuyển đổi tên operation thành tên dễ hiểu
  const getOperationName = (operation) => {
    const nameMap = {
      'Generate Key': 'Sinh khóa',
      'Encrypt': 'Mã hóa',
      'Decrypt': 'Giải mã',
      'Generate Key (Alice)': 'Alice sinh khóa',
      'Generate Key (Bob)': 'Bob sinh khóa',
      'Encrypt (Chat)': 'Mã hóa tin nhắn',
      'Decrypt (Chat)': 'Giải mã tin nhắn'
    };
    return nameMap[operation] || operation;
  };
  
  // Chuẩn bị dữ liệu cho biểu đồ tổng quan
  const overviewData = (performanceData || []).map((item, index) => ({
    name: `${getOperationName(item.operation)} ${index + 1}`,
    'Thời gian (s)': parseFloat(item.duration || 0) || 0,
    operation: item.operation,
    type: ['Generate Key (Alice)', 'Generate Key (Bob)', 'Encrypt (Chat)', 'Decrypt (Chat)'].includes(item.operation) ? 'Chat' : 'Algorithm'
  }));
  
  // Chuẩn bị dữ liệu cho biểu đồ theo loại
  const algorithmChartData = algorithmData.map((item, index) => ({
    name: `${getOperationName(item.operation)} ${index + 1}`,
    'Thời gian (s)': parseFloat(item.duration || 0) || 0,
    operation: item.operation
  }));
  
  const chatChartData = chatData.map((item, index) => ({
    name: `${getOperationName(item.operation)} ${index + 1}`,
    'Thời gian (s)': parseFloat(item.duration || 0) || 0,
    operation: item.operation
  }));
  
  // Tính toán thống kê
  const getStats = (data) => {
    if (data.length === 0) return { avg: 0, max: 0, min: 0, total: 0, count: 0 };
    const times = data.map(item => parseFloat(item.duration || 0)).filter(time => !isNaN(time));
    if (times.length === 0) return { avg: 0, max: 0, min: 0, total: 0, count: 0 };
    return {
      avg: (times.reduce((a, b) => a + b, 0) / times.length).toFixed(3),
      max: Math.max(...times).toFixed(3),
      min: Math.min(...times).toFixed(3),
      total: times.reduce((a, b) => a + b, 0).toFixed(3),
      count: times.length
    };
  };
  
  const algorithmStats = getStats(algorithmData);
  const chatStats = getStats(chatData);
  const overallStats = getStats(performanceData || []);

  return (
    <div className="card">
      <h2>📊 Biểu đồ Thời gian Hoạt động</h2>
      <div className="card-content">
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '24px',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '12px'
        }}>
          <button
            onClick={() => setViewMode('overview')}
            disabled={(performanceData || []).length === 0}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'overview' ? '#667eea' : '#f7fafc',
              color: viewMode === 'overview' ? 'white' : '#4a5568',
              fontWeight: 600,
              cursor: (performanceData || []).length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: (performanceData || []).length === 0 ? 0.5 : 1
            }}
          >
            📈 Tổng quan
          </button>
          <button
            onClick={() => {
              console.log('Algorithm button clicked, setting viewMode to algorithm');
              setViewMode('algorithm');
            }}
            disabled={(performanceData || []).length === 0}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'algorithm' ? '#667eea' : '#f7fafc',
              color: viewMode === 'algorithm' ? 'white' : '#4a5568',
              fontWeight: 600,
              cursor: (performanceData || []).length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: (performanceData || []).length === 0 ? 0.5 : 1
            }}
          >
            🔧 Trình bày giải thuật
          </button>
          <button
            onClick={() => setViewMode('chat')}
            disabled={(performanceData || []).length === 0}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'chat' ? '#667eea' : '#f7fafc',
              color: viewMode === 'chat' ? 'white' : '#4a5568',
              fontWeight: 600,
              cursor: (performanceData || []).length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: (performanceData || []).length === 0 ? 0.5 : 1
            }}
          >
            💬 Chat RSA
          </button>
        </div>

        {(performanceData || []).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3 className="empty-title">Chưa có dữ liệu hiệu suất</h3>
            <p className="empty-description">
              Để xem biểu đồ và thống kê, hãy thực hiện các thao tác RSA sau:
            </p>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-icon">🔑</div>
                <h4 className="step-title">1. Sinh khóa</h4>
                <p className="step-description">Chuyển sang tab "RSA cơ bản" và sinh khóa RSA</p>
              </div>
              <div className="step-card">
                <div className="step-icon">🔒</div>
                <h4 className="step-title">2. Mã hóa</h4>
                <p className="step-description">Nhập tin nhắn và thực hiện mã hóa</p>
              </div>
              <div className="step-card">
                <div className="step-icon">🔓</div>
                <h4 className="step-title">3. Giải mã</h4>
                <p className="step-description">Thực hiện giải mã để hoàn thành chu trình</p>
              </div>
            </div>
            <div className="tip-box">
              <strong>💡 Mẹo:</strong> Sau khi thực hiện các thao tác trên, quay lại tab này để xem biểu đồ và thống kê chi tiết!
            </div>
          </div>
        ) : (
          <>
            {/* Overview Chart */}
            {viewMode === 'overview' && (
              <div>
                <h3 style={{ marginBottom: '16px', color: '#2d3748' }}>📊 Tổng quan tất cả hoạt động</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={overviewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#718096" fontSize={12} />
                    <YAxis label={{ value: 'Thời gian (s)', angle: -90, position: 'insideLeft' }} stroke="#718096" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name, props) => [
                        `${value}s`, 
                        `${props.payload.type === 'Chat' ? '💬 Chat RSA' : '🔧 Trình bày giải thuật'}`
                      ]}
                    />
                    <Bar 
                      dataKey="Thời gian (s)" 
                      fill="#667eea"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Algorithm Chart */}
            {viewMode === 'algorithm' && (
              <div>
                <h3 style={{ marginBottom: '16px', color: '#2d3748' }}>🔧 Trình bày giải thuật RSA</h3>
                {algorithmData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                    <p>Chưa có dữ liệu từ phần "Trình bày giải thuật"</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                      Hãy thử sinh khóa, mã hóa và giải mã trong tab "RSA cơ bản"
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={algorithmChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#718096" fontSize={12} />
                      <YAxis label={{ value: 'Thời gian (s)', angle: -90, position: 'insideLeft' }} stroke="#718096" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Thời gian (s)" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}

            {/* Chat Chart */}
            {viewMode === 'chat' && (
              <div>
                <h3 style={{ marginBottom: '16px', color: '#2d3748' }}>💬 Chat RSA (Alice & Bob)</h3>
                {chatData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                    <p>Chưa có dữ liệu từ phần "Chat RSA"</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                      Hãy thử sinh khóa và gửi tin nhắn trong tab "Nâng cao"
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chatChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#718096" fontSize={12} />
                      <YAxis label={{ value: 'Thời gian (s)', angle: -90, position: 'insideLeft' }} stroke="#718096" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Thời gian (s)" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}

            {/* Statistics - Always show */}
            <div className="card" style={{ marginTop: '24px' }}>
              <h2>📈 Thống kê chi tiết</h2>
              <div className="card-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {/* Overall Stats */}
                  <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                    <h3 style={{ color: '#667eea', marginBottom: '16px', fontSize: '1.1rem' }}>📊 Tổng quan</h3>
                    <div style={{ fontSize: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                        <span>Số thao tác:</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{overallStats.count}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                        <span>Trung bình:</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{overallStats.avg}s</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px 0' }}>
                        <span>Tổng thời gian:</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{overallStats.total}s</span>
                      </div>
                    </div>
                  </div>

                  {/* Algorithm Stats */}
                  <div style={{ padding: '20px', background: '#f0fdf4', borderRadius: '12px', border: '2px solid #bbf7d0' }}>
                    <h3 style={{ color: '#10b981', marginBottom: '16px', fontSize: '1.1rem' }}>🔧 Giải thuật</h3>
                    <div style={{ fontSize: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px 0', borderBottom: '1px solid #bbf7d0' }}>
                        <span>Số thao tác:</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{algorithmStats.count}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px 0', borderBottom: '1px solid #bbf7d0' }}>
                        <span>Trung bình:</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{algorithmStats.avg}s</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px 0' }}>
                        <span>Tổng thời gian:</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{algorithmStats.total}s</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Stats */}
                  <div style={{ padding: '20px', background: '#fffbeb', borderRadius: '12px', border: '2px solid #fed7aa' }}>
                    <h3 style={{ color: '#f59e0b', marginBottom: '16px', fontSize: '1.1rem' }}>💬 Chat</h3>
                    <div style={{ fontSize: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px 0', borderBottom: '1px solid #fed7aa' }}>
                        <span>Số thao tác:</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{chatStats.count}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px 0', borderBottom: '1px solid #fed7aa' }}>
                        <span>Trung bình:</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{chatStats.avg}s</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '8px 0' }}>
                        <span>Tổng thời gian:</span>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{chatStats.total}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#718096' }}>
              <p><strong>Ghi chú:</strong></p>
              <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                <li><strong>Tổng quan:</strong> Hiển thị tất cả hoạt động theo thời gian</li>
                <li><strong>Giải thuật:</strong> Thống kê từ tab "RSA cơ bản" (Generate Key, Encrypt, Decrypt)</li>
                <li><strong>Chat:</strong> Thống kê từ tab "Nâng cao" (Alice & Bob operations)</li>
                <li>Hover vào các điểm để xem chi tiết từng thao tác</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(Chart);
