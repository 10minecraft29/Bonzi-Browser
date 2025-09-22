import React, { useState, useEffect } from 'react'

export default function App() {
  const [tabs, setTabs] = useState([{ id: 1, url: 'https://example.com' }])
  const [activeTab, setActiveTab] = useState(1)
  const [bookmarks, setBookmarks] = useState([])
  const [history, setHistory] = useState([])
  const [address, setAddress] = useState('https://example.com')

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bonzi-bookmarks') || '[]')
    const savedHistory = JSON.parse(localStorage.getItem('bonzi-history') || '[]')
    setBookmarks(savedBookmarks)
    setHistory(savedHistory)
  }, [])

  useEffect(() => {
    localStorage.setItem('bonzi-bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    localStorage.setItem('bonzi-history', JSON.stringify(history))
  }, [history])

  const navigate = (url) => {
    setTabs(tabs.map(tab => tab.id === activeTab ? { ...tab, url } : tab))
    setHistory([...history, url])
    setAddress(url)
  }

  const addTab = () => {
    const newId = Date.now()
    setTabs([...tabs, { id: newId, url: 'https://example.com' }])
    setActiveTab(newId)
    setAddress('https://example.com')
  }

  const closeTab = (id) => {
    const remaining = tabs.filter(tab => tab.id !== id)
    setTabs(remaining)
    if (activeTab === id && remaining.length > 0) {
      setActiveTab(remaining[0].id)
      setAddress(remaining[0].url)
    }
  }

  const toggleBookmark = (url) => {
    if (bookmarks.includes(url)) {
      setBookmarks(bookmarks.filter(b => b !== url))
    } else {
      setBookmarks([...bookmarks, url])
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bonzi Browser</h1>

      {/* Tabs */}
      <div className="flex space-x-2 mb-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setAddress(tab.url) }}
            className={`px-3 py-1 rounded ${activeTab === tab.id ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}>
            Tab {tab.id}
            <span onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }} className="ml-2 text-red-500 cursor-pointer">×</span>
          </button>
        ))}
        <button onClick={addTab} className="px-3 py-1 bg-green-500 text-white rounded">+</button>
      </div>

      {/* Address bar */}
      <div className="flex mb-4">
        <input value={address} onChange={e => setAddress(e.target.value)} className="flex-1 border p-2 rounded-l" />
        <button onClick={() => navigate(address)} className="bg-blue-500 text-white px-4 rounded-r">Go</button>
        <button onClick={() => toggleBookmark(address)} className="ml-2 bg-yellow-500 text-white px-3 rounded">★</button>
      </div>

      {/* Bookmarks */}
      <div className="mb-4">
        <h2 className="font-semibold">Bookmarks:</h2>
        <div className="flex flex-wrap gap-2">
          {bookmarks.map((b, i) => (
            <button key={i} onClick={() => navigate(b)} className="px-2 py-1 bg-purple-200 rounded">{b}</button>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="mb-4">
        <h2 className="font-semibold">History:</h2>
        <ul className="list-disc ml-5">
          {history.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>

      {/* Webpage */}
      <div className="border rounded overflow-hidden h-[500px]">
        <iframe src={tabs.find(tab => tab.id === activeTab)?.url} className="w-full h-full" title="webview"></iframe>
      </div>
    </div>
  )
}
