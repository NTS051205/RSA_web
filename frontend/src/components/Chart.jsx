import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

function Chart({ performanceData }) {
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'algorithm' | 'chat'
  
  // Phân loại dữ liệu theo loại hoạt động
  const algorithmData = performanceData.filter(item => 
    ['Generate Key', 'Encrypt', 'Decrypt'].includes(item.operation)
  );
  
  const chatData = performanceData.filter(item => 
    ['Generate Key (Alice)', 'Generate Key (Bob)', 'Encrypt (Chat)', 'Decrypt (Chat)'].includes(item.operation)
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
  const overviewData = performanceData.map((item, index) => ({
    name: `${index + 1}`,
    'Thời gian (s)': parseFloat(item.duration || 0),
    operation: item.operation,
    type: ['Generate Key (Alice)', 'Generate Key (Bob)', 'Encrypt (Chat)', 'Decrypt (Chat)'].includes(item.operation) ? 'Chat' : 'Algorithm'
  }));
  
  // Chuẩn bị dữ liệu cho biểu đồ theo loại
  const algorithmChartData = algorithmData.map((item, index) => ({
    name: `${getOperationName(item.operation)} ${index + 1}`,
    'Thời gian (s)': parseFloat(item.duration || 0),
    operation: item.operation
  }));
  
  const chatChartData = chatData.map((item, index) => ({
    name: `${getOperationName(item.operation)} ${index + 1}`,
    'Thời gian (s)': parseFloat(item.duration || 0),
    operation: item.operation
  }));
  
  // Tính toán thống kê
  const getStats = (data) => {
    if (data.length === 0) return { avg: 0, max: 0, min: 0, total: 0, count: 0 };
    const times = data.map(item => parseFloat(item.duration || 0));
    return {
      avg: (times.reduce((a, b) => a + b, 0) / times.length).toFixed(3),
      max: Math.max(...times).toFixed(3),
      min: Math.min(...times).toFixed(3),
      total: times.reduce((a, b) => a + b, 0).toFixed(3),
      count: data.length
    };
  };
  
  const algorithmStats = getStats(algorithmData);
  const chatStats = getStats(chatData);
  const overallStats = getStats(performanceData);

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
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'overview' ? '#667eea' : '#f7fafc',
              color: viewMode === 'overview' ? 'white' : '#4a5568',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📈 Tổng quan
          </button>
          <button
            onClick={() => setViewMode('algorithm')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'algorithm' ? '#667eea' : '#f7fafc',
              color: viewMode === 'algorithm' ? 'white' : '#4a5568',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🔧 Trình bày giải thuật
          </button>
          <button
            onClick={() => setViewMode('chat')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'chat' ? '#667eea' : '#f7fafc',
              color: viewMode === 'chat' ? 'white' : '#4a5568',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            💬 Chat RSA
          </button>
        </div>

        {performanceData.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#718096'
          }}>
            <p style={{ fontSize: '1.1rem' }}>Chưa có dữ liệu hiệu suất</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
              Thực hiện các thao tác RSA để xem biểu đồ
            </p>
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

            {/* Statistics */}
            <div style={{ marginTop: '24px', padding: '20px', background: '#f7fafc', borderRadius: '12px' }}>
              <h4 style={{ marginBottom: '16px', color: '#2d3748' }}>📈 Thống kê chi tiết</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {/* Overall Stats */}
                <div style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ color: '#667eea', marginBottom: '12px' }}>📊 Tổng quan</h5>
                  <div style={{ fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Số thao tác:</span>
                      <span style={{ fontWeight: 600 }}>{overallStats.count}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Trung bình:</span>
                      <span style={{ fontWeight: 600 }}>{overallStats.avg}s</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Tổng thời gian:</span>
                      <span style={{ fontWeight: 600 }}>{overallStats.total}s</span>
                    </div>
                  </div>
                </div>

                {/* Algorithm Stats */}
                <div style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ color: '#10b981', marginBottom: '12px' }}>🔧 Giải thuật</h5>
                  <div style={{ fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Số thao tác:</span>
                      <span style={{ fontWeight: 600 }}>{algorithmStats.count}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Trung bình:</span>
                      <span style={{ fontWeight: 600 }}>{algorithmStats.avg}s</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Tổng thời gian:</span>
                      <span style={{ fontWeight: 600 }}>{algorithmStats.total}s</span>
                    </div>
                  </div>
                </div>

                {/* Chat Stats */}
                <div style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ color: '#f59e0b', marginBottom: '12px' }}>💬 Chat</h5>
                  <div style={{ fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Số thao tác:</span>
                      <span style={{ fontWeight: 600 }}>{chatStats.count}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Trung bình:</span>
                      <span style={{ fontWeight: 600 }}>{chatStats.avg}s</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Tổng thời gian:</span>
                      <span style={{ fontWeight: 600 }}>{chatStats.total}s</span>
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

export default Chart;
