import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Test, Message, CareTip, User } from '../types';
import testsData from '../data/tests.json';
import messagesData from '../data/messages.json';
import careTipsData from '../data/careTips.json';
import usersData from '../data/users.json';
import { ClipboardList, MessageSquare, LogOut, Heart, UserPlus } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'tests' | 'chat' | 'tips'>('tests');
  const [newMessage, setNewMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'Strength',
  });
  const [newTip, setNewTip] = useState({
    title: '',
    description: '',
    category: 'General Health',
  });

  const patientTests = testsData.tests.filter((test) => test.doctorId === user?.id);
  const messages = messagesData.messages.filter(
    (msg) => msg.senderId === user?.id || msg.receiverId === user?.id
  );
  const patientTips = careTipsData.careTips.filter(
    (tip) => tip.doctorId === user?.id
  );

  // Get all patients assigned to this doctor
  const assignedPatients = usersData.users.filter(
    (u) => u.role === 'patient' && u.assignedTo === user?.id
  );

  // Get messages for the selected patient
  const selectedPatientMessages = selectedPatient
    ? messages.filter(
        (msg) =>
          (msg.senderId === user?.id && msg.receiverId === selectedPatient) ||
          (msg.senderId === selectedPatient && msg.receiverId === user?.id)
      )
    : [];

  const handleNewTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }
    const test: Test = {
      id: `t${testsData.tests.length + 1}`,
      patientId: selectedPatient,
      doctorId: user?.id || '',
      ...newTest,
      completed: false,
    };
    testsData.tests.push(test);
    setNewTest({ title: '', description: '', dueDate: '', category: 'Strength' });
  };

  const handleNewTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }
    const tip: CareTip = {
      id: `ct${careTipsData.careTips.length + 1}`,
      ...newTip,
      doctorId: user?.id || '',
      patientId: selectedPatient,
      createdAt: new Date().toISOString(),
    };
    careTipsData.careTips.push(tip);
    setNewTip({ title: '', description: '', category: 'General Health' });
  };

  const handleNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPatient) return;

    const message: Message = {
      id: `msg${messagesData.messages.length + 1}`,
      senderId: user?.id || '',
      receiverId: selectedPatient,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    messagesData.messages.push(message);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Doctor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
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
            onClick={() => setActiveTab('tests')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'tests'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            Tests
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'tips'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className="w-5 h-5 mr-2" />
            Care Tips
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

        {activeTab === 'chat' ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex space-x-4">
              {/* Patient Selection Sidebar */}
              <div className="w-64 border-r pr-4">
                <h2 className="text-lg font-semibold mb-4">Patients</h2>
                <div className="space-y-2">
                  {assignedPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg ${
                        selectedPatient === patient.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {patient.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1">
                {selectedPatient ? (
                  <>
                    <div className="h-[500px] overflow-y-auto mb-4 space-y-4">
                      {selectedPatientMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
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
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Send
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="h-[500px] flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <UserPlus className="w-12 h-12 mx-auto mb-4" />
                      <p>Select a patient to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'tests' ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Assign New Test</h2>
            {!selectedPatient && (
              <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                Please select a patient from the chat tab to assign tests
              </div>
            )}
            <form onSubmit={handleNewTest} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newTest.title}
                  onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newTest.description}
                  onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={newTest.category}
                  onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Strength">Strength</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="Balance">Balance</option>
                  <option value="Mobility">Mobility</option>
                  <option value="Endurance">Endurance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={newTest.dueDate}
                  onChange={(e) => setNewTest({ ...newTest, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Assign Test
              </button>
            </form>

            <h2 className="text-lg font-semibold mb-4">Assigned Tests</h2>
            <div className="space-y-4">
              {patientTests.map((test) => (
                <div
                  key={test.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{test.title}</h3>
                      <p className="text-gray-600 mt-1">{test.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {test.category}
                    </span>
                  </div>
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
                  {test.results && (
                    <p className="mt-2 text-sm text-gray-700">
                      Results: {test.results}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Care Tip</h2>
            {!selectedPatient && (
              <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                Please select a patient from the chat tab to add care tips
              </div>
            )}
            <form onSubmit={handleNewTip} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newTip.title}
                  onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newTip.description}
                  onChange={(e) => setNewTip({ ...newTip, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={newTip.category}
                  onChange={(e) => setNewTip({ ...newTip, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="General Health">General Health</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Rest">Rest</option>
                  <option value="Recovery">Recovery</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Add Care Tip
              </button>
            </form>

            <h2 className="text-lg font-semibold mb-4">Care Tips</h2>
            <div className="space-y-4">
              {patientTips.map((tip) => (
                <div
                  key={tip.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{tip.title}</h3>
                      <p className="text-gray-600 mt-1">{tip.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tip.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Added: {new Date(tip.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};