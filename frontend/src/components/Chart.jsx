import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Chart({ performanceData }) {
  // Prepare data for chart
  const chartData = performanceData.map((item, index) => ({
    name: `Thao tác ${index + 1}`,
    'Thời gian (giây)': parseFloat(item.duration || 0),
  }));

  return (
    <div className="card">
      <h2>📊 Biểu đồ Thời gian Hoạt động</h2>
      <div className="card-content">
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
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#718096"
                  fontSize={12}
                />
                <YAxis 
                  label={{ value: 'Thời gian (giây)', angle: -90, position: 'insideLeft' }}
                  stroke="#718096"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Thời gian (giây)" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 5 }}
                  activeDot={{ r: 8 }}
                  name="Thời gian"
                />
              </LineChart>
            </ResponsiveContainer>

            <div style={{ marginTop: '24px', padding: '20px', background: '#f7fafc', borderRadius: '12px' }}>
              <h4 style={{ marginBottom: '16px', color: '#2d3748' }}>📈 Thống kê</h4>
              <div className="key-metrics">
                {(() => {
                  const times = performanceData.map(item => parseFloat(item.duration || 0));
                  const avgTime = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(3);
                  const maxTime = Math.max(...times).toFixed(3);
                  const minTime = Math.min(...times).toFixed(3);
                  const totalTime = times.reduce((a, b) => a + b, 0).toFixed(3);

                  return (
                    <>
                      <div className="metric">
                        <div className="metric-label">Trung bình</div>
                        <div className="metric-value">{avgTime}s</div>
                      </div>
                      <div className="metric">
                        <div className="metric-label">Tối đa</div>
                        <div className="metric-value">{maxTime}s</div>
                      </div>
                      <div className="metric">
                        <div className="metric-label">Tối thiểu</div>
                        <div className="metric-value">{minTime}s</div>
                      </div>
                      <div className="metric">
                        <div className="metric-label">Tổng thời gian</div>
                        <div className="metric-value">{totalTime}s</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#718096' }}>
              <p><strong>Ghi chú:</strong></p>
              <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                <li>Biểu đồ hiển thị thời gian thực hiện của mỗi thao tác</li>
                <li>X-axis: Số thứ tự thao tác</li>
                <li>Y-axis: Thời gian (giây)</li>
                <li>Bạn có thể hover vào các điểm để xem chi tiết</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chart;
