import { ConfigData } from '@shared/models'
import { contextBridge, ipcRenderer } from 'electron'

// contextIsolationが有効であることを確認
if (!process.contextIsolated) {
  throw new Error('contextIsolationを有効にしてください')
}

try {
  // メインプロセスのAPIをレンダラープロセスに公開
  contextBridge.exposeInMainWorld('context', {
    fetchJiraTickets: () => ipcRenderer.invoke('fetch-jira-tickets'),
    fetchJiraTicket: (key: string) => ipcRenderer.invoke('fetch-jira-ticket', key),
    updateTimespent: (key: string, time: number) =>
      ipcRenderer.invoke('update-timespent', key, time),
    saveData: (data: ConfigData) => ipcRenderer.invoke('save-data', data),
    readData: () => ipcRenderer.invoke('read-data')
  })
} catch (error) {
  // エラーが発生した場合にログを出力
  console.error(error)
}
