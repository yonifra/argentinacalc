import { useEffect, useState } from 'react' // Add useState and useEffect
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'

export default function App() {
  const [ars, setArs] = useState('') // State for ARS
  const [usd, setUsd] = useState('') // State for USD
  const [ils, setIls] = useState('') // State for ILS
  const [arsToBlueRate, setArsToBlueRate] = useState(0) // State for ARS to Blue rate
  const [exchangeRates, setExchangeRates] = useState({ ars: 0, usd: 0, ils: 0 }) // Store exchange rates

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/ARS'
        )
        const dolarBlue = await fetch('https://api.bluelytics.com.ar/v2/latest')
        const dolarBlueData = await dolarBlue.json()
        const data = await response.json()
        const arsToBlueRate =
          dolarBlueData.oficial.value_avg / dolarBlueData.blue.value_avg

        setArsToBlueRate(arsToBlueRate)
        const dolarBlueValue = dolarBlueData.blue.value_avg
        setArs(dolarBlueValue)
        setExchangeRates({
          ars: data.rates.ARS,
          usd: data.rates.USD,
          ils: data.rates.ILS,
        }) // Set exchange rates
        // Handle the fetched data as needed
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      }
    }

    fetchExchangeRates()
  }, []) // Fetch on component mount

  const handleArsChange = (value: string) => {
    const arsValue = parseFloat(value) || 0
    setArs(value)
    console.log(exchangeRates)
    setUsd((arsValue * arsToBlueRate * exchangeRates.usd).toFixed(2).toString()) // Convert ARS to USD and ensure it's a string
    setIls((arsValue * arsToBlueRate * exchangeRates.ils).toFixed(2).toString()) // Convert ARS to ILS and ensure it's a string
  }

  const handleUsdChange = (value: string) => {
    const usdValue = parseFloat(value) || 0
    setUsd(value)
    setArs((usdValue / exchangeRates.usd / arsToBlueRate).toFixed(2).toString()) // Convert USD to ARS and ensure it's a string
    setIls(
      ((usdValue / exchangeRates.usd) * exchangeRates.ils).toFixed(2).toString()
    )
  }

  const handleIlsChange = (value: string) => {
    const ilsValue = parseFloat(value) || 0
    setIls(value)
    setArs((ilsValue / exchangeRates.ils / arsToBlueRate).toFixed(2).toString()) // Convert ILS to ARS and ensure it's a string
    setUsd(
      ((ilsValue / exchangeRates.ils) * exchangeRates.usd).toFixed(2).toString()
    ) // Convert ILS to USD and ensure it's a string
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>ARS (Dollar Blue):</Text>
      <TextInput
        style={styles.input}
        value={ars}
        onChangeText={handleArsChange} // Update ARS state
      />
      <Text style={styles.text}>USD (US Dollar):</Text>
      <TextInput
        style={styles.input}
        value={usd}
        onChangeText={handleUsdChange} // Update USD state
      />
      <Text style={styles.text}>ILS (New Israeli Shekel):</Text>
      <TextInput
        style={styles.input}
        value={ils}
        onChangeText={handleIlsChange} // Update ILS state
      />
      <Button
        title="Reset"
        onPress={() => {
          setArs('')
          setUsd('')
          setIls('')
        }}
      />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    borderWidth: 1,
    fontSize: 18,
    borderColor: 'black',
    width: '50%',
    height: 40,
    borderRadius: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    margin: 10,
  },
})
