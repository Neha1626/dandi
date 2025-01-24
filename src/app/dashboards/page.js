'use client';
import { useState, useEffect } from 'react';
import { ClipboardIcon, CheckIcon, TrashIcon, KeyIcon, EyeIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import Notification from '../components/Notification';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showNewKey, setShowNewKey] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editName, setEditName] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/keys');
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      const data = await response.json();
      setApiKeys(data);
    } catch (err) {
      setError('Failed to load API keys');
      console.error('Error fetching API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      showNotification('Please enter a key name', 'error');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName })
      });

      if (!response.ok) {
        throw new Error('Failed to create API key');
      }
      
      const newKey = await response.json();
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName('');
      setShowNewKey(newKey.value);
      showNotification('API key created successfully');
    } catch (err) {
      showNotification('Failed to create API key', 'error');
      console.error('Error creating API key:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/keys/${id}`, { 
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      setApiKeys(apiKeys.filter(key => key.id !== id));
      showNotification('API key deleted successfully');
    } catch (err) {
      showNotification('Failed to delete API key', 'error');
      console.error('Error deleting API key:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(key);
      showNotification('API key copied to clipboard');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      showNotification('Failed to copy to clipboard', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const editApiKey = async (id) => {
    if (!editName.trim()) {
      showNotification('Please enter a key name', 'error');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName })
      });

      if (!response.ok) {
        throw new Error('Failed to update API key');
      }

      const updatedKey = await response.json();
      setApiKeys(apiKeys.map(key => key.id === id ? updatedKey : key));
      setEditingKey(null);
      setEditName('');
      showNotification('API key updated successfully');
    } catch (err) {
      showNotification('Failed to update API key', 'error');
      console.error('Error updating API key:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mb-16">
        <h1 className="text-4xl font-bold mb-2">Overview</h1>
        <div className="bg-gradient-to-r from-rose-100 via-purple-100 to-blue-100 dark:from-rose-900/20 dark:via-purple-900/20 dark:to-blue-900/20 rounded-3xl p-8">
          <div className="mb-8">
            <span className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">CURRENT PLAN</span>
            <h2 className="text-4xl font-bold mt-2">Researcher</h2>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-medium">API Usage</span>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">API Usage Info</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <span className="text-lg">0 / 1,000 Credits</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <span>Pay as you go</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">API Keys</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
          >
            <KeyIcon className="w-5 h-5" />
            <span>Generate New API Key</span>
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          The key is used to authenticate your requests to the Research API. To learn more, see the{' '}
          <a href="#" className="underline">documentation</a> page.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {showNewKey && (
        <div className="mb-8 p-6 bg-[#ecfdf5] dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-emerald-900 dark:text-emerald-100">New API Key Generated</h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
            Make sure to copy your API key now. You won't be able to see it again!
          </p>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <code className="flex-1 font-mono text-sm text-gray-900 dark:text-gray-100">{showNewKey}</code>
            <button
              onClick={() => copyToClipboard(showNewKey)}
              className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
            >
              {copiedKey === showNewKey ? (
                <CheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ClipboardIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New API Key</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Key Name
                </label>
                <input
                  id="keyName"
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter key name"
                  className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white dark:text-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    createApiKey();
                    setShowCreateModal(false);
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-[1fr_120px_1fr_100px] gap-4 p-4 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
          <div>NAME</div>
          <div>USAGE</div>
          <div>KEY</div>
          <div>OPTIONS</div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {apiKeys.map((key) => (
            <div key={key.id} className="grid grid-cols-[1fr_120px_1fr_100px] gap-4 p-4 items-center">
              <div className="font-medium">{key.name}</div>
              <div className="text-gray-500">{key.usage}</div>
              <div className="font-mono text-sm text-gray-500">
                {key.value.slice(0, 12)}{'•'.repeat(30)}{key.value.slice(-5)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(key.value)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Copy API Key"
                >
                  <ClipboardIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setEditingKey(key.id);
                    setEditName(key.name);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Edit API Key"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="View API Key"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteApiKey(key.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Delete API Key"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {apiKeys.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">
              No API keys found. Create one to get started.
            </div>
          )}
          {loading && (
            <div className="p-8 text-center text-gray-500">
              Loading...
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit API Key</h3>
              <button
                onClick={() => setEditingKey(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="editKeyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Key Name
                </label>
                <input
                  id="editKeyName"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter key name"
                  className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white dark:text-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingKey(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editApiKey(editingKey)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 