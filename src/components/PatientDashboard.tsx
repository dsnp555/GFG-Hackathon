import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import milestonesData from '../data/milestones.json';
import careTipsData from '../data/careTips.json';
import testsData from '../data/tests.json';
import messagesData from '../data/messages.json';
import { CheckCircle2, MessageSquare, ClipboardList, LogOut, Award } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'progress' | 'chat'>('progress');
  const [newMessage, setNewMessage] = useState('');

  const patientMilestones = milestonesData.milestones.filter(
    (milestone) => milestone.patientId === user?.id
  );
  const patientTests = testsData.tests.filter(
    (test) => test.patientId === user?.id
  );
  const messages = messagesData.messages.filter(
    (msg) => msg.senderId === user?.id || msg.receiverId === user?.id
  );
  const careTips = careTipsData.careTips.filter(
    (tip) => tip.patientId === user?.id
  );

  const totalPoints = patientMilestones.reduce((acc, milestone) => 
    milestone.completed ? acc + milestone.points : acc, 0
  );

  const handleNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: `msg${messagesData.messages.length + 1}`,
      senderId: user?.id || '',
      receiverId: user?.assignedTo || '',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    messagesData.messages.push(message);
    setNewMessage('');
  };

  const toggleMilestone = (milestoneId: string) => {
    const milestone = milestonesData.milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      milestone.completed = !milestone.completed;
    }
  };

  const calculateProgress = () => {
    const completed = patientMilestones.filter((m) => m.completed).length;
    return (completed / patientMilestones.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Patient Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">{totalPoints} Points</span>
              </div>
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'progress'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            Progress
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Chat
          </button>
        </div>

        {activeTab === 'progress' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Recovery Progress</h2>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Overall Progress</span>
                    <span>{Math.round(calculateProgress())}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">
                      {patientMilestones.filter(m => m.completed).length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {patientMilestones.filter(m => !m.completed).length}
                    </div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Your Milestones</h2>
                <div className="space-y-4">
                  {patientMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{milestone.title}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {milestone.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </p>
                          <span className="text-sm font-medium text-indigo-600">
                            {milestone.points} pts
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMilestone(milestone.id)}
                        className={`ml-4 p-2 rounded-full ${
                          milestone.completed
                            ? 'text-green-600 bg-green-100'
                            : 'text-gray-400 bg-gray-200'
                        }`}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Assigned Tests</h2>
                <div className="space-y-4">
                  {patientTests.map((test) => (
                    <div
                      key={test.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{test.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {test.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{test.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Due: {new Date(test.dueDate).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            test.completed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {test.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2  className="text-lg font-semibold mb-4">Care Tips</h2>
                <div className="space-y-4">
                  {careTips.map((tip) => (
                    <div
                      key={tip.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{tip.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tip.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{tip.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Added: {new Date(tip.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.senderId === user?.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleNewMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};