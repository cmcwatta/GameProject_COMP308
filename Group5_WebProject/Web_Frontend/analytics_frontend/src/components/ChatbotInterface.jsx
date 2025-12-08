import { useState } from 'react';

export default function ChatbotInterface({ data }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const exampleQuestions = [
    'What areas have the most flooding issues?',
    'Show me SLA compliance trends',
    'Which categories are overdue?',
    'What\'s the average resolution time?',
    'Top staff performers this month',
    'Predict next week\'s issue hotspots'
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Based on geolocation analysis, the downtown area has 45% of flooding issues. I recommend prioritizing preventive measures there.',
        'SLA compliance is at 87% this month, up 3% from last month. Most overdue issues are in the Pothole category.',
        'Currently 23 issues are overdue across all categories. Flooding (8 overdue), Safety Hazards (7 overdue), Potholes (5 overdue), Accessibility (3 overdue).',
        'Average resolution time is 4.2 days. Flooding issues average 2.1 days (fastest), Accessibility averages 6.5 days.',
        'Top performers: Jane Smith (18 resolved), Mike Chen (16 resolved), Lisa Park (15 resolved) this week.',
        'Predictive analysis suggests 12% increase in flooding reports next week due to forecasted heavy rain. Recommend pre-positioning staff.'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { type: 'bot', text: randomResponse }]);
      setLoading(false);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    setMessages(prev => [...prev, { type: 'user', text: question }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const responses = [
        'The downtown and waterfront districts show the highest concentration with 67 flooding issues combined.',
        'SLA compliance metrics show 89% overall with individual category performance: Flooding 95%, Pothole 81%, Streetlight 88%.',
        'Found 23 overdue items. Top overdue by category: Accessibility (8 days avg overdue), Pothole (5 days), Other (4 days).',
        'System average: 4.2 days. Category breakdown: Flooding 2.1d, Streetlight 3.5d, Pothole 4.8d, Safety 3.9d, Accessibility 6.5d.',
        'Current week leaders: Jane Smith 18 resolved, Mike Chen 16 resolved, Lisa Park 15 resolved, David Wilson 14 resolved.',
        'Weather forecast predicts heavy rain 40% probability. System predicts 15% increase in flooding reports. Current capacity: 12 staff on-call.'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { type: 'bot', text: randomResponse }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-md border border-white/80">
        <h3 className="text-lg font-bold text-gray-800 mb-2">🤖 Staff Analytics Assistant</h3>
        <p className="text-sm text-gray-600 mb-4">Ask me about issue hotspots, SLA compliance, staff performance, and trend predictions.</p>

        {/* Message History */}
        <div className="bg-gray-50 rounded-lg h-96 overflow-y-auto p-4 space-y-4 mb-4 border border-gray-200">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p className="text-center text-sm">
                👋 Ask a question below to get started<br/>
                or select a suggestion
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-4 py-2 rounded-lg max-w-sm text-sm ${
                    msg.type === 'user'
                      ? 'bg-cyan-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about issues, SLA, trends..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:shadow-lg disabled:opacity-50 transition-all"
          >
            Send
          </button>
        </div>

        {/* Example Questions */}
        {messages.length === 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Quick Questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {exampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-left text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-cyan-50 hover:border-cyan-500 transition-all text-gray-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
