import { CohereClient } from 'cohere-ai'

const cohere = new CohereClient({
  token: import.meta.env.VITE_COHERE_API_KEY as string,
})

interface FinancialData {
  income: any[]
  expenses: any[]
  budgets: any[]
  savings: any[]
}

export const generateFinancialSummary = async (data: FinancialData): Promise<string> => {
  try {
    const prompt = `
    anda berperan sebagai asisten keuangan pribadi yang membantu pengguna mengelola keuangan mereka dengan lebih baik kasih sapaan dahulu kayak Halo atau hai, terapkan bahasa yang santai tetapi sopan ya.
    Berdasarkan data keuangan berikut:
    - Total Income: ${data.income.reduce((sum, item) => sum + parseFloat(item.amount), 0)}
    - Total Expenses: ${data.expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0)}
    - Jumlah Budget Categories: ${data.budgets.length}
    - Jumlah Savings Goals: ${data.savings.length}
    
    Berikan analisis keuangan singkat dalam bahasa Indonesia dengan rekomendasi untuk pengelolaan keuangan yang lebih baik.
    `

    const response = await cohere.chat({
      model: 'command-r',
      message: prompt,
      maxTokens: 300,
      temperature: 0.7,
    })

    return response.text?.trim() || 'Tidak dapat menghasilkan summary'
  } catch (error) {
    console.error('Error generating summary:', error)
    throw new Error('Failed to generate AI summary')
  }
}

export const generateSavingsRecommendation = async (monthlyIncome: number, monthlyExpenses: number): Promise<string> => {
  try {
    const prompt = `
    Dengan pendapatan bulanan Rp ${monthlyIncome.toLocaleString('id-ID')} dan pengeluaran Rp ${monthlyExpenses.toLocaleString('id-ID')}, 
    berikan rekomendasi tabungan yang praktis dan realistis dalam bahasa Indonesia juga.
    `

    const response = await cohere.chat({
      model: 'command-r',
      message: prompt,
      maxTokens: 200,
      temperature: 0.7,
    })

    return response.text?.trim() || 'Tidak dapat menghasilkan rekomendasi'
  } catch (error) {
    console.error('Error generating recommendation:', error)
    throw new Error('Failed to generate savings recommendation')
  }
}